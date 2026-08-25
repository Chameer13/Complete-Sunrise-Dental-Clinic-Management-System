package com.sunrise.dental.dto;

import com.sunrise.dental.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Full name is required")
        @Size(
                min = 3,
                max = 100,
                message = "Full name must be between 3 and 100 characters"
        )
        @Pattern(
                regexp = "^[A-Za-z][A-Za-z .'-]*$",
                message = "Full name contains invalid characters"
        )
        String fullName,

        @NotBlank(message = "Username is required")
        @Size(
                min = 4,
                max = 30,
                message = "Username must be between 4 and 30 characters"
        )
        @Pattern(
                regexp = "^[A-Za-z0-9._-]+$",
                message = "Username may contain only letters, numbers, dots, underscores and hyphens"
        )
        String username,

        @NotBlank(message = "Email address is required")
        @Email(message = "Please enter a valid email address")
        @Size(
                max = 150,
                message = "Email address is too long"
        )
        String email,

        @NotBlank(message = "Password is required")
        @Size(
                min = 8,
                max = 72,
                message = "Password must be between 8 and 72 characters"
        )
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,72}$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        )
        String password,

        @NotNull(message = "Role is required")
        Role role

) {
}