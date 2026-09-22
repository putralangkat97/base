# Use a neutral public state for unavailable invitations

Unpublished and expired Invitations present the same neutral unavailable experience to public visitors and do not disclose the underlying lifecycle state. This prevents public enumeration of customer data and keeps unpublish, expiry, and other access-control changes from becoming an information leak; the Owner still receives the specific state and next action after authentication.
