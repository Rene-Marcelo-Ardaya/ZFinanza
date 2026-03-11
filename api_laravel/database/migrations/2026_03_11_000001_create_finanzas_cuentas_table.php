<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración: Tabla de Cuentas - Finanzas
 * Tabla: f_cuentas
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('f_cuentas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->text('descripcion')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Índices para búsquedas frecuentes
            $table->index('is_active');
            $table->index('nombre');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('f_cuentas');
    }
};
