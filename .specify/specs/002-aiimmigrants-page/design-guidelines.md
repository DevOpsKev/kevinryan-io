# Design Guidelines: AI Immigrants Page

## Reference Template

The following HTML/CSS template serves as the design reference for the book cover component. Note that inline styles must be converted to Tailwind utilities per the project constitution.

### Original Template (Reference Only)

```html
<section class="bg-gray-200 flex flex-col items-center h-screen justify-center relative">
  <div class="w-full mx-auto max-w-7xl relative">
    <div class="max-w-sm mx-auto" style="box-shadow:0 65.2926px 52.2341px rgba(35,35,52,.2), 0 27.2777px 21.8221px rgba(35,35,52,.144), 0 14.584px 11.6672px rgba(35,35,52,.119), 0 8.17564px 6.54052px rgba(35,35,52,.1), 0 4.34202px 3.47362px rgba(35,35,52,.081), 0 1.80681px 1.44545px rgba(35,35,52,.056); background-image: linear-gradient(0deg, rgba(16, 130, 178, 0.58) 0%, rgba(16, 130, 178, 0.58) 13%,rgba(49, 137, 167, 0.58) 13%, rgba(49, 137, 167, 0.58) 42%,rgba(81, 143, 157, 0.58) 42%, rgba(81, 143, 157, 0.58) 49%,rgba(114, 150, 146, 0.58) 49%, rgba(114, 150, 146, 0.58) 58%,rgba(147, 157, 135, 0.58) 58%, rgba(147, 157, 135, 0.58) 69%,rgba(180, 164, 124, 0.58) 69%, rgba(180, 164, 124, 0.58) 74%,rgba(212, 170, 114, 0.58) 74%, rgba(212, 170, 114, 0.58) 78%,rgba(245, 177, 103, 0.58) 78%, rgba(245, 177, 103, 0.58) 100%),linear-gradient(90deg, rgb(180, 56, 238) 0%, rgb(180, 56, 238) 11%,rgb(190, 82, 231) 11%, rgb(190, 82, 231) 22%,rgb(201, 109, 225) 22%, rgb(201, 109, 225) 46%,rgb(211, 135, 218) 46%, rgb(211, 135, 218) 60%,rgb(222, 161, 212) 60%, rgb(222, 161, 212) 65%,rgb(232, 187, 205) 65%, rgb(232, 187, 205) 87%,rgb(243, 214, 199) 87%, rgb(243, 214, 199) 92%,rgb(253, 240, 192) 92%, rgb(253, 240, 192) 100%);">
      <div class="grid grid-cols-12 text-white">
        <div class="col-span-1 flex border-r border-gray-400 py-64"></div>
        <div class="col-span-11 flex flex-col justify-between p-6">
          <div class="mt-12">
            <p class="text-xs">By Michael Andreuzza</p>
            <p class="text-xl mt-3 lg:text-2xl font-medium leading-none">
              This book cover is made with Tailwind CSS
            </p>
          </div>
          <div class="flex flex-col justify-between text-xs w-full">
            <a href="https://michaelandreuzza.com/" target="_blank">Michaelandreuzza.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Implementation Approach

### Book Cover Image

Replace the gradient background with the actual AI Immigrants cover image:

```tsx
<div
  className="max-w-sm mx-auto shadow-2xl bg-cover bg-center aspect-[2/3]"
  style={{ backgroundImage: "url('/aiimmigrants-cover.png')" }}
>
```

**Note:** `backgroundImage` with a dynamic URL is an acceptable exception to the no-inline-styles rule, as Tailwind cannot handle dynamic image paths. Document this deviation.

### Shadow

Convert the complex box-shadow to Tailwind:

```
Original: Multiple layered shadows
Tailwind: shadow-2xl (close approximation)
```

For a more dramatic effect, use DaisyUI's card shadow or stack `shadow-xl` with `shadow-black/20`.

### Layout Structure

```tsx
// Full-page hero section
<section className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-16">
  <div className="max-w-7xl w-full">

    {/* Two-column layout: cover + content */}
    <div className="flex flex-col lg:flex-row gap-12 items-center">

      {/* Book cover */}
      <div className="flex-shrink-0">
        <BookCover />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h1>...</h1>
        <p>...</p>
        <DownloadButtons />
      </div>

    </div>
  </div>
</section>
```

### Responsive Behavior

| Viewport | Layout |
|----------|--------|
| Mobile (<1024px) | Single column, cover above content, centered |
| Desktop (≥1024px) | Two columns, cover left, content right |

### Cover Dimensions

Maintain book aspect ratio (approximately 2:3):

```tsx
className="aspect-[2/3] w-64 md:w-80 lg:w-96"
```

---

## Color Palette

Use DaisyUI semantic colors for theme compatibility:

| Element | Class |
|---------|-------|
| Page background | `bg-base-200` |
| Text primary | `text-base-content` |
| Text secondary | `text-base-content/70` |
| Buttons | `btn btn-primary`, `btn btn-outline` |
| Links | `link link-primary` |

---

## Typography

| Element | Classes |
|---------|---------|
| Page title (H1) | `text-3xl md:text-4xl lg:text-5xl font-bold` |
| Subhead | `text-lg md:text-xl text-base-content/80` |
| Body text | `text-base leading-relaxed` |
| Chapter list | `text-sm` |
| Author bio | `text-sm text-base-content/70` |

---

## Download Buttons

```tsx
<div className="flex flex-wrap gap-4">
  <a href="/aiimmigrants.epub" className="btn btn-primary">
    Download EPUB
  </a>
  <a href="/aiimmigrants.pdf" className="btn btn-outline">
    Download PDF
  </a>
</div>
```

---

## Required Assets

| Asset | Path | Notes |
|-------|------|-------|
| Cover image | `/public/aiimmigrants-cover.png` | High-res, optimized for web |
| EPUB file | `/public/aiimmigrants.epub` | Download link |
| PDF file | `/public/aiimmigrants.pdf` | Download link |

---

## Accessibility Requirements

- Cover image must have descriptive `alt` text
- Download links must indicate file type and size
- Sufficient color contrast on all text
- Semantic heading hierarchy (single H1)

---

## Deviations from Constitution

| Deviation | Justification | Tracking |
|-----------|---------------|----------|
| Inline `backgroundImage` style | Tailwind cannot handle dynamic image URLs | Documented here |

All other styling must use Tailwind utilities only.
