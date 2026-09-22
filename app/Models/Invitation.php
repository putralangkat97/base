<?php

namespace App\Models;

use Database\Factories\InvitationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, Design> $designs
 * @property-read Design|null $activeDesign
 */
#[Fillable(['user_id', 'name'])]
class Invitation extends Model
{
    /** @use HasFactory<InvitationFactory> */
    use HasFactory;

    /**
     * Get the user that owns the invitation.
     */
    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the invitation's designs.
     *
     * @return HasMany<Design, $this>
     */
    public function designs(): HasMany
    {
        return $this->hasMany(Design::class);
    }

    /**
     * Get the active design.
     */
    /**
     * @return HasOne<Design, $this>
     */
    public function activeDesign(): HasOne
    {
        return $this->hasOne(Design::class)->where('is_active', true);
    }
}
