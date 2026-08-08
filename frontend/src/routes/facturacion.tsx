import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Facturación — Mater Garage";
const DESC = "Facturas consecutivas desde órdenes finalizadas, con pagos mixtos.";

export const Route = createFileRoute("/facturacion")({
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
      <ModulePage entidad="facturas" />
    </AppShell>
  ),
});
