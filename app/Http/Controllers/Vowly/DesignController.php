<?php

namespace App\Http\Controllers\Vowly;

use App\Actions\Vowly\ArchiveDesign;
use App\Actions\Vowly\CreateDesign;
use App\Actions\Vowly\DeleteDesign;
use App\Actions\Vowly\RestoreDesign;
use App\Actions\Vowly\SaveDesignDocument;
use App\Actions\Vowly\SwitchDesign;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vowly\CreateDesignRequest;
use App\Http\Requests\Vowly\RenameDesignRequest;
use App\Http\Requests\Vowly\SaveDesignDocumentRequest;
use App\Models\Design;
use App\Models\Invitation;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DesignController extends Controller
{
    /**
     * Store a new inactive design draft.
     */
    public function store(
        CreateDesignRequest $request,
        Invitation $invitation,
        CreateDesign $createDesign,
    ): RedirectResponse {
        $createDesign->handle($invitation, $request->validated('name'));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Design created.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }

    /**
     * Rename a design draft.
     */
    public function update(
        RenameDesignRequest $request,
        Invitation $invitation,
        Design $design,
    ): RedirectResponse {
        $design->update(['name' => $request->validated('name')]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Design renamed.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }

    /**
     * Validate and save the active design document.
     */
    public function updateDocument(
        SaveDesignDocumentRequest $request,
        Invitation $invitation,
        Design $design,
        SaveDesignDocument $saveDesignDocument,
    ): RedirectResponse {
        /** @var array<string, mixed> $document */
        $document = $request->validated('document');
        $saveDesignDocument->handle($design, $document);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Design saved.'),
        ]);

        return to_route('vowly.invitations.designs.editor', [$invitation, $design]);
    }

    /**
     * Make a design the invitation's active design.
     */
    public function activate(
        Invitation $invitation,
        Design $design,
        SwitchDesign $switchDesign,
    ): RedirectResponse {
        Gate::authorize('activate', $design);

        try {
            $switchDesign->handle($invitation, $design);
        } catch (DomainException $exception) {
            return back()->withErrors(['design' => $exception->getMessage()]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Active design switched.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }

    /**
     * Archive a design draft.
     */
    public function archive(
        Invitation $invitation,
        Design $design,
        ArchiveDesign $archiveDesign,
    ): RedirectResponse {
        Gate::authorize('archive', $design);

        try {
            $archiveDesign->handle($invitation, $design);
        } catch (DomainException $exception) {
            return back()->withErrors(['design' => $exception->getMessage()]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Design archived.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }

    /**
     * Restore an archived design as an inactive draft.
     */
    public function restore(
        Invitation $invitation,
        Design $design,
        RestoreDesign $restoreDesign,
    ): RedirectResponse {
        Gate::authorize('restore', $design);

        $restoreDesign->handle($design);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Design restored.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }

    /**
     * Delete an inactive design draft.
     */
    public function destroy(
        Invitation $invitation,
        Design $design,
        DeleteDesign $deleteDesign,
    ): RedirectResponse {
        Gate::authorize('delete', $design);

        $deleteDesign->handle($design);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Design deleted.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }
}
