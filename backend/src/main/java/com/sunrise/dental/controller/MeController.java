package com.sunrise.dental.controller;
import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/me") public class MeController { @GetMapping public String me(Authentication auth){return "Authenticated as: "+auth.getName();} }
