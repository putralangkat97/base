# 06: Add Button blocks

**What to build:** An Owner can add and configure safe Button blocks in the Design.

**Blocked by:** 04: Build the Variant A production editor with Text blocks.

**Status:** resolved

### UI requirements

- Button appears in the block palette.
- Properties panel contains Button label and destination fields.
- Show a live visual Button preview.
- Show inline feedback for empty or invalid values.
- Button preview looks interactive but does not perform production navigation yet.

### Validation contract

- Label is required and bounded in length.
- Destination must be an approved HTTP(S) URL.
- Reject javascript:, data:, arbitrary HTML, and script-like values.
- Internal Invitation actions remain deferred until public routing exists.

### Coding-style constraints

- Share block-property form conventions with Text and Image.
- Keep URL validation on the server and mirror basic feedback in React.
- Reuse existing Input, Label, InputError, and Button components.
- Do not hard-code navigation paths in the editor.

- [x] Owner can add, edit, duplicate, remove, and reorder Button blocks.
- [x] Valid labels and destinations persist.
- [x] Invalid destinations cannot be saved.
- [x] Validation errors identify the affected Button block.
- [x] Button behavior is covered by focused feature tests.

## Comments

- Claimed for implementation after the production editor foundation was started.

## Answer

- Added Button block creation and properties editing in the reducer-driven editor.
- Added server-side HTTP(S)-only destination validation rejecting script/data/fragment destinations, with path-aware validation messages and client-side URL feedback.
- Added focused valid and invalid destination feature coverage.
