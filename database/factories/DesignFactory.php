<?php

namespace Database\Factories;

use App\Models\Design;
use App\Models\Invitation;
use App\Support\Vowly\DesignDocumentSchema;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Design>
 */
class DesignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invitation_id' => Invitation::factory(),
            'name' => fake()->unique()->words(2, true),
            'is_active' => false,
            'archived_at' => null,
            'document' => DesignDocumentSchema::empty(),
        ];
    }

    /**
     * Mark the design as active.
     */
    public function active(): static
    {
        return $this->state(fn (): array => [
            'is_active' => true,
            'archived_at' => null,
        ]);
    }

    /**
     * Mark the design as archived.
     */
    public function archived(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
            'archived_at' => now(),
        ]);
    }
}
