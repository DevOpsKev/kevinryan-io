# Skill: React Component Patterns

> Applies to: All React components in this project

## File Structure

One component per file. File name matches component name.

```
components/
├── SiteHeader.tsx       # Single component
├── ContactForm.tsx      # Single component
├── ServiceCard.tsx      # Single component
└── ui/                  # Shared UI primitives (if needed)
    ├── Button.tsx
    └── Card.tsx
```

## Component Template

```tsx
// components/ComponentName.tsx

interface ComponentNameProps {
  // Required props first
  title: string
  // Optional props after
  className?: string
}

export function ComponentName({ title, className = '' }: ComponentNameProps) {
  return (
    <div className={`base-styles ${className}`}>
      {title}
    </div>
  )
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `SiteHeader.tsx` |
| Component functions | PascalCase | `export function SiteHeader()` |
| Props interfaces | ComponentName + Props | `SiteHeaderProps` |
| Event handlers | handle + Event | `handleClick`, `handleSubmit` |
| Boolean props | is/has prefix | `isActive`, `hasError` |

## Props Patterns

### Required vs Optional
```tsx
interface CardProps {
  // Required - no default possible
  title: string

  // Optional with default
  variant?: 'default' | 'featured'

  // Optional, no default needed
  onClick?: () => void
}

export function Card({
  title,
  variant = 'default',
  onClick
}: CardProps) {
  // ...
}
```

### Forwarding className
Always allow className override for layout flexibility:

```tsx
interface ComponentProps {
  className?: string
}

export function Component({ className = '' }: ComponentProps) {
  return (
    // Base styles first, override last
    <div className={`flex items-center gap-4 ${className}`}>
      {/* content */}
    </div>
  )
}
```

### Children Pattern
```tsx
interface ContainerProps {
  children: React.ReactNode
  as?: 'div' | 'section' | 'article'
}

export function Container({ children, as: Tag = 'div' }: ContainerProps) {
  return <Tag className="container mx-auto px-4">{children}</Tag>
}
```

## Client vs Server Components

### Default: Server Component
```tsx
// No directive needed - server component by default
export function StaticContent() {
  return <div>This renders at build time</div>
}
```

### Client Component (When Required)
```tsx
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [state, setState] = useState(false)

  return (
    <button onClick={() => setState(!state)}>
      {state ? 'On' : 'Off'}
    </button>
  )
}
```

### Minimizing Client Boundaries
Push `'use client'` as deep as possible:

```tsx
// ❌ Entire page is client component
'use client'

export default function Page() {
  const [open, setOpen] = useState(false)
  return (
    <main>
      <StaticHeader />        {/* Unnecessarily client-rendered */}
      <StaticContent />       {/* Unnecessarily client-rendered */}
      <Modal open={open} />   {/* Actually needs client */}
    </main>
  )
}

// ✅ Only interactive part is client component
export default function Page() {
  return (
    <main>
      <StaticHeader />
      <StaticContent />
      <ModalToggle />  {/* 'use client' inside this component only */}
    </main>
  )
}
```

## Size Limits

**Maximum 200 lines per component.** If approaching this limit:

1. Extract sub-components
2. Move logic to custom hooks
3. Split rendering sections

```tsx
// ❌ Monolithic component
export function LargePage() {
  // 50 lines of state/logic
  // 150 lines of JSX
}

// ✅ Composed from smaller pieces
export function Page() {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesSection />
      <ContactSection />
    </PageLayout>
  )
}
```

## Hooks Patterns

### Custom Hook Extraction
When logic is reusable or complex, extract to hook:

```tsx
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

### Effect Cleanup
Always clean up effects that create subscriptions:

```tsx
useEffect(() => {
  const handler = () => console.log('resize')
  window.addEventListener('resize', handler)

  return () => window.removeEventListener('resize', handler)
}, [])
```

## Conditional Rendering

```tsx
// Simple boolean
{isVisible && <Component />}

// Ternary for either/or
{isLoading ? <Spinner /> : <Content />}

// Early return for complex conditions
if (!data) return <EmptyState />
if (error) return <ErrorState error={error} />
return <DataDisplay data={data} />
```

## Accessibility Checklist

Every component must:

- [ ] Have appropriate semantic HTML (`button`, `nav`, `main`, etc.)
- [ ] Include `alt` text for images
- [ ] Use `aria-label` for icon-only buttons
- [ ] Support keyboard navigation
- [ ] Maintain focus management for modals/dialogs

```tsx
// ✅ Accessible icon button
<button
  onClick={handleClose}
  aria-label="Close dialog"
  className="btn btn-circle btn-ghost"
>
  <XIcon aria-hidden="true" />
</button>

// ✅ Accessible image
<Image
  src={profile}
  alt="Kevin Ryan, DevOps consultant"
  unoptimized
/>
```

## Anti-Patterns

### Prop Drilling
```tsx
// ❌ Passing props through many layers
<A user={user}>
  <B user={user}>
    <C user={user}>
      <D user={user} />  {/* Finally used here */}
    </C>
  </B>
</A>

// ✅ Use context for deep data
const UserContext = createContext<User | null>(null)

<UserContext.Provider value={user}>
  <A><B><C><D /></C></B></A>  {/* D reads from context */}
</UserContext.Provider>
```

### Index as Key
```tsx
// ❌ Causes issues with reordering
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// ✅ Use stable identifier
{items.map((item) => (
  <Item key={item.id} data={item} />
))}
```

### Inline Object/Array Creation
```tsx
// ❌ Creates new reference every render
<Component style={{ color: 'red' }} />
<Component items={[1, 2, 3]} />

// ✅ Stable references
const style = { color: 'red' }
const items = [1, 2, 3]

<Component style={style} />
<Component items={items} />

// ✅ Or use useMemo for computed values
const items = useMemo(() => data.filter(x => x.active), [data])
```
