package com.sunrise.dental.repository;
import com.sunrise.dental.entity.MedicineDispensation; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface MedicineDispensationRepository extends JpaRepository<MedicineDispensation,Long>{
 List<MedicineDispensation> findByPrescriptionIdOrderByDispensedAtDesc(Long prescriptionId);
 boolean existsByPrescriptionIdAndMedicineNameIgnoreCase(Long prescriptionId,String medicineName);
 @org.springframework.data.jpa.repository.Query("select m from MedicineDispensation m join fetch m.prescription p where p.patient.id=:patientId order by m.dispensedAt desc")
 List<MedicineDispensation> findByPatientIdOrderByDispensedAtDesc(Long patientId);
}
