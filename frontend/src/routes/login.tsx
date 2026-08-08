import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn, ShieldAlert } from "lucide-react";
import { useTaller } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TITULO = "Iniciar sesión — Mater Garage";
const DESC = "Acceso para usuarios internos del taller: administradores y mecánicos.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESC },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESC },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useTaller();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const res = await login(usuario, password);
    if (res.ok) {
      setError("");
      navigate({ to: "/" });
    } else {
      setError(res.error ?? "No fue posible iniciar sesión.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Izquierda: marca. Oculta en pantallas chicas (el logo aparece arriba del formulario). */}
      <div className="surface-grid relative hidden flex-col items-center justify-center gap-6 border-r border-sidebar-border bg-sidebar px-10 py-12 lg:flex">
        <img src="/LogoGarage.png" alt="Mater Garage" className="w-full max-w-md xl:max-w-lg" />
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Sistema de Gestión Integral para Taller Automotriz
        </p>
      </div>

      {/* Derecha: formulario de acceso. */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <img src="/LogoGarage.png" alt="Mater Garage" className="h-auto w-48" />
          </div>

          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acceso para usuarios internos del taller: administradores y mecánicos.
            </p>
          </div>

          <form onSubmit={enviar} className="panel space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="usuario" className="text-xs uppercase tracking-wide text-muted-foreground">
                Nombre de usuario
              </Label>
              <Input
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <Alert variant="destructive">
                <ShieldAlert className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" className="w-full">
              <LogIn className="size-4" /> Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
