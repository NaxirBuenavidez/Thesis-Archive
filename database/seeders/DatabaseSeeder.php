<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SystemManagerSeeder::class,
        ]);

        $roles = \App\Models\Role::all();

        // Create Admin
        User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@admin.com',
            'password' => \Illuminate\Support\Facades\Hash::make('Admin123!'),
            'role_id' => $roles->where('slug', 'admin')->first()->id,
        ])->profile()->save(\App\Models\Profile::factory()->make());

        // Create Client
        User::factory()->create([
            'name' => 'Regular User',
            'email' => 'client@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('Client123!'),
            'role_id' => $roles->where('slug', 'client')->first()->id,
        ])->profile()->save(\App\Models\Profile::factory()->make());
    }
}
