# Feature: Column Mapping

Step 2 maps uploaded source columns to output behavior.

## Mapping choices

Each source column can be:

1. Mapped to a standard template field.
2. Left unmapped.
3. Set to `Keep field - add to export`.

## Requirements

- High and Medium confidence matches auto-map.
- Low confidence never auto-maps.
- Low confidence renders as a suggestion with Accept action.
- Foreign-language synonyms come from `picklists.json`.
- `Lead Source - Initial` is not offered as a target.
- Keep Field appends the original source column to export.

## Keep Field UX

When Keep Field is selected:

- Show a status tag such as KEEP.
- Show explanatory text that the field will be appended to export.
- Do not force Step 3 confirmation unless the kept field also maps to a required standard field, which it should not.
