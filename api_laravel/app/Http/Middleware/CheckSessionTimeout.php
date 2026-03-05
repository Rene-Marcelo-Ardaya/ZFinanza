<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

/**
 * Middleware para verificar timeout de sesión basado en el rol del usuario.
 * Cada rol puede tener un tiempo de sesión diferente configurado.
 */
class CheckSessionTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $lastActivity = session('last_activity', time());
        $currentTime = time();
        
        // Obtener el timeout según el rol del usuario (en minutos)
        $timeout = $this->getSessionTimeout($user);
        
        // Convertir a segundos
        $timeoutSeconds = $timeout * 60;
        
        // Verificar si ha excedido el tiempo de sesión
        if (($currentTime - $lastActivity) > $timeoutSeconds) {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();
            
            return response()->json([
                'message' => 'Sesión expirada por inactividad',
                'error' => 'session_expired'
            ], 401);
        }
        
        // Actualizar última actividad
        session(['last_activity' => $currentTime]);
        
        return $next($request);
    }

    /**
     * Obtener el tiempo de sesión según el rol del usuario.
     * 
     * @param mixed $user
     * @return int Tiempo en minutos
     */
    private function getSessionTimeout($user): int
    {
        // Tiempos de sesión por defecto según el rol
        $roleTimeouts = [
            'super-admin' => 480,  // 8 horas
            'admin' => 480,        // 8 horas
            'supervisor' => 240,   // 4 horas
            'user' => 120,         // 2 horas
        ];
        
        // Obtener el rol del usuario
        $role = $user->roles()->first();
        
        if (!$role) {
            return config('session.lifetime', 120);
        }
        
        // Buscar el timeout configurado para el rol
        $roleName = $role->name;
        
        if (isset($roleTimeouts[$roleName])) {
            return $roleTimeouts[$roleName];
        }
        
        // Verificar si hay una configuración personalizada en settings
        $settingTimeout = \App\Models\Setting::where('key', "session_timeout_{$roleName}")->first();
        
        if ($settingTimeout) {
            return (int) $settingTimeout->value;
        }
        
        // Retornar el valor por defecto de la configuración de Laravel
        return config('session.lifetime', 120);
    }
}