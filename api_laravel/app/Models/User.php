<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Sistemas\Role;
use App\Models\RRHH\Personal;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'id_personal',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function personal()
    {
        return $this->belongsTo(Personal::class, 'id_personal');
    }

    public function negocios()
    {
        return $this->belongsToMany(Negocio::class, 'negocio_user')
            ->withTimestamps()
            ->withPivot('id');
    }

    public function hasRole($role)
    {
        return $this->roles()->where('slug', $role)->exists();
    }

    public function hasPermission($permission)
    {
        foreach ($this->roles as $userRole) {
            if ($userRole->permissions()->where('slug', $permission)->exists()) {
                return true;
            }
        }
        return false;
    }
}