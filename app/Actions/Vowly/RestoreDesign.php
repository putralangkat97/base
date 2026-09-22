<?php

namespace App\Actions\Vowly;

use App\Models\Design;

class RestoreDesign
{
    /**
     * Restore a design as an inactive draft.
     */
    public function handle(Design $design): void
    {
        $design->update([
            'archived_at' => null,
            'is_active' => false,
        ]);
    }
}
