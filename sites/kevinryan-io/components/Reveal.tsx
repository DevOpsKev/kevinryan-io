/**
 * Structural wrapper only.
 *
 * This used to fade and translate its children in on scroll. The theme
 * requires that motion responds to input and that nothing animates on
 * entry, so the animation was removed. The component is kept because it
 * carries layout classes at a number of call sites.
 *
 * See design-spec/theme-spec.md B28.
 */
export default function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
