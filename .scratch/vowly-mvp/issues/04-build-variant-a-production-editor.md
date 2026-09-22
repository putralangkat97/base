# 04: Build the Variant A production editor with Text blocks

**What to build:** An Owner can edit a real Design through the selected three-pane production editor.

**Blocked by:** 01: Validate Variant A editor prototype; 03: Persist and validate the Design document.

**Status:** resolved

### UI structure

- Header contains Invitation name, active Design selector, Save action, Save status, and private Preview action.
- Left panel contains the document outline, Section controls, and block palette.
- Center panel contains the structured Invitation Canvas, Section and Container boundaries, selected-node highlight, and empty-state guidance.
- Right panel contains the selected-node heading, context-specific properties, validation messages, remove action, and duplicate action.

### Editor behavior

- Add, select, edit, duplicate, remove, and reorder Sections.
- Add and edit Containers.
- Add, edit, duplicate, remove, and reorder Text blocks.
- Preserve selection after safe edits.
- Show clear feedback when an action is invalid.
- Provide keyboard alternatives for reorder and deletion.
- Do not support pixel coordinates or drag-anywhere positioning.

### Coding-style constraints

- Keep page orchestration separate from editor subcomponents.
- Use typed document models and discriminated block kinds.
- Keep event handlers thin and document mutations in typed command/reducer functions.
- Reuse existing UI primitives rather than creating a parallel component system.
- Use Tailwind theme classes for surfaces, borders, foreground, muted, accent, and destructive states.
- Include dark-mode variants for new surfaces.
- Use gap utilities for sibling spacing.
- Use Lucide icons with accessible labels and tooltips.
- Avoid any types, index-based React keys, hard-coded URLs, and arbitrary color values.

- [x] The real editor loads the active saved Design.
- [x] Text editing updates the Canvas immediately.
- [x] Add, edit, remove, and reorder actions preserve document validity.
- [x] Explicit Save works through Laravel.
- [x] Save errors remain visible without losing edits.
- [x] The editor supports keyboard navigation and visible focus.
- [x] Narrow screens do not create page-level horizontal overflow.

## Comments

- Claimed for implementation after Design document persistence was resolved.

## Answer

- Added the authenticated three-pane editor at the active Design route.
- Added typed document state and reducer commands for sections, containers, grids, and blocks with selection, duplication, removal, and keyboard-accessible reordering controls.
- Added immediate Canvas rendering, responsive viewport controls, explicit Save state feedback, validation error retention, and the private Preview entry point.
- Added responsive/dark-mode-aware surfaces and Wayfinder route usage throughout the editor.
