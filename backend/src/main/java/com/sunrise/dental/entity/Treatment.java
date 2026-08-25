package com.sunrise.dental.entity;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity @Table(name="treatments",uniqueConstraints=@UniqueConstraint(name="uk_treatment_code",columnNames="code"))
public class Treatment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
 @Column(nullable=false,length=20) String code; @Column(nullable=false,length=120) String name;
 @Column(length=500) String description; @Column(nullable=false,precision=12,scale=2) BigDecimal defaultPrice;
 @Column(nullable=false) boolean active=true;
 public Long getId(){return id;} public String getCode(){return code;} public void setCode(String v){code=v;}
 public String getName(){return name;} public void setName(String v){name=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public BigDecimal getDefaultPrice(){return defaultPrice;} public void setDefaultPrice(BigDecimal v){defaultPrice=v;} public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}
