package com.sunrise.dental.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserDetailsServiceImpl uds; public JwtAuthenticationFilter(JwtService j,UserDetailsServiceImpl u){jwt=j;uds=u;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,java.io.IOException{
  String h=req.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")){String t=h.substring(7); if(jwt.valid(t)){try{var d=uds.loadUserByUsername(jwt.username(t)); SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(d,null,d.getAuthorities()));}catch(Exception ignored){}}}
  chain.doFilter(req,res);
 }}
