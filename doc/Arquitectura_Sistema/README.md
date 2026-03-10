# Arquitectura del Sistema ZFinanza

Documentación técnica de referencia para el sistema. Consultar estos archivos antes de implementar nuevas funcionalidades o módulos.

---

## Índice de Documentos

- [01_Arquitectura_Frontend.md](./01_Arquitectura_Frontend.md) — Estructura de carpetas del frontend React/Vite. Convenciones de páginas, componentes y hooks por módulo.

- [02_Arquitectura_Backend.md](./02_Arquitectura_Backend.md) — Estructura de la API Laravel. Modelos, Controladores, Servicios y Rutas modulares. Flujo para añadir nuevos módulos.

- [03_Modelo_Base_Datos.md](./03_Modelo_Base_Datos.md) — Esquema de la base de datos. Todas las tablas, columnas, tipos, restricciones y relaciones entre entidades.

- [04_Senders_Menus.md](./04_Senders_Menus.md) — Guía para crear senders de menús (proveedores de datos) para Sidebar y Tabs. Flujo completo de datos desde Backend hasta Frontend.

- [05_Reglas_Themes_Tipografia.md](./05_Reglas_Themes_Tipografia.md) — Reglas obligatorias para trabajar con el sistema de temas (`react_vite/src/theme`) y tipografía (`react_vite/src/styles/ds-typography.css`).

---

## Módulos actuales del sistema

- **Sistemas** — Usuarios, Roles, Permisos, Menús, Configuraciones (Settings), Seguridad por componente (SecuredButton System).
- **RRHH** — Cargos, Personal, accesos por PIN y ubicaciones.
- **Negocios** — Negocios/Empresas, Bases de datos externas, conexión usuarios-negocios.
- **Finanzas** — Configuración de cuentas, centros de cuentas (en desarrollo).

---

> Cuando se agregue un nuevo módulo al sistema, actualizar este README y crear la documentación correspondiente en los archivos de arquitectura.
