import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Garantías — TallerPro";
const DESC = "Garantías de servicios y repuestos instalados con fechas de vencimiento.";

export const Route = createFileRoute("/garantias")({
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
      <ModulePage entidad="garantias" />
    </AppShell>
  ),
});
