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
            // 1. Configuración (padre único para menús básicos)
            [
                'name' => 'Configuración',
                'url' => null,
                'icon' => 'Settings',
                'order' => 1,
                'module' => 'SISTEMAS',
                'is_active' => true,
                'menu_type' => 'sidebar',
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
                        'name' => 'Negocios',
                        'url' => '/sistemas/negocios',
                        'icon' => 'Building2',
                        'order' => 3,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Usuarios',
                        'url' => '/sistemas/usuarios',
                        'icon' => 'Users',
                        'order' => 4,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Menús',
                        'url' => '/sistemas/menus',
                        'icon' => 'Menu',
                        'order' => 5,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Niveles Seguridad',
                        'url' => '/sistemas/niveles-seguridad',
                        'icon' => 'Shield',
                        'order' => 6,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Control Accesos',
                        'url' => '/sistemas/control-accesos',
                        'icon' => 'Lock',
                        'order' => 7,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ],
                    [
                        'name' => 'Configuración Sistema',
                        'url' => '/sistemas/configuracion',
                        'icon' => 'Settings2',
                        'order' => 8,
                        'module' => 'SISTEMAS',
                        'is_active' => true,
                    ]
                ]
            ],
            // 2. FINANZAS (módulo de finanzas)
            [
                'name' => 'FINANZAS',
                'url' => null,
                'icon' => 'Wallet',
                'order' => 2,
                'module' => 'FINANZAS',
                'is_active' => true,
                'menu_type' => 'sidebar',
                'children' => [
                    [
                        'name' => 'Configuración',
                        'url' => '/finanzas/configuracion',
                        'icon' => 'Settings',
                        'order' => 1,
                        'module' => 'FINANZAS',
                        'is_active' => true,
                        'menu_type' => 'sidebar',
                        'children' => [
                            [
                                'name' => 'Centro de cuentas',
                                'url' => '/finanzas/configuracion',
                                'icon' => 'Building2',
                                'order' => 1,
                                'module' => 'FINANZAS',
                                'is_active' => true,
                                'menu_type' => 'tab',
                            ],
                            [
                                'name' => 'Cuentas',
                                'url' => '/finanzas/configuracion',
                                'icon' => 'CreditCard',
                                'order' => 2,
                                'module' => 'FINANZAS',
                                'is_active' => true,
                                'menu_type' => 'tab',
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $createdMenuIds = [];

        $this->createMenusRecursively($menusData, $createdMenuIds, null);

        // Asignar todos los menús creados al rol super-admin (ID 1)
        $superAdminRole = Role::find(1);
        if ($superAdminRole) {
            $superAdminRole->menus()->sync($createdMenuIds);
            $this->command->info('Menús base creados y asignados al rol super-admin.');
        } else {
            $this->command->warn('Rol super-admin no encontrado. Los menús fueron creados pero no asignados.');
        }
    }

    /**
     * Crear menús recursivamente para soportar múltiples niveles de anidación
     */
    private function createMenusRecursively(array $menusData, array &$createdMenuIds, $parentId = null): void
    {
        foreach ($menusData as $menuData) {
            $children = $menuData['children'] ?? [];
            unset($menuData['children']);

            // Asignar parent_id si existe
            if ($parentId !== null) {
                $menuData['parent_id'] = $parentId;
            }

            // Crear el menú
            $menu = Menu::create($menuData);
            $createdMenuIds[] = $menu->id;

            // Crear hijos recursivamente
            if (!empty($children)) {
                $this->createMenusRecursively($children, $createdMenuIds, $menu->id);
            }
        }
    }
}
