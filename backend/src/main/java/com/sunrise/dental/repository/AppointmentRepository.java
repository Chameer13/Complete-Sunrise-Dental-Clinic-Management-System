package com.sunrise.dental.repository;
import com.sunrise.dental.entity.*; import org.springframework.data.jpa.repository.*; import java.time.*; import java.util.*;
public interface AppointmentRepository extends JpaRepository<Appointment,Long>{
 Optional<Appointment> findByAppointmentNumber(String n);
 List<Appointment> findByPatientIdOrderByAppointmentDateTimeDesc(Long id);
 List<Appointment> findByDentistIdOrderByAppointmentDateTimeAsc(Long id);
 long countByAppointmentDateTimeBetween(LocalDateTime a,LocalDateTime b);
 @Query("select count(a)>0 from Appointment a where a.dentist.id=:dentist and a.status in :statuses and a.appointmentDateTime >= :start and a.appointmentDateTime < :end")
 boolean existsConflict(Long dentist,LocalDateTime start,LocalDateTime end,Collection<AppointmentStatus> statuses);
}
