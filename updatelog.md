## Update Log

### Progress List Upload Formatter

This log tracks changes to the spec set (PRD.md, architecture.md, design.md) across versions.

### v1.2 — July 2, 2026

**Author:** Brandon Gittelman
**Trigger:** Live testing of the v1.1 build. All items below are corrections and improvements based on real-world usage; the v1.1 acceptance criteria remain valid.

#### Changes

| # | Change | Type |
|---|--------|------|
| 1 | **Fuzzy column matcher rewritten.** The v1.1 matcher failed on common vendor headers like `PRODUCT (use drop down menu)`, `COUNTRY (use drop down menu)`, `FIRST NAME`, `EMAIL ADDRESS`. The new matcher: (a) normalizes by stripping parenthetical hints, (b) applies token-overlap (Jaccard) scoring as a first pass before Fuse.js, (c) drops stopwords (`use`, `menu`, `drop`, `down`, `dropdown`, `select`, `please`, `value`, `the`, `a`, `an`, `of`, `or`, `and`), (d) uses a Fuse threshold of 0.5 (up from 0.4) as a soft fallback. | Breaking |
| 2 | **`columnSynonyms` in picklists.json now covers all 37 mappable template columns**, including UPPERCASE, snake_case, and parenthetical variants. The v1.1 shipped with synonyms for only 6 columns. | Breaking |
| 3 | **Router preserves scroll position and focus across re-renders.** The v1.1 router called `window.scrollTo(0, 0)` on every render, which fired on every keystroke and checkbox click. It now: (a) only scrolls to top when the wizard step changes, (b) captures scrollY, focused element id, and text selection before mount, (c) restores them after mount using `focus({preventScroll:true})` and `setSelectionRange()`, (d) restores scroll three times (once sync, twice in `requestAnimationFrame`), (e) sets `history.scrollRestoration = 'manual'`. | Breaking |
| 4 | **Dropzone CSS fixed.** The dropzone is a `<label>` element. Labels are inline by default, which caused the box to collapse to content width. Required: `.dropzone { display: block; width: 100%; box-sizing: border-box; }` and `.dropzone .dz-title, .dropzone .dz-sub { display: block; }`. | Breaking |
| 5 | **Step 4 (Review) must not call `store.set()` inside `render()`.** The v1.1 draft called `store.set({ processedRows: rows })` at the top of Step 4's render, which caused an infinite loop. ProcessedRows must be computed inside render and cached in a module-local variable. | Breaking |
| 6 | **JS syntax validation required before shipping.** Every `.js` module must pass `node --check` before it is committed. | Process |
| 7 | **Browser DevTools scroll-and-focus smoke test** added to acceptance testing. | Process |

#### Version Bumps
- PRD.md: 1.1 → **1.2**
- architecture.md: 1.1 → **1.2**
- design.md: 1.1 → **1.2**

#### Migration Notes for Developers Regenerating From v1.1

- **Read this v1.2 section BEFORE regenerating anything.** These fixes are already known and documented; regenerating from v1.1 alone will reproduce every one of the bugs above.
- Rewrite `js/modules/fuzzy.js` per architecture.md §4.2.
- Rewrite `js/router.js` per architecture.md §6.
- Rewrite `styles/steps.css` `.dropzone` block per design.md Step 1.
- In `js/ui/step4-review.js`, remove any `store.set({ processedRows: ... })` call. Cache locally.
- Expand `picklists.json` `columnSynonyms` to cover all 37 template columns; see architecture.md §5.1.

#### Testing Priorities for v1.2

- Upload a file with header `PRODUCT (use drop down menu)` → auto-map to Product with High confidence.
- Upload a file with header `COUNTRY (use drop down menu)` → auto-map to Country with High confidence.
- Upload a file with all-uppercase headers → all auto-map with High confidence.
- On Step 3, scroll halfway down, then check a checkbox → page stays put.
- On Step 3, type in `Campaign Source` → cursor stays, no character loss.
- On Step 3, type in `Lead Owner ID` → Manual Lead Assignment auto-checks, focus stays.
- On Step 4, click a row checkbox → page stays, row updates in place.
- Every `.js` file must pass `node --check`.

---

### v1.1 — July 2, 2026

**Author:** Brandon Gittelman
**Trigger:** Updates based on live testing of the v1.0 build.

#### Changes

| # | Change | Type |
|---|--------|------|
| 1 | Eliminated all NPM / Node.js dependencies. Vanilla HTML/CSS/JS. SheetJS and Fuse.js as pre-built UMD via CDN or `vendor/`. | Breaking |
| 2 | Bypass Bogus Program is now a checkbox; exports `Yes` when checked, blank when unchecked. | Breaking |
| 3 | Manual Lead Assignment is a checkbox and auto-checks when Lead Owner ID has a value. Manual uncheck respected for the session. | Breaking |
| 4 | Standalone Lead Owner column removed. Template count = 37 (was 38). | Breaking |
| 5 | Picklists externalized to `picklists.json`. Marketing Ops can edit without code changes. | New capability |
| 6 | COUNTRY renamed to Country everywhere. | UX polish |
| 7 | PRODUCT renamed to Product everywhere. | UX polish |
| 8 | All column names normalized to Title Case; utm_* fields stay lowercase. | UX polish |
| 9 | Email + Product uniqueness rule. Same email + same Product = error. Same email + different Products = warning. | New capability |

---

### v1.0 — June 2026

**Author:** Brandon Gittelman
Initial spec set produced for the Progress List Upload Formatter.

Highlights: 5-step wizard, 38-column Eloqua template, React 18 + TypeScript + Vite + Zustand + Tailwind + Fuse.js + SheetJS stack, client-first architecture, Progress brand system, fuzzy column mapping, country standardization, SFDC ID validation, duplicate detection.