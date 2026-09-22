<?php

use App\Models\Design;
use App\Models\Invitation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('owners can save and load a valid versioned design document', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $document = vowlyDocumentFixture();

    $response = $this->actingAs($user)->patch(
        route('vowly.invitations.designs.document.update', [$invitation, $design]),
        ['document' => $document],
    );

    $response->assertRedirect(route('vowly.invitations.designs.editor', [$invitation, $design]));
    expect($design->fresh()->document)->toEqual($document);

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.editor', [$invitation, $design]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/editor')
            ->where('invitation.activeDesign.document', $document)
        );
});

test('owners can save an empty design document', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $document = [
        'schemaVersion' => 1,
        'responsive' => [
            'mode' => 'single-document',
            'breakpoints' => ['mobile', 'tablet', 'desktop'],
        ],
        'sections' => [],
    ];

    $this->actingAs($user)
        ->patch(route('vowly.invitations.designs.document.update', [$invitation, $design]), [
            'document' => $document,
        ])
        ->assertRedirect();

    expect($design->fresh()->document)->toEqual($document);
});

test('unsupported document nodes are rejected without changing the saved document', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $original = vowlyDocumentFixture();
    $design = Design::factory()->for($invitation)->active()->create(['document' => $original]);
    $invalid = $original;
    $invalid['sections'][0]['containers'][0]['blocks'][0]['type'] = 'video';

    $response = $this->actingAs($user)->patch(
        route('vowly.invitations.designs.document.update', [$invitation, $design]),
        ['document' => $invalid],
    );

    $response->assertSessionHasErrors('document');
    expect($design->fresh()->document)->toEqual($original);
});

test('invalid nesting is rejected by the document boundary', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $invalid = vowlyDocumentFixture();
    $invalid['sections'][0]['containers'][0]['blocks'] = [
        [
            'id' => 'nested-container',
            'type' => 'container',
            'label' => 'Invalid nested container',
            'grid' => $invalid['sections'][0]['containers'][0]['grid'],
            'blocks' => [],
        ],
    ];

    $this->actingAs($user)
        ->patch(route('vowly.invitations.designs.document.update', [$invitation, $design]), [
            'document' => $invalid,
        ])
        ->assertSessionHasErrors('document');

    expect($design->fresh()->document)->toEqual([
        'schemaVersion' => 1,
        'responsive' => [
            'mode' => 'single-document',
            'breakpoints' => ['mobile', 'tablet', 'desktop'],
        ],
        'sections' => [],
    ]);
});

test('stable identifiers and ordering survive a valid document save', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $document = vowlyDocumentFixture();
    $reordered = $document;
    $reordered['sections'] = array_reverse($reordered['sections']);
    $reordered['sections'][1]['containers'][0]['blocks'] = array_reverse(
        $reordered['sections'][1]['containers'][0]['blocks'],
    );
    $reordered['sections'][1]['containers'][0]['blocks'][1]['content'] = 'Updated copy';

    $this->actingAs($user)
        ->patch(route('vowly.invitations.designs.document.update', [$invitation, $design]), [
            'document' => $reordered,
        ])
        ->assertRedirect();

    expect($design->fresh()->document)->toEqual($reordered)
        ->and($design->fresh()->document['sections'][0]['id'])->toBe('section-details')
        ->and($design->fresh()->document['sections'][1]['containers'][0]['blocks'][1]['id'])
        ->toBe('block-welcome-copy');
});

test('another owner cannot save a design document', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $invitation = Invitation::factory()->for($owner)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $this->actingAs($otherUser)
        ->patch(route('vowly.invitations.designs.document.update', [$invitation, $design]), [
            'document' => vowlyDocumentFixture(),
        ])
        ->assertForbidden();

    expect($design->fresh()->document)->toEqual([
        'schemaVersion' => 1,
        'responsive' => [
            'mode' => 'single-document',
            'breakpoints' => ['mobile', 'tablet', 'desktop'],
        ],
        'sections' => [],
    ]);
});

test('inactive designs cannot receive saved documents', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    Design::factory()->for($invitation)->active()->create();
    $design = Design::factory()->for($invitation)->create();

    $this->actingAs($user)
        ->patch(route('vowly.invitations.designs.document.update', [$invitation, $design]), [
            'document' => vowlyDocumentFixture(),
        ])
        ->assertForbidden();

    expect($design->fresh()->document)->toEqual([
        'schemaVersion' => 1,
        'responsive' => [
            'mode' => 'single-document',
            'breakpoints' => ['mobile', 'tablet', 'desktop'],
        ],
        'sections' => [],
    ]);
});

/**
 * @return array<string, mixed>
 */
function vowlyDocumentFixture(): array
{
    return [
        'schemaVersion' => 1,
        'responsive' => [
            'mode' => 'single-document',
            'breakpoints' => ['mobile', 'tablet', 'desktop'],
        ],
        'sections' => [
            [
                'id' => 'section-welcome',
                'type' => 'section',
                'label' => 'Welcome',
                'containers' => [
                    [
                        'id' => 'container-welcome',
                        'type' => 'container',
                        'label' => 'Welcome content',
                        'grid' => [
                            'id' => 'grid-welcome',
                            'type' => 'grid',
                            'columns' => 1,
                            'gap' => 'md',
                            'stackAt' => 'mobile',
                        ],
                        'blocks' => [
                            [
                                'id' => 'block-welcome-copy',
                                'type' => 'text',
                                'label' => 'Welcome copy',
                                'content' => 'Welcome to our invitation.',
                                'align' => 'center',
                            ],
                            [
                                'id' => 'block-welcome-button',
                                'type' => 'button',
                                'label' => 'Open details',
                                'text' => 'See details',
                                'href' => 'https://example.com/details',
                            ],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'section-details',
                'type' => 'section',
                'label' => 'Details',
                'containers' => [
                    [
                        'id' => 'container-details',
                        'type' => 'container',
                        'label' => 'Details content',
                        'grid' => [
                            'id' => 'grid-details',
                            'type' => 'grid',
                            'columns' => 2,
                            'gap' => 'lg',
                            'stackAt' => 'tablet',
                        ],
                        'blocks' => [
                            [
                                'id' => 'block-details-image',
                                'type' => 'image',
                                'label' => 'Couple photo',
                                'mediaId' => 'media-couple-1',
                                'alt' => 'A photo of the couple.',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ];
}
