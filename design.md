# UI/UX Design Specification
# Progress List Upload Formatter

**Version:** 1.0  
**Owner:** Brandon Gittelman, Marketing Technical Architect, Principal  
**Last Updated:** June 2026

---

## 1. Design Principles

1. **Brand-Aligned** — Reflects the Progress Software visual identity (green, pink, navy, geometric shapes).
2. **Wizard-Driven** — Clear linear progression with always-visible step indicator.
3. **Reversible** — Back button on every step; no data loss when navigating.
4. **Forgiving** — Validation errors are surfaced inline with clear guidance, not just at submit time.
5. **Accessible** — WCAG 2.1 AA compliant; full keyboard navigation; dark/light mode toggle.
6. **Familiar** — Patterns mirror Progress's public website for consistency with the broader brand.

---

## 2. Progress Brand System

### 2.1 Color Palette

#### Light Mode
| Token | Hex | Usage |
|---|---|---|
| `--progress-green` | `#5CE500` | Brand accent, geometric shapes, success states, completed steps |
| `--progress-green-dark` | `#3FB300` | Hover state for green elements |
| `--progress-pink` | `#E81C68` | Primary CTA buttons, required field indicators, errors |
| `--progress-pink-dark` | `#B81554` | Hover state for pink CTAs |
| `--progress-blue` | `#0E62FE` | Secondary CTAs, links, navigation accents |
| `--progress-blue-dark` | `#0046C7` | Hover state for blue elements |
| `--progress-navy` | `#001A4F` | Top utility nav background, deep brand accent |
| `--bg-sky` | `#E6F2FF` | Hero section background, soft section backgrounds |
| `--bg-mint` | `#EFFCE8` | Alternate soft section background |
| `--bg-white` | `#FFFFFF` | Card backgrounds, form backgrounds |
| `--text-primary` | `#1A1A1A` | Headings, body text |
| `--text-secondary` | `#6B7280` | Labels, captions, helper text |
| `--text-muted` | `#9CA3AF` | Placeholder text, disabled states |
| `--border-light` | `#E5E7EB` | Input borders, card outlines |
| `--warning-yellow` | `#FBBF24` | Warning states |

#### Dark Mode
| Token | Hex | Usage |
|---|---|---|
| `--progress-green` | `#7BFF1F` | Brighter green for contrast on dark |
| `--progress-pink` | `#FF3D7F` | Brighter pink for contrast on dark |
| `--progress-blue` | `#4D8BFE` | Brighter blue for contrast on dark |
| `--bg-base` | `#0A0E1A` | Page background |
| `--bg-elevated` | `#161B2E` | Card backgrounds |
| `--bg-input` | `#1F2540` | Input backgrounds |
| `--text-primary` | `#F5F5F5` | Headings, body text |
| `--text-secondary` | `#A0A8B8` | Labels, captions |
| `--border` | `#2C3354` | Input borders, card outlines |

### 2.2 Typography

- **Font Family:** `"Mulish", "Segoe UI", system-ui, -apple-system, sans-serif`
- **Headings:** Mulish Bold (700) / ExtraBold (800)
- **Body:** Mulish Regular (400) / Medium (500)
- **Labels:** Mulish Medium (500), tracking 0.02em, uppercase for small labels

| Class | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-display` | 48px | 800 | 1.1 | Page hero headlines |
| `text-h1` | 36px | 700 | 1.2 | Step titles |
| `text-h2` | 24px | 700 | 1.3 | Section headings |
| `text-h3` | 18px | 600 | 1.4 | Card titles, form group headings |
| `text-body` | 16px | 400 | 1.6 | Default body text |
| `text-small` | 14px | 400 | 1.5 | Helper text, captions |
| `text-label` | 12px | 500 | 1.4 | Uppercase form labels |
| `text-button` | 14px | 700 | 1 | Button labels (uppercase) |

### 2.3 Spacing System (8px base)
`4, 8, 12, 16, 24, 32, 48, 64, 96` px

### 2.4 Border Radius
- `4px` — inputs, small buttons
- `8px` — cards, large buttons
- `12px` — modals, hero cards
- `9999px` — pills, step indicator circles

### 2.5 Shadows
- `--shadow-sm`: `0 1px 2px rgba(0, 0, 0, 0.05)` — input focus
- `--shadow-md`: `0 4px 12px rgba(0, 0, 0, 0.08)` — cards
- `--shadow-lg`: `0 12px 32px rgba(0, 0, 0, 0.12)` — modals, hero cards

### 2.6 Geometric Brand Shapes
Incorporate Progress's signature angular geometric shapes:
- **Green chevrons/triangles** in the top-left and bottom-right of the hero section
- **Blue accent triangles** mirroring the green ones at lower opacity
- Use SVG so they scale crisply and respect dark mode color tokens

---

## 3. Global Layout

### 3.1 Page Structure

```
┌────────────────────────────────────────────────────────────────┐
│  [Progress Logo]  List Upload Formatter      [🌙] [Start Over] │  ← App Header (60px)
├────────────────────────────────────────────────────────────────┤
│                                                                │
│     ●──────●──────○──────○──────○                             │  ← Step Indicator (80px)
│   Upload  Map   Settings Review Export                         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                  [Hero with green/blue shapes]                 │
│                                                                │
│   ┌──────────────────────────────────────────────────┐        │
│   │                                                  │        │
│   │              STEP CONTENT CARD                    │        │  ← Main content
│   │                                                  │        │     (max 1200px)
│   │                                                  │        │
│   └──────────────────────────────────────────────────┘        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  [← Back]                                  [Continue →]        │  ← Navigation Footer (72px)
├────────────────────────────────────────────────────────────────┤
│  © Progress Software Corporation • Internal Tool               │  ← App Footer
└────────────────────────────────────────────────────────────────┘
```

### 3.2 App Header (Universal)
- Height: 60px
- Background: White (light) / `--bg-elevated` (dark)
- Bottom border: 1px `--border-light`
- **Left:** Progress logo (green chevron + "Progress" wordmark) + app name "List Upload Formatter"
- **Right:** 
  - 🌙 / ☀️ Dark/Light mode toggle
  - "Start Over" text link (triggers confirmation modal)
- Always sticky to top

### 3.3 Step Indicator
- Height: 80px
- Background: White / `--bg-elevated`
- Bottom border: 1px `--border-light`
- **5 step circles** connected by horizontal lines
- Each step shows:
  - Circle: 40px diameter, rounded full
  - Label below: 14px, medium weight
- **States:**
  - **Completed:** Green-filled circle (`--progress-green`) with white checkmark icon, label in `--text-primary`, connecting line filled green
  - **Current:** Pink-filled circle (`--progress-pink`) with white step number, bold label, connecting line filled green (left side only)
  - **Upcoming:** White circle with `--border-light` outline, grey step number, `--text-muted` label, grey connecting line
- **Clickable:** Completed steps clickable (jump back). Upcoming steps NOT clickable.
- Hover on completed step: subtle scale 1.05, cursor pointer

### 3.4 Navigation Footer
- Height: 72px
- Background: White / `--bg-elevated`
- Top border: 1px `--border-light`
- **Left:** Back button (secondary blue style) — hidden on Step 1
- **Right:** Continue button (primary pink style) — text changes per step:
  - Step 1: "Continue to Mapping"
  - Step 2: "Continue to Settings"
  - Step 3: "Continue to Review"
  - Step 4: "Continue to Export"
  - Step 5: "Download File" (becomes green when ready)
- Buttons: 44px tall, 24px horizontal padding, uppercase 14px bold text

### 3.5 App Footer
- Height: 40px
- Background: `--progress-navy`
- Text: White, 12px, centered
- Content: "© Progress Software Corporation • Internal Tool • Need help? Contact MarketingOps@progress.com"

---

## 4. Component Library

### 4.1 Buttons

#### Primary (Pink)
```
Background: --progress-pink
Text: White, uppercase, 14px bold
Padding: 12px 24px
Border: none
Border radius: 8px
Hover: --progress-pink-dark, slight lift (translateY -1px)
Active: scale 0.98
Disabled: 40% opacity, no hover
```

#### Secondary (Blue)
```
Background: --progress-blue
Text: White, uppercase, 14px bold
Padding: 12px 24px
Border: none
Border radius: 8px
Hover: --progress-blue-dark
```

#### Tertiary (Outlined)
```
Background: transparent
Text: --progress-blue, uppercase, 14px bold
Border: 1px solid --progress-blue
Padding: 12px 24px
Hover: --progress-blue background, white text
```

#### Text Link
```
Color: --progress-blue
Underline on hover
Used for "Start Over", "Remove file", etc.
```

### 4.2 Form Inputs

#### Text Input
```
Height: 44px
Padding: 12px
Border: 1px solid --border-light
Border radius: 4px
Font: 16px regular
Focus: 2px --progress-blue outline, shadow-sm
Error: 1px --progress-pink border, pink helper text below
Required: asterisk in pink after label
```

#### Dropdown
```
Same as text input + chevron icon on right
On open: card-style menu with --shadow-md, max-height 280px scrollable
Search-as-you-type for picklists with 10+ items (Country, Product, Lead Source, etc.)
```

#### Date Picker
```
Text input + calendar icon
Format: M/D/YYYY
Native HTML5 date picker fallback for accessibility
```

#### Checkbox
```
24px square, 4px border radius
Border: 2px --border-light when unchecked
Background: --progress-green when checked, with white checkmark
Label to the right, 16px regular
```

#### Toggle Switch
```
Used for dark/light mode and "Use as batch / per-row" toggles
44px wide × 24px tall
Off: grey background, white circle left
On: --progress-green background, white circle right
```

### 4.3 Cards
```
Background: white / --bg-elevated
Border radius: 8px
Padding: 24px
Shadow: --shadow-md
Optional title at top: text-h3 in --text-primary
```

### 4.4 Tags / Pills
Used for confidence indicators, validation badges, file labels.
```
Padding: 4px 12px
Border radius: 9999px
Font: 12px medium uppercase
Variants:
  - Success: --progress-green background, white text
  - Warning: --warning-yellow background, --text-primary text
  - Error: --progress-pink background, white text
  - Info: --progress-blue background, white text
  - Neutral: --border-light background, --text-secondary text
```

### 4.5 Modals
```
Backdrop: rgba(0, 0, 0, 0.5) blur
Card: max-width 480px, border-radius 12px, --shadow-lg
Header: text-h2, close X in top-right
Body: text-body, 24px padding
Footer: right-aligned Cancel (tertiary) + Confirm (primary pink) buttons
Used for: Start Over confirmation, Export error summary, File too large, etc.
```

### 4.6 Toasts
```
Position: top-right, 24px from edge
Width: 360px
Padding: 16px
Border radius: 8px
Shadow: --shadow-lg
Variants:
  - Success: green left border, checkmark icon
  - Error: pink left border, X icon
  - Info: blue left border, info icon
Auto-dismiss after 5s; manual X to close
```

---

## 5. User Journey — Step-by-Step

### Step 1: Upload Files

**Page Title:** "Upload Your Lead Lists"  
**Subtitle:** "Drag and drop one or more files. Supported formats: .xlsx, .xls, .csv (max 10MB each)"

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│         ╭────────────────────────────────────────╮          │
│         │                                        │          │
│         │           [Upload Icon — 64px]         │          │
│         │                                        │          │
│         │   Drag and drop files here             │          │
│         │   or click to browse                   │          │
│         │                                        │          │
│         │   .xlsx, .xls, .csv up to 10MB each   │          │
│         │                                        │          │
│         ╰────────────────────────────────────────╯          │
│                                                              │
│   Uploaded Files (2):                                        │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ 📄 KGC_leads_June2026.xlsx  •  678 rows  •  234 KB   │  │
│   │                                              [Remove] │  │
│   ├──────────────────────────────────────────────────────┤  │
│   │ 📄 TechTarget_export.csv    •  142 rows  •  56 KB    │  │
│   │                                              [Remove] │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Behaviors:**
- Drag-over state: dropzone border becomes solid pink, background mint-tinted
- After file uploads, dropzone collapses to a smaller "Add another file" link
- File list shows: icon, filename, row count, file size, Remove button
- Errors (unsupported type, too large) appear as toasts
- Continue button disabled until ≥1 valid file uploaded

**Continue button:** "Continue to Mapping →"  
**Back button:** Hidden (first step)

---

### Step 2: Map Columns

**Page Title:** "Map Your Columns"  
**Subtitle:** "We've auto-matched your columns to the template. Review and adjust as needed."

**Layout:**

If multiple files, use tabs at top to switch between files:

```
┌──────────────────────────────────────────────────────────────┐
│  [KGC_leads_June2026.xlsx]  [TechTarget_export.csv]          │
│  ─────────────────────────                                   │
│                                                              │
│   ┌────────────────────────────────────────────────────────┐│
│   │  Your Column            Confidence    Template Column  ││
│   │  ────────────────────────────────────────────────────  ││
│   │  First Name             [High]    →   FIRST NAME ▼     ││
│   │  Last Name              [High]    →   LAST NAME ▼      ││
│   │  Email                  [High]    →   EMAIL ADDRESS ▼  ││
│   │  Organization           [Medium]  →   COMPANY NAME ▼   ││
│   │  Country                [High]    →   COUNTRY ▼        ││
│   │  Job Title              [High]    →   Title ▼          ││
│   │  Lead Comments          [Low]     →   FORM COMMENTS ▼  ││
│   │  Source Vendor          [None]    →   Ignore ▼         ││
│   └────────────────────────────────────────────────────────┘│
│                                                              │
│   Required template columns: ✓ All mapped                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Behaviors:**
- Each row = one source column from the uploaded file
- Confidence tag color-coded: Green (High), Yellow (Medium), Orange (Low), Grey (None)
- Template column dropdown shows all unmapped template columns + "Ignore" option
- If user maps two source columns to same template column, show error
- Bottom status: ✓ green check if all required template columns mapped; ✗ pink X with list of missing columns

**Continue button:** Disabled until all required template columns mapped  
**Back button:** "← Back to Upload"

---

### Step 3: Campaign Settings

**Page Title:** "Configure Campaign Settings"  
**Subtitle:** "These values will apply to all rows in each file. You can override individual rows in the next step."

**Layout:** Tabs per file at top. Form below organized in card groups:

```
┌──────────────────────────────────────────────────────────────┐
│  [KGC_leads_June2026.xlsx]  [TechTarget_export.csv]          │
│                                                              │
│   ╭── Campaign Identification ──────────────────────────╮   │
│   │ Campaign Source *      [26Q2 PDP NA DEMD KGC      ] │   │
│   │ SFDC Campaign ID *     [701Pb00003abcdefghij      ] │   │
│   │                        18 of 18 characters ✓        │   │
│   │ Last Response Date *   [6/16/2026]                  │   │
│   ╰─────────────────────────────────────────────────────╯   │
│                                                              │
│   ╭── Categorization ───────────────────────────────────╮   │
│   │ Product *              [Data Platform        ▼]     │   │
│   │ Lead Source - Initial* [Event Tradeshow      ▼]     │   │
│   │ Lead Source - Recent * [Event Tradeshow      ▼]     │   │
│   │ Call to Action *       [Event - 3rd party    ▼]     │   │
│   │ Target Channel Type *  [Direct               ▼]     │   │
│   │ Campaign Member Status*[Visited Booth        ▼]     │   │
│   ╰─────────────────────────────────────────────────────╯   │
│                                                              │
│   ╭── UTM Parameters ──────────────────────────────────╮   │
│   │ utm_medium             [event-paid           ▼]     │   │
│   │ utm_source             [KGC                       ] │   │
│   │ utm_campaign           [pdp_na_pdp_event_KGC      ] │   │
│   │ Offer Title            [                          ] │   │
│   ╰─────────────────────────────────────────────────────╯   │
│                                                              │
│   ╭── Lead Routing ────────────────────────────────────╮   │
│   │ ☐ Force MQL for all rows                            │   │
│   │ ☑ Force MAL for all rows                            │   │
│   │ Lead Owner             [Queue - Auto-Nurture      ] │   │
│   ╰─────────────────────────────────────────────────────╯   │
│                                                              │
│   ╭── Marketing Ops (optional) ────────────────────────╮   │
│   │ External Asset Status      [                      ] │   │
│   │ Lead Owner ID              [                      ] │   │
│   │ Manual Lead Assignment     [                      ] │   │
│   │ Bypass Bogus Program       [                      ] │   │
│   ╰─────────────────────────────────────────────────────╯   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Behaviors:**
- Required fields marked with pink asterisk
- SFDC Campaign ID input shows live character count; green check when exactly 18 chars, pink warning otherwise
- Force MQL + Force MAL: if both checked, inline error appears
- Marketing Ops section is always visible but visually de-emphasized (smaller heading, light grey background)
- Dropdown with 10+ items has search/filter (Country, Product, Lead Source, Call to Action, utm_medium)

**Continue button:** Disabled until all required fields valid for ALL file tabs  
**Back button:** "← Back to Mapping"

---

### Step 4: Review & Edit

**Page Title:** "Review Your Data"  
**Subtitle:** "Inline-edit any cell. Errors must be fixed before exporting."

**Layout:**

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┬─────────────────┬──────────────────────┐   │
│  │ TOTAL ROWS      │ ERRORS          │ WARNINGS    DUPLICATES│   │
│  │      820        │      3          │      12          2    │   │
│  └─────────────────┴─────────────────┴──────────────────────┘   │
│                                                                  │
│  Filters: [All] [Errors Only] [Warnings Only] [Duplicates]       │
│  Search: [____________________]                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ # │ Source File  │ First │ Last │ Email          │Product│   │
│  │ 1 │ KGC_leads... │ John  │ Doe  │ john@acme.com  │Data Pl│   │
│  │ 2 │ KGC_leads... │ Jane  │ Smith│ [jane@invalid] │Data Pl│ ❌ │
│  │ 3 │ KGC_leads... │ Bob   │ Lee  │ bob@acme.com   │Data Pl│   │
│  │...│              │       │      │                │       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ⚠ Errors (3):                                                   │
│   • Row 2: Invalid email address "jane@invalid"                  │
│   • Row 47: Missing COMPANY NAME                                 │
│   • Row 102: Duplicate email "tom@example.com" (also row 89)     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Behaviors:**
- Summary cards at top use color-coded backgrounds (Total: navy, Errors: pink, Warnings: yellow, Duplicates: orange)
- Filter pills toggle visible rows
- Search box filters across all string columns
- Data grid is virtualized for performance with 1000+ rows
- Click any cell → becomes editable (input or dropdown depending on column type)
- Cells with errors: pink border, hover shows tooltip with error message
- Cells with warnings: yellow border
- Duplicate rows: subtle pink-tinted row background
- Row delete: hover row → trash icon appears on right
- Error list at bottom: clickable links scroll to the offending row and highlight it
- Sticky table header so columns stay visible on scroll
- First column (#) and Source File column are sticky horizontally

**Continue button:** "Continue to Export" — disabled if errors > 0  
**Back button:** "← Back to Settings"

---

### Step 5: Export

**Page Title:** "Export Your File"  
**Subtitle:** "Choose your format and download the formatted file."

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ✓ Ready to Export                         │
│                  817 rows • 0 errors                         │
│                                                              │
│   Output Format                                              │
│   ┌─────────────────────────┐  ┌─────────────────────────┐  │
│   │  ●  CSV (.csv)          │  │  ○  Excel (.xlsx)       │  │
│   │     Recommended for     │  │     For manual review   │  │
│   │     Eloqua upload       │  │     before upload       │  │
│   └─────────────────────────┘  └─────────────────────────┘  │
│                                                              │
│   Filename                                                   │
│   [26Q2_PDP_NA_DEMD_KGC_upload_2026-06-23.csv         ]      │
│                                                              │
│   Summary                                                    │
│   • 2 source files merged                                    │
│   • 38 template columns in correct order                     │
│   • 1 campaign(s): 26Q2 PDP NA DEMD KGC                      │
│                                                              │
│              ┌────────────────────────────────┐              │
│              │   ⬇  DOWNLOAD FILE             │              │
│              └────────────────────────────────┘              │
│                                                              │
│                  After download, upload directly to Eloqua   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Behaviors:**
- Big green checkmark and success message at top
- Format selection: two radio cards, selected card has pink border
- Filename: editable text input, pre-filled with `[CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]`
- Multi-campaign uploads default to `multi-campaign_upload_[date].[ext]`
- Download button is HUGE — pink primary button, full width, with download icon
- After click: triggers file download, shows success toast "File downloaded successfully"
- Optional: "Start a new upload" link appears after download

**Continue button:** Replaced by "Download File" primary button  
**Back button:** "← Back to Review"

---

## 6. Accessibility (WCAG 2.1 AA)

- **Color contrast:** All text meets 4.5:1 ratio against background
- **Keyboard navigation:** Full tab order, visible focus indicators (2px pink outline)
- **Screen reader:** ARIA labels on icon-only buttons; `aria-live` for validation messages and toasts
- **Step indicator:** `role="progressbar"` with `aria-valuenow`, `aria-valuemax`
- **Form errors:** `aria-invalid` and `aria-describedby` linking inputs to error messages
- **Modals:** Focus trapped while open; ESC closes; focus returns to trigger element
- **Reduced motion:** Respect `prefers-reduced-motion` — disable transitions/animations
- **Color-independent meaning:** Validation states use icons + color (not color alone)

---

## 7. Responsive Behavior

- **Desktop (1280px+):** Full layout as described
- **Laptop (1024px–1279px):** Same layout, slightly tighter spacing
- **Tablet (768px–1023px):** 
  - Step indicator: smaller circles, abbreviated labels
  - Campaign Settings: single-column form
  - Data grid: horizontal scroll with sticky first columns
- **Mobile (<768px):** 
  - Not officially supported in v1 (warn user)
  - Show message: "Please use a desktop or tablet for the best experience"

---

## 8. Dark Mode

Toggle in app header (🌙 / ☀️ icon). Persists preference in localStorage.

Key adjustments:
- Page background: `--bg-base` (#0A0E1A)
- Cards: `--bg-elevated` (#161B2E)
- Brand colors brightened for contrast (see 2.1)
- Geometric shapes: lower opacity (15-20%) so they don't dominate
- Step indicator green completed circles: keep green for brand recognition
- Pink CTA buttons: keep pink for brand consistency

---

## 9. Microinteractions

- **Button hover:** Slight lift (translateY -1px) + shadow grow over 150ms
- **Step transition:** Fade-in next step content over 200ms
- **Step indicator advance:** Circle fills with green + checkmark draws in over 300ms
- **Validation appearance:** Cells with errors gently pulse pink border on first appearance
- **File upload success:** Brief green flash on file list item entry
- **Toast appearance:** Slide in from right + fade over 250ms
- **Dropdown open:** Scale 0.95 → 1.0 with fade over 150ms

---

## 10. Reference Screens (Inspired by Progress.com)

The visual language pulls from Progress.com:

| Pattern | Source | Application |
|---|---|---|
| Hero with green angular shapes | Progress.com/contactus | Step 1 upload hero |
| White content card on color background | Progress.com forms | All step content cards |
| Hot pink primary CTA | Progress.com "CONTACT SALES" button | All primary CTAs |
| Blue secondary CTA | Progress.com/marklogic "REQUEST DEMO" | Back buttons, secondary actions |
| Sidecar promo card | Progress.com/marklogic right rail | Optional help/tip callouts |
| Geometric chevron motifs | Progress.com hero sections | App header accent, footer accent |
| Large bold display headlines | Progress.com hero ("Change the Way You Work with Data") | Step page titles |

---

## 11. Empty States & Edge Cases

| State | Treatment |
|---|---|
| No files uploaded | Large dropzone with friendly illustration + "Drag files here or click to browse" |
| All files removed mid-flow | Show empty state in current step; offer "Upload Files" link |
| Validation passes with 0 errors | Green banner: "All checks passed! Ready to export" |
| Single file upload (no multi-file) | Hide file tabs on Steps 2 & 3 (just show one form) |
| File parse fails | Toast: "Couldn't read [filename]. Verify it's not corrupted." + keep other files |
| Export with warnings (no errors) | Modal before download: "Your file has N warnings. Continue?" with Continue/Review buttons |
| User clicks Start Over | Modal: "This will clear all uploaded files and settings. Continue?" with Cancel/Yes buttons |
