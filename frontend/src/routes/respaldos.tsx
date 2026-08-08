import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
import { Button } from "@/components/ui/button";

const TITULO = "Respaldo y restauración — TallerPro";
const DESC = "Copias de seguridad manuales o programadas y restauración validada de la base de datos.";

export const Route = createFileRoute("/respaldos")({
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

const OPCIONES = ["Generar copia de seguridad", "Programar respaldos automáticos", "Restaurar copia existente", "Verificar integridad del respaldo"];

function Pagina() {
  return (
    <AppShell>
      <PageHeader titulo="Respaldo y restauración" descripcion="Copias de seguridad manuales o programadas y restauración validada de la base de datos." rf="RF-088 · RF-089" />
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
