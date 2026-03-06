<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración: Agregar campo menu_type a la tabla menus
 * 
 * Este campo permite diferenciar entre menús del sidebar y tabs dentro de páginas.
 * Valores posibles: 'sidebar' (menú principal del sidebar), 'tab' (tab dentro de una página)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->enum('menu_type', ['sidebar', 'tab'])->default('sidebar')->after('module');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn('menu_type');
        });
    }
};
