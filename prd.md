# Vowly MVP — Visual Invitation Builder

## Product intent

Vowly is a visual invitation builder for couples in Indonesia. An Owner creates a polished, personalized wedding Invitation by arranging Sections, Containers, Grid layouts, and Content blocks in a visual editor.

The editor should feel similar to a lightweight Figma or Webflow experience, while the published result remains responsive, accessible, secure, and maintainable. The MVP uses structured visual composition rather than arbitrary pixel-level design.

The MVP validates this proposition:

> Couples will use a visual builder to create and publish a premium, personalized wedding Invitation without needing a designer or generic website tool.

Payment is deferred. The MVP does not include Midtrans, Hosting entitlements, renewals, refunds, or payment-gated publication.

## Core user journey

User registers → creates an Invitation → opens the visual editor → adds Sections and Content blocks → adjusts Grid, styles, animations, and audio → previews mobile/tablet/desktop layouts → saves a Draft → explicitly publishes → shares the public URL.

## MVP editor

The editor provides:

- One Invitation page in the initial release.
- Ordered Sections.
- Containers and one-to-three-column Grid presets.
- Text, Heading, Image, Button/link, Quote, Divider, Countdown, RSVP form, Guestbook, and Music blocks.
- Section and block add, move, duplicate, hide, and delete actions.
- Responsive mobile, tablet, and desktop Preview viewports.
- Basic typography, color, spacing, alignment, border, and background controls.
- Curated animation presets such as none, fade, and slide/reveal.
- One audio track per Invitation with explicit play/pause controls.
- Undo and redo.
- Draft autosave and stale-revision conflict detection.
- Authenticated Preview and explicit publication.

The editor is visually direct and interactive, but the layout model is structured:

- Blocks flow inside Containers and Grid columns.
- Grid columns stack on smaller screens.
- User-authored arbitrary HTML, CSS, JavaScript, or embeds are not accepted.
- Pixel-level absolute positioning and arbitrary coordinate canvases are deferred.

## Invitation content

The MVP supports:

- Couple identity.
- Multiple Events with one active Primary event.
- Event date, time, local IANA time zone, venue, and external Navigation link.
- Public Contact person details when explicitly enabled.
- Gallery and image media.
- Display-only QRIS and bank details.
- Guest records and Guest groups.
- Personalized links.
- Event-level Personalized RSVP.
- Generic RSVP as an Unmatched RSVP.
- Moderated Guestbook messages.
- CSV Guest and RSVP exports.

## Publication

An Owner can publish without payment in the MVP.

Publication:

- Validates the Draft.
- Creates an immutable Published invitation version.
- Makes that version available at the canonical path-based URL.
- Keeps later Draft edits private until the Owner publishes again.
- Leaves the current Published invitation unchanged if validation fails.

The canonical public URL is https://vowly.id/i/{slug}. The slug may change while Draft-only and becomes fixed after first publication.

## Technical stack

- Laravel 13 modular monolith.
- Official Laravel React Starter Kit.
- React 19, TypeScript, Inertia 3, Tailwind CSS 4, shadcn/ui, and Vite.
- Laravel Fortify through the starter kit for registration, login, password reset, and email verification.
- PostgreSQL for relational data and versioned design-document JSON.
- Redis for queues, caching, rate limiting, and background work.
- S3-compatible object storage and CDN for image and audio media.
- Docker Compose deployment on a VPS.
- Playwright browser smoke tests and Laravel application-level feature tests.

The MVP does not include a payment provider or payment adapter. Payment may be added later as an independent publication prerequisite without changing the editor document model.

## Initialized project foundation

The Laravel base project has now been initialized. The package manifests and lockfiles are the source of truth for exact versions; the current baseline includes:

- Laravel Framework 13.33.0 on PHP 8.4.25.
- Inertia Laravel 3.3.4 and Inertia React 3.7.1.
- React 19.3.0 and React DOM 19.3.0.
- TypeScript 5.9.3.
- Tailwind CSS 4.3.3 with the Tailwind Vite plugin.
- Vite 8.3.0 and Vite Plus 0.3.0.
- Laravel Fortify 1.39.0 for authentication.
- Laravel Wayfinder 0.1.21 with its Vite plugin for typed route helpers.
- shadcn/ui components configured with the New York style, Radix primitives, and Lucide icons.
- Pest 5.2.1, Larastan 3.12.2, Pint 1.32.1, Laravel Boost 2.9.1, Pail, Sail, and the Laravel development tooling.

The initialized scaffold currently provides authentication, email verification, password reset, two-factor authentication, passkeys, profile/security/appearance settings, Teams, team membership, team invitations, and a team-scoped dashboard. These are starter-kit capabilities, not Vowly domain decisions. The Vowly domain continues to use User, Owner, and Admin; Teams must not be interpreted as a Studio role.

The current local environment defaults to SQLite, database-backed sessions/cache/queues, local filesystem storage, log mail, and UTC. The target Vowly infrastructure remains PostgreSQL, Redis, object storage/CDN, and Docker Compose; those services are not configured by the base scaffold yet.

No Vowly-specific Invitation, Design document, Canvas, Event, Guest, RSVP, or Published invitation implementation exists yet. The existing tests cover the initialized starter-kit behavior and provide the testing conventions for the first Vowly feature.

## Success criteria

- An Owner can create a complete Invitation without writing code.
- The editor can produce a responsive public Invitation from one serialized design document.
- Draft edits never silently change the current Published invitation.
- The editor is usable with keyboard alternatives for pointer interactions.
- Public forms expose only the data needed for their operation.
- The product can be operated without payment infrastructure in the first release.

## Deferred product areas

- Payment and Hosting entitlements.
- Custom domains and subdomain URLs.
- Collaboration and real-time co-editing.
- Vendor workspaces and studio-specific roles.
- WhatsApp automation and guest messaging.
- QR check-in.
- Seating plans.
- Analytics beyond operational counts.
- Template marketplace and third-party templates.
- Multi-page Invitations.
- Arbitrary form builders.
- Arbitrary freeform pixel positioning.
