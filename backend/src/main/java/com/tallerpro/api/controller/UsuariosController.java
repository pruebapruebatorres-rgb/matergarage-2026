package com.tallerpro.api.controller;

import com.tallerpro.api.dto.ResetPasswordRequest;
import com.tallerpro.api.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Acciones sobre usuarios internos que van más allá del CRUD genérico de {@code /api/data}
 * (ver {@code DataController}) — hoy solo el restablecimiento de contraseña, que un
 * administrador puede hacer para cualquier usuario sin necesitar la contraseña anterior.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuariosController {

  private final AuthService authService;

  public UsuariosController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/{id}/reset-password")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void resetearContrasena(@PathVariable String id, @RequestBody ResetPasswordRequest request) {
    authService.resetearContrasena(id, request.password());
  }
}
