# Feature: Microsoft Teams

The app supports Teams personal tab embedding.

## Requirements

- Guard Teams SDK initialization.
- Standalone mode must not hang or render a blank page.
- Apply Teams default/dark/contrast theme.
- Hide manual theme toggle inside Teams.
- Production hosting must deliver frame-ancestors CSP as an HTTP header.
