<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::with('permissions');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'slug' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string',
            'session_timeout' => 'nullable|integer',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create($request->only(['name', 'slug', 'description', 'session_timeout']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json(['message' => 'Rol creado correctamente', 'role' => $role->load('permissions')], 201);
    }

    public function show(Role $role)
    {
        return response()->json(['role' => $role->load('permissions', 'menus')]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
            'slug' => 'sometimes|required|string|max:255|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string',
            'session_timeout' => 'nullable|integer',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update($request->only(['name', 'slug', 'description', 'session_timeout']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json(['message' => 'Rol actualizado correctamente', 'role' => $role->load('permissions')]);
    }

    public function destroy(Role $role)
    {
        $role->permissions()->detach();
        $role->menus()->detach();
        $role->users()->detach();
        $role->delete();

        return response()->json(['message' => 'Rol eliminado correctamente']);
    }

    /**
     * Sincronizar permisos de un rol
     */
    public function syncPermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->sync($request->permissions);

        return response()->json([
            'message' => 'Permisos sincronizados correctamente',
            'role' => $role->load('permissions'),
        ]);
    }

    /**
     * Sincronizar menús de un rol
     */
    public function syncMenus(Request $request, Role $role)
    {
        $request->validate([
            'menus' => 'array',
            'menus.*' => 'exists:menus,id',
        ]);

        $role->menus()->sync($request->menus);

        return response()->json([
            'message' => 'Menús sincronizados correctamente',
            'role' => $role->load('menus'),
        ]);
    }

    /**
     * Obtener lista de menús (para compatibilidad con frontend)
     */
    public function getMenus()
    {
        $menus = \App\Models\Menu::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json([
            'data' => $menus,
        ]);
    }
}