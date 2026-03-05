<?php

namespace App\Services;

use App\Models\Personal;
use App\Models\PersonalPinAcceso;
use Illuminate\Support\Facades\Hash;

/**
 * Servicio para validación de PIN de personal.
 * Permite verificar la identidad del personal mediante su PIN de acceso.
 */
class PinValidationService
{
    /**
     * Validar un PIN contra los registros de personal.
     *
     * @param string $pin PIN a validar
     * @return array Resultado de la validación con datos del personal
     */
    public function validarPin(string $pin): array
    {
        // Buscar el registro de acceso por PIN (hash)
        $pinAcceso = PersonalPinAcceso::where('activo', true)
            ->get()
            ->first(function ($acceso) use ($pin) {
                return Hash::check($pin, $acceso->pin_hash);
            });

        if (!$pinAcceso) {
            return [
                'valido' => false,
                'mensaje' => 'PIN incorrecto o no registrado',
                'personal' => null,
            ];
        }

        // Verificar si el PIN ha expirado
        if ($pinAcceso->fecha_expiracion && $pinAcceso->fecha_expiracion < now()) {
            return [
                'valido' => false,
                'mensaje' => 'El PIN ha expirado',
                'personal' => null,
            ];
        }

        // Obtener datos del personal
        $personal = Personal::with(['cargo', 'ubicacionPin'])->find($pinAcceso->id_personal);

        if (!$personal || !$personal->activo) {
            return [
                'valido' => false,
                'mensaje' => 'Personal no encontrado o inactivo',
                'personal' => null,
            ];
        }

        // Actualizar último acceso
        $pinAcceso->update([
            'ultimo_acceso' => now(),
            'intentos_fallidos' => 0,
        ]);

        return [
            'valido' => true,
            'mensaje' => 'PIN válido',
            'personal' => [
                'id' => $personal->id,
                'nombre' => $personal->nombre,
                'apellido' => $personal->apellido,
                'ci' => $personal->ci,
                'cargo' => $personal->cargo?->nombre,
                'ubicacion' => $personal->ubicacionPin?->nombre,
            ],
        ];
    }

    /**
     * Registrar un intento fallido de PIN.
     *
     * @param string $pin PIN ingresado
     * @return void
     */
    public function registrarIntentoFallido(string $pin): void
    {
        // Buscar coincidencias parciales para registrar intentos fallidos
        $pinAccesos = PersonalPinAcceso::where('activo', true)->get();

        foreach ($pinAccesos as $pinAcceso) {
            if (Hash::check($pin, $pinAcceso->pin_hash)) {
                $pinAcceso->increment('intentos_fallidos');

                // Bloquear después de 5 intentos fallidos
                if ($pinAcceso->intentos_fallidos >= 5) {
                    $pinAcceso->update(['activo' => false]);
                }
                break;
            }
        }
    }

    /**
     * Crear un nuevo PIN para un personal.
     *
     * @param int $idPersonal ID del personal
     * @param string $pin PIN en texto plano
     * @param \DateTime|null $fechaExpiracion Fecha de expiración opcional
     * @return PersonalPinAcceso
     */
    public function crearPin(int $idPersonal, string $pin, ?\DateTime $fechaExpiracion = null): PersonalPinAcceso
    {
        return PersonalPinAcceso::create([
            'id_personal' => $idPersonal,
            'pin_hash' => Hash::make($pin),
            'fecha_expiracion' => $fechaExpiracion,
            'activo' => true,
            'intentos_fallidos' => 0,
        ]);
    }

    /**
     * Invalidar un PIN existente.
     *
     * @param int $idPersonal ID del personal
     * @return bool
     */
    public function invalidarPin(int $idPersonal): bool
    {
        return PersonalPinAcceso::where('id_personal', $idPersonal)
            ->where('activo', true)
            ->update(['activo' => false]) > 0;
    }
}