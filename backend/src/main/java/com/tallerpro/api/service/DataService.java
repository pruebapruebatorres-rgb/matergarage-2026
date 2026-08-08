package com.tallerpro.api.service;

import com.tallerpro.api.entity.EntityRecord;
import com.tallerpro.api.repository.EntityRecordRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * CRUD genérico para cualquier módulo del taller, espejo de las operaciones de
 * {@code useTaller()} en el frontend ({@code crear}, {@code actualizar}, {@code alternarEstado}).
 */
@Service
public class DataService {

  private final EntityRecordRepository repository;

  public DataService(EntityRecordRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public Map<String, List<Map<String, Object>>> obtenerTodo() {
    Map<String, List<Map<String, Object>>> resultado = new LinkedHashMap<>();
    for (String entidad : repository.findDistinctEntityTypes()) {
      resultado.put(entidad, obtenerPorEntidad(entidad));
    }
    return resultado;
  }

  @Transactional(readOnly = true)
  public List<Map<String, Object>> obtenerPorEntidad(String entidad) {
    return repository.findByEntityTypeOrderBySortOrderAsc(entidad).stream()
        .map(EntityRecord::toRow)
        .collect(Collectors.toList());
  }

  @Transactional
  public Map<String, Object> crear(String entidad, Map<String, Object> datos) {
    Long minOrden = repository.findMinSortOrder(entidad);
    long nuevoOrden = (minOrden == null ? 0 : minOrden) - 1;
    String id = entidad + "-" + UUID.randomUUID();
    EntityRecord registro = new EntityRecord(id, entidad, nuevoOrden, new LinkedHashMap<>(datos));
    return repository.save(registro).toRow();
  }

  @Transactional
  public Map<String, Object> actualizar(String entidad, String id, Map<String, Object> parcial) {
    EntityRecord registro = obtenerRegistro(entidad, id);
    registro.mergePayload(parcial);
    return repository.save(registro).toRow();
  }

  @Transactional
  public Map<String, Object> alternarEstado(String entidad, String id) {
    EntityRecord registro = obtenerRegistro(entidad, id);
    Object estadoActual = registro.getPayload().get("estado");
    String nuevoEstado = "Inactivo".equals(estadoActual) ? "Activo" : "Inactivo";
    registro.mergePayload(Map.of("estado", nuevoEstado));
    return repository.save(registro).toRow();
  }

  private EntityRecord obtenerRegistro(String entidad, String id) {
    return repository
        .findByIdAndEntityType(id, entidad)
        .orElseThrow(
            () ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No existe el registro '%s' en '%s'".formatted(id, entidad)));
  }
}
