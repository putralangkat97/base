Status: ready-for-agent

# Vowly MVP — Visual Invitation Builder

## Problem Statement

Couples in Indonesia need a way to create a polished, personalized wedding Invitation without hiring a designer or assembling a website from generic tools. The current baseline is too close to a constrained content form: it does not capture the intended experience of directly designing an Invitation by adding Sections, arranging Content blocks, managing Grid layouts, applying animation, adding music, and placing forms.

Vowly must validate a focused proposition: an Owner can visually compose and publish a premium, mobile-first wedding Invitation from a controlled component library, while the resulting public page remains responsive, accessible, secure, and easy to operate.

Payment is not part of this MVP. Publication is available without Midtrans, Payment records, or Hosting entitlements. Commercial payment and hosting rules are future work.

## Solution

Build Vowly as a Laravel modular monolith with a React-based visual editor.

The MVP provides an Owner with a one-page Invitation canvas. The Owner adds and arranges ordered Sections, Containers, Grid layouts, and typed Content blocks. The Owner can edit content and design properties, apply curated Animation presets, add one Music track, and configure fixed Form blocks such as RSVP and Guestbook.

The editor, authenticated Preview, and public renderer consume the same versioned serialized Invitation design document. Draft changes are mutable and autosaved. Publication creates an immutable Published invitation version. Public rendering uses only that Published invitation version.

The editor should feel Figma-like through direct selection, insertion, movement, duplication, deletion, property editing, and viewport Preview. The MVP deliberately uses structured responsive layout rather than a freeform coordinate canvas.

## User Stories

### User and Invitation workspace

1. As a new User, I want to register with email and password, so that I can create an Invitation.
2. As a User, I want to log in and log out, so that I can protect my Drafts and operational data.
3. As a User, I want to reset my password, so that I can recover access without support intervention.
4. As a User, I want to verify my email address, so that Vowly can trust the identity used for publication.
5. As an unverified User, I want to create and edit a Draft, so that I can explore the product before verification.
6. As an Owner, I want to own multiple Invitations, so that separate weddings or experiments do not share publication state.
7. As an Owner, I want to see my Invitations in a workspace, so that I can choose which design to edit.
8. As an Owner, I want to create an Invitation with a stable internal identity, so that Draft, media, Events, Guests, and publication remain scoped correctly.
9. As an Owner, I want to choose a slug before publication, so that I can prepare the public URL.
10. As an Owner, I want to change a Draft-only slug, so that I can correct it before sharing.
11. As an Owner, I want the slug to remain fixed after first publication, so that shared links do not silently break.
12. As an Owner, I want a studio to use a normal Owner identity, so that the MVP does not introduce a separate studio role.

### Visual editor shell

13. As an Owner, I want to open a visual editor for an Invitation, so that I can compose the result directly.
14. As an Owner, I want to see the Invitation canvas, so that I understand the page structure while editing.
15. As an Owner, I want to see a Section and block outline, so that I can navigate the document without searching visually.
16. As an Owner, I want to select a Section or Content block, so that I can edit its properties.
17. As an Owner, I want the selected item to be visibly highlighted, so that I know which item a property change affects.
18. As an Owner, I want to add a Section from the approved Section library, so that I can extend the Invitation.
19. As an Owner, I want to insert a Section before or after another Section, so that I can control the story order.
20. As an Owner, I want to move a Section up or down, so that reordering does not depend on dragging.
21. As an Owner, I want to drag a Section to a new location, so that visual arrangement feels direct.
22. As an Owner, I want to duplicate a Section, so that I can reuse a composition quickly.
23. As an Owner, I want to hide a Section without deleting its content, so that I can experiment safely.
24. As an Owner, I want to delete a Section from the Draft presentation, so that the Invitation does not contain unwanted content.
25. As an Owner, I want to restore a removed Section when its data was retained, so that deletion is not unnecessarily destructive.
26. As an Owner, I want Section and block limits to be visible, so that I understand why an insertion may be unavailable.
27. As an Owner, I want editor actions to be keyboard accessible, so that I can compose without relying on a pointer.
28. As an assistive-technology user, I want movement actions announced meaningfully, so that I understand how the document order changed.
29. As an Owner, I want the editor to preserve selection when safe, so that normal edits do not interrupt my work.
30. As an Owner, I want invalid or unsupported content to show a clear error state, so that I can correct it before publication.

### Design document and Content blocks

31. As an Owner, I want the editor to represent the Invitation as a structured design document, so that the same content can render consistently in Preview and public pages.
32. As an Owner, I want every Section and Content block to have a stable identity, so that movement and editing do not lose content.
33. As an Owner, I want to add a Heading block, so that I can introduce a part of the Invitation.
34. As an Owner, I want to add a Text block, so that I can write invitation copy.
35. As an Owner, I want limited rich text such as bold, italic, links, and line breaks, so that text remains expressive without arbitrary markup.
36. As an Owner, I want to add an Image block, so that I can include personal media.
37. As an Owner, I want to add a Button or Link block, so that visitors can navigate to an external destination or an Invitation section.
38. As an Owner, I want to add a Quote block, so that I can include a meaningful quotation.
39. As an Owner, I want to add a Divider block, so that I can separate visual content.
40. As an Owner, I want to add a Countdown block, so that visitors can see time remaining until the Primary event.
41. As an Owner, I want to add a Gallery block, so that visitors can view selected images.
42. As an Owner, I want to add a Couple block, so that the Invitation identifies the people being celebrated.
43. As an Owner, I want to add an Event schedule block, so that visitors can understand the Events.
44. As an Owner, I want to add a Navigation block, so that visitors can open an external map or navigation link.
45. As an Owner, I want to add a Contact person block, so that visitors can contact people explicitly exposed by the Owner.
46. As an Owner, I want to add an RSVP Form block, so that visitors can respond to Events.
47. As an Owner, I want to add a Guestbook block, so that visitors can leave moderated messages.
48. As an Owner, I want to add a Gifts block, so that visitors can see display-only QRIS and bank details.
49. As an Owner, I want the block library to prevent unsupported nested combinations, so that the document remains renderable.
50. As an Owner, I want to duplicate an eligible Content block, so that I can repeat content efficiently.
51. As an Owner, I want to move an eligible Content block within its Container or Grid, so that I can adjust composition.
52. As an Owner, I want to remove a Content block without corrupting its Section, so that local edits remain safe.
53. As an Owner, I want block-specific validation, so that missing required values are caught before publication.

### Containers, Grid, and responsive layout

54. As an Owner, I want to add a Container inside a Section, so that related blocks have a layout boundary.
55. As an Owner, I want to add a Grid layout, so that I can arrange related blocks into columns.
56. As an Owner, I want one-, two-, and three-column Grid presets, so that layout remains predictable.
57. As an Owner, I want to control Grid gap, so that columns have appropriate visual separation.
58. As an Owner, I want to control horizontal and vertical alignment, so that blocks line up intentionally.
59. As an Owner, I want Grid columns to stack on mobile, so that desktop compositions remain usable on small screens.
60. As an Owner, I want to preview the Grid at mobile, tablet, and desktop viewports, so that I can catch responsive problems.
61. As an Owner, I want constrained responsive overrides, so that I can adjust important differences without maintaining three separate pages.
62. As an Owner, I want the editor to show when a layout will stack, so that responsive behavior is understandable.
63. As an Owner, I want unsupported block types rejected from a Grid, so that the renderer does not encounter invalid layout structures.
64. As an Owner, I want Sections to have bounded depth, so that the document remains understandable and performant.
65. As an Owner, I want the editor to prevent excessive Section and block counts, so that public pages remain affordable to render.
66. As an Owner, I want layouts to work without custom CSS, so that Invitations remain safe and consistent.

### Styles and visual settings

67. As an Owner, I want to choose a template or visual starting point, so that I can begin with a polished composition.
68. As an Owner, I want to change the visual starting point on a Draft, so that I can explore different directions before publication.
69. As an Owner, I want template changes to preserve global Invitation data where possible, so that I do not re-enter the couple and Event details.
70. As an Owner, I want template transformations to report changed, unsupported, or omitted content, so that no content disappears silently.
71. As an Owner, I want to configure typography, so that the Invitation feels intentional.
72. As an Owner, I want to configure text color and background color, so that the visual hierarchy is clear.
73. As an Owner, I want to configure spacing and padding within approved limits, so that Sections have appropriate rhythm.
74. As an Owner, I want to configure borders and corner treatment within approved limits, so that blocks can have visual distinction.
75. As an Owner, I want to configure Section backgrounds, so that Sections can have different visual moods.
76. As an Owner, I want design settings to use approved tokens and values, so that the Invitation remains accessible and maintainable.
77. As an Owner, I want a readable default theme, so that I can create a usable Invitation without detailed design knowledge.
78. As an Owner, I want style controls to show accessible contrast feedback where practical, so that text remains readable.
79. As an Owner, I want the renderer to ignore unsupported style properties, so that unsafe or invalid values cannot reach the public page.

### Animation and Music

80. As an Owner, I want to apply an Animation preset to an eligible Section or Content block, so that the Invitation feels polished.
81. As an Owner, I want to choose no animation, fade, or slide/reveal behavior, so that animation remains simple.
82. As a visitor who prefers reduced motion, I want animations to be reduced or removed, so that the Invitation remains comfortable.
83. As an Owner, I want an animation Preview, so that I understand the effect before publishing.
84. As an Owner, I want to add one Music track to an Invitation, so that the page can include an audio atmosphere.
85. As an Owner, I want to upload or choose an approved audio track, so that the Invitation does not accept arbitrary unsupported media.
86. As a visitor, I want visible play and pause controls, so that I control audio playback.
87. As a visitor, I do not want audio to play unexpectedly without a browser-allowed user gesture, so that the page respects browser and user expectations.
88. As an Owner, I want to remove or replace the Music track, so that I can change the Invitation atmosphere.
89. As an Owner, I want the editor to show audio validation errors, so that unsupported or oversized files are not silently accepted.

### Couple, Event, and regional content

90. As an Owner, I want to enter the couple identity, so that the Invitation identifies the people being celebrated.
91. As an Owner, I want to create multiple Events, so that ceremony and reception details can coexist.
92. As an Owner, I want exactly one active Primary event, so that the Invitation has an unambiguous main occasion.
93. As an Owner, I want the Primary event to provide a title, date, and time before publication, so that the public Invitation has minimum useful information.
94. As an Owner, I want each Event to have its own IANA time zone, so that displayed times and countdowns are correct.
95. As an Owner, I want to archive an Event without deleting its response history, so that schedule changes remain auditable.
96. As a visitor, I want Event details and countdowns to use the Event's local time zone, so that I do not misread the occasion.
97. As an Owner, I want to provide an external Navigation link, so that visitors can open their preferred map application.
98. As an Owner, I want to expose selected Contact persons, so that visitors can ask practical questions without seeing private Guest data.
99. As an Indonesian visitor, I want customer-facing copy and formatting in id-ID, so that the Invitation feels native to the launch market.
100.    As an Owner, I want content to remain translation-ready, so that future English support does not require changing the design document.

### Media

101. As an Owner, I want to upload supported image formats, so that I can use personal media.
102. As an Owner, I want to upload supported audio formats, so that I can add one Music track.
103. As an Owner, I want files stored outside the application web root, so that storage internals are not exposed.
104. As an Owner, I want generated storage keys, so that uploaded filenames do not become public identifiers.
105. As an Owner, I want image orientation normalized and metadata stripped, so that public media does not leak GPS or other EXIF information.
106. As an Owner, I want responsive image derivatives, so that public pages load appropriately on different devices.
107. As an Owner, I want media size, dimension, and quota limits enforced, so that the product remains predictable.
108. As an Owner, I want media removed from a Draft to remain available while an older Published invitation references it, so that editing cannot break the public page.
109. As an Owner, I want the Gallery to have a bounded image count, so that visitors are not presented with an unbounded library.
110. As an Owner, I want media processing failures to be visible, so that I can replace a failed asset.

### Draft editing, history, and persistence

111. As an Owner, I want Draft changes to autosave, so that normal editing does not lose work.
112. As an Owner, I want the editor to show save status, so that I know whether my latest changes are persisted.
113. As an Owner editing in two tabs, I want a visible revision conflict, so that one tab never silently overwrites another.
114. As an Owner, I want to retry a failed save, so that a temporary network problem does not discard my work.
115. As an Owner, I want undo and redo for editor actions, so that I can explore without fear.
116. As an Owner, I want undo and redo to preserve the design document's valid structure, so that history cannot create corrupt content.
117. As an Owner, I want a Draft to retain a schema version, so that future document migrations are explicit.
118. As an Owner, I want a published version to remain immutable, so that later Draft edits cannot leak publicly.
119. As an Owner, I want a failed publication to leave the current Published invitation unchanged, so that a bad Draft cannot take down the public page.
120. As an Owner, I want to continue editing a Draft while a previous Published invitation is public, so that I can prepare the next revision safely.
121. As an Owner, I want a publication confirmation step, so that public exposure is deliberate.
122. As an Owner, I want transformations and validation warnings shown before publication, so that I can resolve important issues.

### Preview and publication

123. As an Owner, I want an authenticated private Preview, so that unfinished content is not publicly shareable.
124. As an Owner, I want Preview to use the same serialized design document as the editor, so that what I inspect matches what I publish.
125. As an Owner, I want mobile, tablet, and desktop Preview viewports, so that I can check responsive behavior.
126. As an Owner, I want to open a Preview without changing publication state, so that experimentation is safe.
127. As an Owner, I want publication validation to require couple identity and a valid Primary event, so that essential content is present.
128. As an Owner, I want publication to create an immutable Published invitation version, so that public rendering is stable.
129. As an Owner, I want explicit publication without payment, so that the MVP can validate the editor and public Invitation experience.
130. As an Owner, I want to unpublish at any time, so that I can temporarily remove public access.
131. As an Owner, I want unpublishing to preserve the Draft, Published versions, Guests, RSVPs, Guestbook messages, and media, so that visibility changes are reversible.
132. As a visitor, I want an unavailable Invitation to show a neutral response, so that internal state is not exposed.
133. As an Owner, I want the public Invitation to be share-by-link and noindex, so that private celebrations do not appear in search or a Vowly directory.
134. As a visitor, I want public pages to be responsive and accessible, so that the Invitation works across devices and assistive technologies.

### Guests, Personalized links, and Forms

135. As an Owner, I want to create Guests manually, so that I can manage invitations without a spreadsheet.
136. As an Owner, I want to organize Guests into Guest groups, so that households or cohorts are easier to manage.
137. As an Owner, I want to import Guests from CSV with mapping and validation Preview, so that existing lists are reusable.
138. As an Owner, I want valid CSV rows imported after confirmation even when other rows fail, so that one bad row does not block useful data.
139. As an Owner, I want a downloadable import error report, so that I can correct rejected rows.
140. As an Owner, I want imports to be additive, so that they never silently replace or delete existing Guests.
141. As an Owner, I want duplicate warnings based on normalized phone or name-plus-phone matches, so that likely duplicates are reviewable.
142. As an Owner, I want each Guest to receive one active Personalized link, so that I can share a ready-to-use link.
143. As an Owner, I want to copy a Guest's Personalized link, so that I can send it through my preferred channel.
144. As an Owner, I want to regenerate a Guest's link, so that a compromised link can be revoked.
145. As a Guest, I want a Personalized link to identify only me or my household, so that other Guests' data remains private.
146. As an Owner, I want to archive a Guest without losing RSVP history, so that corrections do not erase operational records.
147. As an Owner, I want to export Guest data to CSV, so that I can use it for offline planning.
148. As a Guest using a Personalized link, I want to respond independently for each Event, so that attendance can differ between Events.
149. As a Guest using a Personalized link, I want to edit my RSVP until the relevant Event begins, so that my response stays current.
150. As an Owner, I want attendee counts limited by the Guest's allowed-attendee limit, so that planning data stays bounded.
151. As a public visitor, I want to submit a Generic RSVP with a display name and attendee count, so that I can respond without a Personalized link.
152. As an Owner, I want Generic RSVPs labelled as Unmatched RSVPs, so that I do not mistake them for identified Guests.
153. As an Owner, I want to reconcile an Unmatched RSVP manually to a Guest, so that recognized responses become useful without unsafe auto-matching.
154. As an Owner, I want Generic RSVPs to be submit-once in MVP, so that anonymous editing does not require another identity mechanism.
155. As an Owner, I want RSVP responses for archived Events retained and exportable but read-only, so that historical reporting remains accurate.
156. As an Owner, I want confirmed attendance and maybe responses reported separately, so that planning numbers are not inflated.
157. As an Owner, I want to export RSVP data, so that I can use attendance information outside Vowly.

### Guestbook and public privacy

158. As a public visitor, I want to submit a Guestbook message with a display name, so that I can send a wish to the couple.
159. As an Owner, I want new Guestbook messages to start as pending, so that nothing abusive appears automatically.
160. As an Owner, I want to approve, hide, or delete Guestbook messages, so that I control the public Guestbook.
161. As a visitor, I want to report an inappropriate Guestbook message, so that harmful content can be reviewed.
162. As an Owner, I want removing the Guestbook block to retain its messages, so that I can restore the block later.
163. As a public visitor, I want public responses to expose only Published content, public media, approved Guestbook messages, and my own validated Personalized RSVP context, so that private data stays private.
164. As a public visitor, I do not want to receive Guest lists, phone numbers, host notes, payment data, storage keys, or link secrets, so that the public page has a narrow data boundary.
165. As an Owner, I want public forms protected by validation, rate limits, origin/CSRF protection, honeypot controls, and abuse handling, so that anonymous endpoints are not trivially abused.

### Admin and operations

166. As an Admin, I want to search Users and Invitations, so that I can support Owners.
167. As an Admin, I want to inspect Draft and Published invitation state, so that I can explain rendering or publication problems.
168. As an Admin, I want to moderate Guestbook messages, so that public abuse can be handled.
169. As an Admin, I want to activate or deactivate templates, so that the launch catalog can be operated without a template-builder product.
170. As an Admin, I want support access to be read-only by default, so that Owner data is not changed accidentally.
171. As an Admin, I want support access and mutations audited with a reason, so that operational actions are accountable.
172. As an Admin, I want to force an Invitation unavailable for abuse, legal, security, or operational reasons, so that Vowly has an emergency safety control.
173. As an Owner, I want to be notified of an Admin intervention when appropriate, so that support actions are not mysterious.
174. As an operator, I want database and media backups, so that an operational failure does not erase Invitations.
175. As an operator, I want a documented restore procedure and restore test, so that backups are actionable.

## Implementation Decisions

### Product boundary

- The MVP is a visual Invitation builder and publishing service.
- The primary customer-facing actor remains the Owner. A studio is a normal User/Owner identity and does not receive a separate role.
- The MVP supports one Invitation page. Multi-page design documents are deferred.
- The MVP remains focused on wedding Invitations in Indonesia, with id-ID presentation and translation-ready text.
- Payment, Midtrans, Payment records, Hosting entitlements, renewal, refund, reversal, chargeback, and payment-gated publication are excluded from this MVP.
- An Owner can publish a valid Draft directly. Future payment enforcement must be added at the publication boundary rather than embedded in the editor document.

### Frontend and backend stack

- Use Laravel 13 as a modular monolith.
- Use the official Laravel React Starter Kit.
- The starter kit provides React 19, TypeScript, Inertia 3, Tailwind CSS 4, shadcn/ui, Vite, and Laravel Fortify authentication.
- Use React for the Owner editor, Preview, public renderer, and Admin UI.
- Use Inertia for application navigation and server-provided page props. Use JSON HTTP endpoints for high-frequency editor persistence, media operations, and public form submissions where appropriate.
- Do not create a separate Next.js application or separate frontend deployment for the MVP.
- Use PostgreSQL for relational data and serialized Draft/Published design documents.
- Use Redis for queues, caching, rate limiting, exports, media processing, and scheduled cleanup.
- Use S3-compatible object storage and a CDN for media. Originals remain outside the application web root; public Published derivatives are served through controlled public media URLs.
- Use Docker Compose on a VPS with separate application, web, queue-worker, and scheduler processes. PostgreSQL and Redis may run as Compose services for the MVP.

### Initialized project foundation

- The repository now contains an initialized Laravel application rather than documentation only.
- The current installed baseline is Laravel Framework 13.33.0 on PHP 8.4.25, Inertia Laravel 3.3.4, Inertia React 3.7.1, React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, Vite 8.3.0, Laravel Fortify 1.39.0, Laravel Wayfinder 0.1.21, Pest 5.2.1, Larastan 3.12.2, Pint 1.32.1, and Laravel Boost 2.9.1.
- The React Starter Kit is configured with TypeScript, Inertia, Tailwind, shadcn/ui New York components, Radix primitives, Lucide icons, React Compiler support, and Wayfinder-generated frontend route helpers.
- The scaffold currently includes authentication, email verification, password reset, two-factor authentication, passkeys, profile/security/appearance settings, Teams, team membership, team invitations, and a team-scoped dashboard.
- The generated Teams capability is starter-kit infrastructure. It is not a Vowly domain role and must not introduce a Studio role. Before Invitation implementation, the team scaffold must either be removed or explicitly isolated from the Vowly domain.
- The current local defaults use SQLite, database-backed sessions/cache/queues, local filesystem storage, log mail, and UTC. PostgreSQL, Redis, object storage/CDN, and production deployment are future environment work.
- No Vowly-specific Invitation, Design document, Canvas, Event, Guest, RSVP, or Published invitation implementation exists yet.

### Invitation design document

- The primary seam is editor command → serialized Invitation design document → responsive renderer.
- The design document is versioned and has a schema version.
- The document contains an ordered tree of Sections, Containers, Grid layouts, and Content blocks.
- Every Section, Container, Grid, and Content block has a stable identifier.
- Each node has a typed kind, validated properties, allowed children, responsive settings, and optional Animation preset.
- The document is stored as JSON while domain data such as Users, Events, Guests, RSVPs, media records, Guestbook messages, and audit records remain relational.
- The Draft document is mutable. A Published invitation version stores an immutable snapshot of the validated document.
- The editor and public renderer use an allowlisted component registry. The registry defines editing controls, validation, responsive behavior, and public rendering for each supported type.
- User-authored arbitrary HTML, CSS, JavaScript, iframe, embed, and animation timelines are not accepted.
- The editor persists document snapshots with a monotonic Draft revision. A stale revision produces a recoverable conflict rather than silently overwriting a newer Draft.

### Editor structure and interaction

- The editor is visually direct and Figma-like in selection and manipulation, but the MVP uses structured flow and Grid layout rather than arbitrary pixel coordinates.
- The top-level composition is one page containing ordered Sections.
- Sections may contain approved Containers and Content blocks.
- Containers may contain approved Content blocks or one constrained Grid.
- Grid supports one, two, or three columns with bounded gap, alignment, and responsive stacking.
- Nested arbitrary layout trees, unbounded nesting, and arbitrary coordinate placement are deferred.
- Every pointer interaction has a keyboard or single-pointer equivalent where it changes document order or content.
- React editor state uses command-oriented transitions for add, move, duplicate, edit, style, animation, audio, undo, and redo operations.
- Undo and redo are local editor behavior. The server persists valid Draft snapshots rather than an event-sourced command log.
- React list rendering uses stable document node identifiers rather than array positions.

### MVP Content block registry

- Include Heading, Text, Image, Button/link, Quote, Divider, Countdown, Gallery, Couple, Event schedule, Navigation, Contact person, RSVP Form, Guestbook, Gifts, and Music blocks.
- Rich text is limited to paragraphs, bold, italic, links, and line breaks.
- Form blocks are registry-defined forms. MVP forms include RSVP and Guestbook; arbitrary user-defined fields and workflows are deferred.
- Music supports one audio track per Invitation with validated format and size limits.
- Audio must expose explicit play/pause controls. Autoplay is best-effort only and must respect browser user-gesture requirements.
- Animation supports a small registry of presets such as none, fade, and slide/reveal.
- Animation presets respect reduced-motion preferences and contain no user-authored JavaScript.
- Only one active RSVP block, one active Guestbook block, one active Countdown block, one active Event schedule block, one active Navigation block, one active Gifts block, and one active Contact person block are allowed in the MVP unless a later decision expands these limits.

### Styles and responsive behavior

- Style controls use approved design tokens and bounded values for typography, color, background, spacing, border, radius, alignment, and visibility.
- The editor supports mobile, tablet, and desktop Preview viewports.
- Responsive overrides are limited to approved properties and breakpoints.
- Grid columns stack or reflow at smaller widths according to the block registry.
- The public renderer ignores invalid or unsupported style values.
- The renderer must remain semantic and accessible even when an Owner chooses unusual visual styles.

### Authentication and authorization

- Use Laravel Fortify features from the official starter kit for registration, login, password reset, and email verification.
- An unverified User may create and edit a Draft but must verify email before publication.
- Use Owner and Admin roles only.
- Owner authorization is scoped to owned Invitations.
- Admin support access is audited and read-only by default, with mutations requiring a reason.

### Couple, Event, Guest, and Form domain

- An Invitation owns its Events, Guests, RSVPs, media, Guestbook messages, and design document.
- An Event stores its local IANA time zone and uses it for display and RSVP cutoff behavior.
- Exactly one active Primary event is required for publication.
- RSVP records belong to one Invitation, one Event, and optionally one Guest.
- Personalized links use opaque tokens stored as secure hashes and never accept browser-provided Guest IDs.
- Generic RSVP creates an Unmatched RSVP and is submit-once in the MVP.
- Guestbook messages are pending until approved by the Owner or Admin.
- Public form responses expose only the minimum required context.

### Draft and publication lifecycle

- Visibility states are Draft, Published, and Unpublished for this MVP.
- There is no Hosting entitlement or expiry state in the MVP.
- Publication requires a valid Draft, couple identity, and one active Primary event with title, date, and time.
- Publication creates an immutable Published invitation version and makes it public atomically.
- Payment is not checked during publication.
- The public route renders only the latest Published invitation version, never the mutable Draft.
- Unpublishing preserves Draft, Published versions, Guests, RSVPs, Guestbook messages, and media.
- The public route uses a neutral unavailable response for Unpublished Invitations.
- A slug may change while Draft-only and becomes immutable after first publication.
- Public Invitations use noindex and are share-by-link; there is no public Invitation directory or Invitation sitemap.

### Media and safety

- Allow JPEG, PNG, WebP, and AVIF images, plus one approved audio format for Music.
- Validate file extension, content signature, MIME type, size, dimensions, and quota.
- Generate random storage keys and keep files outside the application web root.
- Normalize image orientation, strip EXIF metadata, and generate responsive derivatives.
- Media referenced by any Published invitation remains available even if removed from the Draft.
- Cleanup waits until no Published version, recovery rule, or other retention rule references the media.

### API and persistence boundaries

- Laravel controllers and application services own authentication, authorization, validation, document persistence, publication, media, Guests, Events, RSVPs, Guestbook moderation, and exports.
- The editor uses a JSON document persistence interface that accepts a Draft revision and returns the persisted revision or a conflict.
- Public reads expose only the Published invitation document, public media, Event details, approved Guestbook messages, and validated Personalized RSVP context.
- Public writes support Generic RSVP, Personalized RSVP, and Guestbook submission with validation, rate limits, CSRF/origin controls where applicable, honeypots, and abuse controls.
- Payment interfaces are intentionally absent from the MVP. Future payment work may add a publication prerequisite without changing the document contract.

## Testing Decisions

- Tests assert external behavior at the highest available seam and do not couple to incidental component structure, internal class names, or storage implementation details.
- The primary seam is the serialized Invitation design document between editor commands and responsive rendering.
- Document tests prove add, edit, move, duplicate, hide, remove, Grid changes, responsive settings, Animation presets, Music settings, Form blocks, validation, undo/redo behavior, stable IDs, and stale revision conflicts.
- Renderer tests prove that the same valid document produces the expected editor Preview and public rendering behavior at mobile, tablet, and desktop viewports.
- Application-level feature tests cover registration, email verification, Invitation ownership, Draft persistence, Preview access, publication, unpublishing, slug immutability, Guest operations, RSVP, Guestbook moderation, media access, exports, authorization, and audit behavior.
- Browser tests cover the Owner editor's primary keyboard and pointer flows, responsive Preview, reduced-motion behavior, public RSVP, and Guestbook submission.
- Media tests cover allowed and denied formats, MIME/content mismatch, size and dimension limits, EXIF stripping, responsive derivatives, audio validation, generated storage keys, and Published media retention.
- Public data-boundary tests prove that visitors cannot obtain Guest lists, private phone numbers, host notes, token material, payment data, storage internals, or unrelated Guest RSVP state.
- Form abuse tests cover validation, rate limits, origin/CSRF behavior, honeypots, duplicate Generic RSVP handling, and Guestbook reporting.
- The repository now has a Laravel/Pest application and test suite from the starter scaffold. Existing tests cover authentication, email verification, password reset, two-factor authentication, profile/security settings, Teams, team invitations, and the starter dashboard.
- No Vowly-specific behavior tests exist yet. New work should extend the existing application-level feature-test conventions, add focused Design document validation tests, and add a small Playwright accessibility/responsive smoke suite.

## Out of Scope

- Midtrans or any other payment provider.
- Payment records, checkout, webhooks, receipts, refunds, chargebacks, renewals, and Hosting entitlements.
- Payment-gated publication or expiry based on paid hosting time.
- True freeform Figma coordinate positioning.
- Vector drawing, pen tools, arbitrary shape tools, or a general graphics editor.
- Arbitrary HTML, CSS, JavaScript, iframe, embed, or user-authored animation timelines.
- Multiple pages, reusable user-created Sections, reusable component libraries, or template marketplace.
- Real-time collaboration, Comments, editor invitations, approval workflows, and presence indicators.
- Arbitrary form-builder fields, conditional form logic, meal choices, dietary requirements, or guest notification campaigns.
- Custom domains and subdomain-based public URLs.
- Official WhatsApp API, bulk messaging, invitation delivery automation, and RSVP reminders.
- QR check-in, offline check-in, seating plans, and table planning.
- Rich analytics beyond operational counts.
- XLSX or Google Sheets imports.
- Platform-collected or reconciled QRIS/bank payments.
- Background music playlists or guaranteed autoplay.
- A formal customer-facing RPO/RTO promise before operational measurements exist.

## Further Notes

- This spec supersedes the earlier constrained-editor baseline. The MVP now prioritizes the visual editor while retaining structured responsive output.
- The existing decision to use path-based public URLs remains: https://vowly.id/i/{slug}.
- The existing immutable Published invitation decision remains: Draft edits never mutate the current public version.
- The existing share-by-link privacy decision remains: public Invitations are noindex and are not listed in a directory.
- Existing payment and Hosting entitlement decisions are retained as future commercial design, not MVP implementation scope.
- The next decomposition should split work around the document contract, editor shell, Content block registry, Grid/responsive rendering, media, Draft persistence, Preview/public rendering, Guest/RSVP forms, Guestbook moderation, and accessibility/security.
