# Feature: Validation

Validation requirements:

- Required fields must be populated.
- Email format must be valid.
- SFDC Campaign ID must be exactly 18 characters.
- Lead Owner ID, when populated, must be exactly 18 characters.
- Country must resolve using aliases.
- State must resolve only when Country is United States or Canada.
- State for non-US/CA is a warning and blanked on export.
- Force MQL and Force MAL are mutually exclusive.
- Duplicate Email + Product is an error.
