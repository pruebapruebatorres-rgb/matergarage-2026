package com.tallerpro.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Configuración general del taller (nombre, NIT, IVA, prefijos de orden/factura, ...). */
@Entity
@Table(name = "config_entry")
public class ConfigEntry {

  @Id private String clave;

  // TEXT: tipo nativo tanto en H2 (dev) como en Postgres (producción en Render).
  @Column(columnDefinition = "TEXT", nullable = false)
  private String valor;

  protected ConfigEntry() {
    // JPA
  }

  public ConfigEntry(String clave, String valor) {
    this.clave = clave;
    this.valor = valor;
  }

  public String getClave() {
    return clave;
  }

  public String getValor() {
    return valor;
  }

  public void setValor(String valor) {
    this.valor = valor;
  }
}
