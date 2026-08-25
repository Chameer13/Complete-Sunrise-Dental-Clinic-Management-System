package com.sunrise.dental.security;
import com.sunrise.dental.repository.UserRepository; import org.springframework.security.core.userdetails.*; import org.springframework.stereotype.Service;
@Service public class UserDetailsServiceImpl implements UserDetailsService { private final UserRepository repo; public UserDetailsServiceImpl(UserRepository r){repo=r;}
 public UserDetails loadUserByUsername(String u)throws UsernameNotFoundException{var x=repo.findByUsernameIgnoreCase(u).orElseThrow(()->new UsernameNotFoundException("Invalid credentials")); return User.withUsername(x.getUsername()).password(x.getPasswordHash()).roles(x.getRole().name()).disabled(!x.isActive()).build();}}
