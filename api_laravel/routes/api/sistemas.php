<?php

use App\Http\Controllers\Sistemas\UserController;
use App\Http\Controllers\Sistemas\RoleController;
use App\Http\Controllers\Sistemas\PermissionController;
use App\Http\Controllers\Sistemas\MenuController;
use App\Http\Controllers\Sistemas\SettingController;
use App\Http\Controllers\Sistemas\NivelSeguridadController;
use App\Http\Controllers\Sistemas\ComponenteSeguridadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Módulo Sistemas
|--------------------------------------------------------------------------
|
| Rutas del módulo Sistemas: Usuarios, Roles, Permisos, Menús,
| Configuraciones y Seguridad por componente.
| Estas rutas son cargadas desde routes/api.php dentro del middleware
| auth:sanctum, por lo que todas requieren autenticación.
|
*/

// -------------------------------------------------------------------------
// Usuarios
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// Roles
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// Permisos
// -------------------------------------------------------------------------
Route::prefix('permissions')->group(function () {
    Route::get('/', [PermissionController::class, 'index']);
    Route::post('/', [PermissionController::class, 'store']);
    Route::get('/{id}', [PermissionController::class, 'show'])->where('id', '[0-9]+');
    Route::put('/{id}', [PermissionController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/{id}', [PermissionController::class, 'destroy'])->where('id', '[0-9]+');
});

// -------------------------------------------------------------------------
// Menús
// -------------------------------------------------------------------------
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
    Route::get('/{parentMenuId}/tabs', [MenuController::class, 'getTabsByPage'])->where('parentMenuId', '[0-9]+');
});

// -------------------------------------------------------------------------
// Settings / Configuración
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// Niveles de Seguridad (SecuredButton System)
// -------------------------------------------------------------------------
Route::prefix('niveles-seguridad')->group(function () {
    Route::get('/activos', [NivelSeguridadController::class, 'activos']);
    Route::get('/{id}/miembros', [NivelSeguridadController::class, 'miembros']);
    Route::get('/{id}/empleados-disponibles', [NivelSeguridadController::class, 'empleadosDisponibles']);
    Route::post('/{id}/miembros', [NivelSeguridadController::class, 'addMiembro']);
    Route::delete('/{id}/miembros/{personaId}', [NivelSeguridadController::class, 'removeMiembro']);
    Route::get('/', [NivelSeguridadController::class, 'index']);
    Route::post('/', [NivelSeguridadController::class, 'store']);
    Route::get('/{id}', [NivelSeguridadController::class, 'show']);
    Route::put('/{id}', [NivelSeguridadController::class, 'update']);
    Route::delete('/{id}', [NivelSeguridadController::class, 'destroy']);
});

// -------------------------------------------------------------------------
// Componentes de Seguridad
// -------------------------------------------------------------------------
Route::prefix('componentes-seguridad')->group(function () {
    Route::get('/', [ComponenteSeguridadController::class, 'index']);
    Route::post('/', [ComponenteSeguridadController::class, 'upsert']);
    Route::delete('/{componenteId}', [ComponenteSeguridadController::class, 'destroy']);
});
