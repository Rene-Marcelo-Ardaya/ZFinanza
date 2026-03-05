# API Laravel Base

API base limpia de Laravel para servir como fundamento de nuevos sistemas. Incluye autenticación con Sanctum, control de acceso, RRHH y configuración del sistema.

## 📋 Requisitos

- PHP >= 8.2
- Composer
- MySQL >= 5.7
- Node.js & NPM (opcional, para assets)

## 🚀 Instalación

```bash
# 1. Clonar o copiar el proyecto
cp -r Base/api_laravel /ruta/nuevo-proyecto

# 2. Instalar dependencias
composer install

# 3. Copiar archivo de entorno
cp .env.example .env

# 4. Generar key de la aplicación
php artisan key:generate

# 5. Configurar base de datos en .env
# DB_DATABASE=kaizen_base
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Ejecutar migraciones
php artisan migrate

# 7. Ejecutar seeders (datos base)
php artisan db:seed

# 8. (Opcional) Instalar assets frontend
npm install && npm run build
```

## 📁 Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php      # Login, logout, registro
│   │   ├── UserController.php      # CRUD usuarios
│   │   ├── RoleController.php      # CRUD roles
│   │   ├── PermissionController.php # CRUD permisos
│   │   ├── MenuController.php      # CRUD menús + menús por rol
│   │   ├── CargoController.php     # CRUD cargos
│   │   ├── PersonalController.php  # CRUD personal + validación PIN
│   │   └── SettingController.php   # CRUD configuración
│   └── Middleware/
│       ├── ForceCors.php           # Headers CORS
│       └── CheckSessionTimeout.php # Timeout por rol
├── Models/
│   ├── User.php
│   ├── Role.php
│   ├── Permission.php
│   ├── Menu.php
│   ├── Cargo.php
│   ├── Personal.php
│   ├── UbicacionPin.php
│   ├── PersonalPinAcceso.php
│   ├── NivelSeguridad.php
│   ├── ComponenteSeguridad.php
│   └── Setting.php
└── Services/
    └── PinValidationService.php    # Validación de PIN

database/
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 2025_12_17_000001_create_access_control_tables.php
│   ├── 2025_12_17_000001_create_settings_table.php
│   ├── 2025_12_22_000001_create_rrhh_tables.php
│   └── 2025_12_29_000001_create_security_tables.php
└── seeders/
    ├── BaseConfigurationSeeder.php # Roles y admin inicial
    ├── MenusSeeder.php             # Menús base
    └── DatabaseSeeder.php          # Orquestador
```

## 🔌 Endpoints API

### Autenticación (sin middleware)
```
POST /api/auth/login      # Iniciar sesión
POST /api/auth/logout     # Cerrar sesión
POST /api/auth/register   # Registrar usuario
GET  /api/auth/user       # Perfil del usuario autenticado
```

### Usuarios (auth:sanctum)
```
GET    /api/users         # Listar
POST   /api/users         # Crear
GET    /api/users/{id}    # Ver
PUT    /api/users/{id}    # Actualizar
DELETE /api/users/{id}    # Eliminar
```

### Roles (auth:sanctum)
```
GET    /api/roles
POST   /api/roles
GET    /api/roles/{id}
PUT    /api/roles/{id}
DELETE /api/roles/{id}
```

### Permisos (auth:sanctum)
```
GET    /api/permissions
POST   /api/permissions
GET    /api/permissions/{id}
PUT    /api/permissions/{id}
DELETE /api/permissions/{id}
```

### Menús (auth:sanctum)
```
GET    /api/menus
POST   /api/menus
GET    /api/menus/{id}
PUT    /api/menus/{id}
DELETE /api/menus/{id}
GET    /api/menus/por-rol  # Menús según rol del usuario
```

### Cargos (auth:sanctum)
```
GET    /api/cargos
POST   /api/cargos
GET    /api/cargos/{id}
PUT    /api/cargos/{id}
DELETE /api/cargos/{id}
```

### Personal (auth:sanctum)
```
GET    /api/personal
POST   /api/personal
GET    /api/personal/{id}
PUT    /api/personal/{id}
DELETE /api/personal/{id}
POST   /api/personal/validar-pin  # Validar PIN de acceso
```

### Configuración (auth:sanctum)
```
GET    /api/settings
POST   /api/settings
GET    /api/settings/{id}
PUT    /api/settings/{id}
DELETE /api/settings/{id}
GET    /api/settings/publicas  # Configuraciones públicas
```

## 🔐 Usuario Inicial

Después de ejecutar los seeders:

- **Email:** admin@example.com
- **Password:** password123

## 🛠️ Comandos Útiles

```bash
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Listar rutas
php artisan route:list

# Ejecutar servidor de desarrollo
php artisan serve

# Ejecutar tests
php artisan test
```

## 📝 Notas

- Esta API **NO** incluye módulos de negocio específicos
- Sistema de roles y permisos listo para usar
- Autenticación con Laravel Sanctum
- CORS configurado para permitir cualquier origen (ajustar en producción)
- Middleware de timeout de sesión configurable por rol

## 📄 Licencia

MIT License

Roles: super-admin, user
   - Usuario admin: admin@example.com / admin123
   - Menús base creados