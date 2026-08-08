package com.tallerpro.api.dto;

public record LoginResponse(boolean ok, String error, SesionUsuario sesion) {

  public static LoginResponse ok(SesionUsuario sesion) {
    return new LoginResponse(true, null, sesion);
  }

  public static LoginResponse error(String mensaje) {
    return new LoginResponse(false, mensaje, null);
  }
}
