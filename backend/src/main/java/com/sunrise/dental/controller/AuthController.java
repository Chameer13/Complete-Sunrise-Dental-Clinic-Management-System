package com.sunrise.dental.controller;
import com.sunrise.dental.dto.*; import com.sunrise.dental.service.AuthService; import io.swagger.v3.oas.annotations.Operation; import io.swagger.v3.oas.annotations.tags.Tag; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @Tag(name="Authentication",description="Staff registration and login")
public class AuthController {
 private final AuthService service; public AuthController(AuthService service){this.service=service;}
 @PostMapping("/register") @Operation(summary="Register staff account") public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){service.register(request); return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.registered());}
 @PostMapping("/login") @Operation(summary="Login staff account") public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request){return ResponseEntity.ok(service.login(request));}
 @GetMapping("/check") @Operation(summary="Check API availability") public String check(){return "Sunrise Dental Clinic Authentication API is running.";}
}
