/**
 * @preserve zG9sZGVycyBieSBSZW5lIE1hcmNlbG8gT3J1w7FvIEFyZGF5YSAmIEp1bmlvciBBZ3VpbGFyIExlYcOxb3M=
 * Page Registry
 * 
 * This is a simplified version for the base project.
 * Add your pages here as needed.
 */
import { lazy } from 'react';
import { 
  DASHBOARD_ROUTE,
  USERS_ROUTE,
  ROLES_ROUTE,
  PERMISSIONS_ROUTE,
  MENUS_ROUTE,
  SETTINGS_ROUTE,
  SECURITY_LEVELS_ROUTE,
  PIN_ACCESS_ROUTE,
  PERSONAL_ROUTE,
  CARGOS_ROUTE
} from './routes';

// Helper function to create page entries
const page = (component, buildProps) => ({ component, buildProps });

// Helper function to create lazy loaded components
const lazyNamed = (importer, exportName) =>
  lazy(() =>
    importer().then((module) => ({
      default: module[exportName],
    })),
  );

// Helper function to create default page props
const buildDefaultProps = (importer) => ({ userData, userMenus, onNavigate }) => ({
  userData,
  menus: userMenus,
  onNavigate,
});

// Page Registry - Add your pages here
export const PAGE_REGISTRY = {
  [DASHBOARD_ROUTE]: page(
    lazyNamed(() => import('../pages/dashboard/DashboardPage'), 'DashboardPage'),
    buildDefaultProps,
  ),

  // Sistemas (Administración y Seguridad)
  [USERS_ROUTE]: page(
    lazyNamed(() => import('../pages/sistemas/Usuarios/UsuariosPage'), 'UsuariosPage'),
    buildDefaultProps,
  ),
  [ROLES_ROUTE]: page(
    lazyNamed(() => import('../pages/sistemas/ControlAccesos/ControlAccesosPage'), 'ControlAccesosPage'),
    buildDefaultProps,
  ),
  [PERMISSIONS_ROUTE]: page(
    lazyNamed(() => import('../pages/sistemas/ControlAccesos/ControlAccesosPage'), 'ControlAccesosPage'),
    buildDefaultProps,
  ),
  [MENUS_ROUTE]: page(
    lazyNamed(() => import('../pages/sistemas/Menus/MenusPage'), 'MenusPage'),
    buildDefaultProps,
  ),
  [SETTINGS_ROUTE]: page(
    lazyNamed(() => import('../pages/sistemas/Configuracion/ConfiguracionPage'), 'ConfiguracionPage'),
    buildDefaultProps,
  ),
  [SECURITY_LEVELS_ROUTE]: page(
    lazyNamed(() => import('../pages/sistemas/NivelesSeguridad/NivelesSeguridadPage'), 'NivelesSeguridadPage'),
    buildDefaultProps,
  ),
  [PIN_ACCESS_ROUTE]: page(
    lazyNamed(() => import('../pages/dashboard/DashboardPage'), 'DashboardPage'), // Fallback hasta tener el componente real
    buildDefaultProps,
  ),

  [PERSONAL_ROUTE]: page(
    lazyNamed(() => import('../pages/rrhh/Personal/PersonalPage'), 'PersonalPage'),
    buildDefaultProps,
  ),
  [CARGOS_ROUTE]: page(
    lazyNamed(() => import('../pages/rrhh/Cargos/CargosPage'), 'CargosPage'),
    buildDefaultProps,
  ),
};

export function resolvePageEntry(route) {
  return PAGE_REGISTRY[route] || null;
}

export function getAvailableRoutes() {
  return Object.keys(PAGE_REGISTRY);
}
