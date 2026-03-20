<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'accepted_thesis' | 'new_user' | 'new_thesis'
            $table->unsignedBigInteger('target_user_id')->nullable(); // who receives it (null = all admins)
            $table->string('title');
            $table->string('message');
            $table->json('data')->nullable(); // extra payload (thesis_id, user_id, etc.)
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
