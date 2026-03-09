# ZFinanza - Skill Frontend React

## Contexto

Este skill está especializado en trabajar con el frontend React del proyecto ZFinanza, ubicado en `react_vite/`. Es una aplicación React construida con Vite que consume la API Laravel.

## Estructura del Frontend

```
react_vite/src/
├── app/                           # Configuración y shell de la app
│   ├── AppShell.jsx              # Layout principal de la app
│   ├── PageRegistry.js           # Registro de páginas
│   ├── routes.js                 # Definición de rutas
│   ├── featureFlags.js           # Flags de funcionalidades
│   └── index.js                  # Entry point del módulo app
├── components/                   # Componentes compartidos
│   ├── Sidebar.jsx               # Barra lateral de navegación
│   ├── UserMenu.jsx              # Menú de usuario
│   └── common/
│       └── BrandLogo.jsx         # Logo de marca
├── core/                         # Lógica central
│   ├── authors.js                # Autores del proyecto
│   ├── integrityCheck.js         # Verificación de integridad
│   ├── SecurityContext.jsx       # Contexto de seguridad
│   ├── SharedDataContext.jsx     # Contexto de datos compartidos
│   ├── useStore.js               # Hook de estado global
│   └── useToast.js               # Hook de notificaciones
├── db/                           # Base de datos local (IndexedDB)
│   └── db.js                     # Configuración DB
├── ds-*/                         # Sistema de Diseño (Design System)
│   ├── ds-components/            # Componentes genéricos
│   │   ├── DSResponsiveTable.jsx
│   │   └── index.js
│   ├── ds-forms/                 # Componentes de formulario
│   │   ├── DSButton.jsx
│   │   ├── DSCheckbox.jsx
│   │   ├── DSCheckboxGroup.jsx
│   │   ├── DSComboBox.jsx
│   │   ├── DSDateField.jsx
│   │   ├── DSDateTimeField.jsx
│   │   ├── DSField.jsx
│   │   ├── DSFormPanel.jsx
│   │   ├── DSImageUpload.jsx
│   │   ├── DSMultiSearchSelect.jsx
│   │   ├── DSNumberField.jsx
│   │   ├── DSPasswordField.jsx
│   │   ├── DSRadio.jsx
│   │   ├── DSRadioGroup.jsx
│   │   ├── DSSearchSelect.jsx
│   │   ├── DSTextArea.jsx
│   │   ├── DSTextField.jsx
│   │   ├── DSTimeField.jsx
│   │   ├── DSTimeRangeField.jsx
│   │   ├── SecuredButton.jsx
│   │   └── index.js
│   ├── ds-layout/                # Componentes de layout
│   │   ├── DSAccordion.jsx
│   │   ├── DSBorderLayout.jsx
│   │   ├── DSFooter.jsx
│   │   ├── DSPage.jsx
│   │   ├── DSPanel.jsx
│   │   ├── DSSection.jsx
│   │   ├── DSTabs.jsx
│   │   ├── DSTabsByRole.jsx
│   │   └── index.js
│   ├── ds-lists/                 # Componentes de listas
│   │   ├── DSBadge.jsx
│   │   ├── DSEditableGrid.jsx
│   │   ├── DSGrid.jsx
│   │   ├── DSList.jsx
│   │   ├── DSTable.jsx
│   │   └── index.js
│   ├── ds-navigation/            # Componentes de navegación
│   │   ├── DSMenuBar.jsx
│   │   ├── DSTree.jsx
│   │   └── index.js
│   └── ds-overlays/              # Componentes de overlays
│       ├── DSTooltip.jsx
│       ├── DSWindow.jsx
│       └── index.js
├── hooks/                        # Hooks personalizados
│   ├── useMobileDetection.js     # Detección de móvil
│   ├── useNetworkStatus.js       # Estado de red
│   ├── usePWAInstall.js          # Instalación PWA
│   └── useSessionTimeout.js      # Timeout de sesión
├── pages/                        # Páginas por módulo
│   ├── LoginPage.jsx             # Página de login
│   ├── dashboard/                # Dashboard
│   │   ├── DashboardPage.jsx
│   │   └── dashboard.css
│   ├── rrhh/                     # Páginas RRHH
│   │   └── Personal/
│   │       ├── PersonalPage.jsx
│   │       ├── PersonalPage.css
│   │       ├── components/
│   │       │   ├── PersonalCard.jsx
│   │       │   ├── PersonalFilters.jsx
│   │       │   ├── PersonalFormModal.jsx
│   │       │   └── PersonalTable.jsx
│   │       └── hooks/
│   │           └── usePersonal.js
│   └── sistemas/                 # Páginas Sistemas
│       ├── Usuarios/
│       ├── ControlAccesos/
│       ├── Menus/
│       ├── Negocios/
│       └── NivelesSeguridad/
├── services/                     # Servicios API
│   ├── authService.js             # Autenticación
│   ├── cargoService.js           # Cargos RRHH
│   ├── menuAdminService.js       # Menús admin
│   ├── menuService.js            # Menús
│   ├── negocioService.js         # Negocios
│   ├── personalService.js        # Personal RRHH
│   ├── roleService.js            # Roles
│   ├── securityLevelService.js   # Niveles seguridad
│   ├── settingService.js         # Settings
│   ├── userService.js            # Usuarios
│   └── index.js                  # Export de servicios
├── styles/                       # Estilos globales
│   ├── buttons.css
│   ├── cards.css
│   ├── dashboard.css
│   ├── ds-*.css                  # Estilos del DS
│   ├── forms.css
│   ├── layouts.css
│   ├── login.css
│   ├── navigation.css
│   └── ...
├── theme/                        # Temas de la aplicación
│   ├── index.js
│   └── tokens/
│       ├── agriZen.js
│       ├── blue.js
│       ├── carbonFiber.js
│       ├── cyberLogistics.js
│       ├── dark.js
│       ├── earth.js
│       ├── financeExecutive.js
│       ├── gray.js
│       ├── kaizen.js
│       ├── materialDeep.js
│       ├── midnight.js
│       ├── nordicMinimal.js
│       ├── oceanicFlow.js
│       ├── olive.js
│       ├── paperStack.js
│       ├── purple.js
│       ├── rose.js
│       ├── solarFlare.js
│       └── teal.js
├── App.jsx                       # Componente raíz
├── main.jsx                      # Entry point
└── config.js                     # Configuración de la app
```

## Sistema de Diseño (DS)

El proyecto usa un sistema de diseño propio con prefijo `DS`:

### Componentes de Formulario (`ds-forms/`)
- `DSTextField` - Campo de texto
- `DSNumberField` - Campo numérico
- `DSDateField` - Selector de fecha
- `DSTimeField` - Selector de hora
- `DSCheckbox` - Checkbox individual
- `DSCheckboxGroup` - Grupo de checkboxes
- `DSRadio` - Radio button
- `DSRadioGroup` - Grupo de radio buttons
- `DSSearchSelect` - Select con búsqueda
- `DSComboBox` - ComboBox
- `DSMultiSearchSelect` - Multi-select con búsqueda
- `DSTextArea` - Área de texto
- `DSPasswordField` - Campo de contraseña
- `DSButton` - Botón
- `SecuredButton` - Botón con seguridad

### Componentes de Layout (`ds-layout/`)
- `DSPage` - Página contenedora
- `DSSection` - Sección de contenido
- `DSPanel` - Panel
- `DSTabs` - Pestañas
- `DSTabsByRole` - Pestañas por rol
- `DSAccordion` - Acordeón
- `DSBorderLayout` - Layout con bordes
- `DSFooter` - Footer

### Componentes de Listas (`ds-lists/`)
- `DSTable` - Tabla
- `DSGrid` - Grid
- `DSList` - Lista
- `DSEditableGrid` - Grid editable
- `DSBadge` - Badge

### Componentes de Navegación (`ds-navigation/`)
- `DSMenuBar` - Menú de barra
- `DSTree` - Árbol

### Componentes de Overlays (`ds-overlays/`)
- `DSWindow` - Ventana modal
- `DSTooltip` - Tooltip

## Hooks Personalizados

### useStore
Hook de estado global para manejar el estado de la aplicación.

### useToast
Hook para mostrar notificaciones/toasts.

### useSessionTimeout
Hook para manejar el timeout de sesión.

### useMobileDetection
Hook para detectar si la app está en móvil.

### useNetworkStatus
Hook para detectar el estado de la red.

### usePWAInstall
Hook para la instalación de la PWA.

## Contextos

### SecurityContext
Contexto para manejar la seguridad y permisos del usuario.

### SharedDataContext
Contexto para compartir datos entre componentes.

## Servicios API

Los servicios están en `react_vite/src/services/` y siguen este patrón:

```javascript
// Ejemplo de servicio
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const personalService = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/rrhh/personal`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_BASE}/rrhh/personal/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post(`${API_BASE}/rrhh/personal`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`${API_BASE}/rrhh/personal/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_BASE}/rrhh/personal/${id}`);
    return response.data;
  }
};
```

## Patrones de Página

### Estructura de Página

```javascript
import React from 'react';
import { DSPage, DSTable } from '../ds-layout';
import { usePersonal } from './hooks/usePersonal';

const PersonalPage = () => {
  const { data, loading, error } = usePersonal();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DSPage title="Personal">
      {/* Contenido de la página */}
    </DSPage>
  );
};

export default PersonalPage;
```

### Hooks Personalizados por Página

Cada página tiene su propio hook en `hooks/`:
- `usePersonal.js` - Hook para página de Personal
- `useNegocios.js` - Hook para página de Negocios
- `useNivelesSeguridad.js` - Hook para página de Niveles de Seguridad

## Componentes de Página

### Card Component
Componente para mostrar información en formato tarjeta.

### Table Component
Componente para mostrar datos en formato tabla.

### Filters Component
Componente para filtros de búsqueda.

### FormModal Component
Componente modal para formularios.

## Rutas

Las rutas se definen en `react_vite/src/app/routes.js` y se registran en `PageRegistry.js`.

## Temas

La aplicación soporta múltiples temas definidos en `react_vite/src/theme/tokens/`:
- `financeExecutive` - Tema financiero ejecutivo
- `dark` - Tema oscuro
- `blue` - Tema azul
- Y muchos más...

## Configuración

### config.js
Archivo de configuración principal con:
- URL de la API
- Configuración de timeouts
- Opciones de la aplicación

## Estilos

### Estilos Globales
Los estilos globales están en `react_vite/src/styles/`.

### Estilos por Componente
Los componentes tienen su propio archivo CSS con el mismo nombre.

## Convenciones de Nomenclatura

- **Componentes**: PascalCase
- **Archivos CSS**: kebab-case.css
- **Hooks**: camelCase con prefijo `use`
- **Servicios**: camelCase con sufijo `Service`
- **Constantes**: UPPER_SNAKE_CASE

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Variables de Entorno

Las variables de entorno se definen en `.env`:
- `VITE_API_URL` - URL de la API Laravel

## Consideraciones Especiales

1. **Responsive**: La app es responsive, usar breakpoints apropiados
2. **Accesibilidad**: Usar atributos ARIA apropiados
3. **Performance**: Usar memoización cuando sea necesario
4. **Error Handling**: Manejar errores apropiadamente en servicios y componentes
5. **Loading States**: Mostrar estados de carga apropiados
6. **Validación**: Validar formularios antes de enviar
