<?php

namespace App\Actions\Vowly;

use App\Models\Design;
use App\Models\Invitation;

class CreateDesign
{
    /**
     * Create an inactive design draft.
     */
    public function handle(Invitation $invitation, string $name): Design
    {
        return $invitation->designs()->create([
            'name' => $name,
            'is_active' => false,
        ]);
    }
}
