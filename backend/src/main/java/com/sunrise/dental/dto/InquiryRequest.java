package com.sunrise.dental.dto;
import jakarta.validation.constraints.*;
public record InquiryRequest(@NotNull Long dentistId,@NotBlank @Size(max=1500) String message){}
