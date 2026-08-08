package com.tallerpro.api.dto;

/**
 * Igual forma que {@code SesionUsuario} en el frontend (src/lib/store.tsx). {@code id} es el id
 * de la fila en la entidad "usuarios" — lo usa el frontend para volver a sincronizar nombre/rol
 * en vivo si alguien edita ese usuario mientras tiene la sesión abierta.
 */
public record SesionUsuario(String id, String usuario, String nombre, String rol) {}
