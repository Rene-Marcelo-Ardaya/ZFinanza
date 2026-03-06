<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Obtener configuraciones públicas (sin autenticación)
     * Usado por el frontend al cargar la app
     */
    public function getPublic()
    {
        return response()->json([
            'success' => true,
            'data' => Setting::getPublicSettings()
        ]);
    }

    /**
     * Servir imagen de branding vía API (alternativa a storage link)
     */
    public function getBrandingImage($filename)
    {
        $path = storage_path('app/public/branding/' . $filename);
        
        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo no encontrado'
            ], 404);
        }
        
        return response()->file($path);
    }
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Setting::orderBy('key')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'required|string',
            'type' => 'nullable|string|in:string,integer,boolean,json',
            'description' => 'nullable|string',
            'is_public' => 'nullable|boolean',
        ]);

        $setting = Setting::create($request->only(['key', 'value', 'type', 'description', 'is_public']));

        return response()->json([
            'success' => true,
            'message' => 'Configuración creada correctamente',
            'data' => $setting
        ], 201);
    }

    public function show(Setting $setting)
    {
        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    public function update(Request $request, Setting $setting)
    {
        $request->validate([
            'key' => 'sometimes|required|string|max:255|unique:settings,key,' . $setting->id,
            'value' => 'sometimes|required|string',
            'type' => 'nullable|string|in:string,integer,boolean,json',
            'description' => 'nullable|string',
            'is_public' => 'nullable|boolean',
        ]);

        $setting->update($request->only(['key', 'value', 'type', 'description', 'is_public']));

        return response()->json([
            'success' => true,
            'message' => 'Configuración actualizada correctamente',
            'data' => $setting
        ]);
    }

    public function destroy(Setting $setting)
    {
        $setting->delete();
        return response()->json([
            'success' => true,
            'message' => 'Configuración eliminada correctamente'
        ]);
    }

    public function publicas()
    {
        return response()->json([
            'success' => true,
            'data' => Setting::getPublicSettings()
        ]);
    }

    /**
     * Obtener configuraciones por grupo
     */
    public function porGrupo($grupo)
    {
        $settings = Setting::where('group', $grupo)
            ->orderBy('key')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function getByKey($key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Configuración no encontrada'
            ], 404);
        }

        $value = $setting->value;
        
        // Convertir según el tipo
        if ($setting->type === 'boolean') {
            $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        } elseif ($setting->type === 'integer') {
            $value = (int) $value;
        } elseif ($setting->type === 'json') {
            $value = json_decode($value, true);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'key' => $setting->key,
                'value' => $value,
                'type' => $setting->type,
            ]
        ]);
    }

    /**
     * Actualizar configuración por clave (para compatibilidad con frontend)
     */
    public function updateByClave(Request $request, $key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Configuración no encontrada'
            ], 404);
        }

        $request->validate([
            'value' => 'required',
        ]);

        $setting->update(['value' => $request->value]);

        return response()->json([
            'success' => true,
            'message' => 'Configuración actualizada correctamente',
            'data' => $setting
        ]);
    }

    /**
     * Actualizar configuración por clave (para compatibilidad con sistema anterior)
     */
    public function updateByKey(Request $request, $key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Configuración no encontrada'
            ], 404);
        }

        $request->validate([
            'value' => 'required',
        ]);

        $setting->update(['value' => $request->value]);

        return response()->json([
            'success' => true,
            'message' => 'Configuración actualizada correctamente',
            'data' => $setting
        ]);
    }

    /**
     * Subir imagen de configuración
     */
    public function uploadImage(Request $request, $key)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // Máximo 2MB
        ]);

        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Configuración no encontrada'
            ], 404);
        }

        // Guardar imagen
        $path = $request->file('image')->store('branding', 'public');
        $url = Storage::url($path);

        // Eliminar imagen anterior si existe
        if ($setting->value && Storage::disk('public')->exists($setting->value)) {
            Storage::disk('public')->delete($setting->value);
        }

        // Actualizar configuración
        $setting->update(['value' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Imagen subida correctamente',
            'data' => [
                'setting' => $setting,
                'url' => $url,
            ]
        ]);
    }

    /**
     * Eliminar imagen de configuración
     */
    public function deleteImage($key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Configuración no encontrada'
            ], 404);
        }

        // Eliminar imagen si existe
        if ($setting->value && Storage::disk('public')->exists($setting->value)) {
            Storage::disk('public')->delete($setting->value);
        }

        // Actualizar configuración
        $setting->update(['value' => null]);

        return response()->json([
            'success' => true,
            'message' => 'Imagen eliminada correctamente',
            'data' => $setting
        ]);
    }

    /**
     * Actualización masiva de configuraciones
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'required',
        ]);

        foreach ($request->settings as $settingData) {
            $setting = Setting::where('key', $settingData['key'])->first();
            if ($setting) {
                $setting->update(['value' => $settingData['value']]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Configuraciones actualizadas correctamente',
            'data' => [
                'settings' => Setting::getPublicSettings()
            ]
        ]);
    }
}