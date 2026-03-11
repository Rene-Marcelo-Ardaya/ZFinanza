<?php

namespace App\Models\Finanzas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    use HasFactory;

    protected $table = 'f_cuentas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope para obtener cuentas activas
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para buscar por nombre o descripción
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('nombre', 'like', "%{$term}%")
              ->orWhere('descripcion', 'like', "%{$term}%");
        });
    }
}
