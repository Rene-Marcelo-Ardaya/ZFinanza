# ZFinanza - Skill Principal (Router)

## Contexto del Proyecto

ZFinanza es un sistema financiero empresarial con arquitectura separada en frontend y backend:

- **Backend**: API Laravel en `api_laravel/`
- **Frontend**: Aplicación React con Vite en `react_vite/`
- **Módulos**: RRHH (Recursos Humanos), Sistemas, y otros módulos empresariales

## Enfoque del Skill

Este skill actúa como router para identificar el área correcta del proyecto según la tarea solicitada. Analiza la naturaleza de la solicitud y redirige al skill especializado correspondiente.

## Áreas del Proyecto

### 1. API Laravel (Backend)
**Usar cuando la tarea involucre:**
- Crear o modificar endpoints API
- Trabajar con modelos, migraciones, seeders
- Configuración de rutas en `routes/api/`
- Lógica de negocio en Controllers
- Autenticación y autorización
- Base de datos y consultas

**Skill especializado**: `zfinanza-api.md`

### 2. Frontend React (Frontend)
**Usar cuando la tarea involucre:**
- Crear o modificar componentes React
- Trabajar con hooks personalizados
- Diseño de sistema (DSComponents)
- Estilos CSS
- Navegación y rutas
- Estado global (useStore)
- Integración con API

**Skill especializado**: `zfinanza-frontend.md`

### 3. Módulo RRHH
**Usar cuando la tarea involucre:**
- Gestión de personal
- Cargos y roles de RRHH
- Control de asistencia
- Página de Personal (`react_vite/src/pages/rrhh/Personal/`)
- Rutas de RRHH (`api_laravel/routes/api/rrhh.php`)

**Skill especializado**: `zfinanza-rrhh.md`

### 4. Módulo Sistemas
**Usar cuando la tarea involucre:**
- Gestión de usuarios
- Control de accesos
- Menús y permisos
- Niveles de seguridad
- Negocios
- Páginas en `react_vite/src/pages/sistemas/`
- Rutas de Sistemas (`api_laravel/routes/api/sistemas.php`)

**Skill especializado**: `zfinanza-sistemas.md`

## Proceso de Identificación

Cuando recibas una solicitud, sigue este proceso:

1. **Analizar la solicitud**: ¿Qué área del proyecto está involucrada?
2. **Identificar el scope**: ¿Es backend, frontend, o un módulo específico?
3. **Redirigir**: Indica al usuario qué skill cargar para el trabajo específico

## Ejemplos de Redirección

```
Usuario: "Necesito crear un nuevo endpoint para listar usuarios"
→ Redirigir a: zfinanza-api.md (es backend)

Usuario: "Quiero modificar el componente de tabla de personal"
→ Redirigir a: zfinanza-rrhh.md (es módulo RRHH, frontend)

Usuario: "Necesito agregar un nuevo nivel de seguridad"
→ Redirigir a: zfinanza-sistemas.md (es módulo Sistemas)

Usuario: "Quiero crear un nuevo componente de formulario"
→ Redirigir a: zfinanza-frontend.md (es componente genérico de frontend)
```

## Archivos Clave por Área

### Backend (API Laravel)
- `api_laravel/routes/api.php` - Rutas principales
- `api_laravel/routes/api/rrhh.php` - Rutas RRHH
- `api_laravel/routes/api/sistemas.php` - Rutas Sistemas
- `api_laravel/app/Http/Controllers/` - Controladores
- `api_laravel/app/Models/` - Modelos

### Frontend (React)
- `react_vite/src/app/` - Configuración y shell de la app
- `react_vite/src/components/` - Componentes compartidos
- `react_vite/src/ds-*/` - Sistema de diseño
- `react_vite/src/services/` - Servicios API
- `react_vite/src/pages/` - Páginas por módulo

### Módulos Específicos
- `react_vite/src/pages/rrhh/` - Páginas RRHH
- `react_vite/src/pages/sistemas/` - Páginas Sistemas
- `react_vite/src/services/personalService.js` - Servicio Personal
- `react_vite/src/services/userService.js` - Servicio Usuarios

## Instrucciones para la IA

1. Si la solicitud es clara sobre el área, carga el skill especializado directamente.
2. Si la solicitud es ambigua, pregunta al usuario para aclarar el área.
3. Si la solicitud involucra múltiples áreas, indica qué skills cargar secuencialmente.
4. Siempre prioriza el skill más específico disponible.
