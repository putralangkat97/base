# 07: Add Grid layouts and private responsive Preview

**What to build:** An Owner can structure content into responsive Grids and inspect the saved Design privately.

**Blocked by:** 03: Persist and validate the Design document; 04: Build the Variant A production editor with Text blocks.

**Status:** resolved

### Grid behavior

- A Container can use stack or Grid layout.
- Grid supports one, two, and three columns.
- Gap uses bounded design tokens.
- Columns stack on mobile.
- Invalid Grid nesting is rejected.
- Arbitrary CSS values and pixel coordinates are not supported.

### Preview behavior

- Preview is authenticated and Owner-only.
- Preview is read-only.
- Preview consumes the same saved Design document as the editor.
- Viewport controls support mobile, tablet, and desktop.
- Preview uses a centered device/frame presentation without exposing unfinished public URLs.
- Unsaved edits are clearly distinguished from saved Preview content.

### UI requirements

- Grid settings appear in the right properties panel.
- Responsive behavior is visible in the central Canvas.
- Breakpoint controls use accessible toggle or button semantics.
- Preview has a clear return-to-editor action.
- Application surfaces support light and dark mode without changing Invitation content semantics.

- [x] Grid presets render correctly at all supported viewports.
- [x] Grid columns stack predictably on mobile.
- [x] Preview never renders unsaved document changes.
- [x] Unauthorized Users cannot access Preview.
- [x] Editor and Preview use the same document contract.
- [x] Feature tests cover Preview authorization and saved-document behavior.

## Comments

- Claimed for implementation alongside the editor canvas so Preview can consume the same document contract.

## Answer

- Added bounded stack/grid layout settings, one-to-three column presets, design-token gaps, and breakpoint-aware stacking in the Canvas.
- Added authenticated, read-only Preview consuming the persisted Design document and private media only, with mobile/tablet/desktop frame controls and a return-to-editor action.
- Added Preview authorization and saved-document feature coverage.
