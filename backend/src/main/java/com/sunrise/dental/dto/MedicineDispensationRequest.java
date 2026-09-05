package com.sunrise.dental.dto;
import jakarta.validation.constraints.*;
public record MedicineDispensationRequest(@NotBlank @Size(max=150) String medicineName,@NotBlank @Size(max=50) String quantity,@Size(max=100) String batchNumber,@Size(max=1000) String notes){}
