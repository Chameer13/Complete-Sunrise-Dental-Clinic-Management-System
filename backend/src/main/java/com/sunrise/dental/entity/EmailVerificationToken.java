package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="email_verification_tokens",uniqueConstraints=@UniqueConstraint(name="uk_verify_token",columnNames="token"))
public class EmailVerificationToken {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @OneToOne(optional=false) @JoinColumn(name="user_id",unique=true,foreignKey=@ForeignKey(name="fk_verify_user")) User user;
 @Column(nullable=false,length=100) String token; @Column(nullable=false) LocalDateTime expiresAt; @Column(nullable=false) boolean used=false;
 public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;} public String getToken(){return token;} public void setToken(String v){token=v;}
 public LocalDateTime getExpiresAt(){return expiresAt;} public void setExpiresAt(LocalDateTime v){expiresAt=v;} public boolean isUsed(){return used;} public void setUsed(boolean v){used=v;}
}
