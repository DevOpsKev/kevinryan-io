# Copilot Instructions

## Context Location

Before responding to any request, read the following files in order:

1. `.specify/memory/constitution.md` — Non-negotiable project principles
2. `.specify/memory/skills/*.md` — Technical skill guides (if present)
3. `.specify/specs/` — Active feature specifications (if present)

These files define the project's architectural constraints, technology stack, and coding standards. All suggestions MUST comply with the constitution.

## Project Summary

This is a static Next.js 16 portfolio site using:
- TypeScript (strict mode)
- React 19
- Tailwind CSS 4 + DaisyUI
- pnpm
- Static export to GitHub Pages

## Key Constraints

- No server-side runtime dependencies
- No `any` type without justification
- No custom CSS when Tailwind suffices
- All pages must be statically exportable
- Maximum component size: 200 lines

## When Generating Code

1. Check constitution.md for technology stack requirements
2. Follow TypeScript strict mode conventions
3. Use Tailwind utilities for styling
4. Ensure static export compatibility
5. Include alt attributes on all images

## When Unclear

If a request conflicts with the constitution or specifications, flag the conflict rather than silently deviating.
