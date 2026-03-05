<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Role;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Listar todos los menús
     */
    public function index()
    {
        $menus = Menu::with('roles')->orderBy('order')->get();
        return response()->json($menus);
    }

    /**
     * Crear nuevo menú
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer',
            'module' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $menu = Menu::create($request->only(['name', 'url', 'icon', 'parent_id', 'order', 'module', 'is_active']));

        if ($request->has('roles')) {
            $menu->roles()->sync($request->roles);
        }

        return response()->json(['message' => 'Menú creado correctamente', 'menu' => $menu->load('roles')], 201);
    }

    /**
     * Mostrar un menú específico
     */
    public function show(Menu $menu)
    {
        return response()->json(['menu' => $menu->load('roles', 'children')]);
    }

    /**
     * Actualizar menú
     */
    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer',
            'module' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'roles' => 'sometimes|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $menu->update($request->only(['name', 'url', 'icon', 'parent_id', 'order', 'module', 'is_active']));

        if ($request->has('roles')) {
            $menu->roles()->sync($request->roles);
        }

        return response()->json(['message' => 'Menú actualizado correctamente', 'menu' => $menu->load('roles')]);
    }

    /**
     * Eliminar menú
     */
    public function destroy(Menu $menu)
    {
        $menu->roles()->detach();
        $menu->delete();

        return response()->json(['message' => 'Menú eliminado correctamente']);
    }

    /**
     * Obtener menús según el rol del usuario autenticado
     */
    public function menusPorRol(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['menus' => []]);
        }

        $roles = $user->roles;
        
        if ($roles->isEmpty()) {
            return response()->json(['menus' => []]);
        }

        // Obtener todos los menús de los roles del usuario
        $menuIds = [];
        foreach ($roles as $role) {
            $roleMenuIds = $role->menus()->pluck('menus.id')->toArray();
            $menuIds = array_merge($menuIds, $roleMenuIds);
        }
        $menuIds = array_unique($menuIds);

        // Obtener menús únicos y ordenados
        $menus = Menu::whereIn('id', $menuIds)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        // Construir estructura jerárquica
        $menuTree = $this->buildMenuTree($menus);

        return response()->json(['menus' => $menuTree]);
    }

    /**
     * Construir árbol de menús
     */
    private function buildMenuTree($menus, $parentId = null)
    {
        $tree = [];
        
        foreach ($menus as $menu) {
            if ($menu->parent_id == $parentId) {
                $children = $this->buildMenuTree($menus, $menu->id);
                $menuItem = $menu->toArray();
                if ($children) {
                    $menuItem['children'] = $children;
                }
                $tree[] = $menuItem;
            }
        }
        
        return $tree;
    }

    /**
     * Obtener menús en formato de árbol
     */
    public function tree()
    {
        $menus = Menu::where('is_active', true)
            ->orderBy('order')
            ->get();

        $menuTree = $this->buildMenuTree($menus);

        return response()->json(['menus' => $menuTree]);
    }

    /**
     * Obtener lista de iconos disponibles
     */
    public function getAvailableIcons()
    {
        $icons = [
            'fa-home',
            'fa-user',
            'fa-users',
            'fa-cog',
            'fa-lock',
            'fa-key',
            'fa-shield',
            'fa-database',
            'fa-chart-bar',
            'fa-file',
            'fa-folder',
            'fa-truck',
            'fa-gas-pump',
            'fa-warehouse',
            'fa-box',
            'fa-shopping-cart',
            'fa-receipt',
            'fa-dollar-sign',
            'fa-calculator',
            'fa-calendar',
            'fa-clock',
            'fa-bell',
            'fa-envelope',
            'fa-comment',
            'fa-search',
            'fa-filter',
            'fa-download',
            'fa-upload',
            'fa-print',
            'fa-trash',
            'fa-edit',
            'fa-plus',
            'fa-minus',
            'fa-check',
            'fa-times',
            'fa-arrow-left',
            'fa-arrow-right',
            'fa-arrow-up',
            'fa-arrow-down',
            'fa-refresh',
            'fa-save',
            'fa-cancel',
        ];

        return response()->json(['icons' => $icons]);
    }

    /**
     * Obtener menús padre (sin parent_id)
     */
    public function getParentMenus()
    {
        $menus = Menu::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json(['menus' => $menus]);
    }

    /**
     * Actualizar posiciones de menús (Drag & Drop)
     */
    public function updatePositions(Request $request)
    {
        $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.order' => 'required|integer',
            'menus.*.parent_id' => 'nullable|exists:menus,id',
        ]);

        foreach ($request->menus as $menuData) {
            $menu = Menu::find($menuData['id']);
            if ($menu) {
                $menu->update([
                    'order' => $menuData['order'],
                    'parent_id' => $menuData['parent_id'] ?? null,
                ]);
            }
        }

        return response()->json(['message' => 'Posiciones actualizadas correctamente']);
    }

    /**
     * Reordenar menú individual
     */
    public function reorder(Request $request, Menu $menu)
    {
        $request->validate([
            'order' => 'required|integer',
        ]);

        $menu->update(['order' => $request->order]);

        return response()->json(['message' => 'Menú reordenado correctamente', 'menu' => $menu]);
    }
}