# ZFinanza - Skill API Laravel

## Contexto

Este skill está especializado en trabajar con la API Laravel del proyecto ZFinanza, ubicada en `api_laravel/`. Es el backend que provee todos los servicios REST para el frontend React.

## Estructura del Backend

```
api_laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php          # Autenticación
│   │   │   ├── RRHH/                       # Controladores RRHH
│   │   │   │   ├── CargoController.php
│   │   │   │   └── PersonalController.php
│   │   │   └── Sistemas/                   # Controladores Sistemas
│   │   │       ├── UserController.php
│   │   │       ├── RoleController.php
│   │   │       ├── MenuController.php
│   │   │       ├── PermissionController.php
│   │   │       ├── NivelSeguridadController.php
│   │   │       ├── SettingController.php
│   │   │       ├── NegocioController.php
│   │   │       └── ComponenteSeguridadController.php
│   │   └── Middleware/
│   │       ├── CheckSessionTimeout.php     # Timeout de sesión
│   │       └── ForceCors.php               # CORS
│   ├── Models/
│   │   ├── User.php                        # Modelo Usuario
│   │   ├── BaseDatos.php
│   │   ├── Negocio.php
│   │   ├── RRHH/                           # Modelos RRHH
│   │   │   ├── Cargo.php
│   │   │   ├── Personal.php
│   │   │   └── PersonalPinAcceso.php
│   │   └── Sistemas/                       # Modelos Sistemas
│   │       ├── Role.php
│   │       ├── Permission.php
│   │       ├── Menu.php
│   │       ├── NivelSeguridad.php
│   │       ├── Setting.php
│   │       ├── ComponenteSeguridad.php
│   │       └── UbicacionPin.php
│   └── Services/
│       └── PinValidationService.php       # Validación de PIN
├── routes/
│   ├── api.php                             # Rutas principales
│   ├── api/
│   │   ├── rrhh.php                        # Rutas RRHH
│   │   └── sistemas.php                    # Rutas Sistemas
│   ├── web.php
│   └── console.php
├── database/
│   ├── migrations/                         # Migraciones DB
│   └── seeders/                            # Seeders iniciales
└── config/                                 # Configuración Laravel
```

## Rutas API Principales

### Rutas Generales (`routes/api.php`)
- Autenticación: `/api/auth/*`
- Gestión de sesión

### Rutas RRHH (`routes/api/rrhh.php`)
- Cargos: `/api/rrhh/cargos`
- Personal: `/api/rrhh/personal`

### Rutas Sistemas (`routes/api/sistemas.php`)
- Usuarios: `/api/sistemas/usuarios`
- Roles: `/api/sistemas/roles`
- Permisos: `/api/sistemas/permisos`
- Menús: `/api/sistemas/menus`
- Niveles de Seguridad: `/api/sistemas/niveles-seguridad`
- Settings: `/api/sistemas/settings`
- Negocios: `/api/sistemas/negocios`
- Componentes de Seguridad: `/api/sistemas/componentes-seguridad`

## Modelos y Relaciones

### Usuario (User)
- Relación con Personal (opcional, mediante `id_personal`)
- Relación con Roles (many-to-many)
- Campos: `id`, `name`, `email`, `password`, `is_active`, `id_personal`

### Personal (RRHH)
- Relación con Cargo (belongs to)
- Relación con Usuario (has one, opcional)
- Campos: `id`, `nombre`, `apellido`, `cargo_id`, `activo`, etc.

### Cargo (RRHH)
- Tiene muchos Personal
- Campos: `id`, `nombre`, `descripcion`, `activo`

### Role (Sistemas)
- Relación con Permisos (many-to-many)
- Relación con Usuarios (many-to-many)
- Campos: `id`, `name`, `is_active`

### Menu (Sistemas)
- Estructura jerárquica (padre/hijo)
- Relación con Permisos
- Campos: `id`, `nombre`, `ruta`, `icono`, `menu_type`, `parent_id`

### NivelSeguridad (Sistemas)
- Define niveles de acceso
- Campos: `id`, `nombre`, `color`, `nivel`

## Patrones de Código

### Estructura de Controlador

```php
<?php

namespace App\Http\Controllers\RRHH; // o Sistemas

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RRHH\Personal; // Modelo correspondiente

class PersonalController extends Controller
{
    public function index(Request $request)
    {
        // Lógica de listado con filtros
    }

    public function store(Request $request)
    {
        // Validación y creación
    }

    public function show($id)
    {
        // Mostrar un recurso
    }

    public function update(Request $request, $id)
    {
        // Validación y actualización
    }

    public function destroy($id)
    {
        // Eliminación (soft delete preferido)
    }
}
```

### Validaciones

Usa las validaciones de Laravel:
```php
$request->validate([
    'nombre' => 'required|string|max:255',
    'email' => 'required|email|unique:users,email',
    // ...
]);
```

### Respuestas JSON

```php
return response()->json([
    'success' => true,
    'data' => $data,
    'message' => 'Operación exitosa'
], 200);

// Error
return response()->json([
    'success' => false,
    'message' => 'Error en la operación',
    'errors' => $errors
], 422);
```

## Migraciones Importantes

### Tablas Principales
- `users` - Usuarios del sistema
- `roles` - Roles de usuario
- `permissions` - Permisos
- `menus` - Menús del sistema
- `niveles_seguridad` - Niveles de seguridad
- `personal` - Personal de RRHH
- `cargos` - Cargos de RRHH
- `negocios` - Negocios/Empresas
- `settings` - Configuraciones del sistema

## Servicios Especiales

### PinValidationService
Servicio para validar PINs de acceso ubicado en `app/Services/PinValidationService.php`

## Middleware

### CheckSessionTimeout
Middleware para controlar el timeout de sesión activa.

### ForceCors
Middleware para forzar CORS headers.

## Comandos Útiles

```bash
# Crear migración
php artisan make:migration create_table_name

# Ejecutar migraciones
php artisan migrate

# Crear controlador
php artisan make:controller RRHH/PersonalController

# Crear modelo
php artisan make:model RRHH/Personal

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## Convenciones de Nomenclatura

- **Controladores**: PascalCase, sufijo `Controller`
- **Modelos**: PascalCase, singular
- **Rutas**: kebab-case, plural para recursos
- **Migraciones**: `YYYY_MM_DD_HHMMSS_descripcion.php`
- **Tablas**: snake_case, plural

## Autenticación y Autorización

- Usa Sanctum para autenticación API
- Roles y Permisos para autorización
- Verificar `is_active` en usuarios y roles

## Consideraciones Especiales

1. **Soft Deletes**: Preferir soft deletes sobre deletes permanentes
2. **Timestamps**: Laravel maneja automáticamente `created_at` y `updated_at`
3. **Filtros**: Implementar filtros en los endpoints de listado
4. **Paginación**: Usar paginación de Laravel para listados grandes
5. **Transacciones**: Usar transacciones DB para operaciones complejas

## Testing

Los tests están en `tests/Feature/` y `tests/Unit/`.

## Archivos de Configuración Clave

- `config/database.php` - Configuración DB
- `config/auth.php` - Configuración autenticación
- `config/cors.php` - Configuración CORS
