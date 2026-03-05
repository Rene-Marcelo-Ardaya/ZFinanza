<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'session_timeout',
    ];

    protected $casts = [
        'session_timeout' => 'integer',
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