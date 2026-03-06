<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Sistemas\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('name', $request->name)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'name' => ['Las credenciales son incorrectas.'],
            ]);
        }



        $token = $user->createToken('auth-token')->plainTextToken;

        // Cargar menús basados en los roles del usuario
        $menusArray = [];
        $rolesWithMenus = $user->roles()->with('menus')->get();
        
        $allMenus = collect();
        foreach ($rolesWithMenus as $role) {
            $allMenus = $allMenus->merge($role->menus);
        }
        
        // Quitar duplicados y obtener activos
        $activeMenus = $allMenus->where('is_active', true)->unique('id')->sortBy('order');
        
        // Estructurar como árbol (padres e hijos)
        $roots = $activeMenus->whereNull('parent_id');
        foreach ($roots as $root) {
            $children = $activeMenus->where('parent_id', $root->id)->values();
            
            $menuFormat = [
                'id' => $root->id,
                'name' => $root->name,
                'url' => $root->url,
                'icon' => $root->icon,
                'order' => $root->order,
            ];
            
            if ($children->isNotEmpty()) {
                $menuFormat['children'] = $children->map(function($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'url' => $child->url,
                        'icon' => $child->icon,
                        'order' => $child->order,
                    ];
                })->toArray();
            }
            
            $menusArray[] = $menuFormat;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->load('roles.permissions'),
                'token' => $token,
                'menus' => $menusArray,
            ],
            'message' => 'Login exitoso'
        ]);
    }

    /**
     * Logout de usuario
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * Registrar nuevo usuario
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Asignar rol por defecto
        $defaultRole = Role::where('slug', 'user')->first();
        if ($defaultRole) {
            $user->roles()->attach($defaultRole->id);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
        ], 201);
    }

    /**
     * Obtener usuario autenticado
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('roles.permissions'),
        ]);
    }

    /**
     * Obtener usuario autenticado (método me para compatibilidad)
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('roles.permissions'),
        ]);
    }

    /**
     * Actualizar perfil de usuario
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($request->only(['name', 'email']));

        return response()->json([
            'user' => $request->user()->load('roles.permissions'),
        ]);
    }

    /**
     * Cambiar contraseña de usuario
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $request->user()->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['La contraseña actual es incorrecta.'],
            ]);
        }

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Contraseña cambiada exitosamente',
        ]);
    }
}