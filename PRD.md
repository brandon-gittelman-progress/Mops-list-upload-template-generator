## Product Requirements Document (PRD)

### Progress List Upload Formatter

**Version:** 1.2
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal
**Last Updated:** July 2026

**What changed in v1.2?** See updatelog.md v1.2. Highlights: fuzzy column matcher rewritten to handle UPPERCASE and parenthetical vendor headers; columnSynonyms expanded to cover all 37 template columns; router now preserves scroll position and input focus/caret across re-renders; dropzone CSS bug fixed; Step 4 infinite-loop bug fixed. **Read updatelog.md v1.2 before regenerating.**

**What changed in v1.1?** See updatelog.md v1.1. Highlights: no-NPM stack, checkbox fields, Lead Owner column removed, picklists externalized, Title Case columns, per-Product email uniqueness.

#### 1. Overview

**Product Name:** Progress List Upload Formatter

**Purpose:** A browser-based web application that enables Progress Software's field marketing, demand generation, and marketing operations teams to transform raw lead lists into the standardized Eloqua list upload template.

**Problem:** Team members receive lead lists in varied formats. Common issues include inconsistent column names (including UPPERCASE variants and headers like `PRODUCT (use drop down menu)`), Country values not matching the picklist, casing inconsistencies (`YEs` vs `Yes`), special-character encoding issues, duplicate leads, manual metadata entry, and same email appearing multiple times against the same product.

**Target Users:** Field Marketing (primary), Demand Generation (secondary), Marketing Operations (tertiary).

**Success Metrics:** Reduce formatting time from 30+ min to <5 min; eliminate 95%+ of validation errors; 100% adoption by field marketing team in first quarter post-launch.

#### 2. Template Schema

37 columns in Title Case (except utm_*). Same as v1.1.

| # | Column | Required | Auto-Mappable | Input Type |
|---|--------|----------|---------------|------------|
| 1 | Last Response Date | Yes | Yes | Date / per-batch |
| 2 | First Name | Yes | Yes | Mapped |
| 3 | Last Name | Yes | Yes | Mapped |
| 4 | Email Address | Yes | Yes | Mapped |
| 5 | Company Name | Yes | Yes | Mapped |
| 6 | Address 1 | No | Yes | Mapped |
| 7 | City | No | Yes | Mapped |
| 8 | State or Province | No | Yes | Mapped |
| 9 | Zip or Postal Code | No | Yes | Mapped |
| 10 | Country | Yes | Yes | Dropdown |
| 11 | Business Phone | No | Yes | Mapped |
| 12 | Title | No | Yes | Mapped |
| 13 | Industry | No | Yes | Mapped |
| 14 | Revenue | No | Yes | Mapped |
| 15 | Employee Size | No | Yes | Mapped |
| 16 | Electronic Message Opt Out | No | No | Manual |
| 17 | Opt In - Explicit Date | No | No | Date |
| 18 | Campaign Source | Yes | No | Text (per-batch) |
| 19 | Lead Source - Initial | Yes | No | Dropdown |
| 20 | Lead Source - Most Recent | Yes | No | Dropdown |
| 21 | Product | Yes | No | Dropdown |
| 22 | Call to Action | Yes | No | Dropdown |
| 23 | Target Channel Type | Yes | No | Dropdown |
| 24 | Form Comments | No | Yes | Mapped |
| 25 | Offer Title | No | No | Text |
| 26 | Website | No | Yes | Mapped |
| 27 | Campaign Member Status | Yes | No | Dropdown |
| 28 | SFDC Campaign ID | Yes | No | Text (18 chars) |
| 29 | utm_medium | No | No | Dropdown |
| 30 | utm_source | No | No | Free text |
| 31 | utm_campaign | No | No | Free text |
| 32 | Force MQL | No | Yes | Checkbox → "Yes" |
| 33 | Force MAL | No | Yes | Checkbox → "Yes" |
| 34 | External Asset Status | No | No | Text |
| 35 | Lead Owner ID | No | No | Text |
| 36 | Manual Lead Assignment | No | No | Checkbox → "Yes"; auto-checks when Lead Owner ID set |
| 37 | Bypass Bogus Program | No | No | Checkbox → "Yes" |

**Required for export:** First Name, Last Name, Email Address (valid), Company Name, Country (picklist), Campaign Source, Lead Source - Initial, Lead Source - Most Recent, Product, Call to Action, Target Channel Type, Campaign Member Status, SFDC Campaign ID (18 chars).

**Email + Product Uniqueness (v1.1):** Same email + same Product = error (blocks export). Same email + different Products = warning only.

**Checkbox → Export (v1.1):** Force MQL, Force MAL, Manual Lead Assignment, Bypass Bogus Program all export `Yes` when checked, blank when unchecked.

#### 3. Functional Requirements

##### 3.1 File Upload (Step 1)
FR-1.1 through FR-1.7: Accept .xlsx/.xls/.csv via drag-drop and picker; support multi-file (up to 5); files up to 10,000 rows and 10MB; auto-detect headers; handle UTF-8/Latin-1/Windows-1252; display file list with row count, size, remove button; allow add/remove before advancing.

##### 3.2 Column Mapping (Step 2)
FR-2.1 through FR-2.6: Auto-map via fuzzy matching; per-file interface; show confidence indicator (High/Medium/Low/None); allow override via dropdown; allow "Ignore / Do Not Map"; block advancement if required columns unmapped.

**FR-2.7 (updated v1.2):** The fuzzy matcher must correctly handle vendor headers including:
- `First`, `fname`, `first name`, `FIRST NAME`, `givenName` → First Name
- `Last`, `lname`, `last name`, `LAST NAME`, `surname`, `familyName` → Last Name
- `Email`, `e-mail`, `email address`, `EMAIL ADDRESS`, `mail` → Email Address
- `Company`, `organization`, `org`, `COMPANY NAME`, `account` → Company Name
- `Country`, `nation`, `COUNTRY`, `COUNTRY (use drop down menu)` → Country
- `Product`, `PRODUCT`, `PRODUCT (use drop down menu)`, `products` → Product
- `SFDC Campaign ID`, `SFDC CAMPAIGN ID`, `salesforce campaign id` → SFDC Campaign ID

All UPPERCASE variants and headers with `(use drop down menu)` must resolve with **High** confidence. See architecture.md §4.2 for the algorithm.

##### 3.3 Campaign Settings (Step 3)
FR-3.1 through FR-3.6: Per-file batch panel (Last Response Date, Campaign Source, Lead Sources, Product, CTA, Target Channel Type, Campaign Member Status, SFDC ID [18 chars], utm_medium/source/campaign, Offer Title, Force MQL/MAL); dropdowns enforce picklists; SFDC ID validated; Force MQL/MAL mutually exclusive; per-file tabs; Marketing Ops section (External Asset Status, Lead Owner ID, Manual Lead Assignment auto-check, Bypass Bogus Program).

##### 3.4 Review & Edit (Step 4)
FR-4.1 through FR-4.10: Combined preview table (37 columns); inline edit any cell; per-row overrides; error/warning highlighting; validation summary panel; sort by column; filter by validation status; row deletion; Source File column; Manual Lead Assignment auto-check at row level.

**FR-4.11 (new v1.2):** Step 4 must NOT call `store.set()` from inside `render()`. ProcessedRows must be computed inside render, cached in a module-local variable, and used by `canContinue()`. Writing back to the store causes an infinite render loop.

##### 3.5 Export (Step 5)
FR-5.1 through FR-5.8: CSV or XLSX output; combined file; UTF-8 with BOM; 37-column order preserved; empty columns included; default filename `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`; multi-campaign fallback; block on errors; checkboxes serialize as `Yes` or blank.

##### 3.6 Data Validation Rules
FR-6.1 through FR-6.9: Email regex; duplicate detection (warning for email alone, error for email+Product); country standardization; whitespace trim; name cleanup; legacy `yes/YEs/YES` coercion; SFDC ID = 18 chars; required field check; email+Product uniqueness.

##### 3.7 User Journey & Navigation
FR-7.1 through FR-7.6: 5-step wizard; horizontal step indicator; Back on every step except 1; Next validates before advancing; click completed steps to jump back; Start Over confirmation.

**FR-7.7 (new v1.2):** State changes (typing, checkbox toggle, dropdown change) must **NOT** scroll the page to the top. Only wizard step transitions may scroll to top. See architecture.md §6.

**FR-7.8 (new v1.2):** State changes must **NOT** cause the currently focused input to lose focus. Text-input caret position and text selection must be preserved across re-renders. See architecture.md §6.

##### 3.8 Picklist Management
FR-8.1 through FR-8.4: picklists.json at project root; edits require only refresh; blocking modal on load failure; schema documented in architecture.md §5.

**FR-8.5 (v1.2):** columnSynonyms must cover every mappable template column (all 37) with UPPERCASE, snake_case, and parenthetical variants where they occur in real-world vendor files. See architecture.md §5.1 for the minimum required set.

#### 4. Picklists

Picklists live in `picklists.json` and are unchanged from v1.1: Country (248), Product (18), Lead Source (15), Call to Action (20), Target Channel Type (7), Campaign Member Status (10), utm_medium (23). See architecture.md §5 for schema.

**columnSynonyms was expanded significantly in v1.2** — it now covers all 37 mappable template columns including UPPERCASE and parenthetical variants. See architecture.md §5.1.

#### 5. Non-Functional Requirements

- **NFR-1:** Runs in Chrome, Edge, Firefox (latest 2 versions).
- **NFR-2:** Client-first. No PII leaves the browser.
- **NFR-3:** No NPM / Node.js / build-step.
- **NFR-4:** Optional backend possible in future.
- **NFR-5:** Page load <2 seconds.
- **NFR-6:** File processing <5 seconds for 5,000 rows.
- **NFR-7:** Multi-file supports up to 5 files, 25,000 combined rows.
- **NFR-8:** Desktop-first, tablet OK (1024px+).
- **NFR-9:** WCAG 2.1 AA.
- **NFR-10:** Dark/light mode toggle.
- **NFR-11:** Picklists editable without code change.
- **NFR-12 (new v1.2):** State changes must not scroll the page or steal focus. Part of AC-9.
- **NFR-13 (new v1.2):** Every `.js` file must pass `node --check` before shipping.

#### 6. Out of Scope (v1)

Direct Eloqua API upload, dedup vs existing Eloqua/SFDC, audit log, saved mapping profiles, badge scanner integration, AI enrichment, RBAC, per-campaign output splitting.

#### 7. User Stories

Preserved from v1.1: US-1 through US-13.

#### 8. Acceptance Criteria

**AC-1: File Upload** — Accept .csv/.xlsx/.xls; multi-file; 5,000+ rows within 5 sec; international characters correct.

**AC-2: Column Mapping** — Auto-mapping correctly identifies First Name, Last Name, Email Address, Company Name, Country, Product from **all** of these variants: lowercase, Title Case, UPPERCASE, snake_case, `(use drop down menu)` suffixed. (Updated v1.2.) Manual override works. Unmapped source columns excluded from output. Advancement blocked if required unmapped.

**AC-3: Campaign Settings** — All dropdowns enforce picklists; SFDC ID = 18 chars; per-file settings; Force MQL/MAL exclusivity; Bypass Bogus Program checkbox → `Yes`; Manual Lead Assignment auto-check works.

**AC-4: Review & Edit** — Combined preview; inline editing; validation highlights; duplicate (email, Product) errors, duplicate email alone warnings; per-row overrides work.

**AC-5: Export** — 37 columns in Title Case order; empty columns included; CSV opens in Excel; both CSV and XLSX; filename pattern; checkboxes serialize as `Yes` or blank.

**AC-6: Navigation** — Step indicator; Back preserves data; clickable completed steps; Start Over confirms.

**AC-7: No-NPM Delivery** — No package.json, node_modules, build artifacts; runs from static host; third-party via CDN or vendor/.

**AC-8: Picklist Externalization** — Edit picklists.json + refresh reflects change; malformed file blocks with clear error.

**AC-9 (new v1.2): UI Stability Under State Changes**
- Typing in any text field: no scroll, no focus loss, caret preserved.
- Toggling any checkbox: no scroll, no focus loss.
- Changing any dropdown: no scroll.
- Switching between file tabs on Steps 2/3: scroll to top (subview transition).
- Verified using the DevTools scroll spy in architecture.md §14.