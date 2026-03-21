<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Index for forUser scope and ordering
            $table->index(['target_user_id', 'read_at', 'created_at'], 'notifications_optimization_idx');
        });

        Schema::table('theses', function (Blueprint $table) {
            $table->index('status');
            $table->index('department');
            $table->index('owner_id');
            $table->index('created_at');
        });
        
        Schema::table('users', function (Blueprint $table) {
            // Ensure role_id is indexed for bootstrapping
            $table->index('role_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_optimization_idx');
        });

        Schema::table('theses', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['department']);
            $table->dropIndex(['owner_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role_id']);
        });
    }
};
