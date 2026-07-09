# LLM Regeneration Prompt — Progress List Upload Formatter v1.4 Draft

You are a senior full-stack developer regenerating the **Progress List Upload Formatter** app from the attached specification bundle.

## Critical instructions — read carefully

1. **Read `updatelog.md` FIRST.**  
   The updatelog documents hard-won bug fixes and regressions from v1.0 through v1.4 Draft. Regenerating without reading it will likely reproduce known bugs.

2. **Then read these files in this exact order:**
   1. `PRD.md`
   2. `architecture.md`
   3. `design.md`
   4. `runtime-data.md`
   5. Every file in `features/`, in numeric order
   6. `picklists.json`

3. **The spec is authoritative.**  
   Do not invent behavior. Do not redesign the UI. Do not add frameworks, build tooling, backend services, telemetry, cookies, service workers, analytics, or API calls.

4. **Preserve all v1.4 Draft changes.**  
   The most important changes are:
   - `Lead Source - Initial` is removed entirely.
   - Export schema is now **36 columns**.
   - `Lead Owner ID`, when populated, must be exactly **18 characters**.
   - Step 5 Review keeps resolved issue rows visible and turns them green.
   - Step 5 Review puts **Email Address** as the first data column after Issue and Source.
   - Step 4 Campaign Settings uses the signed-off grouped card layout and picklists from `picklists.json`.
   - Force MQL and Force MAL are mutually exclusive.
   - Start Over clears workflow state but preserves loaded picklists and Teams context.
   - Do **not** create separate `hotfix.css` files. Integrate CSS into existing stylesheets.

---

## Hard technical rules

- **NO NPM.**
- **NO Node.js runtime dependency for the app.**
- **NO build step.**
- **NO `package.json`.**
- **NO `node_modules`.**
- **NO TypeScript.**
- **NO React, Vue, Svelte, Tailwind, Bootstrap, Zustand, or UI framework.**
- Vanilla HTML, CSS, and browser ES modules only.
- Third-party browser libraries may be loaded from CDN or a local prebuilt `vendor/` folder.
- Every `.js` file must pass:

```bash
node --check path/to/file.js
```

- The router must preserve scroll position, focus, and caret across state changes.
- Only wizard step transitions may scroll to the top.
- Every input, select, checkbox, radio, and button must have a deterministic stable `id`.
- Step 5 Review `render()` must **not** call `store.set()`.
- Do not create one-off CSS files such as `hotfix.css`, `header-hotfix.css`, or `layout-hotfix.css`.

---

## Required file tree

Produce this exact static app structure:

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

Do not add extra top-level app files unless the spec explicitly requires them.

---

## Functional requirements summary

### Wizard

The app is a 6-step wizard:

1. Upload Files
2. Map Columns
3. Confirm Data
4. Campaign Settings
5. Review & Edit
6. Export

Step 3 is conditional, but the step indicator always shows six steps.

### Output schema

The output file must contain exactly 36 columns in the order defined in `PRD.md` and `architecture.md`.

`Lead Source - Initial` must **not** appear anywhere in the output file.

### Step 2 Mapping

- High and Medium confidence auto-map.
- Low confidence never auto-maps.
- Low confidence must render as a suggestion pill with an explicit Accept action.
- Foreign-language synonyms must come from `picklists.json`.

### Step 3 Confirmation

- Only required export fields should trigger partial-column confirmation.
- Optional partial fields should not block the user.
- MAL/MQL detection appears when relevant.
- State blanking notice is informational and does not block Continue.

### Step 4 Campaign Settings

- Use the signed-off grouped card layout.
- Restore picklists from `picklists.json`.
- Do not render `Lead Source - Initial`.
- SFDC Campaign ID must be exactly 18 characters.
- Lead Owner ID is optional but must be exactly 18 characters when present.
- Force MQL and Force MAL must be mutually exclusive.
- Lead Owner ID should auto-check Manual Lead Assignment when populated.

### Step 5 Review

- Show rows that have or had validation issues.
- Active error rows are red.
- Active warning rows are yellow.
- Resolved rows remain visible and turn green.
- Email Address is the first data column after Issue and Source.
- Continue enables only when blocking errors are resolved.
- Export with Errors remains available when errors remain.
- Step 5 `render()` must not call `store.set()`.

### Step 6 Export

- Export CSV and XLSX.
- CSV includes UTF-8 BOM.
- Export exactly 36 columns.
- Exclude `Lead Source - Initial`.
- Normalize Country and State to canonical full names.
- Blank State when Country is not United States or Canada.
- Prefix filename with `WITH_ERRORS_` when exporting with errors.

---

## Microsoft Teams requirements

- Include `teams/manifest.json`.
- Include `teams-config.html`.
- Load Teams SDK via CDN or local prebuilt file.
- Guard Teams SDK initialization so standalone mode never hangs or renders blank.
- Apply Teams default/dark/contrast theme via `data-teams-theme`.
- Hide manual theme toggle inside Teams.
- `frame-ancestors` for Teams embedding must be delivered as an HTTP response header in production hosting. The app may include CSP meta for other directives, but do not rely on meta CSP for `frame-ancestors`.

---

## Validation checklist before completion

Before presenting the final app as complete:

1. Run `node --check` on every `.js` file.
2. Confirm there is no `package.json`.
3. Confirm there is no `node_modules`.
4. Confirm `Lead Source - Initial` does not appear in Step 4 UI or output columns.
5. Confirm `Lead Owner ID` validation works only when populated.
6. Confirm Step 5 resolved rows turn green instead of disappearing.
7. Confirm Email Address is the first data column in Step 5 after Issue and Source.
8. Confirm Force MQL and Force MAL cannot both be selected.
9. Confirm Start Over clears workflow state but preserves picklists and Teams state.
10. Confirm standalone browser mode does not hang on Teams SDK initialization.

---

## Deliverable format

Generate the complete app file tree as full files. If providing downloadable files, include a ZIP containing the full `progress-list-upload/` folder.

After generation, include:

1. A short summary of what was regenerated.
2. The file count.
3. The `node --check` result.
4. Any assumptions. If the specs are complete, assumptions should be `None`.
