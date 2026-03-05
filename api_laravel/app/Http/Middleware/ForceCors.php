<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para forzar headers CORS en todas las respuestas.
 * Esto asegura que los headers CORS estén presentes incluso en errores.
 */
class ForceCors
{
    public function handle(Request $request, Closure $next): Response
    {
        // Manejar preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 204)
                ->header('Access-Control-Allow-Origin', $this->getAllowedOrigin($request))
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept, Origin')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);

        // Agregar headers CORS a la respuesta
        $response->headers->set('Access-Control-Allow-Origin', $this->getAllowedOrigin($request));
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept, Origin');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }

    /**
     * Obtener el origen permitido basado en la configuración.
     */
    private function getAllowedOrigin(Request $request): string
    {
        $allowedOrigins = config('cors.allowed_origins', ['*']);
        $origin = $request->headers->get('Origin');

        // Si permite todos los orígenes
        if (in_array('*', $allowedOrigins)) {
            return $origin ?? '*';
        }

        // Verificar si el origen está permitido
        if ($origin && in_array($origin, $allowedOrigins)) {
            return $origin;
        }

        // Retornar el primer origen permitido por defecto
        return $allowedOrigins[0] ?? '*';
    }
}