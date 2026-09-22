<?php

namespace App\Actions\Vowly;

use App\Models\Design;
use App\Models\Invitation;
use App\Support\Vowly\DesignDocumentSchema;

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
            'document' => DesignDocumentSchema::empty(),
        ]);
    }
}
