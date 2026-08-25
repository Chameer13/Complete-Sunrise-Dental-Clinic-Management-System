package com.sunrise.dental.dto;

import com.sunrise.dental.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PaymentRequest(@NotNull Long appointmentId, @NotNull PaymentMethod paymentMethod,
                             @Size(max=100) String cardholderName,
                             @Size(max=4) String cardLast4) {}
