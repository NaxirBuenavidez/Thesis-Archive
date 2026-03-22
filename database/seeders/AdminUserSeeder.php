<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Roles exist
        $adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Administrator']);
        Role::firstOrCreate(['slug' => 'client'], ['name' => 'Client']);
        Role::firstOrCreate(['slug' => 'spadmin'], ['name' => 'Super Admin']);

        // 2. Create or Update Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('Admin123!'),
                'role_id' => $adminRole->id,
            ]
        );

        // 3. Ensure Profile exists
        if (!$admin->profile) {
            Profile::create([
                'user_id' => $admin->id,
                'first_name' => 'System',
                'last_name' => 'Administrator',
            ]);
        }

        echo "Admin user (admin@admin.com / Admin123!) seeded successfully.\n";
    }
}
