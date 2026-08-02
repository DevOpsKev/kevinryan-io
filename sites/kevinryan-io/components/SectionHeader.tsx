import type { ReactNode } from 'react'

/**
 * Section head. Mono eyebrow above a large title.
 * No numeral, no section marker glyph. See design-spec/theme-spec.md B14.
 *
 * The element defaults to h2 because a section head is subordinate to
 * the page heading. Pass as="h1" only where this head is the page's
 * own heading, which is the contact page and nowhere else.
 */
export default function SectionHeader({
  subtitle,
  title,
  lead,
  as: Heading = 'h2',
  className = '',
}: {
  subtitle: string
  title: ReactNode
  lead?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}) {
  return (
    <div className={`sec-head${className ? ' ' + className : ''}`}>
      <span className="sec-mark">{subtitle}</span>
      <Heading className="t-h1">{title}</Heading>
      {lead ? <p className="sec-lead t-lead">{lead}</p> : null}
    </div>
  )
}
