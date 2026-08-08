import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Centro de notificaciones — Mater Garage";
const DESC = "Alertas de stock, órdenes atrasadas, garantías y cotizaciones vencidas.";

export const Route = createFileRoute("/notificaciones")({
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
      <ModulePage entidad="notificaciones" />
    </AppShell>
  ),
});
