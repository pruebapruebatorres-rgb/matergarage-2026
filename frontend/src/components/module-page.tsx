import { useMemo, useState } from "react";
import { Plus, Search, Download, Power, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ENTITIES, type EntityDef, type EntityRow, type FieldDef } from "@/lib/entities";
import { formatoMoneda, formatoNumero, useTaller } from "@/lib/store";
import { EstadoBadge } from "@/components/estado-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function PageHeader({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string;
  descripcion: string;
  /** Ya no se muestra en la interfaz; se sigue aceptando para no romper a los llamadores existentes. */
  rf?: string;
  acciones?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{titulo}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{descripcion}</p>
      </div>
      {acciones ? <div className="flex flex-wrap gap-2">{acciones}</div> : null}
    </div>
  );
}

function valorCelda(row: EntityRow, name: string, kind?: string) {
  const raw = row[name];
  if (raw === undefined || raw === "") return <span className="text-muted-foreground">—</span>;
  if (kind === "money") return <span className="font-mono tabular-nums">{formatoMoneda(raw)}</span>;
  if (kind === "number") return <span className="font-mono tabular-nums">{formatoNumero(raw)}</span>;
  if (kind === "badge") return <EstadoBadge valor={String(raw)} />;
  return String(raw);
}

function CampoForm({
  field,
  valor,
  onChange,
}: {
  field: FieldDef;
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={cn("space-y-1.5", field.span === 2 && "sm:col-span-2")}>
      <Label htmlFor={field.name} className="text-xs uppercase tracking-wide text-muted-foreground">
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {field.type === "textarea" ? (
        <Textarea id={field.name} value={valor} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : field.type === "combo" ? (
        <Combobox
          id={field.name}
          value={valor}
          onChange={onChange}
          // Igual que en el select: si el valor guardado ya no está en las opciones
          // (p. ej. una orden antigua), se conserva para no perder el dato al editar.
          options={
            valor && !(field.comboOptions ?? []).some((o) => o.value === valor)
              ? [{ value: valor, label: valor }, ...(field.comboOptions ?? [])]
              : (field.comboOptions ?? [])
          }
          searchPlaceholder="Buscar por código, cliente o placa…"
          emptyText="No se encontraron órdenes."
        />
      ) : field.type === "select" ? (
        <Select {...(valor ? { value: valor } : {})} onValueChange={onChange}>
          <SelectTrigger id={field.name}>
            <SelectValue placeholder="Seleccione…" />
          </SelectTrigger>
          <SelectContent>
            {/* Si el valor guardado ya no está en las opciones (p. ej. un mecánico que
                luego se inactivó), se conserva como opción para no perder el dato al editar. */}
            {(valor && !(field.options ?? []).includes(valor) ? [valor, ...(field.options ?? [])] : field.options ?? []).map(
              (o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={field.name}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function ModulePage({ entidad, extra }: { entidad: string; extra?: React.ReactNode }) {
  const def = ENTITIES[entidad];
  if (!def) return null;
  return <ModuleInner def={def} entidad={entidad} extra={extra} />;
}

function ModuleInner({ def, entidad, extra }: { def: EntityDef; entidad: string; extra?: React.ReactNode }) {
  const { data, crear, actualizar, alternarEstado, sesion } = useTaller();
  const [busqueda, setBusqueda] = useState("");
  const [dialogo, setDialogo] = useState(false);
  const [editando, setEditando] = useState<EntityRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const rol = sesion?.rol ?? "ADMIN";
  const puedeEscribir = (def.write ?? ["ADMIN"]).includes(rol);
  const filas = data[entidad] ?? [];

  // Usuarios internos con rol Mecánico y estado Activo, para los campos con
  // dynamicOptions: "mecanicos" (asignación de mecánico en órdenes, diagnósticos, etc.).
  const mecanicosActivos = useMemo(() => {
    const usuarios = data["usuarios"] ?? [];
    const nombres = usuarios
      .filter((u) => String(u["rol"] ?? "") === "Mecánico" && String(u["estado"] ?? "") === "Activo")
      .map((u) => {
        const nombre = String(u["nombre"] ?? "").trim();
        const primerApellido = String(u["apellidos"] ?? "").trim().split(/\s+/)[0] ?? "";
        return [nombre, primerApellido].filter(Boolean).join(" ");
      })
      .filter(Boolean);
    return Array.from(new Set(nombres));
  }, [data]);

  // Órdenes de trabajo, para los campos con dynamicOptions: "ordenes" (mantenimiento,
  // mano de obra, repuestos utilizados, facturación, entregas, garantías...). Se busca
  // por código, cliente o placa; lo que se guarda es siempre el código (numero).
  const ordenesOpciones = useMemo<ComboOption[]>(() => {
    const ordenes = data["ordenes"] ?? [];
    return ordenes.map((o) => {
      const numero = String(o["numero"] ?? o["id"]);
      const cliente = String(o["cliente"] ?? "");
      const placa = String(o["placa"] ?? "");
      const detalle = [cliente, placa].filter(Boolean).join(" · ");
      return {
        value: numero,
        label: detalle ? `${numero} — ${detalle}` : numero,
        keywords: [cliente, placa, String(o["estado"] ?? "")].filter(Boolean).join(" "),
      };
    });
  }, [data]);

  function resolverCampo(f: FieldDef): FieldDef {
    if (f.dynamicOptions === "mecanicos") return { ...f, options: mecanicosActivos };
    if (f.dynamicOptions === "ordenes") return { ...f, comboOptions: ordenesOpciones };
    return f;
  }

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return filas;
    return filas.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [filas, busqueda]);

  function abrirNuevo() {
    setEditando(null);
    setForm(Object.fromEntries(def.fields.map((f) => [f.name, ""])));
    setDialogo(true);
  }

  function abrirEditar(row: EntityRow) {
    setEditando(row);
    setForm(Object.fromEntries(def.fields.map((f) => [f.name, row[f.name] === undefined ? "" : String(row[f.name])])));
    setDialogo(true);
  }

  function guardar() {
    const faltantes = def.fields.filter((f) => f.required && !form[f.name]?.trim());
    if (faltantes.length > 0) {
      toast.error(`Campos obligatorios: ${faltantes.map((f) => f.label).join(", ")}`);
      return;
    }
    const payload: Record<string, string | number> = {};
    for (const f of def.fields) {
      const v = form[f.name] ?? "";
      payload[f.name] = f.type === "number" ? (v === "" ? 0 : Number(v)) : v;
    }
    if (editando) {
      actualizar(entidad, editando.id, payload);
      toast.success(`Se actualizó el ${def.singular}.`);
    } else {
      crear(entidad, payload);
      toast.success(`Se registró el ${def.singular}.`);
    }
    setDialogo(false);
  }

  return (
    <div>
      <PageHeader
        titulo={def.title}
        descripcion={def.subtitle}
        rf={def.rf}
        acciones={
          <>
            <Button variant="outline" onClick={() => toast.info("Exportación disponible en PDF y Excel (RF-079).")}>
              <Download className="size-4" /> Exportar
            </Button>
            {puedeEscribir ? (
              <Button onClick={abrirNuevo}>
                <Plus className="size-4" /> Nuevo {def.singular}
              </Button>
            ) : null}
          </>
        }
      />

      {extra}

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Búsqueda en tiempo real…"
              className="pl-9"
            />
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {filtradas.length} de {filas.length} registros
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {def.columns.map((c) => (
                  <TableHead key={c.name} className="whitespace-nowrap text-xs uppercase tracking-wide">
                    {c.label}
                  </TableHead>
                ))}
                {puedeEscribir ? <TableHead className="text-right text-xs uppercase">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={def.columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                    No hay registros que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                filtradas.map((row) => (
                  <TableRow key={row.id}>
                    {def.columns.map((c) => (
                      <TableCell key={c.name} className="whitespace-nowrap text-sm">
                        {valorCelda(row, c.name, c.kind)}
                      </TableCell>
                    ))}
                    {puedeEscribir ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => abrirEditar(row)}>
                            <Pencil className="size-4" />
                          </Button>
                          {"estado" in row ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Activar o inactivar"
                              onClick={() => {
                                alternarEstado(entidad, row.id);
                                toast.success("Estado actualizado. Eliminación lógica (RF-085).");
                              }}
                            >
                              <Power className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogo} onOpenChange={setDialogo}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {editando ? `Editar ${def.singular}` : `Nuevo ${def.singular}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {def.fields.map((f) => (
              <CampoForm
                key={f.name}
                field={resolverCampo(f)}
                valor={form[f.name] ?? ""}
                onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogo(false)}>
              Cancelar
            </Button>
            <Button onClick={guardar}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
