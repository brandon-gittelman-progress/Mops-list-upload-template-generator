# Update Log

## Progress List Upload Formatter

Tracks changes to the specification and implementation requirements across versions.

---

## v1.5 Draft — July 2026

**Trigger:** UX provided a new Progress Design System guide and live testing uncovered two new workflow needs: deleting bad duplicate rows and preserving extra unmapped field-marketing columns in export.

### Changes

1. **Progress Design System applied as the current visual authority.**
   - New design rules are captured in `design/progress-design-system.md`.
   - Core colors changed to the Progress web design system tokens.
   - Primary CTA color is now red `#EB0249`, hover `#B90138`.
   - Secondary action color is blue `#054BFF`, hover `#0037CB`.
   - Page background is `#F4F7FD`.
   - Tables use `#EEF5FF` sticky headers and zebra striping.
   - Cards use 10px radius and Progress shadow tokens.
   - Inputs use `rgba(158,174,195,0.80)` borders and 5px radius.
   - Buttons are all caps, 43px medium height, and 5px radius.

2. **Step 2 Mapping adds `Keep field - add to export`.**
   - Each uploaded source column can be mapped to a standard template field, left unmapped, or marked as Keep Field.
   - Kept fields are appended to CSV/XLSX export after the standard 36-column template.
   - Kept fields use the original source column header.
   - Kept fields are not validated as required template fields.

3. **Step 5 Review adds `Delete Row`.**
   - Each tracked issue row includes a Delete Row action.
   - Confirming deletion excludes the source row from validation and export.
   - Primary use case is removing one record from a duplicate Email + Product pair.

4. **Export supports appended kept fields.**
   - Standard export columns remain unchanged.
   - Extra kept fields appear after the standard template fields.
   - Internal metadata fields such as `__sourceFile`, `__sourceRowNumber`, and `__rowId` are never exported.

5. **Review tracking remains stable after deletion.**
   - Rows that had issues stay visible until deleted or workflow restarts.
   - Resolved rows remain green.
   - Deleted rows disappear from Review and export.

---

## v1.4 Draft — July 2026

1. Removed `Lead Source - Initial` completely.
2. Output schema changed from 37 columns to 36 columns.
3. Added Lead Owner ID validation: optional, but exactly 18 characters when populated.
4. Step 5 Review tracks rows that have or had issues.
5. Fixed rows turn green instead of disappearing.
6. Email Address is the first data column after Issue and Source.
7. Step 4 Campaign Settings restored to grouped layout with picklists.
8. Force MQL and Force MAL are mutually exclusive.
9. Header Start Over clears workflow state but preserves loaded picklists and Teams context.
10. CSS changes must be integrated into existing files, not separate hotfix files.

---

## v1.3 — July 7, 2026

1. Configuration page hides fully-populated columns.
2. Added conditional Step 3: Data Confirmation.
3. Low-confidence fuzzy matches become suggestions only.
4. Country and State accept 2-letter code or full name.
5. State is blanked on export when Country is not United States or Canada.
6. Microsoft Teams tab embedding.
7. Export with Errors button on Review.
8. MAL/MQL detection from source columns.
9. Foreign-language column headers for fuzzy matching.

---

## v1.2 — July 2, 2026

- Fuzzy matcher rewritten with token-overlap, stopwords, and parenthetical stripping.
- Router preserves scroll and focus.
- Dropzone CSS fixed.
- Step 5 Review must never call `store.set()` inside `render()`.
- JS syntax validation with `node --check` required.

---

## v1.1 — July 2, 2026

- Eliminated NPM/Node build requirements.
- Picklists externalized to `picklists.json`.
- Email + Product uniqueness rule added.
- Manual Lead Assignment auto-check added.

---

## v1.0 — June 2026

Initial 5-step wizard, client-first architecture, Progress brand system, fuzzy mapping, country standardization, SFDC ID validation, and duplicate detection.
