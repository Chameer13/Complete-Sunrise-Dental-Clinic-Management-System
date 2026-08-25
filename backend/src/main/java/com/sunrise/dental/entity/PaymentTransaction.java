package com.sunrise.dental.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payment_transactions",
       uniqueConstraints=@UniqueConstraint(name="uk_payment_reference",columnNames="transactionReference"))
public class PaymentTransaction {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @OneToOne(optional=false) @JoinColumn(name="bill_id",unique=true,foreignKey=@ForeignKey(name="fk_payment_bill"))
 Bill bill;
 @Column(nullable=false,length=40) String transactionReference;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) PaymentMethod paymentMethod;
 @Column(nullable=false,precision=12,scale=2) BigDecimal amount;
 @Column(length=100) String cardholderName;
 @Column(length=4) String cardLast4;
 @Column(nullable=false) boolean successful=true;
 @Column(nullable=false) boolean receiptEmailSent=false;
 @Column(nullable=false,updatable=false) LocalDateTime paidAt;
 @PrePersist void p(){paidAt=LocalDateTime.now();}
 public Long getId(){return id;} public Bill getBill(){return bill;} public void setBill(Bill v){bill=v;}
 public String getTransactionReference(){return transactionReference;} public void setTransactionReference(String v){transactionReference=v;}
 public PaymentMethod getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(PaymentMethod v){paymentMethod=v;}
 public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
 public String getCardholderName(){return cardholderName;} public void setCardholderName(String v){cardholderName=v;}
 public String getCardLast4(){return cardLast4;} public void setCardLast4(String v){cardLast4=v;}
 public boolean isSuccessful(){return successful;} public void setSuccessful(boolean v){successful=v;} public boolean isReceiptEmailSent(){return receiptEmailSent;} public void setReceiptEmailSent(boolean v){receiptEmailSent=v;}
 public LocalDateTime getPaidAt(){return paidAt;}
}
