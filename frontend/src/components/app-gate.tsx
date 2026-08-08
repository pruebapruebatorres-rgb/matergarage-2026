import { RefreshCw, WifiOff } from "lucide-react";
import { useTaller } from "@/lib/store";
import { Button } from "@/components/ui/button";

/**
 * Envuelve toda la app: mientras se carga el estado inicial desde el backend muestra un
 * spinner, y si el backend no responde (p. ej. no está corriendo) muestra una pantalla clara
 * con botón de reintentar en vez de dejar la interfaz vacía en silencio.
 */
export function AppGate({ children }: { children: React.ReactNode }) {
  const { cargando, errorConexion, reintentarConexion } = useTaller();

  if (errorConexion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="panel max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-destructive/10">
            <WifiOff className="size-7 text-destructive" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">No hay conexión con el servidor</h1>
          <p className="mt-2 text-sm text-muted-foreground">{errorConexion}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Inicie el backend (Java + Spring Boot) con <code className="font-mono">./mvnw spring-boot:run</code> y
            vuelva a intentar.
          </p>
          <Button className="mt-6" onClick={reintentarConexion}>
            <RefreshCw className="size-4" /> Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <img src="/LogoGarage.png" alt="Mater Garage" className="size-16 animate-pulse rounded-xl" />
        <p className="text-sm text-muted-foreground">Cargando Mater Garage…</p>
      </div>
    );
  }

  return <>{children}</>;
}
