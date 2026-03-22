<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Set the logo path to an absolute path within the public images directory
        // This avoids issues with relative paths and storage symlinks on Vercel
        Setting::updateOrCreate(
            ['key' => 'logo_path'],
            ['value' => '/images/ptas-logo.png']
        );
        
        // Ensure the title is also correct
        Setting::updateOrCreate(
            ['key' => 'system_title'],
            ['value' => 'PTAS Thesis Archive']
        );

        \Illuminate\Support\Facades\Cache::forget('system_settings');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse as it's a setting fix
    }
};
