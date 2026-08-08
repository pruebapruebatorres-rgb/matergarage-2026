import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
import { Button } from "@/components/ui/button";

const TITULO = "Ayuda y manual de usuario — Mater Garage";
const DESC = "Guías rápidas, preguntas frecuentes, atajos del sistema e información de versión.";

export const Route = createFileRoute("/ayuda")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Pagina,
});

const OPCIONES = ["Guías rápidas por módulo", "Preguntas frecuentes", "Atajos de teclado", "Información de versión 1.0.0"];

function Pagina() {
  return (
    <AppShell>
      <PageHeader titulo="Ayuda y manual de usuario" descripcion="Guías rápidas, preguntas frecuentes, atajos del sistema e información de versión." rf="RF-090" />
      <div className="grid gap-3 sm:grid-cols-2">
        {OPCIONES.map((opcion) => (
          <div key={opcion} className="panel flex items-center justify-between gap-4 p-5">
            <p className="text-sm font-medium">{opcion}</p>
            <Button variant="outline" onClick={() => toast.info(`${opcion}: acción disponible contra el backend Spring Boot.`)}>
              Ejecutar
            </Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
