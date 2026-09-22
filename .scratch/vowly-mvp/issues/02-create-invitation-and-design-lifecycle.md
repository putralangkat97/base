# 02: Create Invitation and Design lifecycle

**What to build:** An Owner can manage Invitations and named Design drafts without using the generated Teams feature. This slice provides the ownership and lifecycle foundation required by the editor.

**Blocked by:** None (can start immediately).

**Status:** resolved

### Domain behavior

- An Owner can create multiple Invitations.
- A new Invitation receives one active “Untitled design”.
- Design names are unique within an Invitation.
- The Owner can create, rename, switch, archive, restore, and delete Designs.
- Only inactive Designs can be deleted.
- Exactly one Design is active at a time.
- Another User cannot view or mutate the Invitation or its Designs.

### UI requirements

- Provide a Vowly Invitation workspace separate from Teams.
- Show an Invitation list with a clear empty state.
- Show each Design’s name, active state, archived state, and last-updated state.
- Provide confirmation UI for archive and delete actions.
- Disable or prevent deletion of the active Design with a clear explanation.
- Reuse existing Card, Badge, Button, Dialog, Input, and Label conventions.

### Implementation constraints

- Use typed Laravel models and relationships.
- Use Policy authorization for Owner access.
- Use Form Requests for create and rename operations.
- Use Action classes for multi-step lifecycle mutations.
- Use transactions when switching or archiving affects multiple Design records.
- Keep Team membership out of the authorization path.
- Match existing Pest feature-test conventions.

- [x] Owner CRUD and Design lifecycle behavior works end to end.
- [x] Active Design invariants are enforced server-side.
- [x] Archived Designs do not appear as normal active choices.
- [x] Cross-owner access uses the application’s standard authorization behavior.
- [x] Inertia page props are explicitly shaped and feature-tested.
- [x] Existing Teams behavior remains unaffected.

## Comments

- Claimed for implementation as the next unblocked Vowly ticket.

## Answer

- Implemented the Vowly Invitation workspace at `/vowly/invitations`, separate from the starter-kit Teams surface.
- Added owned Invitations, named Design drafts, active-design switching, archive/restore/delete lifecycle actions, server-side policies, unique naming validation, and transaction-backed active-state changes.
- Added explicit Inertia props and React UI for empty state, invitation list, design status, rename/create dialogs, and archive/delete confirmations.
- Added feature coverage for authentication, ownership, validation, lifecycle transitions, active-design invariants, and shaped page props.
- Verified with 104 Pest tests, PHPStan, Pint, frontend checks, TypeScript, and production build.
