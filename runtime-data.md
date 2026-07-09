# Runtime Data Specification

## picklists.json

`picklists.json` is loaded at runtime from the project root.

The schema requires:

- `picklists`
- `columnSynonyms`
- `countryAliases`
- `stateAliases`

## Required picklists used in Step 4

- Product
- Lead Source - Most Recent
- Call to Action
- Target Channel Type
- Campaign Member Status
- utm_medium

`Lead Source - Initial` may remain in `picklists.json` for backward compatibility, but the app must not render it or export it.

## Synonyms

`columnSynonyms` should continue to include English variants, uppercase variants, snake_case variants, parenthetical vendor hints, and French/German/Spanish/Dutch headers.

## Country and State aliases

Country aliases must include ISO alpha-2 codes and common variants.

State aliases must include United States and Canada with 2-letter codes and common abbreviations.
