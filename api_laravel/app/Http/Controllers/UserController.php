<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Listar usuarios
     */
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $users->map(function ($user) {
                $firstRole = $user->roles->first();
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'role_id' => $firstRole?->id ?? null,
                    'roles' => $firstRole?->name ?? '-', // Para compatibilidad con frontend
                    'role_name' => $firstRole?->name ?? '-', // Nombre del rol para mostrar
                    'role_data' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'slug' => $role->slug,
                        ];
                    })->toArray(),
                    'id_personal' => $user->id_personal,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            })
        ]);
    }

    /**
     * Crear usuario
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado correctamente',
            'data' => $user->load('roles')
        ], 201);
    }

    /**
     * Mostrar usuario
     */
    public function show(User $user)
    {
        return response()->json([
            'success' => true,
            'data' => $user->load('roles.permissions')
        ]);
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8',
            'roles' => 'sometimes|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $data = $request->only(['name', 'email']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente',
            'data' => $user->load('roles', 'personal')
        ]);
    }

    /**
     * Eliminar usuario
     */
    public function destroy(User $user)
    {
        $user->roles()->detach();
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

    /**
     * Activar usuario
     */
    public function activate(User $user)
    {
        $user->update(['is_active' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario activado correctamente'
        ]);
    }

    /**
     * Desactivar usuario
     */
    public function deactivate(User $user)
    {
        $user->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario desactivado correctamente'
        ]);
    }

    /**
     * Asignar rol a usuario
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->roles()->syncWithoutDetaching([$request->role_id]);

        return response()->json([
            'success' => true,
            'message' => 'Rol asignado correctamente',
            'data' => $user->load('roles')
        ]);
    }

    /**
     * Remover rol de usuario
     */
    public function removeRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->roles()->detach($request->role_id);

        return response()->json([
            'success' => true,
            'message' => 'Rol removido correctamente',
            'data' => $user->load('roles')
        ]);
    }

    /**
     * Obtener lista de roles (para combos)
     */
    public function getRoles()
    {
        $roles = \App\Models\Role::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($role) {
                return [
                    'value' => $role->id,
                    'label' => $role->name,
                    'slug' => $role->slug,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    /**
     * Cambiar contraseña del usuario autenticado
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'La contraseña actual es incorrecta'
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }
}