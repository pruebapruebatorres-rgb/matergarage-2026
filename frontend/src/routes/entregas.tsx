import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Entrega de vehículos — TallerPro";
const DESC = "Validación de orden, factura y pago antes de la entrega. Genera acta.";

export const Route = createFileRoute("/entregas")({
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
      <ModulePage entidad="entregas" />
    </AppShell>
  ),
});
