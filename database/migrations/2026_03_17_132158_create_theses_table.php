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
        Schema::create('theses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('title');
            $table->text('subtitle')->nullable();
            $table->text('abstract')->nullable();
            $table->text('discipline')->nullable();
            $table->json('keywords')->nullable(); // JSON instead of TEXT array for database neutrality
            $table->string('status')->default('draft');
            // User references - since users use BigIncrement IDs in this project, we must use foreignId instead of UUID to prevent type logic errors.
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('primary_supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('degree_type')->nullable();
            $table->string('institution')->nullable();
            $table->string('department')->nullable();
            $table->timestamp('submission_date')->nullable();
            $table->timestamp('defense_date')->nullable();
            $table->timestamp('embargo_until')->nullable();
            $table->boolean('is_confidential')->default(false);
            
            $table->uuid('main_file_id')->nullable(); // Assuming files table is UUID, or just a generic reference.
            $table->string('doi')->unique()->nullable();
            $table->timestamps();
        });

        // Add the custom CHECK constraint for title char length
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE theses ADD CONSTRAINT chk_title_not_empty CHECK (char_length(title) > 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theses');
    }
};
