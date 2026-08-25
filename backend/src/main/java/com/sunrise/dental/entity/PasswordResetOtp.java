package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="password_reset_otps")
public class PasswordResetOtp {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @ManyToOne(optional=false) @JoinColumn(name="user_id",foreignKey=@ForeignKey(name="fk_otp_user")) User user;
 @Column(nullable=false,length=6) String otp; @Column(nullable=false) LocalDateTime expiresAt; @Column(nullable=false) boolean used=false; @Column(nullable=false) int attempts=0;
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;} public String getOtp(){return otp;} public void setOtp(String v){otp=v;}
 public LocalDateTime getExpiresAt(){return expiresAt;} public void setExpiresAt(LocalDateTime v){expiresAt=v;} public boolean isUsed(){return used;} public void setUsed(boolean v){used=v;} public int getAttempts(){return attempts;} public void setAttempts(int v){attempts=v;}
}
