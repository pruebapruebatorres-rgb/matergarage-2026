import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Inventario de repuestos — Mater Garage";
const DESC = "Stock, precios, ubicación, garantía y alertas de mínimos.";

export const Route = createFileRoute("/inventario")({
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
      <ModulePage entidad="inventario" />
    </AppShell>
  ),
});
