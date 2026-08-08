import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Wrench, Receipt, ShieldCheck, Gauge } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
import { EstadoBadge } from "@/components/estado-badge";
import { formatoMoneda, formatoNumero, useTaller } from "@/lib/store";
import { FOTO_CATEGORIAS } from "@/lib/entities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TITULO = "Historial técnico del vehículo — TallerPro";
const DESC = "Línea de tiempo inalterable con órdenes, repuestos, facturas, garantías y kilometraje.";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: HistorialPage,
});

function HistorialPage() {
  const { data } = useTaller();
  const vehiculos = data["vehiculos"] ?? [];
  const [placa, setPlaca] = useState(String(vehiculos[0]?.["placa"] ?? ""));

  const vehiculo = vehiculos.find((v) => v["placa"] === placa);
  const ordenes = (data["ordenes"] ?? []).filter((o) => o["placa"] === placa);
  const diagnosticos = (data["diagnosticos"] ?? []).filter((d) => d["placa"] === placa);
  const facturas = (data["facturas"] ?? []).filter((f) => f["placa"] === placa);
  const garantias = (data["garantias"] ?? []).filter((g) => g["placa"] === placa);
  const numerosOrden = ordenes.map((o) => String(o["numero"]));
  const repuestos = (data["repuestosOrden"] ?? []).filter((r) => numerosOrden.includes(String(r["orden"])));

  const invertido = useMemo(
    () => facturas.reduce((acc, f) => acc + Number(f["total"] ?? 0), 0),
    [facturas],
  );

  const linea = useMemo(
    () =>
      ordenes
        .map((o) => ({
          fecha: String(o["fecha"]),
          titulo: `Orden ${o["numero"]}`,
          detalle: String(o["observaciones"] || "Trabajo registrado en la orden."),
          mecanico: String(o["mecanico"]),
          valor: Number(o["total"] ?? 0),
          estado: String(o["estado"]),
        }))
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
    [ordenes],
  );

  return (
    <AppShell>
      <PageHeader
        titulo="Historial técnico"
        descripcion="Registro histórico inalterable por vehículo. La información nunca se elimina."
        rf="RF-066 a RF-068"
        acciones={
          <Select value={placa} onValueChange={setPlaca}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccione placa" />
            </SelectTrigger>
            <SelectContent>
              {vehiculos.map((v) => (
                <SelectItem key={v.id} value={String(v["placa"])}>
                  {String(v["placa"])} · {String(v["marca"])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {!vehiculo ? (
        <div className="panel p-10 text-center text-sm text-muted-foreground">
          Seleccione un vehículo para consultar su historial.
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Vehículo</p>
              <p className="mt-2 font-display text-xl font-bold">{String(vehiculo["placa"])}</p>
              <p className="text-xs text-muted-foreground">
                {String(vehiculo["marca"])} {String(vehiculo["linea"])} · {String(vehiculo["anio"])}
              </p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Kilometraje actual</p>
              <p className="mt-2 font-display text-xl font-bold tabular-nums">
                {formatoNumero(Number(vehiculo["kilometraje"]))} km
              </p>
              <p className="text-xs text-muted-foreground">Propietario: {String(vehiculo["cliente"])}</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Órdenes registradas</p>
              <p className="mt-2 font-display text-xl font-bold tabular-nums">{ordenes.length}</p>
              <p className="text-xs text-muted-foreground">{diagnosticos.length} diagnósticos técnicos</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total invertido</p>
              <p className="mt-2 font-display text-xl font-bold tabular-nums">{formatoMoneda(invertido)}</p>
              <p className="text-xs text-muted-foreground">{facturas.length} facturas emitidas</p>
            </div>
          </div>

          <Tabs defaultValue="linea" className="mt-4">
            <TabsList>
              <TabsTrigger value="linea">Línea de tiempo</TabsTrigger>
              <TabsTrigger value="repuestos">Repuestos</TabsTrigger>
              <TabsTrigger value="facturas">Facturas</TabsTrigger>
              <TabsTrigger value="garantias">Garantías</TabsTrigger>
              <TabsTrigger value="fotos">Fotografías</TabsTrigger>
            </TabsList>

            <TabsContent value="linea">
              <div className="panel p-5">
                {linea.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Sin eventos registrados.</p>
                ) : (
                  <ol className="relative space-y-6 border-l border-border pl-6">
                    {linea.map((ev, idx) => (
                      <li key={idx} className="relative">
                        <span className="absolute -left-[31px] flex size-5 items-center justify-center rounded-full bg-primary">
                          <Wrench className="size-3 text-primary-foreground" />
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{ev.titulo}</p>
                          <EstadoBadge valor={ev.estado} />
                          <span className="font-mono text-xs text-muted-foreground">{ev.fecha}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{ev.detalle}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {ev.mecanico} · {formatoMoneda(ev.valor)}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </TabsContent>

            <TabsContent value="repuestos">
              <div className="panel overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase">Repuesto</TableHead>
                      <TableHead className="text-xs uppercase">Orden</TableHead>
                      <TableHead className="text-xs uppercase">Instalación</TableHead>
                      <TableHead className="text-xs uppercase">Garantía hasta</TableHead>
                      <TableHead className="text-right text-xs uppercase">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repuestos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          Sin repuestos instalados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      repuestos.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-sm">{String(r["repuesto"])}</TableCell>
                          <TableCell className="font-mono text-xs">{String(r["orden"])}</TableCell>
                          <TableCell className="font-mono text-xs">{String(r["instalacion"])}</TableCell>
                          <TableCell className="font-mono text-xs">{String(r["vencimientoGarantia"])}</TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatoMoneda(Number(r["total"] ?? 0))}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="facturas">
              <div className="panel overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase">Factura</TableHead>
                      <TableHead className="text-xs uppercase">Fecha</TableHead>
                      <TableHead className="text-xs uppercase">Estado</TableHead>
                      <TableHead className="text-right text-xs uppercase">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facturas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                          Sin facturas asociadas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      facturas.map((f) => (
                        <TableRow key={f.id}>
                          <TableCell className="font-mono text-xs">
                            <Receipt className="mr-1.5 inline size-3.5 text-primary" />
                            {String(f["numero"])}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{String(f["fecha"])}</TableCell>
                          <TableCell>
                            <EstadoBadge valor={String(f["estado"])} />
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatoMoneda(Number(f["total"] ?? 0))}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="garantias">
              <div className="panel divide-y divide-border">
                {garantias.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">Sin garantías registradas.</p>
                ) : (
                  garantias.map((g) => (
                    <div key={g.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{String(g["descripcion"])}</p>
                          <p className="text-xs text-muted-foreground">
                            {String(g["orden"])} · vence {String(g["vence"])}
                          </p>
                        </div>
                      </div>
                      <EstadoBadge valor={String(g["estado"])} />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="fotos">
              <div className="panel p-5">
                <p className="mb-4 text-sm text-muted-foreground">
                  Registro fotográfico por categoría capturado en la recepción del vehículo (RF-017).
                </p>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {FOTO_CATEGORIAS.map((cat) => (
                    <div
                      key={cat}
                      className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 text-center"
                    >
                      <Camera className="size-5 text-muted-foreground" />
                      <p className="px-2 text-xs text-muted-foreground">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="panel mt-4 flex items-center gap-3 p-4">
            <Gauge className="size-4 text-primary" />
            <p className="text-xs text-muted-foreground">
              El historial técnico es inalterable: ninguna orden, factura o movimiento se elimina físicamente (RF-066 · RF-085).
            </p>
          </div>
        </>
      )}
    </AppShell>
  );
}
