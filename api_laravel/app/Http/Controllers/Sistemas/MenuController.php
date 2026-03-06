<?php

namespace App\Http\Controllers\Sistemas;

use App\Models\Sistemas\Menu;
use App\Models\Sistemas\Role;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Listar todos los menús
     */
    public function index()
    {
        $menus = Menu::with('roles')->orderBy('order')->get();
        
        // Agregar contador de roles para el frontend
        $menus->each(function ($menu) {
            $menu->roles_count = $menu->roles()->count();
        });
        
        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
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
            'menu_type' => 'nullable|in:sidebar,tab',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $menu = Menu::create($request->only(['name', 'url', 'icon', 'parent_id', 'order', 'module', 'is_active', 'menu_type']));

        if ($request->has('roles')) {
            $menu->roles()->sync($request->roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menú creado correctamente',
            'data' => $menu->load('roles')
        ], 201);
    }

    /**
     * Mostrar un menú específico
     */
    public function show(Menu $menu)
    {
        return response()->json([
            'success' => true,
            'data' => $menu->load('roles', 'children')
        ]);
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
            'menu_type' => 'nullable|in:sidebar,tab',
            'roles' => 'sometimes|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $menu->update($request->only(['name', 'url', 'icon', 'parent_id', 'order', 'module', 'is_active', 'menu_type']));

        if ($request->has('roles')) {
            $menu->roles()->sync($request->roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menú actualizado correctamente',
            'data' => $menu->load('roles')
        ]);
    }

    /**
     * Eliminar menú
     */
    public function destroy(Menu $menu)
    {
        $menu->roles()->detach();
        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menú eliminado correctamente'
        ]);
    }

    /**
     * Obtener menús según el rol del usuario autenticado
     */
    public function menusPorRol(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => true,
                'data' => ['menus' => []]
            ]);
        }

        $roles = $user->roles;
        
        if ($roles->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => ['menus' => []]
            ]);
        }

        // Obtener todos los menús de los roles del usuario
        $menuIds = [];
        foreach ($roles as $role) {
            $roleMenuIds = $role->menus()->pluck('menus.id')->toArray();
            $menuIds = array_merge($menuIds, $roleMenuIds);
        }
        $menuIds = array_unique($menuIds);

        // Obtener menús únicos y ordenados (solo menús de sidebar)
        $menus = Menu::whereIn('id', $menuIds)
            ->where('is_active', true)
            ->where('menu_type', 'sidebar')
            ->orderBy('order')
            ->get();

        // Construir estructura jerárquica
        $menuTree = $this->buildMenuTree($menus);

        return response()->json([
            'success' => true,
            'data' => ['menus' => $menuTree]
        ]);
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

        return response()->json([
            'success' => true,
            'data' => ['menus' => $menuTree]
        ]);
    }

    /**
     * Obtener lista de iconos disponibles
     */
    public function getAvailableIcons()
    {
        $icons = [
            'Home',
            'User',
            'Users',
            'Settings',
            'Lock',
            'Key',
            'Shield',
            'Database',
            'BarChart',
            'File',
            'Folder',
            'Truck',
            'Fuel',
            'Warehouse',
            'Box',
            'ShoppingCart',
            'Receipt',
            'DollarSign',
            'Calculator',
            'Calendar',
            'Clock',
            'Bell',
            'Mail',
            'MessageCircle',
            'Search',
            'Filter',
            'Download',
            'Upload',
            'Printer',
            'Trash',
            'Edit',
            'Plus',
            'Minus',
            'Check',
            'X',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'RefreshCw',
            'Save',
            'XCircle',
        ];

        return response()->json([
            'success' => true,
            'data' => $icons
        ]);
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

        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Posiciones actualizadas correctamente'
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Menú reordenado correctamente',
            'data' => $menu
        ]);
    }

    /**
     * Obtener tabs según el rol del usuario autenticado para una página específica
     *
     * @param Request $request
     * @param int $parentMenuId ID del menú padre (página)
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTabsByPage(Request $request, $parentMenuId)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => true,
                'data' => ['tabs' => []]
            ]);
        }

        $roles = $user->roles;
        
        if ($roles->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => ['tabs' => []]
            ]);
        }

        // Obtener todos los menús de los roles del usuario
        $menuIds = [];
        foreach ($roles as $role) {
            $roleMenuIds = $role->menus()->pluck('menus.id')->toArray();
            $menuIds = array_merge($menuIds, $roleMenuIds);
        }
        $menuIds = array_unique($menuIds);

        // Obtener tabs (menús de tipo 'tab') que son hijos del menú padre
        $tabs = Menu::whereIn('id', $menuIds)
            ->where('parent_id', $parentMenuId)
            ->where('menu_type', 'tab')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        // Formatear tabs para el frontend
        $formattedTabs = $tabs->map(function ($tab) {
            return [
                'id' => $tab->id,
                'key' => $tab->id,
                'label' => $tab->name,
                'url' => $tab->url,
                'icon' => $tab->icon,
                'order' => $tab->order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => ['tabs' => $formattedTabs]
        ]);
    }
}