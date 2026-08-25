package com.sunrise.dental.dto;
import com.sunrise.dental.entity.Role;
public record AuthResponse(boolean success,String message,String token,Long userId,String fullName,String username,Role role) {
 public static AuthResponse success(String token, com.sunrise.dental.entity.User u){return new AuthResponse(true,"Login successful",token,u.getId(),u.getFullName(),u.getUsername(),u.getRole());}
 public static AuthResponse registered(){return new AuthResponse(true,"Registration successful. You can now log in.",null,null,null,null,null);}
}
