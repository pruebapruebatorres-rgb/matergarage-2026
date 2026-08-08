import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Órdenes de trabajo — Mater Garage";
const DESC = "Ciclo completo de la orden, asignación de mecánicos y bitácora de estados.";

export const Route = createFileRoute("/ordenes")({
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
      <ModulePage entidad="ordenes" />
    </AppShell>
  ),
});
