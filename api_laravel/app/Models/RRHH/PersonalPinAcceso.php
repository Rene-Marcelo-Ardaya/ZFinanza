<?php

namespace App\Models\RRHH;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Sistemas\UbicacionPin;

class PersonalPinAcceso extends Model
{
    use HasFactory;

    protected $table = 'personal_pin_acceso';

    protected $fillable = [
        'personal_id',
        'ubicacion_id',
        'fecha_acceso',
        'tipo_acceso',
    ];

    protected $casts = [
        'fecha_acceso' => 'datetime',
    ];

    /**
     * Relación con personal
     */
    public function personal()
    {
        return $this->belongsTo(Personal::class);
    }

    /**
     * Relación con ubicación
     */
    public function ubicacionPin()
    {
        return $this->belongsTo(UbicacionPin::class, 'ubicacion_id');
    }
}