# Feature Specification: Responsive Navigation Menu

> Branch: `001-responsive-menu`
> Created: 2025-01-28
> Status: Ready for Planning

## Overview

Add a responsive navigation menu to kevinryan.io that provides consistent access to site sections and external projects across all device sizes.

## Problem Statement

The current site lacks navigation. Users have no persistent way to access key pages or discover related projects (AI Immigrants book, SpecMCP, Distributed Equity).

## User Stories

### US-001: Mobile Navigation
**As a** mobile visitor
**I want** to access a menu that doesn't obstruct content
**So that** I can navigate the site without losing context

**Acceptance Criteria:**
- Menu is hidden by default on mobile
- Tap target opens the menu
- Menu can be dismissed easily
- Current page is indicated
- External links are clearly marked

### US-002: Desktop Navigation
**As a** desktop visitor
**I want** to see navigation options without extra clicks
**So that** I can quickly move between sections

**Acceptance Criteria:**
- Navigation links are visible without interaction
- Current page is visually distinguished
- Links have clear hover states
- External links open in new tab

### US-003: Keyboard Navigation
**As a** keyboard-only user
**I want** to navigate the menu using keyboard controls
**So that** I can access all site sections without a mouse

**Acceptance Criteria:**
- All menu items are focusable via Tab
- Focus states are clearly visible
- Mobile menu can be opened/closed via keyboard
- Escape key closes mobile menu

## Functional Requirements

### FR-001: Menu Items

| Label | URL | Type |
|-------|-----|------|
| kevinryan.io | `/` | Internal |
| AI Immigrants | `/aiimmigrants` | Internal |
| SpecMCP | `https://github.com/specmcp/specmcp` | External |
| Distributed Equity | `https://distributedequity.org` | External |

### FR-002: Breakpoint Behavior

| Viewport | Behavior |
|----------|----------|
| < 768px (mobile) | Collapsed menu with toggle button |
| ≥ 768px (desktop) | Expanded horizontal navigation |

### FR-003: External Link Behavior
- External links MUST open in new tab (`target="_blank"`)
- External links MUST include `rel="noopener noreferrer"`
- External links SHOULD have visual indicator (icon or styling)

### FR-004: Mobile Menu Toggle
- Toggle button visible on mobile viewports only
- Toggle button has accessible label (`aria-label`)
- Menu state reflected in `aria-expanded` attribute

### FR-005: Mobile Menu Panel
- Dismissible by toggle button, outside tap, or Escape key
- Smooth open/close transition

### FR-006: Active State
- Current page link visually distinguished
- Active state meets color contrast requirements

## Non-Functional Requirements

### NFR-001: Performance
- No additional dependencies beyond existing stack
- No layout shift on load (CLS = 0)

### NFR-002: Accessibility
- WCAG 2.1 AA compliant
- Color contrast at least 4.5:1
- Focus trap when mobile menu is open

## Out of Scope

- Dropdown/nested menus
- Search functionality
- Sticky/fixed positioning (future enhancement)
- Logo image (text only for now)

## Success Criteria

- [ ] All 4 links accessible on mobile within 2 taps
- [ ] All 4 links visible on desktop without interaction
- [ ] External links open in new tab
- [ ] Lighthouse accessibility score remains > 95
- [ ] Keyboard navigation fully functional

---

*Technical implementation details in `plan.md`. Task breakdown in `tasks.md`.*
