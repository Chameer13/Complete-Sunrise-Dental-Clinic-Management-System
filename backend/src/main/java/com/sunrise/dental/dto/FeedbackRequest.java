package com.sunrise.dental.dto;
import jakarta.validation.constraints.*;
public record FeedbackRequest(@Min(1) @Max(5) int rating,@NotBlank @Size(max=1200) String comment){}
