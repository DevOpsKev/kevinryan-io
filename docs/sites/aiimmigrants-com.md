---
title: "aiimmigrants.com"
description: Architecture for the AI Immigrants holding page — a static HTML site with no build step.
---

The AI Immigrants site at <a href="https://aiimmigrants.com" target="_blank" rel="noopener noreferrer">aiimmigrants.com</a> is a holding page for the "AI Immigrants — The Bloody Algos Are Here" project. It is a single-page static HTML site with no build step and no JavaScript framework.

## Stack

| Technology | Role |
|------------|------|
| HTML5 | Page structure |
| CSS3 (custom properties) | Styling |
| Google Fonts | Typography (Bebas Neue, Libre Baskerville, DM Sans, IBM Plex Mono) |
| nginx | Static file serving |

## Content

A single `index.html` with a dark-themed hero section presenting the project tagline and coming-soon messaging.

### Files

```text
aiimmigrants-com/
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
| `--black` | Near-black | Background |
| `--cream` | Warm white | Body text |
| `--rust` | Rust orange | Accent colour |
| `--steel` | Steel grey | Secondary text |
| `--serif` | Libre Baskerville | Body font |
| `--sans` | DM Sans | UI font |
| `--mono` | IBM Plex Mono | Code and technical text |

The design uses a dark colour scheme with serif typography for an editorial aesthetic.

## Build and Serve

Single-stage Dockerfile:

1. nginx 1.28.2 Alpine copies `public/` directly into the web root
1. `sed` replaces `{{COMMIT_SHA}}` in `index.html` at Docker build time
1. Runs as non-root on port 8080
