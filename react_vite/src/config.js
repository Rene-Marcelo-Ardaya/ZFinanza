/**
 * Configuración global de la aplicación
 *
 * Reglas:
 * - Si defines `VITE_API_URL`, se usa tal cual.
 * - En DEV, por defecto usamos `/api` para aprovechar el proxy de Vite
 *   (redirige a http://localhost:8000/api — Laravel local).
 * - En PRODUCCIÓN, configurar `VITE_API_URL` con la URL real del backend.
 *
 * Ejemplos:
 * - DEV (proxy a Laravel local): VITE_API_URL=/api
 * - DEV (Laravel directo):       VITE_API_URL=http://localhost:8000/api
 * - PROD:                        VITE_API_URL=https://tu-servidor.com/api
 */

const CONFIG = {
    // URL base de la API Laravel
    // Prioridad: Variable de entorno > /api (proxy en dev/prod)
    API_BASE_URL:
        import.meta.env.VITE_API_URL ||
        '/api',
    
    // Alias para compatibilidad
    get API_URL() {
        return this.API_BASE_URL;
    }
};

export default CONFIG;
