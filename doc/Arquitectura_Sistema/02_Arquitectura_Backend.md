# Arquitectura del Backend (API Laravel)

Este documento define las convenciones y la estructura de carpetas que deben seguirse para la API construida en Laravel. El objetivo principal es mantener una arquitectura **modular** que permita escalar la aplicación ordenadamente, aislando el código por dominios funcionales (módulos).

---

## 1. Organización de Modelos (`app/Models/`)

Todos los modelos deben estar agrupados dentro de una subcarpeta que represente el módulo al que pertenecen. No se deben dejar modelos en la raíz de `app/Models/`, con la única excepción del modelo `User.php` si se considera de uso global para la autenticación del framework.

**Estructura esperada:**
```text
app/Models/
├── RRHH/
│   ├── Cargo.php
│   ├── Personal.php
│   └── PersonalPinAcceso.php
├── Sistemas/
│   ├── Menu.php
│   ├── Role.php
│   ├── Permission.php
│   └── Setting.php
└── User.php (Transversal)
```

**Reglas de Namespace:**
Al crear un nuevo modelo para un módulo "Ventas", el namespace debe ser explícito:
```php
namespace App\Models\Ventas;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    // ...
}
```

---

## 2. Organización de Controladores (`app/Http/Controllers/`)

Al igual que los modelos, los controladores deben agruparse por módulo funcional. Esto facilita encontrar la lógica de negocio y evita tener una lista interminable de controladores en un solo directorio.

**Estructura esperada:**
```text
app/Http/Controllers/
├── RRHH/
│   ├── CargoController.php
│   └── PersonalController.php
├── Sistemas/
│   ├── RoleController.php
│   ├── UserController.php
│   └── SettingController.php
├── Controller.php (Base, transversal)
└── AuthController.php (Base, autenticación)
```

**Reglas de Namespace y Herencia:**
Cada controlador que se encuentre dentro de un módulo debe definir su namespace correctamente e importar (usar `use`) el controlador base de Laravel para heredar de él.

```php
namespace App\Http\Controllers\Ventas;

use App\Http\Controllers\Controller; // IMPORTANTE: Importar el controlador base
use App\Models\Ventas\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    // ...
}
```

---

## 3. Servicios (`app/Services/`)

Cualquier lógica de negocio compleja, validaciones extensas o procesos que involucren a más de un modelo (p. ej., cálculos matemáticos, llamadas a APIs externas, algoritmos de asignación) **no deben ir en el controlador**. El controlador solo debe recibir la petición (`Request`), llamar al servicio y devolver una respuesta (`Response`).

La lógica pesada debe encapsularse en clases de Servicio dentro de la carpeta `app/Services/`. Si el sistema crece demasiado, los servicios también deben modularizarse por subcarpetas (ej: `app/Services/RRHH/CalculoNominaService.php`).

**Ejemplo de uso de un Servicio:**
```php
namespace App\Services;

class ValidacionVentaService
{
    public function procesarVenta($datos)
    {
        // Lógica compleja...
    }
}
```

---

## 4. Rutas Modulares (`routes/api/`)

Las rutas están **separadas por módulo** en archivos independientes dentro de la carpeta `routes/api/`. El archivo `routes/api.php` actúa únicamente como punto de entrada y los carga con `require`.

**Estructura actual:**
```text
routes/
├── api/
│   ├── rrhh.php       → Cargos y Personal
│   └── sistemas.php   → Users, Roles, Permisos, Menús, Settings, Seguridad
└── api.php            → Punto de entrada (rutas públicas + carga módulos)
```

**Cómo funciona `routes/api.php`:**
```php
// Rutas PÚBLICAS (sin autenticación)
Route::post('/login', [AuthController::class, 'login']);
Route::get('/config/public', [SettingController::class, 'getPublic']);

// Rutas PROTEGIDAS: cargan los archivos de módulo
Route::middleware('auth:sanctum')->group(function () {

    // Módulo: RRHH
    require base_path('routes/api/rrhh.php');

    // Módulo: Sistemas
    require base_path('routes/api/sistemas.php');

});
```

**Cómo agregar un nuevo módulo:**
1. Crea el archivo `routes/api/nuevo-modulo.php` con sus rutas.
2. Añade una línea `require base_path('routes/api/nuevo-modulo.php');` dentro del grupo `auth:sanctum` en `routes/api.php`.
3. Importa los controladores con su namespace completo dentro del nuevo archivo.

```php
// routes/api/ventas.php
use App\Http\Controllers\Ventas\VentaController;
use Illuminate\Support\Facades\Route;

Route::apiResource('ventas', VentaController::class);
Route::prefix('ventas')->group(function () {
    Route::get('/reporte', [VentaController::class, 'reporte']);
});
```

---

## 5. Respuestas API (JSON Context)

Debemos estandarizar todas las respuestas de nuestros API endpoints en formato JSON envolviendo siempre el recurso en un sobre estructurado ("envelope"), como un atributo de "éxito" (`success`), mensaje (`message`) y un objeto/matriz de datos (`data`).

**Ejemplo de respuesta OK (200 / 201):**
```json
{
    "success": true,
    "message": "Operación exitosa",
    "data": { ... }
}
```

**Ejemplo de respuesta de ERROR (400, 422, 404, 500):**
```json
{
    "success": false,
    "message": "Error validando los datos",
    "errors": {
        "campo": ["El campo es requerido."]
    }
}
```

---

## Flujo de Trabajo para Nuevos Módulos

Cuando te pidan crear o añadir implementaciones para un nuevo módulo (ej: **Activos Fijos**), sigue estos pasos sagradamente:

1. Crea la subcarpeta del módulo en `app/Models/ActivosFijos/` y coloca ahí todos sus modelos y migraciones relativas.
2. Crea la subcarpeta del módulo en `app/Http/Controllers/ActivosFijos/` y aloja allí los controladores.
3. Asegúrate de corregir los pseudo-generadores automáticos de Laravel (`php artisan make:model ActivosFijos/Equipo -mc`), que si bien crean las carpetas, a veces el archivo de ruta no detecta correctamente la herencia. Importa siempre el Base `Controller`.
4. Define el grupo de rutas en `routes/api.php` añadiendo un comentario y un prefijo (`Route::prefix('activos-fijos')`).
5. Realiza pruebas unitarias (`php artisan test`) para asegurarte de que las rutas se resuelven y de la ausencia de errores `"unknown class"`.
