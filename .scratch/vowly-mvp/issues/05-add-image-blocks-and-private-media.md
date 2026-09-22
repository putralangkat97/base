# 05: Add Image blocks and private media

**What to build:** An Owner can upload and use private project-owned images in the editor.

**Blocked by:** 04: Build the Variant A production editor with Text blocks.

**Status:** resolved

### UI requirements

- Add Image from the block palette.
- Provide file selection in the properties panel.
- Show idle, uploading, success, and failure states.
- Show a successful image preview.
- Allow the Owner to replace the selected image.
- Show actionable feedback for invalid files.
- Render a non-destructive fallback when media is unavailable.

### Security and media behavior

- Store uploads privately.
- Use generated storage identifiers.
- Do not expose original filenames as storage paths.
- Validate content signature, MIME type, extension, file size, and dimensions.
- Check authenticated Owner access during media delivery.
- Deny retrieval by another User.

### Coding-style constraints

- Follow existing request-validation and filesystem conventions.
- Keep upload authorization separate from document validation.
- Use typed route helpers in React.
- Do not introduce public media URLs in this phase.
- Reuse existing loading, alert, and error UI patterns.

- [x] Valid images can be uploaded and attached to an Image block.
- [x] Unsupported, oversized, and malformed files are rejected.
- [x] Cross-owner media access is denied.
- [x] Removing or replacing an Image block does not corrupt the Design document.
- [x] Feature tests cover upload validation and authorization.
- [x] Slow and failed uploads do not lose the rest of the Design.

## Comments

- Claimed for implementation after the production editor foundation was started.

## Answer

- Added private Design media storage with generated paths, metadata, owner authorization, authenticated streaming, and image upload validation for signature/MIME/extension/size/dimensions.
- Added Image block properties, private preview fallback, upload progress/error feedback, and media selection in the editor.
- Added coverage for valid uploads, unsupported/malformed/oversized files, cross-owner upload/retrieval denial, and persisted media metadata.
