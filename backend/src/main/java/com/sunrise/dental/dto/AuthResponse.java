package com.sunrise.dental.dto; import com.sunrise.dental.entity.Role;
public record AuthResponse(boolean success,String message,String token,Long userId,String fullName,String username,String email,Role role,boolean emailVerified){}
