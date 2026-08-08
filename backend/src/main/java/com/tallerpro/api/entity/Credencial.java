package com.tallerpro.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Contraseña (hash) de acceso de un usuario interno del taller.
 *
 * <p>{@code id} es el mismo id de la fila correspondiente en la entidad genérica "usuarios"
 * (ver {@link EntityRecord}) — no el nombre de usuario, precisamente para que renombrar el
 * campo "usuario" (o el "nombre") desde el módulo de Usuarios no desconecte la credencial de
 * la persona. Todo lo demás (nombre, usuario, rol, estado) se lee en vivo desde esa fila en el
 * momento del login, así que editarlo ahí se refleja de inmediato la próxima vez que esa
 * persona inicie sesión.
 */
@Entity
@Table(name = "credencial")
public class Credencial {

  @Id private String id;

  @Column(nullable = false)
  private String passwordHash;

  protected Credencial() {
    // JPA
  }

  public Credencial(String id, String passwordHash) {
    this.id = id;
    this.passwordHash = passwordHash;
  }

  public String getId() {
    return id;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }
}
