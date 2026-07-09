# UI / UX Design Specification

## Progress List Upload Formatter

**Version:** v1.4 Draft

---

## 1. Design Principles

- Preserve the signed-off Progress-branded layout.
- Do not redesign without asking.
- Avoid adding one-off stylesheet files.
- Keep UI stable under state changes.
- Prioritize clarity for non-technical marketing users.

---

## 2. Global Layout

- Sticky navy header.
- 6-step indicator.
- Centered content area.
- Sticky navigation footer.
- Progress-branded color tokens.

Header buttons must be readable on navy background:

- White text.
- Light border.
- Clear focus state.

Start Over must use confirmation before clearing data.

---

## 3. Step 4 Campaign Settings Layout

The signed-off Step 4 layout is:

1. Full-width Campaign Identification card.
2. Two-column lower card area.
3. Card sections:
   - Campaign Identification
   - Categorization
   - UTM Parameters
   - Lead Routing
   - Marketing Ops

Campaign Identification fields:

- Campaign Source
- SFDC Campaign ID
- Last Response Date

SFDC Campaign ID character count appears inline in the label row as `0/18`, not below the input.

Lead Owner ID also shows an inline `0/18` count.

---

## 4. Picklists

The following Step 4 fields render as dropdowns sourced from `picklists.json`:

- Product
- Lead Source - Most Recent
- Call to Action
- Target Channel Type
- Campaign Member Status
- utm_medium

`Lead Source - Initial` must not render.

---

## 5. Checkboxes

Checkboxes must be normal 22px controls aligned left with labels.

Force MQL and Force MAL are mutually exclusive.

Manual Lead Assignment auto-checks when Lead Owner ID is populated.

---

## 6. Step 5 Review UX

The review page tracks rows that have or had issues.

States:

- Error rows: red.
- Warning rows: yellow.
- Resolved rows: green.

Resolved rows do not disappear. The issue cell shows:

```text
Resolved
This row is now valid.
```

Column order starts with:

1. Issue
2. Source
3. Email Address
4. Last Response Date
5. First Name
6. Last Name
7. Company Name
8. Country
9. Product
10. SFDC Campaign ID
11. Lead Owner ID

Additional issue columns may appear before the standard context fields when needed, but Email Address should remain the first standard data column.

---

## 7. CSS Organization

Do not add:

```text
hotfix.css
header-hotfix.css
layout-hotfix.css
```

Put styles in existing files:

- `tokens.css` for tokens/theme values.
- `base.css` for global reset/layout primitives.
- `components.css` for header/buttons/shared UI.
- `steps.css` for wizard step-specific layout.
