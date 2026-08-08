package com.tallerpro.api.controller;

import com.tallerpro.api.dto.LoginRequest;
import com.tallerpro.api.dto.LoginResponse;
import com.tallerpro.api.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Autenticación de usuarios internos — consumido por {@code login()} del frontend. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public LoginResponse login(@RequestBody LoginRequest request) {
    return authService.login(request.usuario(), request.password());
  }
}
