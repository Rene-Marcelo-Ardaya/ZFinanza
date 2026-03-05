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
}