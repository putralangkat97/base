# Use path-based public invitation URLs

Vowly uses `https://vowly.id/i/{slug}` as the canonical public URL for invitations. A single platform origin avoids wildcard DNS/TLS provisioning and simplifies routing, caching, deployment, and support during the MVP; custom domains and subdomain-based URLs remain deferred options.
