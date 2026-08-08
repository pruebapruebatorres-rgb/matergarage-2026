import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Car,
  Wrench,
  PackageOpen,
  Receipt,
  AlertTriangle,
  ShoppingCart,
  Users,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/module-page";
import { EstadoBadge } from "@/components/estado-badge";
import { formatoMoneda, formatoNumero, useTaller } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TITULO = "Dashboard operativo — Mater Garage";
const DESC = "Indicadores en tiempo real del taller: órdenes, facturación, inventario y productividad.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Dashboard,
});

const FACTURACION_MENSUAL = [
  { mes: "Feb", valor: 18400000 },
  { mes: "Mar", valor: 21200000 },
  { mes: "Abr", valor: 19750000 },
  { mes: "May", valor: 24800000 },
  { mes: "Jun", valor: 26100000 },
  { mes: "Jul", valor: 23400000 },
  { mes: "Ago", valor: 9800000 },
];

const SERVICIOS_TOP = [
  { nombre: "Cambio aceite", cantidad: 84 },
  { nombre: "Frenos", cantidad: 61 },
  { nombre: "Alineación", cantidad: 47 },
  { nombre: "Escaneo", cantidad: 39 },
  { nombre: "Suspensión", cantidad: 28 },
];

function Kpi({
  icono: Icono,
  etiqueta,
  valor,
  detalle,
  tono,
}: {
  icono: LucideIcon;
  etiqueta: string;
  valor: string;
  detalle: string;
  tono?: "primary" | "warning" | "danger";
}) {
  const color =
    tono === "danger" ? "text-destructive" : tono === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{etiqueta}</p>
        <Icono className={`size-4 ${color}`} />
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums">{valor}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detalle}</p>
    </div>
  );
}

function Dashboard() {
  const { data } = useTaller();
  const ordenes = data["ordenes"] ?? [];
  const facturas = data["facturas"] ?? [];
  const inventario = data["inventario"] ?? [];
  const compras = data["compras"] ?? [];
  const clientes = data["clientes"] ?? [];
  const recepcion = data["recepcion"] ?? [];

  const pendientes = ordenes.filter((o) => o["estado"] === "Pendiente" || o["estado"] === "Esperando aprobación").length;
  const enReparacion = ordenes.filter((o) => o["estado"] === "En reparación").length;
  const listas = ordenes.filter((o) => o["estado"] === "Lista para entrega").length;
  const facturado = facturas.reduce((acc, f) => acc + Number(f["total"] ?? 0), 0);
  const stockBajo = inventario.filter((i) => Number(i["stock"]) <= Number(i["stockMin"]));
  const comprasMes = compras.reduce((acc, c) => acc + Number(c["total"] ?? 0), 0);

  return (
    <AppShell>
      <PageHeader
        titulo="Dashboard operativo"
        descripcion="Indicadores en tiempo real de la operación del taller."
        rf="RF-072 · RF-073"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icono={Car} etiqueta="Vehículos hoy" valor={String(recepcion.length)} detalle="Ingresos registrados" />
        <Kpi icono={ClipboardList} etiqueta="Órdenes pendientes" valor={String(pendientes)} detalle="Requieren gestión" tono="warning" />
        <Kpi icono={Wrench} etiqueta="En reparación" valor={String(enReparacion)} detalle="Trabajo en curso" />
        <Kpi icono={PackageOpen} etiqueta="Listas para entrega" valor={String(listas)} detalle="Pendiente entrega" />
        <Kpi icono={Receipt} etiqueta="Facturación" valor={formatoMoneda(facturado)} detalle="Total facturado" />
        <Kpi icono={AlertTriangle} etiqueta="Stock bajo" valor={String(stockBajo.length)} detalle="Repuestos en o bajo mínimo" tono="danger" />
        <Kpi icono={ShoppingCart} etiqueta="Compras del mes" valor={formatoMoneda(comprasMes)} detalle="Órdenes de compra" />
        <Kpi icono={Users} etiqueta="Clientes" valor={String(clientes.length)} detalle="Registrados en el sistema" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="panel p-5 lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Facturación mensual</h2>
          <p className="mb-4 text-xs text-muted-foreground">Ingresos consolidados por mes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FACTURACION_MENSUAL}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(v: number) => `${Math.round(v / 1000000)}M`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(v: number) => formatoMoneda(v)}
                />
                <Line type="monotone" dataKey="valor" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Servicios más realizados</h2>
          <p className="mb-4 text-xs text-muted-foreground">Últimos 6 meses</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SERVICIOS_TOP} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="nombre" width={92} stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  cursor={{ fill: "var(--color-accent)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar dataKey="cantidad" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Órdenes activas</h2>
            <Link to="/ordenes" className="text-xs text-primary hover:underline">
              Ver todas
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase">Orden</TableHead>
                <TableHead className="text-xs uppercase">Placa</TableHead>
                <TableHead className="text-xs uppercase">Estado</TableHead>
                <TableHead className="text-right text-xs uppercase">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.slice(0, 6).map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o["numero"]}</TableCell>
                  <TableCell className="text-sm">{o["placa"]}</TableCell>
                  <TableCell>
                    <EstadoBadge valor={String(o["estado"])} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {formatoMoneda(Number(o["total"] ?? 0))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Alertas de inventario</h2>
            <Link to="/inventario" className="text-xs text-primary hover:underline">
              Ver inventario
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase">Código</TableHead>
                <TableHead className="text-xs uppercase">Repuesto</TableHead>
                <TableHead className="text-right text-xs uppercase">Stock</TableHead>
                <TableHead className="text-right text-xs uppercase">Mínimo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockBajo.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    Sin alertas de stock.
                  </TableCell>
                </TableRow>
              ) : (
                stockBajo.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i["codigo"]}</TableCell>
                    <TableCell className="text-sm">{i["nombre"]}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-destructive tabular-nums">
                      {formatoNumero(Number(i["stock"]))}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatoNumero(Number(i["stockMin"]))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
