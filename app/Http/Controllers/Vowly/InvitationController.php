<?php

namespace App\Http\Controllers\Vowly;

use App\Actions\Vowly\CreateInvitation;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vowly\CreateInvitationRequest;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    /**
     * Display the user's invitations.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Invitation::class);

        /** @var User $user */
        $user = $request->user();

        $invitations = $user->invitations()
            ->with('designs')
            ->latest('updated_at')
            ->get()
            ->map(fn (Invitation $invitation): array => $this->invitationSummary($invitation))
            ->values()
            ->all();

        return Inertia::render('invitations/index', [
            'invitations' => $invitations,
        ]);
    }

    /**
     * Store a newly created invitation and its default design.
     */
    public function store(CreateInvitationRequest $request, CreateInvitation $createInvitation): RedirectResponse
    {
        $invitation = $createInvitation->handle(
            $request->user(),
            $request->validated('name'),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Invitation created.'),
        ]);

        return to_route('vowly.invitations.show', $invitation);
    }

    /**
     * Display an invitation and its design drafts.
     */
    public function show(Invitation $invitation): Response
    {
        Gate::authorize('view', $invitation);

        $invitation->load([
            'designs' => fn ($query) => $query
                ->orderByDesc('is_active')
                ->orderByRaw('archived_at IS NOT NULL')
                ->orderBy('name'),
        ]);

        return Inertia::render('invitations/show', [
            'invitation' => [
                'id' => $invitation->id,
                'name' => $invitation->name,
                'activeDesignId' => $invitation->designs->firstWhere('is_active', true)?->id,
                'designs' => $invitation->designs
                    ->map(fn ($design): array => [
                        'id' => $design->id,
                        'name' => $design->name,
                        'isActive' => $design->is_active,
                        'isArchived' => $design->archived_at !== null,
                        'updatedAt' => $design->updated_at?->toISOString(),
                    ])
                    ->values()
                    ->all(),
            ],
        ]);
    }

    /**
     * Shape an invitation for the list page.
     *
     * @return array<string, int|string|null>
     */
    private function invitationSummary(Invitation $invitation): array
    {
        $activeDesign = $invitation->designs->firstWhere('is_active', true);

        return [
            'id' => $invitation->id,
            'name' => $invitation->name,
            'designCount' => $invitation->designs->count(),
            'activeDesignName' => $activeDesign?->name,
            'updatedAt' => $invitation->updated_at?->toISOString(),
        ];
    }
}
