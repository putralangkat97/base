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

class PreviewController extends Controller
{
    /**
     * Display the saved Design document in a private read-only preview.
     */
    public function show(Invitation $invitation, Design $design): Response
    {
        Gate::authorize('preview', $design);
        abort_unless($design->invitation_id === $invitation->id, 404);

        $design->load('media');

        return Inertia::render('invitations/preview', [
            'invitation' => [
                'id' => $invitation->id,
                'name' => $invitation->name,
                'activeDesign' => [
                    'id' => $design->id,
                    'name' => $design->name,
                    'document' => $design->document ?? DesignDocumentSchema::empty(),
                ],
                'designs' => [],
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
