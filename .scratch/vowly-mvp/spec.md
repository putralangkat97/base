Status: ready-for-agent

# Vowly MVP implementation spec

## Problem Statement

Couples in Indonesia need a premium, personalized wedding Invitation that is easy to compose, publish, share, and operate without combining generic website tools with spreadsheets. Existing tools often make the visual result, guest identity, RSVP collection, payment, and hosting lifecycle separate problems.

Vowly must validate one focused proposition: couples will pay once for a polished, mobile-first wedding Invitation that makes guest sharing and RSVP management simpler than generic website tools and spreadsheets.

The initial product also needs to serve small invitation studios without creating a separate studio workspace or role. A studio uses a normal User/Owner account.

## Solution

Build Vowly as a Laravel modular monolith with PostgreSQL, Redis, object storage/CDN, and Docker Compose deployment on a VPS.

The launch product is `Vowly Publish — 1 Year`: one Invitation with one year of hosting, four production templates, a constrained visual editor, responsive previews, guest operations, Personalized links, event-level RSVP, Guestbook moderation, display-only QRIS/bank details, CSV import/export, and a verified Midtrans payment flow.

The editor is visual and hierarchical rather than a freeform Figma canvas. An Owner adds and configures top-level Sections, adds typed Content blocks inside them, uses responsive Grid presets, applies curated Animation presets, and previews the same structured Invitation at mobile, tablet, and desktop sizes. The same serialized document is the source for authenticated preview and public rendering.

The public canonical URL is `https://vowly.id/i/{slug}`. A public Invitation is available only when its visibility is `published`, its Hosting entitlement is active, its hosting end is in the future, and it has a Published invitation version. Payment never publishes automatically.

## User Stories

### Account and ownership

1. As a new User, I want to register with email and password, so that I can create an Invitation.
2. As a User, I want to verify my email address, so that Vowly can trust the identity used for checkout and publication.
3. As a User, I want to reset my password, so that I can recover access without support intervention.
4. As an unverified User, I want to create and edit a draft, so that I can explore Vowly before committing to payment.
5. As an unverified User, I want to preview my draft privately, so that I can evaluate the product before verification.
6. As a User, I want to own multiple Invitations, so that separate weddings or draft experiments do not share publication state.
7. As an Owner, I want to see which Invitations I own, so that I can manage each wedding separately.
8. As an Owner, I want to remain the only active customer editor in MVP, so that ownership and support behavior stay unambiguous.
9. As an Owner, I want my Invitation to be separate from the Vowly Admin role, so that support access is controlled and audited.
10. As an Admin, I want audited support access, so that I can resolve operational issues without becoming an invisible owner.

### Invitation creation and templates

11. As an Owner, I want to create an Invitation from a template, so that I can begin with a polished wedding design.
12. As an Owner, I want to browse four launch templates, so that I can choose a visual direction without an overwhelming catalog.
13. As an Owner, I want an Invitation to have a stable slug before first publication, so that I can prepare and share the eventual URL.
14. As an Owner, I want to change a draft slug, so that I can correct or improve it before sharing.
15. As an Owner, I want my slug to remain fixed after first publication, so that shared links do not silently break.
16. As an Owner, I want to change templates after starting an Invitation, so that I can refine the visual direction without losing global data.
17. As an Owner, I want template changes to transform only the draft, so that the current public Invitation remains stable until I review it.
18. As an Owner, I want to see every transformed, unsupported, or omitted item after a template change, so that content is never silently lost.
19. As an Admin, I want to activate or deactivate templates, so that the catalog can be operated without a visual template-builder product.
20. As an Owner with an existing Invitation, I want a deactivated template to keep rendering, so that an Admin catalog change does not break my published Invitation.

### Visual editor

21. As an Owner, I want to open a visual editor for my draft, so that I can compose the Invitation from the result I see.
22. As an Owner, I want to add a top-level Section from a curated library, so that I can build the Invitation incrementally.
23. As an Owner, I want to add a Content block inside a Section, so that each part of the Invitation has an intentional structure.
24. As an Owner, I want to add text, image, quote, button/link, and divider blocks, so that I can express the core invitation content.
25. As an Owner, I want to add a responsive Grid block, so that I can arrange related content in columns without writing layout code.
26. As an Owner, I want Grid blocks to reflow on mobile, so that a desktop composition remains usable on small screens.
27. As an Owner, I want to choose from constrained Grid presets, so that layout remains predictable and accessible.
28. As an Owner, I want to apply a curated Animation preset to an eligible Section or Content block, so that the Invitation feels polished.
29. As a visitor who prefers reduced motion, I want animations to respect my system preference, so that the Invitation remains comfortable and usable.
30. As an Owner, I want to configure content without arbitrary HTML, CSS, JavaScript, iframe, or embed fields, so that the published document remains safe and maintainable.
31. As an Owner, I want to reorder Sections, so that the Invitation follows the story I intend.
32. As an Owner, I want Move Up, Move Down, Insert Before, and Insert After actions, so that reordering does not depend on dragging.
33. As an Owner, I want to duplicate a Section or eligible block, so that I can build repeated content quickly.
34. As an Owner, I want to hide a Section without deleting its data, so that I can try variations safely.
35. As an Owner, I want to remove a Section from the draft presentation without deleting its underlying data, so that I can restore it later.
36. As an Owner, I want Section and block limits enforced, so that an Invitation remains performant and understandable.
37. As an Owner, I want keyboard-accessible editor actions, so that I can compose without a pointer.
38. As an assistive-technology user, I want meaningful announcements when an item moves, so that I understand changes to the document order.
39. As an Owner, I want draft changes to autosave, so that I do not lose work during normal editing.
40. As an Owner editing in two tabs, I want a visible revision conflict, so that one tab never silently overwrites another.
41. As an Owner, I want to preview the same draft at mobile, tablet, and desktop viewports, so that I can catch responsive problems before publication.
42. As an Owner, I want preview to be authenticated and private, so that unfinished content is not publicly shareable.
43. As an Owner, I want clear validation feedback for invalid blocks or missing data, so that I can fix the draft before publication.
44. As an Owner, I want transformed content to require review before republishing, so that template changes remain deliberate.

### Couple, event, and regional content

45. As an Owner, I want to enter the couple identity, so that the Invitation identifies the people being celebrated.
46. As an Owner, I want to create multiple Events such as a ceremony and reception, so that different occasions can have different RSVP responses.
47. As an Owner, I want exactly one active Primary event, so that the Invitation has an unambiguous main occasion.
48. As an Owner, I want the Primary event to provide the minimum publishable title, date, and time, so that public visitors understand when the main occasion occurs.
49. As an Owner, I want each Event to have its own local time zone, so that dates and countdowns are correct across WIB, WITA, and WIT.
50. As an Owner, I want to archive an Event with existing responses, so that schedule changes do not destroy RSVP history.
51. As a visitor, I want event schedules, countdowns, and venue details to use the Event's local time, so that I do not misread the occasion.
52. As an Owner, I want to provide an external Navigation link, so that guests can open their preferred map application without Vowly embedding a map provider.
53. As an Owner, I want to expose selected Contact persons, so that guests know whom to contact without revealing private Guest data.
54. As an Indonesian visitor, I want customer-facing copy and formatting in `id-ID`, so that the Invitation feels native to the launch market.
55. As an Owner, I want the product to be translation-ready, so that future English support does not require changing the domain model.

### Media and display-only gifts

56. As an Owner, I want to upload supported image formats, so that my Invitation can contain personal media.
57. As an Owner, I want uploaded media stored outside the public web root with generated storage keys, so that filenames and storage internals are not exposed.
58. As an Owner, I want image orientation normalized and metadata stripped, so that public media does not leak GPS or other EXIF information.
59. As an Owner, I want generated responsive derivatives, so that public pages load appropriately on different devices.
60. As an Owner, I want gallery and storage limits enforced, so that the product remains predictable and affordable to operate.
61. As an Owner, I want media removed from a draft to remain available while an older Published invitation references it, so that editing cannot break the current public page.
62. As an Owner, I want a Gallery section with a bounded image count, so that guests can view selected memories without an unbounded media library.
63. As an Owner, I want to add one QRIS image and multiple bank-account entries, so that guests can see gift details.
64. As a visitor, I want gifts to be display-only, so that Vowly never handles or reconciles my payment.

### Publication and hosting

65. As an Owner, I want to save an editable Draft invitation, so that I can work before payment or publication.
66. As an Owner, I want to pay for hosting without automatically publishing, so that I can decide when the Invitation is ready.
67. As an Owner, I want payment verification to create a one-year Hosting entitlement, so that I know what I purchased.
68. As an Owner, I want to review a paid draft and explicitly publish it, so that payment never accidentally exposes unfinished content.
69. As an Owner, I want publication validation to require couple identity and one valid Primary event, so that essential public content is present.
70. As an Owner, I want optional Sections to remain optional, so that I am not forced to add RSVP, Gallery, Gifts, or Guestbook content.
71. As an Owner, I want a Published invitation to be immutable, so that a half-finished edit cannot leak to visitors.
72. As an Owner, I want to keep editing a Draft while an older Published invitation is public, so that I can prepare the next version safely.
73. As an Owner, I want a failed publication to leave the current Published invitation unchanged, so that a bad draft cannot take the site down.
74. As an Owner, I want to unpublish at any time, so that I can temporarily remove the public Invitation.
75. As an Owner, I want unpublishing to preserve my Draft, Published version, Guests, RSVPs, and media, so that visibility changes are reversible.
76. As an Owner, I want unpublishing not to pause hosting time, so that the one-year product has predictable commercial semantics.
77. As an Owner, I want an expired Invitation to become unavailable publicly while my data remains retained, so that I can renew or export it later.
78. As an Owner, I want to renew before expiry without losing paid time, so that early renewal is not penalized.
79. As an Owner, I want a renewal after expiry to start when payment is verified, so that reactivation has a clear start date.
80. As a visitor, I want every unavailable Invitation to show a neutral response, so that unpublish, expiry, deletion, and suspension do not expose internal state.
81. As an Owner, I want to delete an Invitation into a 30-day recovery period, so that accidental deletion is recoverable.
82. As an Owner, I want recovery to preserve the original entitlement end date, so that recovery does not grant unpriced hosting time.
83. As an Owner, I want permanent deletion after recovery to remove customer-facing data, so that deletion has a meaningful privacy effect.

### Guests, links, and RSVP

84. As an Owner, I want to create Guests manually, so that I can manage invitations without a spreadsheet.
85. As an Owner, I want to organize Guests into Guest groups, so that I can manage households or invitation cohorts.
86. As an Owner, I want to import Guests from CSV with a mapping and validation preview, so that existing lists are reusable.
87. As an Owner, I want valid CSV rows imported after confirmation even when other rows fail, so that one bad row does not block useful data.
88. As an Owner, I want a downloadable import error report, so that I can correct rejected rows.
89. As an Owner, I want imports to be additive, so that they never silently replace or delete existing Guests.
90. As an Owner, I want duplicate warnings based on normalized phone or name-plus-phone matches, so that likely duplicates are reviewable without unsafe name-only merges.
91. As an Owner, I want existing Guest data to remain canonical during a merge, so that imported values do not overwrite trusted data automatically.
92. As an Owner, I want each Guest to receive one active Personalized link automatically, so that I can share a ready-to-use link.
93. As an Owner, I want to copy a Guest's Personalized link manually, so that I can send it through my preferred channel.
94. As an Owner, I want to regenerate a Guest's link, so that a compromised or mis-shared link can be revoked.
95. As a Guest, I want my Personalized link to identify only me or my household, so that other Guests' data remains private.
96. As an Owner, I want to archive a Guest without losing RSVP history, so that corrections do not erase operational records.
97. As an Owner, I want to export Guest data to CSV, so that I can use it for offline planning.
98. As a Guest, I want to respond per Event, so that my attendance can differ between ceremony and reception.
99. As a Guest using a Personalized link, I want to edit my RSVP until the Event begins, so that my response stays current.
100. As a Guest, I want my attendee count limited by the Guest's allowed-attendee limit, so that the Owner receives bounded planning data.
101. As a public visitor, I want to submit a Generic RSVP with my display name and attendee count, so that I can respond without a Personalized link.
102. As a public visitor, I want to respond independently for each Event, so that multi-event Invitations collect accurate attendance.
103. As an Owner, I want Generic RSVPs labeled as Unmatched RSVPs, so that I do not mistake them for identified Guests.
104. As an Owner, I want to reconcile an Unmatched RSVP manually to a Guest, so that recognized responses become useful without unsafe auto-matching.
105. As an Owner, I want Generic RSVPs to be submit-once in MVP, so that anonymous editing does not require another identity mechanism.
106. As an Owner, I want RSVP responses for archived Events retained and exportable but read-only, so that historical reporting remains accurate.
107. As an Owner, I want confirmed attendance and `maybe` responses reported separately, so that planning numbers are not inflated.
108. As an Owner, I want to export RSVP data, so that I can use attendance information outside Vowly.

### Guestbook and public privacy

109. As a public visitor, I want to submit a Guestbook message with a display name, so that I can send a wish to the couple.
110. As an Owner, I want new Guestbook messages to start as `pending`, so that nothing abusive appears automatically.
111. As an Owner, I want to approve, hide, or delete Guestbook messages, so that I control the public Guestbook.
112. As a visitor, I want to report an inappropriate Guestbook message, so that harmful content can be reviewed.
113. As an Owner, I want removing the Guestbook section to preserve its messages, so that I can restore the section later.
114. As a public visitor, I want public responses to expose only published content, public media, approved Guestbook messages, and my own validated Personalized RSVP context, so that private data stays private.
115. As a public visitor, I do not want to receive Guest lists, phone numbers, host notes, payment data, storage keys, or link secrets, so that the public page has a narrow data boundary.
116. As an Owner, I want public Invitations to be share-by-link and `noindex`, so that private celebrations do not appear in search or a Vowly directory.
117. As an Owner, I want public forms protected by validation, rate limits, origin/CSRF protection, and abuse controls, so that anonymous endpoints cannot be trivially abused.

### Payment and entitlement

118. As an Owner, I want one complete Vowly Publish — 1 Year product, so that I do not need to understand a feature matrix.
119. As an Owner, I want to pay in IDR, so that launch pricing matches the Indonesian market.
120. As an Owner, I want a local pending Payment created before checkout, so that payment state is recoverable if the browser closes.
121. As an Owner, I want a failed or expired checkout to be retryable, so that a temporary provider problem does not block purchase.
122. As an Owner, I want only the first verified successful payment to activate the entitlement, so that duplicate webhooks or retries cannot double-grant hosting.
123. As an Owner, I want payment notifications verified by provider signature, amount, currency, order reference, and product, so that false payment callbacks cannot publish my Invitation.
124. As an Owner, I want a full refund or reversal to revoke public hosting, so that access reflects the commercial state.
125. As an Owner, I want my draft and operational data retained after a refund or reversal, so that support can reconcile the account without destroying history.
126. As an Admin, I want manual refund/reversal handling audited, so that payment support actions are accountable.
127. As an Owner, I want a payment receipt/status notification, so that I understand whether the entitlement is active.

### Admin, compliance, and operations

128. As an Admin, I want to search Users and Invitations, so that I can support customers.
129. As an Admin, I want to inspect payment and entitlement state, so that I can explain publication availability.
130. As an Admin, I want to moderate Guestbook messages, so that public abuse can be handled.
131. As an Admin, I want to activate or deactivate templates, so that launch catalog operations do not require template authoring.
132. As an Admin, I want every support access and mutation audited with a reason, so that customer data access is accountable.
133. As an Admin, I want to force an Invitation unavailable for abuse, legal, security, or operational reasons, so that Vowly has an emergency safety control.
134. As an Owner, I want to be notified of an Admin intervention when appropriate, so that support actions are not mysterious.
135. As a User, I want account deletion to wait until owned Invitations complete their deletion lifecycles, so that ownership is not orphaned.
136. As a User, I want legally or operationally required payment, audit, and backup records handled under their own retention rules, so that account deletion is honest about what must remain.
137. As an Owner, I want the service to back up database and media data daily, so that an operational failure does not erase my Invitation.
138. As an operator, I want a documented restore procedure and a completed restore test before launch, so that backups are actionable rather than merely present.
139. As an Owner, I want upload validation to allow only approved formats and safe content, so that public media cannot introduce avoidable security risk.
140. As a visitor, I want responsive pages that meet WCAG 2.2 AA expectations, so that the Invitation is usable across devices and assistive technologies.

## Implementation Decisions

### Product and domain boundaries

- The launch product is one complete `Vowly Publish — 1 Year` offer: one Invitation, one year of Hosting entitlement, four templates, all launch features, up to 500 Guest records, up to 100 Gallery images, and 1 GB of media quota.
- A User may own multiple Invitations. Every purchase and Hosting entitlement is scoped to exactly one Invitation and is not transferable or pooled in MVP.
- The domain vocabulary is `User`, `Owner`, `Admin`, `Invitation`, `Event`, `Primary event`, `Guest`, `RSVP`, `Published invitation`, `Draft invitation`, `Hosting entitlement`, and `Unavailable invitation`. Do not introduce “studio” as a permission role.
- The launch market is Indonesia. Customer-facing presentation defaults to Indonesian (`id-ID`) and IDR, while text is translation-ready for future English support.
- An Event stores its own IANA time zone, defaulting to `Asia/Jakarta`; all event times and countdown calculations use that zone.

### Editor document and rendering

- Build the editor around a typed, versioned Invitation document with ordered top-level Sections and ordered Content blocks inside Sections.
- The Visual editor, authenticated Preview view, and public renderer consume the same document representation. The primary seam is editor command → serialized document → responsive renderer.
- Section types are registry-driven and include Cover, Couple, Countdown, Event schedule, Map/navigation, Love story, Gallery, Quote, Image + Text, Custom content, RSVP, QRIS/bank gifts, Guestbook, Contact person, and Divider.
- The launch editor supports add, reorder, duplicate, hide, remove, and property editing. Every drag operation has keyboard/single-pointer equivalents: Move Up, Move Down, Insert Before, Insert After, Duplicate, and Delete.
- Custom content remains a one-column container with approved blocks: Heading, Rich text, Image, Quote, Divider, and Button/link. It cannot contain arbitrary HTML, CSS, JavaScript, iframe, embed, system sections, or nested freeform layout.
- Grid blocks are constrained responsive presets, not arbitrary coordinate placement. They may arrange eligible blocks in curated one-, two-, or three-column layouts and must stack/reflow at smaller widths.
- Animation is limited to curated Animation presets such as none, fade, and slide/reveal behaviors. Presets must respect reduced-motion preferences and cannot contain arbitrary JavaScript or user-authored timelines.
- Enforce the approved Section limits: 20 top-level Sections; 100 total Gallery images; one active RSVP, event schedule, map/navigation, QRIS/bank gifts, Guestbook, Countdown, and Contact section; bounded content-section counts from the PRD.
- Draft autosave increments a draft revision. Concurrent edits must detect a stale revision and present a recoverable conflict rather than silently overwriting changes.
- Template changes transform only the Draft invitation. The current Published invitation remains unchanged. The editor presents transformed, unsupported, and omitted content for review before republishing.
- Deactivating a template prevents new selections and template changes but does not invalidate existing Invitations using it; those Invitations remain renderable and republishable.
- Preview viewports cover mobile, tablet, and desktop. Preview is authenticated and private.

### Publication lifecycle

- Keep Visibility, Hosting entitlement, Payment, and Published version as separate concepts.
- Visibility states are draft, published, unpublished, and expired. Hosting entitlement states are none, active, expired, and revoked. Payment states include pending, paid, failed, expired, and refunded.
- Publication requires a valid Draft invitation, one active Primary event, couple identity, Primary event title/date/time, an active Hosting entitlement, and explicit Owner confirmation that the content is ready and may be public.
- A successful payment never publishes automatically. Payment creates or activates the entitlement; the Owner must publish explicitly.
- Publishing validates the Draft invitation, creates an immutable Published invitation snapshot, and atomically makes that snapshot public. A failed publish leaves the previous Published invitation untouched.
- The public route renders only the latest Published invitation snapshot, never the mutable Draft invitation.
- Unpublishing preserves data and entitlement but does not pause or extend the paid period.
- An active renewal extends from the current entitlement end. A renewal after expiry starts when payment is verified.
- Full refund, reversal, or chargeback revokes the entitlement and makes the Invitation unavailable. Partial refunds and proration are out of scope.
- Invitation deletion makes the Invitation unavailable immediately and starts a 30-day recovery period. Restoration preserves data and the original entitlement end date. Permanent deletion removes customer-facing data after recovery, while required payment/audit/backup records follow their own retention rules.
- All unavailable public states use a neutral non-enumerating response. Public visitors do not learn whether an Invitation was unpublished, expired, deleted, suspended, or otherwise unavailable.

### URLs and public data

- The canonical public URL is path-based: `https://vowly.id/i/{slug}`. A slug may change while Draft-only and is immutable after first publication.
- Personalized links use opaque Guest tokens. Tokens are stored as secure hashes, are never accepted as browser-provided Guest IDs, and are immediately revoked when regenerated or when a Guest is archived.
- Public reads expose only the Published invitation document, public media URLs, event details, approved Guestbook messages, and validated Personalized-link context for that Guest.
- Public reads never expose Guest lists, private phone numbers, host notes, payment data, storage keys, raw/hashed tokens, or unrelated Guest RSVP state.
- Public writes support Generic RSVP, Personalized RSVP, and Guestbook submission. They require validation, origin/CSRF protection where applicable, invitation/IP/token rate limits, honeypot abuse controls, and non-sequential public identifiers.
- Invitations are share-by-link and carry `noindex`; there is no public Invitation directory or Invitation sitemap. Landing, demo, and support pages may be indexed.
- Public navigation uses Owner-provided external links rather than an embedded map provider.

### Guests and RSVP

- Guest identity belongs to an Invitation. RSVP records belong to one Invitation, one Event, and optionally one Guest.
- A Guest may represent a person or household. Required Guest data is full name; phone, group, and host-only notes are optional. Allowed attendees default to one and are bounded from one to 20 per Event.
- Each created/imported Guest receives one active Personalized link. Vowly provides copy/regenerate actions but does not deliver links through WhatsApp or email.
- CSV import is additive and begins with mapping/validation preview. Valid rows may be imported after confirmation; invalid rows receive a downloadable error report. Existing Guests are never overwritten or deleted automatically.
- Duplicate warnings use normalized phone matches or normalized name-plus-phone matches. Names alone do not auto-merge. If the Owner merges, the existing Guest remains canonical and imported non-empty values fill blanks unless conflicts are explicitly resolved.
- Guest archive revokes its Personalized link and prevents new responses while retaining RSVP history.
- Personalized RSVP identifies the Guest from the validated token and supports create/edit until the relevant Event begins in that Event's local time zone. After the RSVP cutoff, responses are read-only.
- Generic RSVP requires display name, status, and attendee count, is labelled Unmatched RSVP, is submit-once in MVP, and has a one-to-20 attendee bound.
- Multi-Event forms collect independent responses per Event. Existing responses for archived Events remain viewable/exportable but cannot be edited or newly submitted.
- Attendance reporting separates confirmed `attending` counts from `maybe` counts and unique responding households; it must not claim a universal combined headcount across overlapping Events.
- Owners may manually reconcile an Unmatched RSVP to a Guest. The system never auto-matches by name.
- Guest and RSVP exports include Owner-visible operational fields but exclude token secrets, payment secrets, storage internals, and unnecessary internal identifiers. Each export is audited.

### Guestbook, gifts, contacts, and media

- Any public visitor may submit a Guestbook message with a display name and bounded message text. Messages start `pending`; the Owner may approve, hide, or delete them. Visitors cannot edit after submission.
- Visitors can privately report an inappropriate Guestbook message. The report queues review without exposing the reporter publicly.
- Removing a Guestbook or other Section removes it from the Draft presentation but retains its underlying data. Re-adding the Section restores access; permanent data deletion is explicit.
- Display-only gifts support one QRIS image and multiple bank-account entries. Vowly does not receive, verify, or reconcile gift payments.
- Contact person details are public only when explicitly enabled by the Owner.
- Uploads allow JPEG, PNG, WebP, and AVIF images, with optional curated MP3 support excluded from MVP because launch has no background music. Validate extension and content signature, enforce size/dimension limits, generate random storage keys, strip EXIF, normalize orientation, keep objects outside the public web root, and generate responsive derivatives.
- Media referenced by any Published invitation remains available even if removed from the Draft. Storage cleanup waits until no Published version, recovery period, or other retention rule references it.

### Payment and infrastructure

- Isolate Midtrans behind a provider-neutral PaymentProvider boundary for checkout creation, webhook verification, status lookup, and manual refund workflow.
- Create a local pending Payment before checkout. Use the local reference for idempotency. Verify webhook signature, amount, currency, order reference, and expected product before transitioning Payment.
- Allow one active pending checkout per Invitation. Failed/expired attempts may be retried. The first verified success activates the entitlement; duplicate or late notifications are no-ops.
- Use PostgreSQL for primary data, Redis for queues/cache, object storage/CDN for media, and Docker Compose on a VPS. Workers handle slow follow-up work such as receipts and media derivatives.
- Back up database and media data daily for 30 days, document restoration, and complete a restore test before launch. Do not promise an unmeasured customer-facing RPO/RTO.

### Roles, safety, and accessibility

- Use only `owner` and `admin` roles in MVP. Editor membership remains schema-ready but hidden behind a future feature flag.
- Admin support is read-only by default, requires a reason, and audits actor, target Invitation, reason, timestamp, and action. Mutations are audited separately.
- Admin may force an Invitation unavailable for abuse, legal, security, or operational reasons while preserving Owner data and notifying the Owner when appropriate.
- Owner publication requires confirmation of public readiness and responsibility for rights/consent covering uploaded media, public Contact details, and public gift details.
- Target WCAG 2.2 AA for platform UI, the Visual editor, public Invitations, RSVP forms, and Guestbook forms. Ensure semantic structure, labels, focus, contrast, keyboard alternatives, screen-reader announcements, and reduced-motion behavior.

## Testing Decisions

- Tests must assert external behavior at the highest available seam. Do not couple tests to internal class names, database implementation details, or incidental component structure.
- The primary seam is the serialized Invitation document between editor commands and responsive rendering. Tests should prove that adding/editing/reordering/hiding/removing Sections and Content blocks produces the expected document and that authenticated Preview and public rendering honor the same document at mobile, tablet, and desktop viewports.
- The first application-level acceptance path should cover: create Invitation, choose template, edit draft, preview responsively, upload media, import Guests, verify payment, explicitly publish, resolve the public URL, open a Personalized link, submit RSVP, and export results.
- Test the editor document schema and validation with external behavior: valid block operations, Section limits, Grid reflow, Animation presets, reduced-motion behavior, stale draft conflict, template transformation review, and publish readiness.
- Test Publication and entitlement transitions through application-level behavior: payment does not publish, first verified webhook activates exactly one entitlement, duplicate webhook is harmless, unpublish preserves data, expiry/revocation makes the public route unavailable, renewal preserves active paid time, and deletion recovery does not extend hosting.
- Test public data boundaries with requests against generic and Personalized routes. Prove that a visitor cannot obtain Guest lists, private fields, other Guests' RSVP state, token material, payment data, or storage internals.
- Test CSV import using valid rows, invalid rows, partial success, normalized duplicate warnings, explicit merge conflicts, and additive behavior.
- Test RSVP behavior by Event: Personalized and Generic submissions, attendee bounds, edit cutoff, archived Events, Unmatched RSVP reconciliation, `attending`/`maybe` reporting, and export contents.
- Test Guestbook moderation and reporting through public submission plus Owner/Admin moderation behavior.
- Test PaymentProvider behavior with provider-sandbox or contract fixtures for signature validation, wrong amount/currency/reference, retries, duplicate notifications, refunds, and late notifications after deletion.
- Test upload safety with allowed/denied formats, MIME/content mismatch, size and dimension limits, EXIF stripping, generated derivatives, generated storage keys, and media retention while referenced by a Published version.
- Test authorization and audit behavior for Owner, Admin, public visitor, Generic RSVP visitor, Personalized Guest, and archived/deleted records.
- Add browser-level accessibility and responsive smoke coverage for keyboard editor flows, focus management, reduced motion, public forms, and mobile/tablet/desktop rendering.
- There is no existing application or test suite in the repository. Establish the initial test conventions around application-level integration/feature tests, focused domain validation tests, and a small browser smoke suite rather than inventing parallel seams.

## Out of Scope

- Custom domains and subdomain-based public URLs.
- QR check-in and offline check-in.
- Seating plans and table planning.
- Official WhatsApp Business API, bulk WhatsApp messaging, invitation delivery automation, and RSVP reminder campaigns.
- Vendor workspace, wedding organizer/client workspace, white-labeling, client approval workflow, and studio-specific roles.
- Spouse/editor collaboration, real-time co-editing, comments, and collaboration workflows.
- A true freeform Figma-style coordinate canvas, arbitrary nested drag-and-drop containers, freeform positioning, custom CSS/HTML/JavaScript, embeds, iframes, and user-authored animation timelines.
- User-created reusable sections, template marketplace, third-party templates, and admin visual template authoring.
- More than four launch templates.
- Feature-matrix plans, add-on pricing, pooled credits, account-wide entitlements, transferable purchases, and partial refunds/proration.
- Platform-collected or reconciled QRIS/bank payments.
- Background music uploads and arbitrary user audio. A curated royalty-cleared track list remains a future option.
- Rich text beyond paragraphs, bold, italic, links, and line breaks.
- Generic RSVP editing, arbitrary RSVP questions, meal choices, dietary requirements, and guest open-tracking dashboards.
- XLSX or Google Sheets imports.
- Rich analytics beyond operational counts.
- Public search/listing of Invitations.
- Custom map SDK embedding.
- Native guest notifications, invitation sending, marketing campaigns, or guest-facing accounts.
- A formal customer-facing RPO/RTO promise before operational measurements exist.

## Further Notes

- This spec synthesizes the approved `prd.md` baseline plus the confirmed Visual editor clarification. Where the earlier PRD said “structured top-level section builder,” this spec makes the intended experience explicit: visual direct manipulation over a constrained Section/Content-block document.
- The domain glossary and ADRs are the durable source for terms and hard-to-reverse boundaries. In particular, preserve the path-based URL, invitation-scoped entitlement, immutable Published invitation, neutral unavailable state, event-local time zones, share-by-link privacy, and constrained Visual editor decisions.
- The expected launch sequence is foundations/auth and schema, templates/rendering, Visual editor, media/content, Publication/public pages, Guests, RSVP, Payment/entitlement, Admin/support, accessibility/security, operations, and pilot launch.
- The next flow is `/to-tickets`, which should split this spec into dependency-aware local issues under `.scratch/vowly-mvp/issues/` and mark each generated ticket `ready-for-agent`.
