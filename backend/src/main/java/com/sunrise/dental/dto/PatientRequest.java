package com.sunrise.dental.dto; import jakarta.validation.constraints.*; import java.time.LocalDate;
public record PatientRequest(
@NotBlank @Pattern(regexp="^(?:\\d{9}[VXvx]|\\d{12})$") String idNumber,
@NotBlank @Size(min=3,max=100) String fullName,@NotBlank @Size(max=255) String address,
@NotBlank @Pattern(regexp="^(?:0|\\+94)7\\d{8}$") String contactNumber,@Email @Size(max=150) String email,
@Pattern(regexp="^(MALE|FEMALE|OTHER)$") String gender, @Past LocalDate dateOfBirth,
@Size(max=100) String emergencyContact,@Size(max=255) String allergies,@Size(max=255) String medicalNotes){}
