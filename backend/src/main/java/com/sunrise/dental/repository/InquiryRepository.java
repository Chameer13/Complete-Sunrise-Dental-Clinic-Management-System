package com.sunrise.dental.repository;
import com.sunrise.dental.entity.Inquiry; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface InquiryRepository extends JpaRepository<Inquiry,Long>{List<Inquiry> findByPatientIdOrderByCreatedAtDesc(Long patientId); List<Inquiry> findByDentistIdOrderByCreatedAtDesc(Long dentistId);}
