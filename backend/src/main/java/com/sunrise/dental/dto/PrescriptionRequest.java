package com.sunrise.dental.dto;
import jakarta.validation.constraints.*;
public record PrescriptionRequest(@NotBlank @Size(max=1500) String diagnosis,@NotBlank @Size(max=2000) String medicines,@Size(max=1500) String instructions){}
