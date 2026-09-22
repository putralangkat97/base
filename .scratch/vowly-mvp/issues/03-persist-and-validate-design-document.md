# 03: Persist and validate the Design document

**What to build:** The active Design stores a validated, versioned JSON document that can be explicitly saved and later rendered by the editor and Preview.

**Blocked by:** 02: Create Invitation and Design lifecycle.

**Status:** resolved

### Document contract

- Include a schema version.
- Use stable IDs for Sections, Containers, Grids, and blocks.
- Preserve ordered children.
- Allow only supported node types.
- Enforce allowed parent and child relationships.
- Store Text, Image, Button, and Grid properties in typed structures.
- Use one responsive structure rather than separate documents per breakpoint.

### Save behavior

- Saving is explicit; autosave is not included.
- Save accepts the active Design document.
- Laravel is the canonical validator.
- React mirrors validation for immediate feedback.
- Successful save returns the persisted document state.
- Failed save returns validation errors without erasing in-memory edits.
- The UI distinguishes clean, unsaved, saving, saved, and failed states.

### Implementation constraints

- Keep document validation behind one clear application boundary.
- Do not scatter node-shape checks across controllers and React components.
- Use typed Wayfinder helpers when React calls Laravel routes.
- Do not introduce a repository layer unless existing project patterns require it.
- Persist JSON through the Design model using established Eloquent conventions.

- [x] A valid document can be created, saved, loaded, and rendered back.
- [x] Invalid nesting and unsupported nodes are rejected.
- [x] Stable IDs survive reordering and editing.
- [x] Save authorization is scoped to the owning User.
- [x] Save failures preserve the client’s current state.
- [x] Pest tests cover valid, invalid, unauthorized, and empty-document cases.

## Comments

- Claimed for implementation as the next unblocked Vowly ticket.

## Answer

- Added the versioned Design document JSON column, canonical empty document defaults, and migration backfill.
- Added one strict `DesignDocumentSchema` boundary plus a Laravel validation rule for supported nodes, nesting, typed properties, stable IDs, ordering, and responsive settings.
- Added an active-owner-only document save endpoint and returned the persisted active document through the invitation workspace props.
- Added Pest coverage for valid, empty, invalid, reordered, unauthorized, and inactive-design saves.
- Verification: `php artisan test --compact` (111 tests, 424 assertions), PHPStan, Pint, `bun run check`, `bun run types:check`, and `bun run build` passed.
