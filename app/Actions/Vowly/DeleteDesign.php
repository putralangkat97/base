<?php

namespace App\Actions\Vowly;

use App\Models\Design;

class DeleteDesign
{
    /**
     * Delete an inactive design draft.
     */
    public function handle(Design $design): void
    {
        $design->delete();
    }
}
