# Product Requirements Document

## Progress List Upload Formatter

**Version:** v1.5 Draft  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** July 2026

---

## 1. Overview

The Progress List Upload Formatter is a browser-based, client-only static web app that transforms raw field marketing and demand generation lead lists into the standardized Eloqua upload template.

The app must remain easy to use for non-technical marketing users while producing consistent, validated, import-ready output files.

The app supports standalone browser usage and Microsoft Teams personal tab embedding.

---

## 2. Primary users

- Field Marketing
- Demand Generation
- Marketing Operations
- Campaign Operations
- Sales Operations reviewers

---

## 3. Wizard flow

The app uses a 6-step wizard:

1. Upload Files
2. Map Columns
3. Confirm Data
4. Campaign Settings
5. Review & Edit
6. Export

Step 3 is conditional, but the step indicator always shows six steps.

---

## 4. Output template schema

The standard output schema contains **36 columns**. `Lead Source - Initial` has been removed entirely and must not appear in the UI, validation, review, or export.

### Standard columns in export order

1. Last Response Date
2. First Name
3. Last Name
4. Email Address
5. Company Name
6. Address 1
7. City
8. State or Province
9. Zip or Postal Code
10. Country
11. Business Phone
12. Title
13. Industry
14. Revenue
15. Employee Size
16. Electronic Message Opt Out
17. Opt In - Explicit Date
18. Campaign Source
19. Lead Source - Most Recent
20. Product
21. Call to Action
22. Target Channel Type
23. Form Comments
24. Offer Title
25. Website
26. Campaign Member Status
27. SFDC Campaign ID
28. utm_medium
29. utm_source
30. utm_campaign
31. Force MQL
32. Force MAL
33. External Asset Status
34. Lead Owner ID
35. Manual Lead Assignment
36. Bypass Bogus Program

### Appended kept fields

If a user selects `Keep field - add to export` on Step 2, the original source column is appended after the standard 36 columns.

Kept fields:

- Use the original uploaded source column name.
- Are not required fields.
- Are not transformed unless explicitly specified in a future requirement.
- Are included in CSV and XLSX exports.
- Support field marketing workflows where source lists include additional context values that need manual post-export handling.

---

## 5. Required fields

The app validates the following required standard fields:

- Last Response Date
- First Name
- Last Name
- Email Address
- Company Name
- Country
- Campaign Source
- Lead Source - Most Recent
- Product
- Call to Action
- Target Channel Type
- Campaign Member Status
- SFDC Campaign ID

`Lead Source - Initial` is not required and must not exist in the output file.

---

## 6. Functional requirements

### Step 1 — Upload Files

- Accept `.csv`, `.xlsx`, and `.xls`.
- Support multiple files.
- Preserve international characters.
- Keep all processing client-side.
- Run MAL/MQL scan immediately after parse.

### Step 2 — Map Columns

Each source column can be:

1. Mapped to a standard template field.
2. Left unmapped.
3. Set to `Keep field - add to export`.

Additional mapping requirements:

- High and Medium confidence matches auto-map.
- Low confidence never auto-maps.
- Low confidence renders as an inline suggestion pill with Accept action.
- Foreign-language synonyms come from `picklists.json`.
- `Lead Source - Initial` must not be offered as an output mapping target.

### Step 3 — Confirm Data

Step 3 appears when one or more apply:

- Required mapped fields are partially populated.
- MAL/MQL values are detected.
- State values will be blanked because Country is not United States or Canada.

Partial-column confirmation applies only to required export fields. Optional and kept fields must not block confirmation.

### Step 4 — Campaign Settings

Campaign Settings uses grouped cards:

- Campaign Identification
- Categorization
- UTM Parameters
- Lead Routing
- Marketing Ops

Requirements:

- Picklists are sourced from `picklists.json`.
- `Lead Source - Initial` must not render.
- SFDC Campaign ID must be exactly 18 characters.
- Lead Owner ID is optional, but exactly 18 characters when populated.
- Lead Owner ID auto-checks Manual Lead Assignment when populated.
- Force MQL and Force MAL are mutually exclusive.

### Step 5 — Review & Edit

Review tracks rows that have or had issues.

Requirements:

- Active error rows are red.
- Active warning rows are yellow.
- Resolved rows remain visible and turn green.
- Email Address is the first data column after Issue and Source.
- Kept fields appear in the review grid when present.
- Each tracked issue row has a Delete Row action.
- Delete Row excludes the source row from validation and export after confirmation.
- Continue enables only when blocking errors are resolved or removed.
- Export with Errors remains available when errors exist.
- Step 5 `render()` must not call `store.set()`.

### Step 6 — Export

- Export CSV and XLSX.
- CSV uses UTF-8 BOM.
- Export the standard 36 columns in order.
- Append kept fields after standard columns.
- Exclude internal metadata fields.
- Exclude deleted rows.
- Normalize Country and State.
- Blank State when Country is not United States or Canada.
- Prefix filename with `WITH_ERRORS_` when exporting with errors.

---

## 7. Acceptance criteria

### AC-1 Upload

User can upload CSV/XLS/XLSX files and the app parses rows client-side.

### AC-2 Mapping

User can map source columns, leave source columns unmapped, or keep source columns for export.

### AC-3 Keep field export

When a source column is set to Keep Field, the export includes that source column after the standard 36 columns.

### AC-4 Lead Source - Initial removed

`Lead Source - Initial` does not appear in mapping targets, Step 4, Review standard columns, validation, or standard export columns.

### AC-5 Validation

Required fields, email, SFDC Campaign ID, Lead Owner ID, Country/State, MQL/MAL exclusivity, and duplicate Email + Product validation work as specified.

### AC-6 Delete Row

A row with a validation issue can be deleted from Step 5. Deleted rows are excluded from validation and export.

### AC-7 Review UX

Resolved rows remain visible and green, and Email Address is the first data column after Issue and Source.

### AC-8 Export

Export includes exactly the standard 36 columns plus any kept fields, excludes deleted rows, and strips internal metadata.

### AC-9 Design system

The app follows the Progress Design System in `design/progress-design-system.md`.

### AC-10 No-build architecture

No NPM, no package.json, no node_modules, no build step.
