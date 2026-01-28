# Tasks: AI Immigrants Page

> Branch: `002-aiimmigrants-page`
> Date: 2025-01-28
> Plan: [plan.md](./plan.md)

## Pre-Implementation

- [ ] **T000**: Read `.specify/memory/constitution.md`
- [ ] **T001**: Read `.specify/memory/skills/react-components.md`
- [ ] **T002**: Read `.specify/memory/skills/tailwind-daisyui.md`
- [ ] **T003**: Read `.specify/memory/skills/nextjs-static.md`
- [ ] **T004**: Read `.specify/specs/002-aiimmigrants-page/copywriting.md`
- [ ] **T005**: Read `.specify/specs/002-aiimmigrants-page/design-guidelines.md`

---

## Phase 1: BookCover Component

### T100: Create BookCover component
**File:** `components/BookCover.tsx`

Create a reusable book cover component:

```typescript
interface BookCoverProps {
  className?: string
}

export function BookCover({ className = '' }: BookCoverProps) {
  return (
    <div
      className={`
        aspect-[2/3] w-64 md:w-72 lg:w-80
        bg-cover bg-center bg-base-300
        shadow-2xl rounded-sm
        ${className}
      `}
      style={{ backgroundImage: "url('/aiimmigrants-cover.png')" }}
      role="img"
      aria-label="AI Immigrants book cover"
    />
  )
}
```

**Notes:**
- No `'use client'` needed (no interactivity)
- `bg-base-300` serves as fallback until image exists
- Inline style is documented deviation (see design-guidelines.md)

**Acceptance:** Component renders without TypeScript errors.

---

## Phase 2: Page Structure

### T200: Create page file with metadata
**File:** `app/aiimmigrants/page.tsx`

Create the page file with Next.js metadata:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Immigrants: "The Bloody Algos Are Here!" | Kevin Ryan',
  description: 'A provocative exploration of AI ethics through the lens of immigration. Free to download in EPUB and PDF.',
  openGraph: {
    title: 'AI Immigrants: "The Bloody Algos Are Here!"',
    description: 'What if algorithms are just the latest scapegoat for problems we refuse to solve?',
    images: ['/aiimmigrants-cover.jpg'],
  },
}

export default function AIImmigrantsPage() {
  return (
    <main>
      {/* TODO: Implement */}
    </main>
  )
}
```

**Acceptance:** Page accessible at `/aiimmigrants` (blank content OK).

---

### T201: Add hero section structure
**File:** `app/aiimmigrants/page.tsx`

Add the hero section with two-column layout:

```tsx
import { BookCover } from '@/components/BookCover'

// Inside return:
<main>
  <section className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-16">
    <div className="max-w-6xl w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">

        {/* Book Cover */}
        <div className="flex-shrink-0">
          <BookCover />
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* TODO: Content sections */}
        </div>

      </div>
    </div>
  </section>
</main>
```

**Acceptance:** Two-column layout visible on desktop, stacked on mobile.

---

## Phase 3: Content Sections

### T300: Add headline and subhead
**File:** `app/aiimmigrants/page.tsx`

Inside the content div, add:

```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
  AI Immigrants
</h1>
<p className="text-xl md:text-2xl text-primary font-medium mt-2">
  "The Bloody Algos Are Here!"
</p>
<p className="text-lg text-base-content/80 mt-4">
  A provocative exploration of AI ethics through the lens of immigration—free to download.
</p>
```

**Source:** `copywriting.md` → Headline, Subhead

**Acceptance:** Headline renders with correct typography.

---

### T301: Add description paragraph
**File:** `app/aiimmigrants/page.tsx`

Add condensed body content:

```tsx
<div className="mt-6 space-y-4 text-base-content/90">
  <p>
    Every generation finds its scapegoat. In the 19th century, it was Chinese railroad workers.
    In 2016, it was EU migrants. Today, it's algorithms.
  </p>
  <p>
    <em>AI Immigrants</em> examines how the fears we project onto artificial intelligence—job theft,
    cultural erosion, loss of control—echo centuries of anti-immigrant sentiment.
    The parallels aren't coincidental.
  </p>
  <p>
    But what if the algorithm is just the latest distraction from harder questions about
    corporate power, labour rights, and democratic accountability?
  </p>
</div>
```

**Source:** `copywriting.md` → Body (condensed)

**Acceptance:** Description renders with proper spacing.

---

### T302: Add download buttons
**File:** `app/aiimmigrants/page.tsx`

Add download button group:

```tsx
<div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
  <a
    href="/aiimmigrants.epub"
    download
    className="btn btn-primary"
  >
    Download EPUB
  </a>
  <a
    href="/aiimmigrants.pdf"
    download
    className="btn btn-outline"
  >
    Download PDF
  </a>
</div>
```

**Acceptance:** Two buttons render, styled correctly.

---

### T303: Add audiobook teaser
**File:** `app/aiimmigrants/page.tsx`

Add audiobook coming soon notice:

```tsx
<p className="text-sm text-base-content/60 mt-4">
  🎧 Audiobook coming soon on Spotify
</p>
```

**Acceptance:** Teaser text visible below buttons.

---

### T304: Add author bio
**File:** `app/aiimmigrants/page.tsx`

Add author bio section:

```tsx
<div className="mt-8 pt-8 border-t border-base-300">
  <p className="text-sm text-base-content/70">
    <span className="font-semibold">Kevin Ryan</span> is a DevOps consultant and AI governance
    specialist who has worked with organizations from startups to CERN. He splits his time
    between the UK and Hungary, helping companies adopt AI responsibly while questioning
    the narratives we tell ourselves about technology.
  </p>
</div>
```

**Source:** `copywriting.md` → Author Bio

**Acceptance:** Bio renders with border separator.

---

### T305: Add chapter list (collapsible)
**File:** `app/aiimmigrants/page.tsx`

Add expandable chapter list:

```tsx
<details className="mt-8">
  <summary className="cursor-pointer text-sm font-medium text-base-content hover:text-primary transition-colors">
    View all 12 chapters
  </summary>
  <ol className="mt-4 text-sm text-base-content/70 list-decimal list-inside space-y-1">
    <li>They're Taking Our Jobs</li>
    <li>Over Here and Overpaid</li>
    <li>They Don't Integrate or Fit In</li>
    <li>Ruining Our Culture</li>
    <li>They Overload Our Public Services</li>
    <li>They Bring Crime and Disorder</li>
    <li>The Synthetic Scapegoat</li>
    <li>They're Here Illegally or Unfairly</li>
    <li>The Algorithm Class</li>
    <li>Sentience, Schm-entience</li>
    <li>Humanity as a Luxury Brand</li>
    <li>You Are Not Redundant</li>
  </ol>
</details>
```

**Source:** `copywriting.md` → Chapter List

**Acceptance:** Chapter list expands/collapses on click.

---

## Phase 4: Validation

### T400: Run lint check
**Command:** `pnpm lint`

Fix any ESLint errors or warnings.

**Acceptance:** `pnpm lint` exits with code 0.

---

### T401: Run build check
**Command:** `pnpm build`

Verify static export succeeds.

**Acceptance:** `pnpm build` exits with code 0.

---

### T402: Visual review - mobile
**Manual test**

Check on mobile viewport (< 768px):
- [ ] Cover centered above content
- [ ] Text centered
- [ ] Buttons stack or wrap properly
- [ ] Chapter list collapsible works
- [ ] No horizontal scroll

**Acceptance:** Layout correct on mobile.

---

### T403: Visual review - desktop
**Manual test**

Check on desktop viewport (≥ 1024px):
- [ ] Two-column layout (cover left, content right)
- [ ] Text left-aligned
- [ ] Buttons inline
- [ ] Proper spacing between sections

**Acceptance:** Layout correct on desktop.

---

### T404: Accessibility check
**Tool:** Browser DevTools / axe extension

Check:
- [ ] Single H1 on page
- [ ] Cover has role="img" and aria-label
- [ ] Buttons have accessible names
- [ ] Color contrast passes
- [ ] Details/summary accessible

**Acceptance:** No critical accessibility violations.

---

### T405: Verify metadata
**Manual test**

Check page source for:
- [ ] `<title>` tag present
- [ ] `<meta name="description">` present
- [ ] Open Graph tags present

**Acceptance:** SEO metadata renders correctly.

---

## Completion Checklist

- [ ] All T-series tasks complete
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] Page renders at `/aiimmigrants`
- [ ] Responsive layout works
- [ ] All content matches copywriting.md
- [ ] No `any` types used
- [ ] Components under 200 lines
- [ ] Single documented style deviation (backgroundImage)

---

## Task Dependencies

```
T000-T005 (read context)
    ↓
T100 (BookCover component)
    ↓
T200 → T201 (page structure)
    ↓
T300 → T301 → T302 → T303 → T304 → T305 (content)
    ↓
T400 → T401 → T402 → T403 → T404 → T405 (validation)
```

**Parallelizable:** T402, T403, T404, T405 can run in parallel after T401.

---

*Commit after completing each phase.*
