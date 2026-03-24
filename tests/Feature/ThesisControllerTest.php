<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Thesis;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ThesisControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        Role::create(['slug' => 'spadmin', 'name' => 'Super Admin']);
        Role::create(['slug' => 'admin', 'name' => 'Admin']);
        Role::create(['slug' => 'client', 'name' => 'Client']);
    }

    public function test_admin_can_see_all_theses()
    {
        $admin = User::factory()->create(['role_id' => Role::where('slug', 'admin')->first()->id]);
        
        Thesis::factory()->count(3)->create();

        $response = $this->actingAs($admin)->getJson('/api/theses');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_client_can_only_see_their_own_theses()
    {
        $client1 = User::factory()->create(['role_id' => Role::where('slug', 'client')->first()->id]);
        $client2 = User::factory()->create(['role_id' => Role::where('slug', 'client')->first()->id]);
        
        Thesis::factory()->count(2)->create(['owner_id' => $client1->id]);
        Thesis::factory()->count(3)->create(['owner_id' => $client2->id]);

        $response = $this->actingAs($client1)->getJson('/api/theses');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    public function test_thesis_data_is_sanitized_on_store()
    {
        $client = User::factory()->create(['role_id' => Role::where('slug', 'client')->first()->id]);
        
        $data = [
            'title' => '<h1>Malicious Title</h1>',
            'author' => '<script>alert("xss")</script>John Doe',
            'status' => 'draft',
            'abstract' => 'Clean abstract',
        ];

        $response = $this->actingAs($client)->postJson('/api/theses', $data);

        $response->assertStatus(201);
        
        $thesis = Thesis::first();
        $this->assertEquals('Malicious Title', $thesis->title);
        $this->assertEquals('alert("xss")John Doe', $thesis->author);
    }

    public function test_thesis_data_is_sanitized_on_update()
    {
        $client = User::factory()->create(['role_id' => Role::where('slug', 'client')->first()->id]);
        $thesis = Thesis::factory()->create(['owner_id' => $client->id]);
        
        $data = [
            'title' => '<b>Updated Title</b>',
            'author' => 'Jane <br> Doe',
            'status' => 'submitted',
        ];

        $response = $this->actingAs($client)->putJson("/api/theses/{$thesis->id}", $data);

        $response->assertStatus(200);
        
        $thesis->refresh();
        $this->assertEquals('Updated Title', $thesis->title);
        $this->assertEquals('Jane Doe', $thesis->author);
    }
}
