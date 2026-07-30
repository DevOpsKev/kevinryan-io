import type { Metadata } from 'next'
import AssessmentHero from '@/components/sections/assessment/AssessmentHero'
import AssessmentProblem from '@/components/sections/assessment/AssessmentProblem'
import AssessmentCapabilities from '@/components/sections/assessment/AssessmentCapabilities'
import AssessmentEngagement from '@/components/sections/assessment/AssessmentEngagement'
import AssessmentDeliverables from '@/components/sections/assessment/AssessmentDeliverables'
import AssessmentAudience from '@/components/sections/assessment/AssessmentAudience'
import AssessmentEvidence from '@/components/sections/assessment/AssessmentEvidence'
import AssessmentCredibility from '@/components/sections/assessment/AssessmentCredibility'
import AssessmentCta from '@/components/sections/assessment/AssessmentCta'

export const metadata: Metadata = {
  title: 'AI-Native Readiness Assessment — Kevin Ryan & Associates',
  description:
    'A structured diagnostic that evaluates your organisation\'s capacity to realise measurable value from AI-assisted software development. Based on the DORA AI Capabilities Model.',
}

export default function AssessmentPage() {
  return (
    <div id="assessment-root">
      <AssessmentHero />
      <AssessmentProblem />
      <AssessmentCapabilities />
      <AssessmentEngagement />
      <AssessmentDeliverables />
      <AssessmentAudience />
      <AssessmentEvidence />
      <AssessmentCredibility />
      <AssessmentCta />
    </div>
  )
}