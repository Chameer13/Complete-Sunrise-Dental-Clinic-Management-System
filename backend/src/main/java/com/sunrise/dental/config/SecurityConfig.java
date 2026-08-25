package com.sunrise.dental.config;
import com.sunrise.dental.security.JwtAuthenticationFilter; import org.springframework.context.annotation.*; import org.springframework.security.config.annotation.web.builders.HttpSecurity; import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; import org.springframework.security.config.http.SessionCreationPolicy; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.security.web.SecurityFilterChain; import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
public class SecurityConfig {
 private final JwtAuthenticationFilter jwt; public SecurityConfig(JwtAuthenticationFilter jwt){this.jwt=jwt;}
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
 @Bean SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
  return http.csrf(AbstractHttpConfigurer::disable).cors(c->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**","/h2-console/**","/error").permitAll().anyRequest().authenticated()).headers(h->h.frameOptions(f->f.sameOrigin())).addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class).build();
 }
}
