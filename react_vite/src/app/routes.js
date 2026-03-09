/**
 * @preserve zG9sZGVycyBieSBSZW5lIE1hcmNlbG8gT3J1w7FvIEFyZGF5YSAmIEp1bmlvciBBZ3VpbGFyIExlYcOxb3M=
 * Routes Configuration
 * 
 * This is a simplified version for the base project.
 * Add your routes here as needed.
 */

// Dashboard route
export const DASHBOARD_ROUTE = '/';

// Sistemas routes
export const USERS_ROUTE = '/sistemas/usuarios';
export const ROLES_ROUTE = '/sistemas/control-accesos';
export const PERMISSIONS_ROUTE = '/sistemas/control-accesos';
export const MENUS_ROUTE = '/sistemas/menus';
export const SETTINGS_ROUTE = '/sistemas/configuracion';
export const SECURITY_LEVELS_ROUTE = '/sistemas/niveles-seguridad';
export const PIN_ACCESS_ROUTE = '/sistemas/pin-acceso';

// RRHH routes
export const PERSONAL_ROUTE = '/rrhh/personal';
export const CARGOS_ROUTE = '/rrhh/cargos';

// Negocios routes
export const NEGOCIOS_ROUTE = '/sistemas/negocios';

// Frontend routes - Add your routes here
export const FRONTEND_ROUTES = [
  DASHBOARD_ROUTE,
  USERS_ROUTE,
  ROLES_ROUTE,
  PERMISSIONS_ROUTE,
  MENUS_ROUTE,
  SETTINGS_ROUTE,
  SECURITY_LEVELS_ROUTE,
  PIN_ACCESS_ROUTE,
  PERSONAL_ROUTE,
  CARGOS_ROUTE,
  NEGOCIOS_ROUTE,
  // Add more routes as needed
];

// Helper function to get safe route
export function getSafeRoute(route) {
  if (!route || typeof route !== 'string') {
    return DASHBOARD_ROUTE; // Default to dashboard
  }
  
  // Check if route exists in FRONTEND_ROUTES
  if (FRONTEND_ROUTES.includes(route)) {
    return route;
  }
  
  // Default to dashboard for unknown routes
  return DASHBOARD_ROUTE;
}

