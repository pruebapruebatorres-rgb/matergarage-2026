package com.tallerpro.api.seed;

import com.tallerpro.api.entity.ConfigEntry;
import com.tallerpro.api.entity.Credencial;
import com.tallerpro.api.entity.EntityRecord;
import com.tallerpro.api.repository.ConfigEntryRepository;
import com.tallerpro.api.repository.CredencialRepository;
import com.tallerpro.api.repository.EntityRecordRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Carga los mismos datos de ejemplo que antes vivían en el frontend
 * (frontend/src/lib/entities.ts → {@code ENTITIES[...].seed}) y las credenciales que vivían en
 * frontend/src/lib/store.tsx → {@code CREDENCIALES}, ahora persistidas en el backend. Solo corre
 * si las tablas están vacías, así que es seguro reiniciar la aplicación sin duplicar datos.
 */
@Component
public class DataSeeder implements CommandLineRunner {

  private final EntityRecordRepository entityRecordRepository;
  private final ConfigEntryRepository configEntryRepository;
  private final CredencialRepository credencialRepository;
  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public DataSeeder(
      EntityRecordRepository entityRecordRepository,
      ConfigEntryRepository configEntryRepository,
      CredencialRepository credencialRepository) {
    this.entityRecordRepository = entityRecordRepository;
    this.configEntryRepository = configEntryRepository;
    this.credencialRepository = credencialRepository;
  }

  @Override
  public void run(String... args) {
    if (entityRecordRepository.count() == 0) {
      seedEntities();
    }
    if (configEntryRepository.count() == 0) {
      seedConfig();
    }
    if (credencialRepository.count() == 0) {
      seedCredenciales();
    }
  }

  // ---------------------------------------------------------------------
  // Credenciales (frontend/src/lib/store.tsx → CREDENCIALES)
  // ---------------------------------------------------------------------

  private void seedCredenciales() {
    credencialRepository.save(
        new Credencial("crestrepo", passwordEncoder.encode("admin123"), "Carlos Restrepo", "ADMIN"));
    credencialRepository.save(
        new Credencial("amolina", passwordEncoder.encode("mec123"), "Andrés Molina", "MECANICO"));
  }

  // ---------------------------------------------------------------------
  // Configuración (frontend/src/lib/store.tsx → CONFIG_INICIAL)
  // ---------------------------------------------------------------------

  private void seedConfig() {
    Map<String, String> config = new LinkedHashMap<>();
    config.put("nombre", "TallerPro Automotriz S.A.S.");
    config.put("nit", "901554221-7");
    config.put("direccion", "Cra 48 #32-90, Bodega 4");
    config.put("telefono", "604 444 1122");
    config.put("correo", "contacto@tallerpro.co");
    config.put("web", "www.tallerpro.co");
    config.put("iva", "19");
    config.put("moneda", "COP");
    config.put("zonaHoraria", "America/Bogota");
    config.put("prefijoOrden", "OT-2026-");
    config.put("prefijoFactura", "FAC-2026-");
    config.put("garantiaDefecto", "90");
    config.forEach((clave, valor) -> configEntryRepository.save(new ConfigEntry(clave, valor)));
  }

  // ---------------------------------------------------------------------
  // Datos de ejemplo por módulo (frontend/src/lib/entities.ts → ENTITIES[...].seed)
  // ---------------------------------------------------------------------

  private void seedEntities() {
    persist("usuarios", usuarios());
    persist("clientes", clientes());
    persist("vehiculos", vehiculos());
    persist("recepcion", recepcion());
    persist("diagnosticos", diagnosticos());
    persist("cotizaciones", cotizaciones());
    persist("ordenes", ordenes());
    persist("mantenimiento", mantenimiento());
    persist("servicios", servicios());
    persist("proveedores", proveedores());
    persist("inventario", inventario());
    persist("movimientos", movimientos());
    persist("compras", compras());
    persist("repuestosOrden", repuestosOrden());
    persist("manoObra", manoObra());
    persist("facturas", facturas());
    persist("entregas", entregas());
    persist("garantias", garantias());
    persist("notificaciones", notificaciones());
    persist("auditoria", auditoria());
  }

  private List<SeedRow> usuarios() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "u1", "documento", "1094921233", "nombre", "Carlos", "apellidos", "Restrepo Ávila", "usuario",
            "crestrepo", "correo", "admin@tallerpro.co", "telefono", "3104458821", "rol", "Administrador",
            "estado", "Activo"));
    filas.add(
        r(
            "u2", "documento", "1032445119", "nombre", "Andrés", "apellidos", "Molina Cruz", "usuario", "amolina",
            "correo", "amolina@tallerpro.co", "telefono", "3115562210", "rol", "Mecánico", "estado", "Activo"));
    filas.add(
        r(
            "u3", "documento", "80112233", "nombre", "Julián", "apellidos", "Ospina Vera", "usuario", "jospina",
            "correo", "jospina@tallerpro.co", "telefono", "3009987744", "rol", "Mecánico", "estado", "Bloqueado"));
    return filas;
  }

  private List<SeedRow> clientes() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "c1", "tipoDocumento", "CC", "documento", "1017556421", "nombre", "María Fernanda", "apellidos",
            "Gómez Ruiz", "telefono", "3126647781", "telefono2", "", "correo", "mf.gomez@correo.com", "direccion",
            "Cra 45 #12-34", "ciudad", "Medellín", "estado", "Activo", "observaciones",
            "Cliente frecuente, flota de 2 vehículos."));
    filas.add(
        r(
            "c2", "tipoDocumento", "NIT", "documento", "900455112-3", "nombre", "Transportes Andinos",
            "apellidos", "S.A.S.", "telefono", "6045551020", "telefono2", "3155540011", "correo",
            "compras@transandinos.co", "direccion", "Autopista Sur km 4", "ciudad", "Itagüí", "estado", "Activo",
            "observaciones", "Facturación a 30 días."));
    filas.add(
        r(
            "c3", "tipoDocumento", "CC", "documento", "71554332", "nombre", "Jorge Iván", "apellidos", "Cardona",
            "telefono", "3004458812", "telefono2", "", "correo", "jicardona@correo.com", "direccion",
            "Calle 10 #8-20", "ciudad", "Envigado", "estado", "Inactivo", "observaciones", ""));
    return filas;
  }

  private List<SeedRow> vehiculos() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "v1", "placa", "KIA412", "cliente", "María Fernanda Gómez", "marca", "Mazda", "linea", "CX-30",
            "modelo", "Touring", "anio", 2021, "color", "Gris titanio", "vin", "JM3KFBCM1M0334512", "motor",
            "PE20-441233", "chasis", "CH-99231", "cilindraje", "2000cc", "combustible", "Gasolina", "transmision",
            "Automática", "kilometraje", 48250, "estado", "Activo", "observaciones", ""));
    filas.add(
        r(
            "v2", "placa", "TWQ889", "cliente", "Transportes Andinos S.A.S.", "marca", "Chevrolet", "linea",
            "NPR", "modelo", "Reward", "anio", 2019, "color", "Blanco", "vin", "9GDNPR75XKB012884", "motor",
            "4JJ1-882110", "chasis", "CH-44120", "cilindraje", "3000cc", "combustible", "Diésel", "transmision",
            "Manual", "kilometraje", 214300, "estado", "Activo", "observaciones", "Uso intensivo de carga."));
    filas.add(
        r(
            "v3", "placa", "HRT205", "cliente", "Jorge Iván Cardona", "marca", "Renault", "linea", "Duster",
            "modelo", "Intens", "anio", 2018, "color", "Rojo fuego", "vin", "93YHSR2H5JJ221904", "motor",
            "H4M-119822", "chasis", "CH-11223", "cilindraje", "1600cc", "combustible", "Gasolina", "transmision",
            "Manual", "kilometraje", 96700, "estado", "Activo", "observaciones", ""));
    return filas;
  }

  private List<SeedRow> recepcion() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "r1", "consecutivo", "ING-2026-0148", "placa", "KIA412", "cliente", "María Fernanda Gómez", "fecha",
            "2026-08-06", "hora", "08:15", "kilometraje", 48250, "combustibleNivel", "1/2", "motivo",
            "Ruido en suspensión delantera y mantenimiento de 50.000 km.", "estado", "Abierto"));
    filas.add(
        r(
            "r2", "consecutivo", "ING-2026-0147", "placa", "TWQ889", "cliente", "Transportes Andinos S.A.S.",
            "fecha", "2026-08-05", "hora", "07:40", "kilometraje", 214300, "combustibleNivel", "3/4", "motivo",
            "Revisión de frenos y cambio de aceite.", "estado", "Cerrado"));
    return filas;
  }

  private List<SeedRow> diagnosticos() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "d1", "codigo", "DX-0921", "placa", "KIA412", "mecanico", "Andrés Molina", "falla",
            "Golpeteo al pasar reductores", "diagnostico",
            "Amortiguadores delanteros con fuga de aceite y bujes desgastados.", "causa",
            "Desgaste natural por kilometraje.", "solucion", "Reemplazo de par de amortiguadores y kit de bujes.",
            "prioridad", "Alta", "aprobacion", "Aprobada"));
    filas.add(
        r(
            "d2", "codigo", "DX-0922", "placa", "TWQ889", "mecanico", "Julián Ospina", "falla",
            "Pedal de freno esponjoso", "diagnostico", "Aire en el circuito hidráulico y pastillas al límite.",
            "causa", "Mantenimiento vencido.", "solucion", "Purga de sistema y cambio de pastillas delanteras.",
            "prioridad", "Crítica", "aprobacion", "Pendiente"));
    return filas;
  }

  private List<SeedRow> cotizaciones() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "q1", "numero", "COT-2026-0331", "version", 2, "cliente", "María Fernanda Gómez", "placa", "KIA412",
            "diagnostico", "DX-0921", "fecha", "2026-08-06", "vencimiento", "2026-08-20", "subtotal", 1420000,
            "iva", 269800, "descuento", 50000, "total", 1639800, "estado", "Aprobada"));
    filas.add(
        r(
            "q2", "numero", "COT-2026-0332", "version", 1, "cliente", "Transportes Andinos S.A.S.", "placa",
            "TWQ889", "diagnostico", "DX-0922", "fecha", "2026-08-05", "vencimiento", "2026-08-12", "subtotal",
            890000, "iva", 169100, "descuento", 0, "total", 1059100, "estado", "Vigente"));
    return filas;
  }

  private List<SeedRow> ordenes() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "o1", "numero", "OT-2026-0512", "fecha", "2026-08-06", "cliente", "María Fernanda Gómez", "placa",
            "KIA412", "mecanico", "Andrés Molina", "responsable", "Carlos Restrepo", "estado", "En reparación",
            "total", 1639800, "observaciones", "Cliente aprobó cotización versión 2."));
    filas.add(
        r(
            "o2", "numero", "OT-2026-0511", "fecha", "2026-08-05", "cliente", "Transportes Andinos S.A.S.",
            "placa", "TWQ889", "mecanico", "Julián Ospina", "responsable", "Carlos Restrepo", "estado",
            "Esperando aprobación", "total", 1059100, "observaciones", ""));
    filas.add(
        r(
            "o3", "numero", "OT-2026-0509", "fecha", "2026-08-03", "cliente", "Jorge Iván Cardona", "placa",
            "HRT205", "mecanico", "Andrés Molina", "responsable", "Carlos Restrepo", "estado",
            "Lista para entrega", "total", 480000, "observaciones", "Pendiente facturación."));
    return filas;
  }

  private List<SeedRow> mantenimiento() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "m1", "orden", "OT-2026-0512", "actividad", "Cambio de amortiguadores", "mecanico", "Andrés Molina",
            "horaInicio", "09:00", "horaFin", "11:30", "horasHombre", 2.5, "estado", "Finalizada",
            "observaciones", "Se recomienda alineación posterior."));
    filas.add(
        r(
            "m2", "orden", "OT-2026-0512", "actividad", "Alineación y balanceo", "mecanico", "Andrés Molina",
            "horaInicio", "11:40", "horaFin", "", "horasHombre", 0, "estado", "En proceso", "observaciones", ""));
    return filas;
  }

  private List<SeedRow> servicios() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "s1", "codigo", "SRV-001", "nombre", "Cambio de aceite y filtro", "categoria", "Preventivo",
            "tiempoEstimado", 0.8, "precio", 95000, "garantiaDias", 90, "estado", "Activo"));
    filas.add(
        r(
            "s2", "codigo", "SRV-014", "nombre", "Cambio de pastillas de freno", "categoria", "Frenos",
            "tiempoEstimado", 1.5, "precio", 160000, "garantiaDias", 180, "estado", "Activo"));
    filas.add(
        r(
            "s3", "codigo", "SRV-022", "nombre", "Escaneo electrónico completo", "categoria", "Diagnóstico",
            "tiempoEstimado", 1, "precio", 80000, "garantiaDias", 0, "estado", "Activo"));
    filas.add(
        r(
            "s4", "codigo", "SRV-031", "nombre", "Cambio de amortiguadores", "categoria", "Suspensión",
            "tiempoEstimado", 3, "precio", 320000, "garantiaDias", 180, "estado", "Activo"));
    return filas;
  }

  private List<SeedRow> proveedores() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "p1", "nit", "890900608-9", "razonSocial", "Distribuidora Autopartes del Valle S.A.S.",
            "nombreComercial", "Autopartes Valle", "contacto", "Luz Marina Peña", "telefono", "6023344551",
            "correo", "ventas@apvalle.co", "direccion", "Cll 70 #22-11", "ciudad", "Cali", "estado", "Activo",
            "observaciones", ""));
    filas.add(
        r(
            "p2", "nit", "811022114-2", "razonSocial", "Lubricantes y Filtros Andinos Ltda.", "nombreComercial",
            "Lufan", "contacto", "Diego Sánchez", "telefono", "6044412200", "correo", "pedidos@lufan.co",
            "direccion", "Cra 50 #30-08", "ciudad", "Medellín", "estado", "Activo", "observaciones",
            "Entrega en 24 horas."));
    filas.add(
        r(
            "p3", "nit", "830112009-4", "razonSocial", "Frenos Técnicos Nacionales S.A.", "nombreComercial",
            "Fretec", "contacto", "Paula Ríos", "telefono", "6017788990", "correo", "info@fretec.co",
            "direccion", "Zona Industrial Bod 12", "ciudad", "Bogotá", "estado", "Inactivo", "observaciones", ""));
    return filas;
  }

  private List<SeedRow> inventario() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "i1", "codigo", "RP-1001", "codigoBarras", "7701234500019", "nombre", "Aceite sintético 5W-30",
            "marca", "Mobil", "referencia", "M15W30-4L", "categoria", "Aceites", "unidad", "Galón", "stock", 24,
            "stockMin", 8, "stockMax", 60, "ubicacion", "A-01-3", "precioCompra", 118000, "precioVenta", 165000,
            "iva", 19, "proveedor", "Lufan", "garantiaDias", 0, "estado", "Activo", "descripcion", ""));
    filas.add(
        r(
            "i2", "codigo", "RP-1042", "codigoBarras", "7701234500422", "nombre", "Filtro de aceite", "marca",
            "Mann", "referencia", "W71280", "categoria", "Filtros", "unidad", "Unidad", "stock", 6, "stockMin",
            10, "stockMax", 40, "ubicacion", "B-02-1", "precioCompra", 24000, "precioVenta", 39000, "iva", 19,
            "proveedor", "Lufan", "garantiaDias", 90, "estado", "Activo", "descripcion", ""));
    filas.add(
        r(
            "i3", "codigo", "RP-2210", "codigoBarras", "7701234522104", "nombre",
            "Pastillas de freno delanteras", "marca", "Fretec", "referencia", "FT-D2210", "categoria", "Frenos",
            "unidad", "Juego", "stock", 0, "stockMin", 4, "stockMax", 20, "ubicacion", "C-01-2", "precioCompra",
            96000, "precioVenta", 158000, "iva", 19, "proveedor", "Fretec", "garantiaDias", 180, "estado",
            "Activo", "descripcion", "Agotado, pedido en tránsito."));
    filas.add(
        r(
            "i4", "codigo", "RP-3301", "codigoBarras", "7701234533015", "nombre", "Amortiguador delantero",
            "marca", "Monroe", "referencia", "MN-3301", "categoria", "Suspensión", "unidad", "Unidad", "stock",
            5, "stockMin", 2, "stockMax", 12, "ubicacion", "D-03-4", "precioCompra", 210000, "precioVenta",
            315000, "iva", 19, "proveedor", "Autopartes Valle", "garantiaDias", 365, "estado", "Activo",
            "descripcion", ""));
    filas.add(
        r(
            "i5", "codigo", "RP-4400", "codigoBarras", "7701234544009", "nombre", "Batería 12V 60Ah", "marca",
            "Willard", "referencia", "W-60D", "categoria", "Baterías", "unidad", "Unidad", "stock", 3, "stockMin",
            3, "stockMax", 10, "ubicacion", "E-01-1", "precioCompra", 320000, "precioVenta", 465000, "iva", 19,
            "proveedor", "Autopartes Valle", "garantiaDias", 365, "estado", "Activo", "descripcion", ""));
    return filas;
  }

  private List<SeedRow> movimientos() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "k1", "fecha", "2026-08-06", "hora", "10:12", "repuesto", "RP-3301 Amortiguador delantero", "tipo",
            "Salida", "cantidad", 2, "saldo", 5, "documento", "OT-2026-0512", "usuario", "amolina", "observacion",
            "Consumo en orden de trabajo."));
    filas.add(
        r(
            "k2", "fecha", "2026-08-05", "hora", "16:40", "repuesto", "RP-1042 Filtro de aceite", "tipo",
            "Entrada", "cantidad", 12, "saldo", 6, "documento", "COM-2026-0088", "usuario", "crestrepo",
            "observacion", "Compra a Lufan."));
    filas.add(
        r(
            "k3", "fecha", "2026-08-04", "hora", "09:05", "repuesto", "RP-2210 Pastillas de freno delanteras",
            "tipo", "Salida", "cantidad", 4, "saldo", 0, "documento", "OT-2026-0509", "usuario", "jospina",
            "observacion", ""));
    filas.add(
        r(
            "k4", "fecha", "2026-08-03", "hora", "11:20", "repuesto", "RP-1001 Aceite sintético 5W-30", "tipo",
            "Ajuste", "cantidad", -1, "saldo", 24, "documento", "AJU-0031", "usuario", "crestrepo", "observacion",
            "Diferencia en conteo físico."));
    return filas;
  }

  private List<SeedRow> compras() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "cp1", "numero", "COM-2026-0088", "proveedor", "Lufan", "fecha", "2026-08-05", "factura", "FV-88214",
            "formaPago", "Crédito 30 días", "items", 3, "subtotal", 1240000, "iva", 235600, "total", 1475600,
            "estado", "Confirmada", "observaciones", ""));
    filas.add(
        r(
            "cp2", "numero", "COM-2026-0089", "proveedor", "Fretec", "fecha", "2026-08-06", "factura", "FE-2211",
            "formaPago", "Contado", "items", 1, "subtotal", 384000, "iva", 72960, "total", 456960, "estado",
            "Borrador", "observaciones", "Pendiente confirmar recepción física."));
    return filas;
  }

  private List<SeedRow> repuestosOrden() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "ru1", "orden", "OT-2026-0512", "repuesto", "RP-3301 Amortiguador delantero", "cantidad", 2,
            "precioUnitario", 315000, "iva", 19, "descuento", 0, "total", 749700, "instalacion", "2026-08-06",
            "vencimientoGarantia", "2027-08-06", "lote", "L-2299", "serie", "", "estado", "Instalado",
            "observaciones", ""));
    filas.add(
        r(
            "ru2", "orden", "OT-2026-0509", "repuesto", "RP-2210 Pastillas de freno delanteras", "cantidad", 1,
            "precioUnitario", 158000, "iva", 19, "descuento", 10000, "total", 176120, "instalacion",
            "2026-08-03", "vencimientoGarantia", "2027-02-03", "lote", "L-8871", "serie", "", "estado",
            "Instalado", "observaciones", ""));
    return filas;
  }

  private List<SeedRow> manoObra() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "mo1", "orden", "OT-2026-0512", "actividad", "Cambio de amortiguadores", "mecanico", "Andrés Molina",
            "horas", 2.5, "valorHora", 45000, "total", 112500, "observaciones", ""));
    filas.add(
        r(
            "mo2", "orden", "OT-2026-0509", "actividad", "Cambio de pastillas", "mecanico", "Julián Ospina",
            "horas", 1.5, "valorHora", 45000, "total", 67500, "observaciones", ""));
    return filas;
  }

  private List<SeedRow> facturas() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "f1", "numero", "FAC-2026-0301", "fecha", "2026-08-03", "orden", "OT-2026-0509", "cliente",
            "Jorge Iván Cardona", "documento", "71554332", "placa", "HRT205", "kilometraje", 96700, "mecanico",
            "Andrés Molina", "subtotal", 403361, "iva", 76639, "descuento", 0, "total", 480000, "metodoPago",
            "Efectivo", "estado", "Pagada", "observaciones", ""));
    filas.add(
        r(
            "f2", "numero", "FAC-2026-0302", "fecha", "2026-08-05", "orden", "OT-2026-0505", "cliente",
            "Transportes Andinos S.A.S.", "documento", "900455112-3", "placa", "TWQ889", "kilometraje", 213900,
            "mecanico", "Julián Ospina", "subtotal", 890000, "iva", 169100, "descuento", 0, "total", 1059100,
            "metodoPago", "Crédito", "estado", "Parcialmente pagada", "observaciones", "Abono del 50%."));
    return filas;
  }

  private List<SeedRow> entregas() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "e1", "acta", "ACT-2026-0210", "orden", "OT-2026-0509", "placa", "HRT205", "fecha", "2026-08-03",
            "hora", "17:20", "recibe", "Jorge Iván Cardona", "documento", "71554332", "proximoMantenimiento",
            "101.700 km o 6 meses", "estado", "Entregado", "observaciones", "Revisar alineación en 1.000 km."));
    return filas;
  }

  private List<SeedRow> garantias() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "g1", "tipo", "Repuesto", "descripcion", "Amortiguador delantero Monroe MN-3301", "cliente",
            "María Fernanda Gómez", "placa", "KIA412", "orden", "OT-2026-0512", "inicio", "2026-08-06", "vence",
            "2027-08-06", "estado", "Vigente", "condiciones", "No cubre daño por impacto."));
    filas.add(
        r(
            "g2", "tipo", "Servicio", "descripcion", "Cambio de pastillas de freno", "cliente",
            "Jorge Iván Cardona", "placa", "HRT205", "orden", "OT-2026-0509", "inicio", "2026-08-03", "vence",
            "2026-08-31", "estado", "Por vencer", "condiciones", "Sujeta a uso normal."));
    return filas;
  }

  private List<SeedRow> notificaciones() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "n1", "fecha", "2026-08-06", "tipo", "Stock mínimo", "mensaje",
            "RP-1042 Filtro de aceite por debajo del mínimo (6 de 10).", "prioridad", "Alta", "estado",
            "No leída"));
    filas.add(
        r(
            "n2", "fecha", "2026-08-06", "tipo", "Stock mínimo", "mensaje",
            "RP-2210 Pastillas de freno delanteras agotado.", "prioridad", "Crítica", "estado", "No leída"));
    filas.add(
        r(
            "n3", "fecha", "2026-08-06", "tipo", "Garantía por vencer", "mensaje",
            "Garantía de servicio de HRT205 vence en 25 días.", "prioridad", "Media", "estado", "Leída"));
    filas.add(
        r(
            "n4", "fecha", "2026-08-05", "tipo", "Cotización vencida", "mensaje",
            "COT-2026-0329 superó su fecha de vigencia.", "prioridad", "Baja", "estado", "Leída"));
    return filas;
  }

  private List<SeedRow> auditoria() {
    List<SeedRow> filas = new ArrayList<>();
    filas.add(
        r(
            "a1", "fecha", "2026-08-06", "hora", "10:12", "usuario", "amolina", "modulo", "Órdenes", "accion",
            "Cambio de estado", "valorAnterior", "Esperando repuestos", "valorNuevo", "En reparación", "ip",
            "192.168.1.42"));
    filas.add(
        r(
            "a2", "fecha", "2026-08-06", "hora", "09:58", "usuario", "crestrepo", "modulo", "Inventario",
            "accion", "Actualización de precio", "valorAnterior", "155000", "valorNuevo", "165000", "ip",
            "192.168.1.10"));
    filas.add(
        r(
            "a3", "fecha", "2026-08-05", "hora", "16:41", "usuario", "crestrepo", "modulo", "Compras", "accion",
            "Confirmación de compra", "valorAnterior", "Borrador", "valorNuevo", "Confirmada", "ip",
            "192.168.1.10"));
    filas.add(
        r(
            "a4", "fecha", "2026-08-05", "hora", "08:02", "usuario", "jospina", "modulo", "Autenticación",
            "accion", "Bloqueo por 5 intentos fallidos", "valorAnterior", "Activo", "valorNuevo", "Bloqueado",
            "ip", "192.168.1.77"));
    return filas;
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  private void persist(String entidad, List<SeedRow> filas) {
    for (int i = 0; i < filas.size(); i++) {
      SeedRow fila = filas.get(i);
      entityRecordRepository.save(new EntityRecord(fila.id(), entidad, i, fila.payload()));
    }
  }

  /** {@code kv} son pares alternados clave/valor que forman el payload de una fila semilla. */
  private static SeedRow r(String id, Object... kv) {
    Map<String, Object> payload = new LinkedHashMap<>();
    for (int i = 0; i < kv.length; i += 2) {
      payload.put((String) kv[i], kv[i + 1]);
    }
    return new SeedRow(id, payload);
  }

  private record SeedRow(String id, Map<String, Object> payload) {}
}
