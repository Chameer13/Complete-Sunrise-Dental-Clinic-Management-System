package com.sunrise.dental.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users", uniqueConstraints={
 @UniqueConstraint(name="uk_users_username", columnNames="username"),
 @UniqueConstraint(name="uk_users_email", columnNames="email")
})
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=100) private String fullName;
 @Column(nullable=false,length=30) private String username;
 @Column(nullable=false,length=150) private String email;
 @Column(nullable=false,length=100) private String passwordHash;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Role role;
 @Column(nullable=false) private boolean active=true;
 @Column(nullable=false,updatable=false) private LocalDateTime createdAt;
 @Column(nullable=false) private LocalDateTime updatedAt;
 @PrePersist void prePersist(){ LocalDateTime now=LocalDateTime.now(); createdAt=now; updatedAt=now; }
 @PreUpdate void preUpdate(){ updatedAt=LocalDateTime.now(); }
 public Long getId(){return id;} public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
 public String getUsername(){return username;} public void setUsername(String v){username=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
 public Role getRole(){return role;} public void setRole(Role v){role=v;}
 public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
