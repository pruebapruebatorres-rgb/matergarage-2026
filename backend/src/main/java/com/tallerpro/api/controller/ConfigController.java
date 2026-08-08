package com.tallerpro.api.controller;

import com.tallerpro.api.service.ConfigService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Configuración general del taller — consumido por {@code config`}/{@code setConfig} del frontend. */
@RestController
@RequestMapping("/api/config")
public class ConfigController {

  private final ConfigService configService;

  public ConfigController(ConfigService configService) {
    this.configService = configService;
  }

  public record ValorRequest(String valor) {}

  @GetMapping
  public Map<String, String> obtenerTodo() {
    return configService.obtenerTodo();
  }

  @PutMapping("/{clave}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void guardar(@PathVariable String clave, @RequestBody ValorRequest body) {
    configService.guardar(clave, body.valor());
  }
}
