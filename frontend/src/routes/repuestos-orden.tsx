import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Repuestos utilizados — TallerPro";
const DESC = "Consumo por orden con validación de existencias y control de garantía.";

export const Route = createFileRoute("/repuestos-orden")({
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
      <ModulePage entidad="repuestosOrden" />
    </AppShell>
  ),
});
