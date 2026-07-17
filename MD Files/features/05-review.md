# Feature: Step 5 Review

Review tracks rows that have or had issues.

## Behavior

- Active error rows are red.
- Active warning rows are yellow.
- Resolved rows remain visible and turn green.
- Email Address is the first data column after Issue and Source.
- Kept fields appear after standard context columns when present.
- Continue enables when blocking errors are resolved or deleted.
- Export with Errors is available when errors remain.
- Step 5 render must not call `store.set()`.

## Delete Row

Each tracked issue row has a Delete Row action.

- Clicking Delete Row prompts for confirmation.
- Confirmed deletion excludes the row from validation.
- Confirmed deletion excludes the row from export.
- Deleted rows disappear from Review.

Primary use case: removing one duplicate record from a duplicate Email + Product error.
