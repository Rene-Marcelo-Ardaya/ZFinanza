<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

/**
 * Seeder para configuración base del sistema.
 * 
 * Crea los roles base, permisos y usuario administrador inicial.
 */
class BaseConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos base
        $permissions = $this->createPermissions();

        // Crear roles base
        $roles = $this->createRoles();

        // Asignar todos los permisos al rol super-admin
        $roles['super-admin']->permissions()->sync(
            collect($permissions)->pluck('id')->toArray()
        );

        // Asignar permisos básicos al rol user
        $userPermissions = ['users.view', 'roles.view', 'menus.view', 'settings.view'];
        $roles['user']->permissions()->sync(
            collect($permissions)->whereIn('name', $userPermissions)->pluck('id')->toArray()
        );

        // Crear usuario administrador inicial
        $this->createAdminUser($roles['super-admin']);

        $this->command->info('✅ Configuración base completada:');
        $this->command->info('   - Roles: super-admin, user');
        $this->command->info('   - Permisos creados: ' . count($permissions));
        $this->command->info('   - Usuario admin: admin@example.com / admin123');
    }

    /**
     * Crear permisos base del sistema.
     */
    private function createPermissions(): array
    {
        $permissions = [];
        $modules = ['users', 'roles', 'permissions', 'menus', 'cargos', 'personal', 'settings'];
        $actions = ['view', 'create', 'update', 'delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permission = Permission::firstOrCreate(
                    ['name' => "{$module}.{$action}"],
                    [
                        'slug' => "{$module}.{$action}",
                        'description' => "Permiso para {$action} {$module}",
                        'module' => $module,
                    ]
                );
                $permissions[] = $permission;
            }
        }

        // Permisos especiales
        $specialPermissions = [
            ['name' => 'users.activate', 'description' => 'Activar/desactivar usuarios', 'module' => 'users'],
            ['name' => 'users.assign-role', 'description' => 'Asignar roles a usuarios', 'module' => 'users'],
            ['name' => 'roles.sync-permissions', 'description' => 'Sincronizar permisos de roles', 'module' => 'roles'],
            ['name' => 'roles.sync-menus', 'description' => 'Sincronizar menús de roles', 'module' => 'roles'],
            ['name' => 'personal.validate-pin', 'description' => 'Validar PIN de personal', 'module' => 'personal'],
            ['name' => 'personal.generate-pin', 'description' => 'Generar PIN de personal', 'module' => 'personal'],
            ['name' => 'menus.reorder', 'description' => 'Reordenar menús', 'module' => 'menus'],
        ];

        foreach ($specialPermissions as $permData) {
            $permission = Permission::firstOrCreate(
                ['name' => $permData['name']],
                [
                    'slug' => $permData['name'],
                    'description' => $permData['description'],
                    'module' => $permData['module'],
                ]
            );
            $permissions[] = $permission;
        }

        return $permissions;
    }

    /**
     * Crear roles base del sistema.
     */
    private function createRoles(): array
    {
        $roles = [];

        // Rol Super Admin - Acceso total
        $roles['super-admin'] = Role::firstOrCreate(
            ['name' => 'super-admin'],
            [
                'slug' => 'super-admin',
                'description' => 'Administrador con acceso total al sistema',
                'session_timeout' => null,
            ]
        );

        // Rol User - Usuario estándar
        $roles['user'] = Role::firstOrCreate(
            ['name' => 'user'],
            [
                'slug' => 'user',
                'description' => 'Usuario estándar con permisos básicos',
                'session_timeout' => null,
            ]
        );

        return $roles;
    }

    /**
     * Crear usuario administrador inicial.
     */
    private function createAdminUser(Role $role): User
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Asignar rol super-admin
        $user->roles()->syncWithoutDetaching([$role->id]);

        return $user;
    }
}