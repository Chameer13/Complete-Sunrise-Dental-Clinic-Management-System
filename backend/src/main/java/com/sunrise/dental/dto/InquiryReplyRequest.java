package com.sunrise.dental.dto;
import jakarta.validation.constraints.*;
public record InquiryReplyRequest(@NotBlank @Size(max=1500) String reply){}
