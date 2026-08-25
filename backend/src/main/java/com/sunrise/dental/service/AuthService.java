package com.sunrise.dental.service;
import com.sunrise.dental.dto.*; import com.sunrise.dental.entity.User; import com.sunrise.dental.repository.UserRepository; import com.sunrise.dental.security.JwtService; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class AuthService {
 private final UserRepository repo; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository repo,PasswordEncoder encoder,JwtService jwt){this.repo=repo;this.encoder=encoder;this.jwt=jwt;}
 public void register(RegisterRequest r){
  String username=r.username().trim(); String email=r.email().trim().toLowerCase();
  if(repo.existsByUsernameIgnoreCase(username)) throw new IllegalArgumentException("Username is already registered");
  if(repo.existsByEmailIgnoreCase(email)) throw new IllegalArgumentException("Email address is already registered");
  User u=new User(); u.setFullName(r.fullName().trim().replaceAll("\\s+"," ")); u.setUsername(username); u.setEmail(email); u.setPasswordHash(encoder.encode(r.password())); u.setRole(r.role()); u.setActive(true); repo.save(u);
 }
 @Transactional(readOnly=true)
 public AuthResponse login(LoginRequest r){
  User u=repo.findByUsernameIgnoreCase(r.username().trim()).orElseThrow(()->new IllegalArgumentException("Invalid username or password"));
  if(!u.isActive() || !encoder.matches(r.password(),u.getPasswordHash())) throw new IllegalArgumentException("Invalid username or password");
  return AuthResponse.success(jwt.generate(u.getUsername(),u.getRole().name()),u);
 }
}
