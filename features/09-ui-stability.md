# Feature: UI Stability

The app re-renders frequently, so the router must preserve:

- Scroll position.
- Focused element.
- Caret position when supported.

Do not scroll to top except for wizard step transitions.

Every form control needs a deterministic stable ID.
