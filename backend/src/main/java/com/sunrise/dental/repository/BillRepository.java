package com.sunrise.dental.repository;
import com.sunrise.dental.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface BillRepository extends JpaRepository<Bill,Long>{Optional<Bill> findByAppointmentId(Long appointmentId); List<Bill> findByPatientIdOrderByCreatedAtDesc(Long patientId);}
