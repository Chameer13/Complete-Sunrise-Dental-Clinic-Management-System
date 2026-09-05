package com.sunrise.dental.repository;
import com.sunrise.dental.entity.Prescription; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface PrescriptionRepository extends JpaRepository<Prescription,Long>{Optional<Prescription> findByAppointmentId(Long appointmentId); List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);}
