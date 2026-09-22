<?php

namespace App\Actions\Vowly;

use App\Models\Design;
use App\Models\Invitation;
use DomainException;
use Illuminate\Support\Facades\DB;

class SwitchDesign
{
    /**
     * Make a non-archived design the invitation's only active design.
     */
    public function handle(Invitation $invitation, Design $design): void
    {
        DB::transaction(function () use ($invitation, $design): void {
            $design = $invitation->designs()
                ->lockForUpdate()
                ->whereKey($design->id)
                ->firstOrFail();

            if ($design->archived_at !== null) {
                throw new DomainException('Restore this design before making it active.');
            }

            $invitation->designs()
                ->where('is_active', true)
                ->update(['is_active' => false]);

            $design->update(['is_active' => true]);
        });
    }
}
