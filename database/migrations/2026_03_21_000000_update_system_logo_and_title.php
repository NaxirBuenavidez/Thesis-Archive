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
        Setting::updateOrCreate(
            ['key' => 'logo_path'],
            ['value' => 'ptas-logo.png']
        );

        Setting::updateOrCreate(
            ['key' => 'site_title'],
            ['value' => 'PECIT THESES ARCHIVE SYSTEM']
        );

        Setting::updateOrCreate(
            ['key' => 'site_description'],
            ['value' => 'PHILIPPINE ELECTRONICS & COMMUNICATION INSTITUTE OF TECHNOLOGY']
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally revert to original values if known, or leave as is
    }
};
