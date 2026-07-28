---
id: 001-book-theme
title: The AI-Native Engineer, presentation theme
status: locked
version: 1.0.0
authority: this document
artefacts:
  - tokens.jsonc      # machine-readable token source
  - theme.css         # canonical implementation
  - theme-sheet.html  # rendered specimen, visual acceptance
---

## Intent

A single presentation theme for the online book, its PDF build and its EPUB build. Nord palette, Swiss International Style grid, developer register. The theme is consumed by generators. It must be describable without ambiguity, because every value in it will be reproduced by an agent rather than by a person with taste.

## Authority

`tokens.jsonc` is the source. `theme.css` is generated from or validated against it. `theme-sheet.html` is the visual acceptance artefact. If the three disagree, `tokens.jsonc` wins and the others are rebuilt.

## Behaviour

### Colour

- B1. Two colour layers exist. The raw Nord ramp is fixed. Semantic tokens alias into it. No component references a `nord*` value directly.
- B2. Themes switch on `html[data-theme]` with values `dark` and `light`. Both define every semantic token. The light theme is a distinct set of values, not an inversion.
- B3. `--accent` is the only colour used for interaction. Links, active states, focus rings, gauge fill, section markers.
- B4. `--ok`, `--warn`, `--danger`, `--info`, `--special` encode state and are used nowhere else.
- B5. Body text meets 7:1 contrast against its background. Muted text meets 4.5:1.
- B6. No sixth accent is introduced under any circumstances.

### Typography

- B7. Three families. Archivo for display, headings and UI names. IBM Plex Sans for reading body only. IBM Plex Mono for all structure: numbers, metadata, code, buttons, labels.
- B8. Twelve fixed type steps exist. Generated output uses those steps and no intermediate values.
- B9. Two steps are fluid and clamped: `display` and `h1`. All others are fixed.
- B10. Display tracking tightens as size grows and mono tracking opens as size shrinks, per the values in `tokens.jsonc`.
- B11. Uppercase is set in the mono face only. Display and body faces are never uppercased.
- B12. The heading map is `.t-display`, `.t-numeral`, `h1`, `h2`, `h3`, `h4`. No intermediate levels are created.
- B13. `h4` is a utility label outside the reading hierarchy. It never introduces reading content.
- B14. Reading measure is set by `.prose` from `--measure`. No other element sets a measure.

### Structure and surface

- B15. Border radius is zero everywhere.
- B16. There are no shadows, gradients, glows or glass effects. Depth is expressed with `--bg-sink` and hairlines.
- B17. Structural lines are 1px `--line`. Emphasis edges are 2px and appear only on active navigation markers, blockquotes and callout left edges.
- B18. Dashed borders appear on the empty state and nowhere else.
- B19. All spacing derives from the 8px scale in `tokens.jsonc`. Arbitrary pixel values are a defect.

### Components

- B20. Exactly three status pills exist, mapped to chapter state: published, drafting, outlined.
- B21. Callouts are `.callout > .callout-label + p`. Colour lives on the left edge and the label. The body stays neutral. Callouts carry no icons.
- B22. Code blocks are `figure.code > figcaption + pre`. The caption is required and holds a real file path on the left and the copy control on the right.
- B23. Syntax highlighting uses exactly five token classes. A highlighter producing more classes maps them down to these five.
- B24. Tables have no vertical rules, no zebra striping and no outer border. Numeric columns use `.num` with tabular figures.
- B25. Active navigation state is always a 2px accent left edge plus `--bg-sink`. Never a fill, never weight alone.
- B26. One primary button per view.

### Spine gauge

- B27. The spine gauge is the signature element. One per page.
- B28. It occupies a 44px column between the contents rail and the article, sticky below the top bar.
- B29. Fill height equals the scroll fraction of the article. Ticks mark section boundaries. The percentage is set vertically at the base.
- B30. The gauge and the top progress hairline read from the same scroll value and are never shown independently of each other.
- B31. The gauge is hidden below 900px and in print.

### Responsive and accessibility

- B32. At 1180px the on-this-page rail is removed. At 900px the gauge is removed and the contents rail becomes an overlay drawer.
- B33. Focus is visible as a 2px square accent ring at 3px offset.
- B34. All transitions and animations are suppressed under `prefers-reduced-motion`.
- B35. Nothing animates on entry. Motion responds to input only.
- B36. Keyboard bindings are as listed in `tokens.jsonc` under `a11y.keyboard`.

### Print

- B37. Print output drops the top bar, both rails, the gauge, the pager and all overlays.
- B38. Code figures do not break across pages. Headings do not break from the content that follows them.

## Non-goals

- N1. No component library or framework binding. The theme is plain CSS with custom properties, consumable from any renderer.
- N2. No dark and light auto-detection in this version. The switch is explicit and user controlled.
- N3. No icon set. Labels do the work icons would do.
- N4. No animation library.
- N5. No responsive type interpolation beyond the two clamped steps.

## Open

- O1. BLOCKING for the PDF build. Fonts are loaded from Google Fonts in the prototype. The Playwright pipeline needs woff2 files embedded as base64. Decide whether to self-host for web as well, which is the sovereignty-consistent answer and removes a third party request from every page load.
- O2. Reading position is held in memory only. Decide between `localStorage` with no account, or a sync endpoint. The free-to-read, no-email-wall positioning argues for `localStorage`.
- O3. EPUB cannot use custom properties reliably across readers. Decide whether to flatten tokens to literal values at build time for that target, or ship a reduced EPUB theme.
- O4. Chapter status currently lives in the content frontmatter. Confirm this rather than a separate manifest, so a chapter remains one file.

## Acceptance

The implementation is accepted when `theme-sheet.html` renders every component in both themes and all three measure settings without visual defect, and when no generated file violates a constraint listed in `tokens.jsonc` under `constraints`.
