<?php

namespace App\Http\Controllers;

use App\Models\Personal;
use App\Services\PinValidationService;
use Illuminate\Http\Request;

class PersonalController extends Controller
{
    protected PinValidationService $pinService;

    public function __construct(PinValidationService $pinService)
    {
        $this->pinService = $pinService;
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Personal::with('cargo')->orderBy('nombre')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'ci' => 'nullable|string|max:20|unique:personal',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'cargo_id' => 'required|exists:cargos,id',
            'pin' => 'nullable|string|min:4|max:10|unique:personal,pin',
            'is_active' => 'nullable|boolean',
        ]);

        $personal = Personal::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Personal creado correctamente',
            'data' => $personal->load('cargo')
        ], 201);
    }

    public function show(Personal $personal)
    {
        return response()->json([
            'success' => true,
            'data' => $personal->load('cargo', 'accesosPin.ubicacionPin')
        ]);
    }

    public function update(Request $request, Personal $personal)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'apellido_paterno' => 'sometimes|required|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'ci' => 'nullable|string|max:20|unique:personal,ci,' . $personal->id,
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'cargo_id' => 'sometimes|required|exists:cargos,id',
            'pin' => 'nullable|string|min:4|max:10|unique:personal,pin,' . $personal->id,
            'is_active' => 'nullable|boolean',
        ]);

        $personal->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Personal actualizado correctamente',
            'data' => $personal->load('cargo')
        ]);
    }

    public function destroy(Personal $personal)
    {
        $personal->accesosPin()->delete();
        $personal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Personal eliminado correctamente'
        ]);
    }

    public function validarPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|string',
        ]);

        $result = $this->pinService->validarPin($request->pin);

        if ($result['valid']) {
            return response()->json([
                'valid' => true,
                'personal' => $result['personal'],
            ]);
        }

        return response()->json([
            'valid' => false,
            'message' => $result['message'],
        ], 401);
    }

    /**
     * Obtener lista de personal (para combos)
     */
    public function combo()
    {
        $personal = Personal::where('is_active', true)
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $personal,
        ]);
    }

    /**
     * Obtener estadísticas de personal
     */
    public function stats()
    {
        $total = Personal::count();
        $activos = Personal::where('is_active', true)->count();
        $inactivos = Personal::where('is_active', false)->count();
        $conPin = Personal::whereNotNull('pin')->count();

        return response()->json([
            'total' => $total,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'con_pin' => $conPin,
            'sin_pin' => $total - $conPin,
        ]);
    }

    /**
     * Validar PIN (método para compatibilidad con frontend)
     */
    public function validatePin(Request $request)
    {
        $request->validate([
            'pin' => 'required|string',
        ]);

        $result = $this->pinService->validarPin($request->pin);

        if ($result['valid']) {
            return response()->json([
                'valid' => true,
                'personal' => $result['personal'],
            ]);
        }

        return response()->json([
            'valid' => false,
            'message' => $result['message'],
        ], 401);
    }

    /**
     * Generar PIN para personal
     */
    public function generarPin(Request $request, Personal $personal)
    {
        // Generar PIN aleatorio de 4 dígitos
        $pin = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        // Verificar que el PIN no exista
        while (Personal::where('pin', $pin)->where('id', '!=', $personal->id)->exists()) {
            $pin = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        }

        $personal->update(['pin' => $pin]);

        return response()->json([
            'success' => true,
            'message' => 'PIN generado correctamente',
            'data' => [
                'pin' => $pin,
                'personal' => $personal,
            ]
        ]);
    }

    /**
     * Invalidar PIN de personal
     */
    public function invalidarPin(Request $request, Personal $personal)
    {
        $personal->update(['pin' => null]);

        return response()->json([
            'success' => true,
            'message' => 'PIN invalidado correctamente',
            'data' => $personal,
        ]);
    }
}