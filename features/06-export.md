# Feature: Export

Export CSV and XLSX using the canonical 36-column template.

Requirements:

- Exclude Lead Source - Initial.
- Normalize Country and State.
- Blank State for non-US/CA countries.
- Prefix filename with WITH_ERRORS_ when exporting with errors.
- Use UTF-8 BOM for CSV.
