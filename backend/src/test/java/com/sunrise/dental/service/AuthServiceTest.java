package com.sunrise.dental.service;
import com.sunrise.dental.dto.*; import com.sunrise.dental.entity.*; import com.sunrise.dental.repository.UserRepository; import com.sunrise.dental.security.JwtService; import org.junit.jupiter.api.*; import org.mockito.*; import org.springframework.security.crypto.password.PasswordEncoder; import static org.junit.jupiter.api.Assertions.*; import static org.mockito.Mockito.*;
class AuthServiceTest {
 @Mock UserRepository repo; @Mock PasswordEncoder encoder; @Mock JwtService jwt; AuthService service;
 @BeforeEach void setup(){MockitoAnnotations.openMocks(this); service=new AuthService(repo,encoder,jwt);}
 @Test void duplicateUsernameRejected(){when(repo.existsByUsernameIgnoreCase("john")).thenReturn(true); var r=new RegisterRequest("John Silva","john","john@example.com","Strong@123",Role.RECEPTIONIST); assertThrows(IllegalArgumentException.class,()->service.register(r));}
 @Test void duplicateEmailRejected(){when(repo.existsByUsernameIgnoreCase("john")).thenReturn(false); when(repo.existsByEmailIgnoreCase("john@example.com")).thenReturn(true); var r=new RegisterRequest("John Silva","john","john@example.com","Strong@123",Role.RECEPTIONIST); assertThrows(IllegalArgumentException.class,()->service.register(r));}
}
