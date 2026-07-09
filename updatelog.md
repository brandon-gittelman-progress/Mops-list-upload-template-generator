# Update Log

## Progress List Upload Formatter

This log tracks changes to the spec set across versions.

---

## v1.4 Draft — July 2026

**Trigger:** Live testing of regenerated v1.3 app and iterative bug fixes.

### Changes

1. **Removed Lead Source - Initial completely.**
   - Removed from Campaign Settings.
   - Removed from required validation.
   - Removed from Step 3 partial-column confirmation logic.
   - Removed from export/output schema.
   - Output schema is now 36 columns.

2. **Lead Owner ID validation added.**
   - If blank, valid.
   - If populated, must be exactly 18 characters.
   - Step 4 shows an inline `0/18` counter for Lead Owner ID.

3. **Step 5 Review behavior changed.**
   - Rows that had validation issues remain visible after fixes.
   - Fixed rows turn green instead of disappearing.
   - Email Address is the first data column after `Issue` and `Source`.
   - Summary card uses `Tracked Rows` instead of `Rows With Issues`.
   - Continue enables when blocking errors are resolved.

4. **Step 5 Review usability improved.**
   - Only rows that have or had issues are tracked.
   - Sticky Issue column shows issue details.
   - Table has horizontal and vertical scroll region.
   - Error/warning messages display beneath the affected field.

5. **Step 4 Campaign Settings restored to signed-off layout.**
   - Full-width Campaign Identification card.
   - Two-column lower card layout.
   - Picklists restored from `picklists.json`.
   - SFDC Campaign ID count moved inline into label row as `0/18`.

6. **Force MQL / Force MAL exclusivity enforced.**
   - Checking Force MQL clears Force MAL.
   - Checking Force MAL clears Force MQL.

7. **Header fixes.**
   - Toggle Theme and Start Over are readable on navy header.
   - Start Over clears uploaded files, mappings, settings, confirmations, review edits, validation, and export state.
   - Start Over preserves loaded picklists and Teams context.

8. **CSS organization rule added.**
   - Do not create separate hotfix CSS files.
   - Integrate CSS changes into `components.css`, `steps.css`, or the relevant existing stylesheet.

---

## v1.3 — July 7, 2026

1. Configuration page hides fully-populated columns.
2. New conditional Step 3: Data Confirmation.
3. Low-confidence fuzzy matches become suggestions only.
4. Country and State accept 2-letter code or full name.
5. State is blanked on export when Country is not US/CA.
6. Microsoft Teams tab embedding.
7. Export with Errors button on Review.
8. MAL/MQL detection from source columns.
9. Foreign-language column headers for fuzzy matching.

---

## v1.2 — July 2, 2026

- Fuzzy matcher rewritten with token-overlap, stopwords, and parenthetical stripping.
- Router preserves scroll and focus.
- Dropzone CSS fixed.
- Step 5 / Review must never call `store.set()` inside `render()`.
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
