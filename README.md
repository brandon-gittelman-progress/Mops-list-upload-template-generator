# Progress List Upload Formatter — Spec Bundle v1.4 Draft

This bundle updates the Progress List Upload Formatter specifications after live testing of the v1.3 regenerated app.

## Recommended use with a future LLM

Use `llm-build-prompt.md` as the primary prompt and attach the entire spec bundle.

The canonical files are:

- `PRD.md` — product requirements and acceptance criteria.
- `architecture.md` — file tree, module responsibilities, data flow, and hard implementation rules.
- `design.md` — visual/UI/UX rules.
- `updatelog.md` — change history and known regression fixes.
- `runtime-data.md` — expectations for `picklists.json` and runtime configuration.

Feature-specific files in `features/` are intentionally split so a future LLM can reason about each area without losing detail.

## Version

- Previous spec: v1.3
- This bundle: v1.4 Draft
- Reason: live testing after v1.3 regeneration introduced additional accepted requirements and bug fixes.

## Major v1.4 Draft deltas

1. `Lead Source - Initial` is removed entirely from UI, validation, output schema, and export files.
2. Template output is now 36 columns.
3. `Lead Owner ID`, when present, must be exactly 18 characters.
4. Step 5 Review shows tracked issue rows; fixed rows turn green instead of disappearing.
5. Step 5 Review puts `Email Address` as the first data column after Issue/Source.
6. Step 4 Campaign Settings restores prior grouped layout and picklists.
7. Step 4 `Force MQL` and `Force MAL` are mutually exclusive.
8. Header Start Over clears workflow state but preserves loaded picklists and Teams context.
9. No separate `hotfix.css` files are allowed; CSS changes belong in existing spec files.
