export default function Container({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`shell${className ? ' ' + className : ''}`}>
      {children}
    </div>
  )
}
