# Store each event's local time zone

Each Event stores its own IANA time zone, defaulting to `Asia/Jakarta`, and public dates, times, and countdowns use that local zone. This avoids incorrect countdowns for Indonesian invitations spanning WIB, WITA, and WIT while keeping the Owner's event details understandable.
