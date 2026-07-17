# Technical Architecture

## Progress List Upload Formatter

**Version:** v1.5 Draft  
**Architecture:** Static, client-only, no-NPM, no-build web app.

---

## 1. Hard rules

- No NPM.
- No Node runtime dependency for the app.
- No build step.
- No `package.json`.
- No `node_modules`.
- No TypeScript.
- No framework.
- Vanilla HTML, CSS, and browser ES modules only.
- Every `.js` file must pass `node --check` before shipping.
- Do not create separate `hotfix.css` files.
- Integrate all CSS into existing stylesheet files.

---

## 2. File tree

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

---

## 3. Data flow

Upload → Parse → Detect MAL/MQL → Map → Confirm → Configure → Validate/Edit/Delete → Export.

---

## 4. State model additions

The store should support these workflow state values:

```js
{
  deletedRowIds: [],
  processedRows: [],
  validation: { errors: [], warnings: [] },
  mappings: {
    [fileId]: {
      [sourceColumn]: {
        mappedTo: string | null,
        confidence: "High" | "Medium" | "Low" | "Manual" | "Keep" | "None",
        suggestion: object | null,
        language: string | null
      }
    }
  }
}
```

### Deleted row ID format

A stable row ID should be generated from file ID and source row index:

```text
{fileId}:{sourceRowIndex}
```

Deleted rows must be excluded from:

- Review display
- Validation
- CSV export
- XLSX export

---

## 5. Keep Field mapping architecture

Step 2 introduces a special internal mapping value:

```text
__KEEP_FIELD__
```

When a source column is mapped to `__KEEP_FIELD__`:

- The standard template column map is not used.
- The original source column header becomes the export column header.
- The value is copied from the source row to the processed output row under that original source column name.
- The kept field is appended after the standard template columns during export.
- Kept fields are not validated as required standard fields.

---

## 6. Canonical modules

### validator.js

Owns:

- `TEMPLATE_COLUMNS`, the standard 36-column export schema.
- Required field validation.
- Email validation.
- SFDC Campaign ID 18-character validation.
- Lead Owner ID 18-character validation when populated.
- Country/State resolution.
- State blanking warnings.
- Force MQL / Force MAL exclusivity.
- Duplicate Email + Product validation.

`Lead Source - Initial` must not exist in `TEMPLATE_COLUMNS`.

### step2-mapping.js

Owns:

- Mapping source columns to standard fields.
- Unmapped option.
- Keep Field option.
- Low-confidence suggestion UI.
- Excluding `Lead Source - Initial` from standard mapping targets.

### step5-review.js

Owns:

- Building processed rows from source files, mappings, settings, kept fields, and deleted row IDs.
- Running validation.
- Tracking issue row IDs.
- Showing resolved rows as green.
- Rendering Delete Row action.
- Excluding deleted rows.
- Keeping Email Address as first data column after Issue and Source.

Step 5 `render()` must not call `store.set()`.

### exporter.js

Owns:

- Determining standard export columns from `TEMPLATE_COLUMNS`.
- Appending kept fields after standard columns.
- Removing internal metadata fields.
- Excluding deleted rows via processed rows.
- Normalizing Country/State.
- Exporting CSV/XLSX.

---

## 7. CSS architecture

Only these CSS files are allowed:

```text
styles/tokens.css
styles/base.css
styles/components.css
styles/steps.css
```

Use `design/progress-design-system.md` as the current visual authority.

---

## 8. Teams architecture

- Guard Teams SDK initialization.
- Standalone browser mode must never hang or show a blank page because of Teams SDK initialization.
- Apply Teams theme via `data-teams-theme`.
- `frame-ancestors` must be configured as an HTTP response header in production hosting.

---

## 9. Router requirements

The router must preserve:

- Scroll position across non-step state changes.
- Focused element.
- Caret position when supported.

Only wizard step transitions may scroll to top.

Every form control must have a deterministic stable ID.
