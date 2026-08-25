package com.sunrise.dental.repository;

import com.sunrise.dental.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,Long> {
 Optional<PaymentTransaction> findByBillId(Long billId);
 Optional<PaymentTransaction> findByTransactionReference(String reference);
}
