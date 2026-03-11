<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Finanzas\CuentaController;

/*
|--------------------------------------------------------------------------
| API Routes - Módulo Finanzas
|--------------------------------------------------------------------------
|
| Rutas del módulo Finanzas: Configuración de cuentas, centros de cuentas.
| Estas rutas son cargadas desde routes/api.php dentro del middleware
| auth:sanctum, por lo que todas requieren autenticación.
|
*/

// -------------------------------------------------------------------------
// Rutas del módulo Finanzas
// -------------------------------------------------------------------------

// Rutas para Cuentas
Route::prefix('cuentas')->group(function () {
    Route::get('/', [CuentaController::class, 'index']);
    Route::get('/combo', [CuentaController::class, 'combo']);
    Route::post('/', [CuentaController::class, 'store']);
    Route::get('/{cuenta}', [CuentaController::class, 'show']);
    Route::put('/{cuenta}', [CuentaController::class, 'update']);
    Route::put('/{cuenta}/activate', [CuentaController::class, 'activate']);
    Route::delete('/{cuenta}', [CuentaController::class, 'destroy']);
});
