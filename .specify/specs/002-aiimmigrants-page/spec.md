# Feature Specification: AI Immigrants Page

> Branch: `002-aiimmigrants-page`
> Created: 2025-01-28
> Status: Ready for Planning

## Overview

Create a dedicated landing page for the AI Immigrants book at `/aiimmigrants`, featuring the book cover, description, and download links for free digital versions.

## Problem Statement

The AI Immigrants book is complete but has no web presence. Visitors clicking the nav link land on a 404. The book needs a compelling landing page that communicates its value proposition and provides frictionless access to free downloads.

## User Stories

### US-001: Discover the Book
**As a** site visitor
**I want** to learn what AI Immigrants is about
**So that** I can decide whether to read it

**Acceptance Criteria:**
- Page clearly communicates the book's premise
- Cover image is prominently displayed
- Key themes/chapters are visible

### US-002: Download the Book
**As an** interested reader
**I want** to download the book in my preferred format
**So that** I can read it on my device

**Acceptance Criteria:**
- EPUB download available (one click)
- PDF download available (one click)
- File format clearly labeled
- No signup or paywall

### US-003: Learn About the Author
**As a** reader
**I want** to know who wrote this book
**So that** I can assess credibility and find more content

**Acceptance Criteria:**
- Author bio visible on page
- Links to author's main site/profiles

## Functional Requirements

### FR-001: Page Route
- URL: `/aiimmigrants`
- Static page (no dynamic data)

### FR-002: Book Cover Display
- Prominent cover image
- Book-like aspect ratio (2:3)
- Responsive sizing
- Shadow/depth effect for visual appeal

### FR-003: Content Sections
The page MUST include:

| Section | Content Source |
|---------|----------------|
| Headline | copywriting.md → Headline |
| Subhead | copywriting.md → Subhead |
| Description | copywriting.md → Body (condensed) |
| Download buttons | EPUB + PDF links |
| Author bio | copywriting.md → Author Bio |

### FR-004: Download Links
| Format | File Path | Button Style |
|--------|-----------|--------------|
| EPUB | `/aiimmigrants.epub` | Primary |
| PDF | `/aiimmigrants.pdf` | Outline/Secondary |

### FR-005: Chapter Preview (Optional)
- List of 12 chapter titles
- Collapsed by default on mobile
- Visible on desktop

### FR-006: Audiobook Teaser
- "Audiobook coming soon on Spotify" mention
- No link required yet

## Non-Functional Requirements

### NFR-001: Performance
- Page loads under 2 seconds
- Cover image optimized (WebP if possible, fallback JPG)
- No layout shift from image loading

### NFR-002: SEO
- Proper meta title and description
- Open Graph tags for social sharing
- Semantic HTML structure

### NFR-003: Accessibility
- Cover image has descriptive alt text
- Download buttons clearly labeled
- Heading hierarchy (single H1)
- Color contrast meets WCAG AA

## Out of Scope

- Purchase links for physical copies (future)
- Email signup/newsletter integration (future)
- Reviews/testimonials section (future)
- Audiobook player embed (future)

## Dependencies

### Required Assets
- [ ] Cover image file (`aiimmigrants-cover.png`)
- [ ] EPUB file (`aiimmigrants.epub`)
- [ ] PDF file (`aiimmigrants.pdf`)

**Note:** Page can be built with placeholder paths; files added later.

## Success Criteria

- [ ] Page accessible at `/aiimmigrants`
- [ ] Cover image displays correctly
- [ ] Both download buttons functional
- [ ] Responsive on mobile and desktop
- [ ] Lighthouse accessibility score > 95
- [ ] `pnpm build` passes

---

*See `copywriting.md` for all text content.*
*See `design-guidelines.md` for visual implementation details.*
*Technical implementation in `plan.md`.*
