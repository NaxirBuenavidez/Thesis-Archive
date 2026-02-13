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
            DepartmentProgramSeeder::class,
        ]);

        $roles = \App\Models\Role::all();

        // Create SpAdmin
        User::factory()->create([
            'name' => 'SpAdmin User',
            'email' => 'spadmin@example.com',
            'role_id' => $roles->where('slug', 'spadmin')->first()->id,
        ])->profile()->save(\App\Models\Profile::factory()->make());

        // Create Admin
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => \Illuminate\Support\Facades\Hash::make('Admin123!'),
            'role_id' => $roles->where('slug', 'admin')->first()->id,
        ])->profile()->save(\App\Models\Profile::factory()->make());

        // Create Client
        User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'role_id' => $roles->where('slug', 'client')->first()->id,
        ])->profile()->save(\App\Models\Profile::factory()->make());

        // Create some random users
        User::factory(10)->create()->each(function ($user) {
            $user->profile()->save(\App\Models\Profile::factory()->make());
        });
    }
}
