package com.sunrise.dental.security;
import com.sunrise.dental.repository.UserRepository; import org.springframework.security.core.userdetails.*; import org.springframework.stereotype.Service;
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
 private final UserRepository repo; public UserDetailsServiceImpl(UserRepository repo){this.repo=repo;}
 @Override public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
  var u=repo.findByUsernameIgnoreCase(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
  return User.withUsername(u.getUsername()).password(u.getPasswordHash()).roles(u.getRole().name()).disabled(!u.isActive()).build();
 }
}
