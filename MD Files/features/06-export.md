# Feature: Export

Export CSV and XLSX using the canonical 36-column template plus optional kept fields.

## Requirements

- Exclude Lead Source - Initial.
- Export standard 36 columns first.
- Append kept fields after standard columns.
- Exclude internal metadata fields.
- Exclude deleted rows.
- Normalize Country and State.
- Blank State for non-US/CA countries.
- Prefix filename with `WITH_ERRORS_` when exporting with errors.
- CSV includes UTF-8 BOM.
