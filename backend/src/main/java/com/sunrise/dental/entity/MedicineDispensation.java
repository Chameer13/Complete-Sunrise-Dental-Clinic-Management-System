package com.sunrise.dental.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="medicine_dispensations", uniqueConstraints=@UniqueConstraint(name="uk_prescription_medicine", columnNames={"prescription_id","medicine_name"}))
public class MedicineDispensation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @ManyToOne(optional=false) @JoinColumn(name="prescription_id",foreignKey=@ForeignKey(name="fk_dispense_prescription")) Prescription prescription;
 @ManyToOne(optional=false) @JoinColumn(name="staff_user_id",foreignKey=@ForeignKey(name="fk_dispense_staff")) User staffUser;
 @Column(nullable=false,length=150) String medicineName;
 @Column(nullable=false,length=50) String quantity;
 @Column(length=100) String batchNumber;
 @Column(length=1000) String notes;
 @Column(nullable=false,updatable=false) LocalDateTime dispensedAt;
 @PrePersist void p(){dispensedAt=LocalDateTime.now();}
 public Long getId(){return id;} public Prescription getPrescription(){return prescription;} public void setPrescription(Prescription v){prescription=v;}
 public User getStaffUser(){return staffUser;} public void setStaffUser(User v){staffUser=v;} public String getMedicineName(){return medicineName;} public void setMedicineName(String v){medicineName=v;}
 public String getQuantity(){return quantity;} public void setQuantity(String v){quantity=v;} public String getBatchNumber(){return batchNumber;} public void setBatchNumber(String v){batchNumber=v;}
 public String getNotes(){return notes;} public void setNotes(String v){notes=v;} public LocalDateTime getDispensedAt(){return dispensedAt;}
}
