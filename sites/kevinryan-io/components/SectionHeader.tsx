import type { ReactNode } from 'react'

/**
 * Section head. Mono eyebrow above a large title.
 * No numeral, no section marker glyph. See design-spec/theme-spec.md B14.
 */
export default function SectionHeader({
  subtitle,
  title,
  lead,
  className = '',
}: {
  subtitle: string
  title: ReactNode
  lead?: ReactNode
  className?: string
}) {
  return (
    <div className={`sec-head${className ? ' ' + className : ''}`}>
      <span className="sec-mark">{subtitle}</span>
      <h1 className="t-h1">{title}</h1>
      {lead ? <p className="sec-lead t-lead">{lead}</p> : null}
    </div>
  )
}
