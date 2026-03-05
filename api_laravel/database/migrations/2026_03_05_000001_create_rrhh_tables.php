<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración consolidada: RRHH
 * Tablas: cargos, personal, ubicacion_pins, personal_pin_acceso
 */
return new class extends Migration
{
    public function up(): void
    {
        // Cargos
        Schema::create('cargos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Ubicaciones PIN
        Schema::create('ubicacion_pins', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->string('ubicacion')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Personal
        Schema::create('personal', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('apellido_paterno', 100);
            $table->string('apellido_materno', 100)->nullable();
            $table->string('ci', 20)->nullable()->unique();
            $table->string('pin')->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['M', 'F', 'O'])->nullable();
            $table->text('direccion')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email')->nullable();
            $table->foreignId('cargo_id')->constrained('cargos')->restrictOnDelete();
            $table->foreignId('nivel_seguridad_id')->nullable()->constrained('niveles_seguridad')->nullOnDelete();
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_salida')->nullable();
            $table->decimal('salario', 12, 2)->nullable();
            $table->string('tipo_contrato', 50)->nullable();
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->text('observaciones')->nullable();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Accesos PIN
        Schema::create('personal_pin_acceso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_id')->constrained('personal')->cascadeOnDelete();
            $table->foreignId('ubicacion_id')->nullable()->constrained('ubicacion_pins')->nullOnDelete();
            $table->timestamp('fecha_acceso')->useCurrent();
            $table->string('tipo_acceso', 50)->nullable()->comment('ENTRADA, SALIDA, etc');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_pin_acceso');
        Schema::dropIfExists('personal');
        Schema::dropIfExists('ubicacion_pins');
        Schema::dropIfExists('cargos');
    }
};
