<?php

namespace App\Http\Controllers;

use App\Models\Cargo;
use Illuminate\Http\Request;

class CargoController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Cargo::withCount('personal')->orderBy('nombre')->get()
        ]);
    }

    /**
     * Obtener lista de cargos activos (para combos)
     */
    public function listActive()
    {
        $cargos = Cargo::where('is_active', true)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cargos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:cargos',
            'descripcion' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $cargo = Cargo::create($request->only(['nombre', 'descripcion', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Cargo creado correctamente',
            'data' => $cargo
        ], 201);
    }

    public function show(Cargo $cargo)
    {
        return response()->json([
            'success' => true,
            'data' => $cargo->load('personal')
        ]);
    }

    public function update(Request $request, Cargo $cargo)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255|unique:cargos,nombre,' . $cargo->id,
            'descripcion' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $cargo->update($request->only(['nombre', 'descripcion', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Cargo actualizado correctamente',
            'data' => $cargo
        ]);
    }

    public function destroy(Cargo $cargo)
    {
        if ($cargo->personal()->count() > 0) {
            return response()->json([
                'success' => false,
                'error' => 'No se puede eliminar el cargo porque tiene personal asociado'
            ], 400);
        }
        
        $cargo->delete();
        return response()->json([
            'success' => true,
            'message' => 'Cargo eliminado correctamente'
        ]);
    }
}