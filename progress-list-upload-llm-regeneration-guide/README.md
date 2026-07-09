# Progress List Upload Formatter — LLM Regeneration Guide

This folder contains the prompt and documentation needed to regenerate the Progress List Upload Formatter app from the v1.4 Draft specification bundle.

## Files in this guide

### `llm-regeneration-prompt.md`

Use this as the main prompt for a future LLM build or regeneration session.

This prompt tells the LLM:

- The required reading order.
- The hard technical constraints.
- The required file tree.
- The most important v1.4 Draft behavior changes.
- The validation checklist to run before calling the app complete.

Use this prompt together with the full spec bundle.

---

## Recommended files to attach with the prompt

Attach the full v1.4 Draft spec bundle, including:

```text
PRD.md
architecture.md
design.md
updatelog.md
runtime-data.md
picklists.json
features/01-upload.md
features/02-mapping.md
features/03-data-confirmation.md
features/04-campaign-settings.md
features/05-review.md
features/06-export.md
features/07-validation.md
features/08-teams.md
features/09-ui-stability.md
```

If the LLM allows only a limited number of attachments, prioritize in this order:

1. `updatelog.md`
2. `PRD.md`
3. `architecture.md`
4. `design.md`
5. `features/04-campaign-settings.md`
6. `features/05-review.md`
7. `features/07-validation.md`
8. `runtime-data.md`
9. `picklists.json`

---

## What each spec file is for

### `updatelog.md`

The most important file to read first.

This file records the known regressions, bug fixes, and version-to-version deltas. It prevents a future regeneration from reintroducing problems that were already discovered during testing.

Key items captured there include:

- v1.3 wizard changes.
- Conditional Step 3.
- Low-confidence fuzzy matching behavior.
- Teams embedding.
- Export with Errors.
- v1.4 Draft changes such as removing `Lead Source - Initial`, Lead Owner ID validation, and Step 5 green resolved rows.

### `PRD.md`

The product requirements document.

This file defines:

- The business purpose.
- User journey.
- Wizard steps.
- Output schema.
- Required fields.
- Functional requirements.
- Acceptance criteria.

Use this as the source of truth for what the app must do.

### `architecture.md`

The technical implementation blueprint.

This file defines:

- The exact app file tree.
- Which modules exist.
- What each module owns.
- No-NPM/no-build constraints.
- Router scroll/focus preservation requirements.
- Teams integration expectations.
- Validation and export responsibilities.

Use this as the source of truth for how the app should be built.

### `design.md`

The UI and UX specification.

This file defines:

- The Progress visual system.
- Layout expectations.
- Campaign Settings card layout.
- Review table behavior.
- Header behavior.
- CSS organization rules.

Use this as the source of truth for how the app should look and behave visually.

### `runtime-data.md`

The runtime configuration and data contract.

This file explains:

- How `picklists.json` is loaded.
- Required root keys.
- Picklists used in Step 4.
- Column synonym expectations.
- Country and State alias requirements.

Use this as the source of truth for data-driven configuration.

### `picklists.json`

The runtime data file used by the app.

This file contains:

- Picklist values.
- Column synonyms for mapping.
- Country aliases.
- State aliases.

The app should load this file from the project root at runtime. Future picklist changes should not require code changes.

---

## What each feature file is for

### `features/01-upload.md`

Focuses only on upload behavior.

Use it to confirm file picker, drag/drop, multi-file handling, parsing, and MAL/MQL scanning after parse.

### `features/02-mapping.md`

Focuses only on column mapping.

Use it to confirm fuzzy matching behavior, Low-confidence suggestions, synonym usage, and foreign-language header handling.

### `features/03-data-confirmation.md`

Focuses only on Step 3.

Use it to confirm conditional Step 3 behavior, required partial-field confirmation, MAL/MQL confirmation, and State blanking notices.

### `features/04-campaign-settings.md`

Focuses only on Step 4.

Use it to confirm grouped card layout, picklists, hidden fully-populated fields, SFDC Campaign ID validation, Lead Owner ID validation, Manual Lead Assignment behavior, and MQL/MAL exclusivity.

### `features/05-review.md`

Focuses only on Step 5.

Use it to confirm issue-row tracking, green resolved rows, Email Address column order, inline editing, Export with Errors, and the rule that `render()` must not call `store.set()`.

### `features/06-export.md`

Focuses only on export behavior.

Use it to confirm CSV/XLSX download, filename rules, 36-column output, Country/State normalization, State blanking, and removal of `Lead Source - Initial`.

### `features/07-validation.md`

Focuses only on validation rules.

Use it to confirm required fields, email format, SFDC Campaign ID length, Lead Owner ID length, Country/State resolution, duplicate detection, and MQL/MAL exclusivity.

### `features/08-teams.md`

Focuses only on Microsoft Teams behavior.

Use it to confirm Teams SDK guarded initialization, standalone browser fallback, theme following, and manifest requirements.

### `features/09-ui-stability.md`

Focuses only on UI stability.

Use it to confirm scroll preservation, focus preservation, caret preservation, and stable deterministic element IDs.

---

## Recommended regeneration workflow

1. Start a new LLM chat.
2. Upload the v1.4 Draft spec bundle and `picklists.json`.
3. Paste `llm-regeneration-prompt.md` as the prompt.
4. Ask the LLM to confirm it has read `updatelog.md` first.
5. Ask the LLM to generate the app files in the exact order from `architecture.md`.
6. Require `node --check` results before accepting the generated app.
7. Run a browser smoke test using the acceptance criteria in `PRD.md`.

---

## Important reminders

- Do not allow the LLM to add NPM, React, TypeScript, Vite, Tailwind, or any build tooling.
- Do not allow the LLM to add a backend.
- Do not allow the LLM to re-add `Lead Source - Initial`.
- Do not allow one-off CSS files like `hotfix.css`.
- Do not accept a Step 5 implementation that removes rows immediately after fixing them; resolved rows should turn green and remain visible.
- Do not accept a Step 5 implementation where Email Address is buried after many columns.
