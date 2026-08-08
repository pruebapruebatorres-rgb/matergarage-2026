import type { ColumnDef, EntityRow } from "./entities";
import { formatoMoneda, formatoNumero } from "./store";

function nombreArchivo(base: string, extension: string) {
  const fecha = new Date().toISOString().slice(0, 10);
  return `${base}-${fecha}.${extension}`;
}

function descargarBlob(blob: Blob, archivo: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = archivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function valorCelda(row: EntityRow, columna: ColumnDef): string {
  const raw = row[columna.name];
  if (raw === undefined || raw === "") return "";
  if (columna.kind === "money") return formatoMoneda(raw);
  if (columna.kind === "number") return formatoNumero(raw);
  return String(raw);
}

function escaparCSV(valor: string): string {
  // Comillas dobles si el valor trae coma, comillas o salto de línea (regla estándar de CSV).
  if (/[",\n;]/.test(valor)) return `"${valor.replace(/"/g, '""')}"`;
  return valor;
}

/**
 * Exporta a CSV (lo abre Excel de forma nativa con doble clic, sin necesidad de ninguna
 * librería de generación de .xlsx en el navegador). Incluye BOM para que Excel muestre bien
 * las tildes/ñ.
 */
export function exportarExcel(titulo: string, columnas: ColumnDef[], filas: EntityRow[]) {
  const encabezado = columnas.map((c) => escaparCSV(c.label)).join(";");
  const cuerpo = filas.map((row) => columnas.map((c) => escaparCSV(valorCelda(row, c))).join(";"));
  const csv = ["﻿" + encabezado, ...cuerpo].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  descargarBlob(blob, nombreArchivo(slug(titulo), "csv"));
}

/**
 * Exporta a PDF con una tabla (mismas columnas y formato que se ve en pantalla).
 * jsPDF + autoTable se cargan de forma diferida (import dinámico): son ~200 kB que no tiene
 * sentido descargar en cada carga de página, solo cuando alguien realmente exporta a PDF.
 */
export async function exportarPDF(titulo: string, columnas: ColumnDef[], filas: EntityRow[]) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);

  const doc = new jsPDF({ orientation: columnas.length > 6 ? "landscape" : "portrait" });

  doc.setFontSize(14);
  doc.text(titulo, 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generado el ${new Date().toLocaleString("es-CO")} · ${filas.length} registro(s)`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [columnas.map((c) => c.label)],
    body: filas.map((row) => columnas.map((c) => valorCelda(row, c))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [234, 128, 0] },
    margin: { left: 10, right: 10 },
  });

  doc.save(nombreArchivo(slug(titulo), "pdf"));
}

function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes (deja las letras base tras el NFD)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
