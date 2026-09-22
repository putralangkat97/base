<?php

namespace App\Policies;

use App\Models\Design;
use App\Models\Invitation;
use App\Models\User;

class DesignPolicy
{
    /**
     * Determine whether the user can create a design for the invitation.
     */
    public function create(User $user, Invitation $invitation): bool
    {
        return $user->is($invitation->user);
    }

    /**
     * Determine whether the user can view the design.
     */
    public function view(User $user, Design $design): bool
    {
        return $user->is($design->invitation->user);
    }

    /**
     * Determine whether the user can update the design.
     */
    public function update(User $user, Design $design): bool
    {
        return $user->is($design->invitation->user);
    }

    /**
     * Determine whether the user can switch to the design.
     */
    public function activate(User $user, Design $design): bool
    {
        return $this->update($user, $design) && $design->archived_at === null;
    }

    /**
     * Determine whether the user can archive the design.
     */
    public function archive(User $user, Design $design): bool
    {
        return $this->update($user, $design) && $design->archived_at === null;
    }

    /**
     * Determine whether the user can restore the design.
     */
    public function restore(User $user, Design $design): bool
    {
        return $this->update($user, $design) && $design->archived_at !== null;
    }

    /**
     * Determine whether the user can delete the design.
     */
    public function delete(User $user, Design $design): bool
    {
        return $this->update($user, $design) && ! $design->is_active;
    }
}
