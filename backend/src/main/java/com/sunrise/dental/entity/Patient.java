package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="patients",uniqueConstraints=@UniqueConstraint(name="uk_patient_id_number",columnNames="idNumber"))
public class Patient {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @com.fasterxml.jackson.annotation.JsonIgnore @OneToOne @JoinColumn(name="user_id",unique=true) User user;
 @Column(nullable=false,length=20) String idNumber;
 @Column(nullable=false,length=100) String fullName;
 @Column(nullable=false,length=255) String address;
 @Column(nullable=false,length=20) String contactNumber;
 @Column(length=150) String email;
 @Column(length=20) String gender;
 java.time.LocalDate dateOfBirth;
 @Column(length=100) String emergencyContact;
 @Column(length=255) String allergies;
 @Column(length=255) String medicalNotes;
 @Column(nullable=false,updatable=false) LocalDateTime createdAt;
 @Column(nullable=false) LocalDateTime updatedAt;
 @PrePersist void p(){createdAt=updatedAt=LocalDateTime.now();} @PreUpdate void u(){updatedAt=LocalDateTime.now();}
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getIdNumber(){return idNumber;} public void setIdNumber(String v){idNumber=v;}
 public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
 public String getAddress(){return address;} public void setAddress(String v){address=v;}
 public String getContactNumber(){return contactNumber;} public void setContactNumber(String v){contactNumber=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getGender(){return gender;} public void setGender(String v){gender=v;}
 public java.time.LocalDate getDateOfBirth(){return dateOfBirth;} public void setDateOfBirth(java.time.LocalDate v){dateOfBirth=v;}
 public String getEmergencyContact(){return emergencyContact;} public void setEmergencyContact(String v){emergencyContact=v;}
 public String getAllergies(){return allergies;} public void setAllergies(String v){allergies=v;}
 public String getMedicalNotes(){return medicalNotes;} public void setMedicalNotes(String v){medicalNotes=v;}
}
