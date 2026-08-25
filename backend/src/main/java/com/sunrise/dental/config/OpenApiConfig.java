package com.sunrise.dental.config;
import io.swagger.v3.oas.models.OpenAPI; import io.swagger.v3.oas.models.info.Info; import org.springframework.context.annotation.*;
@Configuration public class OpenApiConfig { @Bean OpenAPI openAPI(){return new OpenAPI().info(new Info().title("Sunrise Dental Clinic API").version("1.0.0").description("Authentication API for the Sunrise Dental Clinic Management System."));}}
