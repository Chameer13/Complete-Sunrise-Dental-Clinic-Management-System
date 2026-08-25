package com.sunrise.dental.config;

import com.sunrise.dental.entity.Dentist;
import com.sunrise.dental.entity.Role;
import com.sunrise.dental.entity.Treatment;
import com.sunrise.dental.entity.User;
import com.sunrise.dental.repository.DentistRepository;
import com.sunrise.dental.repository.TreatmentRepository;
import com.sunrise.dental.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

 @Bean
 CommandLineRunner seed(
         UserRepository users,
         DentistRepository dentists,
         TreatmentRepository treatments,
         PasswordEncoder enc
 ) {

  return args -> {

   /*
    * =====================================================
    * ADMIN USER
    * =====================================================
    */
   if (users.count() == 0) {

    User admin = new User();

    admin.setFullName(
            "System Administrator"
    );

    admin.setUsername(
            "admin"
    );

    admin.setEmail(
            "admin@sunrisedental.lk"
    );

    admin.setPasswordHash(
            enc.encode("Admin@123")
    );

    admin.setRole(
            Role.ADMIN
    );

    admin.setEmailVerified(
            true
    );

    admin.setActive(
            true
    );

    users.save(admin);
   }


   /*
    * =====================================================
    * DEFAULT DENTIST
    * =====================================================
    */
   if (dentists.count() == 0) {

    /*
     * Create dentist login account.
     */
    User dentistUser = new User();

    dentistUser.setFullName(
            "Dr. Kasun Perera"
    );

    dentistUser.setUsername(
            "dentist1"
    );

    dentistUser.setEmail(
            "dentist@sunrisedental.lk"
    );

    dentistUser.setPasswordHash(
            enc.encode("Dentist@123")
    );

    dentistUser.setRole(
            Role.DENTIST
    );

    dentistUser.setEmailVerified(
            true
    );

    dentistUser.setActive(
            true
    );

    users.save(dentistUser);


    /*
     * Create dentist profile.
     */
    Dentist dentist = new Dentist();

    dentist.setUser(
            dentistUser
    );

    dentist.setRegistrationNumber(
            "SLMC-D-10001"
    );

    dentist.setSpecialization(
            "General Dentistry"
    );

    dentist.setQualifications(
            "BDS"
    );

    dentists.save(
            dentist
    );
   }


   /*
    * =====================================================
    * DEFAULT TREATMENTS
    * =====================================================
    */
   if (treatments.count() == 0) {

    String[][] treatmentData = {

            {
                    "CONS",
                    "Dental Consultation",
                    "1500"
            },

            {
                    "CLEAN",
                    "Scaling & Cleaning",
                    "4500"
            },

            {
                    "FILL",
                    "Dental Filling",
                    "6000"
            },

            {
                    "EXTR",
                    "Tooth Extraction",
                    "5000"
            },

            {
                    "RCT",
                    "Root Canal Treatment",
                    "25000"
            },

            {
                    "CROWN",
                    "Dental Crown",
                    "30000"
            }
    };


    for (String[] data : treatmentData) {

     Treatment treatment =
             new Treatment();

     treatment.setCode(
             data[0]
     );

     treatment.setName(
             data[1]
     );

     treatment.setDefaultPrice(
             new BigDecimal(data[2])
     );

     treatments.save(
             treatment
     );
    }
   }
  };
 }
}