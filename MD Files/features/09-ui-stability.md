# Feature: UI Stability

The router must preserve:

- Scroll position.
- Focused element.
- Caret position when supported.

Only wizard step transitions may scroll to top.

Every form control needs a deterministic stable ID.

State changes from Review edits, Delete Row, Mapping changes, and Keep Field selection must not cause unnecessary scroll jumps.
