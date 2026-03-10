<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Sistemas\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Archivo principal de enrutamiento de la API.
| Los módulos de negocio están separados en sub-archivos dentro de routes/api/
| para mantener este archivo limpio y facilitar el escalado futuro.
|
| Para agregar un nuevo módulo:
|   1. Crea el archivo: routes/api/nombre-modulo.php
|   2. Registra el archivo en el grupo auth:sanctum de abajo.
|
*/

// -------------------------------------------------------------------------
// Rutas PÚBLICAS: sin autenticación
// -------------------------------------------------------------------------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Configuración pública de la app (branding, logo, etc.)
Route::get('/config/public', [SettingController::class, 'getPublic']);
Route::get('/config/branding/{filename}', [SettingController::class, 'getBrandingImage']);

// Rutas de autenticación (prefijo /auth)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'changePassword']);
    });
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'version' => '1.0.0',
    ]);
});

// -------------------------------------------------------------------------
// Rutas PROTEGIDAS: requieren auth:sanctum
// -------------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Sesión y perfil
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // =====================================================================
    // Módulo: RRHH (Recursos Humanos)
    // Archivo: routes/api/rrhh.php
    // =====================================================================
    require base_path('routes/api/rrhh.php');

    // =====================================================================
    // Módulo: Sistemas (Usuarios, Roles, Menús, Seguridad)
    // Archivo: routes/api/sistemas.php
    // =====================================================================
    Route::prefix('sistemas')->group(function () {
        require base_path('routes/api/sistemas.php');
    });

    // =====================================================================
    // Módulo: Finanzas (Configuración de cuentas)
    // Archivo: routes/api/finanzas.php
    // =====================================================================
    require base_path('routes/api/finanzas.php');

});