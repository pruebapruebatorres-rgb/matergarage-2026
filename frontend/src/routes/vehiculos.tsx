import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Vehículos — Mater Garage";
const DESC = "Ficha técnica completa del vehículo con placa única e historial inalterable.";

export const Route = createFileRoute("/vehiculos")({
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
      <ModulePage entidad="vehiculos" />
    </AppShell>
  ),
});
