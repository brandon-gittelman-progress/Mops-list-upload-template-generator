# Keep Field + Delete Row Hotfix

Replace these files in the app:

- `js/ui/step2-mapping.js`
- `js/ui/step5-review.js`
- `js/modules/exporter.js`

## New behavior

### Field Mapping: Keep field

On Step 2, each source column now has a `Keep field - add to export` option. If selected, that source column is appended to the exported CSV/XLSX after the standard template columns.

This is intended for Field Marketing values that do not match the core upload schema but need to be preserved for manual work after export.

### Review: Delete Row

On Step 5, each tracked issue row now has a `Delete Row` button in the Issue column. Confirming deletion removes that source row from validation and export.

This is especially useful for duplicate Email + Product validation errors where the user wants to exclude one duplicate record.

## Notes

- Standard export columns remain unchanged.
- Kept fields are appended after the standard template columns.
- Deleted rows are excluded from CSV and XLSX export.
- No new CSS files are required.
