<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->string('pdf_path')->nullable()->after('doi');
            $table->string('pdf_original_name')->nullable()->after('pdf_path');
        });
    }

    public function down(): void
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->dropColumn(['pdf_path', 'pdf_original_name']);
        });
    }
};
