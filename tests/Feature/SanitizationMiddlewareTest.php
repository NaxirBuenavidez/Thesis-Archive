<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SanitizationMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['slug' => 'admin', 'name' => 'Admin']);
        Role::create(['slug' => 'client', 'name' => 'Client']);
    }

    public function test_global_sanitization_strips_tags_from_user_input()
    {
        $admin = User::factory()->create(['role_id' => Role::where('slug', 'admin')->first()->id]);

        $data = [
            'name' => '<b>John Doe</b>',
            'email' => 'john@example.com',
            'role_id' => Role::where('slug', 'admin')->first()->id,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->actingAs($admin)->postJson('/api/users', $data);

        $response->assertStatus(201);
        
        $user = User::where('email', 'john@example.com')->first();
        // Tags should be stripped from 'name'
        $this->assertEquals('John Doe', $user->name);
    }

    public function test_sanitization_normalizes_whitespace()
    {
        $admin = User::factory()->create(['role_id' => Role::where('slug', 'admin')->first()->id]);

        $data = [
            'name' => "John    \n  Doe",
            'email' => 'whitespace@example.com',
            'role_id' => Role::where('slug', 'admin')->first()->id,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->actingAs($admin)->postJson('/api/users', $data);

        $response->assertStatus(201);
        
        $user = User::where('email', 'whitespace@example.com')->first();
        $this->assertEquals('John Doe', $user->name);
    }

    public function test_nested_data_is_sanitized()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'fname' => '<b>Jane</b>',
            'lname' => 'Doe',
            'address' => "123   \n  Main St",
        ];

        $response = $this->postJson('/api/profile', $data);

        $response->assertStatus(200);
        
        $user->refresh();
        $this->assertEquals('Jane', $user->profile->fname);
        $this->assertEquals('123 Main St', $user->profile->address);
    }

    public function test_sensitive_fields_are_skipped()
    {
        $admin = User::factory()->create(['role_id' => Role::where('slug', 'admin')->first()->id]);

        // Use a password that satisfies validation but has spaces/tags that shouldn't be touched by middleware
        $password = ' Password123! <b> '; 
        $data = [
            'name' => 'Security Test',
            'email' => 'security@example.com',
            'role_id' => Role::where('slug', 'admin')->first()->id,
            'password' => $password,
            'password_confirmation' => $password,
        ];

        $response = $this->actingAs($admin)->postJson('/api/users', $data);
        $response->assertStatus(201);
        
        $user = User::where('email', 'security@example.com')->first();
        
        // If it was sanitized, it would be 'Password123!' (trimmed and tags stripped)
        // Hash::check should match the ORIGINAL password if middleware skipped it
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check($password, $user->password));
    }
}
