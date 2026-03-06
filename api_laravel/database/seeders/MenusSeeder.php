<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sistemas\Menu;
use App\Models\Sistemas\Role;
use Illuminate\Support\Facades\DB;

class MenusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar menús existentes
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Menu::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $menusData = [
            // 1. Dashboard
            [
                'name' => 'Dashboard',
                'url' => '/',
                'icon' => 'LayoutDashboard',
                'order' => 1,
                'module' => 'HOME',
                'is_active' => true,
                'children' => []
            ],
            // 2. Configuración (padre único para menús básicos)
            [
                'name' => 'Configuración',
                'url' => null,
                'icon' => 'Settings',
                'order' => 2,
                'module' => 'SISTEMAS',
                'is_active' => true,
                'children' => [
                    [
                        'name' => 'Personal',
                        'url' => '/rrhh/personal',
                        'icon' => 'UserCircle',
                        'order' => 1,
                        'module' => 'RRHH',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Cargos',
                        'url' => '/rrhh/cargos',
                        'icon' => 'Briefcase',
                        'order' => 2,
                        'module' => 'RRHH',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Usuarios',
                        'url' => '/sistemas/usuarios',
                        'icon' => 'Users',
                        'order' => 3,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Menús',
                        'url' => '/sistemas/menus',
                        'icon' => 'Menu',
                        'order' => 4,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Niveles Seguridad',
                        'url' => '/sistemas/niveles-seguridad',
                        'icon' => 'Shield',
                        'order' => 5,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Control Accesos',
                        'url' => '/sistemas/control-accesos',
                        'icon' => 'Lock',
                        'order' => 6,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Configuración Sistema',
                        'url' => '/sistemas/configuracion',
                        'icon' => 'Settings2',
                        'order' => 7,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ]
                ]
            ]
        ];

        $createdMenuIds = [];

        foreach ($menusData as $menuData) {
            $children = $menuData['children'] ?? [];
            unset($menuData['children']);

            $parent = Menu::create($menuData);
            $createdMenuIds[] = $parent->id;

            foreach ($children as $childData) {
                $childData['parent_id'] = $parent->id;
                $child = Menu::create($childData);
                $createdMenuIds[] = $child->id;
            }
        }

        // Asignar todos los menús creados al rol super-admin (ID 1)
        $superAdminRole = Role::find(1);
        if ($superAdminRole) {
            $superAdminRole->menus()->sync($createdMenuIds);
            $this->command->info('Menús base creados y asignados al rol super-admin.');
        } else {
            $this->command->warn('Rol super-admin no encontrado. Los menús fueron creados pero no asignados.');
        }
    }
}
