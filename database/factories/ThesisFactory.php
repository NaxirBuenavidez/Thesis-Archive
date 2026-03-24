<?php

namespace Database\Factories;

use App\Models\Thesis;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Thesis>
 */
class ThesisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'author' => fake()->name(),
            'subtitle' => fake()->sentence(),
            'abstract' => fake()->paragraph(),
            'discipline' => fake()->word(),
            'keywords' => [fake()->word(), fake()->word()],
            'status' => 'draft',
            'owner_id' => User::factory(),
            'degree_type' => 'Bachelor',
            'institution' => 'University',
            'department' => 'CS',
            'submission_date' => now(),
            'is_confidential' => false,
        ];
    }
}
