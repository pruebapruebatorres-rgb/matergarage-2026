import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Diagnósticos — Mater Garage";
const DESC = "Falla reportada, diagnóstico técnico, causa, solución y prioridad.";

export const Route = createFileRoute("/diagnosticos")({
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
      <ModulePage entidad="diagnosticos" />
    </AppShell>
  ),
});
