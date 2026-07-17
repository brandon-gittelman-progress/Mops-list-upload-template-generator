# LLM Regeneration Prompt — Progress List Upload Formatter v1.5 Draft

You are a senior front-end developer regenerating the Progress List Upload Formatter app from the attached specification bundle.

## Read files in this order

1. `updatelog.md`
2. `PRD.md`
3. `architecture.md`
4. `design.md`
5. `design/progress-design-system.md`
6. `runtime-data.md`
7. Every file in `features/`, in numeric order
8. `picklists.json`, if provided

## Hard rules

- No NPM.
- No package.json.
- No node_modules.
- No build step.
- No TypeScript.
- No framework.
- Vanilla HTML, CSS, and browser ES modules only.
- Every JS file must pass `node --check`.
- Do not create separate hotfix CSS files.
- Do not reintroduce Lead Source - Initial.

## Critical requirements

- Standard export schema is 36 columns.
- Lead Source - Initial is removed entirely.
- Lead Owner ID is optional but must be exactly 18 characters when present.
- Step 2 supports Keep Field, which appends original source columns to export.
- Step 5 supports Delete Row, which excludes rows from validation and export.
- Step 5 resolved rows remain visible and green.
- Email Address is first data column after Issue and Source.
- Export includes standard columns first, kept fields second.
- Deleted rows are not exported.
- Progress Design System from `design/progress-design-system.md` is the visual authority.

## Deliverable

Generate the complete app file tree defined in `architecture.md`.

Before completion, report:

1. File count.
2. `node --check` results.
3. Confirmation that no build tooling was added.
4. Confirmation that Lead Source - Initial is absent from standard output.
5. Confirmation that Keep Field and Delete Row are implemented.
