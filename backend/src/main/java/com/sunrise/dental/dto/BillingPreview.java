package com.sunrise.dental.dto;

import java.math.BigDecimal;

public record BillingPreview(Long appointmentId, String appointmentNumber, String patientName,
                             String dentistName, String treatmentName, BigDecimal treatmentFee,
                             BigDecimal consultationFee, BigDecimal subtotal, BigDecimal discount,
                             BigDecimal tax, BigDecimal total) {}
