<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fname' => fake()->firstName(),
            'mname' => fake()->optional()->firstName(),
            'lname' => fake()->lastName(),
            'suffix' => fake()->optional()->suffix(),
            'address' => fake()->address(),
            'phone_number' => fake()->phoneNumber(),
            'bio' => fake()->paragraph(),
            'date_of_birth' => fake()->date(),
        ];
    }
}
