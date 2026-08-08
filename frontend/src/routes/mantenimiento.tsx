import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Mantenimiento — Mater Garage";
const DESC = "Actividades ejecutadas, tiempos, horas hombre y observaciones técnicas.";

export const Route = createFileRoute("/mantenimiento")({
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
      <ModulePage entidad="mantenimiento" />
    </AppShell>
  ),
});
