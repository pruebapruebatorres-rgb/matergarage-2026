import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileSpreadsheet, FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
import { ENTITIES } from "@/lib/entities";
import { useTaller } from "@/lib/store";
import { exportarExcel, exportarPDF } from "@/lib/export";
import { Button } from "@/components/ui/button";

const TITULO = "Reportes administrativos — Mater Garage";
const DESC = "Órdenes, inventario, compras, ingresos y productividad con exportación a PDF y Excel.";

export const Route = createFileRoute("/reportes")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Pagina,
});

// Cada reporte reutiliza los datos y columnas ya definidos para su módulo (ver entities.ts),
// así que exportar aquí produce el mismo archivo que exportar desde esa pantalla.
const REPORTES = [
  { titulo: "Reporte de órdenes", entidad: "ordenes" },
  { titulo: "Reporte de inventario", entidad: "inventario" },
  { titulo: "Reporte de compras", entidad: "compras" },
  { titulo: "Reporte de ingresos (facturación)", entidad: "facturas" },
  { titulo: "Reporte de productividad (mano de obra)", entidad: "manoObra" },
] as const;

function Pagina() {
  const { data } = useTaller();

  async function exportar(entidad: string, titulo: string, formato: "excel" | "pdf") {
    const def = ENTITIES[entidad];
    const filas = data[entidad] ?? [];
    if (!def) return;
    if (filas.length === 0) {
      toast.error("No hay registros para exportar.");
      return;
    }
    try {
      if (formato === "excel") exportarExcel(titulo, def.columns, filas);
      else await exportarPDF(titulo, def.columns, filas);
      toast.success(`Se exportaron ${filas.length} registro(s) a ${formato === "excel" ? "Excel" : "PDF"}.`);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible generar el archivo de exportación.");
    }
  }

  return (
    <AppShell>
      <PageHeader titulo="Reportes administrativos" descripcion={DESC} />
      <div className="grid gap-3 sm:grid-cols-2">
        {REPORTES.map(({ titulo, entidad }) => (
          <div key={entidad} className="panel flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-sm font-medium">{titulo}</p>
              <p className="text-xs text-muted-foreground">{(data[entidad] ?? []).length} registro(s) disponibles</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => exportar(entidad, titulo, "excel")}>
                <FileSpreadsheet className="size-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportar(entidad, titulo, "pdf")}>
                <FileText className="size-4" /> PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
