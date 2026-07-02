## UI/UX Design Specification

### Progress List Upload Formatter

Version: 1.2
Owner: Brandon Gittelman, Marketing Technical Architect, Principal
Last Updated: July 2026

v1.2 changes: Step 1 dropzone CSS documented (fixes a real v1.1 bug). New §12 UI Stability section: state changes must not scroll the page or steal focus. See updatelog.md v1.2. Read updatelog.md v1.2 before regenerating.

v1.1 changes: Title Case columns; Country and Product dropdowns; Marketing Ops checkboxes for MLA and Bypass Bogus Program; standalone Lead Owner removed; MLA auto-checks; 37 columns; per-Product email duplicate treatment; picklists via picklists.json.

---

#### 1. Design Principles

- Brand-Aligned -- Progress Software identity (green, pink, navy, geometric shapes).
- Wizard-Driven -- Linear progression, always-visible step indicator.
- Reversible -- Back button on every step; no data loss.
- Forgiving -- Validation errors surfaced inline with guidance.
- Accessible -- WCAG 2.1 AA; keyboard navigation; dark/light mode.
- Familiar -- Mirrors Progress.com patterns.
- No-Build Delivery -- Plain CSS3; static files.
- Stable Under Input (v1.2) -- Typing, clicking, and selecting must never scroll the page or lose focus. See §12.

---

#### 2. Progress Brand System

##### 2.1 Color Palette

Light Mode
- --progress-green #5CE500 -- brand accent, success, completed steps
- --progress-green-dark #3FB300 -- hover
- --progress-pink #E81C68 -- primary CTAs, required, errors
- --progress-pink-dark #B81554 -- hover
- --progress-blue #0E62FE -- secondary CTAs, links
- --progress-blue-dark #0046C7 -- hover
- --progress-navy #001A4F -- top nav bg, deep accent
- --bg-sky #E6F2FF -- hero bg
- --bg-mint #EFFCE8 -- alt soft bg
- --bg-white #FFFFFF -- cards
- --text-primary #1A1A1A
- --text-secondary #6B7280
- --text-muted #9CA3AF
- --border-light #E5E7EB
- --warning-yellow #FBBF24

Dark Mode
- --progress-green #7BFF1F
- --progress-pink #FF3D7F
- --progress-blue #4D8BFE
- --bg-base #0A0E1A
- --bg-elevated #161B2E
- --bg-input #1F2540
- --text-primary #F5F5F5
- --text-secondary #A0A8B8
- --border #2C3354

Tokens live in styles/tokens.css as CSS custom properties on :root.

##### 2.2 Typography

Font: "Mulish", "Segoe UI", system-ui, -apple-system, sans-serif.

- text-display 48px / 800 / 1.1 -- page hero
- text-h1 36px / 700 / 1.2 -- step titles
- text-h2 24px / 700 / 1.3 -- section headings
- text-h3 18px / 600 / 1.4 -- card titles
- text-body 16px / 400 / 1.6 -- default
- text-small 14px / 400 / 1.5 -- helper
- text-label 12px / 500 / 1.4 -- uppercase labels
- text-button 14px / 700 / 1 -- button labels

##### 2.3 Spacing (8px base)

4, 8, 12, 16, 24, 32, 48, 64, 96 px

##### 2.4 Border Radius

- 4px inputs / small buttons
- 8px cards / large buttons
- 12px modals
- 9999px pills / step circles

##### 2.5 Shadows

- --shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
- --shadow-md: 0 4px 12px rgba(0,0,0,0.08)
- --shadow-lg: 0 12px 32px rgba(0,0,0,0.12)

---

#### 3. Global Layout

Sticky App Header (60px) -> Step Indicator (80px) -> main content card (max 1200px) -> Nav Footer (72px) -> App Footer (40px).

- App Header: Progress logo + app name + dark/light toggle + Start Over.
- Step Indicator: 5 circles (Upload -> Map -> Settings -> Review -> Export). Complete = green with checkmark; Current = pink with number; Upcoming = white with grey number. Completed steps clickable.
- Nav Footer: Back (blue, hidden on Step 1) + Continue (pink primary).
- App Footer: Navy, © Progress Software Corporation · Internal Tool.

---

#### 4. Component Library

- Buttons: Primary (pink), Secondary (blue), Tertiary (outlined), Text Link. 44px tall, uppercase 14px bold.
- Text Input: 44px tall, 12px padding, 4px radius, 2px blue focus outline.
- Dropdown: Text input + chevron; search-as-you-type when >10 items.
- Date Picker: Text input + calendar icon; M/D/YYYY.
- Checkbox: 22px square, 4px radius, --progress-green when checked with white checkmark.
- Cards, Tags, Modals, Toasts: see styles/components.css.

---

#### 5. User Journey

##### Step 1: Upload Files

Title: "Upload Your Lead Lists"
Subtitle: "Drag and drop one or more files. Supported formats: .xlsx, .xls, .csv (max 10MB each)"

Large dropzone. File list shows filename, row count, size, Remove button.

v1.2 CSS implementation note (MANDATORY): The dropzone is a <label> element so that clicking anywhere in the box triggers the hidden file input. Labels are INLINE by default, which causes the dropzone to collapse to content width and pushes block children (title, subtitle) into the parent card. Required CSS:

  .dropzone {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 2px dashed var(--border);
    background: var(--bg-sky);
    border-radius: var(--radius-lg);
    padding: var(--space-12) var(--space-6);
    text-align: center;
    cursor: pointer;
  }
  .dropzone .dz-title,
  .dropzone .dz-sub {
    display: block;
  }

Continue: "Continue to Mapping ->"
Back: Hidden

##### Step 2: Map Columns

Title: "Map Your Columns"
Subtitle: "We've auto-matched your columns to the template. Review and adjust as needed."

Per-file tabs. Each source column shown with confidence tag + template dropdown.

v1.2: The auto-mapper MUST handle vendor headers including PRODUCT (use drop down menu), COUNTRY (use drop down menu), FIRST NAME, EMAIL ADDRESS, SFDC CAMPAIGN ID. See PRD.md FR-2.7 and architecture.md §4.2.

Continue: Disabled until all required columns mapped.
Back: "<- Back to Upload"

##### Step 3: Campaign Settings

Title: "Configure Campaign Settings"
Subtitle: "These values will apply to all rows in each file. You can override individual rows in the next step."

Per-file tabs. Form organized in card groups: Campaign Identification / Categorization / UTM Parameters / Lead Routing / Marketing Ops.

Behaviors preserved from v1.1:
- Manual Lead Assignment and Bypass Bogus Program are checkboxes.
- Manual Lead Assignment auto-checks on Lead Owner ID edit; user manual uncheck respected.
- Standalone Lead Owner text field removed.
- Required fields marked with pink asterisk.
- SFDC Campaign ID live character count.
- Force MQL + Force MAL mutual exclusivity.
- Marketing Ops de-emphasized.
- Dropdowns with 10+ items have search.
- Picklists from picklists.json.

v1.2 stability requirement (MANDATORY): Typing in any text field, clicking any checkbox, or changing any dropdown MUST NOT scroll the page or lose focus. Enforced by router (architecture.md §6.2).

Continue: Disabled until all required fields valid for ALL file tabs.
Back: "<- Back to Mapping"

##### Step 4: Review & Edit

Title: "Review Your Data"
Subtitle: "Inline-edit any cell. Errors must be fixed before exporting."

Summary cards (Total: navy, Errors: pink, Warnings: yellow, Duplicates: orange). Filter buttons + search. Sticky table header + sticky first two columns. Column headers in Title Case.

Behaviors from v1.1: Rows sharing (Email Address, Product) get pink background + red border on both cells. Error list at bottom with clickable "Row N" links that scroll to the row (this is the ONE allowed programmatic scroll -- it's an explicit navigation action).

v1.2 implementation note (MANDATORY): Step 4's render() must NOT call store.set(). ProcessedRows must be computed inside render, cached module-locally, and used by canContinue(). Writing back to the store causes an infinite loop. See architecture.md §6.3.

Continue: "Continue to Export" -- disabled if errors > 0.
Back: "<- Back to Settings"

##### Step 5: Export

Title: "Export Your File"
Subtitle: "Choose your format and download the formatted file."

Format cards (CSV / XLSX) -- selected has pink border. Editable filename pre-filled with [CampaignSource]_upload_[YYYY-MM-DD].[csv|xlsx]. Multi-campaign default: multi-campaign_upload_[date].[ext]. Download button pink full width. Summary confirms 37 columns.

Back: "<- Back to Review"

---

#### 6. Accessibility (WCAG 2.1 AA)

- Color contrast 4.5:1 minimum.
- Full keyboard nav; 2px pink focus outline.
- Native <input type="checkbox"> with <label>.
- ARIA live region announces MLA auto-check.
- Step indicator: role="progressbar" with aria-valuenow / aria-valuemax.
- Form errors: aria-invalid and aria-describedby.
- Modals: focus-trapped, ESC closes, focus returns to trigger.
- Respect prefers-reduced-motion.
- v1.2: Focus restoration on re-render (architecture.md §6.2) is an accessibility feature -- keyboard users' focus rings don't disappear on state changes.

---

#### 7. Responsive Behavior

- Desktop (1280px+): Full layout
- Laptop (1024-1279px): tighter spacing
- Tablet (768-1023px): single-column form, horizontal-scroll grid
- Mobile (<768px): not officially supported

---

#### 8. Dark Mode

Toggle in app header. Persists in localStorage. Page bg --bg-base; cards --bg-elevated; brand colors brightened; geometric shapes 15-20% opacity.

---

#### 9. Microinteractions

- Button hover: lift + shadow (150ms)
- Step transition: fade-in (200ms)
- Step indicator advance: fill + checkmark draw (300ms)
- Validation errors: pink border pulse
- Upload success: green flash
- Toast: slide-in from right (250ms)
- Dropdown: scale 0.95->1.0 with fade (150ms)
- MLA auto-check: checkbox flashes green (200ms)

All animations respect prefers-reduced-motion.

---

#### 10. Reference Screens (Progress.com)

- Green angular shapes -> Step 1 hero
- White cards on color bg -> all step content cards
- Hot pink CTA -> all primary CTAs
- Blue CTA -> back buttons
- Geometric chevron motifs -> app header
- Large bold display headlines -> step titles

---

#### 11. Empty States & Edge Cases

- No files: Dropzone with "Drag files here or click to browse"
- All files removed: Empty state, "Upload Files" link
- 0 errors: Green banner "All checks passed! Ready to export"
- Single file: Hide file tabs on Steps 2 & 3
- Parse fails: Toast "Couldn't read [filename]"
- Export with warnings: Confirm "Your file has N warnings. Continue?"
- Start Over: Modal "This will clear all data. Continue?"
- Duplicate (Email, Product): Rows pink; error banner; Export disabled
- picklists.json fails: Full-screen blocking modal

---

#### 12. UI Stability Under State Changes (NEW v1.2)

Codifies a hard UX requirement violated in v1.1. Part of AC-9.

Rules:

  1. Typing a character in a text field: no scroll, no focus loss, caret preserved.
  2. Toggling a checkbox: no scroll, no focus loss.
  3. Changing a dropdown: no scroll, focus stays on dropdown.
  4. Switching between file tabs on Steps 2/3: scroll to top (subview transition).
  5. Wizard step transitions: scroll to top.
  6. Explicit user navigation actions (e.g., "Row 47" link in Step 4 error list): allowed.

Implementation is centralized in js/router.js (architecture.md §6.2). Step modules do NOT implement scroll or focus preservation themselves -- but they MUST assign stable id attributes to every input, select, checkbox, and button. Ids must be deterministic (e.g., f-<fileId>-<FieldKey> or row-<sourceFileId>-<rowIndex>-<column>), never random.

Testing: Use the DevTools scroll spy from architecture.md §14.2. It must produce zero output during any of the interactions above.