# UI / UX Design Specification

## Progress List Upload Formatter

**Version:** v1.5 Draft

This file describes app-specific UX rules. Use `design/progress-design-system.md` as the visual design system authority.

---

## 1. Design principles

- Preserve the accepted app workflow.
- Apply the Progress Design System without changing behavior.
- Prioritize clarity for field marketing users.
- Avoid hidden or ambiguous validation states.
- Never introduce one-off CSS files.
- Keep dense operational screens readable and scrollable.

---

## 2. Global layout

- Sticky dark navy header.
- Six-step wizard indicator.
- Centered content container with max width based on Col24 / 1170px guidance.
- Sticky navigation footer.
- 30px major gutters.

---

## 3. Buttons

Buttons follow the Progress Design System:

- Primary CTA: red `#EB0249`, hover `#B90138`, white text.
- Secondary CTA: blue `#054BFF`, hover `#0037CB`, white text.
- Ghost buttons: transparent with blue border.
- All buttons use uppercase text.
- Default medium button height is 43px.
- Border radius is 5px.

---

## 4. Step 2 Mapping UX

Each mapping row must clearly support three user choices:

1. Standard field mapping.
2. Unmapped.
3. Keep field - add to export.

When Keep Field is selected:

- Show a visible note explaining the source column will be appended to export.
- Show a KEEP tag or equivalent status label.
- Do not treat the kept field as a required template field.

---

## 5. Step 4 Campaign Settings UX

Campaign Settings uses grouped cards:

- Campaign Identification
- Categorization
- UTM Parameters
- Lead Routing
- Marketing Ops

Requirements:

- Full-width Campaign Identification card.
- Two-column lower card layout on desktop.
- Picklists render as dropdowns.
- Lead Source - Initial does not render.
- SFDC Campaign ID and Lead Owner ID show inline `0/18` counters.
- Force MQL and Force MAL are mutually exclusive.

---

## 6. Step 5 Review UX

Review must make errors understandable and actionable.

Requirements:

- Show rows that have or had issues.
- Red rows indicate active errors.
- Yellow rows indicate active warnings.
- Green rows indicate resolved rows.
- Resolved rows remain visible.
- Email Address is the first data column after Issue and Source.
- Kept fields can appear in the table and should be visibly identifiable as kept fields.
- Each tracked issue row has Delete Row.

### Delete Row UX

- Delete Row is shown in the Issue column.
- Clicking Delete Row requires confirmation.
- After confirmation, the source row disappears from Review.
- Deleted rows are not exported.

---

## 7. Review table UX

- Use sticky table header.
- Use sticky Issue column.
- Provide horizontal and vertical scroll container.
- Use table header background `#EEF5FF`.
- Use zebra striping for normal rows.
- Use brand semantic colors for error, warning, and resolved states.

---

## 8. CSS organization

Do not add:

```text
hotfix.css
header-hotfix.css
layout-hotfix.css
```

Use only:

```text
tokens.css
base.css
components.css
steps.css
```
