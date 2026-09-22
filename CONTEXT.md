# Vowly

Vowly is a paid publishing service for personalized wedding invitations in Indonesia. The domain separates an invitation's content, public availability, hosting entitlement, payment, guests, events, and responses.

## Actors and ownership

**User**:
A login identity that can own one or more invitations.
_Avoid_: account, customer, studio user

A User may draft and preview before email verification, but must be verified before checkout or public publication.

**Owner**:
The User who owns an Invitation and controls its content, publication, guest data, and payment-related actions.
_Avoid_: customer, studio role

**Admin**:
A Vowly support operator with audited access to customer data for support and operational work.
_Avoid_: staff user when referring to the domain role

## Invitation and publication

**Invitation**:
A customer's wedding invitation product, including its event details, content, media, guest operations, and publication state.

One User may own multiple Invitations. Each Invitation has its own publication and hosting entitlement.

**Event**:
A scheduled ceremony, reception, or other wedding occasion belonging to an Invitation.
_Avoid_: occasion when referring to a record in the invitation

Each Event has a local IANA time zone, defaulting to `Asia/Jakarta`; dates, times, and countdowns use that Event time zone.

**Primary event**:
The one Event designated as the main occasion for an Invitation. Countdown and default invitation emphasis refer to this Event.

An Invitation must have exactly one active Primary event before it can be published.

**Publication**:
The explicit act of making an Invitation available through its public URL after payment entitlement and invitation content requirements are satisfied.
_Avoid_: payment, activation

An Invitation's slug may be chosen or changed while it is a draft. After first publication, the slug is fixed for the life of that Invitation.
Publication requires the Owner to confirm that the Invitation is ready to be public and that its displayed content and uploaded media may be published.

**Hosting entitlement**:
The time-bounded right for an Invitation to remain publicly available. Payment creates or renews this right; payment and entitlement are separate concepts.
_Avoid_: subscription, plan status

An active renewal extends from the current entitlement end. A renewal after expiry starts when payment is verified.
Unpublishing does not pause or extend the entitlement.

**Published invitation**:
The version of an Invitation currently shown to public visitors after the Owner explicitly publishes it.

**Draft invitation**:
The Owner's mutable working version. It may change while a different Published invitation remains public.

**Publishable invitation**:
A Draft invitation with the minimum required couple identity and a valid Primary event with title, date, and time. Optional content does not affect publishability.

## Guests and responses

**Guest**:
A person or household invited to an Invitation and optionally associated with one or more Events.

Guest identity belongs to the Invitation, not to an individual Event. A Guest's allowed-attendee limit is evaluated separately for each Event.

**Personalized link**:
An opaque public link that identifies one Guest without exposing the guest list or accepting browser-supplied guest identity.
_Avoid_: guest URL when referring to the domain concept

Regenerating a Personalized link immediately revokes the previous link.
Each Guest receives one active Personalized link when created or imported; Vowly does not deliver it to the Guest.

**Generic RSVP**:
An RSVP response that is not associated with a known Guest and therefore requires its own display name and attendee count.

**Personalized RSVP**:
An RSVP response associated with a Guest through that Guest's validated Personalized link.

**RSVP**:
A Guest's or visitor's response to attendance for one Event. An RSVP is event-specific rather than a single invitation-wide answer.

`attending` contributes to confirmed attendance; `maybe` is reported separately and never counted as confirmed attendance.

**Unmatched RSVP**:
A Generic RSVP that has not been associated with a Guest. The Owner may reconcile it manually, but the system does not infer identity automatically.

**Guestbook message**:
A public visitor's message for the couple that remains private until the Owner approves it.

A Guestbook message moves through `pending`, `visible`, or `hidden`. Visitors cannot edit messages after submission.

## Commercial model

**Vowly Publish — 1 Year**:
The single launch product: one Invitation's public hosting entitlement for one year, with the complete launch feature set.

**Invitation-scoped purchase**:
A purchase that belongs to exactly one Invitation. It cannot be transferred or pooled in the MVP.

**Entitlement reversal**:
The loss of hosting eligibility after a full refund, payment reversal, or equivalent administrative action. It makes the Invitation unavailable publicly without erasing its Owner's retained data.

## Invitation changes

**Template change**:
A draft transformation from one Vowly template to another. It never mutates the currently Published invitation; the Owner must review and explicitly republish the transformed draft.

If the transformation changes or omits content, the Owner must review the reported changes before republishing.

**Template availability**:
Whether a template can be selected for new Invitations or template changes. Deactivating a template does not invalidate Invitations already using it.

**Ownership transfer**:
Changing the User who owns an Invitation. Self-service ownership transfer is not available in the MVP; exceptional Admin corrections are audited support actions.

**Support access**:
An Admin's intentional access to a customer's Invitation for a stated operational reason. Support access is read-only by default and audited, with mutations recorded separately.

**Admin intervention**:
An audited Admin action that makes an Invitation unavailable for abuse, legal, security, or operational reasons while preserving its Owner data. The Owner is notified when appropriate.

**Invitation deletion**:
An Owner-initiated removal that immediately ends public availability and enters a 30-day recovery period before permanent deletion of customer-facing data.

Restoring during recovery restores the Invitation and its retained data without extending its hosting entitlement.

**Unavailable invitation**:
The neutral public state shown when an Invitation is unpublished, expired, deleted, or otherwise not eligible for public viewing. It does not reveal the underlying cause.

**Share-by-link invitation**:
An Invitation intended to be reached through a link shared by the Owner, not through search results, a public Vowly directory, or automated guest messaging.

**Media retention**:
Media remains available while any Published invitation references it, even if the Owner removes it from the Draft invitation.

**Event archive**:
The non-destructive removal of an Event from active invitation use while preserving its responses and reporting history. An archived Event cannot accept new RSVPs.

Historical responses for an archived Event are viewable and exportable but not editable.

**Additive guest import**:
A CSV import that validates and previews new Guest records without replacing or deleting existing Guests. Potential duplicates are warnings requiring an explicit Owner decision.

When merged, the existing Guest remains canonical; imported non-empty values fill blank fields only unless the Owner explicitly resolves a conflict. Invalid rows are reported rather than silently discarded.

**Owner export**:
A CSV export of operational Guest and RSVP data available to the Owner. It excludes personalized-link secrets, payment secrets, and storage internals, and each export is audited.

**RSVP cutoff**:
The start of an Event in that Event's local time zone. Personalized RSVP responses become read-only at the cutoff while remaining available for history and export.

**Guest archive**:
The non-destructive removal of a Guest from active guest operations. It revokes the Guest's Personalized link and prevents new responses while retaining RSVP history.

**Section removal**:
Removing a section from the Draft invitation's presentation without deleting the data owned by that section. Re-adding the section restores access to retained data; permanent deletion is a separate explicit action.

**Visual editor**:
The Owner-facing editor for composing an Invitation through a visual, responsive representation of its structured content.

**Section**:
An ordered top-level container in an Invitation. A Section groups related Content blocks and can be added, reordered, duplicated, hidden, or removed.

**Content block**:
A typed item inside a Section, such as text, image, quote, button, divider, or Grid block. Content blocks follow the rules of their containing Section and template.

**Grid block**:
A responsive preset for arranging multiple Content blocks in columns that reflow on smaller screens. It is not a freeform canvas or arbitrary coordinate system.

**Animation preset**:
A curated visual entrance or emphasis behavior applied to an eligible Section or Content block. It has a reduced-motion-safe behavior and does not contain arbitrary user JavaScript.

**Preview viewport**:
An Owner-selected responsive presentation size for checking an Invitation at mobile, tablet, or desktop dimensions before publication.

**Cover interaction**:
An optional, accessible opening step before the main Invitation content. It may require an explicit Open invitation action but cannot prevent keyboard, screen-reader, or direct access to critical content.

**Display-only gifts**:
Owner-entered QRIS and bank details shown to visitors without Vowly receiving, verifying, or reconciling a payment.

**Content responsibility**:
The Owner's responsibility to have the rights and consent needed to publish uploaded media and public contact or gift details. Vowly provides validation, support, and takedown handling but does not pre-clear every upload.

**Guestbook report**:
A visitor's request for review of an inappropriate Guestbook message. The report is private and sends the message to moderation without exposing the reporter publicly.

**Account deletion**:
The removal of a User after all owned Invitations have completed their recovery/privacy lifecycles. Required payment, audit, and backup records may remain under their own retention rules.

**Automated notification**:
A platform message needed for account access, payment, or entitlement/publication status. Guest invitations, RSVP reminders, guestbook notifications, and marketing messages are not launch notifications.

## Regional defaults

**Launch locale**:
Indonesian (`id-ID`) presentation for customer-facing copy, dates, times, and numbers. The product remains translation-ready for future English support.

**Launch currency**:
Indonesian rupiah (IDR), the only customer-facing currency in the MVP.

**Contact person**:
A person the Owner explicitly chooses to expose for invitation-related contact, with an optional phone or WhatsApp link.

Contact details are public only when the Owner enables the contact.

**Navigation link**:
An Owner-provided external map or navigation URL associated with a venue. Vowly does not own or embed the map experience in the MVP.

## Launch constraints

**Accessibility target**:
WCAG 2.2 AA for platform UI, the Owner editor, public Invitation pages, RSVP forms, and Guestbook forms, including keyboard alternatives for drag interactions.

**Backup expectation**:
Daily database and media backups retained for 30 days, with documented restore procedures and a restore test before launch. Vowly does not promise an unmeasured customer-facing RPO or RTO in the MVP.
