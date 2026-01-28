# Skill: Tailwind CSS 4 + DaisyUI

> Applies to: All styling in this project

## Philosophy

Tailwind utilities first. DaisyUI components for complex patterns. Custom CSS only as absolute last resort.

## Tailwind Patterns

### Layout
```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Container with padding
<main className="container mx-auto px-4 py-8">
```

### Responsive Design
Mobile-first. Breakpoints add complexity, not remove it.

```tsx
// ✅ Correct - mobile base, tablet override
<div className="text-sm md:text-base lg:text-lg">

// ❌ Wrong - thinking desktop-first
<div className="lg:text-lg md:text-base text-sm">
```

Breakpoint reference:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Spacing Scale
Use Tailwind's spacing scale consistently:
- `gap-2` (0.5rem) — tight groupings
- `gap-4` (1rem) — standard spacing
- `gap-6` (1.5rem) — section separation
- `gap-8` (2rem) — major divisions

### Typography
```tsx
// Headings
<h1 className="text-3xl md:text-4xl font-bold">
<h2 className="text-2xl font-semibold">
<h3 className="text-xl font-medium">

// Body
<p className="text-base text-gray-700 leading-relaxed">

// Small/meta text
<span className="text-sm text-gray-500">
```

## DaisyUI Components

### When to Use DaisyUI
- Buttons with consistent states
- Form inputs with validation styling
- Cards with structured content
- Navigation components
- Modals and drawers

### Button Patterns
```tsx
// Primary action
<button className="btn btn-primary">Contact Me</button>

// Secondary action
<button className="btn btn-outline">Learn More</button>

// Link styled as button
<a href="/contact" className="btn btn-primary">Get in Touch</a>

// Icon button
<button className="btn btn-circle btn-ghost">
  <IconComponent />
</button>
```

### Card Pattern
```tsx
<div className="card bg-base-100 shadow-md">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
    <p>Content goes here</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

### Theme Colors
Use semantic color names, not raw values:
```tsx
// ✅ Semantic
<div className="bg-primary text-primary-content">
<div className="bg-base-100 text-base-content">
<div className="text-error">

// ❌ Raw values (breaks theming)
<div className="bg-blue-500 text-white">
```

## Prohibited Patterns

### Custom CSS
```css
/* ❌ PROHIBITED without justification */
.custom-class {
  display: flex;
  gap: 1rem;
}
```

If you must write custom CSS, document why Tailwind couldn't handle it.

### Arbitrary Values Overuse
```tsx
// ❌ Avoid - breaks design consistency
<div className="mt-[13px] text-[17px] w-[347px]">

// ✅ Use scale values
<div className="mt-3 text-lg w-80">
```

Arbitrary values (`[value]`) are allowed only for:
- Matching external brand requirements
- One-off adjustments that don't repeat

### Inline Styles
```tsx
// ❌ PROHIBITED
<div style={{ marginTop: '20px', color: 'blue' }}>

// ✅ Use Tailwind
<div className="mt-5 text-blue-500">
```

## Gradient Pattern (Project-Specific)

The site uses primary/secondary gradients for branding:
```tsx
// Text gradient
<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">

// Background gradient
<div className="bg-gradient-to-br from-primary to-secondary">
```

## Dark Mode

DaisyUI handles dark mode via theme switching. Don't add manual `dark:` variants unless necessary.

```tsx
// ✅ Let DaisyUI handle it
<div className="bg-base-100 text-base-content">

// ❌ Unnecessary duplication
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

## Class Order Convention

Follow this order for readability:
1. Layout (`flex`, `grid`, `block`)
2. Position (`relative`, `absolute`)
3. Sizing (`w-`, `h-`, `max-w-`)
4. Spacing (`m-`, `p-`, `gap-`)
5. Typography (`text-`, `font-`)
6. Colors (`bg-`, `text-`, `border-`)
7. Effects (`shadow-`, `opacity-`)
8. Transitions (`transition-`, `duration-`)
9. Responsive overrides (`md:`, `lg:`)

```tsx
<div className="flex items-center w-full p-4 text-lg bg-base-100 shadow-md transition-colors md:p-6">
```
