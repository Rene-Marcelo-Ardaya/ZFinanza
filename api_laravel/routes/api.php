<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CargoController;
use App\Http\Controllers\PersonalController;
use App\Http\Controllers\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes - Laravel Base API
|--------------------------------------------------------------------------
|
| Rutas base para una API Laravel limpia y reutilizable.
| Incluye autenticación con Sanctum y CRUD para entidades base.
|
*/

// Rutas públicas de autenticación
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    // Rutas protegidas de autenticación
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'changePassword']);
    });
});

// Rutas públicas (sin autenticación)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/config/public', [SettingController::class, 'getPublic']); // Configuración pública para branding
Route::get('/config/branding/{filename}', [SettingController::class, 'getBrandingImage']); // Servir imágenes de branding vía API

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Users - CRUD
    Route::get('/roles-list', [UserController::class, 'getRoles']);
    Route::apiResource('users', UserController::class);
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [UserController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [UserController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/{id}/activate', [UserController::class, 'activate'])->where('id', '[0-9]+');
        Route::put('/{id}/deactivate', [UserController::class, 'deactivate'])->where('id', '[0-9]+');
        Route::post('/{id}/assign-role', [UserController::class, 'assignRole'])->where('id', '[0-9]+');
        Route::delete('/{id}/remove-role', [UserController::class, 'removeRole'])->where('id', '[0-9]+');
    });

    // Roles - CRUD
    Route::get('/menus-list', [RoleController::class, 'getMenus']);
    Route::apiResource('roles', RoleController::class);
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::post('/', [RoleController::class, 'store']);
        Route::get('/{id}', [RoleController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [RoleController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->where('id', '[0-9]+');
        Route::post('/{id}/permissions', [RoleController::class, 'syncPermissions'])->where('id', '[0-9]+');
        Route::post('/{id}/menus', [RoleController::class, 'syncMenus'])->where('id', '[0-9]+');
    });

    // Permissions - CRUD
    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::post('/', [PermissionController::class, 'store']);
        Route::get('/{id}', [PermissionController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [PermissionController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [PermissionController::class, 'destroy'])->where('id', '[0-9]+');
    });

    // Menus - CRUD
    Route::get('/menus/icons', [MenuController::class, 'getAvailableIcons']);
    Route::get('/menus/parents', [MenuController::class, 'getParentMenus']);
    Route::put('/menus/positions', [MenuController::class, 'updatePositions']);
    Route::apiResource('menus', MenuController::class);
    Route::prefix('menus')->group(function () {
        Route::get('/', [MenuController::class, 'index']);
        Route::post('/', [MenuController::class, 'store']);
        Route::get('/por-rol', [MenuController::class, 'menusPorRol']);
        Route::get('/tree', [MenuController::class, 'tree']);
        Route::get('/{id}', [MenuController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [MenuController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [MenuController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/{id}/reorder', [MenuController::class, 'reorder'])->where('id', '[0-9]+');
    });

    // Ruta adicional para compatibilidad con frontend
    Route::get('/menus-list', [MenuController::class, 'index']);

    // Cargos - CRUD
    Route::get('/cargos-list', [CargoController::class, 'listActive']);
    Route::apiResource('cargos', CargoController::class);
    Route::prefix('cargos')->group(function () {
        Route::get('/', [CargoController::class, 'index']);
        Route::post('/', [CargoController::class, 'store']);
        Route::get('/{id}', [CargoController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [CargoController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [CargoController::class, 'destroy'])->where('id', '[0-9]+');
    });

    // Personal - CRUD y validación de PIN
    Route::get('/personal/combo', [PersonalController::class, 'combo']);
    Route::get('/personal/stats', [PersonalController::class, 'stats']);
    Route::post('/personal/validate-pin', [PersonalController::class, 'validatePin']);
    Route::apiResource('personal', PersonalController::class);
    Route::prefix('personal')->group(function () {
        Route::get('/', [PersonalController::class, 'index']);
        Route::post('/', [PersonalController::class, 'store']);
        Route::post('/validar-pin', [PersonalController::class, 'validarPin']);
        Route::get('/{id}', [PersonalController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [PersonalController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [PersonalController::class, 'destroy'])->where('id', '[0-9]+');
        Route::post('/{id}/generar-pin', [PersonalController::class, 'generarPin'])->where('id', '[0-9]+');
        Route::delete('/{id}/pin', [PersonalController::class, 'invalidarPin'])->where('id', '[0-9]+');
    });

    // Settings - CRUD y configuraciones públicas
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings/{key}', [SettingController::class, 'updateByKey']);
    Route::post('/settings/{key}/upload', [SettingController::class, 'uploadImage']);
    Route::delete('/settings/{key}/image', [SettingController::class, 'deleteImage']);
    Route::put('/settings', [SettingController::class, 'bulkUpdate']);
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::post('/', [SettingController::class, 'store']);
        Route::get('/publicas', [SettingController::class, 'publicas']);
        Route::get('/grupo/{grupo}', [SettingController::class, 'porGrupo']);
        Route::get('/{id}', [SettingController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [SettingController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [SettingController::class, 'destroy'])->where('id', '[0-9]+');
        Route::put('/clave/{clave}', [SettingController::class, 'updateByClave']);
        Route::get('/clave/{clave}', [SettingController::class, 'getByClave']);
    });

    // ======================================================================
    // NIVELES DE SEGURIDAD (SecuredButton System)
    // ======================================================================
    Route::prefix('niveles-seguridad')->group(function () {
        Route::get('/activos', [\App\Http\Controllers\NivelSeguridadController::class, 'activos']);
        Route::get('/{id}/miembros', [\App\Http\Controllers\NivelSeguridadController::class, 'miembros']);
        Route::get('/{id}/empleados-disponibles', [\App\Http\Controllers\NivelSeguridadController::class, 'empleadosDisponibles']);
        Route::post('/{id}/miembros', [\App\Http\Controllers\NivelSeguridadController::class, 'addMiembro']);
        Route::delete('/{id}/miembros/{personaId}', [\App\Http\Controllers\NivelSeguridadController::class, 'removeMiembro']);
        Route::get('/', [\App\Http\Controllers\NivelSeguridadController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\NivelSeguridadController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\NivelSeguridadController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\NivelSeguridadController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\NivelSeguridadController::class, 'destroy']);
    });

    // Componentes con Seguridad
    Route::prefix('componentes-seguridad')->group(function () {
        Route::get('/', [\App\Http\Controllers\ComponenteSeguridadController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\ComponenteSeguridadController::class, 'upsert']);
        Route::delete('/{componenteId}', [\App\Http\Controllers\ComponenteSeguridadController::class, 'destroy']);
    });
});

// Ruta de health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'version' => '1.0.0',
    ]);
});