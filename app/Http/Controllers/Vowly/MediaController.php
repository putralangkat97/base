<?php

namespace App\Http\Controllers\Vowly;

use App\Actions\Vowly\StoreDesignMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vowly\UploadDesignMediaRequest;
use App\Models\Design;
use App\Models\DesignMedia;
use App\Models\Invitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaController extends Controller
{
    /**
     * Store an image for an active Design.
     */
    public function store(
        UploadDesignMediaRequest $request,
        Invitation $invitation,
        Design $design,
        StoreDesignMedia $storeDesignMedia,
    ): RedirectResponse {
        /** @var UploadedFile $photo */
        $photo = $request->file('photo');
        $storeDesignMedia->handle($design, $photo);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Image uploaded.'),
        ]);

        return to_route('vowly.invitations.designs.editor', [$invitation, $design]);
    }

    /**
     * Stream private media to its owning User.
     */
    public function show(Invitation $invitation, Design $design, DesignMedia $media): StreamedResponse
    {
        Gate::authorize('viewMedia', $media);
        abort_unless($media->design_id === $design->id && $design->invitation_id === $invitation->id, 404);

        $disk = Storage::disk($media->disk);
        abort_unless($disk->exists($media->path), 404);

        $stream = $disk->readStream($media->path);
        abort_unless(is_resource($stream), 404);

        return response()->stream(function () use ($stream): void {
            fpassthru($stream);
            fclose($stream);
        }, 200, [
            'Cache-Control' => 'private, no-store',
            'Content-Length' => (string) $media->size,
            'Content-Type' => $media->mime_type,
        ]);
    }
}
