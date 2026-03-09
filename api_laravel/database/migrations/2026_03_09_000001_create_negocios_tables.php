<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración consolidada: Negocios y Base de Datos
 * Tablas: negocios, base_datos, negocio_user
 */
return new class extends Migration
{
    public function up(): void
    {
        // Negocios
        Schema::create('negocios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Base de Datos
        Schema::create('base_datos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->string('host');
            $table->integer('puerto');
            $table->string('usuario_bd');
            $table->string('password_bd');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Tabla intermedia: Negocios ↔ Users (N:M)
        Schema::create('negocio_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            // Evitar duplicados
            $table->unique(['negocio_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('negocio_user');
        Schema::dropIfExists('base_datos');
        Schema::dropIfExists('negocios');
    }
};
