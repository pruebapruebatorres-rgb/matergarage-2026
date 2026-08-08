import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Kardex y movimientos — Mater Garage";
const DESC = "Trazabilidad inalterable de entradas, salidas, ajustes y devoluciones.";

export const Route = createFileRoute("/kardex")({
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
      <ModulePage entidad="movimientos" />
    </AppShell>
  ),
});
