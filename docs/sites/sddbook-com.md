---
title: "sddbook.com"
description: Architecture for the SDD Book site — a static HTML page with no build step.
---

The SDD Book site at <a href="https://sddbook.com" target="_blank" rel="noopener noreferrer">sddbook.com</a> promotes "Spec Driven Development — AI Native Software Engineering". It is a single-page static HTML site with no build step and no JavaScript framework.

## Stack

| Technology | Role |
|------------|------|
| HTML5 | Page structure |
| CSS3 (custom properties) | Styling |
| Google Fonts | Typography (Alfa Slab One, Inter, IBM Plex Mono) |
| nginx | Static file serving |

## Content

A single `index.html` presenting the book with a light-themed hero section, content summary, and call-to-action.

### Files

```text
sddbook-com/
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
| `--red` | Red | Primary accent |
| `--black` | Near-black | Text |
| `--grey-bg` | Light grey | Page background |
| `--off-white` | Off-white | Card backgrounds |
| `--slab` | Alfa Slab One | Display headings |
| `--sans` | Inter | Body text |
| `--mono` | IBM Plex Mono | Code and technical text |

The design uses a light colour scheme with a bold slab-serif display font for an editorial book-promotion aesthetic.

## Build and Serve

Single-stage Dockerfile:

1. nginx 1.28.2 Alpine copies `public/` directly into the web root
1. `sed` replaces `{{COMMIT_SHA}}` in `index.html` at Docker build time
1. Runs as non-root on port 8080
