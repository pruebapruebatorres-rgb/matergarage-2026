import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, LogOut, Bell } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { useTaller } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sesion, logout, data } = useTaller();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [abierto, setAbierto] = useState(false);

  const rol = sesion?.rol ?? "ADMIN";
  const sinLeer = (data["notificaciones"] ?? []).filter((n) => n["estado"] === "No leída").length;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          abierto ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <img
            src="/LogoGarage.png"
            alt="Mater Garage"
            className="size-10 shrink-0 rounded-md border border-sidebar-border object-cover"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold tracking-wide text-sidebar-accent-foreground uppercase">
              Mater Garage
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Gestión integral</p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <nav className="space-y-5 px-3 py-4">
            {NAV_GROUPS.map((grupo) => {
              const items = grupo.items.filter((i) => i.roles.includes(rol));
              if (items.length === 0) return null;
              return (
                <div key={grupo.label}>
                  <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {grupo.label}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const activo = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setAbierto(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                            activo
                              ? "bg-sidebar-accent font-medium text-sidebar-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="absolute inset-x-0 bottom-0 border-t border-sidebar-border p-3">
          <div className="flex items-center justify-between gap-2 rounded-md bg-sidebar-accent px-2.5 py-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-sidebar-accent-foreground">{sesion?.nombre ?? "Invitado"}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {rol === "ADMIN" ? "Administrador" : "Mecánico"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cerrar sesión"
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      {abierto ? (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-background/70 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setAbierto(true)} aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Sistema de Gestión Integral para Taller Automotriz
            </p>
          </div>
          <Link to="/notificaciones" className="relative inline-flex">
            <Button variant="outline" size="icon" aria-label="Notificaciones">
              <Bell className="size-4" />
            </Button>
            {sinLeer > 0 ? (
              <Badge className="absolute -right-1.5 -top-1.5 h-5 min-w-5 justify-center px-1 text-[10px]">{sinLeer}</Badge>
            ) : null}
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
