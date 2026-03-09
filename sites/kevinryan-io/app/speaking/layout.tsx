import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s — Kevin Ryan',
    default: 'Speaking — Kevin Ryan',
  },
  description:
    'Conference talks and session briefs by Kevin Ryan on AI-native engineering, spec driven development, and platform strategy.',
}

export default function SpeakingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
