package com.sunrise.dental.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ResetDtos {

    public record ForgotRequest(

            @NotBlank(message = "Email is required")
            @Email(message = "Please enter a valid email address")
            String email

    ) {
    }


    public record ResetRequest(

            @NotBlank(message = "Email is required")
            @Email(message = "Please enter a valid email address")
            String email,

            @NotBlank(message = "OTP is required")
            @Pattern(
                    regexp = "^\\d{6}$",
                    message = "OTP must contain exactly 6 digits"
            )
            String otp,

            @NotBlank(message = "New password is required")
            @Size(
                    min = 8,
                    max = 72,
                    message = "Password must be between 8 and 72 characters"
            )
            @Pattern(
                    regexp =
                            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,72}$",
                    message =
                            "Password must contain uppercase, lowercase, number and special character"
            )
            String newPassword

    ) {
    }
}