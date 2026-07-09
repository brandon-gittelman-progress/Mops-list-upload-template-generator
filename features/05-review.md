# Feature: Step 5 Review

Review tracks rows that have or had issues.

Behavior:

- Active error rows are red.
- Active warning rows are yellow.
- Resolved rows remain visible and turn green.
- Email Address is the first data column after Issue and Source.
- Continue enables when blocking errors are resolved.
- Export with Errors is available when errors remain.
- Step 5 render must not call store.set().
