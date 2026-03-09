<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Negocio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relación muchos a muchos con usuarios
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'negocio_user')
            ->withTimestamps()
            ->withPivot('id');
    }

    /**
     * Scope para obtener negocios activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
