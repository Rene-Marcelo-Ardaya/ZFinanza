<?php

use App\Http\Controllers\RRHH\CargoController;
use App\Http\Controllers\RRHH\PersonalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Módulo RRHH
|--------------------------------------------------------------------------
|
| Rutas del módulo de Recursos Humanos.
| Estas rutas son cargadas desde routes/api.php dentro del middleware
| auth:sanctum, por lo que todas requieren autenticación.
|
*/

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
