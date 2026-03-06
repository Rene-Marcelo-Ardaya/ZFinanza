# Arquitectura del Frontend (React Vite)

Este documento establece los lineamientos sobre cómo organizar los archivos y carpetas dentro del proyecto **Frontend (`react_vite`)**, específicamente en la capa de las vistas / páginas (`src/pages`).

## 1. Filosofía de Estructura Modular

El Frontend está diseñado siguiendo un enfoque **Modular por Funcionalidad (Feature-based)**. Esto significa que todo lo relacionado con una pantalla o "Page" específica (su componente principal, sus estilos, sus componentes secundarios y su lógica de negocio o hooks) debe vivir **junto en la misma carpeta**.

Este enfoque difiere del modelo tradicional donde todos los componentes del sistema se guardan en una carpeta global `components/` y todos los hooks en una carpeta global `hooks/`. Al agrupar por funcionalidad, el sistema se vuelve mucho más mantenible y escalable, evitando carpetas globales sobresaturadas de archivos mixtos.

---

## 2. Estructura de Directorios para Páginas

Todas las pantallas deben ubicarse dentro de `src/pages/`. A partir de allí, se agrupan por grandes módulos de sistema (ej. `sistemas`, `rrhh`, `dashboard`).

Dentro de cada módulo, **cada funcionalidad (pantalla) tiene su propia subcarpeta dedicada**.

### Ejemplo de Estructura Correcta

```text
src/
└── pages/
    └── rrhh/                        <-- Módulo Principal (Carpeta)
        ├── Personal/                <-- Funcionalidad (Carpeta)
        │   ├── PersonalPage.jsx     <-- Componente Principal de la página
        │   ├── PersonalPage.css     <-- Estilos exclusivos de esta página
        │   ├── components/          <-- (Subcarpeta) Componentes usados SÓLO por esta página
        │   │   ├── PersonalTable.jsx
        │   │   ├── PersonalFormModal.jsx
        │   │   └── PersonalCard.jsx
        │   └── hooks/               <-- (Subcarpeta) Lógica de negocio (estado, llamadas API) de esta página
        │       └── usePersonal.js
        │
        └── Cargos/                  <-- Otra Funcionalidad independiente
            ├── CargosPage.jsx
            ├── CargosPage.css
            ├── components/
            │   ├── CargosTable.jsx
            │   └── CargoFormModal.jsx
            └── hooks/
                └── useCargos.js
```

---

## 3. Reglas de Creación de un Nuevo Módulo / Página

1. **Crear la carpeta contenedora de la Funcionalidad**:
   Si vas a crear una pantalla visual para el módulo de "Contabilidad" llamada "Facturas", debes crear: `src/pages/contabilidad/Facturas/`.
2. **Crear el Componente Page Central (`FeaturePage.jsx`)**:
   Dentro de `Facturas/` creas `FacturasPage.jsx`. Este archivo actúa como orquestador; *junta* el Hook y los Componentes.
3. **Crear el Archivo de Estilos (`FeaturePage.css`)**:
   Solo los estilos que afecten a esta página particular deben residir aquí.
4. **Almacenar la lógica en `/hooks`**:
   No incluyas toda la lógica de validación, paginación ni fetch de datos directamente en `FeaturePage.jsx`. Extrae esta lógica a un custom hook (ej.`useFacturas.js`) ubicado dentro de la subcarpeta `Facturas/hooks/`.
5. **Almacenar los subcomponentes en `/components`**:
   Las modales, tablas, o tarjetas que componen o se dibujan dentro de `FacturasPage.jsx` deben crearse en la subcarpeta `Facturas/components/`.

---

## 4. Importaciones Compartidas (Excepciones)

Existen elementos que pertenecen a todo el sistema y **SÍ** deben vivir en carpetas globales en la raíz de `src/`:

- **Componentes Base o DS (Design System)**: Botones genéricos, el Layout Principal, Alertas, o UI genérica (e.g. `<SecuredButton>`, `<DSPage>`). Estos van en `src/ds-components/`.
- **Servicios de API (Axios)**: Archivos responsables únicamente de consultar el backend Laravel. Estos residen en `src/services/` (ej. `src/services/facturasService.js`).
- **Estados Globales (Context / Zustand)**: Si manejas el usuario logueado o el tema visual (oscuro/claro).

*Nota sobre las rutas relativas:* Debido al anidamiento, cuando en un archivo `hooks/usePersonal.js` necesites consultar un servicio global, la importación requerirá subir múltiples niveles: `import { getData } from '../../../../services/myService'`.

---

## 5. Control de Acceso con SecuredButton

El componente `<SecuredButton>` se utiliza para controlar el acceso a acciones específicas basándose en los grupos/permisos de seguridad del usuario. **Es importante destacar que NO es obligatorio usar este componente en todos los botones del sistema**.

### Cuándo Usar SecuredButton

Debes usar `<SecuredButton>` en situaciones donde:
- La acción requiere permisos específicos (ej: crear, editar, eliminar registros)
- El botón debe estar visible solo para usuarios con ciertos roles o niveles de seguridad
- Necesitas restringir acceso a funcionalidades críticas del sistema

### Cuándo NO Usar SecuredButton

**NO** es necesario usar `<SecuredButton>` en:
- Botones de navegación general (menús laterales, breadcrumbs)
- Acciones que no requieren permisos especiales (ej: búsqueda, filtrado, exportación de datos públicos)
- Botones que siempre deben estar disponibles para todos los usuarios autenticados
- Elementos de UI decorativos o informativos

### Ejemplos de Uso

```jsx
// ✅ CORRECTO: Usar SecuredButton para acciones restringidas
<SecuredButton securityId="usuarios.crear">
  Nuevo Usuario
</SecuredButton>

<SecuredButton securityId={["usuarios.editar", "admin.accesos"]}>
  Editar Usuario
</SecuredButton>

// ✅ CORRECTO: Usar DSButton normal para acciones públicas
<DSButton onClick={handleSearch}>
  Buscar
</DSButton>

<DSButton variant="secondary" onClick={handleExport}>
  Exportar Datos
</DSButton>
```

### Soporte para Múltiples Grupos

El `<SecuredButton>` soporta asignar múltiples grupos de seguridad. El botón se mostrará si el usuario tiene acceso a **ALGUNO** de los grupos especificados (lógica OR):

```jsx
// El botón se muestra si el usuario tiene "usuarios.crear" O "admin.accesos"
<SecuredButton securityId={["usuarios.crear", "admin.accesos"]}>
  Crear Usuario
</SecuredButton>
```

---

