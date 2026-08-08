import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Stethoscope,
  FileText,
  Wrench,
  Hammer,
  ListChecks,
  Truck,
  Boxes,
  ArrowLeftRight,
  ShoppingCart,
  PackageCheck,
  Clock,
  Receipt,
  PackageOpen,
  History,
  ShieldCheck,
  BarChart3,
  Settings,
  ScrollText,
  Bell,
  DatabaseBackup,
  LifeBuoy,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { Rol } from "./store";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: Rol[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const TODOS: Rol[] = ["ADMIN", "MECANICO"];
const SOLO_ADMIN: Rol[] = ["ADMIN"];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operación",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: TODOS },
      { to: "/recepcion", label: "Recepción", icon: ClipboardList, roles: SOLO_ADMIN },
      { to: "/diagnosticos", label: "Diagnósticos", icon: Stethoscope, roles: TODOS },
      { to: "/cotizaciones", label: "Cotizaciones", icon: FileText, roles: SOLO_ADMIN },
      { to: "/ordenes", label: "Órdenes de trabajo", icon: Wrench, roles: TODOS },
      { to: "/mantenimiento", label: "Mantenimiento", icon: Hammer, roles: TODOS },
      { to: "/mano-obra", label: "Mano de obra", icon: Clock, roles: TODOS },
      { to: "/entregas", label: "Entregas", icon: PackageOpen, roles: SOLO_ADMIN },
    ],
  },
  {
    label: "Maestros",
    items: [
      { to: "/clientes", label: "Clientes", icon: Users, roles: SOLO_ADMIN },
      { to: "/vehiculos", label: "Vehículos", icon: Car, roles: SOLO_ADMIN },
      { to: "/servicios", label: "Servicios", icon: ListChecks, roles: SOLO_ADMIN },
      { to: "/proveedores", label: "Proveedores", icon: Truck, roles: SOLO_ADMIN },
      { to: "/usuarios", label: "Usuarios", icon: UserCog, roles: SOLO_ADMIN },
    ],
  },
  {
    label: "Inventario",
    items: [
      { to: "/inventario", label: "Repuestos", icon: Boxes, roles: SOLO_ADMIN },
      { to: "/kardex", label: "Kardex", icon: ArrowLeftRight, roles: SOLO_ADMIN },
      { to: "/compras", label: "Compras", icon: ShoppingCart, roles: SOLO_ADMIN },
      { to: "/repuestos-orden", label: "Repuestos utilizados", icon: PackageCheck, roles: TODOS },
    ],
  },
  {
    label: "Comercial",
    items: [
      { to: "/facturacion", label: "Facturación", icon: Receipt, roles: SOLO_ADMIN },
      { to: "/historial", label: "Historial técnico", icon: History, roles: TODOS },
      { to: "/garantias", label: "Garantías", icon: ShieldCheck, roles: SOLO_ADMIN },
      { to: "/reportes", label: "Reportes", icon: BarChart3, roles: SOLO_ADMIN },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/notificaciones", label: "Notificaciones", icon: Bell, roles: TODOS },
      { to: "/configuracion", label: "Configuración", icon: Settings, roles: SOLO_ADMIN },
      { to: "/auditoria", label: "Auditoría", icon: ScrollText, roles: SOLO_ADMIN },
      { to: "/respaldos", label: "Respaldos", icon: DatabaseBackup, roles: SOLO_ADMIN },
      { to: "/ayuda", label: "Ayuda", icon: LifeBuoy, roles: TODOS },
    ],
  },
];
