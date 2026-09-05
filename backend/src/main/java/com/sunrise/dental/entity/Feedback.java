package com.sunrise.dental.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="feedbacks")
public class Feedback {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @ManyToOne(optional=false) @JoinColumn(name="user_id",foreignKey=@ForeignKey(name="fk_feedback_user")) User user;
 @OneToOne(optional=false) @JoinColumn(name="patient_id",unique=true,foreignKey=@ForeignKey(name="fk_feedback_patient")) Patient patient;
 @Column(nullable=false) int rating;
 @Column(nullable=false,length=1200) String comment;
 @Column(nullable=false,updatable=false) LocalDateTime createdAt;
 @Column(nullable=false) LocalDateTime updatedAt;
 @PrePersist void p(){createdAt=updatedAt=LocalDateTime.now();}
 @PreUpdate void u(){updatedAt=LocalDateTime.now();}
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public Patient getPatient(){return patient;} public void setPatient(Patient v){patient=v;}
 public int getRating(){return rating;} public void setRating(int v){rating=v;}
 public String getComment(){return comment;} public void setComment(String v){comment=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
