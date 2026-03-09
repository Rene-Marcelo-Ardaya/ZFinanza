# ZFinanza - Skill Módulo Sistemas

## Contexto

Este skill está especializado en trabajar con el módulo de Sistemas del proyecto ZFinanza. El módulo Sistemas abarca la gestión de usuarios, roles, permisos, menús, niveles de seguridad, control de accesos, configuraciones y negocios.

## Estructura del Módulo Sistemas

### Backend (API Laravel)

```
api_laravel/
├── app/
│   ├── Http/Controllers/Sistemas/
│   │   ├── UserController.php                # Controlador de Usuarios
│   │   ├── RoleController.php                 # Controlador de Roles
│   │   ├── PermissionController.php           # Controlador de Permisos
│   │   ├── MenuController.php                 # Controlador de Menús
│   │   ├── NivelSeguridadController.php      # Controlador de Niveles de Seguridad
│   │   ├── SettingController.php             # Controlador de Configuraciones
│   │   ├── NegocioController.php             # Controlador de Negocios
│   │   └── ComponenteSeguridadController.php # Controlador de Componentes de Seguridad
│   └── Models/Sistemas/
│       ├── User.php                           # Modelo Usuario
│       ├── Role.php                           # Modelo Role
│       ├── Permission.php                     # Modelo Permiso
│       ├── Menu.php                           # Modelo Menú
│       ├── NivelSeguridad.php                 # Modelo Nivel de Seguridad
│       ├── Setting.php                        # Modelo Setting
│       ├── Negocio.php                        # Modelo Negocio
│       ├── ComponenteSeguridad.php            # Modelo Componente de Seguridad
│       └── UbicacionPin.php                   # Modelo Ubicación PIN
└── routes/api/
    └── sistemas.php                           # Rutas Sistemas
```

### Frontend (React)

```
react_vite/src/pages/sistemas/
├── Usuarios/                                  # Gestión de Usuarios
│   ├── UsuariosPage.jsx
│   ├── UsuariosPage.css
│   ├── components/
│   │   ├── UsuarioCard.jsx
│   │   ├── UserFormModal.jsx
│   │   ├── UsuariosFilters.jsx
│   │   └── UsuariosTable.jsx
│   └── hooks/
│       └── useUsuarios.js
├── ControlAccesos/                            # Control de Accesos
│   ├── ControlAccesosPage.jsx
│   ├── ControlAccesosPage.css
│   ├── components/
│   │   ├── RoleCard.jsx
│   │   ├── RoleFormModal.jsx
│   │   ├── RoleMenusModal.jsx
│   │   ├── RoleUsersModal.jsx
│   │   ├── RolesFilters.jsx
│   │   ├── RolesTable.jsx
│   │   └── MenuTree.jsx
│   └── hooks/
│       └── useControlAccesos.js
├── Menus/                                     # Gestión de Menús
│   ├── MenusPage.jsx
│   ├── MenusPage.css
│   ├── components/
│   │   ├── IconPicker.jsx
│   │   ├── MenuFormModal.jsx
│   │   ├── MenuTreeTable.jsx
│   │   └── SortableMenuTree.jsx
│   └── hooks/
│       └── useMenus.js
├── NivelesSeguridad/                          # Niveles de Seguridad
│   ├── NivelesSeguridadPage.jsx
│   ├── NivelesSeguridadPage.css
│   ├── components/
│   │   ├── NivelCard.jsx
│   │   ├── NivelFormModal.jsx
│   │   ├── NivelesTable.jsx
│   │   ├── ColorPicker.jsx
│   │   └── MiembrosModal.jsx
│   └── hooks/
│       └── useNivelesSeguridad.js
├── Negocios/                                  # Gestión de Negocios
│   ├── NegociosPage.jsx
│   ├── NegociosPage.css
│   ├── components/
│   │   ├── NegocioCard.jsx
│   │   ├── NegocioFormModal.jsx
│   │   ├── NegociosFilters.jsx
│   │   └── NegociosTable.jsx
│   └── hooks/
│       └── useNegocios.js
└── Configuracion/                             # Configuración del Sistema
    ├── ConfiguracionPage.jsx
    ├── ConfiguracionPage.css
    ├── components/
    │   ├── ConfigTextField.jsx
    │   ├── ConfigColorField.jsx
    │   └── ConfigImageField.jsx
    └── hooks/
        └── useConfiguracion.js
```

### Servicios API

```
react_vite/src/services/
├── userService.js              # Servicio de Usuarios
├── roleService.js              # Servicio de Roles
├── menuService.js              # Servicio de Menús
├── menuAdminService.js         # Servicio de Menús Admin
├── securityLevelService.js     # Servicio de Niveles de Seguridad
├── settingService.js           # Servicio de Configuraciones
├── negocioService.js           # Servicio de Negocios
└── authService.js              # Servicio de Autenticación
```

## Rutas API Sistemas

### Rutas de Usuarios (`/api/sistemas/usuarios`)
- `GET /api/sistemas/usuarios` - Listar usuarios
- `GET /api/sistemas/usuarios/{id}` - Obtener un usuario
- `POST /api/sistemas/usuarios` - Crear usuario
- `PUT /api/sistemas/usuarios/{id}` - Actualizar usuario
- `DELETE /api/sistemas/usuarios/{id}` - Eliminar usuario
- `PUT /api/sistemas/usuarios/{id}/roles` - Asignar roles a usuario

### Rutas de Roles (`/api/sistemas/roles`)
- `GET /api/sistemas/roles` - Listar roles
- `GET /api/sistemas/roles/{id}` - Obtener un rol
- `POST /api/sistemas/roles` - Crear rol
- `PUT /api/sistemas/roles/{id}` - Actualizar rol
- `DELETE /api/sistemas/roles/{id}` - Eliminar rol
- `PUT /api/sistemas/roles/{id}/permisos` - Asignar permisos a rol
- `PUT /api/sistemas/roles/{id}/menus` - Asignar menús a rol

### Rutas de Permisos (`/api/sistemas/permisos`)
- `GET /api/sistemas/permisos` - Listar permisos
- `GET /api/sistemas/permisos/{id}` - Obtener un permiso
- `POST /api/sistemas/permisos` - Crear permiso
- `PUT /api/sistemas/permisos/{id}` - Actualizar permiso
- `DELETE /api/sistemas/permisos/{id}` - Eliminar permiso

### Rutas de Menús (`/api/sistemas/menus`)
- `GET /api/sistemas/menus` - Listar menús (con estructura jerárquica)
- `GET /api/sistemas/menus/{id}` - Obtener un menú
- `POST /api/sistemas/menus` - Crear menú
- `PUT /api/sistemas/menus/{id}` - Actualizar menú
- `DELETE /api/sistemas/menus/{id}` - Eliminar menú
- `PUT /api/sistemas/menus/reorder` - Reordenar menús

### Rutas de Niveles de Seguridad (`/api/sistemas/niveles-seguridad`)
- `GET /api/sistemas/niveles-seguridad` - Listar niveles de seguridad
- `GET /api/sistemas/niveles-seguridad/{id}` - Obtener un nivel
- `POST /api/sistemas/niveles-seguridad` - Crear nivel
- `PUT /api/sistemas/niveles-seguridad/{id}` - Actualizar nivel
- `DELETE /api/sistemas/niveles-seguridad/{id}` - Eliminar nivel

### Rutas de Negocios (`/api/sistemas/negocios`)
- `GET /api/sistemas/negocios` - Listar negocios
- `GET /api/sistemas/negocios/{id}` - Obtener un negocio
- `POST /api/sistemas/negocios` - Crear negocio
- `PUT /api/sistemas/negocios/{id}` - Actualizar negocio
- `DELETE /api/sistemas/negocios/{id}` - Eliminar negocio

### Rutas de Configuraciones (`/api/sistemas/settings`)
- `GET /api/sistemas/settings` - Listar configuraciones
- `GET /api/sistemas/settings/{key}` - Obtener una configuración
- `PUT /api/sistemas/settings/{key}` - Actualizar configuración

## Modelos de Datos

### User
```javascript
{
  id: number,
  name: string,
  email: string,
  password: string,           // Hashed
  is_active: boolean,
  id_personal: number,        // FK a Personal (opcional)
  created_at: string,
  updated_at: string
}
```

### Role
```javascript
{
  id: number,
  name: string,
  is_active: boolean,
  created_at: string,
  updated_at: string
}
```

### Permission
```javascript
{
  id: number,
  name: string,
  description: string,
  created_at: string,
  updated_at: string
}
```

### Menu
```javascript
{
  id: number,
  nombre: string,
  ruta: string,
  icono: string,
  menu_type: string,          // 'sidebar', 'topbar', etc.
  parent_id: number,           // FK a Menu (para jerarquía)
  orden: number,
  activo: boolean,
  created_at: string,
  updated_at: string
}
```

### NivelSeguridad
```javascript
{
  id: number,
  nombre: string,
  color: string,               // Color hexadecimal
  nivel: number,               // Nivel numérico
  created_at: string,
  updated_at: string
}
```

### Negocio
```javascript
{
  id: number,
  nombre: string,
  direccion: string,
  telefono: string,
  email: string,
  activo: boolean,
  created_at: string,
  updated_at: string
}
```

### Setting
```javascript
{
  id: number,
  key: string,                 // Clave única
  value: string,               // Valor (puede ser JSON)
  type: string,                // 'string', 'number', 'boolean', 'color', 'image'
  description: string,
  created_at: string,
  updated_at: string
}
```

## Relaciones

### User
- Pertenece a muchos Roles (many-to-many)
- Puede pertenecer a un Personal (opcional)

### Role
- Tiene muchos Users (many-to-many)
- Tiene muchos Permissions (many-to-many)
- Tiene muchos Menús (many-to-many)

### Menu
- Pertenece a un Menu padre (self-referencing)
- Tiene muchos Menús hijos (self-referencing)
- Pertenece a muchos Roles (many-to-many)

### NivelSeguridad
- Tiene muchos Users (asignación de nivel de seguridad)

## Hooks Personalizados

### useUsuarios
Hook para gestionar la lógica de la página de Usuarios.

### useControlAccesos
Hook para gestionar la lógica de la página de Control de Accesos (Roles).

### useMenus
Hook para gestionar la lógica de la página de Menús.

### useNivelesSeguridad
Hook para gestionar la lógica de la página de Niveles de Seguridad.

### useNegocios
Hook para gestionar la lógica de la página de Negocios.

### useConfiguracion
Hook para gestionar la lógica de la página de Configuración.

## Componentes Especiales

### IconPicker
Componente para seleccionar iconos de menú.

### MenuTree
Componente para visualizar y gestionar la estructura jerárquica de menús.

### SortableMenuTree
Componente para reordenar menús mediante drag & drop.

### ColorPicker
Componente para seleccionar colores (usado en Niveles de Seguridad).

### ConfigTextField
Componente para configuraciones de tipo texto.

### ConfigColorField
Componente para configuraciones de tipo color.

### ConfigImageField
Componente para configuraciones de tipo imagen.

## Funcionalidades

### Gestión de Usuarios
- Listado de usuarios con paginación
- Creación de nuevos usuarios
- Edición de usuarios existentes
- Eliminación de usuarios
- Asignación de roles a usuarios
- Asignación de personal a usuarios
- Activación/desactivación de usuarios

### Gestión de Roles (Control de Accesos)
- Listado de roles
- Creación de nuevos roles
- Edición de roles existentes
- Eliminación de roles
- Asignación de permisos a roles
- Asignación de menús a roles
- Visualización de usuarios por rol
- Visualización de menús por rol

### Gestión de Menús
- Listado de menús con estructura jerárquica
- Creación de nuevos menús
- Edición de menús existentes
- Eliminación de menús
- Reordenamiento de menús (drag & drop)
- Selección de iconos
- Definición de tipos de menú (sidebar, topbar, etc.)

### Gestión de Niveles de Seguridad
- Listado de niveles de seguridad
- Creación de nuevos niveles
- Edición de niveles existentes
- Eliminación de niveles
- Asignación de colores
- Definición de niveles numéricos
- Visualización de miembros por nivel

### Gestión de Negocios
- Listado de negocios
- Creación de nuevos negocios
- Edición de negocios existentes
- Eliminación de negocios
- Gestión de información de contacto

### Configuración del Sistema
- Listado de configuraciones
- Edición de configuraciones
- Tipos de configuración: texto, número, booleano, color, imagen

## Validaciones

### Validaciones de Usuario
- Nombre: requerido, máximo 255 caracteres
- Email: requerido, formato válido, único
- Password: requerido (mínimo 8 caracteres) al crear
- Roles: al menos uno requerido

### Validaciones de Role
- Nombre: requerido, máximo 255 caracteres, único
- Permisos: al menos uno requerido

### Validaciones de Menú
- Nombre: requerido, máximo 255 caracteres
- Ruta: requerido, máximo 255 caracteres
- Tipo: requerido

### Validaciones de Nivel de Seguridad
- Nombre: requerido, máximo 255 caracteres
- Color: requerido, formato hexadecimal
- Nivel: requerido, número positivo

## Consideraciones Especiales

1. **Soft Delete**: Usuarios, Roles y Menús usan soft delete
2. **Jerarquía de Menús**: Los menús tienen estructura padre/hijo
3. **Permisos**: Los roles tienen permisos que determinan el acceso
4. **Menús por Rol**: Los menús visibles dependen del rol del usuario
5. **Configuraciones**: Las configuraciones pueden ser de diferentes tipos
6. **Niveles de Seguridad**: Los usuarios pueden tener asignado un nivel de seguridad

## Integración con Otros Módulos

- **RRHH**: Usuarios pueden estar asociados a Personal
- **Autenticación**: Usa el sistema de autenticación Laravel Sanctum
- **Frontend**: Los menús se generan dinámicamente según el rol del usuario

## Archivos Clave

### Backend
- `api_laravel/routes/api/sistemas.php` - Rutas Sistemas
- `api_laravel/app/Http/Controllers/Sistemas/` - Controladores
- `api_laravel/app/Models/Sistemas/` - Modelos

### Frontend
- `react_vite/src/pages/sistemas/` - Páginas del módulo
- `react_vite/src/services/` - Servicios API
- `react_vite/src/core/SecurityContext.jsx` - Contexto de seguridad
