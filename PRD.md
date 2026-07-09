# Product Requirements Document

## Progress List Upload Formatter

**Version:** v1.4 Draft  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** July 2026

---

## 1. Overview

The Progress List Upload Formatter is a browser-based, client-only static web app that transforms raw lead lists into the standardized Eloqua upload template. It also supports Microsoft Teams personal tab embedding.

The app must remain no-NPM, no-build, browser-only, and static-hostable.

---

## 2. Wizard Flow

The wizard has 6 steps:

1. Upload Files
2. Map Columns
3. Confirm Data
4. Campaign Settings
5. Review & Edit
6. Export

Step 3 remains conditional but the step indicator always shows 6 steps.

---

## 3. Output Template Schema

The export schema is now **36 columns**. `Lead Source - Initial` has been removed entirely and must not appear in UI, validation, review, or export.

### Columns in export order

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

### Required for export

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

## 4. Key Functional Requirements

### Step 1 — Upload Files

- Accept `.csv`, `.xlsx`, and `.xls`.
- Support multiple files.
- Preserve international characters.
- Do not send data outside the browser.

### Step 2 — Map Columns

- Auto-map High and Medium confidence matches.
- Low confidence never auto-maps; Low confidence renders as an inline suggestion pill.
- Foreign-language headers such as French, German, Spanish, and Dutch aliases must map using `picklists.json` synonyms.
- Do not map or output `Lead Source - Initial`.

### Step 3 — Confirm Data

Step 3 appears when one or more apply:

- Required mapped fields are partially populated.
- MAL/MQL values are detected.
- State values will be blanked because Country is not United States or Canada.

Partial-column confirmation applies only to required export fields. Optional fields must not force confirmation.

### Step 4 — Campaign Settings

Campaign Settings uses the signed-off grouped card layout:

- Campaign Identification
- Categorization
- UTM Parameters
- Lead Routing
- Marketing Ops

Required picklist fields must render as dropdowns from `picklists.json`.

`Lead Source - Initial` must not render anywhere.

`Force MQL` and `Force MAL` are mutually exclusive.

`Lead Owner ID` is optional, but if populated it must be exactly 18 characters.

### Step 5 — Review & Edit

- Show rows that have or had issues.
- Rows with active errors are red.
- Rows with active warnings are yellow.
- Rows that had issues but are now fixed stay visible and turn green.
- Email Address is the first data column after Issue and Source.
- Continue is enabled only when blocking errors are resolved.
- Export with Errors remains available when errors exist.
- Step 5 `render()` must not call `store.set()`.

### Step 6 — Export

- Export CSV and XLSX.
- Export exactly 36 columns in the defined order.
- Do not include `Lead Source - Initial`.
- Prefix filename with `WITH_ERRORS_` when exporting with errors.
- Normalize Country and State on export.
- Blank State when Country is not United States or Canada.

---

## 5. Acceptance Criteria

### AC-1 File Upload

CSV/XLSX/XLS multi-file upload works with 5,000+ rows and international characters.

### AC-2 Column Mapping

High/Medium auto-map; Low suggestion-only; foreign-language headers resolve correctly.

### AC-3 Campaign Settings

Grouped layout, picklists, hidden fully-populated fields, 18-character SFDC Campaign ID, 18-character Lead Owner ID when populated, MQL/MAL exclusivity.

### AC-4 Lead Source - Initial Removed

`Lead Source - Initial` does not appear in Step 4, Review, validation, or export.

### AC-5 Review

Only tracked issue rows are shown; fixed rows turn green and stay visible; Email Address is the first data column.

### AC-6 Export

Export contains 36 columns and excludes `Lead Source - Initial`.

### AC-7 State/Country

Country/State aliases resolve; State is blanked for non-US/CA countries.

### AC-8 Teams

App loads in Teams iframe, follows theme, and standalone browser mode still works.

### AC-9 UI Stability

Typing, dropdown changes, checkbox toggles, and review edits do not cause scroll jumps or focus loss.

### AC-10 No-NPM Delivery

No `package.json`, `node_modules`, build tools, TypeScript, frameworks, or bundlers.
