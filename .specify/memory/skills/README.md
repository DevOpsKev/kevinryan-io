# Skills Index

This directory contains technical skill guides for AI coding agents working on this project.

## Available Skills

| Skill | File | Use When |
|-------|------|----------|
| Next.js Static Export | `nextjs-static.md` | Working with pages, layouts, routing |
| Tailwind + DaisyUI | `tailwind-daisyui.md` | Adding or modifying styles |
| TypeScript Strict | `typescript-strict.md` | Writing any TypeScript code |
| React Components | `react-components.md` | Creating or editing components |
| GitHub Pages Deploy | `github-pages.md` | CI/CD, deployment, build issues |

## Reading Order

For new agents or first-time context:

1. `../constitution.md` — Non-negotiable project principles
2. `typescript-strict.md` — Language constraints
3. `nextjs-static.md` — Framework constraints
4. `react-components.md` — Component patterns
5. `tailwind-daisyui.md` — Styling approach
6. `github-pages.md` — Deployment model

## Quick Reference

**Stack:** Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS 4 · DaisyUI · pnpm

**Key Constraints:**
- Static export only (`output: 'export'`)
- No server-side runtime
- No `any` type without justification
- 200 line max per component
- Tailwind utilities only (no custom CSS)
