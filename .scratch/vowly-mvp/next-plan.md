# Next Plan — Publishable Invitation MVP

Status: proposed

## Purpose

The structured editor foundation is complete: an Owner can create and manage Designs, compose Sections and supported blocks, save a validated document, upload private media, and inspect a private responsive Preview.

The next phase should make the product useful end-to-end. An Owner should be able to prepare the minimum information required for a real wedding invitation, publish a valid version through a shareable link, and receive RSVP responses.

This is a planning artifact for the next Ask Matt flow. It is not a replacement for `spec.md` and should be refined through `grill-with-docs`, then converted into the next spec and tickets.

## Recommended next flow

1. Run `grill-with-docs` to settle product decisions and expose missing edge cases.
2. Run `to-spec` to update the product specification and domain contract.
3. Run `to-tickets` to split the approved scope into dependency-ordered implementation tickets.
4. Implement one ticket at a time with tests and UI verification after each coherent slice.

Do not start implementation from this document until the product decisions below are confirmed.

## Proposed phase: complete the public invitation loop

### 1. Invitation event and publish prerequisites

Add the minimum structured wedding data needed by the public invitation:

- Events with a date, time, venue details, navigation link, and IANA timezone.
- Exactly one active Primary event before publication.
- Owner-editable invitation metadata such as title, couple names, and public slug.
- Validation that reports missing publication prerequisites before the Owner enters the publish flow.
- Indonesian (`id-ID`) defaults for customer-facing dates, times, and numbers.

The data should remain separate from visual layout, while the Design document may reference approved event and invitation values through typed blocks.

### 2. Public renderer and publication lifecycle

Introduce the first public read-only invitation path:

- A Draft remains private and editable by the Owner.
- The Owner explicitly confirms and publishes a valid Draft.
- Publication creates an immutable Published invitation version.
- The public URL uses `/i/{slug}` and is share-by-link only.
- The public renderer consumes the same versioned document contract as Preview.
- Public pages use `noindex` and do not appear in a Vowly directory or sitemap.
- The Owner can unpublish or replace the current Published version without mutating an existing immutable version.
- An unavailable public invitation returns a neutral response without exposing internal state.

The first public renderer should support the block types that already exist and fail safely for unsupported or invalid content.

### 3. Minimum public content blocks

Extend the editor only with blocks needed to make a coherent invitation, keeping each block typed and bounded:

- Heading or couple-name block.
- Event details block backed by the Event model.
- Countdown block backed by the Primary event timezone.
- Venue/navigation block using an approved external URL.
- A small set of style settings required for readable public output.

Avoid turning this phase into a general-purpose design system. Do not add arbitrary CSS, freeform positioning, custom HTML, or a large block catalog.

### 4. RSVP response flow

Add the first public interaction loop:

- A typed RSVP Form block that can be placed in the Design.
- Generic RSVP responses require a display name and attendee count.
- RSVP responses are associated with an Event and support the approved attendance states.
- Public submission validates input, limits abuse, and gives a clear success or failure state.
- Owner-facing responses show enough information to manage attendance without exposing private data publicly.
- Responses are scoped to the Invitation and never accepted through an arbitrary client-supplied Invitation identity.

Personalized Guest links, guest imports, exports, notifications, and advanced RSVP workflows should remain separate follow-up work unless the grilling phase shows that they are required for the first usable release.

## Suggested ticket dependency order

1. Define publication and RSVP decisions, including Draft/Published behavior and unpublish semantics.
2. Add Event and invitation metadata models, ownership rules, and publication prerequisites.
3. Add the public renderer for the existing validated document contract.
4. Add immutable Published invitation versions and public share-by-link routing.
5. Add the minimum event-related content blocks and renderer support.
6. Add the typed RSVP Form block and public response submission.
7. Add the Owner RSVP response view and basic operational safeguards.
8. Perform an accessibility, privacy, and end-to-end product-loop pass.

The exact ticket boundaries should be decided after `to-spec`; this order is intended to keep domain prerequisites ahead of UI features and public behavior ahead of RSVP submission.

## Decisions to resolve during grilling

- Is publication part of the first public MVP, or should the next milestone stop at a complete private editor?
- Is a published version immutable forever, or may the Owner replace the current version while preserving prior versions internally?
- What exact fields are required for the first Event and venue experience?
- Should the first RSVP flow be generic only, or must personalized Guest links be included?
- Which attendance states and attendee-count rules are required for launch?
- Should an RSVP Form be removable from a Design after responses exist, and what happens to historical responses?
- What rate limit, abuse protection, and retention policy are required for public submissions?
- Which minimum block set makes a published invitation feel complete without expanding into templates and advanced styling?

## Explicit non-goals for this phase

- Payment, Midtrans, checkout, hosting entitlements, and payment-gated publication.
- Music, audio uploads, autoplay behavior, and animation presets.
- Personalized links, guest imports, exports, guest notifications, and QR check-in.
- Guestbook moderation, gifts, seating plans, WhatsApp integration, and analytics.
- Templates, template marketplace, reusable Sections, custom fonts, arbitrary CSS, and freeform Figma-style placement.
- Real-time collaboration, Teams, comments, and public edit links.

## Definition of ready for implementation

This plan is ready to become tickets when:

- The publication lifecycle and public URL behavior are unambiguous.
- The Event and RSVP data contracts are written into the project spec.
- Public and private authorization boundaries are defined for every new route.
- The supported public block list and renderer fallback behavior are explicit.
- RSVP validation, abuse controls, privacy, and retention expectations are agreed.
- Each ticket has a narrow acceptance boundary, relevant tests, and a clear dependency.

