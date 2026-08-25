package com.sunrise.dental.dto;

import com.sunrise.dental.entity.BillStatus;
import com.sunrise.dental.entity.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record StaffFinancialRecord(
        Long appointmentId,
        String appointmentNumber,
        LocalDateTime appointmentDateTime,
        String dentistName,
        String treatmentName,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BillStatus paymentStatus,
        PaymentMethod paymentMethod,
        Long paymentId
) {}
