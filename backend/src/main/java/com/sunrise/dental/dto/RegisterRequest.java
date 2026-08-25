package com.sunrise.dental.dto;
import com.sunrise.dental.entity.Role;
import jakarta.validation.constraints.*;
public record RegisterRequest(
 @NotBlank(message="Full name is required") @Size(min=3,max=100,message="Full name must be 3-100 characters") @Pattern(regexp="^[A-Za-z][A-Za-z .'-]*$",message="Full name contains invalid characters") String fullName,
 @NotBlank(message="Username is required") @Size(min=4,max=30,message="Username must be 4-30 characters") @Pattern(regexp="^[A-Za-z0-9._-]+$",message="Username may contain letters, numbers, dot, underscore and hyphen only") String username,
 @NotBlank(message="Email is required") @Email(message="Enter a valid email address") @Size(max=150,message="Email is too long") String email,
 @NotBlank(message="Password is required") @Size(min=8,max=72,message="Password must be 8-72 characters") @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,72}$",message="Password must contain uppercase, lowercase, number and special character") String password,
 @NotNull(message="Role is required") Role role
) {}
