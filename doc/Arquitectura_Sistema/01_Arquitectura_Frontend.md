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

## 5. Resumen de Ventajas

- **Alta cohesión:** Toda la información sobre una funcionalidad está en el mismo sitio. Eliminas un módulo simplemente borrando su carpeta entera.
- **Bajo acoplamiento:** Si el módulo "Usuarios" cambia, sus imports no se rompen ni afectan al módulo "Cargos".
- **Facilidad de Búsqueda:** Cuando debas arreglar un bug en "Menús", sabrás exactamente a qué subcarpeta dirigirte (`src/pages/sistemas/Menus`) en lugar de escrutinar cientos de archivos en una carpeta global `components/`.
