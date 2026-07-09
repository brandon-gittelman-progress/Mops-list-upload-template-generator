# Technical Architecture

## Progress List Upload Formatter

**Version:** v1.4 Draft  
**Architecture:** Static, client-only, no-NPM, no-build web app.

---

## 1. Hard Rules

- No NPM.
- No Node runtime dependency for the app.
- No build step.
- Vanilla HTML, CSS, and ES modules only.
- Third-party browser libraries may be loaded from CDN or local prebuilt UMD vendor files.
- Every `.js` file must pass `node --check` before shipping.
- Do not create separate `hotfix.css` files. Integrate CSS into existing stylesheet files.

---

## 2. File Tree

```text
progress-list-upload/
  index.html
  teams-config.html
  picklists.json
  styles/
    tokens.css
    base.css
    components.css
    steps.css
  js/
    app.js
    store.js
    router.js
    modules/
      parser.js
      fuzzy.js
      geo.js
      validator.js
      exporter.js
      picklists.js
      malMqlDetector.js
      teams.js
    ui/
      header.js
      stepIndicator.js
      nav.js
      step1-upload.js
      step2-mapping.js
      step3-confirm.js
      step4-settings.js
      step5-review.js
      step6-export.js
    util/
      dom.js
      date-utils.js
      csv.js
  teams/
    manifest.json
    color.png
    outline.png
  README.md
```

Deliberately absent:

```text
package.json
node_modules/
vite.config.*
tsconfig.json
webpack.*
.babelrc
```

---

## 3. Data Flow

Upload → Parse → MAL/MQL scan → Map → Confirm → Configure → Validate/Edit → Export.

`Lead Source - Initial` is removed from the output schema and must not be included in downstream rows.

---

## 4. Template Columns

The canonical export columns are defined in `js/modules/validator.js` as `TEMPLATE_COLUMNS` and imported by the exporter.

`TEMPLATE_COLUMNS` must contain exactly 36 columns and exclude `Lead Source - Initial`.

---

## 5. Module Responsibilities

### parser.js

- Parse CSV/XLS/XLSX via SheetJS.
- Preserve source headers and source rows.
- Run MAL/MQL detection after parse.

### fuzzy.js

- Normalize headers.
- Auto-map High/Medium only.
- Low confidence returns `suggestion` and does not auto-map.

### geo.js

- Resolve Country aliases.
- Resolve State aliases for US/CA only.
- Report whether State is applicable.

### validator.js

- Own `TEMPLATE_COLUMNS`.
- Validate required fields.
- Validate Email.
- Validate SFDC Campaign ID = 18 characters.
- Validate Lead Owner ID = 18 characters only when populated.
- Validate Country/State using `geo.js`.
- Emit StateWillBeBlanked warnings.
- Enforce Force MQL / Force MAL exclusivity.

### exporter.js

- Serialize only `TEMPLATE_COLUMNS`.
- Normalize Country and State.
- Blank State for non-US/CA.
- Prefix filename with `WITH_ERRORS_` when applicable.

### step3-confirm.js

- Confirm partial data only for required export fields.
- Exclude `Lead Source - Initial`.
- Show MAL/MQL confirmation only when required.
- Show State blanking notices as informational.

### step4-settings.js

- Render grouped Campaign Settings layout.
- Render picklists from `picklists.json`.
- Exclude `Lead Source - Initial`.
- Enforce Force MQL / Force MAL exclusivity.
- Show inline `0/18` count for SFDC Campaign ID and Lead Owner ID.

### step5-review.js

- Track rows that have or had issues.
- Keep resolved rows visible and green.
- Put Email Address first after Issue and Source.
- Do not call `store.set()` inside `render()`.

### header.js

- Toggle theme outside Teams.
- Hide theme toggle in Teams.
- Start Over clears workflow state but preserves picklists and Teams context.

---

## 6. Router Requirements

The router must preserve:

- Scroll position across non-step state changes.
- Focused element ID.
- Input caret where supported.

Only wizard step transitions may scroll to top.

Every input/select/checkbox/radio/button must have a deterministic stable ID.

---

## 7. Teams Requirements

- Use guarded Teams SDK init.
- Do not block standalone browser mode.
- Apply Teams theme via `data-teams-theme`.
- Teams frame embedding requires CSP `frame-ancestors` as an HTTP response header in production hosting.
