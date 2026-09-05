package com.sunrise.dental.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="prescriptions")
public class Prescription {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @OneToOne(optional=false) @JoinColumn(name="appointment_id",unique=true,foreignKey=@ForeignKey(name="fk_prescription_appointment")) Appointment appointment;
 @ManyToOne(optional=false) @JoinColumn(name="patient_id",foreignKey=@ForeignKey(name="fk_prescription_patient")) Patient patient;
 @ManyToOne(optional=false) @JoinColumn(name="dentist_id",foreignKey=@ForeignKey(name="fk_prescription_dentist")) Dentist dentist;
 @Column(nullable=false,length=1500) String diagnosis;
 @Column(nullable=false,length=2000) String medicines;
 @Column(length=1500) String instructions;
 @Column(nullable=false,updatable=false) LocalDateTime prescribedAt;
 @PrePersist void p(){prescribedAt=LocalDateTime.now();}
 public Long getId(){return id;} public Appointment getAppointment(){return appointment;} public void setAppointment(Appointment v){appointment=v;}
 public Patient getPatient(){return patient;} public void setPatient(Patient v){patient=v;} public Dentist getDentist(){return dentist;} public void setDentist(Dentist v){dentist=v;}
 public String getDiagnosis(){return diagnosis;} public void setDiagnosis(String v){diagnosis=v;} public String getMedicines(){return medicines;} public void setMedicines(String v){medicines=v;}
 public String getInstructions(){return instructions;} public void setInstructions(String v){instructions=v;} public LocalDateTime getPrescribedAt(){return prescribedAt;}
}
