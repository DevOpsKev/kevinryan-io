import type { Metadata } from 'next'
import AssessmentCta from '@/components/sections/assessment/AssessmentCta'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Arrange a discovery call for AI-native transition engagements and Platform Engineering contracts.',
}

export default function Page() {
  return (
    <main>
      {/* The only heading on this page, so it carries the h1. */}
      <AssessmentCta as="h1" />
    </main>
  )
}
