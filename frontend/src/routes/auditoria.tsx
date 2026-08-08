import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Auditoría — TallerPro";
const DESC = "Bitácora de acciones e historial de cambios con valor anterior y nuevo.";

export const Route = createFileRoute("/auditoria")({
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
      <ModulePage entidad="auditoria" />
    </AppShell>
  ),
});
