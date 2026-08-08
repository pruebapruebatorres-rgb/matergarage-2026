package com.tallerpro.api.entity;

import com.tallerpro.api.converter.JsonMapConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Fila genérica de cualquier módulo del taller (clientes, vehículos, órdenes, inventario, ...).
 *
 * <p>El frontend ya modela cada módulo de forma dinámica ({@code EntityRow = { id, [campo]:
 * string | number }}, definido por {@code ENTITIES} en el cliente), así que en vez de crear una
 * tabla/clase JPA por cada una de las ~20 entidades del taller, se usa un único tipo de fila con
 * un {@code entityType} (clientes, vehiculos, ordenes, ...) y un {@code payload} JSON con los
 * campos propios de ese módulo. Esto evita duplicar el modelo de datos que ya vive en
 * {@code frontend/src/lib/entities.ts} y facilita agregar módulos nuevos sin tocar el backend.
 */
@Entity
@Table(
    name = "entity_record",
    indexes = {@Index(name = "idx_entity_type", columnList = "entityType")})
public class EntityRecord {

  @Id private String id;

  @Column(nullable = false)
  private String entityType;

  /** Orden de presentación dentro del módulo; los registros nuevos se anteponen (menor primero). */
  @Column(nullable = false)
  private long sortOrder;

  // TEXT en vez de CLOB: es un tipo nativo tanto en H2 (dev) como en Postgres (producción en
  // Render); "CLOB" es válido en H2 pero no existe como tipo en Postgres.
  @Convert(converter = JsonMapConverter.class)
  @Column(columnDefinition = "TEXT", nullable = false)
  private Map<String, Object> payload = new LinkedHashMap<>();

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected EntityRecord() {
    // JPA
  }

  public EntityRecord(String id, String entityType, long sortOrder, Map<String, Object> payload) {
    this.id = id;
    this.entityType = entityType;
    this.sortOrder = sortOrder;
    this.payload = payload;
  }

  /** Representación plana `{ id, ...payload }` — la misma forma que `EntityRow` en el frontend. */
  public Map<String, Object> toRow() {
    Map<String, Object> row = new LinkedHashMap<>();
    row.put("id", id);
    row.putAll(payload);
    return row;
  }

  public String getId() {
    return id;
  }

  public String getEntityType() {
    return entityType;
  }

  public long getSortOrder() {
    return sortOrder;
  }

  public Map<String, Object> getPayload() {
    return payload;
  }

  public void setPayload(Map<String, Object> payload) {
    this.payload = payload;
    this.updatedAt = Instant.now();
  }

  public void mergePayload(Map<String, Object> partial) {
    this.payload.putAll(partial);
    this.updatedAt = Instant.now();
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
