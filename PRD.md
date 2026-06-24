# Product Requirements Document (PRD)
# Progress List Upload Formatter

**Version:** 1.0  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** June 2026

---

## 1. Overview

### 1.1 Product Name
**Progress List Upload Formatter**

### 1.2 Purpose
A browser-based web application that enables Progress Software's field marketing, demand generation, and marketing operations teams to transform raw lead lists (from events, tradeshows, vendors, and third-party sources) into the standardized 38-column Eloqua list upload template. The app eliminates manual column mapping, reduces data entry errors, enforces validation rules, and supports multi-file batch processing.

### 1.3 Problem Statement
Team members receive lead lists in varied formats from event vendors, badge scanners, and third-party platforms. Each source uses different column names, orderings, and data formats. Today, formatting these files into the standardized 38-column Eloqua upload template is a manual, time-consuming, and error-prone process. Common issues include:
- Inconsistent column names across vendors
- Country values not matching the approved picklist
- Casing inconsistencies (e.g., `"YEs"` vs `"Yes"` for Force MQL/MAL)
- Special characters and encoding issues in international names
- Duplicate leads sneaking through to Eloqua
- Manual entry of campaign metadata (Campaign Source, SFDC ID, UTM fields) for every upload

### 1.4 Target Users
- **Primary:** Field Marketing team members at Progress Software
- **Secondary:** Demand Generation team members
- **Tertiary:** Marketing Operations team (template maintenance and oversight)

### 1.5 Success Metrics
- Reduce average list formatting time from ~30+ minutes to <5 minutes
- Eliminate 95%+ of formatting/validation errors before Eloqua upload
- 100% adoption by field marketing team within first quarter post-launch

---

## 2. Template Schema

The standardized Eloqua upload template contains **38 columns** in a fixed order.

### 2.1 Column Definitions

| # | Column Name | Required | Auto-Mappable | Input Type | Notes |
|---|---|---|---|---|---|
| 1 | `LAST RESPONSE DATE` | ✅ | ✅ | Date / per-batch | Format: `M/D/YYYY`. Defaults to today |
| 2 | `FIRST NAME` | ✅ | ✅ | Mapped | Core contact field |
| 3 | `LAST NAME` | ✅ | ✅ | Mapped | Core contact field |
| 4 | `EMAIL ADDRESS` | ✅ | ✅ | Mapped | Must be valid email; unique identifier |
| 5 | `COMPANY NAME` | ✅ | ✅ | Mapped | Core contact field |
| 6 | `ADDRESS 1` | ❌ | ✅ | Mapped | Street address |
| 7 | `CITY` | ❌ | ✅ | Mapped | |
| 8 | `STATE OR PROVINCE` | ❌ | ✅ | Mapped | |
| 9 | `ZIP OR POSTAL CODE` | ❌ | ✅ | Mapped | |
| 10 | `COUNTRY (use drop down menu)` | ✅ | ✅ | Dropdown / mapped | Must match approved picklist |
| 11 | `BUSINESS PHONE` | ❌ | ✅ | Mapped | |
| 12 | `Title` | ❌ | ✅ | Mapped | Job title |
| 13 | `INDUSTRY` | ❌ | ✅ | Mapped | |
| 14 | `REVENUE` | ❌ | ✅ | Mapped | |
| 15 | `EMPLOYEE SIZE` | ❌ | ✅ | Mapped | |
| 16 | `Electronic Message Opt Out` | ❌ | ❌ | Manual / per-batch | |
| 17 | `Opt In - Explicit Date` | ❌ | ❌ | Date picker | |
| 18 | `CAMPAIGN SOURCE` | ✅ | ❌ | Text (per-batch or row) | e.g., `26Q2 PDP NA DEMD Event 3rd party KGC` |
| 19 | `LEAD SOURCE - INITIAL` | ✅ | ❌ | Dropdown (per-batch or row) | See picklist |
| 20 | `LEAD SOURCE - MOST RECENT` | ✅ | ❌ | Dropdown (per-batch or row) | Same picklist as Initial |
| 21 | `PRODUCT (use drop down menu)` | ✅ | ❌ | Dropdown (per-batch or row) | See picklist |
| 22 | `CALL TO ACTION` | ✅ | ❌ | Dropdown (per-batch or row) | See picklist |
| 23 | `TARGET CHANNEL TYPE` | ✅ | ❌ | Dropdown (per-batch or row) | See picklist |
| 24 | `FORM COMMENTS` | ❌ | ✅ | Mapped | Free text |
| 25 | `OFFER TITLE` | ❌ | ❌ | Text (per-batch or row) | |
| 26 | `Website` | ❌ | ✅ | Mapped | |
| 27 | `CAMPAIGN MEMBER STATUS` | ✅ | ❌ | Dropdown (per-batch or row) | See picklist |
| 28 | `SFDC CAMPAIGN ID` | ✅ | ❌ | Text (per-batch or row) | **Must be exactly 18 characters** |
| 29 | `utm_medium` | ❌ | ❌ | Dropdown (per-batch or row) | See picklist |
| 30 | `utm_source` | ❌ | ❌ | Free text (per-batch or row) | |
| 31 | `utm_campaign` | ❌ | ❌ | Free text (per-batch or row) | |
| 32 | `Force MQL` | ❌ | ✅ | Checkbox (per-batch or row) | `Yes` or blank |
| 33 | `Force MAL` | ❌ | ✅ | Checkbox (per-batch or row) | `Yes` or blank |
| 34 | `LEAD OWNER` | ❌ | ✅ | Text (per-batch or row) | Name or `Queue - Auto-Nurture` |
| 35 | `External Asset Status` | ❌ | ❌ | Text | Marketing Ops field (always visible, not required) |
| 36 | `Lead Owner ID (Marketing Ops only)` | ❌ | ❌ | Text | Marketing Ops field (always visible, not required) |
| 37 | `Manual Lead Assignment (Marketing Ops only))` | ❌ | ❌ | Text | Marketing Ops field (always visible, not required) |
| 38 | `Bypass Bogus Program (Marketing Ops Only)` | ❌ | ❌ | Text | Marketing Ops field (always visible, not required) |

### 2.2 Column Categories

- **Contact Fields (auto-mappable from source):** Columns 1–15, 24, 26. These typically exist in source files and are auto-mapped via fuzzy matching.
- **Campaign/Batch Fields (default = same value for all rows):** Columns 18–23, 25, 27–31. Users set these once per file in the Campaign Settings step; can be overridden per row.
- **Routing Fields (per-batch or per-row):** Columns 32–34. Force MQL, Force MAL, and Lead Owner. Can be set as batch default with per-row overrides.
- **Marketing Ops Fields:** Columns 35–38. Always visible in the UI; never required for export.

### 2.3 Required Fields for Export
A row may not be exported unless the following are populated:
- `FIRST NAME`
- `LAST NAME`
- `EMAIL ADDRESS` (must be valid email format)
- `COMPANY NAME`
- `COUNTRY (use drop down menu)` (must match approved picklist)
- `CAMPAIGN SOURCE`
- `LEAD SOURCE - INITIAL`
- `LEAD SOURCE - MOST RECENT`
- `PRODUCT (use drop down menu)`
- `CALL TO ACTION`
- `TARGET CHANNEL TYPE`
- `CAMPAIGN MEMBER STATUS`
- `SFDC CAMPAIGN ID` (exactly 18 characters)

---

## 3. Functional Requirements

### 3.1 File Upload (Step 1)
- **FR-1.1:** Accept `.xlsx`, `.xls`, and `.csv` file uploads via drag-and-drop and file picker.
- **FR-1.2:** Support multiple files in a single session (multi-file merge).
- **FR-1.3:** Support files up to 10,000 rows and 10MB each.
- **FR-1.4:** Auto-detect column headers from the first row.
- **FR-1.5:** Handle UTF-8, Latin-1, and Windows-1252 encodings (preserve diacritics).
- **FR-1.6:** Display a list of uploaded files with row count, file size, and a remove button.
- **FR-1.7:** Allow adding/removing files before advancing to the next step.

### 3.2 Column Mapping (Step 2)
- **FR-2.1:** Auto-map source columns to template columns using fuzzy string matching.
- **FR-2.2:** Provide a per-file mapping interface (each file may have different source columns).
- **FR-2.3:** Show each source column with its auto-suggested template column and a confidence indicator.
- **FR-2.4:** Allow manual override of any auto-mapping via dropdown.
- **FR-2.5:** Allow source columns to be marked as "Ignore / Do Not Map."
- **FR-2.6:** Block advancement if any required template column is unmapped.
- **FR-2.7:** Common fuzzy match examples to support:
  - `First`, `fname`, `first name`, `givenName` → `FIRST NAME`
  - `Last`, `lname`, `last name`, `surname`, `familyName` → `LAST NAME`
  - `Email`, `e-mail`, `email address`, `mail` → `EMAIL ADDRESS`
  - `Company`, `organization`, `org`, `account` → `COMPANY NAME`
  - `Country`, `nation` → `COUNTRY`

### 3.3 Campaign Settings (Step 3)
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
  - Force MQL (checkbox) — applies to all rows in file
  - Force MAL (checkbox) — applies to all rows in file
  - Lead Owner (text, defaults to `Queue - Auto-Nurture`)
- **FR-3.2:** All dropdown fields enforce approved picklist values (see Section 4).
- **FR-3.3:** SFDC Campaign ID must be validated as exactly 18 characters; block advancement if invalid.
- **FR-3.4:** Force MQL and Force MAL are mutually exclusive — if both are checked, show a warning and block advancement.
- **FR-3.5:** When multiple files are uploaded, each file gets its own Campaign Settings tab.

### 3.4 Review & Edit (Step 4)
- **FR-4.1:** Display a combined preview table showing all rows from all files in the template's 38-column order.
- **FR-4.2:** Allow inline editing of any cell.
- **FR-4.3:** Support per-row override of batch values (Product, Campaign, Force MQL/MAL, Lead Owner, etc.).
- **FR-4.4:** Highlight cells with validation errors (red border) and warnings (yellow border).
- **FR-4.5:** Display a validation summary panel: total rows, errors, warnings, duplicates.
- **FR-4.6:** Support sorting by any column.
- **FR-4.7:** Support filtering by validation status (Show errors only, Show warnings only, Show duplicates only).
- **FR-4.8:** Allow row deletion (e.g., to remove duplicates).
- **FR-4.9:** Display a column for `Source File` so users know which file each row came from.

### 3.5 Export (Step 5)
- **FR-5.1:** Allow user to choose output format: `.csv` or `.xlsx`.
- **FR-5.2:** Combined output: one file containing all rows from all source files.
- **FR-5.3:** CSV export uses UTF-8 with BOM for Excel compatibility.
- **FR-5.4:** Column order in export must exactly match template schema (columns 1–38).
- **FR-5.5:** Empty/optional columns are included as empty columns (never omitted).
- **FR-5.6:** Default file naming convention: `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`.
  - If multiple files have different Campaign Sources, use `multi-campaign` as the prefix.
  - User may override the filename before download.
- **FR-5.7:** Block export if any row has validation errors. Display the list of errors with row numbers.

### 3.6 Data Validation Rules
- **FR-6.1 Email format:** Must match standard email regex. Missing or invalid emails are errors.
- **FR-6.2 Duplicate detection:** Highlight rows with duplicate email addresses across ALL files (case-insensitive). Treat as errors.
- **FR-6.3 Country standardization:** Auto-map common variants (`US`, `United States`, `U.S.A.` → `USA`) to picklist values.
- **FR-6.4 Whitespace:** Trim leading/trailing whitespace from all fields.
- **FR-6.5 Name cleanup:** Remove leading special characters from name fields (e.g., `"? Jürgensen"` → `"Jürgensen"`). Preserve valid diacritics.
- **FR-6.6 Casing standardization:** Force MQL / Force MAL values normalized to `"Yes"` (handles `"YEs"`, `"YES"`, `"yes"` variants).
- **FR-6.7 SFDC Campaign ID:** Must be exactly 18 characters.
- **FR-6.8 Required field check:** All required fields (see 2.3) must be populated for export.

### 3.7 User Journey & Navigation
- **FR-7.1:** Implement a 5-step wizard: Upload → Map → Settings → Review → Export.
- **FR-7.2:** Display a horizontal step indicator at the top showing current/completed/upcoming steps.
- **FR-7.3:** Provide a Back button on every step (except Step 1) that preserves all entered data.
- **FR-7.4:** Provide a Next/Continue button that validates the current step before advancing.
- **FR-7.5:** Allow users to click on completed steps in the indicator to jump back (but not skip ahead).
- **FR-7.6:** Provide a "Start Over" link with confirmation modal that clears all data.

---

## 4. Picklists

### 4.1 COUNTRY (248 values)
```
Afghanistan, Aland Islands, Albania, Algeria, American Samoa, Andorra, Angola, Anguilla,
Antarctica, Antigua and Barbuda, Argentina, Armenia, Aruba, Australia, Austria, Azerbaijan,
Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bermuda, Bhutan,
Bolivia, Bonaire Sint Eustatius and Saba, Bosnia and Herzegovina, Botswana, Bouvet Island,
Brazil, British Indian Ocean Territory, Brunei Darussalam, Bulgaria, Burkina Faso, Burundi,
Cambodia, Cameroon, Canada, Cape Verde, Cayman Islands, Central African Republic, Chad,
Chile, China, Christmas Island, Cocos (Keeling) Islands, Colombia, Comoros, Congo,
Congo the Democratic Republic of the, Cook Islands, Costa Rica, Cote d'Ivoire, Croatia,
Cuba, Curacao, Cyprus, Czech Republic, Denmark, Djibouti, Dominica, Dominican Republic,
Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Ethiopia, Falkland Islands,
Faroe Islands, Fiji, Finland, France, French Guiana, French Polynesia,
French Southern Territories, Gabon, Gambia, Georgia, Germany, Ghana, Gibraltar, Greece,
Greenland, Grenada, Guadeloupe, Guam, Guatemala, Guernsey, Guinea, Guinea-Bissau, Guyana,
Haiti, Heard Island and McDonald Islands, Holy See (Vatican City State), Honduras, Hong Kong,
Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Isle of Man, Israel, Italy, Jamaica,
Japan, Jersey, Jordan, Kazakhstan, Kenya, Kiribati, Korea Democratic People's Republic of,
Korea Republic of, Kuwait, Kyrgyzstan, Lao People's Democratic Republic, Latvia, Lebanon,
Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Macao,
Macedonia the former Yugoslav Republic of, Madagascar, Malawi, Malaysia, Maldives, Mali,
Malta, Marshall Islands, Martinique, Mauritania, Mauritius, Mayotte, Mexico, Micronesia,
Moldova Republic of, Monaco, Mongolia, Montenegro, Montserrat, Morocco, Mozambique, Myanmar,
Namibia, Nauru, Nepal, Netherlands, Netherlands Antilles, New Caledonia, New Zealand,
Nicaragua, Niger, Nigeria, Niue, Norfolk Island, Northern Mariana Islands, Norway, Oman,
Pakistan, Palau, Palestine, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Pitcairn,
Poland, Portugal, Puerto Rico, Qatar, Reunion, Romania, Russian Federation, Rwanda,
Saint Barthélemy, Saint Helena, Saint Kitts and Nevis, Saint Lucia, Saint Martin (French part),
Saint Pierre and Miquelon, Saint Vincent and the Grenadines, Samoa, San Marino,
Sao Tome and Principe, Saudi Arabia, Senegal, Serbia, Serbia and Montenegro, Seychelles,
Sierra Leone, Singapore, Sint Maarten (Dutch part), Slovakia, Slovenia, Solomon Islands,
Somalia, South Africa, South Georgia and the South Sandwich Islands, South Sudan, Spain,
Sri Lanka, Sudan, Suriname, Svalbard and Jan Mayen, Swaziland, Sweden, Switzerland,
Syrian Arab Republic, Taiwan-China, Tajikistan, Tanzania United Republic of, Thailand,
Timor-Leste, Togo, Tokelau, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan,
Turks and Caicos Islands, Tuvalu, U.S. Minor Outlying Is., Uganda, Ukraine,
United Arab Emirates, United Kingdom, Uruguay, USA, Uzbekistan, Vanuatu,
Venezuela Bolivarian Republic of, Viet Nam, Virgin Islands British, Virgin Islands U.S.,
Wallis and Futuna, Western Sahara, Yemen, Zambia, Zimbabwe
```

**Country fuzzy mapping for common variants:**
- `US`, `U.S.`, `U.S.A.`, `United States`, `United States of America` → `USA`
- `UK`, `Britain`, `Great Britain`, `England` → `United Kingdom`
- `South Korea` → `Korea Republic of`
- `North Korea` → `Korea Democratic People's Republic of`
- `Vietnam` → `Viet Nam`
- `Taiwan` → `Taiwan-China`
- `Russia` → `Russian Federation`

### 4.2 PRODUCT (18 values, alphabetical)
```
Agentic RAG, ALM Testing, Chef, Consulting Services, Corticon, Data Platform,
DataDirect On Prem, DevTools, FiddlerEverywhere, Flowmon, LoadMaster, MarkLogic,
Network Monitoring, OpenEdge, Secure File Transfer, Semaphore, ShareFile, Sitefinity
```

### 4.3 LEAD SOURCE - INITIAL & LEAD SOURCE - MOST RECENT (same picklist, 15 values)
```
Added by Sales Rep, Community, Content Syndication, Customer Advocate, Event 3rd Party,
Event Seminar, Event Tradeshow, Event Webinar, List Acquisition, Online Ad - 3rd Party,
Paid, Support Team Referral, Telemarketing, Telemarketing - 3rd Party, Website
```

### 4.4 CALL TO ACTION (20 values)
```
Analyst Report, Case Study, Datasheet, Ebook/Ekit, Evaluation, Event - 3rd party,
Event - Webinar, Event - Progress, Event - Tradeshow, Inquiry, Newsletter, Podcast,
Promotion/Giveaway, Resource Center, Sales Letter, Search Organic, Survey, Unknown,
Video, Whitepaper
```

### 4.5 TARGET CHANNEL TYPE (7 values)
```
Direct, OEM, AP, SI, Reseller, ISV, Partner
```

### 4.6 CAMPAIGN MEMBER STATUS (10 values)
```
Submitted, Attended, Registered, Registered Did Not Attend, Viewed Demo, Visited Booth,
Viewed Archive, Called, Reached, Targeted
```

### 4.7 utm_medium (23 values)
```
content-paid, cpc, cpm, csyn, email, email-external, event-paid, event-unpaid,
infographic, internal-banner, list-acquisition, listings, mobile-app, newsletter,
pdf, placement, pr, product, social-owned, social-paid, telemarketing,
webinar-paid, webinar-unpaid
```

### 4.8 Free Text Fields (no picklist)
- `utm_source` — free text (e.g., `KGC`, `TechTarget`, vendor name)
- `utm_campaign` — free text (e.g., `pdp_na_pdp_event_KGC`)
- `CAMPAIGN SOURCE` — free text (formatted campaign name)
- `Offer Title` — free text
- `LEAD OWNER` — free text (typically a name or `Queue - Auto-Nurture`)

---

## 5. Non-Functional Requirements

- **NFR-1:** Web app, browser-based. Runs in Chrome, Edge, and Firefox (latest 2 versions).
- **NFR-2:** Client-first architecture. All lead data processing happens in the browser by default. No PII leaves the user's machine in v1.
- **NFR-3:** Optional lightweight backend may be added in future versions for saved profiles, audit logs, or direct Eloqua integration.
- **NFR-4:** Page load time < 2 seconds.
- **NFR-5:** File processing time < 5 seconds for 5,000 rows.
- **NFR-6:** Multi-file merge supports up to 5 files and 25,000 combined rows.
- **NFR-7:** Responsive layout — desktop-first, functional on tablet (1024px+).
- **NFR-8:** WCAG 2.1 AA accessibility compliance.
- **NFR-9:** Dark/light mode toggle.

---

## 6. Out of Scope (v1)

Documented for future consideration:
- Direct Eloqua API upload from the app
- Duplicate detection against existing Eloqua/SFDC database (only in-batch dedup in v1)
- Audit log of who uploaded what and when
- Saved mapping profiles per vendor (fuzzy auto-map only in v1)
- Integration with badge scanning apps (iCapture, Cvent LeadCapture)
- AI-powered field enrichment (company size, industry inference)
- Role-based access control / login system
- Per-campaign output splitting (v1 produces a single combined file only)

---

## 7. User Stories

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
| US-10 | Marketing Ops | Set Lead Owner ID, Manual Lead Assignment, Bypass Bogus Program | I can handle advanced routing scenarios |
| US-11 | Field Marketer | See and remove duplicate leads | I avoid uploading the same person twice |
| US-12 | Field Marketer | See a step indicator | I always know where I am in the process |

---

## 8. Acceptance Criteria

### AC-1: File Upload
- [ ] App accepts .csv, .xlsx, and .xls files via drag-drop and picker
- [ ] Multiple files can be uploaded and listed
- [ ] Files with 5,000+ rows process within 5 seconds
- [ ] International characters display correctly (Jürgensen, Lörtsch, etc.)

### AC-2: Column Mapping
- [ ] Auto-mapping correctly identifies First Name, Last Name, Email, Company, Country from common header variants
- [ ] User can override any auto-mapping
- [ ] Unmapped source columns are excluded from output
- [ ] App blocks advancement if any required template field is unmapped

### AC-3: Campaign Settings
- [ ] All dropdowns enforce approved picklist values
- [ ] SFDC Campaign ID validates to exactly 18 characters
- [ ] Each uploaded file has its own settings panel
- [ ] Force MQL / Force MAL mutual exclusivity is enforced

### AC-4: Review & Edit
- [ ] Combined preview shows all rows from all files
- [ ] Inline editing works for all cells
- [ ] Validation errors are visually highlighted
- [ ] Duplicates (by email) are detected and flagged
- [ ] Per-row overrides of batch values work correctly

### AC-5: Export
- [ ] Output column order matches template exactly (38 columns)
- [ ] Empty/optional columns are included as empty columns
- [ ] CSV opens in Excel without encoding issues
- [ ] Both CSV and XLSX formats are supported
- [ ] Default filename follows `[CampaignSource]_upload_[YYYY-MM-DD]` pattern

### AC-6: Navigation
- [ ] Step indicator shows current/completed/upcoming steps
- [ ] Back button preserves all entered data
- [ ] User can click completed steps to jump back
- [ ] "Start Over" requires confirmation
