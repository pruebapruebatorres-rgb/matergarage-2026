import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Clientes — Mater Garage";
const DESC = "Registro, búsqueda en tiempo real e historial comercial de clientes del taller.";

export const Route = createFileRoute("/clientes")({
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
      <ModulePage entidad="clientes" />
    </AppShell>
  ),
});
