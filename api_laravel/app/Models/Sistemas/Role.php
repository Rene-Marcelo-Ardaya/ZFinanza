<?php

namespace App\Models\Sistemas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'session_timeout',
        'is_active',
    ];

    protected $casts = [
        'session_timeout' => 'integer',
        'is_active' => 'boolean',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}