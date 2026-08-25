package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.LocalDateTime;
@Entity @Table(name="bills",uniqueConstraints=@UniqueConstraint(name="uk_bill_number",columnNames="billNumber"))
public class Bill {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @Column(nullable=false,length=30) String billNumber;
 @OneToOne(optional=false) @JoinColumn(name="appointment_id",unique=true,foreignKey=@ForeignKey(name="fk_bill_appointment")) Appointment appointment;
 @ManyToOne(optional=false) @JoinColumn(name="patient_id",foreignKey=@ForeignKey(name="fk_bill_patient")) Patient patient;
 @Column(nullable=false,precision=12,scale=2) BigDecimal subtotal;
 @Column(nullable=false,precision=12,scale=2) BigDecimal discount=BigDecimal.ZERO;
 @Column(nullable=false,precision=12,scale=2) BigDecimal tax=BigDecimal.ZERO;
 @Column(nullable=false,precision=12,scale=2) BigDecimal total;
 @Column(nullable=false,precision=12,scale=2) BigDecimal paidAmount=BigDecimal.ZERO;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) BillStatus status=BillStatus.UNPAID;
 @Enumerated(EnumType.STRING) PaymentMethod paymentMethod;
 @Column(nullable=false,updatable=false) LocalDateTime createdAt; @Column(nullable=false) LocalDateTime updatedAt;
 @PrePersist void p(){createdAt=updatedAt=LocalDateTime.now();} @PreUpdate void u(){updatedAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getBillNumber(){return billNumber;} public void setBillNumber(String v){billNumber=v;} public Appointment getAppointment(){return appointment;} public void setAppointment(Appointment v){appointment=v;}
 public Patient getPatient(){return patient;} public void setPatient(Patient v){patient=v;} public BigDecimal getSubtotal(){return subtotal;} public void setSubtotal(BigDecimal v){subtotal=v;}
 public BigDecimal getDiscount(){return discount;} public void setDiscount(BigDecimal v){discount=v;} public BigDecimal getTax(){return tax;} public void setTax(BigDecimal v){tax=v;} public BigDecimal getTotal(){return total;} public void setTotal(BigDecimal v){total=v;}
 public BigDecimal getPaidAmount(){return paidAmount;} public void setPaidAmount(BigDecimal v){paidAmount=v;} public BillStatus getStatus(){return status;} public void setStatus(BillStatus v){status=v;}
 public PaymentMethod getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(PaymentMethod v){paymentMethod=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
