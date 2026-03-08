import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s — Kevin Ryan',
    default: 'The Dark Factory — Kevin Ryan',
  },
  description:
    'The gap between AI-native software teams and everyone else — and what it takes to cross it.',
}

export default function DarkFactoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
