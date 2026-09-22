# Vowly

Vowly is a visual invitation builder for personalized wedding Invitations in Indonesia. An Owner composes a responsive Invitation through a visual editor, saves a Draft, previews it privately, and explicitly publishes an immutable Published invitation version through a share-by-link public URL.

The MVP does not include payment or Hosting entitlements. Payment and paid hosting are future commercial concepts that may later gate publication without changing the Invitation design document.

## Actors and ownership

**User**:
A login identity that can own one or more Invitations.
_Avoid_: account, customer, studio user

A User may draft and preview before email verification, but must be verified before public publication.

**Owner**:
The User who owns an Invitation and controls its content, publication, Guest data, and media.
_Avoid_: customer, studio role

**Admin**:
A Vowly support operator with audited access to Owner data for support and operational work.
_Avoid_: staff user when referring to the domain role

## Invitation and visual composition

**Invitation**:
A wedding invitation product owned by a User. It includes its Events, Guests, RSVP responses, media, Guestbook messages, design document, Draft state, and Published invitation versions.

One User may own multiple Invitations. Each Invitation has its own design document and publication state.

**Design document**:
The structured representation of an Invitation's visual composition. It contains ordered Sections, Containers, Grid layouts, Content blocks, style settings, responsive settings, Animation presets, and optional Music configuration.

**Canvas**:
The Owner-facing visual presentation of the Design document during editing. The MVP Canvas provides direct selection and manipulation within structured responsive layout; it is not an arbitrary coordinate drawing surface.

**Section**:
An ordered top-level container in an Invitation. A Section groups related Containers and Content blocks and can be added, reordered, duplicated, hidden, or removed.

**Container**:
A layout boundary inside a Section that groups Content blocks or an approved Grid.

**Grid**:
A constrained responsive layout with one, two, or three columns. Grid columns reflow or stack at smaller Preview viewports.

**Content block**:
A typed item inside a Section or Container, such as Heading, Text, Image, Button/link, Quote, Divider, Countdown, Gallery, Couple, Event schedule, Navigation, Contact person, RSVP Form, Guestbook, Gifts, or Music.

**Form block**:
A typed public interaction block with a known data contract. MVP Form blocks include RSVP and Guestbook. Arbitrary Owner-defined fields and workflows are not part of the MVP.

**Style setting**:
An allowlisted visual property such as typography, color, background, spacing, border, radius, alignment, or visibility. Style settings use bounded values so the public renderer remains safe and maintainable.

**Responsive setting**:
An allowlisted change to a Design document property at an approved mobile, tablet, or desktop Preview viewport.

**Animation preset**:
A curated visual behavior applied to an eligible Section or Content block. It has reduced-motion behavior and does not contain arbitrary user JavaScript or user-authored timelines.

**Music**:
One optional audio track attached to an Invitation. Music has explicit play/pause controls and does not guarantee browser-blocked autoplay.

## Publication

**Draft**:
The Owner's mutable working Design document. It may change while a different Published invitation version remains public.

**Preview**:
An authenticated, private presentation of the Draft Design document at an Owner-selected responsive viewport.

**Publication**:
The explicit act of making a valid Draft available through its public URL. In the MVP, publication does not require payment or a Hosting entitlement.

An Invitation's slug may be chosen or changed while the Invitation is Draft-only. After first publication, the slug is fixed for the life of that Invitation.

Publication requires the Owner to confirm that the content is ready to be public and that the displayed content and uploaded media may be published.

**Published invitation**:
The immutable version of an Invitation currently shown to public visitors after the Owner explicitly publishes it.

**Unavailable invitation**:
The neutral public state shown when an Invitation is unpublished or otherwise not eligible for public viewing. It does not reveal internal state.

**Hosting entitlement**:
A future time-bounded right for an Invitation to remain publicly available after payment. It is not implemented in the MVP.

**Vowly Publish — 1 Year**:
A future commercial product concept for paid publication and hosting. It is not part of the current MVP.

## URLs and privacy

**Share-by-link Invitation**:
An Invitation intended to be reached through an Owner-shared link, not through search results, a public Vowly directory, or automated guest messaging.

The canonical public URL is https://vowly.id/i/{slug}. Public Invitations use noindex and Vowly does not expose an Invitation directory or Invitation sitemap.

**Personalized link**:
An opaque public link that identifies one Guest without exposing the Guest list or accepting browser-supplied Guest identity.
_Avoid_: guest URL when referring to the domain concept

Regenerating a Personalized link immediately revokes the previous link.

## Guests and responses

**Event**:
A scheduled ceremony, reception, or other wedding occasion belonging to an Invitation.
_Avoid_: occasion when referring to a record in the Invitation

Each Event has a local IANA time zone, defaulting to Asia/Jakarta; dates, times, countdowns, and RSVP cutoffs use that Event time zone.

**Primary event**:
The one Event designated as the main occasion for an Invitation. Countdown and default Invitation emphasis refer to this Event.

An Invitation must have exactly one active Primary event before it can be published.

**Guest**:
A person or household invited to an Invitation and optionally associated with one or more Events. Guest identity belongs to the Invitation, not to an individual Event.

**Generic RSVP**:
An RSVP response that is not associated with a known Guest and therefore requires its own display name and attendee count.

**Personalized RSVP**:
An RSVP response associated with a Guest through that Guest's validated Personalized link.

**RSVP**:
A Guest's or visitor's response to attendance for one Event. An RSVP is event-specific rather than a single Invitation-wide answer.

attending contributes to confirmed attendance; maybe is reported separately and never counted as confirmed attendance.

**Unmatched RSVP**:
A Generic RSVP that has not been associated with a Guest. The Owner may reconcile it manually, but the system does not infer identity automatically.

**Guestbook message**:
A public visitor's message for the couple that remains private until the Owner approves it.

A Guestbook message moves through pending, visible, or hidden. Visitors cannot edit messages after submission.

## Media and responsibility

**Media retention**:
Media remains available while any Published invitation version references it, even if the Owner removes it from the Draft.

**Display-only gifts**:
Owner-entered QRIS and bank details shown to visitors without Vowly receiving, verifying, or reconciling a payment.

**Content responsibility**:
The Owner's responsibility to have the rights and consent needed to publish uploaded media and public Contact or gift details.

## Administration and operations

**Support access**:
An Admin's intentional access to an Owner's Invitation for a stated operational reason. Support access is read-only by default and audited, with mutations recorded separately.

**Admin intervention**:
An audited Admin action that makes an Invitation unavailable for abuse, legal, security, or operational reasons while preserving Owner data. The Owner is notified when appropriate.

**Owner export**:
A CSV export of operational Guest and RSVP data available to the Owner. It excludes Personalized-link secrets, payment secrets, and storage internals, and each export is audited.

## Regional defaults and constraints

**Launch locale**:
Indonesian (id-ID) presentation for customer-facing copy, dates, times, and numbers. The product remains translation-ready for future English support.

**Navigation link**:
An Owner-provided external map or navigation URL associated with a venue. Vowly does not own or embed the map experience in the MVP.

**Accessibility target**:
WCAG 2.2 AA for platform UI, the Owner editor, public Invitation pages, RSVP forms, and Guestbook forms, including keyboard alternatives for pointer interactions.

**Backup expectation**:
Daily database and media backups retained for 30 days, with documented restore procedures and a restore test before launch. Vowly does not promise an unmeasured customer-facing RPO or RTO in the MVP.
