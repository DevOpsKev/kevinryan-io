# Skill: TypeScript Strict Mode

> Applies to: All TypeScript code in this project

## Configuration

This project enforces strict TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## Type Patterns

### Component Props
```tsx
// Define interface for props
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

// Use interface in component
export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}
```

### Children Props
```tsx
interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`container mx-auto ${className}`}>{children}</div>
}
```

### Event Handlers
```tsx
// Form events
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
}

// Input change
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value)
}

// Click events
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  // ...
}
```

### State with Explicit Types
```tsx
// Simple state - inferred
const [count, setCount] = useState(0)

// Complex state - explicit
interface FormState {
  name: string
  email: string
  message: string
}

const [form, setForm] = useState<FormState>({
  name: '',
  email: '',
  message: '',
})

// Nullable state
const [user, setUser] = useState<User | null>(null)
```

## Prohibited Patterns

### Implicit Any
```tsx
// ❌ PROHIBITED
function process(data) {
  return data.value
}

// ✅ Required
function process(data: { value: string }): string {
  return data.value
}
```

### Explicit Any (Without Justification)
```tsx
// ❌ PROHIBITED
const result: any = fetchData()

// ✅ If truly necessary, document why
// DEVIATION: Third-party library returns untyped data, tracked in #123
const result: any = legacyLibrary.getData()

// ✅ Better - use unknown and narrow
const result: unknown = fetchData()
if (isValidResponse(result)) {
  // result is now typed
}
```

### Type Assertions Without Narrowing
```tsx
// ❌ PROHIBITED - dangerous cast
const element = document.getElementById('app') as HTMLDivElement

// ✅ Narrow with check
const element = document.getElementById('app')
if (element instanceof HTMLDivElement) {
  // safely use element
}

// ✅ Or use non-null assertion only when guaranteed
const element = document.getElementById('app')!
// Only if you're certain it exists
```

### Ignoring Null Checks
```tsx
// ❌ PROHIBITED
function getLength(str: string | null) {
  return str.length // Error: str might be null
}

// ✅ Handle null case
function getLength(str: string | null): number {
  return str?.length ?? 0
}

// ✅ Or guard clause
function getLength(str: string | null): number {
  if (!str) return 0
  return str.length
}
```

## Utility Types

### Common Patterns
```tsx
// Partial - all properties optional
type PartialUser = Partial<User>

// Required - all properties required
type RequiredConfig = Required<Config>

// Pick - subset of properties
type UserPreview = Pick<User, 'name' | 'avatar'>

// Omit - exclude properties
type UserWithoutPassword = Omit<User, 'password'>

// Record - typed object
type StatusMap = Record<string, boolean>
```

### Component Prop Utilities
```tsx
// Extend HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

// Omit conflicting props
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void
}
```

## Import/Export Patterns

### Type-Only Imports
```tsx
// Use type-only imports for types
import type { User, Config } from '@/types'

// Regular imports for values
import { formatDate } from '@/lib/utils'

// Mixed - separate type imports
import { Component } from 'react'
import type { ComponentProps } from 'react'
```

### Barrel Exports
```tsx
// types/index.ts
export type { User } from './user'
export type { Config } from './config'

// Usage
import type { User, Config } from '@/types'
```

## Path Aliases

This project uses `@/*` for root imports:

```tsx
// ✅ Use alias
import { Button } from '@/components/Button'

// ❌ Avoid relative paths from deep nesting
import { Button } from '../../../components/Button'
```

## Error Handling

```tsx
// Define error types
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Type guard for errors
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

// Usage
try {
  validate(data)
} catch (error) {
  if (isValidationError(error)) {
    console.error(`Field ${error.field}: ${error.message}`)
  } else {
    throw error
  }
}
```
