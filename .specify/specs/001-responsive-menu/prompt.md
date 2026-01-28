# Prompt: Implement Responsive Navigation Menu

## Instruction

Implement feature `001-responsive-menu` following the Spec-Driven Development process.

## Context Files

Read these files in order before writing any code:

1. `.specify/memory/constitution.md` — Project principles (NON-NEGOTIABLE)
2. `.specify/memory/skills/react-components.md` — Component patterns
3. `.specify/memory/skills/tailwind-daisyui.md` — Styling approach
4. `.specify/memory/skills/typescript-strict.md` — Type requirements
5. `.specify/specs/001-responsive-menu/spec.md` — Feature requirements
6. `.specify/specs/001-responsive-menu/plan.md` — Technical approach
7. `.specify/specs/001-responsive-menu/tasks.md` — Implementation steps

## Execution

1. **Read all context files** before generating any code
2. **Follow tasks.md sequentially** — complete each T-series task in order
3. **Verify against spec.md** — ensure all acceptance criteria are met
4. **Respect constitution.md** — no deviations without explicit justification

## Deliverables

- [ ] `components/SiteHeader.tsx` — Responsive navigation component
- [ ] Updated `app/layout.tsx` — SiteHeader integration
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes

## Constraints Reminder

- TypeScript strict mode — no `any` types
- Tailwind/DaisyUI only — no custom CSS
- Static export compatible — no server runtime
- Component under 200 lines
- One component per file

## Menu Items

| Label | URL | Type |
|-------|-----|------|
| kevinryan.io | `/` | Internal |
| AI Immigrants | `/aiimmigrants` | Internal |
| SpecMCP | `https://github.com/specmcp/specmcp` | External |
| Distributed Equity | `https://distributedequity.org` | External |

## Begin

Start with task T000: Read `.specify/memory/constitution.md`

Then proceed through all tasks in `tasks.md` sequentially until complete.
