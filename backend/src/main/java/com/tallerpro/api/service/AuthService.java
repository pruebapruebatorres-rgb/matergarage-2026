package com.tallerpro.api.service;

import com.tallerpro.api.dto.LoginResponse;
import com.tallerpro.api.dto.SesionUsuario;
import com.tallerpro.api.entity.Credencial;
import com.tallerpro.api.entity.EntityRecord;
import com.tallerpro.api.repository.CredencialRepository;
import com.tallerpro.api.repository.EntityRecordRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Autenticación de usuarios internos, espejo de {@code login()} en el frontend
 * (src/lib/store.tsx): bloqueo tras 5 intentos fallidos consecutivos por usuario.
 *
 * <p>La identidad (nombre, usuario, rol, estado) se lee en vivo desde la entidad genérica
 * "usuarios" — no de una copia congelada — para que los cambios hechos desde el módulo de
 * Usuarios (nombre, usuario, rol, bloqueo) se reflejen de inmediato en el próximo login.
 */
@Service
public class AuthService {

  private static final int MAX_INTENTOS = 5;
  private static final int MIN_LARGO_PASSWORD = 4;
  private static final String ENTIDAD_USUARIOS = "usuarios";

  private final EntityRecordRepository entityRecordRepository;
  private final CredencialRepository credencialRepository;
  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
  private final Map<String, Integer> intentosFallidos = new ConcurrentHashMap<>();

  public AuthService(EntityRecordRepository entityRecordRepository, CredencialRepository credencialRepository) {
    this.entityRecordRepository = entityRecordRepository;
    this.credencialRepository = credencialRepository;
  }

  @Transactional(readOnly = true)
  public LoginResponse login(String usuarioIngresado, String password) {
    String usuario = usuarioIngresado == null ? "" : usuarioIngresado.trim().toLowerCase();
    int fallos = intentosFallidos.getOrDefault(usuario, 0);
    if (fallos >= MAX_INTENTOS) {
      return LoginResponse.error("Cuenta bloqueada tras 5 intentos fallidos. Contacte al administrador.");
    }

    EntityRecord fila = buscarPorUsuario(usuario).orElse(null);
    if (fila == null) {
      return registrarFallo(usuario, fallos);
    }

    Map<String, Object> datos = fila.getPayload();
    if (!"Activo".equals(String.valueOf(datos.getOrDefault("estado", "")))) {
      // No cuenta como intento fallido: la cuenta existe, el problema es su estado.
      return LoginResponse.error("La cuenta está inactiva o bloqueada. Contacte al administrador.");
    }

    Credencial credencial = credencialRepository.findById(fila.getId()).orElse(null);
    if (credencial == null) {
      return LoginResponse.error("Este usuario aún no tiene contraseña configurada. Pida a un administrador que la restablezca.");
    }
    if (!passwordEncoder.matches(password == null ? "" : password, credencial.getPasswordHash())) {
      return registrarFallo(usuario, fallos);
    }

    intentosFallidos.remove(usuario);
    return LoginResponse.ok(construirSesion(datos));
  }

  /** Fija (o cambia) la contraseña del usuario cuya fila en "usuarios" tiene este id. */
  @Transactional
  public void resetearContrasena(String usuarioId, String nuevaPassword) {
    if (nuevaPassword == null || nuevaPassword.length() < MIN_LARGO_PASSWORD) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos %d caracteres.".formatted(MIN_LARGO_PASSWORD));
    }
    entityRecordRepository
        .findByIdAndEntityType(usuarioId, ENTIDAD_USUARIOS)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe el usuario '%s'.".formatted(usuarioId)));

    String hash = passwordEncoder.encode(nuevaPassword);
    credencialRepository
        .findById(usuarioId)
        .ifPresentOrElse(
            existente -> existente.setPasswordHash(hash),
            () -> credencialRepository.save(new Credencial(usuarioId, hash)));
  }

  private Optional<EntityRecord> buscarPorUsuario(String usuarioNormalizado) {
    List<EntityRecord> usuarios = entityRecordRepository.findByEntityTypeOrderBySortOrderAsc(ENTIDAD_USUARIOS);
    return usuarios.stream()
        .filter(u -> usuarioNormalizado.equals(String.valueOf(u.getPayload().getOrDefault("usuario", "")).trim().toLowerCase()))
        .findFirst();
  }

  private LoginResponse registrarFallo(String usuario, int fallosPrevios) {
    int nuevosFallos = fallosPrevios + 1;
    intentosFallidos.put(usuario, nuevosFallos);
    return LoginResponse.error("Credenciales incorrectas. Intento %d de %d.".formatted(nuevosFallos, MAX_INTENTOS));
  }

  private SesionUsuario construirSesion(Map<String, Object> datosUsuario) {
    String usuario = String.valueOf(datosUsuario.getOrDefault("usuario", ""));
    String nombre = String.valueOf(datosUsuario.getOrDefault("nombre", "")).trim();
    String apellidos = String.valueOf(datosUsuario.getOrDefault("apellidos", "")).trim();
    String primerApellido = apellidos.isBlank() ? "" : apellidos.split("\\s+")[0];
    String nombreCompleto = (nombre + " " + primerApellido).trim();
    String rolCrudo = String.valueOf(datosUsuario.getOrDefault("rol", ""));
    String rol = "Administrador".equals(rolCrudo) ? "ADMIN" : "MECANICO";
    return new SesionUsuario(usuario, nombreCompleto, rol);
  }
}
