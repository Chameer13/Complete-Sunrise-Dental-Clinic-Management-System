package com.sunrise.dental.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="patient_inquiries")
public class Inquiry {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @ManyToOne(optional=false) @JoinColumn(name="patient_id",foreignKey=@ForeignKey(name="fk_inquiry_patient")) Patient patient;
 @ManyToOne(optional=false) @JoinColumn(name="dentist_id",foreignKey=@ForeignKey(name="fk_inquiry_dentist")) Dentist dentist;
 @Column(nullable=false,length=1500) String message;
 @Column(length=1500) String reply;
 @Column(nullable=false,length=20) String status="OPEN";
 @Column(nullable=false,updatable=false) LocalDateTime createdAt;
 LocalDateTime repliedAt;
 @PrePersist void p(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public Patient getPatient(){return patient;} public void setPatient(Patient v){patient=v;}
 public Dentist getDentist(){return dentist;} public void setDentist(Dentist v){dentist=v;}
 public String getMessage(){return message;} public void setMessage(String v){message=v;}
 public String getReply(){return reply;} public void setReply(String v){reply=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getRepliedAt(){return repliedAt;} public void setRepliedAt(LocalDateTime v){repliedAt=v;}
}
