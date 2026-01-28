# Skill: Next.js Static Export

> Applies to: Next.js 16 with App Router, static output mode

## Context

This project uses `output: 'export'` for GitHub Pages deployment. This fundamentally constrains what Next.js features are available.

## Allowed Patterns

### Page Components
```tsx
// app/page.tsx
export default function HomePage() {
  return <main>Content</main>
}
```

### Layouts
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Client Components
```tsx
'use client'

import { useState } from 'react'

export function InteractiveWidget() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Static Metadata
```tsx
// app/layout.tsx or app/page.tsx
export const metadata = {
  title: 'Kevin Ryan',
  description: 'DevOps & AI Governance Consultant',
}
```

### Static Asset Imports
```tsx
import profileImage from '@/public/kevin.jpg'
import Image from 'next/image'

// Note: images must use unoptimized mode in static export
<Image src={profileImage} alt="Kevin Ryan" unoptimized />
```

## Prohibited Patterns

### Server Components with Data Fetching
```tsx
// ❌ PROHIBITED - requires runtime
async function ServerComponent() {
  const data = await fetch('https://api.example.com')
  return <div>{data}</div>
}
```

### API Routes
```tsx
// ❌ PROHIBITED - app/api/ routes don't work in static export
export async function GET() {
  return Response.json({ data: 'value' })
}
```

### Middleware
```tsx
// ❌ PROHIBITED - middleware.ts requires edge runtime
export function middleware(request: Request) {
  // ...
}
```

### Dynamic Routes Without generateStaticParams
```tsx
// ❌ PROHIBITED - dynamic routes must be fully enumerated
// app/blog/[slug]/page.tsx without generateStaticParams
```

### Server Actions
```tsx
// ❌ PROHIBITED - 'use server' requires runtime
'use server'
export async function submitForm(data: FormData) {
  // ...
}
```

### Headers/Cookies Access
```tsx
// ❌ PROHIBITED - requires runtime
import { headers, cookies } from 'next/headers'
```

## Configuration Reference

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `next/image` without `unoptimized` | Add `unoptimized` prop or configure globally |
| Forgetting `trailingSlash: true` | Required for GitHub Pages routing |
| Using `useSearchParams` without Suspense | Wrap in Suspense boundary or avoid |
| Importing server-only packages | Check package compatibility with static export |

## When to Use Client Components

Add `'use client'` directive when:
- Using React hooks (`useState`, `useEffect`, etc.)
- Using browser APIs (`window`, `document`, `localStorage`)
- Adding event handlers (`onClick`, `onChange`, etc.)
- Using context providers

Keep client components as small as possible. Push `'use client'` boundary down to leaf components.
