<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Thesis;
use App\Models\Department;
use App\Models\Program;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class IdempotencyTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $role = Role::create(['name' => 'Client', 'slug' => 'client']);
        $this->user = User::factory()->create(['role_id' => $role->id]);
        
        Department::create(['name' => 'Engineering']);
        Program::create(['name' => 'BSCS', 'department_id' => 1]);
    }

    /** @test */
    public function it_prevents_duplicate_thesis_submissions()
    {
        Cache::flush();

        $thesisData = [
            'title' => 'Unique Research Title',
            'author' => 'John Doe',
            'abstract' => 'This is a test abstract.',
            'status' => 'submitted',
            'department' => 'Engineering',
            'discipline' => 'BSCS',
            'degree_type' => 'BSCS',
            'submission_date' => now()->toDateTimeString(),
            'keywords' => ['test', 'idempotency'],
        ];

        // First submission
        $response1 = $this->actingAs($this->user)
            ->postJson('/api/theses', $thesisData);

        $response1->assertStatus(201);
        $this->assertEquals(1, Thesis::count());

        // Second submission (Immediate retry)
        $response2 = $this->actingAs($this->user)
            ->postJson('/api/theses', $thesisData);

        $response2->assertStatus(200); // 200 instead of 201
        $response2->assertJsonFragment(['message' => 'Thesis already submitted (Duplicate prevented)']);
        
        // Count should still be 1
        $this->assertEquals(1, Thesis::count());
    }
}
