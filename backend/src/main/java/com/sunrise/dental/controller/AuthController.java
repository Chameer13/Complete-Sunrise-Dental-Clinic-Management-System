package com.sunrise.dental.controller;

import com.sunrise.dental.dto.AuthResponse;
import com.sunrise.dental.dto.LoginRequest;
import com.sunrise.dental.dto.RegisterRequest;
import com.sunrise.dental.dto.ResetDtos.ForgotRequest;
import com.sunrise.dental.dto.ResetDtos.ResetRequest;
import com.sunrise.dental.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

 private final AuthService authService;

 public AuthController(AuthService authService) {
  this.authService = authService;
 }


 // =========================================================
 // REGISTER
 // =========================================================

 @PostMapping("/register")
 public ResponseEntity<?> register(
         @Valid @RequestBody RegisterRequest request
 ) {

  authService.register(request);

  return ResponseEntity
          .status(201)
          .body(
                  Map.of(
                          "success",
                          true,
                          "message",
                          "Registration successful. You can now sign in."
                  )
          );
 }


 // =========================================================
 // LOGIN
 // =========================================================

 @PostMapping("/login")
 public AuthResponse login(
         @Valid @RequestBody LoginRequest request
 ) {

  return authService.login(request);
 }


 // =========================================================
 // FORGOT PASSWORD
 // =========================================================

 @PostMapping("/forgot-password")
 public ResponseEntity<?> forgotPassword(
         @Valid @RequestBody ForgotRequest request
 ) {

  authService.forgot(
          request.email()
  );

  return ResponseEntity.ok(
          Map.of(
                  "success",
                  true,
                  "message",
                  "If the email is registered, a password reset OTP has been sent."
          )
  );
 }


 // =========================================================
 // RESET PASSWORD
 // =========================================================

 @PostMapping("/reset-password")
 public ResponseEntity<?> resetPassword(
         @Valid @RequestBody ResetRequest request
 ) {

  authService.reset(request);

  return ResponseEntity.ok(
          Map.of(
                  "success",
                  true,
                  "message",
                  "Password reset successfully."
          )
  );
 }
}