<?php

namespace App\Models\Sistemas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RRHH\PersonalPinAcceso;

class UbicacionPin extends Model
{
    use HasFactory;

    protected $table = 'ubicacion_pins';

    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relación con accesos PIN
     */
    public function pinAccesos()
    {
        return $this->hasMany(PersonalPinAcceso::class, 'ubicacion_id');
    }

    /**
     * Scope para obtener ubicaciones activas
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}