<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'spadmin' => 'Super Admin',
            'admin' => 'Administrator',
            'client' => 'Client',
            'anonymous' => 'Anonymous',
        ];

        foreach ($roles as $slug => $name) {
            Role::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name]
            );
        }
    }
}
