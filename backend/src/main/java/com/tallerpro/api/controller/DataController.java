package com.tallerpro.api.controller;

import com.tallerpro.api.service.DataService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * CRUD genérico para todos los módulos del taller (clientes, vehículos, órdenes, inventario, ...).
 * Consumido por {@code useTaller()} en el frontend (src/lib/store.tsx).
 */
@RestController
@RequestMapping("/api/data")
public class DataController {

  private final DataService dataService;

  public DataController(DataService dataService) {
    this.dataService = dataService;
  }

  @GetMapping
  public Map<String, List<Map<String, Object>>> obtenerTodo() {
    return dataService.obtenerTodo();
  }

  @GetMapping("/{entidad}")
  public List<Map<String, Object>> obtenerPorEntidad(@PathVariable String entidad) {
    return dataService.obtenerPorEntidad(entidad);
  }

  @PostMapping("/{entidad}")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> crear(@PathVariable String entidad, @RequestBody Map<String, Object> datos) {
    return dataService.crear(entidad, datos);
  }

  @PutMapping("/{entidad}/{id}")
  public Map<String, Object> actualizar(
      @PathVariable String entidad, @PathVariable String id, @RequestBody Map<String, Object> parcial) {
    return dataService.actualizar(entidad, id, parcial);
  }

  @PostMapping("/{entidad}/{id}/alternar-estado")
  public Map<String, Object> alternarEstado(@PathVariable String entidad, @PathVariable String id) {
    return dataService.alternarEstado(entidad, id);
  }
}
