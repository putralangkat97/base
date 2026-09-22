<?php

namespace App\Models;

use Database\Factories\DesignFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $invitation_id
 * @property string $name
 * @property bool $is_active
 * @property Carbon|null $archived_at
 * @property array<string, mixed>|null $document
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Invitation $invitation
 * @property-read Collection<int, DesignMedia> $media
 */
#[Fillable(['invitation_id', 'name', 'is_active', 'archived_at', 'document'])]
class Design extends Model
{
    /** @use HasFactory<DesignFactory> */
    use HasFactory;

    /**
     * Get the invitation that owns the design.
     */
    /**
     * @return BelongsTo<Invitation, $this>
     */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /**
     * Get the private media attached to the design.
     *
     * @return HasMany<DesignMedia, $this>
     */
    public function media(): HasMany
    {
        return $this->hasMany(DesignMedia::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'archived_at' => 'datetime',
            'document' => 'array',
        ];
    }
}
