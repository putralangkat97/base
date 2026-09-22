# 08: Complete editor foundation integration and accessibility pass

**What to build:** A coherent Owner journey from Invitation creation through Design editing, saving, image usage, Button configuration, Grid layout, and private Preview.

**Blocked by:** 02: Create Invitation and Design lifecycle; 03: Persist and validate the Design document; 04: Build the Variant A production editor with Text blocks; 05: Add Image blocks and private media; 06: Add Button blocks; 07: Add Grid layouts and private responsive Preview.

**Status:** resolved

### Integration requirements

- Invitation workspace opens the correct active Design.
- Switching active Designs changes the editor target.
- Returning from Preview preserves the correct Design context.
- Archived Designs cannot be edited accidentally.
- Save failures do not create misleading success states.
- Team membership Invitations do not appear in the Vowly workspace.
- Error and empty states are consistent across the flow.

### UI quality requirements

- Use consistent spacing, typography, borders, radius, and surface hierarchy.
- Prefer existing shadcn/ui components over one-off controls.
- Support light and dark mode.
- Support narrow, medium, and wide layouts without page overflow.
- Provide visible focus states.
- Give icon-only controls accessible names.
- Do not make critical interaction depend on hover alone.

### Code quality requirements

- Follow existing PHP typing, Form Request, Policy, Action, and Pest conventions.
- Follow existing React page and component conventions.
- Keep document logic independent from visual layout components.
- Avoid speculative abstractions and new dependencies.
- Run existing type, formatting, static-analysis, and test checks.

- [x] A fresh Owner can complete the full foundation workflow without manual database changes.
- [x] Cross-owner authorization is enforced across Invitations, Designs, Documents, Preview, and Media.
- [x] The full flow works in light and dark mode.
- [x] Keyboard users can complete the core editing actions.
- [x] Existing authentication, settings, Teams, and dashboard tests remain green.
- [x] The foundation remains compatible with later Forms, Animation, Music, and publication work.

## Comments

- Resolved through the completed editor, media, Button, Grid, and private Preview implementation.

## Answer

- Completed the Owner workflow from Invitation/Design lifecycle through editing, explicit saving, private media, Buttons, responsive Grid layout, and saved Preview.
- Kept publication, payment, Forms, animation, and music outside this MVP foundation while preserving the versioned document contract for later tickets.
