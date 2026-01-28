# Technical Plan: AI Immigrants Page

> Branch: `002-aiimmigrants-page`
> Date: 2025-01-28
> Spec: [spec.md](./spec.md)

## Summary

Create a static landing page at `/aiimmigrants` featuring the book cover with background image, descriptive content from copywriting.md, and download buttons. Follows project constitution (static export, Tailwind-only, TypeScript strict).

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Page location | `app/aiimmigrants/page.tsx` | Next.js App Router convention |
| Component extraction | `components/BookCover.tsx` | Reusable, keeps page under 200 lines |
| Styling | Tailwind + DaisyUI | Constitution requirement |
| Image handling | CSS background-image | Allows overlay effects, better control |
| Metadata | Next.js metadata export | SEO + social sharing |

## Architecture

### File Structure

```
app/
└── aiimmigrants/
    └── page.tsx          # Page component with metadata

components/
└── BookCover.tsx         # Book cover display component

public/
├── aiimmigrants-cover.png   # Cover image (to be added)
├── aiimmigrants.epub        # EPUB download (to be added)
└── aiimmigrants.pdf         # PDF download (to be added)
```

### Component Hierarchy

```
AIImmigrantsPage
├── <section> Hero
│   ├── BookCover
│   └── <div> Content
│       ├── <h1> Headline
│       ├── <p> Subhead
│       ├── <div> Description
│       ├── <div> Download Buttons
│       └── <div> Author Bio
└── <section> Chapter List (optional)
```

## Implementation Details

### Page Metadata

```tsx
// app/aiimmigrants/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Immigrants: "The Bloody Algos Are Here!" | Kevin Ryan',
  description: 'A provocative exploration of AI ethics through the lens of immigration. Free to download in EPUB and PDF.',
  openGraph: {
    title: 'AI Immigrants: "The Bloody Algos Are Here!"',
    description: 'What if algorithms are just the latest scapegoat for problems we refuse to solve?',
    images: ['/aiimmigrants-cover.png'],
  },
}
```

### Page Layout

```tsx
export default function AIImmigrantsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">

            {/* Book Cover */}
            <div className="flex-shrink-0">
              <BookCover />
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Headline, description, buttons, bio */}
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
```

### BookCover Component

```tsx
// components/BookCover.tsx

interface BookCoverProps {
  className?: string
}

export function BookCover({ className = '' }: BookCoverProps) {
  return (
    <div
      className={`
        aspect-[2/3] w-64 md:w-72 lg:w-80
        bg-cover bg-center
        shadow-2xl rounded-sm
        ${className}
      `}
      style={{ backgroundImage: "url('/aiimmigrants-cover.png')" }}
      role="img"
      aria-label="AI Immigrants book cover featuring [describe cover when available]"
    />
  )
}
```

**Deviation documented:** Inline `backgroundImage` style required for dynamic image path.

### Download Buttons

```tsx
<div className="flex flex-wrap justify-center lg:justify-start gap-4">
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

### Content Structure

```tsx
{/* Headline */}
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
  AI Immigrants
</h1>
<p className="text-xl md:text-2xl text-primary font-medium mt-2">
  "The Bloody Algos Are Here!"
</p>

{/* Subhead */}
<p className="text-lg text-base-content/80 mt-4">
  A provocative exploration of AI ethics through the lens of immigration—free to download.
</p>

{/* Description */}
<div className="prose prose-base mt-6 max-w-none">
  <p>Every generation finds its scapegoat...</p>
  {/* Condensed body content */}
</div>

{/* Download Buttons */}
<div className="mt-8">
  {/* Buttons here */}
</div>

{/* Audiobook teaser */}
<p className="text-sm text-base-content/60 mt-4">
  Audiobook coming soon on Spotify
</p>

{/* Author Bio */}
<div className="mt-8 pt-8 border-t border-base-300">
  <p className="text-sm text-base-content/70">
    <strong>Kevin Ryan</strong> is a DevOps consultant and AI governance specialist...
  </p>
</div>
```

### Chapter List (Collapsible)

```tsx
<details className="mt-8">
  <summary className="cursor-pointer text-sm font-medium">
    View all 12 chapters
  </summary>
  <ol className="mt-4 text-sm text-base-content/80 list-decimal list-inside space-y-1">
    <li>They're Taking Our Jobs</li>
    <li>Over Here and Overpaid</li>
    {/* ... remaining chapters */}
  </ol>
</details>
```

## Styling Specifications

### Responsive Breakpoints

| Viewport | Cover Width | Layout |
|----------|-------------|--------|
| < 768px | `w-64` | Single column, centered |
| 768px–1023px | `w-72` | Single column, centered |
| ≥ 1024px | `w-80` | Two columns, cover left |

### Color Usage

| Element | Class |
|---------|-------|
| Page background | `bg-base-200` |
| Headline | `text-base-content` |
| Subtitle | `text-primary` |
| Body text | `text-base-content` |
| Secondary text | `text-base-content/80` |
| Muted text | `text-base-content/60` |
| Border | `border-base-300` |

### Typography Scale

| Element | Classes |
|---------|---------|
| H1 | `text-3xl md:text-4xl lg:text-5xl font-bold` |
| Subtitle | `text-xl md:text-2xl font-medium` |
| Subhead | `text-lg` |
| Body | `text-base leading-relaxed` |
| Small/meta | `text-sm` |

## Accessibility

### Required Attributes

```tsx
// Book cover (background image)
<div
  role="img"
  aria-label="AI Immigrants book cover"
>

// Download links
<a href="..." download aria-label="Download AI Immigrants as EPUB">

// Chapter details
<details>
  <summary aria-expanded="false">View chapters</summary>
</details>
```

### Heading Hierarchy

```
<h1> AI Immigrants (page title)
  └── No h2-h6 needed for this simple page
```

## Placeholder Handling

Until actual files are provided:

```tsx
// Cover - use a placeholder gradient
style={{
  backgroundImage: "url('/aiimmigrants-cover.png')",
  backgroundColor: '#1a1a2e'  // Fallback color
}}

// Downloads - link to placeholder or current path
href="/aiimmigrants.epub"  // Will 404 until file exists
```

## Testing Checklist

- [ ] Page renders at `/aiimmigrants`
- [ ] Cover image displays (or fallback)
- [ ] Responsive layout works (mobile/desktop)
- [ ] Download buttons present and styled
- [ ] All text content matches copywriting.md
- [ ] Metadata renders correctly (check page source)
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Lighthouse accessibility > 95

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Cover image not provided | Fallback background color |
| Download files missing | Links still work; 404 acceptable during dev |
| Long content on mobile | Collapsible chapter list |

---

*Task breakdown in `tasks.md`.*
