# CLAUDE.md

## Context Location

Before responding to any request, read the following files in order:

1. `.specify/memory/constitution.md` — Non-negotiable project principles
2. `.specify/memory/skills/*.md` — Technical skill guides
3. `.specify/specs/` — Active feature specifications (if present)

These files define the project's architectural constraints, technology stack, and coding standards. All suggestions MUST comply with the constitution.

## Project Summary

This is a static Next.js 16 portfolio site for Kevin Ryan (DevOps & AI Governance Consultant).

**Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4 + DaisyUI
- pnpm
- Static export to GitHub Pages

## Key Constraints

- No server-side runtime dependencies
- No `any` type without justification
- No custom CSS when Tailwind suffices
- All pages must be statically exportable
- Maximum component size: 200 lines
- One component per file

## Build Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Development server at localhost:3000
pnpm build      # Production build (static export to out/)
pnpm lint       # Run ESLint
```

## Directory Structure

```
kevinryan-io/
├── app/                    # Next.js App Router pages
├── components/             # React components (one per file)
├── public/                 # Static assets
├── .specify/memory/        # Constitution and skills
├── .github/workflows/      # CI/CD
└── out/                    # Build output (git-ignored)
```

## When Generating Code

1. Check `constitution.md` for technology stack requirements
2. Check relevant skill file in `.specify/memory/skills/`
3. Follow TypeScript strict mode conventions
4. Use Tailwind utilities for styling
5. Ensure static export compatibility
6. Include alt attributes on all images
7. Keep components under 200 lines

## Prohibited Patterns

- `any` type without inline justification comment
- `eslint-disable` without inline justification comment
- Custom CSS when Tailwind can achieve the same result
- Server components with runtime data fetching
- API routes, middleware, or server actions
- Inline styles (`style={{ }}`)
- Index as React key

## When Unclear

If a request conflicts with the constitution or specifications, flag the conflict rather than silently deviating. Ask for clarification.

## Pre-Commit Checklist

Before suggesting code is complete:

- [ ] `pnpm build` would pass
- [ ] `pnpm lint` would pass
- [ ] No TypeScript errors
- [ ] All images have alt text
- [ ] No new dependencies without justification
- [ ] Components under 200 lines
