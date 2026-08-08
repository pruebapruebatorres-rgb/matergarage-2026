import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Recepción de vehículos — Mater Garage";
const DESC = "Órdenes de ingreso con consecutivo automático, checklist y registro fotográfico.";

export const Route = createFileRoute("/recepcion")({
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
      <ModulePage entidad="recepcion" />
    </AppShell>
  ),
});
