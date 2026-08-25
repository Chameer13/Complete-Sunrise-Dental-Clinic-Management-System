package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="appointments",uniqueConstraints=@UniqueConstraint(name="uk_appointment_number",columnNames="appointmentNumber"))
public class Appointment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @Column(nullable=false,length=30) String appointmentNumber;
 @ManyToOne(optional=false) @JoinColumn(name="patient_id",foreignKey=@ForeignKey(name="fk_appointment_patient")) Patient patient;
 @ManyToOne(optional=false) @JoinColumn(name="dentist_id",foreignKey=@ForeignKey(name="fk_appointment_dentist")) Dentist dentist;
 @ManyToOne(optional=false) @JoinColumn(name="treatment_id",foreignKey=@ForeignKey(name="fk_appointment_treatment")) Treatment treatment;
 @Column(nullable=false) LocalDateTime appointmentDateTime;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) AppointmentStatus status=AppointmentStatus.BOOKED;
 @Column(length=1000) String patientNote;
 @Column(length=1000) String staffNote;
 @Column(nullable=false,updatable=false) LocalDateTime createdAt; @Column(nullable=false) LocalDateTime updatedAt;
 @PrePersist void p(){createdAt=updatedAt=LocalDateTime.now();} @PreUpdate void u(){updatedAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getAppointmentNumber(){return appointmentNumber;} public void setAppointmentNumber(String v){appointmentNumber=v;}
 public Patient getPatient(){return patient;} public void setPatient(Patient v){patient=v;} public Dentist getDentist(){return dentist;} public void setDentist(Dentist v){dentist=v;}
 public Treatment getTreatment(){return treatment;} public void setTreatment(Treatment v){treatment=v;} public LocalDateTime getAppointmentDateTime(){return appointmentDateTime;} public void setAppointmentDateTime(LocalDateTime v){appointmentDateTime=v;}
 public AppointmentStatus getStatus(){return status;} public void setStatus(AppointmentStatus v){status=v;} public String getPatientNote(){return patientNote;} public void setPatientNote(String v){patientNote=v;}
 public String getStaffNote(){return staffNote;} public void setStaffNote(String v){staffNote=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
