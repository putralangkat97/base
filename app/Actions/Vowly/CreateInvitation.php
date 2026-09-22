<?php

namespace App\Actions\Vowly;

use App\Models\Invitation;
use App\Models\User;
use App\Support\Vowly\DesignDocumentSchema;
use Illuminate\Support\Facades\DB;

class CreateInvitation
{
    /**
     * Create an invitation with its first active design.
     */
    public function handle(User $user, string $name): Invitation
    {
        return DB::transaction(function () use ($user, $name): Invitation {
            $invitation = $user->invitations()->create([
                'name' => $name,
            ]);

            $invitation->designs()->create([
                'name' => 'Untitled design',
                'is_active' => true,
                'document' => DesignDocumentSchema::empty(),
            ]);

            return $invitation->load('activeDesign');
        });
    }
}
