<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\EducationalBackground;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test if sensitive headers are present.
     */
    public function test_security_headers_are_present(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    /**
     * Test mass assignment protection on EducationController.
     */
    public function test_education_mass_assignment_protection(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        
        $this->actingAs($user);

        $education = EducationalBackground::factory()->create([
            'user_id' => $user->id,
            'school_name' => 'Original School'
        ]);

        // Attempt to update user_id to otherUser's ID
        $response = $this->putJson("/api/education/{$education->id}", [
            'user_id' => $otherUser->id, // Malicious input
            'level' => 'Bachelor',
            'school_name' => 'Updated School',
            'year_start' => 2020,
        ]);

        $response->assertStatus(200);

        // Verify the user_id DID NOT change
        $this->assertDatabaseHas('educational_backgrounds', [
            'id' => $education->id,
            'school_name' => 'Updated School',
            'user_id' => $user->id, // Should still be user->id
        ]);

        $this->assertDatabaseMissing('educational_backgrounds', [
            'id' => $education->id,
            'user_id' => $otherUser->id,
        ]);
    }

       /**
     * Test ProfileController strict ID validation.
     */
    public function test_profile_id_validation_prevents_unauthorized_updates(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        
        $userEducation = EducationalBackground::factory()->create(['user_id' => $user->id]);
        $otherEducation = EducationalBackground::factory()->create(['user_id' => $otherUser->id]);

        $this->actingAs($user);

        // Attempt to update profile including someone else's education ID
        $response = $this->postJson('/api/profile', [
            'fname' => 'Test',
            'lname' => 'User',
            'educational_backgrounds' => [
                [
                    'id' => $otherEducation->id, // ID belonging to another user
                    'level' => 'Master',
                    'school_name' => 'Hacked School',
                    'year_start' => 2022,
                ]
            ]
        ]);

        // Should return validation error for that ID
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['educational_backgrounds.0.id']);
    }
}
