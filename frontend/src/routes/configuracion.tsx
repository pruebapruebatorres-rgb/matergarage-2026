import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
import { useTaller } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TITULO = "Configuración del sistema — Mater Garage";
const DESC = "Datos del taller, parámetros de facturación, numeración y catálogos maestros.";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ConfiguracionPage,
});

const DATOS = [
  ["nombre", "Nombre del taller"],
  ["nit", "NIT"],
  ["direccion", "Dirección"],
  ["telefono", "Teléfono"],
  ["correo", "Correo"],
  ["web", "Página web"],
];

const PARAMS = [
  ["iva", "IVA (%)"],
  ["moneda", "Moneda"],
  ["zonaHoraria", "Zona horaria"],
  ["prefijoOrden", "Numeración de órdenes"],
  ["prefijoFactura", "Numeración de facturas"],
  ["garantiaDefecto", "Garantía por defecto (días)"],
];

const CATALOGOS: Record<string, string[]> = {
  Marcas: ["Mazda", "Chevrolet", "Renault", "Toyota", "Kia", "Nissan"],
  "Tipos de combustible": ["Gasolina", "Diésel", "Gas", "Híbrido", "Eléctrico"],
  "Tipos de transmisión": ["Manual", "Automática", "CVT"],
  "Categorías de servicios": ["Motor", "Frenos", "Suspensión", "Electricidad", "Preventivo", "Diagnóstico"],
  "Categorías de repuestos": ["Aceites", "Filtros", "Frenos", "Suspensión", "Motor", "Eléctrico", "Llantas", "Baterías"],
};

function ConfiguracionPage() {
  const { config, setConfig } = useTaller();

  return (
    <AppShell>
      <PageHeader titulo="Configuración del sistema" descripcion="Datos del taller, parámetros operativos y catálogos maestros." rf="RF-080 a RF-082" />
      <Tabs defaultValue="taller">
        <TabsList>
          <TabsTrigger value="taller">Datos del taller</TabsTrigger>
          <TabsTrigger value="parametros">Parámetros</TabsTrigger>
          <TabsTrigger value="catalogos">Catálogos</TabsTrigger>
        </TabsList>
        <TabsContent value="taller">
          <div className="panel grid gap-4 p-5 sm:grid-cols-2">
            {DATOS.map(([clave, etiqueta]) => (
              <div key={clave} className="space-y-1.5">
                <Label htmlFor={clave} className="text-xs uppercase tracking-wide text-muted-foreground">{etiqueta}</Label>
                <Input id={clave} value={config[clave!] ?? ""} onChange={(e) => setConfig(clave!, e.target.value)} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button onClick={() => toast.success("Configuración del taller guardada.")}>Guardar cambios</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="parametros">
          <div className="panel grid gap-4 p-5 sm:grid-cols-2">
            {PARAMS.map(([clave, etiqueta]) => (
              <div key={clave} className="space-y-1.5">
                <Label htmlFor={clave} className="text-xs uppercase tracking-wide text-muted-foreground">{etiqueta}</Label>
                <Input id={clave} value={config[clave!] ?? ""} onChange={(e) => setConfig(clave!, e.target.value)} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button onClick={() => toast.success("Parámetros actualizados.")}>Guardar parámetros</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="catalogos">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(CATALOGOS).map(([nombre, valores]) => (
              <div key={nombre} className="panel p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide">{nombre}</p>
                <div className="flex flex-wrap gap-1.5">
                  {valores.map((v) => (
                    <span key={v} className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
