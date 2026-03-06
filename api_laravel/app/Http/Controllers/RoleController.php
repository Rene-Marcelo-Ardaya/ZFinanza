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

        $roles = $query->orderBy('name')->get();
        
        // Agregar contadores para el frontend
        $roles->each(function ($role) {
            $role->menus_count = $role->menus()->count();
            $role->users_count = $role->users()->count();
            $role->menu_ids = $role->menus()->pluck('menus.id')->toArray();
        });

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'slug' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'session_timeout_minutes' => 'nullable|integer',
            'menu_ids' => 'array',
            'menu_ids.*' => 'exists:menus,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Mapear session_timeout_minutes a session_timeout
        $data = $request->only(['name', 'slug', 'description', 'is_active']);
        if ($request->has('session_timeout_minutes')) {
            $data['session_timeout'] = $request->session_timeout_minutes;
        }

        $role = Role::create($data);

        // Sincronizar menús
        if ($request->has('menu_ids')) {
            $role->menus()->sync($request->menu_ids);
        }

        // Sincronizar permisos (si se envían)
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rol creado correctamente',
            'data' => $this->formatRoleData($role)
        ], 201);
    }

    public function show(Role $role)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatRoleData($role)
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
            'slug' => 'sometimes|required|string|max:255|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'session_timeout_minutes' => 'nullable|integer',
            'menu_ids' => 'sometimes|array',
            'menu_ids.*' => 'exists:menus,id',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Mapear session_timeout_minutes a session_timeout
        $data = $request->only(['name', 'slug', 'description', 'is_active']);
        if ($request->has('session_timeout_minutes')) {
            $data['session_timeout'] = $request->session_timeout_minutes;
        }

        $role->update($data);

        // Sincronizar menús
        if ($request->has('menu_ids')) {
            $role->menus()->sync($request->menu_ids);
        }

        // Sincronizar permisos (si se envían)
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rol actualizado correctamente',
            'data' => $this->formatRoleData($role)
        ]);
    }

    public function destroy(Role $role)
    {
        $role->permissions()->detach();
        $role->menus()->detach();
        $role->users()->detach();
        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rol eliminado correctamente'
        ]);
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
            'success' => true,
            'message' => 'Menús sincronizados correctamente',
            'data' => $role->load('menus'),
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
            'success' => true,
            'data' => $menus,
        ]);
    }

    /**
     * Formatear datos del rol para el frontend
     */
    private function formatRoleData(Role $role)
    {
        $role->load('permissions', 'menus');
        
        // Mapear session_timeout a session_timeout_minutes para el frontend
        $role->session_timeout_minutes = $role->session_timeout;
        
        // Agregar contadores
        $role->menus_count = $role->menus()->count();
        $role->users_count = $role->users()->count();
        $role->menu_ids = $role->menus()->pluck('menus.id')->toArray();
        
        return $role;
    }
}