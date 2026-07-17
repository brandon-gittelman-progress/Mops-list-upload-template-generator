# Progress List Upload Formatter v1.3

Static, client-only, no-NPM app for formatting Progress lead lists into the standardized Eloqua upload template.

## Run locally

```bash
python -m http.server 8080
```

Open http://localhost:8080/progress-list-upload/index.html.

## Deploy

Upload the full `progress-list-upload/` folder to static HTTPS hosting. No build step is required.

## Teams sideload

1. Replace `YOUR-HOST.example.com` in `teams/manifest.json` with your hosting domain.
2. Replace the placeholder manifest `id` with a UUID.
3. ZIP `teams/manifest.json`, `teams/color.png`, and `teams/outline.png`.
4. Upload the package in Teams Developer Portal or Teams Admin Center.
5. The tab loads `/index.html?in=teams` and follows Teams default/dark/contrast themes.

## Validation

```bash
for f in js/**/*.js js/*.js; do node --check "$f" || echo "FAIL: $f"; done
```

## Notes

- No package.json, npm, node_modules, bundler, backend, cookies, analytics, or telemetry.
- `picklists.json` controls picklists, country aliases, state aliases, and column synonyms.
