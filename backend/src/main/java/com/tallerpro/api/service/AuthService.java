package com.tallerpro.api.service;

import com.tallerpro.api.dto.LoginResponse;
import com.tallerpro.api.dto.SesionUsuario;
import com.tallerpro.api.entity.Credencial;
import com.tallerpro.api.repository.CredencialRepository;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Autenticación de usuarios internos, espejo de {@code login()} en el frontend
 * (src/lib/store.tsx): bloqueo tras 5 intentos fallidos consecutivos por usuario.
 */
@Service
public class AuthService {

  private static final int MAX_INTENTOS = 5;

  private final CredencialRepository repository;
  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
  private final Map<String, Integer> intentosFallidos = new ConcurrentHashMap<>();

  public AuthService(CredencialRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public LoginResponse login(String usuarioIngresado, String password) {
    String usuario = usuarioIngresado == null ? "" : usuarioIngresado.trim().toLowerCase();
    int fallos = intentosFallidos.getOrDefault(usuario, 0);
    if (fallos >= MAX_INTENTOS) {
      return LoginResponse.error("Cuenta bloqueada tras 5 intentos fallidos. Contacte al administrador.");
    }

    Credencial credencial = repository.findById(usuario).orElse(null);
    if (credencial == null || !passwordEncoder.matches(password == null ? "" : password, credencial.getPasswordHash())) {
      int nuevosFallos = fallos + 1;
      intentosFallidos.put(usuario, nuevosFallos);
      return LoginResponse.error("Credenciales incorrectas. Intento %d de %d.".formatted(nuevosFallos, MAX_INTENTOS));
    }

    intentosFallidos.remove(usuario);
    return LoginResponse.ok(new SesionUsuario(usuario, credencial.getNombre(), credencial.getRol()));
  }
}
