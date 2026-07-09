# Feature: Step 4 Campaign Settings

Campaign Settings uses grouped cards.

Cards:

- Campaign Identification
- Categorization
- UTM Parameters
- Lead Routing
- Marketing Ops

Required field behavior:

- SFDC Campaign ID must be 18 characters.
- Lead Owner ID is optional but must be 18 characters when present.
- Manual Lead Assignment auto-checks when Lead Owner ID is populated.
- Force MQL and Force MAL are mutually exclusive.

Removed field:

- Do not render Lead Source - Initial.
