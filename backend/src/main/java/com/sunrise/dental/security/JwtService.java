package com.sunrise.dental.security;

import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.util.Date;

@Service
public class JwtService {
 private final SecretKey key; private final long expiration;
 public JwtService(@Value("${jwt.secret}") String secret,@Value("${jwt.expiration-ms}") long expiration){
  if(secret.length()<32) throw new IllegalArgumentException("JWT secret must contain at least 32 characters");
  key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expiration=expiration;
 }
 public String generate(String username,String role){
  Date now=new Date(); return Jwts.builder().subject(username).claim("role",role).issuedAt(now).expiration(new Date(now.getTime()+expiration)).signWith(key).compact();
 }
 public String extractUsername(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
 public boolean isValid(String token,String username){try{return extractUsername(token).equalsIgnoreCase(username);}catch(JwtException|IllegalArgumentException e){return false;}}
}
