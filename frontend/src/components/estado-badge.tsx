import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONOS: Record<string, string> = {
  activo: "bg-success/15 text-success border-success/30",
  vigente: "bg-success/15 text-success border-success/30",
  pagada: "bg-success/15 text-success border-success/30",
  aprobada: "bg-success/15 text-success border-success/30",
  finalizada: "bg-success/15 text-success border-success/30",
  entregado: "bg-success/15 text-success border-success/30",
  entregada: "bg-success/15 text-success border-success/30",
  confirmada: "bg-success/15 text-success border-success/30",
  instalado: "bg-success/15 text-success border-success/30",
  "lista para entrega": "bg-success/15 text-success border-success/30",
  entrada: "bg-success/15 text-success border-success/30",
  leída: "bg-muted text-muted-foreground border-border",

  inactivo: "bg-muted text-muted-foreground border-border",
  cerrado: "bg-muted text-muted-foreground border-border",
  borrador: "bg-muted text-muted-foreground border-border",
  baja: "bg-muted text-muted-foreground border-border",
  "no aplica": "bg-muted text-muted-foreground border-border",

  pendiente: "bg-warning/15 text-warning border-warning/30",
  media: "bg-warning/15 text-warning border-warning/30",
  "por vencer": "bg-warning/15 text-warning border-warning/30",
  "en proceso": "bg-warning/15 text-warning border-warning/30",
  "esperando aprobación": "bg-warning/15 text-warning border-warning/30",
  "esperando repuestos": "bg-warning/15 text-warning border-warning/30",
  "parcialmente pagada": "bg-warning/15 text-warning border-warning/30",
  "parcialmente aprobada": "bg-warning/15 text-warning border-warning/30",
  ajuste: "bg-warning/15 text-warning border-warning/30",
  "no leída": "bg-warning/15 text-warning border-warning/30",

  alta: "bg-destructive/15 text-destructive border-destructive/30",
  crítica: "bg-destructive/15 text-destructive border-destructive/30",
  bloqueado: "bg-destructive/15 text-destructive border-destructive/30",
  anulada: "bg-destructive/15 text-destructive border-destructive/30",
  cancelada: "bg-destructive/15 text-destructive border-destructive/30",
  rechazada: "bg-destructive/15 text-destructive border-destructive/30",
  vencida: "bg-destructive/15 text-destructive border-destructive/30",
  descontinuado: "bg-destructive/15 text-destructive border-destructive/30",
  salida: "bg-destructive/15 text-destructive border-destructive/30",

  "en reparación": "bg-info/15 text-info border-info/30",
  "en pruebas": "bg-info/15 text-info border-info/30",
  diagnóstico: "bg-info/15 text-info border-info/30",
  devolución: "bg-info/15 text-info border-info/30",
  devuelto: "bg-info/15 text-info border-info/30",
  administrador: "bg-primary/15 text-primary border-primary/30",
  mecánico: "bg-info/15 text-info border-info/30",
};

export function EstadoBadge({ valor, className }: { valor: string; className?: string }) {
  const tono = TONOS[valor.toLowerCase()] ?? "bg-accent text-accent-foreground border-border";
  return (
    <Badge variant="outline" className={cn("font-medium", tono, className)}>
      {valor}
    </Badge>
  );
}
