<?php

namespace App\Actions\Vowly;

use App\Models\Design;
use App\Models\Invitation;
use DomainException;
use Illuminate\Support\Facades\DB;

class ArchiveDesign
{
    /**
     * Archive a design, selecting a replacement when the active design is archived.
     */
    public function handle(Invitation $invitation, Design $design): void
    {
        DB::transaction(function () use ($invitation, $design): void {
            $design = $invitation->designs()
                ->lockForUpdate()
                ->whereKey($design->id)
                ->firstOrFail();

            if (! $design->is_active) {
                $design->update(['archived_at' => now()]);

                return;
            }

            $replacement = $invitation->designs()
                ->whereKeyNot($design->id)
                ->where('is_active', false)
                ->whereNull('archived_at')
                ->orderBy('created_at')
                ->lockForUpdate()
                ->first();

            if ($replacement === null) {
                throw new DomainException('Create another design before archiving the active design.');
            }

            $design->update([
                'is_active' => false,
                'archived_at' => now(),
            ]);
            $replacement->update(['is_active' => true]);
        });
    }
}
