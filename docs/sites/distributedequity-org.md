---
title: "distributedequity.org"
description: Architecture for the Distributed Equity site — a static HTML page with no build step.
---

The Distributed Equity site at <a href="https://distributedequity.org" target="_blank" rel="noopener noreferrer">distributedequity.org</a> presents "Distributed Equity — A License for the Age of AI". It is a single-page static HTML site with no build step and no JavaScript framework.

## Stack

| Technology | Role |
|------------|------|
| HTML5 | Page structure |
| CSS3 (custom properties, 12-column grid) | Styling and layout |
| Google Fonts | Typography (Barlow Condensed, Barlow, IBM Plex Mono) |
| nginx | Static file serving |

## Content

A single `index.html` presenting the Distributed Equity License (DEL) with a light-themed design using a 12-column CSS grid layout.

### Files

```text
distributedequity-org/
├── public/
│   └── index.html
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
└── package.json
```

## Styling

All styling is inline within `index.html` using CSS custom properties:

| Variable | Value | Usage |
|----------|-------|-------|
| `--orange` | Orange | Primary accent |
| `--black` | Near-black | Text |
| `--white` | White | Background |
| `--font-display` | Barlow Condensed | Display headings |
| `--font-body` | Barlow | Body text |
| `--font-mono` | IBM Plex Mono | Code and technical text |

The design uses a light colour scheme with a condensed display font and a 12-column grid for structured content layout.

## Build and Serve

Single-stage Dockerfile:

1. nginx 1.28.2 Alpine copies `public/` directly into the web root
1. `sed` replaces `{{COMMIT_SHA}}` in `index.html` at Docker build time
1. Runs as non-root on port 8080
