<?php

namespace App\Http\Controllers\Finanzas;

use App\Models\Finanzas\Cuenta;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CuentaController extends Controller
{
    /**
     * Listar todas las cuentas
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Cuenta::orderBy('nombre')->get()
        ]);
    }

    /**
     * Crear nueva cuenta
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
        ]);

        $cuenta = Cuenta::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cuenta creada correctamente',
            'data' => $cuenta
        ], 201);
    }

    /**
     * Obtener una cuenta específica
     */
    public function show(Cuenta $cuenta)
    {
        return response()->json([
            'success' => true,
            'data' => $cuenta
        ]);
    }

    /**
     * Actualizar cuenta
     */
    public function update(Request $request, Cuenta $cuenta)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
        ]);

        $cuenta->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cuenta actualizada correctamente',
            'data' => $cuenta
        ]);
    }

    /**
     * Eliminar cuenta (soft delete - desactivar)
     */
    public function destroy(Cuenta $cuenta)
    {
        $cuenta->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cuenta eliminada correctamente'
        ]);
    }

    /**
     * Obtener lista de cuentas activas (para combos)
     */
    public function combo()
    {
        $cuentas = Cuenta::active()
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cuentas,
        ]);
    }

    /**
     * Activar cuenta
     */
    public function activate(Cuenta $cuenta)
    {
        $cuenta->update(['is_active' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Cuenta activada correctamente',
            'data' => $cuenta
        ]);
    }
}
