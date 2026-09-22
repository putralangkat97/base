<?php

use App\Models\Design;
use App\Models\Invitation;
use App\Models\User;
use App\Support\Vowly\DesignDocumentSchema;

test('button destinations must use valid HTTP or HTTPS URLs', function (string $href) {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $document = vowlyButtonDocument();
    $document['sections'][0]['containers'][0]['blocks'][1]['href'] = $href;

    $response = $this->actingAs($user)->patch(
        route('vowly.invitations.designs.document.update', [$invitation, $design]),
        ['document' => $document],
    );

    $response->assertSessionHasErrors('document');
    expect($design->fresh()->document['sections'])->toBeEmpty();
})->with([
    'javascript scheme' => 'javascript:alert(1)',
    'data scheme' => 'data:text/html,<script>alert(1)</script>',
    'fragment destination' => '#details',
    'missing host' => 'https:///broken',
]);

test('button destinations preserve valid HTTPS URLs', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $document = vowlyButtonDocument();

    $this->actingAs($user)
        ->patch(route('vowly.invitations.designs.document.update', [$invitation, $design]), [
            'document' => $document,
        ])
        ->assertRedirect();

    expect($design->fresh()->document['sections'][0]['containers'][0]['blocks'][1]['href'])
        ->toBe('https://example.com/details');
});

/**
 * @return array<string, mixed>
 */
function vowlyButtonDocument(): array
{
    $document = DesignDocumentSchema::empty();
    $document['sections'] = [[
        'id' => 'section-button',
        'type' => 'section',
        'label' => 'Button section',
        'containers' => [[
            'id' => 'container-button',
            'type' => 'container',
            'label' => 'Button content',
            'grid' => [
                'id' => 'grid-button',
                'type' => 'grid',
                'columns' => 1,
                'gap' => 'md',
                'stackAt' => 'mobile',
            ],
            'blocks' => [
                [
                    'id' => 'block-copy',
                    'type' => 'text',
                    'label' => 'Copy',
                    'content' => 'Read more',
                    'align' => 'left',
                ],
                [
                    'id' => 'block-button',
                    'type' => 'button',
                    'label' => 'Read more',
                    'text' => 'Read more',
                    'href' => 'https://example.com/details',
                ],
            ],
        ]],
    ]];

    return $document;
}
