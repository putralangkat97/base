<?php

namespace App\Http\Controllers\Vowly;

use App\Http\Controllers\Controller;
use App\Models\Design;
use App\Models\DesignMedia;
use App\Models\Invitation;
use App\Support\Vowly\DesignDocumentSchema;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    /**
     * Display the active Design in the production editor.
     */
    public function show(Invitation $invitation, Design $design): Response
    {
        Gate::authorize('save', $design);
        abort_unless($design->invitation_id === $invitation->id, 404);

        $invitation->load('designs');

        return Inertia::render('invitations/editor', [
            'invitation' => [
                'id' => $invitation->id,
                'name' => $invitation->name,
                'designs' => $invitation->designs
                    ->map(fn (Design $candidate): array => [
                        'id' => $candidate->id,
                        'name' => $candidate->name,
                        'isActive' => $candidate->is_active,
                        'isArchived' => $candidate->archived_at !== null,
                        'updatedAt' => $candidate->updated_at?->toISOString(),
                    ])
                    ->values()
                    ->all(),
                'activeDesign' => [
                    'id' => $design->id,
                    'name' => $design->name,
                    'document' => $design->document ?? DesignDocumentSchema::empty(),
                ],
            ],
            'media' => $design->media
                ->map(fn (DesignMedia $media): array => [
                    'id' => $media->id,
                    'url' => route('vowly.invitations.designs.media.show', [$invitation, $design, $media]),
                    'mimeType' => $media->mime_type,
                    'width' => $media->width,
                    'height' => $media->height,
                ])
                ->values()
                ->all(),
        ]);
    }
}
