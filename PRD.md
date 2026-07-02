# Product Requirements Document (PRD)
## Progress List Upload Formatter

**Version:** 1.1  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** July 2026

> **What changed in v1.1?** See `updatelog.md` for the full list. Highlights: no-NPM stack, Bypass Bogus Program / Manual Lead Assignment are checkboxes, Lead Owner column removed, picklists externalized to `picklists.json`, column names normalized to Title Case, and a new per-Product email uniqueness rule.

---

### 1. Overview

#### 1.1 Product Name
**Progress List Upload Formatter**

#### 1.2 Purpose
A browser-based web application that enables Progress Software's field marketing, demand generation, and marketing operations teams to transform raw lead lists (from events, tradeshows, vendors, and third-party sources) into the standardized Eloqua list upload template. The app eliminates manual column mapping, reduces data entry errors, enforces validation rules, and supports multi-file batch processing.

#### 1.3 Problem Statement
Team members receive lead lists in varied formats from event vendors, badge scanners, and third-party platforms. Each source uses different column names, orderings, and data formats. Today, formatting these files into the standardized Eloqua upload template is a manual, time-consuming, and error-prone process. Common issues include:
- Inconsistent column names across vendors
- Country values not matching the approved picklist
- Casing inconsistencies (e.g., "YEs" vs "Yes" for Force MQL/MAL)
- Special characters and encoding issues in international names
- Duplicate leads sneaking through to Eloqua
- Manual entry of campaign metadata (Campaign Source, SFDC ID, UTM fields) for every upload
- Same email appearing multiple times against the same product

#### 1.4 Target Users
- **Primary:** Field Marketing team members at Progress Software
- **Secondary:** Demand Generation team members
- **Tertiary:** Marketing Operations team (template & picklist maintenance and oversight)

#### 1.5 Success Metrics
- Reduce average list formatting time from ~30+ minutes to <5 minutes
- Eliminate 95%+ of formatting/validation errors before Eloqua upload
- 100% adoption by field marketing team within first quarter post-launch

---

### 2. Template Schema

The standardized Eloqua upload template contains **37 columns** in a fixed order. All column names are in Title Case (except `utm_*` fields, which follow UTM convention).

#### 2.1 Column Definitions

| # | Column Name | Required | Auto-Mappable | Input Type | Notes |
|---|---|---|---|---|---|
| 1 | Last Response Date | Yes | Yes | Date / per-batch | Format: M/D/YYYY. Defaults to today |
| 2 | First Name | Yes | Yes | Mapped | Core contact field |
| 3 | Last Name | Yes | Yes | Mapped | Core contact field |
| 4 | Email Address | Yes | Yes | Mapped | Must be valid email; unique per Product (see 2.4) |
| 5 | Company Name | Yes | Yes | Mapped | Core contact field |
| 6 | Address 1 | No | Yes | Mapped | Street address |
| 7 | City | No | Yes | Mapped | |
| 8 | State or Province | No | Yes | Mapped | |
| 9 | Zip or Postal Code | No | Yes | Mapped | |
| 10 | Country | Yes | Yes | Dropdown / mapped | Must match approved picklist |
| 11 | Business Phone | No | Yes | Mapped | |
| 12 | Title | No | Yes | Mapped | Job title |
| 13 | Industry | No | Yes | Mapped | |
| 14 | Revenue | No | Yes | Mapped | |
| 15 | Employee Size | No | Yes | Mapped | |
| 16 | Electronic Message Opt Out | No | No | Manual / per-batch | |
| 17 | Opt In - Explicit Date | No | No | Date picker | |
| 18 | Campaign Source | Yes | No | Text (per-batch or row) | e.g., 26Q2 PDP NA DEMD Event 3rd party KGC |
| 19 | Lead Source - Initial | Yes | No | Dropdown (per-batch or row) | See picklist |
| 20 | Lead Source - Most Recent | Yes | No | Dropdown (per-batch or row) | Same picklist as Initial |
| 21 | Product | Yes | No | Dropdown (per-batch or row) | See picklist |
| 22 | Call to Action | Yes | No | Dropdown (per-batch or row) | See picklist |
| 23 | Target Channel Type | Yes | No | Dropdown (per-batch or row) | See picklist |
| 24 | Form Comments | No | Yes | Mapped | Free text |
| 25 | Offer Title | No | No | Text (per-batch or row) | |
| 26 | Website | No | Yes | Mapped | |
| 27 | Campaign Member Status | Yes | No | Dropdown (per-batch or row) | See picklist |
| 28 | SFDC Campaign ID | Yes | No | Text (per-batch or row) | **Must be exactly 18 characters** |
| 29 | utm_medium | No | No | Dropdown (per-batch or row) | See picklist |
| 30 | utm_source | No | No | Free text (per-batch or row) | |
| 31 | utm_campaign | No | No | Free text (per-batch or row) | |
| 32 | Force MQL | No | Yes | Checkbox (per-batch or row) | Exports "Yes" when checked, blank when unchecked |
| 33 | Force MAL | No | Yes | Checkbox (per-batch or row) | Exports "Yes" when checked, blank when unchecked |
| 34 | External Asset Status | No | No | Text | Marketing Ops field (always visible, not required) |
| 35 | Lead Owner ID (Marketing Ops only) | No | No | Text | Marketing Ops field; drives auto-check of Manual Lead Assignment |
| 36 | Manual Lead Assignment (Marketing Ops only) | No | No | Checkbox | Exports "Yes" when checked, blank when unchecked. Auto-checks when Lead Owner ID has a value. |
| 37 | Bypass Bogus Program (Marketing Ops Only) | No | No | Checkbox | Exports "Yes" when checked, blank when unchecked |

> **Removed in v1.1:** The old `LEAD OWNER` column (formerly #34) has been removed. Lead Owner ID (#35) is the sole ownership field.

#### 2.2 Column Categories
- **Contact Fields (auto-mappable from source):** Columns 1–15, 24, 26. These typically exist in source files and are auto-mapped via fuzzy matching.
- **Campaign/Batch Fields (default = same value for all rows):** Columns 18–23, 25, 27–31. Users set these once per file in the Campaign Settings step; can be overridden per row.
- **Routing Fields (per-batch or per-row):** Columns 32–33. Force MQL and Force MAL checkboxes. Can be set as batch default with per-row overrides.
- **Marketing Ops Fields:** Columns 34–37. Always visible in the UI; never required for export. Includes the coupled Lead Owner ID + Manual Lead Assignment behavior.

#### 2.3 Required Fields for Export
A row may not be exported unless the following are populated:
- First Name
- Last Name
- Email Address (must be valid email format)
- Company Name
- Country (must match approved picklist)
- Campaign Source
- Lead Source - Initial
- Lead Source - Most Recent
- Product
- Call to Action
- Target Channel Type
- Campaign Member Status
- SFDC Campaign ID (exactly 18 characters)

#### 2.4 Email + Product Uniqueness (NEW in v1.1)
Across **all files in the session**, each `(Email Address, Product)` pair must appear at most once. If the same email is used against the **same** Product more than once, every occurrence is flagged as an **error** with a message that highlights the duplicated pair and the row numbers involved. The same email against **different** Products is allowed (warning only).

#### 2.5 Checkbox → Export Value Convention (NEW in v1.1)
Fields presented as checkboxes in the UI export a literal string value:
- **Checked:** `Yes`
- **Unchecked:** empty string (blank cell)

Applies to: Force MQL, Force MAL, Manual Lead Assignment, Bypass Bogus Program.

---

### 3. Functional Requirements

#### 3.1 File Upload (Step 1)
- **FR-1.1:** Accept .xlsx, .xls, and .csv file uploads via drag-and-drop and file picker.
- **FR-1.2:** Support multiple files in a single session (multi-file merge).
- **FR-1.3:** Support files up to 10,000 rows and 10MB each.
- **FR-1.4:** Auto-detect column headers from the first row.
- **FR-1.5:** Handle UTF-8, Latin-1, and Windows-1252 encodings (preserve diacritics).
- **FR-1.6:** Display a list of uploaded files with row count, file size, and a remove button.
- **FR-1.7:** Allow adding/removing files before advancing to the next step.

#### 3.2 Column Mapping (Step 2)
- **FR-2.1:** Auto-map source columns to template columns using fuzzy string matching.
- **FR-2.2:** Provide a per-file mapping interface (each file may have different source columns).
- **FR-2.3:** Show each source column with its auto-suggested template column and a confidence indicator.
- **FR-2.4:** Allow manual override of any auto-mapping via dropdown.
- **FR-2.5:** Allow source columns to be marked as "Ignore / Do Not Map."
- **FR-2.6:** Block advancement if any required template column is unmapped.
- **FR-2.7:** Common fuzzy match examples to support:
  - First, fname, first name, givenName → First Name
  - Last, lname, last name, surname, familyName → Last Name
  - Email, e-mail, email address, mail → Email Address
  - Company, organization, org, account → Company Name
  - Country, nation, country/region → Country

#### 3.3 Campaign Settings (Step 3)
- **FR-3.1:** Provide a per-file Campaign Settings panel for batch values:
  - Last Response Date (date picker, defaults to today)
  - Campaign Source (text)
  - Lead Source - Initial (dropdown)
  - Lead Source - Most Recent (dropdown, defaults to Initial value)
  - Product (dropdown)
  - Call to Action (dropdown)
  - Target Channel Type (dropdown)
  - Campaign Member Status (dropdown)
  - SFDC Campaign ID (text, validated to exactly 18 characters)
  - utm_medium (dropdown)
  - utm_source (free text)
  - utm_campaign (free text)
  - Offer Title (free text)
  - Force MQL (checkbox) — applies to all rows in file; exports "Yes"
  - Force MAL (checkbox) — applies to all rows in file; exports "Yes"
- **FR-3.2:** All dropdown fields enforce approved picklist values (see Section 4).
- **FR-3.3:** SFDC Campaign ID must be validated as exactly 18 characters; block advancement if invalid.
- **FR-3.4:** Force MQL and Force MAL are mutually exclusive — if both are checked, show a warning and block advancement.
- **FR-3.5:** When multiple files are uploaded, each file gets its own Campaign Settings tab.
- **FR-3.6:** Marketing Ops section (always visible, not required) contains:
  - External Asset Status (text)
  - Lead Owner ID (text)
  - Manual Lead Assignment (checkbox; **auto-checks when Lead Owner ID has a non-empty value**; user may uncheck manually)
  - Bypass Bogus Program (checkbox; exports "Yes")

#### 3.4 Review & Edit (Step 4)
- **FR-4.1:** Display a combined preview table showing all rows from all files in the template's 37-column order.
- **FR-4.2:** Allow inline editing of any cell (checkbox cells toggle on click).
- **FR-4.3:** Support per-row override of batch values (Product, Campaign, Force MQL/MAL, Lead Owner ID, etc.).
- **FR-4.4:** Highlight cells with validation errors (red border) and warnings (yellow border).
- **FR-4.5:** Display a validation summary panel: total rows, errors, warnings, duplicates (including per-Product email dupes).
- **FR-4.6:** Support sorting by any column.
- **FR-4.7:** Support filtering by validation status.
- **FR-4.8:** Allow row deletion.
- **FR-4.9:** Display a column for Source File so users know which file each row came from.
- **FR-4.10:** Manual Lead Assignment auto-check behavior also applies at the row level: entering a Lead Owner ID for a row auto-checks Manual Lead Assignment for that row.

#### 3.5 Export (Step 5)
- **FR-5.1:** Allow user to choose output format: .csv or .xlsx.
- **FR-5.2:** Combined output: one file containing all rows from all source files.
- **FR-5.3:** CSV export uses UTF-8 with BOM for Excel compatibility.
- **FR-5.4:** Column order in export must exactly match template schema (columns 1–37).
- **FR-5.5:** Empty/optional columns are included as empty columns (never omitted).
- **FR-5.6:** Default file naming convention: `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`.
  - If multiple files have different Campaign Sources, use `multi-campaign` as the prefix.
  - User may override the filename before download.
- **FR-5.7:** Block export if any row has validation errors.
- **FR-5.8:** Checkbox fields serialize as the literal string `Yes` when checked, empty string when unchecked.

#### 3.6 Data Validation Rules
- **FR-6.1 Email format:** Must match standard email regex.
- **FR-6.2 Duplicate detection:** Highlight rows with duplicate email addresses across ALL files (case-insensitive) as warnings, and as **errors** when the duplicate email is paired with the **same Product** (see FR-6.9).
- **FR-6.3 Country standardization:** Auto-map common variants (US, United States, U.S.A. → USA) to picklist values.
- **FR-6.4 Whitespace:** Trim leading/trailing whitespace from all fields.
- **FR-6.5 Name cleanup:** Remove leading special characters from name fields.
- **FR-6.6 Casing standardization:** Legacy imports containing text "yes/YEs/YES" for the four checkbox fields are interpreted as checked.
- **FR-6.7 SFDC Campaign ID:** Must be exactly 18 characters.
- **FR-6.8 Required field check:** All required fields (see 2.3) must be populated for export.
- **FR-6.9 Email + Product uniqueness (NEW):** For each unique `(lowercased_email, Product)` pair, only one row is allowed across the entire session. If more than one row shares the same pair, all offending rows are flagged as errors with a message like: *"Email `jane@acme.com` is used more than once for Product `Sitefinity` (rows 12, 47). Each email may only appear once per Product."*

#### 3.7 User Journey & Navigation
- **FR-7.1:** Implement a 5-step wizard: Upload → Map → Settings → Review → Export.
- **FR-7.2:** Display a horizontal step indicator at the top.
- **FR-7.3:** Provide a Back button on every step (except Step 1) that preserves all entered data.
- **FR-7.4:** Provide a Next/Continue button that validates the current step before advancing.
- **FR-7.5:** Allow users to click on completed steps in the indicator to jump back.
- **FR-7.6:** Provide a "Start Over" link with confirmation modal.

#### 3.8 Picklist Management (NEW in v1.1)
- **FR-8.1:** All picklists (Country, Product, Lead Source, Call to Action, Target Channel Type, Campaign Member Status, utm_medium, plus fuzzy-match synonyms and country aliases) live in an external file `picklists.json`.
- **FR-8.2:** Editing a picklist requires only editing `picklists.json` and re-deploying the static files — **no code change, no rebuild, no NPM step**.
- **FR-8.3:** The app fetches `picklists.json` on load; if the file is missing or malformed, the app displays a blocking error explaining how to fix it.
- **FR-8.4:** `picklists.json` schema is documented in `architecture.md` §5.

---

### 4. Picklists

> Picklists live in `picklists.json` and can be edited without touching code.

#### 4.1 Country (248 values)
Full list unchanged from v1.0. Fuzzy mappings: US, U.S., U.S.A., United States, United States of America → USA; UK, Britain, Great Britain, England → United Kingdom; South Korea → Korea Republic of; North Korea → Korea Democratic People's Republic of; Vietnam → Viet Nam; Taiwan → Taiwan-China; Russia → Russian Federation.

#### 4.2 Product (18 values, alphabetical)
Agentic RAG, ALM Testing, Chef, Consulting Services, Corticon, Data Platform, DataDirect On Prem, DevTools, FiddlerEverywhere, Flowmon, LoadMaster, MarkLogic, Network Monitoring, OpenEdge, Secure File Transfer, Semaphore, ShareFile, Sitefinity

#### 4.3 Lead Source - Initial & Lead Source - Most Recent (same picklist, 15 values)
Added by Sales Rep, Community, Content Syndication, Customer Advocate, Event 3rd Party, Event Seminar, Event Tradeshow, Event Webinar, List Acquisition, Online Ad - 3rd Party, Paid, Support Team Referral, Telemarketing, Telemarketing - 3rd Party, Website

#### 4.4 Call to Action (20 values)
Analyst Report, Case Study, Datasheet, Ebook/Ekit, Evaluation, Event - 3rd party, Event - Webinar, Event - Progress, Event - Tradeshow, Inquiry, Newsletter, Podcast, Promotion/Giveaway, Resource Center, Sales Letter, Search Organic, Survey, Unknown, Video, Whitepaper

#### 4.5 Target Channel Type (7 values)
Direct, OEM, AP, SI, Reseller, ISV, Partner

#### 4.6 Campaign Member Status (10 values)
Submitted, Attended, Registered, Registered Did Not Attend, Viewed Demo, Visited Booth, Viewed Archive, Called, Reached, Targeted

#### 4.7 utm_medium (23 values)
content-paid, cpc, cpm, csyn, email, email-external, event-paid, event-unpaid, infographic, internal-banner, list-acquisition, listings, mobile-app, newsletter, pdf, placement, pr, product, social-owned, social-paid, telemarketing, webinar-paid, webinar-unpaid

#### 4.8 Free Text Fields (no picklist)
utm_source, utm_campaign, Campaign Source, Offer Title, Lead Owner ID, External Asset Status

---

### 5. Non-Functional Requirements
- **NFR-1:** Web app, browser-based. Runs in Chrome, Edge, and Firefox (latest 2 versions).
- **NFR-2:** Client-first architecture. All lead data processing happens in the browser by default. No PII leaves the user's machine in v1.
- **NFR-3:** **No NPM / Node.js / build-step dependency of any kind.** The app is delivered as static HTML/CSS/JS. Third-party libraries (SheetJS, Fuse.js) are loaded via CDN or served from a local `vendor/` folder as pre-built UMD/IIFE files.
- **NFR-4:** Optional lightweight backend may be added in future versions.
- **NFR-5:** Page load time < 2 seconds.
- **NFR-6:** File processing time < 5 seconds for 5,000 rows.
- **NFR-7:** Multi-file merge supports up to 5 files and 25,000 combined rows.
- **NFR-8:** Responsive layout — desktop-first, functional on tablet (1024px+).
- **NFR-9:** WCAG 2.1 AA accessibility compliance.
- **NFR-10:** Dark/light mode toggle.
- **NFR-11:** Picklists editable without a code change or rebuild (see FR-8.1 through FR-8.4).

---

### 6. Out of Scope (v1)
- Direct Eloqua API upload
- Duplicate detection against existing Eloqua/SFDC database
- Audit log
- Saved mapping profiles per vendor
- Integration with badge scanning apps
- AI-powered field enrichment
- Role-based access control / login system
- Per-campaign output splitting

---

### 7. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-1 | Field Marketer | Upload one or more raw event lead lists | I can start the formatting process |
| US-2 | Field Marketer | See auto-suggested column mappings | I don't have to manually figure out which column is which |
| US-3 | Field Marketer | Enter campaign details once per file | Every row gets the same Campaign Source, Product, SFDC ID, etc. |
| US-4 | Field Marketer | Merge multiple files with different products/campaigns | I can process several events in one session |
| US-5 | Field Marketer | Override batch values for specific rows | I can assign named owners and Force MQL for priority leads |
| US-6 | Field Marketer | See validation errors before exporting | I can fix issues before uploading to Eloqua |
| US-7 | Field Marketer | Choose CSV or XLSX output | I have flexibility in how I upload to Eloqua |
| US-8 | Field Marketer | Navigate back to previous steps | I can correct earlier choices without losing data |
| US-9 | Demand Gen | Process a partner-provided lead list | I can format it correctly without manual cleanup |
| US-10 | Marketing Ops | Set Lead Owner ID, Manual Lead Assignment, Bypass Bogus Program via checkboxes | I can handle advanced routing scenarios without typing "Yes" every time |
| US-11 | Field Marketer | See and remove duplicate leads, including per-Product duplicates | I avoid uploading the same person twice to the same product |
| US-12 | Field Marketer | See a step indicator | I always know where I am in the process |
| US-13 | Marketing Ops | Edit picklists in a JSON file without a code change | I can keep Country/Product/CTA/etc. current without a developer |

---

### 8. Acceptance Criteria

#### AC-1: File Upload
- App accepts .csv, .xlsx, and .xls files via drag-drop and picker
- Multiple files can be uploaded and listed
- Files with 5,000+ rows process within 5 seconds
- International characters display correctly

#### AC-2: Column Mapping
- Auto-mapping correctly identifies First Name, Last Name, Email Address, Company Name, Country
- User can override any auto-mapping
- Unmapped source columns are excluded from output
- App blocks advancement if any required template field is unmapped

#### AC-3: Campaign Settings
- All dropdowns enforce approved picklist values
- SFDC Campaign ID validates to exactly 18 characters
- Each uploaded file has its own settings panel
- Force MQL / Force MAL mutual exclusivity is enforced
- Bypass Bogus Program renders as a checkbox and exports "Yes" when checked
- Manual Lead Assignment auto-checks when Lead Owner ID is populated (and can be unchecked manually)

#### AC-4: Review & Edit
- Combined preview shows all rows from all files
- Inline editing works for all cells (checkbox cells toggle on click)
- Validation errors are visually highlighted
- Duplicates on `(email, Product)` are errors; duplicates on email alone are warnings
- Per-row overrides of batch values work correctly

#### AC-5: Export
- Output column order matches template exactly (37 columns)
- Empty/optional columns are included as empty columns
- CSV opens in Excel without encoding issues
- Both CSV and XLSX formats are supported
- Default filename follows `[CampaignSource]_upload_[YYYY-MM-DD]` pattern
- All checkbox fields serialize as `Yes` or blank

#### AC-6: Navigation
- Step indicator shows current/completed/upcoming steps
- Back button preserves all entered data
- User can click completed steps to jump back
- "Start Over" requires confirmation

#### AC-7: No-NPM Delivery (NEW)
- The project contains no `package.json`, `node_modules/`, `vite.config.*`, `tsconfig.json`, or any build artifact
- The app runs by opening `index.html` directly from a static host
- All third-party JS is loaded via `<script>` tags from CDN or a local `vendor/` folder

#### AC-8: Picklist Externalization (NEW)
- Editing an entry in `picklists.json` and refreshing the page reflects the change with no code edits
- Malformed `picklists.json` blocks the app with a clear error message
