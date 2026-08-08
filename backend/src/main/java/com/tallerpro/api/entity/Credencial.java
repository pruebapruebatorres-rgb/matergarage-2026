package com.tallerpro.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Credencial de acceso de un usuario interno del taller (administrador o mecánico). */
@Entity
@Table(name = "credencial")
public class Credencial {

  @Id private String usuario;

  @Column(nullable = false)
  private String passwordHash;

  @Column(nullable = false)
  private String nombre;

  /** {@code ADMIN} o {@code MECANICO} — ver {@code Rol} en el frontend (src/lib/store.tsx). */
  @Column(nullable = false)
  private String rol;

  protected Credencial() {
    // JPA
  }

  public Credencial(String usuario, String passwordHash, String nombre, String rol) {
    this.usuario = usuario;
    this.passwordHash = passwordHash;
    this.nombre = nombre;
    this.rol = rol;
  }

  public String getUsuario() {
    return usuario;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public String getNombre() {
    return nombre;
  }

  public String getRol() {
    return rol;
  }
}
