<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaseDatos extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'host',
        'puerto',
        'usuario_bd',
        'password_bd',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Scope para obtener bases de datos activas
     */
    public function scopeActive($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Ocultar el password cuando se serializa el modelo
     */
    protected $hidden = [
        'password_bd',
    ];
}
