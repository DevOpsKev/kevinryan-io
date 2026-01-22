<!--
Sync Impact Report - Constitution v1.0.1 Update
================================================
Version change: 1.0.0 → 1.0.1 (PATCH: Governance clarifications and process alignment)
Modified principles: None (clarified governance procedures)
Added sections: Enhanced governance procedures and template alignment requirements
Removed sections: None
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution check section aligns
  ✅ .specify/templates/spec-template.md - User story format aligns with quality standards
  ✅ .specify/templates/tasks-template.md - Task organization aligns with component modularity
  ✅ .claude/commands/*.md - All command files maintain consistency
Follow-up TODOs: None - all placeholders resolved
Date: 2026-01-22
-->

# kevinryan.io Constitution

## Core Principles

### I. Static-First Architecture
All features must be compatible with static site generation and GitHub Pages hosting. No server-side functionality or dynamic APIs that require runtime processing. Components must be client-side compatible and work without Node.js runtime dependencies.

### II. Performance & Accessibility (NON-NEGOTIABLE)
Every page must achieve optimal Core Web Vitals scores and WCAG 2.1 AA accessibility compliance. Mobile-first responsive design is mandatory. Images must be optimized for static hosting with appropriate alt text and proper sizing.

### III. Professional Standards
Code must maintain TypeScript strict mode compliance with zero type errors. All commits must pass pre-commit hooks including trailing whitespace removal, end-of-file fixing, YAML validation, and large file detection. ESLint rules must be followed without exceptions.

### IV. Component Modularity
React components must be self-contained, reusable, and follow the single responsibility principle. Each component should have clear props interfaces and be independently testable. Use Tailwind CSS utility classes with DaisyUI component patterns for consistency.

### V. Automated Quality Assurance
All changes must pass automated checks before deployment. Pre-commit hooks enforce code quality standards. GitHub Actions deployment pipeline must successfully build and deploy without manual intervention. Build failures block deployment.

## Technology Standards

The stack consists of Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS 4, and DaisyUI. All dependencies must be managed via pnpm workspace configuration. Node.js v20+ is required for development. Static export mode is mandatory for GitHub Pages compatibility.

## Development Workflow

Changes are deployed automatically to GitHub Pages via GitHub Actions on push to main branch. Pre-commit hooks run locally to catch issues before commit. The build process generates static files in the `out/` directory. Development server runs on localhost:3000 with hot reloading.

## Governance

This constitution supersedes all other development practices and is enforced through the speckit specification process. All feature development must:

- Begin with constitution compliance check in plan templates
- Follow the spec → plan → tasks → implement workflow
- Pass automated quality gates (pre-commit hooks, TypeScript compilation, ESLint)
- Maintain template synchronization when constitutional principles change
- Document architectural decisions that impact static export compatibility

**Amendment Process**: Changes require semantic versioning (MAJOR for breaking principles, MINOR for new principles, PATCH for clarifications), template synchronization validation, and updated ratification date.

**Compliance Review**: All pull requests must verify adherence to Static-First Architecture, Performance & Accessibility standards, Professional Standards, Component Modularity, and Automated Quality Assurance principles.

**Version**: 1.0.1 | **Ratified**: 2026-01-22 | **Last Amended**: 2026-01-22
