# Progress List Upload Formatter — Updated Specification Bundle v1.5 Draft

This bundle contains the updated Markdown specification files for the Progress List Upload Formatter after the latest app testing, design system update, and feature changes.

## Version

- Previous spec bundle: v1.4 Draft
- Current bundle: v1.5 Draft
- Updated for:
  - Progress Design System guide from UX
  - Step 2 `Keep field - add to export`
  - Step 5 `Delete Row`
  - Review page tracked/resolved row behavior
  - Lead Source - Initial removal
  - Lead Owner ID 18-character validation
  - No separate hotfix CSS files

## Recommended reading order for future regeneration

1. `updatelog.md`
2. `PRD.md`
3. `architecture.md`
4. `design.md`
5. `design/progress-design-system.md`
6. `runtime-data.md`
7. Every file in `features/`, in numeric order
8. `llm-regeneration-prompt.md`
9. `picklists.json`, if available

## File list

```text
README.md
PRD.md
architecture.md
design.md
runtime-data.md
updatelog.md
llm-regeneration-prompt.md
design/progress-design-system.md
features/01-upload.md
features/02-mapping.md
features/03-data-confirmation.md
features/04-campaign-settings.md
features/05-review.md
features/06-export.md
features/07-validation.md
features/08-teams.md
features/09-ui-stability.md
features/10-brand-design-system.md
```

## Important implementation constraints

- No NPM.
- No build step.
- Vanilla HTML, CSS, and browser ES modules only.
- No separate `hotfix.css` files.
- Every `.js` file must pass `node --check`.
- Preserve the accepted workflow and do not redesign beyond applying the Progress Design System.
