# Technical Plan: Responsive Navigation Menu

> Branch: `001-responsive-menu`
> Date: 2025-01-28
> Spec: [spec.md](./spec.md)

## Summary

Implement a responsive navigation header component using DaisyUI's navbar pattern with mobile drawer, adhering to project constitution constraints (static export, Tailwind-only styling, TypeScript strict mode).

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component location | `components/SiteHeader.tsx` | Matches existing project structure |
| Styling | DaisyUI navbar + Tailwind utilities | Constitution: no custom CSS |
| Mobile pattern | DaisyUI dropdown | Simpler than drawer, no JS state needed for basic version |
| State management | React useState | Client component for toggle only |
| Routing | Next.js Link | Internal links; `<a>` for external |

## Architecture

### Component Structure

```
components/
└── SiteHeader.tsx    # Single file, under 200 lines
```

No sub-components needed for this scope. If complexity grows, extract `NavLink.tsx`.

### Data Model

```typescript
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
```

### Component API

```typescript
// No props required - self-contained component
export function SiteHeader(): JSX.Element
```

## Implementation Details

### Desktop Layout (≥768px)

```tsx
<header className="navbar bg-base-100">
  <div className="flex-1">
    {/* Brand/Home link */}
  </div>
  <nav className="hidden md:flex">
    <ul className="menu menu-horizontal px-1">
      {/* Nav items */}
    </ul>
  </nav>
</header>
```

### Mobile Layout (<768px)

```tsx
<header className="navbar bg-base-100">
  <div className="flex-1">
    {/* Brand/Home link */}
  </div>
  <div className="dropdown dropdown-end md:hidden">
    <button tabIndex={0} aria-label="Open menu" aria-expanded={isOpen}>
      {/* Hamburger icon */}
    </button>
    <ul className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
      {/* Nav items */}
    </ul>
  </div>
</header>
```

### Link Rendering

```tsx
// Internal link
<Link href={item.href} className="...">
  {item.label}
</Link>

// External link
<a
  href={item.href}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  {item.label}
  <ExternalLinkIcon className="w-4 h-4 ml-1" aria-hidden="true" />
</a>
```

### External Link Icon

Use inline SVG to avoid additional dependencies:

```tsx
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}
```

### Hamburger Icon

```tsx
function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}
```

## Styling Specifications

### Color Classes

| Element | Class | Notes |
|---------|-------|-------|
| Header background | `bg-base-100` | Respects theme |
| Link default | `text-base-content` | Respects theme |
| Link hover | `hover:text-primary` | Brand accent |
| Link active | `text-primary font-semibold` | Current page |
| External icon | `text-base-content/60` | Subtle indicator |

### Spacing

| Element | Class |
|---------|-------|
| Header padding | `px-4` |
| Nav item gap | `gap-2` |
| Mobile menu padding | `p-2` |

### Transitions

```tsx
className="transition-colors duration-200"
```

## Accessibility Implementation

### ARIA Attributes

```tsx
// Mobile toggle button
<button
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
>

// Mobile menu
<ul id="mobile-menu" role="menu">
  <li role="none">
    <a role="menuitem">...</a>
  </li>
</ul>
```

### Focus Management

- DaisyUI dropdown handles focus automatically
- Visible focus ring via Tailwind: `focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Move between links |
| Enter/Space | Activate link or toggle |
| Escape | Close mobile menu (DaisyUI default) |

## File Dependencies

### Imports Required

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
```

### No New Dependencies

This implementation uses only:
- Next.js (existing)
- React (existing)
- DaisyUI classes (existing)
- Tailwind utilities (existing)

## Integration

### Layout Integration

In `app/layout.tsx`:

```tsx
import { SiteHeader } from '@/components/SiteHeader'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
```

## Testing Checklist

### Manual Verification

- [ ] Desktop: All 4 links visible
- [ ] Desktop: Hover states work
- [ ] Desktop: Active state shows on current page
- [ ] Mobile: Hamburger visible, links hidden
- [ ] Mobile: Tap hamburger opens menu
- [ ] Mobile: All 4 links in dropdown
- [ ] Mobile: Tap outside closes menu
- [ ] External links open new tab
- [ ] External links show icon
- [ ] Keyboard: Tab through all links
- [ ] Keyboard: Escape closes mobile menu
- [ ] Screen reader: Announces menu state

### Build Verification

```bash
pnpm build  # Must pass
pnpm lint   # Must pass
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| DaisyUI dropdown JS not loading | Links still render; graceful degradation |
| Layout shift from menu | Fixed height header, no dynamic content |
| External icon missing on SSR | Inline SVG, no external dependencies |

---

*Task breakdown in `tasks.md`.*
