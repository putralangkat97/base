<?php

use App\Models\Design;
use App\Models\Invitation;
use App\Models\User;
use App\Support\Vowly\DesignDocumentSchema;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('owners can open the active editor with the saved design document', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.editor', [$invitation, $design]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/editor')
            ->where('invitation.activeDesign.id', $design->id)
            ->where('invitation.activeDesign.document', $design->document)
        );
});

test('another owner cannot open an editor or preview', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $invitation = Invitation::factory()->for($owner)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $this->actingAs($otherUser)
        ->get(route('vowly.invitations.designs.editor', [$invitation, $design]))
        ->assertForbidden();

    $this->actingAs($otherUser)
        ->get(route('vowly.invitations.designs.preview', [$invitation, $design]))
        ->assertForbidden();
});

test('inactive and archived designs cannot open editor or preview', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $activeDesign = Design::factory()->for($invitation)->active()->create();
    $inactiveDesign = Design::factory()->for($invitation)->create();
    $archivedDesign = Design::factory()->for($invitation)->archived()->create();

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.editor', [$invitation, $inactiveDesign]))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.preview', [$invitation, $inactiveDesign]))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.editor', [$invitation, $archivedDesign]))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.preview', [$invitation, $archivedDesign]))
        ->assertForbidden();

    expect($activeDesign->fresh()->is_active)->toBeTrue();
});

test('preview renders the persisted document and not a local editor draft', function () {
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $document = DesignDocumentSchema::empty();
    $design = Design::factory()->for($invitation)->active()->create(['document' => $document]);

    $this->actingAs($user)
        ->get(route('vowly.invitations.designs.preview', [$invitation, $design]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/preview')
            ->where('invitation.activeDesign.document', $document)
        );
});

test('owners can upload valid images to private storage', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $photo = UploadedFile::fake()->image('couple.png', 1200, 800);

    $response = $this->actingAs($user)->post(
        route('vowly.invitations.designs.media.store', [$invitation, $design]),
        ['photo' => $photo],
    );

    $response->assertRedirect(route('vowly.invitations.designs.editor', [$invitation, $design]));
    $media = $design->media()->firstOrFail();

    expect($media->path)
        ->toStartWith('designs/'.$design->id.'/')
        ->and($media->path)
        ->not->toContain('couple.png')
        ->and($media->width)->toBe(1200)
        ->and($media->height)->toBe(800);

    Storage::disk('local')->assertExists($media->path);
});

test('unsupported and malformed images are rejected', function (string $name, string $mime) {
    Storage::fake('local');
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();

    $this->actingAs($user)
        ->post(route('vowly.invitations.designs.media.store', [$invitation, $design]), [
            'photo' => UploadedFile::fake()->create($name, 100, $mime),
        ])
        ->assertSessionHasErrors('photo');

    expect($design->media()->count())->toBe(0);
})->with([
    'unsupported gif' => ['image.gif', 'image/gif'],
    'malformed png' => ['image.png', 'text/plain'],
]);

test('oversized images are rejected before storage', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $invitation = Invitation::factory()->for($user)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $photo = UploadedFile::fake()->image('large.png', 100, 100)->size(10241);

    $this->actingAs($user)
        ->post(route('vowly.invitations.designs.media.store', [$invitation, $design]), [
            'photo' => $photo,
        ])
        ->assertSessionHasErrors('photo');

    expect($design->media()->count())->toBe(0);
});

test('another owner cannot upload or retrieve private media', function () {
    Storage::fake('local');
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $invitation = Invitation::factory()->for($owner)->create();
    $design = Design::factory()->for($invitation)->active()->create();
    $media = $design->media()->create([
        'disk' => 'local',
        'path' => 'designs/'.$design->id.'/private.png',
        'mime_type' => 'image/png',
        'size' => 4,
        'width' => 1,
        'height' => 1,
    ]);
    Storage::disk('local')->put($media->path, 'test');

    $this->actingAs($otherUser)
        ->post(route('vowly.invitations.designs.media.store', [$invitation, $design]), [
            'photo' => UploadedFile::fake()->image('other.png'),
        ])
        ->assertForbidden();

    $this->actingAs($otherUser)
        ->get(route('vowly.invitations.designs.media.show', [$invitation, $design, $media]))
        ->assertForbidden();
});
