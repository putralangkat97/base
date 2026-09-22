<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\Vowly\DesignController;
use App\Http\Controllers\Vowly\EditorController;
use App\Http\Controllers\Vowly\InvitationController;
use App\Http\Controllers\Vowly\MediaController;
use App\Http\Controllers\Vowly\PreviewController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::inertia('prototype/invitation-editor', 'prototypes/invitation-editor')
        ->name('prototype.invitation-editor');

    Route::prefix('vowly/invitations')
        ->name('vowly.invitations.')
        ->scopeBindings()
        ->group(function () {
            Route::get('/', [InvitationController::class, 'index'])->name('index');
            Route::post('/', [InvitationController::class, 'store'])->name('store');
            Route::get('/{invitation}', [InvitationController::class, 'show'])->name('show');
            Route::get('/{invitation}/designs/{design}/editor', [EditorController::class, 'show'])->name('designs.editor');
            Route::get('/{invitation}/designs/{design}/preview', [PreviewController::class, 'show'])->name('designs.preview');
            Route::post('/{invitation}/designs', [DesignController::class, 'store'])->name('designs.store');
            Route::patch('/{invitation}/designs/{design}', [DesignController::class, 'update'])->name('designs.update');
            Route::patch('/{invitation}/designs/{design}/document', [DesignController::class, 'updateDocument'])->name('designs.document.update');
            Route::post('/{invitation}/designs/{design}/media', [MediaController::class, 'store'])->name('designs.media.store');
            Route::get('/{invitation}/designs/{design}/media/{media}', [MediaController::class, 'show'])->name('designs.media.show');
            Route::post('/{invitation}/designs/{design}/activate', [DesignController::class, 'activate'])->name('designs.switch');
            Route::post('/{invitation}/designs/{design}/archive', [DesignController::class, 'archive'])->name('designs.archive');
            Route::post('/{invitation}/designs/{design}/restore', [DesignController::class, 'restore'])->name('designs.restore');
            Route::delete('/{invitation}/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
        });

    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
