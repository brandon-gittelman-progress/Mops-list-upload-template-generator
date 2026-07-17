# Feature: Step 4 Campaign Settings

Campaign Settings uses grouped cards.

## Cards

- Campaign Identification
- Categorization
- UTM Parameters
- Lead Routing
- Marketing Ops

## Requirements

- SFDC Campaign ID must be exactly 18 characters.
- Lead Owner ID is optional but must be exactly 18 characters when populated.
- Manual Lead Assignment auto-checks when Lead Owner ID is populated.
- Force MQL and Force MAL are mutually exclusive.
- Picklists come from `picklists.json`.
- Do not render Lead Source - Initial.

## Design

Use Progress Design System buttons, inputs, cards, spacing, and typography.
