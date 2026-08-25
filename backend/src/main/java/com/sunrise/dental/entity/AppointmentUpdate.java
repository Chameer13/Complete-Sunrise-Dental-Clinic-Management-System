package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="appointment_updates")
public class AppointmentUpdate {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @ManyToOne(optional=false) @JoinColumn(name="appointment_id",foreignKey=@ForeignKey(name="fk_update_appointment")) Appointment appointment;
 @ManyToOne(optional=false) @JoinColumn(name="dentist_id",foreignKey=@ForeignKey(name="fk_update_dentist")) Dentist dentist;
 @Column(nullable=false,length=1500) String message;
 @Column(nullable=false) boolean emailSent=false; @Column(nullable=false,updatable=false) LocalDateTime createdAt;
 @PrePersist void p(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public Appointment getAppointment(){return appointment;} public void setAppointment(Appointment v){appointment=v;}
 public Dentist getDentist(){return dentist;} public void setDentist(Dentist v){dentist=v;} public String getMessage(){return message;} public void setMessage(String v){message=v;}
 public boolean isEmailSent(){return emailSent;} public void setEmailSent(boolean v){emailSent=v;} public LocalDateTime getCreatedAt(){return createdAt;}
}
