# Technical Architecture
# Progress List Upload Formatter

**Version:** 1.0  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** June 2026

---

## 1. Architecture Overview

### 1.1 Architecture Philosophy
**Client-first, optional backend.** The v1 application runs entirely in the user's browser — no lead data is transmitted to any server. This eliminates privacy/compliance concerns and removes infrastructure dependencies. The architecture is designed so a lightweight backend can be added later (for saved profiles, audit logs, or direct Eloqua integration) without rewriting the core processing engine.

### 1.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (CLIENT)                         │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  UI Layer    │───▶│  State Mgmt  │───▶│  Processing      │  │
│  │  (React)     │    │  (Zustand)   │    │  Engine          │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                    │                    │             │
│         │                    │                    ▼             │
│         │                    │            ┌──────────────┐     │
│         │                    │            │  File Parser │     │
│         │                    │            │  (SheetJS)   │     │
│         │                    │            └──────────────┘     │
│         │                    │                    │             │
│         │                    │                    ▼             │
│         │                    │            ┌──────────────┐     │
│         │                    │            │  Fuzzy       │     │
│         │                    │            │  Matcher     │     │
│         │                    │            │  (Fuse.js)   │     │
│         │                    │            └──────────────┘     │
│         │                    │                    │             │
│         │                    │                    ▼             │
│         │                    │            ┌──────────────┐     │
│         │                    │            │  Validation  │     │
│         │                    │            │  Engine      │     │
│         │                    │            └──────────────┘     │
│         │                    │                    │             │
│         │                    │                    ▼             │
│         │                    │            ┌──────────────┐     │
│         │                    └───────────▶│  Export      │     │
│         │                                 │  (SheetJS)   │     │
│         │                                 └──────────────┘     │
│         ▼                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Browser File Download (no server roundtrip)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              FUTURE (Optional Lightweight Backend)               │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  REST API    │    │  Mapping     │    │  Audit Log       │  │
│  │  (Node)      │    │  Profiles    │    │  (SQLite/PG)     │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Recommended Tech Stack

### 2.1 Frontend (v1)
| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 18 + TypeScript | Industry standard; strong typing prevents schema bugs |
| **Build Tool** | Vite | Fast HMR, small bundles, modern DX |
| **State Management** | Zustand | Lightweight, no boilerplate, perfect for wizard-style state |
| **UI Components** | Custom + Headless UI / Radix | Accessibility-first primitives; full design control |
| **Styling** | Tailwind CSS | Rapid iteration; matches Progress design tokens |
| **File Parsing** | SheetJS (xlsx) | Battle-tested for .xlsx, .xls, .csv |
| **Fuzzy Matching** | Fuse.js | Lightweight, configurable, works for column-name matching |
| **Data Grid** | TanStack Table v8 | Headless table with sorting/filtering/virtualization for large rows |
| **Date Handling** | date-fns | Modular, tree-shakable |
| **Hosting** | Static hosting (Azure Static Web Apps, Netlify, or internal CDN) | No server required; can be embedded in internal portal |

### 2.2 Backend (Future, Optional)
| Layer | Technology | Rationale |
|---|---|---|
| **Runtime** | Node.js 20+ | Same language as frontend; shared validation logic |
| **Framework** | Fastify or Express | Lightweight REST API |
| **Database** | PostgreSQL or SQLite | For saved mapping profiles, audit logs |
| **Auth** | Microsoft Entra ID (SSO) | Matches Progress internal auth standards |
| **Hosting** | Azure App Service | Aligns with Progress infrastructure |

### 2.3 Why Not Other Stacks?
- **Vue/Svelte:** Both viable, but React has the largest internal talent pool at Progress.
- **Next.js:** Overkill for a client-only app; adds SSR complexity not needed here.
- **Python + Flask:** Not suitable for client-side execution; would require always-on server.
- **Vanilla JS:** Workable but harder to maintain as features grow (wizard state, complex validation, large data grid).

---

## 3. Data Flow

### 3.1 End-to-End Pipeline

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ 1. UPLOAD    │───▶│ 2. PARSE     │───▶│ 3. MAP       │───▶│ 4. ENRICH    │
│              │    │              │    │              │    │              │
│ User drops   │    │ SheetJS      │    │ Fuzzy match  │    │ Apply batch  │
│ files        │    │ reads files  │    │ source cols  │    │ values (per  │
│              │    │ → JSON arrays│    │ → template   │    │ file)        │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                    │
                                                                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ 8. DOWNLOAD  │◀───│ 7. SERIALIZE │◀───│ 6. EDIT      │◀───│ 5. VALIDATE  │
│              │    │              │    │              │    │              │
│ Browser      │    │ SheetJS      │    │ User reviews │    │ Email,       │
│ saves file   │    │ writes CSV   │    │ + inline     │    │ duplicates,  │
│              │    │ / XLSX       │    │ edits        │    │ required,    │
│              │    │              │    │              │    │ SFDC ID, etc.│
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### 3.2 In-Memory Data Model

```typescript
// Per-file state
interface SourceFile {
  id: string;                          // UUID
  fileName: string;
  rowCount: number;
  sourceColumns: string[];             // Original column headers from file
  rawRows: Record<string, string>[];   // Raw data, keyed by source column
  columnMapping: Record<string, string | null>;  // sourceCol → templateCol (or null if ignored)
  batchSettings: BatchSettings;        // Per-file batch values
}

interface BatchSettings {
  LAST_RESPONSE_DATE: string;          // ISO date
  CAMPAIGN_SOURCE: string;
  LEAD_SOURCE_INITIAL: string;
  LEAD_SOURCE_MOST_RECENT: string;
  PRODUCT: string;
  CALL_TO_ACTION: string;
  TARGET_CHANNEL_TYPE: string;
  CAMPAIGN_MEMBER_STATUS: string;
  SFDC_CAMPAIGN_ID: string;            // Must be 18 chars
  utm_medium: string;
  utm_source: string;
  utm_campaign: string;
  OFFER_TITLE: string;
  FORCE_MQL: boolean;
  FORCE_MAL: boolean;
  LEAD_OWNER: string;                  // Default: "Queue - Auto-Nurture"
}

// Combined processed state
interface ProcessedRow {
  sourceFileId: string;
  rowIndex: number;                    // Original row in source file
  data: Record<TemplateColumn, string>; // All 38 template columns
  validations: ValidationResult[];
  isDuplicate: boolean;
}

interface ValidationResult {
  field: string;
  severity: "error" | "warning";
  message: string;
}
```

### 3.3 Wizard State Machine

```typescript
type WizardStep = 
  | "upload"      // Step 1
  | "mapping"     // Step 2
  | "settings"    // Step 3
  | "review"      // Step 4
  | "export";     // Step 5

interface WizardState {
  currentStep: WizardStep;
  completedSteps: Set<WizardStep>;
  files: SourceFile[];
  processedRows: ProcessedRow[];       // Computed from files + settings
  outputFormat: "csv" | "xlsx";
  outputFilename: string;
}
```

State transitions are gated by step-level validators. The Back button always preserves state; the Next button runs the step's validator.

---

## 4. Core Modules

### 4.1 File Parser Module
**Responsibility:** Parse uploaded files into normalized JSON arrays.

- Accepts `File` objects from drag-drop or file picker
- Uses SheetJS (`xlsx` library) to handle `.xlsx`, `.xls`, `.csv`
- Auto-detects encoding (UTF-8, Latin-1, Windows-1252) for CSV files
- Extracts the first row as headers
- Preserves international characters (diacritics)
- Returns `{ sourceColumns: string[], rawRows: Record<string, string>[] }`
- Handles errors: corrupt files, empty files, files exceeding size limits

### 4.2 Fuzzy Matcher Module
**Responsibility:** Auto-map source columns to template columns.

- Uses Fuse.js with a configurable similarity threshold (default 0.4)
- Maintains a **synonym dictionary** for each template column:

```typescript
const COLUMN_SYNONYMS: Record<TemplateColumn, string[]> = {
  "FIRST NAME":   ["first", "fname", "firstname", "first name", "given name", "givenname"],
  "LAST NAME":    ["last", "lname", "lastname", "last name", "surname", "family name"],
  "EMAIL ADDRESS":["email", "e-mail", "email address", "mail", "emailaddress"],
  "COMPANY NAME": ["company", "organization", "org", "account", "employer", "company name"],
  "COUNTRY (use drop down menu)": ["country", "nation", "country/region"],
  "BUSINESS PHONE": ["phone", "telephone", "tel", "business phone", "work phone", "mobile"],
  "Title":        ["title", "job title", "position", "role", "jobtitle"],
  // ... full mapping for all auto-mappable columns
};
```

- Returns: `Map<sourceColumn, { templateColumn: string | null, confidence: number }>`
- Confidence levels: High (≥0.8), Medium (0.6–0.79), Low (0.4–0.59), No Match (<0.4)

### 4.3 Country Standardizer Module
**Responsibility:** Map source country values to the approved picklist.

- Built-in alias map for common variants (US → USA, UK → United Kingdom, etc.)
- For unmapped values, applies fuzzy matching against the 248-value picklist
- Flags unmappable values as validation errors

### 4.4 Validation Engine
**Responsibility:** Apply all validation rules and produce per-row results.

Validation rules (run in order):
1. **Whitespace trim** — strip leading/trailing whitespace from all fields
2. **Name cleanup** — remove leading special chars from FIRST NAME / LAST NAME
3. **Casing normalization** — `YEs`/`YES`/`yes` → `Yes` for Force MQL/MAL
4. **Country standardization** — map variants to picklist
5. **Required field check** — all required fields must be non-empty
6. **Email format check** — must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`
7. **SFDC Campaign ID check** — must be exactly 18 characters
8. **Picklist conformance** — Country, Product, Lead Source, CTA, Channel, Campaign Member Status, utm_medium must match picklists
9. **Force MQL/MAL mutual exclusivity** — both cannot be "Yes" on same row
10. **Duplicate detection** — flag rows with duplicate emails across ALL files (case-insensitive)

Returns an array of `ValidationResult` objects per row, plus a global summary.

### 4.5 Export Module
**Responsibility:** Serialize processed rows to CSV or XLSX.

- Uses SheetJS to write output
- CSV: UTF-8 with BOM (`\uFEFF` prefix) for Excel compatibility
- Column order: exactly matches template schema (columns 1–38)
- Empty/optional columns included as empty columns (never omitted)
- Filename: `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`
  - Multi-campaign uploads use `multi-campaign` prefix
- Triggers browser download via Blob + `URL.createObjectURL`

---

## 5. Component Architecture (React)

### 5.1 Component Tree

```
<App>
├── <AppHeader />                    // Progress brand nav
├── <StepIndicator />                // 5-step wizard progress bar
├── <WizardRouter>                   // Routes to current step component
│   ├── <Step1Upload />              // Drag-drop, file list
│   ├── <Step2Mapping />             // Per-file column mapping UI
│   │   └── <FileMappingPanel />     // Repeated per file
│   ├── <Step3Settings />            // Per-file campaign settings
│   │   └── <BatchSettingsForm />    // Repeated per file (tabs)
│   ├── <Step4Review />              // Combined data grid + validation
│   │   ├── <ValidationSummary />
│   │   └── <DataGrid />             // TanStack Table
│   └── <Step5Export />              // Format select + download
├── <NavigationFooter />             // Back / Next buttons
└── <AppFooter />                    // Progress footer
```

### 5.2 State Management Strategy

Use **Zustand** stores split by concern:

```typescript
// wizardStore.ts — wizard navigation + completed steps
useWizardStore: {
  currentStep, completedSteps,
  goNext(), goBack(), goToStep(step), startOver()
}

// filesStore.ts — uploaded files + parsed data
useFilesStore: {
  files: SourceFile[],
  addFile(file), removeFile(id),
  updateMapping(fileId, mapping),
  updateBatchSettings(fileId, settings)
}

// processedStore.ts — derived state (computed from filesStore)
useProcessedStore: {
  processedRows: ProcessedRow[],
  validationSummary: ValidationSummary,
  updateRow(rowId, field, value),
  deleteRow(rowId)
}

// uiStore.ts — UI preferences
useUIStore: {
  theme: "light" | "dark",
  toggleTheme()
}
```

---

## 6. Multi-File Merge Logic

### 6.1 Per-File State
Each uploaded file maintains its own:
- Column mapping
- Batch settings (Product, Campaign, SFDC ID, etc.)

### 6.2 Combined Output
At the Review step, processed rows from all files are combined into a single array. Each row carries the batch settings from its source file, but can be overridden individually at the row level.

### 6.3 Duplicate Detection Scope
Duplicates are detected **across all files in the session** (not per-file). The email address (lowercased, trimmed) is the unique key.

### 6.4 Filename Logic
- If all files share the same `CAMPAIGN_SOURCE` → use that value
- If files have different Campaign Sources → use `multi-campaign`
- User can override the filename before download

---

## 7. Validation Engine Details

### 7.1 Validation Flow

```
For each ProcessedRow:
  1. Apply transformations (trim, name cleanup, casing)
  2. Apply standardizations (country mapping)
  3. Run validators in parallel:
     - RequiredFieldValidator
     - EmailFormatValidator
     - SFDCIdValidator
     - PicklistValidator (one per controlled field)
     - ForceMQL_MAL_ExclusivityValidator
  4. Run cross-row validator:
     - DuplicateEmailValidator (operates on full row set)
  5. Aggregate results → row.validations[]
```

### 7.2 Validation Result Severity
- **Error (red):** Blocks export. Examples: missing required field, invalid email, SFDC ID ≠ 18 chars, duplicate email.
- **Warning (yellow):** Allowed in export but flagged. Examples: country fuzzy-mapped (low confidence), name had special chars removed.

### 7.3 Export Gate
The Export button is disabled when `validationSummary.errorCount > 0`. The Review step displays the list of errors with row numbers and clickable links to jump to the problem row.

---

## 8. Future Backend Integration Points

If a backend is added later, these are the natural integration seams:

| Feature | Integration Point | Endpoint Example |
|---|---|---|
| Saved mapping profiles | After Step 2, save current mapping; restore on Step 1 | `POST /api/profiles`, `GET /api/profiles/:vendor` |
| Audit log | After successful export, log filename, row count, user, timestamp | `POST /api/audit/upload` |
| Direct Eloqua upload | After Step 5, push file to Eloqua REST API | `POST /api/eloqua/upload` |
| Picklist management | Replace hardcoded picklists with fetched values | `GET /api/picklists` |
| User auth | Wrap app in Entra ID SSO | OAuth2/OIDC middleware |

The client-side processing engine remains unchanged in all these scenarios — the backend only handles persistence, integration, and auth.

---

## 9. Error Handling

### 9.1 File Upload Errors
- Unsupported file type → toast: "Only .xlsx, .xls, and .csv files are supported"
- File too large → toast: "File exceeds 10MB limit"
- Corrupt file → toast: "Could not read file. Please verify the file is not corrupted"
- Encoding error → fallback to Latin-1, surface warning to user

### 9.2 Validation Errors
- Inline (per cell) → red border, tooltip with error message
- Summary panel → grouped list of errors with row links
- Step-level → block Next button, surface count in step indicator badge

### 9.3 Export Errors
- Validation errors present → modal: "Fix N errors before exporting"
- Browser download fails → toast: "Download failed. Try a different browser or check pop-up settings"

---

## 10. Performance Considerations

- **Large files (5k+ rows):** Use Web Workers for parsing/validation to keep UI responsive
- **Data grid:** Use TanStack Table's virtualization to render only visible rows
- **Reactivity:** Memoize derived state (processedRows, validationSummary) using Zustand selectors
- **Lazy loading:** Code-split each wizard step into a separate chunk

---

## 11. Security & Compliance

- **No PII transmission:** v1 processes all data client-side. No analytics or telemetry that captures row content.
- **No persistence:** App state cleared on browser refresh (intentional — no risk of stale lead data).
- **CSP headers:** Strict Content Security Policy when hosted (no inline scripts, no eval).
- **Future SSO:** When backend is added, gate access via Entra ID (Progress corporate auth).
- **Dependency security:** Run `npm audit` in CI; pin major versions.

---

## 12. Deployment

### 12.1 v1 (Client-Only)
- Build: `vite build` → static assets (HTML, JS, CSS) in `dist/`
- Deploy options:
  - **Azure Static Web Apps** (recommended for Progress alignment)
  - Internal CDN / SharePoint
  - Netlify / Vercel for prototyping
- URL pattern: `https://tools.progress.com/list-formatter/` (or internal equivalent)

### 12.2 Future Backend
- Containerize Node API → Azure App Service
- Database: Azure PostgreSQL Flexible Server (small instance)
- CI/CD: Azure DevOps Pipelines or GitHub Actions

---

## 13. Testing Strategy

| Layer | Tool | Coverage Focus |
|---|---|---|
| Unit | Vitest | Validators, transformers, fuzzy matcher, country standardizer |
| Component | React Testing Library | Step components, form interactions |
| E2E | Playwright | Full wizard flow with sample files |
| Visual | Chromatic / Storybook | Component states (errors, dark mode) |

Sample test files should include:
- Single-file happy path
- Multi-file with mixed Products
- File with international characters (Jürgensen, Lörtsch)
- File with duplicate emails
- File with invalid SFDC IDs
- File with country variants (US, UK, etc.)
