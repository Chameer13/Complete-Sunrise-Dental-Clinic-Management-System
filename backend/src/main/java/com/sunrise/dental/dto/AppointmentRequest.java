package com.sunrise.dental.dto; import jakarta.validation.constraints.*; import java.time.LocalDateTime;
public record AppointmentRequest(@NotBlank @Pattern(regexp="^(?:\\d{12}|\\d{9}[VvXx])$", message="Invalid NIC format. Use 12 digits or 9 digits followed by V/X.") String patientIdNumber,@NotNull Long dentistId,@NotNull Long treatmentId,
@NotNull @Future LocalDateTime appointmentDateTime,@Size(max=1000) String patientNote){}
