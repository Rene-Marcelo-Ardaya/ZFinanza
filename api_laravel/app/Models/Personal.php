<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Personal extends Model
{
    use HasFactory;

    protected $table = 'personal';

    protected $fillable = [
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'ci',
        'telefono',
        'email',
        'cargo_id',
        'pin',
        'is_active',
        'nivel_seguridad_id',
        'estado',
        'fecha_nacimiento',
        'genero',
        'direccion',
        'fecha_ingreso',
        'fecha_salida',
        'salario',
        'tipo_contrato',
        'observaciones',
        'user_id',
    ];

    protected $appends = [
        'nombre_completo',
        'cargo_nombre',
    ];

    protected $hidden = [
        'pin',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cargo_id' => 'integer',
        'nivel_seguridad_id' => 'integer',
    ];

    /**
     * Relación con cargo
     */
    public function cargo()
    {
        return $this->belongsTo(Cargo::class);
    }

    /**
     * Relación con accesos PIN
     */
    public function accesosPin()
    {
        return $this->hasMany(PersonalPinAcceso::class);
    }

    /**
     * Relación con usuario
     */
    public function user()
    {
        return $this->hasOne(User::class, 'id_personal');
    }

    /**
     * Relación con nivel de seguridad
     */
    public function nivelSeguridad()
    {
        return $this->belongsTo(NivelSeguridad::class, 'nivel_seguridad_id');
    }

    /**
     * Verificar PIN
     */
    public function verificarPin(string $pin): bool
    {
        return Hash::check($pin, $this->pin);
    }

    /**
     * Establecer PIN encriptado
     */
    public function setPinAttribute($value)
    {
        if ($value) {
            $this->attributes['pin'] = Hash::make($value);
        }
    }

    /**
     * Scope para obtener personal activo
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Obtener nombre completo
     */
    public function getNombreCompletoAttribute(): string
    {
        $apellido = '';
        if ($this->apellido_paterno) {
            $apellido .= $this->apellido_paterno . ' ';
        }
        if ($this->apellido_materno) {
            $apellido .= $this->apellido_materno . ' ';
        }
        
        return trim("{$this->nombre} {$apellido}");
    }

    /**
     * Obtener nombre del cargo
     */
    public function getCargoNombreAttribute(): ?string
    {
        return $this->cargo?->nombre;
    }
}