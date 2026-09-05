package com.sunrise.dental.entity;
import jakarta.persistence.*;
@Entity @Table(name="dentists",uniqueConstraints=@UniqueConstraint(name="uk_dentist_reg",columnNames="registrationNumber"))
public class Dentist {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @com.fasterxml.jackson.annotation.JsonIgnore @OneToOne @JoinColumn(name="user_id",unique=true) User user;
 @Column(nullable=false,length=30) String registrationNumber;
 @Column(nullable=false,length=100) String specialization;
 @Column(length=255) String qualifications;
 @Column(nullable=false) boolean active=true;
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;}
 public String getRegistrationNumber(){return registrationNumber;} public void setRegistrationNumber(String v){registrationNumber=v;}
 public String getSpecialization(){return specialization;} public void setSpecialization(String v){specialization=v;}
 public String getQualifications(){return qualifications;} public void setQualifications(String v){qualifications=v;}
 public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
 public String getDisplayName(){return user!=null?user.getFullName():registrationNumber;}
}
