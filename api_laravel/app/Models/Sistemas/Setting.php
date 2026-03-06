<?php

namespace App\Models\Sistemas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * Obtener un setting por key
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Establecer un setting
     */
    public static function setValue(string $key, $value, string $type = 'string', string $group = 'general'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type, 'group' => $group]
        );
    }

    /**
     * Scope para obtener settings públicos
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope para filtrar por grupo
     */
    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Obtener valor convertido según tipo
     */
    public function getTypedValueAttribute()
    {
        return match ($this->type) {
            'boolean' => (bool) $this->value,
            'integer' => (int) $this->value,
            'float', 'number' => (float) $this->value,
            'json', 'array' => json_decode($this->value, true),
            default => $this->value,
        };
    }
    /**
     * Obtener todas las configuraciones públicas
     */
    public static function getPublicSettings(): array
    {
        $settings = static::public()->orderBy('key')->get(['key', 'value', 'type']);
        
        $result = [];
        foreach ($settings as $setting) {
            $value = $setting->value;
            
            // Convertir según el tipo
            if ($setting->type === 'boolean') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } elseif ($setting->type === 'integer') {
                $value = (int) $value;
            } elseif ($setting->type === 'json') {
                $value = json_decode($value, true);
            }
            
            $result[$setting->key] = $value;
        }
        
        return $result;
    }

    /**
     * Obtener todas las configuraciones agrupadas
     */
    public static function getAllGrouped(): array
    {
        $settings = static::orderBy('group')->orderBy('key')->get(['key', 'value', 'type', 'group']);
        
        $result = [];
        foreach ($settings as $setting) {
            $value = $setting->value;
            
            // Convertir según el tipo
            if ($setting->type === 'boolean') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } elseif ($setting->type === 'integer') {
                $value = (int) $value;
            } elseif ($setting->type === 'json') {
                $value = json_decode($value, true);
            }
            
            $group = $setting->group ?? 'general';
            if (!isset($result[$group])) {
                $result[$group] = [];
            }
            
            $result[$group][$setting->key] = [
                'value' => $value,
                'type' => $setting->type,
            ];
        }
        
        return $result;
    }

    /**
     * Limpiar caché de configuraciones
     */
    public static function clearCache(): void
    {
        cache()->forget('public_settings');
        cache()->forget('all_settings');
    }
}