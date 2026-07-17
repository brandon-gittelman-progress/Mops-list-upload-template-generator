# Runtime Data Specification

## picklists.json

`picklists.json` is loaded from the project root at runtime.

Required root keys:

- `picklists`
- `columnSynonyms`
- `countryAliases`
- `stateAliases`

---

## Picklists used in Step 4

- Product
- Lead Source - Most Recent
- Call to Action
- Target Channel Type
- Campaign Member Status
- utm_medium

`Lead Source - Initial` may remain in `picklists.json` for backward compatibility, but the app must not render it, validate it, or export it.

---

## Column synonyms

`columnSynonyms` supports:

- English variants
- uppercase variants
- snake_case variants
- parenthetical vendor hints
- French/German/Spanish/Dutch headers

---

## Country and State aliases

Country aliases must include ISO alpha-2 codes and common variants.

State aliases must include United States and Canada with 2-letter codes and common abbreviations.

---

## Kept fields

Kept fields are not defined in `picklists.json`. They are dynamic source columns selected by the user on Step 2.

Kept field requirements:

- Use original source column name.
- Append after standard export columns.
- Do not validate as required fields.
- Preserve values from the uploaded source file.
