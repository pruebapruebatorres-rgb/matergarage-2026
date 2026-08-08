package com.tallerpro.api.service;

import com.tallerpro.api.entity.ConfigEntry;
import com.tallerpro.api.repository.ConfigEntryRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Configuración general del taller — espejo de {@code config}/{@code setConfig} en el frontend. */
@Service
public class ConfigService {

  private final ConfigEntryRepository repository;

  public ConfigService(ConfigEntryRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public Map<String, String> obtenerTodo() {
    Map<String, String> resultado = new LinkedHashMap<>();
    repository.findAll().forEach(e -> resultado.put(e.getClave(), e.getValor()));
    return resultado;
  }

  @Transactional
  public void guardar(String clave, String valor) {
    repository
        .findById(clave)
        .ifPresentOrElse(
            existente -> existente.setValor(valor),
            () -> repository.save(new ConfigEntry(clave, valor)));
  }
}
