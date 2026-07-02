# Technical Architecture
## Progress List Upload Formatter

**Version:** 1.1  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** July 2026

> **v1.1 headline change:** the app is **no longer built with NPM/Node**. It is now a static vanilla HTML/CSS/JavaScript app served as flat files. All third-party libraries are consumed as pre-built UMD/IIFE bundles from a CDN or a local `vendor/` folder.

---

### 1. Architecture Overview

#### 1.1 Architecture Philosophy
**Client-only, zero-build, zero-NPM.** The v1.1 application runs entirely in the user's browser — no lead data is transmitted to any server, and no local Node.js toolchain is required to build, run, or deploy the app. This eliminates:
- Privacy/compliance concerns (no PII leaves the browser)
- Infrastructure dependencies (no server needed)
- Local developer setup issues (no `npm install`, no Vite, no proxy/registry problems)
- Build-time complexity (no bundler, no transpiler)

The architecture is still designed so a lightweight backend can be added later (for saved profiles, audit logs, or direct Eloqua integration) without rewriting the client-side processing engine.

#### 1.2 High-Level Architecture Diagram
```
+-----------------------------------------------------------------+
|                         BROWSER (CLIENT)                         |
|                                                                  |
|  +--------------+    +--------------+    +------------------+  |
|  |  UI Layer    |--->|  App State   |--->|  Processing      |  |
|  |  (vanilla    |    |  (plain JS   |    |  Engine          |  |
|  |  HTML + JS)  |    |   object +   |    |  (modules/*.js)  |  |
|  |              |    |   pub-sub)   |    |                  |  |
|  +--------------+    +--------------+    +------------------+  |
|                                                    |             |
|                                                    v             |
|                                            +--------------+     |
|                                            |  SheetJS     |     |
|                                            |  UMD bundle  |     |
|                                            +--------------+     |
|                                                    |             |
|                                                    v             |
|                                            +--------------+     |
|                                            |  Fuse.js     |     |
|                                            |  UMD bundle  |     |
|                                            +--------------+     |
|                                                                  |
|  +----------------------------------------------------------+  |
|  |  picklists.json  (fetched at load; editable by Ops)      |  |
|  +----------------------------------------------------------+  |
+-----------------------------------------------------------------+
```

---

### 2. Recommended Tech Stack

#### 2.1 Frontend (v1.1) — No NPM

| Layer | Technology | Rationale |
|---|---|---|
| **Markup** | HTML5 (single `index.html` + step partials via `<template>` tags) | No build; browser-native |
| **Styling** | Plain CSS3 with CSS Custom Properties (variables) for theming | No Tailwind, no PostCSS, no build step |
| **Scripting** | Vanilla JavaScript (ES2020+) delivered as ES modules via `<script type="module">` | Modern browsers execute directly; no bundler needed |
| **State Management** | Small hand-written store (~50 LOC) using `Object` + `EventTarget` for pub-sub | No Zustand, no Redux; plain JS |
| **File Parsing** | **SheetJS** loaded from CDN (`xlsx.full.min.js`) or `/vendor/xlsx.full.min.js` | UMD build; exposes global `XLSX` |
| **Fuzzy Matching** | **Fuse.js** loaded from CDN (`fuse.min.js`) or `/vendor/fuse.min.js` | UMD build; exposes global `Fuse` |
| **Data Grid** | Hand-rolled virtualized `<table>` (~200 LOC) using `IntersectionObserver` | No TanStack; keeps stack dependency-free |
| **Date Handling** | Native `Intl.DateTimeFormat` + tiny helper (`date-utils.js`) | No date-fns |
| **Icons** | Inline SVG stored in `/assets/icons/` | No icon-font, no npm package |
| **Fonts** | System font stack + optional Mulish `.woff2` in `/assets/fonts/` via `@font-face` | No `@fontsource` npm package |
| **Hosting** | Static hosting (Azure Static Web Apps, SharePoint page, internal CDN, IIS virtual dir) | Just serve the folder |

#### 2.2 Project Layout (Static, No Build)
```
progress-list-upload/
├── index.html                     ← app entrypoint
├── picklists.json                 ← editable by Marketing Ops
├── styles/
│   ├── tokens.css                 ← CSS custom properties (colors, spacing)
│   ├── base.css
│   ├── components.css
│   └── steps.css
├── js/
│   ├── app.js                     ← bootstraps, wires router + store
│   ├── store.js                   ← state + pub/sub
│   ├── router.js                  ← wizard step router (no framework)
│   ├── modules/
│   │   ├── parser.js              ← SheetJS wrapper
│   │   ├── fuzzy.js               ← Fuse.js wrapper + synonyms
│   │   ├── country.js             ← country standardizer
│   │   ├── validator.js           ← all validation rules
│   │   ├── exporter.js            ← CSV + XLSX serialization
│   │   └── picklists.js           ← loader + accessor for picklists.json
│   ├── ui/
│   │   ├── header.js
│   │   ├── stepIndicator.js
│   │   ├── nav.js
│   │   ├── step1-upload.js
│   │   ├── step2-mapping.js
│   │   ├── step3-settings.js
│   │   ├── step4-review.js
│   │   └── step5-export.js
│   └── util/
│       ├── dom.js
│       ├── date-utils.js
│       └── csv.js
├── vendor/                        ← optional local copies for offline / CSP-strict deploys
│   ├── xlsx.full.min.js
│   └── fuse.min.js
├── assets/
│   ├── icons/
│   └── fonts/
└── README.md
```

**Deliberately absent:** `package.json`, `package-lock.json`, `node_modules/`, `vite.config.*`, `tsconfig.json`, `.babelrc`, `webpack.*`. If any of these files appear in the repo, that is a violation of NFR-3.

#### 2.3 Why Not These Stacks?
- **React / Vue / Svelte / Angular:** All require an NPM install and a build step. **Excluded by NFR-3.**
- **Next.js / Nuxt / SvelteKit:** Same — Node required.
- **Vanilla JS with a bundler (Vite / esbuild / Rollup):** Still Node. **Excluded.**
- **Server-side (Python Flask, .NET):** Would require always-on server + auth; overkill and moves PII to server.

---

### 3. Data Flow

#### 3.1 End-to-End Pipeline
```
[1. UPLOAD] -> [2. PARSE] -> [3. MAP] -> [4. ENRICH]
                                                |
                                                v
[8. DOWNLOAD] <- [7. SERIALIZE] <- [6. EDIT] <- [5. VALIDATE]
```

Validation covers: required, email format, SFDC ID length, picklist conformance, Force MQL/MAL exclusivity, cross-file duplicate emails (warning), and **new** cross-file `(email, Product)` duplicates (error).

#### 3.2 In-Memory Data Model (plain JS, JSDoc-typed)
```js
/**
 * @typedef {Object} SourceFile
 * @property {string} id
 * @property {string} fileName
 * @property {number} rowCount
 * @property {string[]} sourceColumns
 * @property {Object<string,string>[]} rawRows
 * @property {Object<string,string|null>} columnMapping
 * @property {BatchSettings} batchSettings
 */

/**
 * @typedef {Object} BatchSettings
 * @property {string}  LastResponseDate
 * @property {string}  CampaignSource
 * @property {string}  LeadSourceInitial
 * @property {string}  LeadSourceMostRecent
 * @property {string}  Product
 * @property {string}  CallToAction
 * @property {string}  TargetChannelType
 * @property {string}  CampaignMemberStatus
 * @property {string}  SfdcCampaignId
 * @property {string}  utm_medium
 * @property {string}  utm_source
 * @property {string}  utm_campaign
 * @property {string}  OfferTitle
 * @property {boolean} ForceMQL
 * @property {boolean} ForceMAL
 * @property {string}  ExternalAssetStatus
 * @property {string}  LeadOwnerId
 * @property {boolean} ManualLeadAssignment    // auto-true when LeadOwnerId non-empty
 * @property {boolean} BypassBogusProgram
 */

/**
 * @typedef {Object} ProcessedRow
 * @property {string} sourceFileId
 * @property {number} rowIndex
 * @property {Object<string,string|boolean>} data
 * @property {ValidationResult[]} validations
 * @property {boolean} isDuplicate                     // duplicate email (any product)
 * @property {boolean} isDuplicateWithinProduct        // duplicate (email + Product) - ERROR
 */
```

#### 3.3 Wizard State Machine
```
type WizardStep = 'upload' | 'mapping' | 'settings' | 'review' | 'export';
```
State transitions are gated by step-level validators. The Back button preserves state; the Next button runs the step's validator.

---

### 4. Core Modules

#### 4.1 File Parser Module (`js/modules/parser.js`)
- Uses SheetJS (global `XLSX`) to handle `.xlsx`, `.xls`, `.csv`
- Auto-detects encoding for CSV files
- Preserves international characters (diacritics)
- Handles errors: corrupt files, empty files, files exceeding size limits

#### 4.2 Fuzzy Matcher Module (`js/modules/fuzzy.js`)
- Uses Fuse.js (global `Fuse`) with a similarity threshold (default 0.4)
- Loads synonym dictionary from `picklists.json → columnSynonyms`
- Returns `Map<sourceColumn, { templateColumn: string|null, confidence: number }>`

#### 4.3 Country Standardizer Module (`js/modules/country.js`)
- Alias map loaded from `picklists.json → countryAliases`
- For unmapped values, fuzzy matches against the Country picklist
- Flags unmappable values as validation errors

#### 4.4 Validation Engine (`js/modules/validator.js`)
Validation rules (run in order):
1. Whitespace trim
2. Name cleanup
3. **Checkbox coercion** — legacy "yes/YEs/YES" values coerced to `true`
4. Country standardization
5. Required field check
6. Email format check
7. SFDC Campaign ID = 18 chars
8. Picklist conformance
9. Force MQL / MAL mutual exclusivity
10. Duplicate email detection (warning; email only)
11. **Email + Product uniqueness (NEW; error)** — multiple rows sharing `(lowercased_email, Product)` all flagged as errors

#### 4.5 Export Module (`js/modules/exporter.js`)
- Uses SheetJS to write output
- CSV: UTF-8 with BOM
- Column order matches template schema (columns 1–37)
- **Checkbox → string serialization:** `true` → `"Yes"`, `false` → `""` (blank) for Force MQL, Force MAL, Manual Lead Assignment, Bypass Bogus Program
- Filename: `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`

#### 4.6 Picklist Module (`js/modules/picklists.js`) — NEW
- On app start, `fetch('./picklists.json')`
- Validate against schema (§5)
- Cache in memory; expose accessors like `getPicklist('Product')`, `getSynonyms('Email Address')`, `getCountryAliases()`
- On fetch failure or schema violation, render blocking error modal

---

### 5. `picklists.json` Schema (NEW in v1.1)

```json
{
  "picklists": {
    "Country":                   ["Afghanistan", "Aland Islands", "..."],
    "Product":                   ["Agentic RAG", "ALM Testing", "..."],
    "Lead Source - Initial":     ["Added by Sales Rep", "..."],
    "Lead Source - Most Recent": ["Added by Sales Rep", "..."],
    "Call to Action":            ["Analyst Report", "..."],
    "Target Channel Type":       ["Direct", "OEM", "AP", "SI", "Reseller", "ISV", "Partner"],
    "Campaign Member Status":    ["Submitted", "Attended", "..."],
    "utm_medium":                ["content-paid", "cpc", "..."]
  },
  "columnSynonyms": {
    "First Name":    ["first", "fname", "firstname", "first name", "given name"],
    "Last Name":     ["last",  "lname", "lastname",  "last name",  "surname"],
    "Email Address": ["email", "e-mail", "email address", "mail"],
    "Company Name":  ["company", "organization", "org", "account"],
    "Country":       ["country", "nation", "country/region"]
  },
  "countryAliases": {
    "USA":                                   ["US", "U.S.", "U.S.A.", "United States", "United States of America"],
    "United Kingdom":                        ["UK", "Britain", "Great Britain", "England"],
    "Korea Republic of":                     ["South Korea"],
    "Korea Democratic People's Republic of": ["North Korea"],
    "Viet Nam":                              ["Vietnam"],
    "Taiwan-China":                          ["Taiwan"],
    "Russian Federation":                    ["Russia"]
  }
}
```

**Editing workflow (Marketing Ops):**
1. Open `picklists.json` in any text editor or via SharePoint check-out.
2. Add/remove/rename picklist values.
3. Save. Commit to the deploy target.
4. Refresh the browser. Changes are live.

**Validation on load:**
- Root object has `picklists`, `columnSynonyms`, `countryAliases`
- Each picklist value is a non-empty string
- No duplicate values within a picklist (case-insensitive)
- All required picklists are present

---

### 6. Component Architecture (Vanilla JS, no framework)

Each "component" is a JS module exporting a `mount(rootEl, props)` and `unmount()` function. Views subscribe to the store; the store notifies subscribers on change.

```js
// js/store.js - tiny pub-sub store, no dependencies
export const store = (() => {
  const target = new EventTarget();
  let state = { /* WizardState + sub-slices */ };
  return {
    get: () => state,
    set: (patch) => {
      state = { ...state, ...patch };
      target.dispatchEvent(new CustomEvent('change', { detail: state }));
    },
    subscribe: (fn) => {
      const h = (e) => fn(e.detail);
      target.addEventListener('change', h);
      return () => target.removeEventListener('change', h);
    }
  };
})();
```

---

### 7. Multi-File Merge Logic
- **Per-file state:** each file has its own column mapping + batch settings (including checkbox defaults)
- **Combined output:** all files merged into a single processed row array
- **Duplicate email (warning):** detected across all files (lowercased + trimmed)
- **Email + Product duplicate (error):** detected across all files using the pair `(lowercased_email, Product)`
- **Filename:** if all files share the same Campaign Source use that; otherwise `multi-campaign`; user can override

---

### 8. Validation Engine Details

#### 8.1 Validation Flow
```
For each ProcessedRow:
  1. Apply transformations (trim, name cleanup, checkbox coercion)
  2. Apply standardizations (country mapping)
  3. Run per-row validators:
     - RequiredFieldValidator
     - EmailFormatValidator
     - SfdcIdValidator
     - PicklistValidator
     - ForceMQL_MAL_ExclusivityValidator
  4. Run cross-row validators:
     - DuplicateEmailValidator                 (warning; email only)
     - DuplicateEmailWithinProductValidator    (ERROR; email + product)  <- NEW
  5. Aggregate results -> row.validations[]
```

#### 8.2 Severity
- **Error:** blocks export. Missing required, invalid email, SFDC ID != 18, duplicate `(email, Product)`.
- **Warning:** allowed but flagged. Country fuzzy-mapped (low confidence), duplicate email across different products, name cleanup applied.

#### 8.3 Export Gate
Export disabled when `errorCount > 0`. Review step shows clickable error list.

#### 8.4 Manual Lead Assignment Auto-Check (NEW)
The validation engine watches Lead Owner ID edits at both batch and row levels. When a non-empty Lead Owner ID is set:
- If Manual Lead Assignment for that row/batch is currently `false` **and** the user did not manually uncheck it in this session, set it to `true` and emit a warning `"Manual Lead Assignment was auto-checked because Lead Owner ID is populated."`
- If the user unchecks Manual Lead Assignment while Lead Owner ID is populated, respect that choice (a `manuallyOverridden` flag is set).

---

### 9. Future Backend Integration Points

| Feature | Integration Point | Endpoint Example |
|---|---|---|
| Saved mapping profiles | After Step 2, save/restore mapping | `POST /api/profiles`, `GET /api/profiles/:vendor` |
| Audit log | After successful export | `POST /api/audit/upload` |
| Direct Eloqua upload | After Step 5 | `POST /api/eloqua/upload` |
| Picklist management | Serve `picklists.json` from admin-editable backend | `GET /api/picklists`, `PUT /api/picklists` |
| User auth | Wrap in Entra ID SSO | OAuth2/OIDC middleware |

---

### 10. Error Handling
- **File upload:** unsupported type, too large, corrupt, encoding — surfaced as toasts
- **Validation errors:** inline (red border + tooltip), summary panel, step-level badge
- **Export errors:** modal listing errors
- **Picklist load errors (NEW):** blocking modal with instructions to Marketing Ops for missing, malformed, or schema-violating `picklists.json`

---

### 11. Performance Considerations
- Large files (5k+ rows): parse in chunked loop with `requestIdleCallback` / `setTimeout` fallbacks
- Data grid: custom virtualization renders only visible rows (~40 at a time) via `IntersectionObserver`
- Store notifications batched (`store.batch(fn)`)
- Each step view is a separate ES module `import()`-ed on demand

---

### 12. Security & Compliance
- **No PII transmission** in v1
- **No persistence:** state cleared on refresh
- **CSP headers:** strict CSP when hosted; prefer `/vendor/` local copies for `default-src 'self'`
- **Dependency security:** no NPM = no transitive dependency tree. Vendor JS pinned by SHA-256 SRI hashes:
  ```html
  <script src="./vendor/xlsx.full.min.js"
          integrity="sha256-..."
          crossorigin="anonymous"></script>
  ```

---

### 13. Deployment

#### 13.1 v1.1 (Client-Only, No Build)
- No build step. `dist/` = the repo folder itself.
- Deploy options: Azure Static Web Apps (recommended), SharePoint, internal CDN, IIS virtual directory, Netlify/Vercel for prototyping.

#### 13.2 Local "Development" (No NPM)
- To serve locally without Node, use any of:
  - `python -m http.server 8080`
  - VS Code "Live Server" extension
  - IIS Express
  - `dotnet serve`
- **Do not** use `npx serve`, `npm run dev`, or any Node-based tool.

---

### 14. Testing Strategy

| Layer | Tool | Coverage Focus |
|---|---|---|
| Unit | Plain HTML test runner (`tests/index.html`) importing modules directly + `console.assert` | Validators, transformers, fuzzy matcher, country standardizer, checkbox coercion, email+product uniqueness |
| Component | Manual scripted test cases in `tests/README.md` executed in-browser | Step components, form interactions |
| E2E | Manual test scripts against deployed URL; optional Playwright on CI machine | Full wizard flow with sample files |

Sample test files to maintain:
- Single-file happy path
- Multi-file with mixed Products
- International characters (Jürgensen, Lörtsch)
- Duplicate emails, **same** Product → **error**
- Duplicate emails, **different** Products → **warning** (not error)
- Invalid SFDC IDs
- Country variants (US, UK, etc.)
- Lead Owner ID populated but Manual Lead Assignment unchecked → verify auto-check
- Bypass Bogus Program checkbox toggled → verify export contains literal "Yes"
