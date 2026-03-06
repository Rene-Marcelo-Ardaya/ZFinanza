<?php

namespace App\Models\Sistemas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComponenteSeguridad extends Model
{
    use HasFactory;

    protected $table = 'componente_seguridad';

    protected $fillable = [
        'componente_id',
        'pagina',
        'descripcion',
        'nivel_seguridad_id',
    ];

    /**
     * Relación con nivel de seguridad
     */
    public function nivelSeguridad()
    {
        return $this->belongsTo(NivelSeguridad::class, 'nivel_seguridad_id');
    }
}