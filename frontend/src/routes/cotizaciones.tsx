import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Cotizaciones — Mater Garage";
const DESC = "Versiones, vigencia, aprobación parcial y conversión a orden de trabajo.";

export const Route = createFileRoute("/cotizaciones")({
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
      <ModulePage entidad="cotizaciones" />
    </AppShell>
  ),
});
