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
- **Finanzas** — Configuración de cuentas (f_cuentas), centros de cuentas (en desarrollo).

---

## Reglas obligatorias para nuevas funcionalidades

### Creación de nuevas páginas (Tabs o Sidebar)

Al crear una nueva página funcional en el sistema (ya sea un tab dentro de una página existente o una nueva página en el sidebar), **es obligatorio** seguir el siguiente flujo completo:

1. **Backend (Laravel):**
   - Crear la migración de la tabla correspondiente en `api_laravel/database/migrations/`
   - Crear el modelo en `api_laravel/app/Models/`
   - Crear el controlador en `api_laravel/app/Http/Controllers/`
   - Agregar las rutas en el archivo correspondiente en `api_laravel/routes/api/`

2. **Frontend (React):**
   - Crear el servicio de API en `react_vite/src/services/`
   - Crear el hook personalizado en `react_vite/src/pages/[modulo]/[funcionalidad]/hooks/`
   - Crear los componentes en `react_vite/src/pages/[modulo]/[funcionalidad]/components/`
   - Crear los estilos CSS correspondientes
   - Integrar la funcionalidad en la página principal

> ⚠️ **IMPORTANTE:** No se debe crear una página en el frontend sin primero implementar la estructura completa en el backend (migración, modelo, controlador y rutas).

---

### Estructura estándar para páginas con tablas responsivas

Para páginas que muestran listados de datos (CRUD), **es obligatorio** seguir esta estructura:

```
src/pages/[modulo]/[funcionalidad]/
├── [Funcionalidad]Page.jsx          # Página principal (orquestador)
├── [Funcionalidad]Page.css          # Estilos de la página
├── components/
│   ├── [Funcionalidad]Table.jsx     # Tabla responsiva con DSResponsiveTable
│   ├── [Funcionalidad]Card.jsx      # Card para vista móvil/tablet (opcional)
│   ├── [Funcionalidad]FormModal.jsx  # Modal para crear/editar
│   └── [Funcionalidad]Filters.jsx   # Filtros personalizados (opcional)
└── hooks/
    └── use[Funcionalidad].js        # Hook con lógica de negocio
```

#### Componentes obligatorios:

1. **[Funcionalidad]Page.jsx**: Página principal que orquesta todos los componentes
   - Usa `DSPage`, `DSPageHeader` del Design System
   - Usa el hook personalizado (`use[Funcionalidad]`)
   - Renderiza alertas, tabla y modal

2. **[Funcionalidad]Table.jsx**: Tabla responsiva
   - Usa `DSResponsiveTable` del Design System
   - Define columnas para vista desktop
   - Implementa `renderCard` para vista móvil/tablet
   - Incluye filtros de búsqueda (opcional)

3. **[Funcionalidad]Card.jsx**: Card para vista móvil/tablet (recomendado)
   - Componente separado con su propio CSS
   - Diseño similar a `UsuarioCard.jsx` o `CuentaCard.jsx`
   - Incluye: header con icono, body con metadatos, footer con acciones

4. **use[Funcionalidad].js**: Hook con lógica de negocio
   - Estado de datos, carga, errores
   - Funciones para CRUD (crear, editar, eliminar)
   - Gestión de modal y formulario

#### Ejemplo de implementación:

```jsx
// [Funcionalidad]Page.jsx
export function [Funcionalidad]Page() {
    const logic = use[Funcionalidad]();
    
    return (
        <DSPage>
            <DSPageHeader
                title="[Nombre Entidad]"
                actions={<SecuredButton>...</SecuredButton>}
            />
            {[Funcionalidad]Table
                data={logic.data}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
            />}
            {[Funcionalidad]FormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                onSave={logic.handleSave}
            />}
        </DSPage>
    );
}
```

> ⚠️ **IMPORTANTE:** Usar siempre `DSResponsiveTable` para tablas que requieren responsive. El breakpoint por defecto es 1024px (móvil/tablet muestra cards, desktop muestra tabla).

---

> Cuando se agregue un nuevo módulo al sistema, actualizar este README y crear la documentación correspondiente en los archivos de arquitectura.
