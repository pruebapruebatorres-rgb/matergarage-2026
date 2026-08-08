# AutoMaster Hub

## Estructura del proyecto

El proyecto está dividido en dos aplicaciones independientes:

```
automaster-hub-main/
├── frontend/   React + Vite (SPA) — interfaz del sistema
└── backend/    Java + Spring Boot — API REST y persistencia
```

> **Nota (Lovable):** este repositorio sigue vinculado a Lovable (ver `.lovable/` y el aviso en
> `AGENTS.md`). Lovable espera un proyecto Vite en la raíz, así que tras esta reorganización en
> `frontend/` + `backend/` la sincronización automática de Lovable puede dejar de funcionar como
> antes; edítese con esto en cuenta.

### Backend — `backend/`

Requiere Java 21. No necesita Maven instalado (usa Maven Wrapper):

```bash
cd backend
./mvnw spring-boot:run      # Windows: mvnw.cmd spring-boot:run
```

Levanta en `http://localhost:8080`. Usa una base de datos H2 embebida en archivo
(`backend/data/`), sembrada automáticamente la primera vez con los mismos datos de ejemplo que
antes vivían en el frontend. Credenciales de prueba: `crestrepo` / `admin123` (Administrador) y
`amolina` / `mec123` (Mecánico). En producción (Render) se usa Postgres en su lugar — ver
"Despliegue" abajo.

### Frontend — `frontend/`

```bash
cd frontend
npm install
cp .env.example .env   # ajuste VITE_API_URL si el backend no corre en localhost:8080
npm run dev
```

Levanta en `http://localhost:5173` y consume la API del backend.

---

## Despliegue

**Backend → Render** (Docker + Postgres) · **Frontend → Vercel** (Vite/SPA).

Requiere que este repo esté en GitHub (u otro proveedor Git soportado por Render/Vercel) — ambas
plataformas despliegan conectándose al repositorio, no subiendo archivos a mano.

```bash
git remote add origin <url-de-tu-repo-en-github>
git push -u origin main
```

### 1. Backend en Render

1. En el [dashboard de Render](https://dashboard.render.com) → **New +** → **Blueprint**.
2. Conecta este repositorio. Render detecta `render.yaml` en la raíz y muestra dos recursos para
   crear: la base de datos `mater-garage-db` (Postgres, plan free) y el servicio web
   `mater-garage-api` (build vía `backend/Dockerfile`).
3. Te va a pedir el valor de `CORS_ALLOWED_ORIGINS` (está marcado `sync: false` en el blueprint a
   propósito, porque todavía no existe la URL de Vercel). Déjalo en blanco por ahora — se
   completa en el paso 3.
4. **Apply** / **Create**. La primera build tarda unos minutos (compila el jar con Maven dentro
   del contenedor). Cuando termine, copia la URL pública del servicio, algo como
   `https://mater-garage-api.onrender.com`.

El primer arranque siembra Postgres automáticamente con los mismos datos y credenciales de
prueba que en local (mismo `DataSeeder`).

### 2. Frontend en Vercel

1. En el [dashboard de Vercel](https://vercel.com) → **Add New** → **Project** → importa el mismo
   repositorio.
2. En **Root Directory** selecciona `frontend` (Vercel detecta Vite automáticamente; `vercel.json`
   ya trae el build command, el output y el rewrite para que las rutas de la SPA no den 404 al
   refrescar).
3. En **Environment Variables** agrega `VITE_API_URL` = la URL de Render del paso anterior (p. ej.
   `https://mater-garage-api.onrender.com`).
4. **Deploy**. Copia la URL final (p. ej. `https://mater-garage.vercel.app`).

### 3. Cerrar el círculo: CORS

Vuelve a Render → el servicio `mater-garage-api` → **Environment** → completa
`CORS_ALLOWED_ORIGINS` con la URL de Vercel del paso anterior (varias, separadas por coma, si
también quieres permitir los *preview deployments*) → guarda. Render redespliega solo.

### Notas del plan free

- El servicio web de Render en plan free "duerme" tras ~15 min sin tráfico; la primera petición
  después de eso tarda 30–50 s en responder (arranque en frío). El frontend ya maneja esto: mientras
  el backend no responde muestra la pantalla "No hay conexión con el servidor" con botón
  **Reintentar**, en vez de quedarse vacío en silencio.
- La base de datos Postgres free de Render **expira a los 90 días** y se elimina. Para un uso más
  permanente, pasa la base (y el servicio web, para evitar el arranque en frío) a un plan pago
  antes de esa fecha.

---

necesito que desarrolles este software, frontend reeact+ vite y backend java + spring boot

Sistema de Gestión Integral para Taller Automotriz

1. Rol

Quiero que actúes como un Arquitecto de Software Senior, Solution Architect, Tech Lead Full Stack, Ingeniero de Software Senior, Especialista en UX/UI, Administrador de Bases de Datos y DevOps Engineer, con amplia experiencia desarrollando aplicaciones empresariales de gran escala.

Todo el desarrollo deberá seguir estándares de calidad profesional, arquitectura limpia y buenas prácticas de ingeniería de software.

No quiero un proyecto de ejemplo ni una demostración. Quiero un sistema empresarial, modular, escalable y preparado para producción.

Objetivo del Proyecto

Desarrollar una aplicación de escritorio multiplataforma para la gestión integral de talleres automotrices, utilizando Electron como contenedor de escritorio, React + Vite para el frontend y Java + Spring Boot para el backend.

La aplicación debe permitir administrar clientes, vehículos, mantenimientos, diagnósticos, órdenes de trabajo, inventario de repuestos, compras, facturación, historial técnico, reportes y configuración del taller.

El sistema estará orientado a talleres mecánicos pequeños y medianos, permitiendo llevar un control completo del ciclo de vida de cada vehículo.

Objetivos Específicos

El sistema deberá permitir:

 Registrar clientes.

 Registrar vehículos.

 Registrar usuarios internos.

 Administrar inventario.

 Registrar diagnósticos.

 Crear órdenes de trabajo.

 Registrar mantenimientos.

 Registrar todos los repuestos utilizados.

 Controlar garantías.

 Generar facturas.

 Consultar el historial de cada vehículo.

 Generar reportes administrativos.

 Administrar la configuración del taller.

Alcance

El sistema deberá cubrir todo el proceso operativo de un taller automotriz, desde la recepción del vehículo hasta su entrega, incluyendo la gestión del inventario, los costos de mano de obra, los repuestos utilizados y el historial técnico.

No existirá acceso para clientes externos. Solo usuarios internos podrán utilizar la aplicación.

Usuarios del Sistema

Administrador

Será el usuario con acceso total al sistema.

Podrá:

 Gestionar usuarios.

 Configurar el sistema.

 Registrar clientes.

 Registrar vehículos.

 Administrar inventario.

 Registrar compras.

 Crear órdenes de trabajo.

 Asignar mecánicos.

 Generar reportes.

 Facturar.

 Consultar estadísticas.

 Configurar parámetros del sistema.

Mecánico

Podrá:

 Consultar órdenes asignadas.

 Registrar diagnósticos.

 Registrar actividades realizadas.

 Agregar repuestos utilizados.

 Registrar tiempos de trabajo.

 Registrar observaciones.

 Finalizar órdenes.

No podrá modificar información administrativa.

Especificación General

El sistema deberá administrar completamente la operación de un taller automotriz, desde el registro de clientes y vehículos hasta la entrega final del vehículo, manteniendo un historial técnico completo, controlando el inventario de repuestos, costos de mano de obra y generando reportes administrativos.

Los requisitos funcionales deberán implementarse siguiendo principios de modularidad, escalabilidad, seguridad y reutilización del código.

MÓDULO 1. AUTENTICACIÓN Y USUARIOS

RF-001. Inicio de sesión

El sistema deberá permitir que un usuario autenticado ingrese mediante:

 Nombre de usuario.

 Contraseña.

Reglas de negocio

 La contraseña deberá almacenarse cifrada con BCrypt.

 El sistema deberá validar credenciales.

 El sistema deberá generar un JWT.

 Si las credenciales son incorrectas, mostrará un mensaje de error.

 Después de cinco intentos fallidos consecutivos, la cuenta deberá bloquearse hasta que el administrador la reactive.

RF-002. Cierre de sesión

El usuario podrá cerrar la sesión en cualquier momento.

Reglas

 Invalidar el token.

 Limpiar la sesión.

 Regresar al Login.

RF-003. Gestión de usuarios

Solo el Administrador podrá:

 Crear usuarios.

 Modificar usuarios.

 Eliminar usuarios.

 Activar usuarios.

 Desactivar usuarios.

 Restablecer contraseñas.

Datos

 Documento.

 Nombre.

 Apellidos.

 Usuario.

 Contraseña.

 Correo.

 Teléfono.

 Rol.

 Estado.

RF-004. Roles

El sistema únicamente manejará dos roles:

Administrador

Acceso total.

Mecánico

Acceso únicamente a:

 Diagnósticos.

 Órdenes asignadas.

 Registro de mantenimientos.

 Registro de repuestos utilizados.

 Observaciones.

 Finalización de órdenes.

MÓDULO 2. CLIENTES

RF-005. Registrar cliente

El sistema permitirá registrar clientes.

Campos:

 Documento.

 Tipo documento.

 Nombre.

 Apellidos.

 Teléfono principal.

 Teléfono secundario.

 Correo.

 Dirección.

 Ciudad.

 Observaciones.

Reglas

El documento deberá ser único.

RF-006. Actualizar cliente

Modificar información del cliente.

RF-007. Eliminar cliente

No se eliminarán clientes físicamente.

Se cambiará el estado a:

 Activo.

 Inactivo.

RF-008. Buscar cliente

Buscar por:

 Documento.

 Nombre.

 Teléfono.

La búsqueda deberá ser en tiempo real.

RF-009. Historial del cliente

Mostrar:

 Vehículos registrados.

 Número de mantenimientos.

 Última visita.

 Total invertido.

 Órdenes abiertas.

 Órdenes finalizadas.

MÓDULO 3. VEHÍCULOS

RF-010. Registrar vehículo

Registrar:

 Placa.

 Marca.

 Línea.

 Modelo.

 Año.

 Color.

 VIN.

 Número de motor.

 Número de chasis.

 Cilindraje.

 Combustible.

 Transmisión.

 Kilometraje inicial.

 Observaciones.

Regla

La placa será única.

RF-011. Asociar vehículo

Cada vehículo pertenecerá únicamente a un cliente.

RF-012. Actualizar vehículo

Modificar información general.

No se podrá modificar la placa si existen órdenes registradas.

RF-013. Consultar vehículo

Buscar por:

 Placa.

 Cliente.

 Marca.

 Modelo.

RF-014. Historial técnico

Mostrar:

 Diagnósticos.

 Reparaciones.

 Servicios.

 Facturas.

 Mecánicos.

 Costos.

 Repuestos utilizados.

 Garantías.

 Fotografías.

 Kilometraje histórico.

Nunca eliminar información histórica.

MÓDULO 4. RECEPCIÓN DEL VEHÍCULO

RF-015. Crear orden de ingreso

Registrar:

 Cliente.

 Vehículo.

 Fecha.

 Hora.

 Kilometraje.

 Nivel combustible.

 Motivo ingreso.

 Observaciones.

Generar consecutivo automático.

RF-016. Checklist

Registrar estado de:

 Luces.

 Llantas.

 Rines.

 Espejos.

 Radio.

 Vidrios.

 Limpiabrisas.

 Aire acondicionado.

 Herramientas.

 Llanta de repuesto.

 Botiquín.

 Extintor.

 Triángulos.

 Gato.

Cada elemento podrá tener:

 Bueno.

 Regular.

 Malo.

 No aplica.

RF-017. Registro fotográfico

Permitir almacenar fotografías del vehículo.

Categorías:

 Frontal.

 Trasera.

 Lateral izquierdo.

 Lateral derecho.

 Interior.

 Motor.

 Otros daños.

MÓDULO 5. DIAGNÓSTICO

RF-018. Registrar diagnóstico

Registrar:

 Falla reportada.

 Diagnóstico técnico.

 Causa.

 Solución propuesta.

 Prioridad.

RF-019. Prioridad

Las prioridades serán:

 Baja.

 Media.

 Alta.

 Crítica.

RF-020. Cotización

El sistema permitirá construir una cotización utilizando:

Servicios.

Repuestos.

Mano de obra.

Impuestos.

Descuentos.

RF-021. Estados de aprobación

 Pendiente.

 Aprobada.

 Rechazada.

 Parcialmente aprobada.

MÓDULO 6. ÓRDENES DE TRABAJO

RF-022. Crear orden

Generar automáticamente:

Número.

Fecha.

Estado.

Responsable.

RF-023. Estados

 Pendiente.

 Diagnóstico.

 Esperando aprobación.

 Esperando repuestos.

 En reparación.

 En pruebas.

 Lista para entrega.

 Entregada.

 Cancelada.

RF-024. Asignar mecánico

Permitir asignar uno o varios mecánicos.

Registrar:

Fecha.

Hora.

Usuario.

RF-025. Cambio de estado

Cada cambio deberá registrarse en la bitácora.

MÓDULO 7. MANTENIMIENTO

RF-026. Registrar actividades

Cada orden podrá contener múltiples actividades.

Ejemplo:

 Cambio aceite.

 Cambio filtros.

 Cambio batería.

 Cambio amortiguadores.

 Cambio suspensión.

 Cambio frenos.

 Cambio embrague.

 Cambio correa.

 Cambio bomba agua.

 Reparación caja.

 Reparación motor.

 Afinación.

 Balanceo.

 Alineación.

 Escaneo electrónico.

RF-027. Actividades personalizadas

El mecánico podrá registrar actividades no existentes en el catálogo.

RF-028. Registro de tiempos

Registrar:

 Hora inicio.

 Hora fin.

 Tiempo total.

 Horas hombre.

RF-029. Observaciones

Registrar observaciones técnicas.

MÓDULO 8. SERVICIOS

RF-030. Catálogo de servicios

Cada servicio tendrá:

 Código.

 Nombre.

 Categoría.

 Tiempo estimado.

 Precio sugerido.

 Estado.

RF-031. CRUD de servicios

Solo el Administrador podrá:

 Crear.

 Editar.

 Eliminar (lógicamente).

 Activar.

 Desactivar.

RF-032. Agregar servicios a la orden

Una orden podrá contener múltiples servicios.

Cada servicio registrará:

 Cantidad.

 Valor unitario.

 Descuento.

 IVA.

 Total.

Hasta aquí se completa la primera parte de los requisitos funcionales (RF-001 al RF-032), cubriendo autenticación, clientes, vehículos, recepción, diagnóstico, órdenes de trabajo, mantenimiento y catálogo de servicios.

En el siguiente capítulo continuaremos con los módulos de Inventario, Repuestos, Compras, Proveedores, Facturación, Historial, Reportes, Configuración y Auditoría, además de incorporar las reglas de negocio específicas para cada proceso, completando un documento de especificación funcional de nivel empresarial.

sigue

Excelente. A partir de este punto comenzamos los módulos más importantes del sistema: Inventario, Repuestos y Compras. Estos módulos son el corazón del software porque se integran directamente con las órdenes de trabajo y la facturación. El objetivo es que el sistema sea comparable con soluciones comerciales utilizadas en talleres automotrices.

PROMPT MAESTRO

CAPÍTULO 3 – REQUISITOS FUNCIONALES (Continuación)

MÓDULO 9. PROVEEDORES

RF-033. Registrar proveedor

El sistema deberá permitir registrar proveedores de repuestos e insumos.

Campos obligatorios:

 NIT o documento.

 Razón social.

 Nombre comercial.

 Persona de contacto.

 Teléfono.

 Correo electrónico.

 Dirección.

 Ciudad.

 Estado (Activo/Inactivo).

 Observaciones.

Reglas de negocio

 El NIT no podrá repetirse.

 No se permitirá eliminar proveedores que tengan compras registradas; solo podrán inactivarse.

RF-034. Actualizar proveedor

El administrador podrá modificar la información del proveedor.

RF-035. Consultar proveedores

Permitir búsquedas por:

 NIT.

 Nombre.

 Ciudad.

 Estado.

La búsqueda deberá ser dinámica y con paginación.

MÓDULO 10. INVENTARIO DE REPUESTOS

RF-036. Registrar repuesto

El sistema deberá permitir registrar cada repuesto del inventario.

Datos del repuesto

 Código interno.

 Código de barras (opcional).

 Nombre.

 Marca.

 Referencia.

 Categoría.

 Descripción.

 Unidad de medida.

 Stock actual.

 Stock mínimo.

 Stock máximo.

 Ubicación física.

 Precio de compra.

 Precio de venta.

 IVA.

 Proveedor principal.

 Garantía.

 Estado.

Regla

El código del repuesto será único.

RF-037. Categorías de repuestos

El sistema permitirá administrar categorías como:

 Aceites.

 Filtros.

 Frenos.

 Suspensión.

 Dirección.

 Motor.

 Caja de cambios.

 Embrague.

 Refrigeración.

 Eléctrico.

 Llantas.

 Baterías.

 Sensores.

 Lubricantes.

 Accesorios.

 Otros.

El administrador podrá crear nuevas categorías.

RF-038. Consultar inventario

La consulta permitirá filtrar por:

 Código.

 Nombre.

 Marca.

 Categoría.

 Stock.

 Proveedor.

RF-039. Actualizar inventario

El administrador podrá modificar:

 Precio.

 Ubicación.

 Stock mínimo.

 Stock máximo.

 Garantía.

 Estado.

RF-040. Movimientos de inventario

Todo movimiento deberá quedar registrado.

Tipos:

 Entrada.

 Salida.

 Ajuste.

 Devolución.

 Traslado (si en el futuro existen sucursales).

Cada movimiento almacenará:

 Fecha.

 Hora.

 Usuario.

 Tipo.

 Cantidad.

 Observación.

No se permitirá eliminar movimientos.

RF-041. Kardex

El sistema deberá generar automáticamente un Kardex por cada repuesto.

Mostrará:

 Entradas.

 Salidas.

 Existencias.

 Usuario responsable.

 Documento asociado.

RF-042. Stock mínimo

Cuando un repuesto llegue al stock mínimo, el sistema deberá generar una alerta visible en el Dashboard.

RF-043. Stock agotado

Cuando el stock sea igual a cero:

 No podrá agregarse el repuesto a una nueva orden de trabajo.

 El sistema notificará al usuario.

MÓDULO 11. COMPRAS

RF-044. Registrar compra

El administrador podrá registrar compras de repuestos.

Información:

 Proveedor.

 Fecha.

 Número de factura.

 Forma de pago.

 Observaciones.

RF-045. Agregar productos a la compra

Cada compra podrá contener múltiples productos.

Cada producto registrará:

 Repuesto.

 Cantidad.

 Precio unitario.

 IVA.

 Descuento.

 Total.

RF-046. Actualización automática del inventario

Al confirmar una compra:

 Incrementar el stock.

 Actualizar el costo promedio (si aplica).

 Registrar el movimiento de entrada.

 Actualizar el Kardex.

RF-047. Historial de compras

Consultar todas las compras realizadas.

Filtros:

 Fecha.

 Proveedor.

 Número de factura.

MÓDULO 12. REPUESTOS UTILIZADOS EN EL MANTENIMIENTO

RF-048. Agregar repuestos

Durante la ejecución de una orden de trabajo, el mecánico podrá agregar todos los repuestos utilizados.

Cada registro incluirá:

 Repuesto.

 Cantidad.

 Precio unitario.

 IVA.

 Descuento.

 Total.

 Observaciones.

Una orden podrá tener cualquier cantidad de repuestos.

RF-049. Validación de existencias

Antes de agregar un repuesto, el sistema deberá verificar:

 Existencia disponible.

 Estado del repuesto.

 Que no esté descontinuado.

RF-050. Descuento automático

Cuando una orden cambie al estado Finalizada, el sistema deberá:

 Descontar automáticamente el inventario.

 Registrar el movimiento de salida.

 Actualizar el Kardex.

 Relacionar el movimiento con la orden de trabajo.

RF-051. Devolución de repuestos

Si un repuesto fue agregado por error:

El administrador podrá devolverlo al inventario.

La devolución deberá:

 Incrementar el stock.

 Registrar un movimiento de devolución.

 Actualizar el Kardex.

 Registrar quién realizó la devolución.

RF-052. Garantía del repuesto

Cada repuesto instalado deberá registrar:

 Fecha de instalación.

 Fecha de vencimiento.

 Tiempo de garantía.

 Número de lote (si aplica).

 Número de serie (si aplica).

MÓDULO 13. MANO DE OBRA

RF-053. Registrar mano de obra

Cada orden podrá registrar:

 Horas trabajadas.

 Valor por hora.

 Total.

 Mecánico responsable.

RF-054. Mano de obra por actividad

Cada actividad podrá tener:

 Tiempo invertido.

 Responsable.

 Valor.

Esto permitirá conocer el costo exacto de cada reparación.

MÓDULO 14. COTIZACIONES

RF-055. Crear cotización

La cotización deberá contener:

 Cliente.

 Vehículo.

 Diagnóstico.

 Servicios.

 Mano de obra.

 Repuestos.

 Impuestos.

 Descuentos.

 Total.

RF-056. Versiones de cotización

Una misma orden podrá tener varias versiones de la cotización.

Cada versión almacenará:

 Fecha.

 Usuario.

 Estado.

 Observaciones.

RF-057. Conversión de cotización

Una cotización aprobada podrá convertirse automáticamente en una orden de trabajo sin volver a ingresar la información.

RF-058. Rechazo parcial

El cliente podrá aprobar solo algunos servicios.

El sistema deberá permitir:

 Eliminar servicios rechazados.

 Mantener únicamente los aprobados.

 Recalcular automáticamente el valor total.

RF-059. Vigencia de la cotización

Toda cotización tendrá:

 Fecha de creación.

 Fecha de vencimiento.

 Estado:

 Vigente.

 Vencida.

 Aprobada.

 Rechazada.

Con estos requisitos (RF-033 al RF-059), el sistema ya cubre los procesos de abastecimiento, control de inventario, consumo de repuestos, compras y cotizaciones, integrándolos con las órdenes de trabajo y el historial del vehículo.

En el siguiente capítulo desarrollaremos los módulos finales: Facturación, Entrega del Vehículo, Historial Técnico, Dashboard, Reportes, Configuración, Auditoría y Requisitos No Funcionales, completando la especificación del sistema.

continua

Perfecto. A partir de este punto se desarrollan los módulos finales del sistema. Estos requisitos están pensados para que el software tenga un nivel profesional similar a aplicaciones como Mitchell 1, Shop-Ware, AutoFluent o Tekmetric, pero adaptado a un taller automotriz.

PROMPT MAESTRO

CAPÍTULO 4 – REQUISITOS FUNCIONALES (Continuación)

MÓDULO 15. FACTURACIÓN

RF-060. Generar factura

El sistema deberá generar una factura electrónica o interna a partir de una Orden de Trabajo finalizada.

La factura deberá contener:

 Número de factura.

 Fecha de emisión.

 Cliente.

 Documento.

 Vehículo.

 Placa.

 Kilometraje.

 Mecánico responsable.

 Servicios realizados.

 Repuestos utilizados.

 Mano de obra.

 Subtotal.

 IVA.

 Descuentos.

 Total.

 Método de pago.

 Observaciones.

Reglas de negocio

 No se podrá facturar una orden que no esté finalizada.

 Una orden solo podrá generar una factura.

 La numeración de facturas será consecutiva y configurable.

RF-061. Métodos de pago

El sistema deberá permitir registrar uno o varios métodos de pago:

 Efectivo.

 Tarjeta débito.

 Tarjeta crédito.

 Transferencia bancaria.

 Nequi.

 Daviplata.

 Crédito.

 Otro.

Una factura podrá tener pagos mixtos.

RF-062. Estado de la factura

Estados disponibles:

 Pendiente.

 Pagada.

 Parcialmente pagada.

 Anulada.

RF-063. Impresión y exportación

El sistema deberá permitir:

 Imprimir factura.

 Exportar a PDF.

 Reimprimir.

MÓDULO 16. ENTREGA DEL VEHÍCULO

RF-064. Registrar entrega

Antes de entregar un vehículo el sistema deberá validar:

 Orden finalizada.

 Factura generada.

 Pago registrado (según políticas del taller).

Registrar:

 Fecha.

 Hora.

 Persona que recibe.

 Documento.

 Observaciones.

RF-065. Acta de entrega

Generar automáticamente un acta que incluya:

 Datos del cliente.

 Datos del vehículo.

 Servicios realizados.

 Repuestos instalados.

 Garantías.

 Recomendaciones.

 Próximo mantenimiento sugerido.

 Firma digital (opcional).

MÓDULO 17. HISTORIAL TÉCNICO

RF-066. Historial completo del vehículo

El sistema deberá mantener un historial inalterable por cada vehículo.

Información almacenada:

 Órdenes de trabajo.

 Diagnósticos.

 Servicios.

 Repuestos.

 Compras relacionadas.

 Facturas.

 Garantías.

 Fotografías.

 Observaciones.

 Kilometraje.

 Costos.

 Mecánicos responsables.

Regla

Nunca se eliminará información histórica.

RF-067. Línea de tiempo

Mostrar cronológicamente:

 Fecha.

 Tipo de servicio.

 Kilometraje.

 Mecánico.

 Valor del mantenimiento.

RF-068. Historial de repuestos

Consultar todos los repuestos instalados en un vehículo.

Mostrar:

 Repuesto.

 Fecha.

 Garantía.

 Orden.

 Mecánico.

MÓDULO 18. GARANTÍAS

RF-069. Garantía del servicio

Cada servicio podrá registrar:

 Tiempo de garantía.

 Condiciones.

 Observaciones.

RF-070. Garantía de repuestos

Cada repuesto instalado deberá almacenar:

 Fecha de instalación.

 Tiempo de garantía.

 Fecha de vencimiento.

 Estado.

RF-071. Consulta de garantías

Buscar por:

 Cliente.

 Vehículo.

 Placa.

 Número de orden.

MÓDULO 19. DASHBOARD

RF-072. Panel principal

Al iniciar sesión el sistema mostrará indicadores en tiempo real.

Tarjetas principales:

 Vehículos atendidos hoy.

 Órdenes pendientes.

 Órdenes en reparación.

 Órdenes listas para entrega.

 Facturación del día.

 Repuestos con stock bajo.

 Compras del mes.

 Clientes registrados.

RF-073. Gráficos

Mostrar:

 Servicios más realizados.

 Repuestos más utilizados.

 Facturación mensual.

 Ingresos por mes.

 Vehículos atendidos por mes.

 Mecánicos con mayor productividad.

 Marcas más atendidas.

 Tipos de mantenimiento.

MÓDULO 20. REPORTES

RF-074. Reporte de órdenes

Filtros:

 Fecha inicial.

 Fecha final.

 Mecánico.

 Estado.

 Cliente.

 Vehículo.

RF-075. Reporte de inventario

Mostrar:

 Stock actual.

 Stock mínimo.

 Valor del inventario.

 Repuestos agotados.

 Repuestos próximos a agotarse.

RF-076. Reporte de compras

Consultar:

 Compras por proveedor.

 Compras por fecha.

 Compras por categoría.

RF-077. Reporte de ingresos

Mostrar:

 Diario.

 Semanal.

 Mensual.

 Anual.

RF-078. Reporte de productividad

Mostrar por mecánico:

 Órdenes realizadas.

 Tiempo promedio.

 Horas trabajadas.

 Servicios ejecutados.

RF-079. Exportación

Todos los reportes deberán exportarse en:

 PDF.

 Excel.

MÓDULO 21. CONFIGURACIÓN DEL SISTEMA

RF-080. Datos del taller

Configurar:

 Nombre.

 NIT.

 Dirección.

 Teléfono.

 Correo.

 Logo.

 Página web.

 Redes sociales.

RF-081. Parámetros

Configurar:

 IVA.

 Moneda.

 Zona horaria.

 Numeración de órdenes.

 Numeración de facturas.

 Tiempo de garantía por defecto.

RF-082. Catálogos

Administrar:

 Marcas.

 Líneas.

 Modelos.

 Tipos de combustible.

 Tipos de transmisión.

 Categorías de servicios.

 Categorías de repuestos.

MÓDULO 22. AUDITORÍA

RF-083. Bitácora

Registrar automáticamente:

 Usuario.

 Fecha.

 Hora.

 Acción realizada.

 Módulo.

 Dirección IP (si el backend está en red).

 Equipo (opcional).

RF-084. Historial de cambios

Registrar modificaciones realizadas sobre:

 Clientes.

 Vehículos.

 Órdenes.

 Inventario.

 Compras.

 Facturas.

 Configuración.

El historial deberá indicar:

 Valor anterior.

 Valor nuevo.

 Usuario responsable.

 Fecha.

RF-085. Eliminación lógica

Ninguna entidad principal se eliminará físicamente.

Las entidades pasarán al estado Inactivo, preservando la integridad del historial.

MÓDULO 23. NOTIFICACIONES

RF-086. Alertas del sistema

El sistema deberá generar notificaciones para:

 Stock mínimo.

 Órdenes atrasadas.

 Garantías próximas a vencer.

 Cotizaciones vencidas.

 Mantenimientos preventivos próximos.

RF-087. Centro de notificaciones

Todas las alertas deberán mostrarse en un panel con:

 Fecha.

 Tipo.

 Prioridad.

 Estado (Leída / No leída).

MÓDULO 24. RESPALDO Y RESTAURACIÓN

RF-088. Copias de seguridad

El administrador podrá generar copias de seguridad de la base de datos de forma manual.

Opcionalmente, el sistema podrá programar respaldos automáticos.

RF-089. Restauración

El administrador podrá restaurar una copia de seguridad previamente generada, previa confirmación y validación.

MÓDULO 25. AYUDA

RF-090. Manual de usuario

El sistema incluirá un módulo de ayuda con:

 Guías rápidas.

 Preguntas frecuentes.

 Atajos del sistema.

 Información de versión.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8b475828-23ee-41b9-b913-cd7578cd2657).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
