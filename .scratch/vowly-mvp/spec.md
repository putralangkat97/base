Status: ready-for-agent

# Vowly MVP Foundation — Structured Invitation Editor

## Problem Statement

Vowly is intended to help couples in Indonesia create polished wedding Invitations without hiring a designer or assembling a website from generic tools. The current Laravel foundation provides authentication and a starter dashboard, but it does not yet provide the product's core experience: visually composing an Invitation from Sections, Containers, Grid layouts, and Content blocks.

The first MVP foundation must validate whether Owners can understand and use a structured visual editor. It should feel direct and design-oriented, while keeping the document responsive, accessible, safe, and simple enough to evolve.

This phase does not attempt to ship the complete public Invitation product. Payment, public publication, Guest operations, Forms, Animation, Music, and the broader operational model remain later phases.

## Solution

Build the first Vowly product slice as a structured Invitation editor using the initialized Laravel React application.

An Owner creates an Invitation and receives one active default Design. An Invitation may contain multiple named Design drafts, but only one Design is active for private Preview at a time. The Owner edits the active Design through a structured visual Canvas composed of ordered Sections, Containers, and typed Content blocks.

The initial editor supports Text, Image, and Button blocks. The Owner can add, edit, select, duplicate, remove, and reorder supported content through constrained controls. The editor uses one responsive structure and provides mobile, tablet, and desktop Preview breakpoints rather than maintaining separate layouts.

The first selected editor direction is Variant A: a three-pane workspace with a block palette on the left, the Invitation Canvas in the center, and a properties panel on the right. The prototype direction is a UX decision to validate, not production code to preserve unchanged.

The Design is stored as a versioned JSON document. Laravel is the canonical validation and persistence boundary; React mirrors the document rules for immediate editor feedback. The Owner explicitly saves changes. Preview is authenticated and private, and it renders the same validated document contract used by the editor.

## User Stories

### Account and ownership

1. As a new User, I want to register with email and password, so that I can create Invitations.
2. As a User, I want to log in and log out, so that my Invitations and Drafts remain protected.
3. As a User, I want to reset my password, so that I can recover access without support intervention.
4. As an Owner, I want to see only my Invitations, so that another User's designs are not exposed.
5. As an Owner, I want an Invitation to belong to me, so that all of its Designs and media remain scoped to my ownership.
6. As an Owner, I want to use a normal User identity rather than a separate Studio role, so that the first product model stays simple.

### Invitation and Design lifecycle

7. As an Owner, I want to create an Invitation, so that I have a workspace for a wedding design.
8. As an Owner, I want a new Invitation to receive one active default Design, so that I can enter the editor immediately.
9. As an Owner, I want the default Design to start as “Untitled design”, so that I can rename it when I am ready.
10. As an Owner, I want one Invitation to contain multiple named Design drafts, so that I can explore alternatives without losing earlier work.
11. As an Owner, I want to rename a Design, so that I can distinguish alternatives such as “Classic” and “Minimal”.
12. As an Owner, I want Design names to be unique within one Invitation, so that the Design list is unambiguous.
13. As an Owner, I want exactly one active Design at a time, so that Preview has a clear target.
14. As an Owner, I want to explicitly switch the active Design, so that I control which alternative I am previewing.
15. As an Owner, I want switching Designs to preserve the previous Design unchanged, so that experimentation is safe.
16. As an Owner, I want to delete an inactive Design, so that abandoned alternatives do not clutter my workspace.
17. As an Owner, I want the active Design to be archived instead of deleted, so that Preview never loses its required document.
18. As an Owner, I want archived Designs excluded from normal editing lists, so that the active workspace stays focused.
19. As an Owner, I want to reopen an archived Design when appropriate, so that an earlier direction can be recovered later.

### Structured Canvas

20. As an Owner, I want to open the active Design in a visual editor, so that I can compose the Invitation directly.
21. As an Owner, I want a three-pane editor with a block palette, Canvas, and properties panel, so that creation and editing are visible in one workspace.
22. As an Owner, I want to see the Invitation Canvas while editing, so that I understand the result as I build it.
23. As an Owner, I want to see an outline of Sections and blocks, so that I can navigate a long document without searching visually.
24. As an Owner, I want to select a Section, Container, or block, so that I know which item the next action affects.
25. As an Owner, I want the selected item to be visibly highlighted in the Canvas and outline, so that selection is never ambiguous.
26. As an Owner, I want to add a Section, so that I can extend the Invitation's story.
27. As an Owner, I want each Section to have a stable identity, so that editing and reordering do not lose its content.
28. As an Owner, I want a Section to contain one or more Containers, so that content has a predictable layout boundary.
29. As an Owner, I want to add a Container inside a Section, so that related blocks can be grouped.
30. As an Owner, I want to move a Section up or down with constrained controls, so that document order does not depend on pixel positioning.
31. As an Owner, I want to move a block within its allowed Container, so that I can adjust composition safely.
32. As an Owner, I want to duplicate an eligible Section or block, so that I can reuse a composition quickly.
33. As an Owner, I want to remove a Section or block, so that unwanted content does not remain in the Draft.
34. As an Owner, I want movement and editing controls to have keyboard alternatives, so that the editor is usable without a pointer.
35. As an Owner, I want invalid nesting to be rejected, so that the Design document remains renderable.
36. As an Owner, I want the editor to show a clear empty state, so that I know how to add the first Section or block.

### Initial Content blocks

37. As an Owner, I want to add a Text block, so that I can write Invitation copy.
38. As an Owner, I want to edit Text block content, so that the Canvas reflects my wording.
39. As an Owner, I want line breaks in Text blocks, so that simple copy remains readable without arbitrary markup.
40. As an Owner, I want to add an Image block, so that I can include personal media.
41. As an Owner, I want an Image block to reference an uploaded project-owned image, so that external URLs do not make Preview unreliable.
42. As an Owner, I want to add a Button block, so that visitors will eventually be able to follow an approved link or Invitation action.
43. As an Owner, I want to edit a Button label and destination, so that its purpose is clear.
44. As an Owner, I want block-specific validation feedback, so that incomplete content is visible before saving.
45. As an Owner, I want unsupported block types excluded from the initial palette, so that the first editor has a focused and understandable scope.

### Grid and responsive behavior

46. As an Owner, I want to add a Grid inside an approved Container, so that related blocks can be arranged into columns.
47. As an Owner, I want one-, two-, and three-column Grid presets, so that layout remains predictable.
48. As an Owner, I want to control Grid gap within approved values, so that columns have intentional separation.
49. As an Owner, I want Grid columns to stack on smaller viewports, so that the Invitation remains usable on mobile.
50. As an Owner, I want to preview the same Design at mobile, tablet, and desktop breakpoints, so that I can catch responsive problems.
51. As an Owner, I want one responsive structure rather than separate documents per breakpoint, so that content does not drift between views.
52. As an Owner, I want the editor to show when a Grid will stack, so that responsive behavior is understandable.
53. As an Owner, I want layout values constrained to approved tokens, so that the renderer does not depend on arbitrary custom CSS.

### Draft persistence and Preview

54. As an Owner, I want to edit a Design in memory before saving, so that I can make several related changes together.
55. As an Owner, I want to explicitly save the active Design, so that I control when changes become persisted.
56. As an Owner, I want a visible unsaved and saved state, so that I know whether the latest changes are stored.
57. As an Owner, I want a failed save to leave my current editor state visible, so that a temporary error does not erase my work.
58. As an Owner, I want the Design document to include a schema version, so that future document migrations are explicit.
59. As an Owner, I want Preview to be private and authenticated, so that unfinished content is not publicly exposed.
60. As an Owner, I want Preview to render the same saved Design document as the Canvas, so that what I inspect matches what the renderer receives.
61. As an Owner, I want Preview to support mobile, tablet, and desktop views, so that responsive behavior can be checked before later publication work.
62. As an Owner, I want Preview to remain read-only, so that editing continues through the Canvas rather than creating conflicting state.

### Media and privacy foundation

63. As an Owner, I want to upload supported images for Image blocks, so that the editor works with project-owned media.
64. As an Owner, I want uploaded images stored privately, so that unfinished media is not discoverable through public URLs.
65. As an Owner, I want authorized media delivery to check Invitation ownership, so that another User cannot retrieve my Draft assets.
66. As an Owner, I want invalid or oversized image uploads rejected clearly, so that the editor stays reliable.
67. As an Owner, I want generated media identifiers, so that original filenames do not become security-sensitive public identifiers.

### Product boundaries

68. As an Owner, I want Teams and membership Invitations kept outside the Vowly workspace, so that starter-kit collaboration concepts do not redefine Vowly ownership.
69. As an Owner, I want the editor to avoid payment or hosting prompts, so that I can validate design composition before commercial infrastructure exists.
70. As a future Vowly visitor, I want a later public renderer to consume the same Design document, so that the editor does not need a second content model.

## Implementation Decisions

### Product boundary

- This spec covers the first Vowly MVP foundation: authenticated Invitation ownership, Design lifecycle, structured Canvas editing, explicit Draft saving, private Preview, and the initial block/layout contract.
- The broader product may later add public publishing, Guests, RSVP, Guestbook, Animation, Music, richer styles, and Admin operations. Those features are intentionally not implementation requirements for this phase.
- Payment, Midtrans, Payment records, Hosting entitlements, renewal, refund, chargeback, and payment-gated publication remain future work.
- The customer-facing actor is an Owner using a normal User identity. No Studio role is introduced.
- The first Invitation experience is one page. Multi-page Design documents are deferred.

### Initialized project foundation

- Use the existing Laravel 13 modular monolith and official Laravel React Starter Kit.
- The installed baseline is Laravel Framework 13.33.0 on PHP 8.4.25, PHP 8.4, Inertia Laravel 3.3.4, Inertia React 3.7.1, React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, Vite 8.3.0, Laravel Fortify 1.39.0, Laravel Wayfinder 0.1.21, Pest 5.2.1, Larastan 3.12.2, Pint 1.32.1, and Laravel Boost 2.9.1.
- Keep React, TypeScript, Inertia, Tailwind, shadcn/ui, Radix, Lucide, Vite, Fortify, and Wayfinder as the existing stack. Do not add a second frontend application or dependencies for this phase.
- Existing authentication, email verification, password reset, two-factor authentication, passkeys, profile, security, appearance, Teams, team membership, team membership Invitations, and dashboard code remain starter-kit infrastructure.
- Team and membership Invitation surfaces are isolated from the Vowly workspace and must not define Invitation ownership or permissions. The generated code may remain temporarily for later cleanup.
- Current SQLite/local-storage defaults remain suitable for local development. PostgreSQL, Redis, and object storage are future environment work, not prerequisites for the editor contract.

### Domain and Design lifecycle

- A User may own multiple Invitations.
- An Invitation owns multiple named Design drafts and has exactly one active Design.
- Creating an Invitation creates one active “Untitled design”.
- Design names are unique within their Invitation.
- The Owner may create, rename, switch, and edit Designs.
- Only inactive Designs may be deleted. The active Design is archived rather than deleted; an archived Design may later be restored.
- The Owner is the only editor in this phase. Team membership, shared editing, public edit links, and real-time collaboration are excluded.

### Design document seam

- The highest seam is: editor command → validated versioned Design document → private Preview renderer.
- The Design document is stored as JSON with a schema version and stable identifiers for Sections, Containers, Grid layouts, and Content blocks.
- The document contains ordered Sections, Containers, approved Grid layouts, typed blocks, and bounded responsive settings.
- The initial supported block registry contains Text, Image, and Button. Heading, Quote, Divider, Countdown, Gallery, Couple, Event, Forms, Animation, Music, Gifts, and other blocks are deferred.
- Containers provide layout boundaries. A Grid uses bounded one-, two-, or three-column presets and stacks at smaller viewports.
- Arbitrary pixel coordinates, vector drawing, arbitrary nesting, custom CSS, arbitrary HTML, JavaScript, iframes, embeds, and user-authored animation timelines are not accepted.
- Laravel is the canonical validation and persistence boundary. React mirrors the same document constraints for immediate editor feedback.
- The persisted document contract must be usable by the future public renderer without introducing a second content model.

### Editor interaction and selected direction

- The selected first editor direction is Variant A: a three-pane workspace with a left block palette, central Canvas, and right properties panel.
- The production editor must support selection, insertion, property editing, duplication, removal, and constrained reordering for the initial node types.
- The editor must preserve stable node identities and selection when a safe local edit does not invalidate it.
- Pointer actions that change document order or content require keyboard-accessible alternatives.
- The editor uses one responsive document and provides mobile, tablet, and desktop Preview breakpoints. Separate per-breakpoint documents are not supported.
- The prototype is a temporary UX validation artifact. Production components should be rewritten to follow the application's normal conventions after the layout decision is validated.

### Persistence, Preview, and media

- Draft changes are explicitly saved; autosave is not part of this phase.
- The editor shows unsaved, saving, saved, and failed-save states.
- A failed save must not erase the current in-memory editor state.
- Private Preview requires authentication and Owner access to the Invitation.
- Preview is read-only and uses the saved versioned Design document.
- Image blocks use uploaded project-owned media only; external image URLs are not supported initially.
- Uploaded media is stored privately and delivered only after an Owner authorization check.
- Upload validation covers supported image type, content signature, size, and dimensions. Generated storage identifiers are used instead of original filenames.

### Frontend and backend interfaces

- Use Inertia pages for authenticated editor and Preview navigation.
- Use Wayfinder-generated typed route helpers whenever React calls Laravel routes or controller actions.
- The eventual Save interface accepts the active Design's document and returns the persisted document state or validation errors. It is authorized against the owning User.
- The eventual Preview interface returns only the saved Design document and authorized private media needed by the Owner.
- No public publication endpoint, public Invitation route, payment interface, Guest form endpoint, or Team-based editor endpoint is introduced by this phase.

## Testing Decisions

- Tests assert external behavior at the highest seam and avoid coupling to incidental component structure, CSS class names, or implementation-specific state containers.
- The primary seam is the versioned Design document between editor operations, Laravel validation/persistence, and private Preview rendering.
- Laravel feature tests cover Invitation ownership, Design creation, default active Design, unique naming, active Design switching, inactive deletion, active archive behavior, authorized editing, save validation, and private Preview access.
- Design document tests cover stable identifiers, allowed node nesting, Text/Image/Button properties, Grid constraints, responsive stacking, schema versioning, and invalid document rejection.
- Media tests cover supported image uploads, invalid content, size/dimension limits, generated identifiers, private delivery, and cross-owner denial.
- React tests cover Variant A's visible editor states and user-visible interactions: selection, insertion, editing, duplication, removal, constrained reordering, explicit Save state, and breakpoint Preview switching.
- Accessibility tests cover keyboard alternatives, focus visibility, semantic controls, selected-state announcements where applicable, and readable contrast for the editor shell.
- Existing Pest, Larastan, Pint, TypeScript, and frontend check conventions remain the baseline. No production behavior should be accepted with only a visual snapshot or implementation-detail assertion.
- The throwaway Variant A prototype itself does not require automated tests; it is validated manually before its layout direction is folded into production components.

## Out of Scope

- Public Invitation URLs, publication, unpublishing, immutable Published invitation versions, and public rendering.
- Payment, Midtrans, checkout, Payment records, Hosting entitlements, renewal, refunds, chargebacks, and payment-gated access.
- Forms, RSVP, Guestbook, Guests, Personalized links, Guest imports, exports, and guest notifications.
- Animation presets, Music, audio uploads, autoplay behavior, and reduced-motion animation behavior.
- Templates, template transformations, template marketplace, reusable user-created Sections, and reusable component libraries.
- Rich typography beyond the initial Text block needs, advanced style systems, custom fonts, and arbitrary custom CSS.
- True freeform Figma coordinate placement, vector drawing, pen tools, arbitrary shapes, or graphics editing.
- Real-time collaboration, comments, Team membership editing, public edit links, and presence indicators.
- Admin support access, moderation, audit workflows, analytics, backups, and operational dashboards.
- Custom domains, subdomains, WhatsApp integration, QR check-in, seating plans, and payment collection.

## Further Notes

- The selected Variant A layout is the next UX validation step, not evidence that the production editor is complete.
- The structured document contract is deliberately the most important boundary. It allows the editor, private Preview, and future public renderer to share content without forcing the UI layout into the public domain model.
- The existing ADR for the structured visual Canvas remains applicable. The existing payment-defer decision remains applicable, while public publication itself is now deferred to a later phase rather than implemented in this foundation.
- The next ticket decomposition should proceed in dependency order: Variant A prototype, Invitation/Design ownership, document validation and persistence, editor production shell, initial block registry, responsive Preview, and private media delivery.
