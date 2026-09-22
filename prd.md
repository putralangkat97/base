I’ve applied the recommendations and resolved the ambiguous MVP decisions below. This becomes the **recommended implementation baseline** for Vowly: a focused, launchable product rather than an overextended invitation platform.

## Approved MVP decisions

### Product scope

| Area | Decision |
|---|---|
| Primary buyer | Couples in Indonesia |
| Secondary user | Small invitation studios using a normal owner account |
| Launch market | Indonesia first; data model and UI copy remain English-ready |
| Commercial model | One-time payment per published invitation |
| Hosting term | One year from verified payment |
| Default domain | `https://{slug}.vowly.id` or `https://vowly.id/i/{slug}`; choose one canonical model before build |
| Editor model | Structured top-level section builder |
| Custom layouts | One-column custom content section; preset two-column Image + Text section only |
| Templates at launch | Four polished templates |
| Guest operations | Guest CRUD, CSV import, guest groups, personalized links, per-event RSVP, exports |
| QRIS/gifts | Display-only QRIS/bank information; no payment collection or reconciliation |
| QR check-in | Deferred to Phase 2 |
| Vendor workspace | Deferred to Phase 2 |
| Custom domains | Deferred to Phase 2 |
| Official WhatsApp API | Deferred to Phase 2 |
| Collaboration | Owner only at initial launch; invited editor feature behind a feature flag for MVP.1 |
| Payment provider | Midtrans adapter first, behind a provider-neutral payment interface |
| Infrastructure | Laravel modular monolith, PostgreSQL, Redis, object storage/CDN, Docker Compose on VPS |

The purpose of the first launch is to validate this proposition:

> Couples will pay once to publish a premium, personalized, mobile-first wedding invitation that makes guest sharing and RSVP management simpler than using generic website tools and spreadsheets.

## Revised lifecycle

Do **not** use one status field to represent preview mode, payments, publication, and expiry. Those are separate concerns.

```text
Visibility
draft → published → unpublished → expired

Hosting entitlement
none → active → expired
               └→ revoked

Payment
pending → paid
pending → failed
pending → expired
paid → refunded

Versions
mutable draft document → immutable published version
```

### Publication rule

An invitation is publicly visible only when all four conditions are true:

```text
visibility = published
AND entitlement.status = active
AND hosting_expires_at > now()
AND published_version_id is not null
```

### Publishing flow

```text
Owner edits draft
  → autosave draft document
  → opens authenticated preview
  → clicks Publish

If no active entitlement:
  → display single paid-plan checkout
  → create pending payment
  → redirect/open Midtrans payment flow
  → verified webhook marks payment paid
  → create one-year active entitlement
  → redirect user to “Ready to publish” page

Owner clicks Publish again
  → validate draft document
  → snapshot immutable published version
  → set published_version_id
  → set visibility = published
  → invalidate page/CDN cache
  → expose public URL
```

This intentionally requires an explicit publish after payment. It prevents accidental public launches immediately after a payment succeeds.

### Unpublish and expiry

```text
Unpublish:
- The owner may unpublish at any time.
- The public route returns HTTP 404 or a generic “not available” page.
- Draft, published version, guests, RSVPs, and media remain available to owner.

Hosting expiry:
- Public invitation becomes unavailable at `hosting_expires_at`.
- Public visitor sees a neutral “This invitation is no longer available” page.
- Owner sees renewal and export options after login.
- Data remains retained for 12 months after hosting expiry unless deleted sooner.
```

## Commercial plan

Launch with **one product**. Avoid a feature-matrix of Basic/Premium/Gold plans before you know what users value.

```text
Product: Vowly Publish — 1 Year

Includes:
- One published wedding invitation
- One year of hosting
- All four launch templates
- Platform branding removed
- Up to 500 guest records
- Up to 100 gallery images
- 1 GB media quota
- Personalized guest links
- Event-level RSVP
- Guestbook
- QRIS/bank gift-details section
- CSV import and export
- Re-publish during the hosting period
```

### Free access

```text
Free:
- Account creation
- Template browsing
- Create/edit draft invitation
- Authenticated previews
- Test data entry
- No publicly shareable invitation URL
- No live guest RSVP collection
- No production publishing
```

### Why this is better

Do not initially charge separately for:

```text
QRIS display
Brand removal
More guests
Premium templates
More hosting
```

Each extra option increases entitlement logic, checkout complexity, failed-payment support cases, and user confusion. Sell one complete promise first. Later, add:

```text
Hosting renewal
Custom domain
Premium template collection
QR check-in
Vendor package
Concierge design service
```

## Scope reduction

### Ship in 12 weeks

```text
Account registration/login/password reset
Owner-only invitation ownership
Four production-quality templates
Template gallery
Structured top-level section editor
Add section from curated library
Reorder, duplicate, hide, delete sections
Move Up / Move Down alternatives
Section properties panel
Desktop/mobile preview
Draft autosave
Explicit publishing and republishing
Public platform URL
Couple/event details
Gallery and image upload
Guest manual CRUD
CSV guest import with validation preview
Guest groups
Generic link plus guest-specific links
Event-level RSVP
CSV guest/RSVP exports
Text guestbook with host moderation
QRIS/bank information display
One Midtrans payment adapter
One-year hosting entitlement
Basic internal admin lookup
Landing page, demo site, pricing, FAQ, contact support
```

### Constrain at launch

| Originally planned | Recommended v1 constraint |
|---|---|
| 5–8 templates | Four templates |
| User-created one- and two-column sections | One-column custom content section plus a fixed two-column Image + Text preset |
| Rich text | Paragraphs, bold, italic, links, line breaks only |
| Background music | Defer user uploads; either no music or a short curated royalty-cleared track list |
| Spouse/editor role | Feature-flagged; launch owner-only if it threatens the schedule |
| Admin template CRUD | Seed templates via deployment; admin can activate/deactivate but does not visually build templates |
| Generic RSVP editing | Personalized-link RSVP can be edited; generic RSVP is submit-once |
| Analytics dashboard | Operational counts only; no rich analytics UI |
| Public sharing preview | Owner-only authenticated preview |
| Template migration | Preserve global data and require review; no complex automated per-block migration UI |

### Explicitly defer

```text
Nested drag-and-drop containers
Freeform/canvas positioning
Custom CSS, HTML, JavaScript, and embeds
Custom domains
QR check-in
Offline check-in
Seating and table planning
Official WhatsApp Business API
Bulk WhatsApp messaging
Guest open tracking dashboard
Meal choice, dietary requirements, arbitrary RSVP questions
XLSX/Google Sheets imports
Wedding organizer/client workspace
White-labeling
Client approval workflow
Reusable user sections
Template marketplace
Third-party templates
Comments, collaboration, real-time co-editing
```

## Roles and permissions

Use only two roles in the data model now:

```text
owner
admin
```

Do not create a “studio user” database role in MVP. A studio is just a customer account that owns one or more invitation drafts/purchases.

| Capability | Owner | Admin |
|---|---:|---:|
| Create/edit own invitation | Yes | Support override |
| Manage sections and media | Yes | Support override |
| Manage guests and RSVP data | Yes | Yes |
| Publish/unpublish | Yes | Yes |
| Pay/renew | Yes | Record/refund support only |
| Export guest/RSVP data | Yes | Yes, only for support reason |
| Moderate guestbook | Yes | Yes |
| Access other customers’ invitations | No | Yes, audited |

### Deferred editor access

Design the schema so this can be added later, but do not expose it at launch:

```text
InvitationMember
- invitation_id
- user_id
- role: owner | editor
- status: pending | active | revoked
- invited_by_user_id
- invited_at
- accepted_at nullable
- revoked_at nullable
```

At launch, the owner is the sole active member. This avoids invitation email delivery, acceptance, revocation, and ownership-transfer complexity while retaining a clear extension path.

## Section and builder rules

### Page limits

```text
Maximum top-level sections: 20
Maximum gallery images: 100
Maximum active RSVP sections: 1
Maximum active event schedule sections: 1
Maximum active map/navigation sections: 1
Maximum active gift/QRIS sections: 1
Maximum active guestbook sections: 1
Maximum active countdown sections: 1
Maximum active contact sections: 1
```

### Section registry

| Section | Type | Max | Duplicate | Hide | Delete | Notes |
|---|---|---:|---:|---:|---:|---|
| Cover | Template | 1 | No | Yes | Yes | Opening-gate content; template may render without it |
| Couple | Template/content | 1 | No | Yes | Yes | Names and core introduction |
| Countdown | System | 1 | No | Yes | Yes | References selected primary event |
| Event schedule | System | 1 | No | Yes | Yes | Holds one or more events |
| Map/navigation | System | 1 | No | Yes | Yes | Uses event venue data |
| Love story | Content | 3 | Yes | Yes | Yes | Structured timeline or text layout |
| Gallery | Content | 3 | Yes | Yes | Yes | Total image quota still applies |
| Quote | Content | 5 | Yes | Yes | Yes | Optional |
| Image + Text | Preset content | 5 | Yes | Yes | Yes | Fixed responsive two-column rules |
| Custom content | Content | 5 | Yes | Yes | Yes | One-column container with approved inner blocks |
| RSVP | System | 1 | No | Yes | Yes | Existing data remains after removal |
| QRIS/bank gifts | System | 1 | No | Yes | Yes | Display only |
| Guestbook | System | 1 | No | Yes | Yes | Existing entries are retained |
| Contact person | System | 1 | No | Yes | Yes | Supports several contacts |
| Divider | Content | 10 | Yes | Yes | Yes | Decorative section |

### Custom content constraints

Custom content sections are intentionally limited:

```text
Allowed layout:
- One column

Allowed child blocks:
- Heading
- Rich text
- Image
- Quote
- Divider
- Button/link

Not allowed inside custom content:
- RSVP
- Event schedule
- Map/navigation
- Gallery
- Countdown
- QRIS/bank gifts
- Guestbook
- Contact person
- Arbitrary HTML, CSS, JavaScript, iframe, or embed
```

This preserves strong responsive behavior and makes the document renderer predictable.

### Drag alternatives

Every drag action must also have:

```text
Move Up
Move Down
Insert Before
Insert After
Duplicate
Delete
```

These controls need keyboard support, accessible labels, visible focus indicators, and meaningful screen-reader announcements, such as:

```text
“Gallery moved after Event Schedule.”
```

This aligns with WCAG 2.2 guidance: when an operation uses dragging, provide a single-pointer alternative that completes the same action. [w3](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

## Version model

### Invitation record

```text
Invitation
- id
- owner_id
- slug
- visibility: draft | published | unpublished | expired
- template_id
- draft_document_json
- draft_revision
- published_version_id nullable
- published_at nullable
- hosting_expires_at nullable
- created_at
- updated_at
```

### Immutable version record

```text
InvitationVersion
- id
- invitation_id
- version_number
- document_json
- schema_version
- template_id
- template_version
- created_by_user_id
- created_at
```

### Rules

```text
1. Autosave updates `draft_document_json` and increments `draft_revision`.
2. The published version is immutable.
3. Publishing validates the draft, creates a new InvitationVersion snapshot,
   and atomically updates `published_version_id`.
4. The public invitation always renders only `published_version_id`.
5. Changing a template creates a transformed draft; it does not mutate the
   published version.
6. Template migrations are explicit and non-destructive.
7. A failed publish leaves the previous published version unaffected.
```

## Guest and RSVP rules

### Guest identity

```text
Guest input:
- Full name: required
- Phone number: optional, private
- Guest group: optional
- Allowed attendees: required, default 1, integer 1–20
- Notes: optional, host-only

Guest model:
- Supports a person or household, e.g. “Bapak Budi & Keluarga”
- One active personalized link per guest
- Token stored only as a secure hash
- Regeneration revokes the previous token
```

### Link behavior

```text
Generic URL:
https://vowly.id/i/{slug}

Personalized URL:
https://vowly.id/i/{slug}/g/{opaque-guest-token}
```

A personalized visitor sees:

```text
Kepada Yth.
Bapak/Ibu/Saudara/i
{guest_name}

Mohon maaf apabila terdapat kesalahan penulisan nama dan gelar.
```

The greeting label and apology wording are editable by the owner.

### Generic RSVP

Generic RSVP cannot identify a guest automatically. For a predictable MVP:

```text
- Generic RSVP is allowed only when RSVP is enabled.
- It requires display name, RSVP status per event, and attendee count.
- It creates an RSVP record with `guest_id = null`.
- The dashboard labels it “Unmatched RSVP.”
- Generic RSVPs are submit-once in v1.
- The host can manually reconcile or delete unmatched responses.
```

### Personalized RSVP

```text
- The personalized link determines guest identity.
- RSVP can be created and edited through that same link.
- RSVP has one response per guest per event.
- Attendee count cannot exceed the guest’s allowed attendee limit.
- Existing RSVP rows are updated rather than duplicated.
```

### Attendance reporting

Show two different numbers to avoid accidental double-counting:

```text
Per-event attendees
- Total confirmed guests/count for each event.

Unique responding households
- Number of unique guest records with at least one attending response.

Do not call the second number “total attendance.”
```

The initial dashboard should not promise a universal combined headcount when events overlap or differ.

## Data model additions

Use the original entities, with these changes.

### Invitation entitlement

```text
InvitationEntitlement
- id
- invitation_id
- plan_code: vowly_publish_1y
- status: active | expired | revoked
- starts_at
- ends_at
- source_payment_id
- guest_limit
- storage_limit_bytes
- gallery_image_limit
- created_at
- updated_at
```

The entitlement—not the payment row—is the source of truth for publishing and limits.

### Guest group

```text
GuestGroup
- id
- invitation_id
- name
- sort_order
- color nullable
- created_at
- updated_at
```

Replace `Guest.group_name` with `Guest.group_id`.

### Guest link

For launch, either keep the token in `Guest` or use this normalized model. I recommend this model because link regeneration is a core product action:

```text
GuestLink
- id
- invitation_id
- guest_id
- token_hash
- status: active | revoked
- created_at
- revoked_at nullable
- last_opened_at nullable
- open_count default 0
```

At MVP, do not show guest-open analytics in the dashboard; retain this metadata only for troubleshooting and future product work.

### Revised RSVP

```text
RSVP
- id
- invitation_id
- guest_id nullable
- event_id
- display_name nullable
- status: attending | not_attending | maybe
- attendee_count
- notes nullable
- edit_token_hash nullable
- submitted_at
- updated_at

Constraints:
- unique(invitation_id, guest_id, event_id) where guest_id is not null
- generic RSVP editing is not supported in v1, so no generic edit-token
  is needed at launch
```

`no_response` is a **derived dashboard state**, not a persisted RSVP row. This prevents meaningless records from being created for every guest/event combination.

### Audit log

```text
AuditLog
- id
- actor_user_id nullable
- invitation_id nullable
- action
- target_type
- target_id
- metadata_json
- created_at
```

Minimum auditable actions:

```text
invitation.created
invitation.published
invitation.unpublished
invitation.deleted
template.changed
guest.imported
guest.link_regenerated
guest.exported
rsvp.exported
payment.verified
guestbook.hidden
admin.support_accessed
```

## Public API rules

### Public pages

```text
GET /i/{slug}
GET /i/{slug}/g/{guestToken}
```

The public renderer may return only:

```text
- Published invitation document
- Published event details
- Public media delivery URLs
- Visible guestbook entries
- Guest greeting, only for a validated personalized token
- That guest’s RSVP state, only for a validated personalized token
```

It must never return:

```text
- Guest lists
- Other guests’ data
- Phone numbers
- Guest notes
- Raw/hashed guest tokens
- Payment data
- Storage keys
- Internal invitation IDs where not necessary
```

### Public writes

```text
POST /api/public/i/{slug}/rsvp
POST /api/public/i/{slug}/guestbook
```

For personalized RSVP, submit the guest token in the route or an HTTP-only session created after resolving the token:

```text
POST /api/public/i/{slug}/g/{guestToken}/rsvp
```

The server determines identity from the token; it must never accept a browser-provided `guest_id`.

Required controls:

```text
- Invitation must be published and have active entitlement.
- CSRF/origin protection for browser forms.
- Rate limit by invitation + IP + guest token/session.
- Honeypot field for anonymous forms.
- Request payload validation.
- No sequential RSVP IDs in public responses.
```

## Payment implementation contract

```text
PaymentProvider interface
- createCheckout(payment): CheckoutSession
- verifyWebhook(request): VerifiedPaymentEvent
- getPaymentStatus(providerReference): PaymentStatus
- refund(payment, amount?): RefundResult  // admin/manual workflow first
```

Midtrans must be isolated behind this interface.

### Verified payment behavior

```text
1. Create a local pending Payment before opening checkout.
2. Use the local payment/order reference as the idempotency key.
3. Receive provider webhook.
4. Verify signature.
5. Verify amount, currency, order reference, and expected product.
6. Lock or transactionally update the local Payment row.
7. If state transition is valid and first successful event:
   - mark Payment = paid;
   - create/activate InvitationEntitlement;
   - set hosting_expires_at;
   - write audit log.
8. Return 2xx quickly.
9. Queue slow follow-up work, such as email receipt.
```

Midtrans documentation identifies `signature_key` as the mechanism for confirming that a payment notification originated from Midtrans and recommends checking it when handling notifications. [docs.midtrans](https://docs.midtrans.com/docs/https-notification-webhooks)

## Upload requirements

```text
Allowed uploads:
- JPEG
- PNG
- WebP
- AVIF
- Optional MP3 only if curated music is not used

Validation:
- Extension allowlist
- Server-side MIME/content-signature verification
- File-size limits enforced before processing
- Image-dimension limits
- Random generated storage keys
- Original names not used in public paths
- EXIF orientation normalized
- GPS and other EXIF metadata stripped
- Object storage, not the public web root
- Quarantine/scan before public availability where available
- Queue-generated display derivatives: thumbnail, WebP/AVIF, responsive sizes
```

OWASP’s upload guidance recommends extension allowlisting, validating file type rather than trusting request metadata, enforcing limits, renaming stored files, and keeping uploads outside the application web root or on separate storage. [bluegoatcyber](https://bluegoatcyber.com/blog/secure-file-upload-validation-web-security-medtech)

## Twelve-week execution plan

### Week 1: foundations

```text
- Laravel modular monolith setup
- Docker Compose: app, PostgreSQL, Redis, workers, MinIO/local storage
- Authentication and account settings
- Base authorization/policies
- Schema/migrations for invitations, documents, templates, events
- Seed four template definitions
- Landing-page foundation
```

### Week 2: invitation and template rendering

```text
- Invitation create flow
- Template gallery
- Draft document schema and validation
- Public renderer for one template
- Mobile-first design system
- Owner-only authenticated preview
- Draft autosave and revision handling
```

### Week 3: structured editor

```text
- Section list and property panel
- Add-section library
- Top-level reorder with dnd-kit
- Move Up, Move Down, Insert Before, Insert After controls
- Hide/delete/duplicate rules
- Desktop/mobile preview modes
- Full support for first two templates
```

### Week 4: content and media

```text
- Couple/event editor
- Event schedule, maps, countdown, contacts
- Media upload pipeline
- Gallery UI and image derivatives
- One-column custom content section
- Image + Text preset
- Expand renderer support to all four templates
```

### Week 5: publishing and public page

```text
- Immutable published versions
- Publish/unpublish workflow
- Public URL resolution and noindex metadata
- Cache invalidation
- Opening-cover behavior
- Gift/QRIS display block
- Guestbook rendering and moderation basics
```

### Week 6: guest management

```text
- Guest CRUD
- Guest groups
- Personalized token/link generation
- Copy-link actions
- CSV import parsing, mapping, validation preview
- Guest CSV export
- Token regeneration and invalid-token handling
```

### Week 7: RSVP

```text
- Per-event RSVP UI
- Personalized RSVP identity flow
- Generic unmatched RSVP flow
- Attendee-limit validation
- RSVP edit from personalized links
- RSVP dashboard counts
- RSVP CSV export
```

### Week 8: payments and entitlement

```text
- Product/plan configuration
- PaymentProvider interface
- Midtrans checkout adapter
- Webhook verification and idempotency
- Entitlement creation/expiry
- Payment-failure and pending states
- Publish-after-payment user flow
```

### Week 9: admin and support

```text
- Admin authentication/authorization
- User/invitation lookup
- Payment-status lookup
- Guestbook moderation
- Template activation/deactivation
- Audit log viewer
- Support procedures/documentation
```

### Week 10: accessibility and security hardening

```text
- Keyboard builder flows
- Focus management and screen-reader announcements
- Contrast testing
- Form error accessibility
- Rate limits and honeypot
- Public API exposure review
- Upload hardening
- Guest token validation/security tests
```

### Week 11: quality and production operations

```text
- End-to-end critical-path tests
- Payment webhook test suite
- CSV import edge-case tests
- Responsive device testing
- Backup and restore test
- Error monitoring
- Queue and media-processing monitoring
- Deployment/rollback workflow
```

### Week 12: launch readiness

```text
- Landing page, demo invitation, pricing, FAQ
- Terms, privacy, data-deletion request process
- Email/WhatsApp support setup
- Pilot with 3–5 real couples or invitation studios
- Fix pilot findings
- Production launch
```

## Definition of done

The MVP is ready when a new customer can complete this end-to-end without manual database intervention:

```text
Sign up
→ choose one of four templates
→ add wedding and event details
→ customize valid sections
→ upload gallery media
→ create/import guests
→ generate personal invitation links
→ complete verified payment
→ explicitly publish
→ send a link through WhatsApp
→ guest opens it on mobile
→ guest submits per-event RSVP
→ owner sees RSVP results
→ owner exports CSV
→ owner moderates a guestbook wish
```

The MVP is **not** done merely because the editor works. It is done when the entire paid-publication and guest-response loop works reliably, securely, and comfortably on a mobile device.
