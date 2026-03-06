<?php

namespace App\Http\Controllers\Sistemas;

use App\Models\Sistemas\Permission;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Permission::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'slug' => 'required|string|max:255|unique:permissions',
            'module' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $permission = Permission::create($request->only(['name', 'slug', 'module', 'description']));

        return response()->json([
            'success' => true,
            'message' => 'Permiso creado correctamente',
            'data' => $permission
        ], 201);
    }

    public function show(Permission $permission)
    {
        return response()->json([
            'success' => true,
            'data' => $permission->load('roles')
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:permissions,name,' . $permission->id,
            'slug' => 'sometimes|required|string|max:255|unique:permissions,slug,' . $permission->id,
            'module' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $permission->update($request->only(['name', 'slug', 'module', 'description']));

        return response()->json([
            'success' => true,
            'message' => 'Permiso actualizado correctamente',
            'data' => $permission
        ]);
    }

    public function destroy(Permission $permission)
    {
        $permission->roles()->detach();
        $permission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permiso eliminado correctamente'
        ]);
    }
}