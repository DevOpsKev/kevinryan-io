# Project Constitution

> kevinryan.io — Professional Portfolio Website
> Last amended: 2025-01-28

This constitution establishes the non-negotiable principles governing all specification, planning, and implementation for this project. All AI agents and human contributors MUST adhere to these articles.

---

## Article I: Project Identity

### Section 1.1: Purpose
This site exists to establish professional credibility, attract B2B consulting clients, and showcase expertise in MLOps, platform engineering, and EU AI Act compliance.

### Section 1.2: Target Audience
- CTOs and engineering leaders
- Compliance officers
- Enterprise decision-makers

Content and design decisions MUST respect their time and intelligence.

---

## Article II: Technology Stack (NON-NEGOTIABLE)

### Section 2.1: Core Framework
```
Framework:        Next.js 16 (App Router)
Language:         TypeScript (strict mode)
UI Library:       React 19
Styling:          Tailwind CSS 4 + DaisyUI
Package Manager:  pnpm
Node Version:     20+
```

### Section 2.2: Build & Deploy
```
Output:           Static export (output: 'export')
Hosting:          GitHub Pages
CI/CD:            GitHub Actions
Branch Strategy:  main = production
```

### Section 2.3: Dependency Policy
- Every dependency MUST justify its inclusion
- Audit quarterly; remove unused packages
- Prefer native browser APIs over polyfills
- Maximum bundle size target: < 100KB initial JS

---

## Article III: Architecture Principles

### Section 3.1: Static-First (NON-NEGOTIABLE)
All pages MUST be statically exportable. No server-side runtime dependencies.

```
ALLOWED:          Static generation, client-side hydration
PROHIBITED:       Server components requiring runtime, API routes, middleware
```

### Section 3.2: Progressive Enhancement
Core content MUST be accessible without JavaScript. Interactive features enhance but do not gate content.

### Section 3.3: Modularity
```
components/       Reusable UI components (one component per file)
app/              Next.js App Router pages and layouts
public/           Static assets only
lib/              Shared utilities (if needed)
```

No component shall exceed 200 lines. Extract sub-components when approaching this limit.

---

## Article IV: Code Standards (NON-NEGOTIABLE)

### Section 4.1: TypeScript Configuration
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

The `any` type is PROHIBITED except in explicitly documented escape hatches.

### Section 4.2: Linting & Formatting
- ESLint MUST pass before merge
- Pre-commit hooks enforce standards via `pre-commit`
- No `eslint-disable` without inline justification comment

### Section 4.3: Naming Conventions
```
Components:       PascalCase (SiteHeader.tsx)
Utilities:        camelCase (formatDate.ts)
Constants:        SCREAMING_SNAKE_CASE
CSS Classes:      Tailwind utilities only (no custom CSS unless unavoidable)
```

---

## Article V: Testing & Quality Gates

### Section 5.1: Build Gate (NON-NEGOTIABLE)
```bash
pnpm build        # MUST complete without errors
pnpm lint         # MUST pass with zero warnings
```

No feature merges to `main` until both gates pass.

### Section 5.2: Accessibility
- All images MUST have `alt` attributes
- Interactive elements MUST be keyboard accessible
- Color contrast MUST meet WCAG AA minimum

### Section 5.3: Performance Targets
```
Lighthouse Performance:   > 90
Lighthouse Accessibility: > 95
First Contentful Paint:   < 1.5s
Largest Contentful Paint: < 2.5s
```

---

## Article VI: Content Principles

### Section 6.1: Voice
Direct, conversational, technically confident. No corporate jargon. No buzzwords.

### Section 6.2: Scope Boundaries
```
THIS SITE IS:                     THIS SITE IS NOT:
- Portfolio & credibility         - A blog platform (use Substack/LinkedIn)
- Contact gateway                 - Comprehensive CV
- Service overview                - Technology showcase for its own sake
```

### Section 6.3: Freshness
Stale information erodes trust. Outdated content MUST be updated or removed within 30 days of becoming inaccurate.

---

## Article VII: Operational Philosophy

### Section 7.1: Jedi DevOps (NON-NEGOTIABLE)
Maximum impact with minimum maintenance burden. Every architectural choice MUST justify its operational cost.

```
PREFER:           Static hosting, managed services, zero-config deployments
AVOID:            Self-hosted infrastructure, custom build pipelines, runtime dependencies
```

### Section 7.2: Ship Over Perfect
A working deployment today beats a perfect deployment next month. The site MUST always be in a deployable state.

### Section 7.3: Observability
- Deployment status visible in GitHub Actions
- No silent failures; errors MUST surface in CI logs

---

## Article VIII: Security & Privacy

### Section 8.1: Data Collection
No analytics, tracking, or cookies without explicit disclosure. Current policy: zero client-side tracking.

### Section 8.2: Dependencies
- No packages with known vulnerabilities (audit via `pnpm audit`)
- Pin major versions; review before upgrading

---

## Article IX: Governance

### Section 9.1: Constitutional Supremacy
This constitution supersedes all other project documentation. Conflicts resolve in favor of constitutional principles.

### Section 9.2: Amendment Process
Modifications to this constitution require:
1. Explicit documentation of rationale
2. Assessment of impact on existing implementations
3. Update to "Last amended" date

### Section 9.3: Deviation Protocol
Temporary deviations MUST be:
- Documented inline with `// DEVIATION: [reason]`
- Tracked in a GitHub issue for resolution
- Resolved within 2 sprint cycles

---

## Appendix A: Directory Structure

```
kevinryan-io/
├── .github/
│   └── workflows/
│       └── nextjs.yml          # Deployment pipeline
├── app/
│   ├── page.tsx                # Home page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles (Tailwind imports)
│   └── favicon.ico
├── components/
│   └── [ComponentName].tsx     # One component per file
├── public/
│   └── [static assets]
├── .pre-commit-config.yaml
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── constitution.md             # This file
```

---

## Appendix B: Quick Reference

### Gates Checklist
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] No TypeScript errors
- [ ] All images have alt text
- [ ] No new dependencies without justification

### Prohibited Patterns
- `any` type without justification
- `eslint-disable` without inline comment
- Custom CSS when Tailwind suffices
- Server-side runtime dependencies
- Analytics/tracking without disclosure

---

*This constitution is a living document. It evolves through deliberate amendment, not drift.*
