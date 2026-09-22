<?php

use App\Models\Design;
use App\Models\Invitation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the invitation workspace', function () {
    $this->get(route('vowly.invitations.index'))
        ->assertRedirect(route('login'));
});

test('the invitation workspace renders an explicit empty state prop', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('vowly.invitations.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/index')
            ->where('invitations', [])
        );
});

test('owners can create an invitation with an active untitled design', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('vowly.invitations.store'), [
        'name' => 'Raka and Aulia',
    ]);

    $invitation = Invitation::query()->where('name', 'Raka and Aulia')->firstOrFail();
    $design = $invitation->designs()->firstOrFail();

    $response->assertRedirect(route('vowly.invitations.show', $invitation));
    expect($design->name)->toBe('Untitled design')
        ->and($design->is_active)->toBeTrue()
        ->and($design->archived_at)->toBeNull();
});

test('owners can see their invitations and designs in shaped Inertia props', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create(['name' => 'Our wedding']);
    $design = Design::factory()->for($invitation)->active()->create(['name' => 'Classic']);

    $this->actingAs($user)
        ->get(route('vowly.invitations.show', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/show')
            ->where('invitation.id', $invitation->id)
            ->where('invitation.name', 'Our wedding')
            ->where('invitation.activeDesignId', $design->id)
            ->where('invitation.designs.0.name', 'Classic')
            ->where('invitation.designs.0.isActive', true)
        );
});

test('another owner cannot view or mutate an invitation', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $invitation = Invitation::factory()->for($owner)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $this->actingAs($otherUser)
        ->get(route('vowly.invitations.show', $invitation))
        ->assertForbidden();

    $this->actingAs($otherUser)
        ->post(route('vowly.invitations.designs.store', $invitation), [
            'name' => 'Private copy',
        ])
        ->assertForbidden();

    $this->actingAs($otherUser)
        ->post(route('vowly.invitations.designs.switch', [$invitation, $design]))
        ->assertForbidden();
});

test('design names must be unique within an invitation', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    Design::factory()->for($invitation)->active()->create(['name' => 'Classic']);

    $createResponse = $this->actingAs($user)->post(route('vowly.invitations.designs.store', $invitation), [
        'name' => 'Classic',
    ]);

    $createResponse->assertSessionHasErrors('name');

    $otherDesign = Design::factory()->for($invitation)->create(['name' => 'Minimal']);

    $renameResponse = $this->actingAs($user)->patch(
        route('vowly.invitations.designs.update', [$invitation, $otherDesign]),
        ['name' => 'Classic'],
    );

    $renameResponse->assertSessionHasErrors('name');
    expect($otherDesign->fresh()->name)->toBe('Minimal');
});

test('owners can create and rename inactive designs', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    Design::factory()->for($invitation)->active()->create(['name' => 'Classic']);

    $createResponse = $this->actingAs($user)->post(route('vowly.invitations.designs.store', $invitation), [
        'name' => 'Minimal',
    ]);
    $design = $invitation->designs()->where('name', 'Minimal')->firstOrFail();

    $createResponse->assertRedirect(route('vowly.invitations.show', $invitation));
    expect($design->is_active)->toBeFalse();

    $renameResponse = $this->actingAs($user)->patch(
        route('vowly.invitations.designs.update', [$invitation, $design]),
        ['name' => 'Editorial'],
    );

    $renameResponse->assertRedirect();
    expect($design->fresh()->name)->toBe('Editorial');
});

test('switching designs leaves exactly one active design', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $activeDesign = Design::factory()->for($invitation)->active()->create(['name' => 'Classic']);
    $nextDesign = Design::factory()->for($invitation)->create(['name' => 'Minimal']);

    $response = $this->actingAs($user)->post(
        route('vowly.invitations.designs.switch', [$invitation, $nextDesign]),
    );

    $response->assertRedirect();
    expect($activeDesign->fresh()->is_active)->toBeFalse()
        ->and($nextDesign->fresh()->is_active)->toBeTrue()
        ->and($invitation->designs()->where('is_active', true)->count())->toBe(1);
});

test('archiving the active design activates another available design', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $activeDesign = Design::factory()->for($invitation)->active()->create(['name' => 'Classic']);
    $replacement = Design::factory()->for($invitation)->create(['name' => 'Minimal']);

    $response = $this->actingAs($user)->post(
        route('vowly.invitations.designs.archive', [$invitation, $activeDesign]),
    );

    $response->assertRedirect();
    expect($activeDesign->fresh()->is_active)->toBeFalse()
        ->and($activeDesign->fresh()->archived_at)->not->toBeNull()
        ->and($replacement->fresh()->is_active)->toBeTrue();
});

test('the only active design cannot be archived', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $response = $this->actingAs($user)->post(
        route('vowly.invitations.designs.archive', [$invitation, $design]),
    );

    $response->assertSessionHasErrors('design');
    expect($design->fresh()->is_active)->toBeTrue()
        ->and($design->fresh()->archived_at)->toBeNull();
});

test('owners can restore archived designs and delete inactive designs', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    Design::factory()->for($invitation)->active()->create(['name' => 'Classic']);
    $archivedDesign = Design::factory()->for($invitation)->archived()->create(['name' => 'Archive']);
    $inactiveDesign = Design::factory()->for($invitation)->create(['name' => 'Remove me']);

    $restoreResponse = $this->actingAs($user)->post(
        route('vowly.invitations.designs.restore', [$invitation, $archivedDesign]),
    );

    $restoreResponse->assertRedirect();
    expect($archivedDesign->fresh()->archived_at)->toBeNull()
        ->and($archivedDesign->fresh()->is_active)->toBeFalse();

    $deleteResponse = $this->actingAs($user)->delete(
        route('vowly.invitations.designs.destroy', [$invitation, $inactiveDesign]),
    );

    $deleteResponse->assertRedirect();
    expect(Design::query()->find($inactiveDesign->id))->toBeNull();
});

test('the active design cannot be deleted', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $this->actingAs($user)
        ->delete(route('vowly.invitations.designs.destroy', [$invitation, $design]))
        ->assertForbidden();

    expect(Design::query()->find($design->id))->not->toBeNull();
});
