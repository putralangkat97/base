<?php

namespace App\Policies;

use App\Models\Invitation;
use App\Models\User;

class InvitationPolicy
{
    /**
     * Determine whether the user can view any invitations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the invitation.
     */
    public function view(User $user, Invitation $invitation): bool
    {
        return $user->is($invitation->user);
    }

    /**
     * Determine whether the user can create an invitation.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the invitation.
     */
    public function update(User $user, Invitation $invitation): bool
    {
        return $user->is($invitation->user);
    }
}
