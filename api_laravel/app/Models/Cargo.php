<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'is_active',
    ];

    protected $appends = [
        'personal_count',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relación con personal
     */
    public function personal()
    {
        return $this->hasMany(Personal::class);
    }

    /**
     * Scope para obtener cargos activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Obtener conteo de personal asociado
     */
    public function getPersonalCountAttribute(): int
    {
        // Usar el valor cargado por withCount() si está disponible
        if (array_key_exists('personal_count', $this->attributes)) {
            return (int) $this->attributes['personal_count'];
        }
        // Fallback a consulta si no está precargado
        return $this->personal()->count();
    }
}