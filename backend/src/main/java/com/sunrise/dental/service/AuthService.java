package com.sunrise.dental.service;

import com.sunrise.dental.dto.AuthResponse;
import com.sunrise.dental.dto.LoginRequest;
import com.sunrise.dental.dto.RegisterRequest;
import com.sunrise.dental.dto.ResetDtos.ResetRequest;
import com.sunrise.dental.entity.PasswordResetOtp;
import com.sunrise.dental.entity.User;
import com.sunrise.dental.repository.EmailVerificationTokenRepository;
import com.sunrise.dental.repository.PatientRepository;
import com.sunrise.dental.repository.PasswordResetOtpRepository;
import com.sunrise.dental.repository.UserRepository;
import com.sunrise.dental.security.JwtService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

 private final UserRepository users;
 private final PatientRepository patients;
 private final EmailVerificationTokenRepository tokens;
 private final PasswordResetOtpRepository otps;
 private final PasswordEncoder enc;
 private final JwtService jwt;
 private final MailService mail;

 @Value("${app.frontend-url:http://localhost:5173}")
 private String frontendUrl;

 public AuthService(
         UserRepository users,
         PatientRepository patients,
         EmailVerificationTokenRepository tokens,
         PasswordResetOtpRepository otps,
         PasswordEncoder enc,
         JwtService jwt,
         MailService mail
 ) {
  this.users = users;
  this.patients = patients;
  this.tokens = tokens;
  this.otps = otps;
  this.enc = enc;
  this.jwt = jwt;
  this.mail = mail;
 }

 // =========================================================
 // REGISTER
 // =========================================================

 public void register(RegisterRequest request) {

  String username = request.username().trim();
  String email = request.email().trim().toLowerCase();

  if (users.existsByUsernameIgnoreCase(username)) {
   throw new IllegalArgumentException(
           "Username is already in use."
   );
  }

  if (users.existsByEmailIgnoreCase(email)) {
   throw new IllegalArgumentException(
           "Email is already registered."
   );
  }

  User user = new User();

  user.setFullName(
          request.fullName().trim()
  );

  user.setUsername(username);

  user.setEmail(email);

  user.setPasswordHash(
          enc.encode(request.password())
  );

  user.setRole(request.role());

  user.setActive(true);

  /*
   * Email-link verification has been removed.
   * Every successfully registered account is immediately
   * allowed to log in.
   */
  user.setEmailVerified(true);

  users.save(user);
 }


 // =========================================================
 // LOGIN
 // =========================================================

 public AuthResponse login(LoginRequest request) {

  User user =
          users.findByUsernameIgnoreCase(
                  request.username().trim()
          ).orElseThrow(() ->
                  new IllegalArgumentException(
                          "Invalid username or password."
                  )
          );

  if (!enc.matches(
          request.password(),
          user.getPasswordHash()
  )) {
   throw new IllegalArgumentException(
           "Invalid username or password."
   );
  }

  if (!user.isActive()) {
   throw new IllegalArgumentException(
           "This account is inactive."
   );
  }

  /*
   * No email verification check here.
   */

  return new AuthResponse(
          true,
          "Login successful",
          jwt.generate(
                  user.getId(),
                  user.getUsername(),
                  user.getRole().name()
          ),
          user.getId(),
          user.getFullName(),
          user.getUsername(),
          user.getEmail(),
          user.getRole(),
          true
  );
 }


 // =========================================================
 // FORGOT PASSWORD
 // =========================================================

 public void forgot(String email) {

  String normalizedEmail =
          email.trim().toLowerCase();

  /*
   * Deliberately do not reveal whether an email exists.
   */

  users.findByEmailIgnoreCase(
          normalizedEmail
  ).ifPresent(user -> {

   /*
    * Invalidate previous unused OTP.
    */
   otps.findTopByUserIdAndUsedFalseOrderByIdDesc(
           user.getId()
   ).ifPresent(oldOtp -> {

    oldOtp.setUsed(true);

    otps.save(oldOtp);
   });


   /*
    * Generate six-digit OTP.
    */
   String generatedOtp =
           String.format(
                   "%06d",
                   new Random().nextInt(1_000_000)
           );


   PasswordResetOtp otp =
           new PasswordResetOtp();

   otp.setUser(user);

   otp.setOtp(generatedOtp);

   otp.setExpiresAt(
           LocalDateTime.now()
                   .plusMinutes(10)
   );

   otp.setAttempts(0);

   otp.setUsed(false);

   otps.save(otp);


   /*
    * Send OTP by email.
    */
   mail.send(
           user.getEmail(),
           "Sunrise Dental - Password Reset OTP",
           """
           Sunrise Dental Clinic

           Your password reset OTP is:

           %s

           This OTP expires in 10 minutes.

           If you did not request a password reset,
           please ignore this email.
           """.formatted(generatedOtp)
   );
  });
 }


 // =========================================================
 // RESET PASSWORD
 // =========================================================

 public void reset(ResetRequest request) {

  String email =
          request.email()
                  .trim()
                  .toLowerCase();


  User user =
          users.findByEmailIgnoreCase(
                  email
          ).orElseThrow(() ->
                  new IllegalArgumentException(
                          "Invalid email or OTP."
                  )
          );


  PasswordResetOtp otp =
          otps.findTopByUserIdAndUsedFalseOrderByIdDesc(
                  user.getId()
          ).orElseThrow(() ->
                  new IllegalArgumentException(
                          "Invalid email or OTP."
                  )
          );


  /*
   * Check expiry.
   */
  if (otp.getExpiresAt()
          .isBefore(LocalDateTime.now())) {

   otp.setUsed(true);

   otps.save(otp);

   throw new IllegalArgumentException(
           "OTP has expired. Please request a new OTP."
   );
  }


  /*
   * Maximum five attempts.
   */
  if (otp.getAttempts() >= 5) {

   otp.setUsed(true);

   otps.save(otp);

   throw new IllegalArgumentException(
           "Too many incorrect OTP attempts. Please request a new OTP."
   );
  }


  /*
   * Check OTP.
   */
  if (!otp.getOtp().equals(request.otp())) {

   otp.setAttempts(
           otp.getAttempts() + 1
   );

   otps.save(otp);

   throw new IllegalArgumentException(
           "Invalid OTP."
   );
  }


  /*
   * Correct OTP.
   * Change password.
   */
  user.setPasswordHash(
          enc.encode(
                  request.newPassword()
          )
  );

  users.save(user);


  /*
   * OTP can only be used once.
   */
  otp.setUsed(true);

  otps.save(otp);
 }
}