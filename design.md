# UI/UX Design Specification
## Progress List Upload Formatter

**Version:** 1.1  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** July 2026

> **v1.1 changes:** Column labels rewritten in Title Case; `COUNTRY (use drop down menu)` and `PRODUCT (use drop down menu)` are now simply **Country** and **Product**; the Marketing Ops section now uses **checkboxes** for Manual Lead Assignment and Bypass Bogus Program (both export the literal string "Yes"); the standalone Lead Owner text field has been removed (Lead Owner ID is used instead); Manual Lead Assignment **auto-checks** whenever Lead Owner ID has a value; the template is now **37 columns**; a new per-Product email duplicate treatment appears in the Review step; picklists are edited via `picklists.json`, not a UI.

---

### 1. Design Principles
- **Brand-Aligned** — Reflects the Progress Software visual identity (green, pink, navy, geometric shapes).
- **Wizard-Driven** — Clear linear progression with always-visible step indicator.
- **Reversible** — Back button on every step; no data loss when navigating.
- **Forgiving** — Validation errors are surfaced inline with clear guidance, not just at submit time.
- **Accessible** — WCAG 2.1 AA compliant; full keyboard navigation; dark/light mode toggle.
- **Familiar** — Patterns mirror Progress's public website.
- **No-Build Delivery** — All visuals implemented with plain CSS (no Tailwind, no PostCSS); everything ships as static files.

---

### 2. Progress Brand System

#### 2.1 Color Palette

##### Light Mode

| Token | Hex | Usage |
|---|---|---|
| --progress-green | #5CE500 | Brand accent, geometric shapes, success states, completed steps |
| --progress-green-dark | #3FB300 | Hover state for green elements |
| --progress-pink | #E81C68 | Primary CTA buttons, required field indicators, errors |
| --progress-pink-dark | #B81554 | Hover state for pink CTAs |
| --progress-blue | #0E62FE | Secondary CTAs, links, navigation accents |
| --progress-blue-dark | #0046C7 | Hover state for blue elements |
| --progress-navy | #001A4F | Top utility nav background, deep brand accent |
| --bg-sky | #E6F2FF | Hero section background |
| --bg-mint | #EFFCE8 | Alternate soft section background |
| --bg-white | #FFFFFF | Card backgrounds |
| --text-primary | #1A1A1A | Headings, body text |
| --text-secondary | #6B7280 | Labels, captions, helper text |
| --text-muted | #9CA3AF | Placeholder text, disabled states |
| --border-light | #E5E7EB | Input borders, card outlines |
| --warning-yellow | #FBBF24 | Warning states |

Tokens defined in `styles/tokens.css` as CSS custom properties on `:root`.

##### Dark Mode

| Token | Hex | Usage |
|---|---|---|
| --progress-green | #7BFF1F | Brighter green for contrast on dark |
| --progress-pink | #FF3D7F | Brighter pink for contrast on dark |
| --progress-blue | #4D8BFE | Brighter blue for contrast on dark |
| --bg-base | #0A0E1A | Page background |
| --bg-elevated | #161B2E | Card backgrounds |
| --bg-input | #1F2540 | Input backgrounds |
| --text-primary | #F5F5F5 | Headings, body text |
| --text-secondary | #A0A8B8 | Labels, captions |
| --border | #2C3354 | Input borders, card outlines |

#### 2.2 Typography
- **Font Family:** `"Mulish", "Segoe UI", system-ui, -apple-system, sans-serif`
- Mulish loaded via `@font-face` from `/assets/fonts/` (self-hosted; no CDN npm package needed).
- Fallback: system font stack if Mulish fails to load.

| Class | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| text-display | 48px | 800 | 1.1 | Page hero headlines |
| text-h1 | 36px | 700 | 1.2 | Step titles |
| text-h2 | 24px | 700 | 1.3 | Section headings |
| text-h3 | 18px | 600 | 1.4 | Card titles, form group headings |
| text-body | 16px | 400 | 1.6 | Default body text |
| text-small | 14px | 400 | 1.5 | Helper text, captions |
| text-label | 12px | 500 | 1.4 | Uppercase form labels |
| text-button | 14px | 700 | 1 | Button labels (uppercase) |

#### 2.3 Spacing System (8px base)
4, 8, 12, 16, 24, 32, 48, 64, 96 px

#### 2.4 Border Radius
- 4px — inputs, small buttons
- 8px — cards, large buttons
- 12px — modals, hero cards
- 9999px — pills, step indicator circles

#### 2.5 Shadows
- `--shadow-sm`: 0 1px 2px rgba(0, 0, 0, 0.05) — input focus
- `--shadow-md`: 0 4px 12px rgba(0, 0, 0, 0.08) — cards
- `--shadow-lg`: 0 12px 32px rgba(0, 0, 0, 0.12) — modals

---

### 3. Global Layout

Universal layout: sticky App Header (60px) → Step Indicator (80px) → main content card (max 1200px) → Navigation Footer (72px) → App Footer (40px).

- **App Header:** Progress logo + app name + dark/light toggle + "Start Over" link
- **Step Indicator:** 5 circles (Upload → Map → Settings → Review → Export). Completed = green with checkmark; Current = pink with number; Upcoming = white with grey number. Completed steps are clickable.
- **Navigation Footer:** Back button (blue, hidden on Step 1) + Continue button (pink primary). Continue text varies per step.
- **App Footer:** Navy background, "© Progress Software Corporation • Internal Tool"

---

### 4. Component Library

- **Buttons:** Primary (pink), Secondary (blue), Tertiary (outlined), Text Link. 44px tall, 24px horizontal padding, uppercase 14px bold text. Focus outline 2px `--progress-blue`.
- **Text Input:** 44px tall, 12px padding, 4px radius, 2px blue focus outline.
- **Dropdown:** Text input + chevron; search-as-you-type when >10 items.
- **Date Picker:** Text input + calendar icon; format M/D/YYYY.
- **Checkbox:** 24px square, 4px radius, `--progress-green` when checked with white checkmark; label to the right (16px regular).
- **Toggle Switch:** For dark/light mode and "Use as batch / per-row" toggles.
- **Cards, Tags, Modals, Toasts:** Success/Warning/Error/Info/Neutral variants. See `styles/components.css`.

---

### 5. User Journey — Step-by-Step

#### Step 1: Upload Files
**Page Title:** "Upload Your Lead Lists"  
**Subtitle:** "Drag and drop one or more files. Supported formats: .xlsx, .xls, .csv (max 10MB each)"

Large dropzone → collapses to "Add another file" link after first upload. File list shows: icon, filename, row count, file size, Remove button.

**Continue button:** "Continue to Mapping →"  
**Back button:** Hidden

---

#### Step 2: Map Columns
**Page Title:** "Map Your Columns"  
**Subtitle:** "We've auto-matched your columns to the template. Review and adjust as needed."

Tabs per file at top. Each source column shown alongside auto-suggested template column + confidence tag. All template column names in the dropdown are in Title Case. Note the dropdowns previously labeled "COUNTRY (use drop down menu)" and "PRODUCT (use drop down menu)" now appear simply as **Country** and **Product**.

```
+------------------------------------------------------------+
|  [KGC_leads_June2026.xlsx]  [TechTarget_export.csv]        |
|  -------------------------                                 |
|                                                            |
|   Your Column         Confidence    Template Column        |
|   -----------------------------------------------------    |
|   First Name          [High]    ->  First Name    v        |
|   Last Name           [High]    ->  Last Name     v        |
|   Email               [High]    ->  Email Address v        |
|   Organization        [Medium]  ->  Company Name  v        |
|   Country             [High]    ->  Country       v        |
|   Job Title           [High]    ->  Title         v        |
|   Lead Comments       [Low]     ->  Form Comments v        |
|   Source Vendor       [None]    ->  Ignore        v        |
|                                                            |
|   Required template columns: v All mapped                  |
+------------------------------------------------------------+
```

**Continue button:** Disabled until all required template columns mapped  
**Back button:** "← Back to Upload"

---

#### Step 3: Campaign Settings
**Page Title:** "Configure Campaign Settings"  
**Subtitle:** "These values will apply to all rows in each file. You can override individual rows in the next step."

Tabs per file at top. Form organized in card groups. Labels use Title Case.

```
+------------------------------------------------------------+
|  [KGC_leads_June2026.xlsx]  [TechTarget_export.csv]        |
|                                                            |
|  -- Campaign Identification --                             |
|  Campaign Source *      [26Q2 PDP NA DEMD KGC          ]   |
|  SFDC Campaign ID *     [701Pb00003abcdefghij          ]   |
|                         18 of 18 characters v              |
|  Last Response Date *   [6/16/2026]                        |
|                                                            |
|  -- Categorization --                                      |
|  Product *              [Data Platform          v]         |
|  Lead Source - Initial* [Event Tradeshow        v]         |
|  Lead Source - Most Recent * [Event Tradeshow   v]         |
|  Call to Action *       [Event - 3rd party      v]         |
|  Target Channel Type *  [Direct                 v]         |
|  Campaign Member Status * [Visited Booth        v]         |
|                                                            |
|  -- UTM Parameters --                                      |
|  utm_medium             [event-paid             v]         |
|  utm_source             [KGC                       ]       |
|  utm_campaign           [pdp_na_pdp_event_KGC      ]       |
|  Offer Title            [                          ]       |
|                                                            |
|  -- Lead Routing --                                        |
|  [ ] Force MQL for all rows                                |
|  [x] Force MAL for all rows                                |
|                                                            |
|  -- Marketing Ops (optional) --                            |
|  External Asset Status      [                      ]       |
|  Lead Owner ID              [00520000000abcdEFG    ]       |
|  [x] Manual Lead Assignment                                |
|      (auto-checked because Lead Owner ID is set)           |
|  [ ] Bypass Bogus Program                                  |
+------------------------------------------------------------+
```

**Key v1.1 behaviors for this step:**
- **Manual Lead Assignment** and **Bypass Bogus Program** are rendered as checkboxes (previously text fields). Each exports the literal string `Yes` when checked and blank when unchecked.
- When the user types into **Lead Owner ID**, the **Manual Lead Assignment** checkbox auto-checks. A small caption below the checkbox reads *"auto-checked because Lead Owner ID is set"* until the user manually toggles it. If the user unchecks it, the caption changes to *"you unchecked this manually"* and the checkbox stays unchecked even if Lead Owner ID remains set.
- The standalone **Lead Owner** text field from v1 is removed.
- Required fields marked with pink asterisk.
- SFDC Campaign ID shows live character count; green check when exactly 18 chars.
- Force MQL + Force MAL: if both checked, inline error appears.
- Marketing Ops section always visible but visually de-emphasized (smaller heading, light grey background).
- Dropdowns with 10+ items have search/filter.
- Picklist values come from `picklists.json` at load time; there is no in-app picklist editor.

**Continue button:** Disabled until all required fields valid for ALL file tabs  
**Back button:** "← Back to Mapping"

---

#### Step 4: Review & Edit
**Page Title:** "Review Your Data"  
**Subtitle:** "Inline-edit any cell. Errors must be fixed before exporting."

```
+------------------------------------------------------------------+
|  TOTAL ROWS 820  |  ERRORS 4  |  WARNINGS 12  |  DUPLICATES 2   |
|                                                                  |
|  Filters: [All] [Errors Only] [Warnings Only] [Duplicates]       |
|  Search: [__________________]                                    |
|                                                                  |
|   # | Source File  | First | Last | Email Address  | Product     |
|   1 | KGC_leads... | John  | Doe  | john@acme.com  | Data Pl     |
|   2 | KGC_leads... | Jane  | Smith| [jane@invalid] | Data Pl  X  |
|  12 | KGC_leads... | Amy   | Rex  | amy@acme.com   | Sitefin  X  |
|  47 | TechTarget…  | Amy   | Rex  | amy@acme.com   | Sitefin  X  |
|                                                                  |
|  Errors (4):                                                     |
|   * Row 2: Invalid email address "jane@invalid"                  |
|   * Row 12 & Row 47: Email "amy@acme.com" appears more than       |
|     once for Product "Sitefinity". Each email may only appear    |
|     once per Product.                                            |
|   * Row 87: Missing Company Name                                 |
+------------------------------------------------------------------+
```

**v1.1 behaviors:**
- Summary cards color-coded (Total: navy, Errors: pink, Warnings: yellow, Duplicates: orange)
- **Column headers in Title Case** — First Name, Last Name, Email Address, Company Name, Country, Product, etc.
- **New error rendering:** rows sharing a `(Email Address, Product)` pair get a pink-tinted row background AND a red border on both the Email Address and Product cells. Tooltip: *"Duplicate: this email is already used for this Product on row N."*
- Duplicate emails across **different** Products are shown as warnings only (yellow row tint, no error).
- **Checkbox cells** (Force MQL, Force MAL, Manual Lead Assignment, Bypass Bogus Program) render as clickable checkboxes inside the grid. Editing Lead Owner ID for a row auto-checks that row's Manual Lead Assignment.
- Click any non-checkbox cell → becomes editable.
- Error list at bottom: clickable links scroll to and highlight the offending row.
- Sticky table header + sticky first two columns (`#`, Source File).

**Continue button:** "Continue to Export" — disabled if errors > 0  
**Back button:** "← Back to Settings"

---

#### Step 5: Export
**Page Title:** "Export Your File"  
**Subtitle:** "Choose your format and download the formatted file."

```
+------------------------------------------------------------+
|                                                            |
|                    v Ready to Export                       |
|                  817 rows • 0 errors                       |
|                                                            |
|   Output Format                                            |
|   [ * CSV (.csv) ]           [ o Excel (.xlsx) ]           |
|                                                            |
|   Filename                                                 |
|   [26Q2_PDP_NA_DEMD_KGC_upload_2026-07-02.csv         ]    |
|                                                            |
|   Summary                                                  |
|   • 2 source files merged                                  |
|   • 37 template columns in correct order                   |
|   • 1 campaign(s): 26Q2 PDP NA DEMD KGC                    |
|                                                            |
|              [   DOWNLOAD FILE   ]                         |
+------------------------------------------------------------+
```

- Format selection: two radio cards, selected card has pink border.
- Filename: editable text input, pre-filled with `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`. Multi-campaign uploads default to `multi-campaign_upload_[date].[ext]`.
- Download button: pink primary, full width, download icon.
- Summary text confirms **37 columns** (was 38 in v1).

**Continue button:** Replaced by "Download File"  
**Back button:** "← Back to Review"

---

### 6. Accessibility (WCAG 2.1 AA)
- Color contrast 4.5:1 minimum
- Full keyboard nav; 2px pink focus outline
- **Checkbox semantics:** native `<input type="checkbox">` with associated `<label>`; screen readers announce "Manual Lead Assignment, checkbox, checked" etc.
- **Auto-check announcement:** ARIA live region announces *"Manual Lead Assignment auto-checked because Lead Owner ID is populated."*
- Step indicator: `role="progressbar"` with `aria-valuenow`, `aria-valuemax`
- Form errors: `aria-invalid` and `aria-describedby`
- Modals: focus-trapped, ESC closes, focus returns to trigger
- Respect `prefers-reduced-motion`
- Validation states use icons + color (not color alone)

---

### 7. Responsive Behavior
- **Desktop (1280px+):** Full layout
- **Laptop (1024–1279px):** Same layout, tighter spacing
- **Tablet (768–1023px):** Smaller step indicator, single-column form, horizontal-scroll data grid
- **Mobile (<768px):** Not officially supported; show message directing to desktop

---

### 8. Dark Mode
Toggle in app header (🌙 / ☀️). Persists in `localStorage`.
- Page bg: `--bg-base` (#0A0E1A)
- Cards: `--bg-elevated` (#161B2E)
- Brand colors brightened for contrast
- Geometric shapes at 15-20% opacity
- Step indicator green completed circles: kept green
- Checkboxes in dark mode: `--bg-input` when unchecked, `--progress-green` when checked

---

### 9. Microinteractions
- Button hover: lift + shadow grow (150ms)
- Step transition: fade-in (200ms)
- Step indicator advance: fill + checkmark draw (300ms)
- Validation errors: pink border pulse on first appearance
- File upload success: brief green flash
- Toast: slide-in from right (250ms)
- Dropdown: scale 0.95→1.0 with fade (150ms)
- **Manual Lead Assignment auto-check (NEW):** when triggered by a Lead Owner ID edit, the checkbox flashes green briefly (200ms).

All animations respect `prefers-reduced-motion`.

---

### 10. Reference Screens (Inspired by Progress.com)

| Pattern | Source | Application |
|---|---|---|
| Hero with green angular shapes | Progress.com/contactus | Step 1 upload hero |
| White content card on color background | Progress.com forms | All step content cards |
| Hot pink primary CTA | Progress.com "CONTACT SALES" button | All primary CTAs |
| Blue secondary CTA | Progress.com/marklogic "REQUEST DEMO" | Back buttons, secondary actions |
| Geometric chevron motifs | Progress.com hero sections | App header accent |
| Large bold display headlines | Progress.com hero | Step page titles |

---

### 11. Empty States & Edge Cases

| State | Treatment |
|---|---|
| No files uploaded | Large dropzone with illustration + "Drag files here or click to browse" |
| All files removed mid-flow | Empty state in current step; "Upload Files" link |
| Validation passes with 0 errors | Green banner: "All checks passed! Ready to export" |
| Single file upload (no multi-file) | Hide file tabs on Steps 2 & 3 |
| File parse fails | Toast: "Couldn't read [filename]. Verify it's not corrupted." |
| Export with warnings (no errors) | Modal: "Your file has N warnings. Continue?" |
| Start Over clicked | Modal: "This will clear all data. Continue?" |
| Duplicate `(Email, Product)` detected (NEW) | Rows tinted pink; error banner names the pair and all affected row numbers; Export disabled |
| `picklists.json` fails to load (NEW) | Full-screen blocking modal: "The app couldn't load its picklists. Please contact Marketing Ops." |
