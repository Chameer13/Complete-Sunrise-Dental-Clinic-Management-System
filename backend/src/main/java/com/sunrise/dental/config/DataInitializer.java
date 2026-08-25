package com.sunrise.dental.config;

import com.sunrise.dental.entity.*;
import com.sunrise.dental.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;

@Configuration
public class DataInitializer {
 @Bean
 CommandLineRunner seed(UserRepository users,DentistRepository dentists,TreatmentRepository treatments,PasswordEncoder enc){
  return args -> {
   if(users.findByUsernameIgnoreCase("admin").isEmpty()){
    User admin=new User(); admin.setFullName("System Administrator"); admin.setUsername("admin");
    admin.setEmail("admin@sunrisedental.lk"); admin.setPasswordHash(enc.encode("Admin@123"));
    admin.setRole(Role.ADMIN); admin.setEmailVerified(true); admin.setActive(true); users.save(admin);
   }

   // Five reception staff accounts. Existing data is preserved.
   seedReceptionist(users,enc,"reception1","Receptionist 1","reception1@sunrisedental.lk");
   seedReceptionist(users,enc,"reception2","Receptionist 2","reception2@sunrisedental.lk");
   seedReceptionist(users,enc,"reception3","Receptionist 3","reception3@sunrisedental.lk");
   seedReceptionist(users,enc,"reception4","Receptionist 4","reception4@sunrisedental.lk");
   seedReceptionist(users,enc,"reception5","Receptionist 5","reception5@sunrisedental.lk");

   // Always ensure the five clinic dentists exist. Existing data is preserved.
   seedDentist(users,dentists,enc,"dentist1","Dr. Kasun Perera","dentist1@sunrisedental.lk","SLMC-D-10001","General Dentistry","BDS");
   seedDentist(users,dentists,enc,"dentist2","Dr. Nadeesha Fernando","dentist2@sunrisedental.lk","SLMC-D-10002","Orthodontics","BDS, MSc Orthodontics");
   seedDentist(users,dentists,enc,"dentist3","Dr. Tharindu Silva","dentist3@sunrisedental.lk","SLMC-D-10003","Endodontics","BDS, MDS Endodontics");
   seedDentist(users,dentists,enc,"dentist4","Dr. Amaya Wijesinghe","dentist4@sunrisedental.lk","SLMC-D-10004","Paediatric Dentistry","BDS, MSc Paediatric Dentistry");
   seedDentist(users,dentists,enc,"dentist5","Dr. Dinuka Jayawardena","dentist5@sunrisedental.lk","SLMC-D-10005","Prosthodontics","BDS, MDS Prosthodontics");

   if(treatments.count()==0){
    String[][] data={{"CONS","Dental Consultation","1500"},{"CLEAN","Scaling & Cleaning","4500"},
      {"FILL","Dental Filling","6000"},{"EXTR","Tooth Extraction","5000"},
      {"RCT","Root Canal Treatment","25000"},{"CROWN","Dental Crown","30000"}};
    for(String[] d:data){
     Treatment t=new Treatment(); t.setCode(d[0]);t.setName(d[1]);t.setDefaultPrice(new BigDecimal(d[2]));t.setActive(true);treatments.save(t);
    }
   }
  };
 }

 private void seedReceptionist(UserRepository users,PasswordEncoder enc,String username,String fullName,String email){
  if(users.findByUsernameIgnoreCase(username).isPresent()) return;
  User u=new User(); u.setFullName(fullName); u.setUsername(username); u.setEmail(email);
  u.setPasswordHash(enc.encode("Reception@123")); u.setRole(Role.RECEPTIONIST);
  u.setEmailVerified(true); u.setActive(true); users.save(u);
 }

 private void seedDentist(UserRepository users,DentistRepository dentists,PasswordEncoder enc,
                          String username,String fullName,String email,String reg,String spec,String qual){
  if(dentists.findByRegistrationNumberIgnoreCase(reg).isPresent()) return;
  User u=users.findByUsernameIgnoreCase(username).orElseGet(()->{
   User x=new User();x.setFullName(fullName);x.setUsername(username);x.setEmail(email);
   x.setPasswordHash(enc.encode("Dentist@123"));x.setRole(Role.DENTIST);x.setEmailVerified(true);x.setActive(true);
   return users.save(x);
  });
  Dentist d=new Dentist();d.setUser(u);d.setRegistrationNumber(reg);d.setSpecialization(spec);d.setQualifications(qual);d.setActive(true);dentists.save(d);
 }
}
