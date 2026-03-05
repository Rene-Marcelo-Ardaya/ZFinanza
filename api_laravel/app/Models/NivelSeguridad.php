<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelSeguridad extends Model
{
    use HasFactory;

    protected $table = 'niveles_seguridad';

    protected $fillable = [
        'nombre',
        'color',
        'descripcion',
        'nivel',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relación con componentes de seguridad
     */
    public function componentes()
    {
        return $this->hasMany(ComponenteSeguridad::class, 'nivel_seguridad_id');
    }

    /**
     * Relación con personal (miembros del nivel)
     */
    public function personal()
    {
        return $this->hasMany(Personal::class, 'nivel_seguridad_id');
    }

    /**
     * Scope para obtener niveles activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para ordenar por nivel
     */
    public function scopeOrderByLevel($query)
    {
        return $query->orderBy('nivel', 'asc');
    }
}