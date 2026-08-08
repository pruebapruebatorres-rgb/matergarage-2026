import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Mano de obra — TallerPro";
const DESC = "Horas trabajadas, valor hora y costo real por actividad y mecánico.";

export const Route = createFileRoute("/mano-obra")({
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
      <ModulePage entidad="manoObra" />
    </AppShell>
  ),
});
