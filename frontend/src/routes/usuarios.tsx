import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/module-page";

const TITULO = "Usuarios — Mater Garage";
const DESC = "Gestión de usuarios internos, roles, estado y restablecimiento de contraseñas.";

export const Route = createFileRoute("/usuarios")({
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
      <ModulePage entidad="usuarios" />
    </AppShell>
  ),
});
