import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
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

const OPCIONES = ["Reporte de órdenes", "Reporte de inventario", "Reporte de compras", "Reporte de ingresos", "Reporte de productividad"];

function Pagina() {
  return (
    <AppShell>
      <PageHeader titulo="Reportes administrativos" descripcion="Órdenes, inventario, compras, ingresos y productividad con exportación a PDF y Excel." rf="RF-074 a RF-079" />
      <div className="grid gap-3 sm:grid-cols-2">
        {OPCIONES.map((opcion) => (
          <div key={opcion} className="panel flex items-center justify-between gap-4 p-5">
            <p className="text-sm font-medium">{opcion}</p>
            <Button variant="outline" onClick={() => toast.info(`${opcion}: acción disponible contra el backend Spring Boot.`)}>
              Ejecutar
            </Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
