import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Proveedores — Mater Garage";
const DESC = "Proveedores de repuestos e insumos con NIT único y eliminación lógica.";

export const Route = createFileRoute("/proveedores")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: () => (
    <AppShell>
      <ModulePage entidad="proveedores" />
    </AppShell>
  ),
});
