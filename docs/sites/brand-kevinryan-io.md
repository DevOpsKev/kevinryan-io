---
title: "brand.kevinryan.io"
description: Architecture for the brand guidelines site — a static HTML page with no build step.
---

The brand guidelines site at <a href="https://brand.kevinryan.io" target="_blank" rel="noopener noreferrer">brand.kevinryan.io</a> documents the visual identity for Kevin Ryan & Associates. It is a single-page static HTML site with no build step and no JavaScript framework.

## Stack

| Technology | Role |
|------------|------|
| HTML5 | Page structure |
| CSS3 (custom properties) | Styling |
| Google Fonts | Typography (Archivo, Bebas Neue, Work Sans) |
| nginx | Static file serving |

No JavaScript frameworks, bundlers, or build tools are used.

## Content

The site presents brand guidelines including:

- Logo variations (transparent, light, dark, outlined, live text)
- Colour palette with hex values
- Typography scale and font pairings
- Usage guidelines

### Static Assets

```text
brand-kevinryan-io/
├── public/
│   ├── index.html
│   ├── kr-icon-transparent.svg
│   ├── kr-icon-light.svg
│   ├── kr-icon-dark.svg
│   ├── kevin-ryan-logo-dark-bg.svg
│   ├── kevin-ryan-logo-whitetext.svg
│   ├── kevin-ryan-logo-outlined.svg
│   ├── kevin-ryan-logo-live-text.svg
│   └── kr-brand-guidelines.md
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
└── package.json
```

## Styling

All styling is inline within `index.html` using CSS custom properties:

| Variable | Value | Usage |
|----------|-------|-------|
| `--accent` | Brand green | Accent colour |
| `--black` | Near-black | Text and backgrounds |
| `--white` | White | Contrast text |
| `--dark` | Dark grey | Surface colour |
| `--grey-*` | Grey scale | Borders and secondary elements |

Fonts are loaded from Google Fonts: Archivo (body), Bebas Neue (display), Work Sans (accent).

## Build and Serve

The site uses a single-stage Dockerfile — no build step is needed:

1. nginx 1.28.2 Alpine copies `public/` directly into the web root
1. `sed` replaces the `{{COMMIT_SHA}}` placeholder in `index.html` at Docker build time
1. Runs as non-root on port 8080

The `package.json` contains only Docker convenience scripts (`docker:build`, `docker:up`, `docker:down`) — no `build` or `dev` scripts.
