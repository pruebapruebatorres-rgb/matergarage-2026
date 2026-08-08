package com.tallerpro.api.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Serializa el mapa dinámico de campos de un {@link com.tallerpro.api.entity.EntityRecord}
 * (equivalente al {@code EntityRow} del frontend: {@code { [campo]: string | number }}) a una
 * columna de texto JSON, y viceversa.
 */
@Converter
public class JsonMapConverter implements AttributeConverter<Map<String, Object>, String> {

  private static final ObjectMapper MAPPER = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(Map<String, Object> attribute) {
    try {
      return MAPPER.writeValueAsString(attribute == null ? Map.of() : attribute);
    } catch (Exception e) {
      throw new IllegalStateException("No fue posible serializar el payload a JSON", e);
    }
  }

  @Override
  public Map<String, Object> convertToEntityAttribute(String dbData) {
    if (dbData == null || dbData.isBlank()) return new LinkedHashMap<>();
    try {
      return MAPPER.readValue(dbData, new TypeReference<LinkedHashMap<String, Object>>() {});
    } catch (Exception e) {
      throw new IllegalStateException("No fue posible deserializar el payload JSON", e);
    }
  }
}
