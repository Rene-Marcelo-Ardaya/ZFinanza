<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeder principal que orquesta todos los seeders base del sistema.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando seeders base del sistema...');

        // 1. Configuración base (roles, permisos, usuario admin)
        $this->call(BaseConfigurationSeeder::class);

        // 2. Menús del sistema
        $this->call(MenusSeeder::class);

        $this->command->newLine();
        $this->command->info('✅ Todos los seeders se ejecutaron correctamente.');
        $this->command->newLine();
        $this->command->info('📋 Resumen:');
        $this->command->info('   - Roles: super-admin, user');
        $this->command->info('   - Usuario admin: admin@example.com / admin123');
        $this->command->info('   - Menús base creados');
        $this->command->newLine();
        $this->command->warn('⚠️  Recuerda cambiar la contraseña del usuario admin en producción.');
    }
}