# Vowly

Vowly is a visual wedding Invitation builder for couples in Indonesia. The MVP is planned as a React-based visual editor with structured Sections, Containers, Grid layouts, Content blocks, responsive Preview, animation, Music, Forms, and explicit publication.

The product specification lives in:

- [Product requirements](prd.md)
- [MVP implementation spec](.scratch/vowly-mvp/spec.md)
- [Domain glossary](CONTEXT.md)
- [Architecture decisions](docs/adr/)

## Current project status

The Laravel base project is initialized. Vowly-specific domain behavior has not been implemented yet.

The current foundation includes:

- Laravel Framework 13.33.0 on PHP 8.4.25.
- PHP 8.4.
- React 19.3.0 with TypeScript 5.9.3.
- Inertia Laravel 3.3.4 and Inertia React 3.7.1.
- Tailwind CSS 4.3.3, Vite 8.3.0, and Vite Plus 0.3.0.
- Laravel Fortify authentication with email verification, password reset, two-factor authentication, and passkeys.
- Laravel Wayfinder for typed frontend route helpers.
- shadcn/ui New York components with Radix primitives and Lucide icons.
- PostgreSQL-ready Laravel configuration, with SQLite as the current local default.
- Pest, Larastan, Pint, Laravel Boost, Pail, and Sail development tooling.

The generated starter project also contains Teams, team membership, team invitations, and a team-scoped dashboard. These are starter-kit features, not Vowly's domain model. Vowly will use User, Owner, and Admin; Teams must not become a Studio role.

## Local setup

Requirements:

- PHP 8.4
- Composer
- Bun

For a fresh checkout:

    composer run setup

Start the development environment:

    composer run dev

Useful checks:

    composer run ci:check
    bun run build
    php artisan route:list --except-vendor
    php artisan about

The current local environment uses SQLite, database-backed sessions/cache/queues, local filesystem storage, log mail, and UTC. The planned Vowly deployment target is PostgreSQL, Redis, object storage/CDN, and Docker Compose; those services are not part of the initialized base project yet.

## Frontend structure

The React Starter Kit keeps frontend code under resources/js:

- components/ — reusable React components and shadcn/ui primitives
- hooks/ — shared React hooks
- layouts/ — application, authentication, settings, and team layouts
- pages/ — Inertia page components
- types/ — shared TypeScript definitions

The future visual editor should be added as an Inertia React page and should consume the versioned Invitation Design document described in the MVP spec.

## Next implementation boundary

The first Vowly-specific implementation should define the Invitation Design document and its renderer seam before building editor features:

    editor commands → serialized Design document → responsive renderer

Payment, Midtrans, Hosting entitlements, renewals, and payment-gated publication are intentionally deferred.
