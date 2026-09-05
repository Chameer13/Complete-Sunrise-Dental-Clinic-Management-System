package com.sunrise.dental.repository;
import com.sunrise.dental.entity.Feedback; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface FeedbackRepository extends JpaRepository<Feedback,Long>{Optional<Feedback> findByPatientId(Long patientId); List<Feedback> findAllByOrderByCreatedAtDesc();}
