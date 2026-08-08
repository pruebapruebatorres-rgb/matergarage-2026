import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ENTITIES, type EntityRow } from "./entities";

export type Rol = "ADMIN" | "MECANICO";

export interface SesionUsuario {
  usuario: string;
  nombre: string;
  rol: Rol;
}

interface TallerState {
  data: Record<string, EntityRow[]>;
  cargando: boolean;
  /** Mensaje de error si la carga inicial contra el backend falló (p. ej. no está corriendo). */
  errorConexion: string | null;
  reintentarConexion: () => void;
  sesion: SesionUsuario | null;
  config: Record<string, string>;
  login: (usuario: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  crear: (entidad: string, row: Omit<EntityRow, "id">) => void;
  actualizar: (entidad: string, id: string, row: Partial<EntityRow>) => void;
  alternarEstado: (entidad: string, id: string) => void;
  setConfig: (clave: string, valor: string) => void;
  /** Restablece la contraseña de cualquier usuario (fila de la entidad "usuarios") por su id. */
  restablecerPassword: (usuarioId: string, nuevaPassword: string) => Promise<{ ok: boolean; error?: string }>;
}

const SESION_KEY = "tallerpro.sesion.v1";

// Backend Java + Spring Boot — ver ../../backend. Configurable con VITE_API_URL
// (por defecto apunta al puerto local por defecto de Spring Boot).
const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8080";

function seedData(): Record<string, EntityRow[]> {
  const out: Record<string, EntityRow[]> = {};
  for (const key of Object.keys(ENTITIES)) out[key] = [];
  return out;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const detalle = await res.text().catch(() => "");
    throw new Error(detalle || `Error ${res.status} al llamar ${path}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const TallerContext = createContext<TallerState | null>(null);

export function TallerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<string, EntityRow[]>>(() => seedData());
  const [config, setConfigState] = useState<Record<string, string>>({});
  const [sesion, setSesion] = useState<SesionUsuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState<string | null>(null);
  const [intentoConexion, setIntentoConexion] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESION_KEY);
      if (raw) setSesion(JSON.parse(raw) as SesionUsuario);
    } catch {
      /* sesión local corrupta: se ignora */
    }
  }, []);

  useEffect(() => {
    try {
      if (sesion) localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
      else localStorage.removeItem(SESION_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  }, [sesion]);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    async function cargarInicial() {
      try {
        const [datos, cfg] = await Promise.all([
          apiFetch<Record<string, EntityRow[]>>("/api/data"),
          apiFetch<Record<string, string>>("/api/config"),
        ]);
        if (!activo) return;
        setData((prev) => ({ ...prev, ...datos }));
        setConfigState(cfg);
        setErrorConexion(null);
      } catch (error) {
        console.error(error);
        if (!activo) return;
        setErrorConexion(`No fue posible conectar con el backend en ${API_URL}. Verifique que esté corriendo.`);
      } finally {
        if (activo) setCargando(false);
      }
    }
    void cargarInicial();
    return () => {
      activo = false;
    };
  }, [intentoConexion]);

  const reintentarConexion = useCallback(() => setIntentoConexion((n) => n + 1), []);

  const login = useCallback(async (usuario: string, password: string) => {
    try {
      const res = await apiFetch<{ ok: boolean; error?: string; sesion?: SesionUsuario }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ usuario, password }),
      });
      if (res.ok && res.sesion) setSesion(res.sesion);
      return res.error === undefined ? { ok: res.ok } : { ok: res.ok, error: res.error };
    } catch (error) {
      console.error(error);
      return { ok: false, error: "No fue posible contactar al servidor de autenticación." };
    }
  }, []);

  const logout = useCallback(() => setSesion(null), []);

  const crear = useCallback((entidad: string, row: Omit<EntityRow, "id">) => {
    apiFetch<EntityRow>(`/api/data/${entidad}`, { method: "POST", body: JSON.stringify(row) })
      .then((creada) => {
        setData((prev) => ({ ...prev, [entidad]: [creada, ...(prev[entidad] ?? [])] }));
      })
      .catch((error) => {
        console.error(error);
        toast.error("No fue posible guardar el registro en el servidor.");
      });
  }, []);

  const actualizar = useCallback((entidad: string, id: string, row: Partial<EntityRow>) => {
    apiFetch<EntityRow>(`/api/data/${entidad}/${id}`, { method: "PUT", body: JSON.stringify(row) })
      .then((actualizada) => {
        setData((prev) => ({
          ...prev,
          [entidad]: (prev[entidad] ?? []).map((r) => (r.id === id ? actualizada : r)),
        }));
      })
      .catch((error) => {
        console.error(error);
        toast.error("No fue posible actualizar el registro en el servidor.");
      });
  }, []);

  const alternarEstado = useCallback((entidad: string, id: string) => {
    apiFetch<EntityRow>(`/api/data/${entidad}/${id}/alternar-estado`, { method: "POST" })
      .then((actualizada) => {
        setData((prev) => ({
          ...prev,
          [entidad]: (prev[entidad] ?? []).map((r) => (r.id === id ? actualizada : r)),
        }));
      })
      .catch((error) => {
        console.error(error);
        toast.error("No fue posible actualizar el estado en el servidor.");
      });
  }, []);

  const setConfig = useCallback((clave: string, valor: string) => {
    setConfigState((prev) => ({ ...prev, [clave]: valor }));
    apiFetch<void>(`/api/config/${clave}`, { method: "PUT", body: JSON.stringify({ valor }) }).catch((error) => {
      console.error(error);
      toast.error("No fue posible guardar la configuración en el servidor.");
    });
  }, []);

  const restablecerPassword = useCallback(async (usuarioId: string, nuevaPassword: string) => {
    try {
      await apiFetch<void>(`/api/usuarios/${usuarioId}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ password: nuevaPassword }),
      });
      return { ok: true };
    } catch (error) {
      console.error(error);
      const mensaje = error instanceof Error ? error.message : "";
      return { ok: false, error: mensaje || "No fue posible restablecer la contraseña." };
    }
  }, []);

  const value = useMemo<TallerState>(
    () => ({
      data,
      cargando,
      errorConexion,
      reintentarConexion,
      sesion,
      config,
      login,
      logout,
      crear,
      actualizar,
      alternarEstado,
      setConfig,
      restablecerPassword,
    }),
    [
      data,
      cargando,
      errorConexion,
      reintentarConexion,
      sesion,
      config,
      login,
      logout,
      crear,
      actualizar,
      alternarEstado,
      setConfig,
      restablecerPassword,
    ],
  );

  return <TallerContext.Provider value={value}>{children}</TallerContext.Provider>;
}

export function useTaller() {
  const ctx = useContext(TallerContext);
  if (!ctx) throw new Error("useTaller debe usarse dentro de TallerProvider");
  return ctx;
}

export function formatoMoneda(valor: number | string) {
  const n = typeof valor === "number" ? valor : Number(valor);
  if (Number.isNaN(n)) return String(valor);
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

export function formatoNumero(valor: number | string) {
  const n = typeof valor === "number" ? valor : Number(valor);
  if (Number.isNaN(n)) return String(valor);
  return new Intl.NumberFormat("es-CO").format(n);
}
