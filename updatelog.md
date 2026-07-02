# Update Log
## Progress List Upload Formatter

This log tracks changes to the spec set (`PRD.md`, `architecture.md`, `design.md`) across versions.

---

## v1.1 — July 2, 2026

**Author:** Brandon Gittelman  
**Trigger:** Updates based on live testing of the v1.0 build.

### Changes

| # | Change | Type | Files Updated |
|---|---|---|---|
| 1 | **Eliminated all NPM / Node.js dependencies.** The app is now vanilla HTML/CSS/JavaScript. SheetJS and Fuse.js are consumed as pre-built UMD bundles via CDN or a local `vendor/` folder. There is no `package.json`, `node_modules/`, bundler, or transpiler in the project. | Breaking (stack) | architecture.md §1–§2, §13; PRD.md NFR-3, AC-7 |
| 2 | **Bypass Bogus Program** is now rendered as a **checkbox** in the UI. When checked, the export contains the literal string `Yes`; when unchecked, the export cell is blank. | Breaking (UX + data) | PRD.md §2.1, §3.3, §2.5; design.md Step 3, §11; architecture.md §4.5 |
| 3 | **Manual Lead Assignment** is now rendered as a **checkbox** and **auto-checks** whenever the associated **Lead Owner ID** has a non-empty value. The user may still uncheck it manually; that choice is respected for the rest of the session. Auto-check triggers an ARIA live announcement for screen readers and a brief green flash on the checkbox. | Breaking (UX + data) | PRD.md §3.3, §3.4, §3.6, §2.5; design.md Step 3, §6, §9; architecture.md §4.4, §8.4 |
| 4 | **Removed the standalone `Lead Owner` column** (formerly column #34). Lead Owner ID is the sole ownership field. Template column count is now **37** (was 38). | Breaking (schema) | PRD.md §2.1, §2.2, §3.3, AC-5; design.md Step 5, §5; architecture.md §3.2, §4.5 |
| 5 | **Picklists are now externalized to `picklists.json`.** Marketing Ops can add/remove/rename picklist values (Country, Product, Lead Source, Call to Action, Target Channel Type, Campaign Member Status, utm_medium), column synonyms, and country aliases by editing this file — no code change, no rebuild, no NPM step. Schema is documented and validated on load. | New capability | PRD.md §3.8 (new), AC-8 (new); architecture.md §4.6, §5 (new), §10.4; design.md Step 3 note, §11 |
| 6 | **`COUNTRY (use drop down menu)` renamed to `Country`** everywhere: column headers, dropdowns, tooltips, error messages, and picklist keys. | UX polish | all three files |
| 7 | **`PRODUCT (use drop down menu)` renamed to `Product`** everywhere: column headers, dropdowns, tooltips, error messages, and picklist keys. | UX polish | all three files |
| 8 | **All column names normalized to Title Case.** `FIRST NAME` → `First Name`, `LAST NAME` → `Last Name`, `EMAIL ADDRESS` → `Email Address`, `COMPANY NAME` → `Company Name`, `ADDRESS 1` → `Address 1`, `CITY` → `City`, `STATE OR PROVINCE` → `State or Province`, `ZIP OR POSTAL CODE` → `Zip or Postal Code`, `BUSINESS PHONE` → `Business Phone`, `INDUSTRY` → `Industry`, `REVENUE` → `Revenue`, `EMPLOYEE SIZE` → `Employee Size`, `CAMPAIGN SOURCE` → `Campaign Source`, `LEAD SOURCE - INITIAL` → `Lead Source - Initial`, `LEAD SOURCE - MOST RECENT` → `Lead Source - Most Recent`, `CALL TO ACTION` → `Call to Action`, `TARGET CHANNEL TYPE` → `Target Channel Type`, `FORM COMMENTS` → `Form Comments`, `OFFER TITLE` → `Offer Title`, `CAMPAIGN MEMBER STATUS` → `Campaign Member Status`, `SFDC CAMPAIGN ID` → `SFDC Campaign ID`. The `utm_medium`, `utm_source`, `utm_campaign` fields keep their lowercase, underscore-separated form (UTM standard). `Title`, `Website`, `Electronic Message Opt Out`, `Opt In - Explicit Date` were already correctly cased. | UX polish + data | all three files |
| 9 | **New validation rule: one Email Address per Product per session.** For each unique `(lowercased_email, Product)` pair, only one row is permitted across all uploaded files in the session. Multiple rows sharing a pair are flagged as **errors** (block export) with a message that names the email, the product, and the affected row numbers. Duplicate emails across **different** Products remain warnings. | New capability | PRD.md §2.4 (new), FR-6.9 (new), US-11 (updated), AC-4; architecture.md §8.1, §4.4 rule 11; design.md Step 4, §11 |

### Version Bumps
- `PRD.md`: 1.0 → **1.1**
- `architecture.md`: 1.0 → **1.1**
- `design.md`: 1.0 → **1.1**

### Migration Notes for Developers Handing Off From v1.0
1. **Delete** any existing `package.json`, `package-lock.json`, `node_modules/`, `vite.config.*`, `tsconfig.json`, `.babelrc`, `webpack.*` files. Anything left is a violation of NFR-3.
2. **Adopt** the new folder layout in `architecture.md` §2.2.
3. **Reduce** the template column list from 38 → 37 by removing the old `LEAD OWNER` column. Every export writer, validator, mapping seed, and test fixture must be updated.
4. **Rename** template column keys everywhere. If you kept any hard-coded string references to `FIRST NAME`, `EMAIL ADDRESS`, `COUNTRY (use drop down menu)`, etc., update them to their new Title Case equivalents.
5. **Externalize** picklists from any TypeScript/JavaScript constants files into `picklists.json`. Load them at app start; do not duplicate them in code.
6. **Add** the new `DuplicateEmailWithinProductValidator`. See `architecture.md` §8.1.
7. **Convert** the Marketing Ops text fields `Manual Lead Assignment` and `Bypass Bogus Program` to checkboxes. Wire the auto-check behavior from Lead Owner ID → Manual Lead Assignment.
8. **Test** using the expanded sample set listed in `architecture.md` §14.

### Testing Priorities for v1.1
- [ ] Confirm no `npm` / `node` / `vite` commands are needed to run the app.
- [ ] Confirm the app loads and renders correctly when served with `python -m http.server`.
- [ ] Confirm `picklists.json` edits are reflected on browser refresh without any code change.
- [ ] Confirm export CSV/XLSX contains exactly 37 columns in Title Case.
- [ ] Confirm checkbox fields serialize as `Yes` (checked) or blank (unchecked).
- [ ] Confirm Manual Lead Assignment auto-checks when Lead Owner ID is populated at both the batch and row levels.
- [ ] Confirm same email + same Product across files raises an **error** (blocks export).
- [ ] Confirm same email + different Products raises a **warning** only (does not block export).
- [ ] Confirm blocking modal appears if `picklists.json` is missing or malformed.

---

## v1.0 — June 2026

**Author:** Brandon Gittelman  
Initial spec set produced for the Progress List Upload Formatter.

### Highlights
- 5-step wizard (Upload → Map → Settings → Review → Export)
- 38-column Eloqua template
- React 18 + TypeScript + Vite + Zustand + Tailwind + Fuse.js + SheetJS stack
- Client-first architecture, no server required
- Progress brand system (green/pink/blue/navy)
- Fuzzy column mapping, country standardization, SFDC ID validation, duplicate detection
