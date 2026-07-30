import type { ReactNode } from 'react'

export default function SectionHeader({
  number,
  subtitle,
  title,
  className = '',
}: {
  number: string
  subtitle: string
  title: ReactNode
  className?: string
}) {
  return (
    <div className={`section__header reveal${className ? ' ' + className : ''}`}>
      <div className="section__number">{number}</div>
      <div>
        <div className="section__subtitle">{subtitle}</div>
        <h2 className="display-lg">{title}</h2>
      </div>
    </div>
  )
}