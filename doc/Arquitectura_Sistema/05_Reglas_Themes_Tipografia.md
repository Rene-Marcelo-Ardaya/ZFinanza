# Reglas de Themes y Tipografía - Guía para IA

Este documento establece las reglas que la IA debe respetar al trabajar con el sistema de temas y tipografía del proyecto.

---

## 1. Sistema de Themes

### Ubicación
`react_vite/src/theme/`

### Estructura

```
react_vite/src/theme/
├── index.js              # Proveedor principal de temas y ThemeProvider
└── tokens/               # Definiciones de tokens de cada tema
    ├── blue.js
    ├── gray.js
    ├── olive.js
    ├── dark.js
    ├── purple.js
    ├── teal.js
    ├── rose.js
    ├── earth.js
    ├── midnight.js
    ├── kaizen.js
    ├── cyberLogistics.js
    ├── agriZen.js
    ├── blueprintDraft.js
    ├── financeExecutive.js
    ├── materialDeep.js
    ├── solarFlare.js
    ├── nordicMinimal.js
    ├── carbonFiber.js
    ├── paperStack.js
    └── oceanicFlow.js
```

### Reglas Importantes

#### ✅ PERMITIDO
- **USAR** las variables CSS definidas en los temas para colores, espaciados, etc.
- **USAR** el hook `useTheme()` para acceder al tema actual
- **USAR** las variables de token como `var(--ds-accent)`, `var(--ds-primaryText)`, etc.
- **CONSULTAR** `theme/index.js` para ver los aliases de variables legacy

#### ❌ PROHIBIDO
- **NO MODIFICAR** el archivo `theme/index.js` sin autorización explícita
- **NO ELIMINAR** el bloque de comentario con información de autoría
- **NO CREAR** nuevos archivos de tema sin seguir el patrón existente
- **NO MODIFICAR** directamente los tokens de temas existentes sin aprobación
- **NO USAR** valores hardcoded (ej: `#2563eb`) en lugar de variables CSS
- **NO AGREGAR** nuevos temas sin actualizar el objeto `themes` en `index.js`

### Uso Correcto de Variables CSS

```css
/* ✅ CORRECTO: Usar variables del tema */
.my-component {
  background-color: var(--ds-accent);
  color: var(--ds-primaryText);
  border: 1px solid var(--ds-surfaceBorder);
}

/* ❌ INCORRECTO: Valores hardcoded */
.my-component {
  background-color: #2563eb;
  color: #374151;
  border: 1px solid #e5e7eb;
}
```

### Uso del Hook useTheme

```javascript
// ✅ CORRECTO
import { useTheme } from '../theme'

function MyComponent() {
  const { theme, setTheme, availableThemes, themeLabels } = useTheme()
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {availableThemes.map(t => (
        <option key={t} value={t}>{themeLabels[t]}</option>
      ))}
    </select>
  )
}
```

### Variables de Token Disponibles

Los temas definen tokens que se aplican como variables CSS con el prefijo `--ds-`:

| Categoría | Ejemplos de Variables |
|-----------|----------------------|
| **Colores** | `--ds-accent`, `--ds-primaryText`, `--ds-secondaryText`, `--ds-surfaceBg`, `--ds-panelBg` |
| **Bordes** | `--ds-surfaceBorder`, `--ds-panelBorder`, `--ds-fieldBorder` |
| **Estados** | `--ds-hoverBg`, `--ds-selectionBg`, `--ds-fieldDisabledBg` |
| **Feedback** | `--ds-successText`, `--ds-errorText`, `--ds-warningText`, `--ds-infoText` |
| **Fondos** | `--ds-successBg`, `--ds-errorBg`, `--ds-warningBg` |

### Aliases Legacy

El sistema mantiene aliases para compatibilidad con módulos históricos. Estos se aplican automáticamente en `theme/index.js`:

```javascript
// Ejemplos de aliases disponibles
--ds-color-primary           → var(--ds-accent)
--ds-color-text              → var(--ds-primaryText)
--ds-color-text-secondary    → var(--ds-secondaryText)
--ds-color-bg-secondary      → var(--ds-surfaceBg)
--ds-color-border            → var(--ds-surfaceBorder)
```

---

## 2. Sistema de Tipografía

### Ubicación
`react_vite/src/styles/ds-typography.css`

### Reglas Importantes

#### ✅ PERMITIDO
- **USAR** las variables de tamaño de fuente definidas en `ds-typography.css`
- **USAR** la variable `--ds-font-scale` para ajustes dinámicos
- **CONSULTAR** `ds-typography.css` para ver los tamaños disponibles

#### ❌ PROHIBIDO
- **NO MODIFICAR** el archivo `ds-typography.css` sin autorización explícita
- **NO USAR** valores hardcoded para tamaños de fuente (ej: `font-size: 16px`)
- **NO AGREGAR** nuevos tamaños de fuente sin seguir el patrón existente

### Variables de Tamaño de Fuente

```css
--ds-font-scale: 1;  /* Factor de escala global (0.5 a 2) */

/* Tamaños disponibles */
--ds-font-4xs: calc(11px * var(--ds-font-scale));   /* 11px */
--ds-font-3xs: calc(12px * var(--ds-font-scale));   /* 12px */
--ds-font-2xs: calc(13px * var(--ds-font-scale));   /* 13px */
--ds-font-xs:  calc(16px * var(--ds-font-scale));   /* 16px */
--ds-font-sm:  calc(17px * var(--ds-font-scale));   /* 17px */
--ds-font-md:  calc(18px * var(--ds-font-scale));   /* 18px */
--ds-font-lg:  calc(19px * var(--ds-font-scale));   /* 19px */
--ds-font-xl:  calc(20px * var(--ds-font-scale));   /* 20px */
--ds-font-xl2: calc(20px * var(--ds-font-scale));   /* 20px */
--ds-font-2xl: calc(22px * var(--ds-font-scale));   /* 22px */
--ds-font-3xl: calc(26px * var(--ds-font-scale));   /* 26px */
--ds-font-hero: calc(66px * var(--ds-font-scale));  /* 66px */

/* Tamaños display */
--ds-font-display-sm: calc(32px * var(--ds-font-scale));
--ds-font-display-md: calc(34px * var(--ds-font-scale));
--ds-font-display-lg: calc(38px * var(--ds-font-scale));
```

### Uso Correcto de Tipografía

```css
/* ✅ CORRECTO: Usar variables de tipografía */
.my-heading {
  font-size: var(--ds-font-2xl);
  color: var(--ds-primaryText);
}

.my-body-text {
  font-size: var(--ds-font-sm);
  color: var(--ds-secondaryText);
}

.my-small-text {
  font-size: var(--ds-font-2xs);
  color: var(--ds-secondaryText);
}

/* ❌ INCORRECTO: Valores hardcoded */
.my-heading {
  font-size: 22px;
  color: #374151;
}
```

### Uso en Styled Components / CSS-in-JS

```javascript
// ✅ CORRECTO
const StyledHeading = styled.h1`
  font-size: var(--ds-font-2xl);
  color: var(--ds-primaryText);
  font-weight: 600;
`

// ❌ INCORRECTO
const StyledHeading = styled.h1`
  font-size: 22px;
  color: #374151;
  font-weight: 600;
`
```

---

## 3. Buenas Prácticas Generales

### 3.1 Al Crear Componentes

```javascript
// ✅ CORRECTO
function MyComponent() {
  return (
    <div className="my-component">
      <h2 className="my-component__title">Título</h2>
      <p className="my-component__text">Texto</p>
    </div>
  )
}

// CSS correspondiente
.my-component {
  background-color: var(--ds-surfaceBg);
  border: 1px solid var(--ds-surfaceBorder);
  border-radius: var(--ds-radius-sm);
}

.my-component__title {
  font-size: var(--ds-font-xl);
  color: var(--ds-primaryText);
  margin-bottom: 0.5rem;
}

.my-component__text {
  font-size: var(--ds-font-sm);
  color: var(--ds-secondaryText);
}
```

### 3.2 Al Modificar Estilos Existentes

1. **VERIFICAR** si ya existe una variable CSS que haga lo que necesitas
2. **USAR** variables de tema para colores y fondos
3. **USAR** variables de tipografía para tamaños de fuente
4. **NO AGREGAR** nuevos valores hardcoded si existe una variable apropiada

### 3.3 Al Trabajar con Temas

```javascript
// ✅ CORRECTO: Usar el contexto de tema
import { useTheme } from '../theme'

function ThemeAwareComponent() {
  const { theme } = useTheme()
  
  return (
    <div className={`theme-aware-component ds-theme-${theme}`}>
      Contenido
    </div>
  )
}
```

---

## 4. Referencias

- **Theme Provider**: `react_vite/src/theme/index.js`
- **Theme Tokens**: `react_vite/src/theme/tokens/`
- **Typography**: `react_vite/src/styles/ds-typography.css`
- **Hook**: `useTheme()` desde `react_vite/src/theme`

---

> **Nota para IAs**: Este documento es OBLIGATORIO. Siempre consulta estas reglas antes de modificar cualquier estilo o crear componentes visuales. El incumplimiento de estas reglas puede causar inconsistencias visuales y problemas de mantenimiento.
