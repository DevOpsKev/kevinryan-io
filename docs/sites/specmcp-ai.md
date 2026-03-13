---
title: "specmcp.ai"
description: Architecture for the SpecMCP site — a static HTML page with no build step.
---

The SpecMCP site at <a href="https://specmcp.ai" target="_blank" rel="noopener noreferrer">specmcp.ai</a> presents SpecMCP as "the coordination layer for multi-agent development". It is a single-page static HTML site with no build step and no JavaScript framework.

## Stack

| Technology | Role |
|------------|------|
| HTML5 | Page structure |
| CSS3 (custom properties) | Styling |
| Google Fonts | Typography (DM Sans, JetBrains Mono) |
| nginx | Static file serving |

## Content

A single `index.html` with a dark-themed design featuring grain texture overlays and ambient glow effects.

### Files

```text
specmcp-ai/
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
| `--bg` | Dark background | Page background |
| `--surface` | Surface colour | Card and section backgrounds |
| `--accent` | Green | Primary accent |
| `--orange` | Orange | Secondary accent |

The design uses DM Sans for body text and JetBrains Mono for code and technical terminology, with CSS-based grain overlays and ambient glow effects for visual depth.

## Build and Serve

Single-stage Dockerfile:

1. nginx 1.28.2 Alpine copies `public/` directly into the web root
1. `sed` replaces `{{COMMIT_SHA}}` in `index.html` at Docker build time
1. Runs as non-root on port 8080
