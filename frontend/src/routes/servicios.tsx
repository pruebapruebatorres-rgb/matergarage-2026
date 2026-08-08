import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Catálogo de servicios — TallerPro";
const DESC = "Códigos, categorías, tiempo estimado, precio sugerido y estado.";

export const Route = createFileRoute("/servicios")({
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
      <ModulePage entidad="servicios" />
    </AppShell>
  ),
});
