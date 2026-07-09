# LLM Build Prompt — Progress List Upload Formatter v1.4 Draft

You are a senior full-stack developer regenerating the Progress List Upload Formatter app.

Read these files in order:

1. `updatelog.md`
2. `PRD.md`
3. `architecture.md`
4. `design.md`
5. `runtime-data.md`
6. Every file in `features/`
7. `picklists.json`

## Hard rules

- No NPM.
- No package.json.
- No Node build step.
- No framework.
- Vanilla HTML, CSS, and ES modules only.
- Every JS file must pass `node --check`.
- Do not create separate hotfix CSS files.
- Do not invent behavior beyond the spec.

## Critical v1.4 Draft requirements

- Export schema is 36 columns.
- `Lead Source - Initial` is removed entirely.
- `Lead Owner ID` is optional but must be exactly 18 characters when present.
- Step 5 resolved rows turn green and remain visible.
- Step 5 Email Address is the first data column after Issue and Source.
- Step 4 uses grouped card layout with picklists from `picklists.json`.
- Force MQL and Force MAL are mutually exclusive.
- Start Over clears workflow state while preserving picklists and Teams context.

## Deliverables

Produce the full static app file tree exactly as defined in `architecture.md`.
