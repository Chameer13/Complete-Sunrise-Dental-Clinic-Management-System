package com.sunrise.dental.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import java.nio.charset.StandardCharsets; import java.security.Key; import java.util.*;
@Service public class JwtService {
 private final Key key; private final long exp;
 public JwtService(@Value("${jwt.secret}") String secret,@Value("${jwt.expiration-ms}") long exp){key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.exp=exp;}
 public String generate(Long id,String username,String role){return Jwts.builder().subject(username).claim("uid",id).claim("role",role).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+exp)).signWith(key).compact();}
 public String username(String token){return Jwts.parser().verifyWith((javax.crypto.SecretKey)key).build().parseSignedClaims(token).getPayload().getSubject();}
 public boolean valid(String token){try{Jwts.parser().verifyWith((javax.crypto.SecretKey)key).build().parseSignedClaims(token);return true;}catch(Exception e){return false;}}
}
