# Tasks: Responsive Navigation Menu

> Branch: `001-responsive-menu`
> Date: 2025-01-28
> Plan: [plan.md](./plan.md)

## Pre-Implementation

- [ ] **T000**: Read `.specify/memory/constitution.md`
- [ ] **T001**: Read `.specify/memory/skills/react-components.md`
- [ ] **T002**: Read `.specify/memory/skills/tailwind-daisyui.md`
- [ ] **T003**: Read `.specify/memory/skills/typescript-strict.md`

---

## Phase 1: Component Foundation

### T100: Create SiteHeader component file
**File:** `components/SiteHeader.tsx`

Create the component file with:
- `'use client'` directive (required for usePathname)
- TypeScript interfaces for NavItem
- NAV_ITEMS constant array
- Empty component shell

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  external: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'kevinryan.io', href: '/', external: false },
  { label: 'AI Immigrants', href: '/aiimmigrants', external: false },
  { label: 'SpecMCP', href: 'https://github.com/specmcp/specmcp', external: true },
  { label: 'Distributed Equity', href: 'https://distributedequity.org', external: true },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header>
      {/* TODO: Implement */}
    </header>
  )
}
```

**Acceptance:** File compiles with no TypeScript errors.

---

### T101: Add inline SVG icons
**File:** `components/SiteHeader.tsx`

Add helper components inside the file (before main component):

1. `HamburgerIcon` - 3 horizontal lines
2. `ExternalLinkIcon` - arrow pointing out of box

Both must:
- Accept optional `className` prop
- Include `aria-hidden="true"`
- Use `currentColor` for stroke

**Acceptance:** Icons render without errors.

---

## Phase 2: Desktop Navigation

### T200: Implement desktop header structure
**File:** `components/SiteHeader.tsx`

Add the header element with:
- DaisyUI `navbar` class
- `bg-base-100` background
- Container with `px-4`
- Flex container for brand and nav

```tsx
<header className="navbar bg-base-100 px-4">
  <div className="flex-1">
    {/* Brand */}
  </div>
  <nav className="hidden md:flex">
    {/* Desktop nav */}
  </nav>
</header>
```

**Acceptance:** Header visible with background color.

---

### T201: Add desktop navigation links
**File:** `components/SiteHeader.tsx`

Inside the `<nav>` element:
- Add `<ul>` with `menu menu-horizontal gap-2`
- Map over NAV_ITEMS
- Render internal links with `<Link>`
- Render external links with `<a>`

For each link:
- Base classes: `transition-colors duration-200`
- Hover: `hover:text-primary`
- Active state: `text-primary font-semibold` when `pathname === item.href`

**Acceptance:** Desktop shows all 4 links horizontally.

---

### T202: Add external link indicators
**File:** `components/SiteHeader.tsx`

For links where `external: true`:
- Add `target="_blank"`
- Add `rel="noopener noreferrer"`
- Append `<ExternalLinkIcon className="w-4 h-4 ml-1 inline" />`

**Acceptance:** External links show icon and open in new tab.

---

## Phase 3: Mobile Navigation

### T300: Add mobile menu toggle button
**File:** `components/SiteHeader.tsx`

Add dropdown container visible only on mobile:

```tsx
<div className="dropdown dropdown-end md:hidden">
  <button
    tabIndex={0}
    className="btn btn-ghost"
    aria-label="Open navigation menu"
  >
    <HamburgerIcon className="w-6 h-6" />
  </button>
  {/* Dropdown content next task */}
</div>
```

**Acceptance:** Hamburger icon visible on mobile, hidden on desktop.

---

### T301: Add mobile dropdown menu
**File:** `components/SiteHeader.tsx`

Inside the dropdown div, after the button:

```tsx
<ul
  tabIndex={0}
  className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow"
>
  {/* Map NAV_ITEMS here */}
</ul>
```

Map NAV_ITEMS with same link logic as desktop (T201, T202).

**Acceptance:** Tapping hamburger shows dropdown with all 4 links.

---

### T302: Ensure mobile menu dismissal
**File:** `components/SiteHeader.tsx`

DaisyUI dropdown handles this automatically. Verify:
- Clicking outside closes menu
- Pressing Escape closes menu
- Clicking a link closes menu

**Acceptance:** All three dismissal methods work.

---

## Phase 4: Integration

### T400: Add SiteHeader to root layout
**File:** `app/layout.tsx`

1. Import SiteHeader: `import { SiteHeader } from '@/components/SiteHeader'`
2. Add `<SiteHeader />` as first child of `<body>`

```tsx
<body>
  <SiteHeader />
  {children}
</body>
```

**Acceptance:** Header appears on all pages.

---

### T401: Verify active state on home page
**File:** N/A (manual test)

1. Navigate to `/`
2. Verify "kevinryan.io" link has active styling
3. Verify other links do not have active styling

**Acceptance:** Active state correctly indicates current page.

---

## Phase 5: Validation

### T500: Run lint check
**Command:** `pnpm lint`

Fix any ESLint errors or warnings.

**Acceptance:** `pnpm lint` exits with code 0.

---

### T501: Run build check
**Command:** `pnpm build`

Verify static export succeeds.

**Acceptance:** `pnpm build` exits with code 0, `out/` directory created.

---

### T502: Accessibility audit
**Tool:** Browser DevTools / axe extension

Check:
- [ ] All links have accessible names
- [ ] Color contrast passes
- [ ] Keyboard navigation works
- [ ] ARIA attributes correct

**Acceptance:** No critical or serious accessibility violations.

---

### T503: Cross-browser check
**Browsers:** Chrome, Firefox, Safari (if available)

Verify:
- [ ] Desktop layout correct
- [ ] Mobile layout correct
- [ ] Dropdown functions
- [ ] External links work

**Acceptance:** Consistent behavior across browsers.

---

## Completion Checklist

- [ ] All T-series tasks complete
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] Component under 200 lines
- [ ] No `any` types used
- [ ] No custom CSS added
- [ ] All links functional
- [ ] Accessible via keyboard
- [ ] Responsive breakpoint works

---

## Task Dependencies

```
T000-T003 (read skills)
    ↓
T100 → T101
    ↓
T200 → T201 → T202
    ↓
T300 → T301 → T302
    ↓
T400 → T401
    ↓
T500 → T501 → T502 → T503
```

**Parallelizable:** None (sequential implementation)

---

*Commit after completing each phase.*
