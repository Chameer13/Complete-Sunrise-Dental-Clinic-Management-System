package com.sunrise.dental.dto; import jakarta.validation.constraints.*; import java.time.LocalDateTime;
public record AppointmentRequest(@NotBlank String patientIdNumber,@NotNull Long dentistId,@NotNull Long treatmentId,
@NotNull @Future LocalDateTime appointmentDateTime,@Size(max=1000) String patientNote){}
