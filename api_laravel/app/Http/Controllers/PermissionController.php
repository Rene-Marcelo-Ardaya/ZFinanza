<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json(Permission::orderBy('name')->get());
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

        return response()->json(['message' => 'Permiso creado correctamente', 'permission' => $permission], 201);
    }

    public function show(Permission $permission)
    {
        return response()->json(['permission' => $permission->load('roles')]);
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

        return response()->json(['message' => 'Permiso actualizado correctamente', 'permission' => $permission]);
    }

    public function destroy(Permission $permission)
    {
        $permission->roles()->detach();
        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado correctamente']);
    }
}