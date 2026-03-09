<?php

namespace App\Http\Controllers\Sistemas;

use App\Models\Negocio;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NegocioController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Negocio::withCount('users')->orderBy('nombre')->get()
        ]);
    }

    /**
     * Obtener lista de negocios activos (para combos)
     */
    public function listActive()
    {
        $negocios = Negocio::where('is_active', true)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $negocios,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:negocios',
            'is_active' => 'nullable|boolean',
        ]);

        $negocio = Negocio::create($request->only(['nombre', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Negocio creado correctamente',
            'data' => $negocio
        ], 201);
    }

    public function show(Negocio $negocio)
    {
        return response()->json([
            'success' => true,
            'data' => $negocio->load('users')
        ]);
    }

    public function update(Request $request, Negocio $negocio)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255|unique:negocios,nombre,' . $negocio->id,
            'is_active' => 'nullable|boolean',
        ]);

        $negocio->update($request->only(['nombre', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Negocio actualizado correctamente',
            'data' => $negocio
        ]);
    }

    public function destroy(Negocio $negocio)
    {
        if ($negocio->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'error' => 'No se puede eliminar el negocio porque tiene usuarios asociados'
            ], 400);
        }
        
        $negocio->delete();
        return response()->json([
            'success' => true,
            'message' => 'Negocio eliminado correctamente'
        ]);
    }
}
