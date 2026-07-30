export default function Container({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-[clamp(1.5rem,5vw,6rem)]${className ? ' ' + className : ''}`}>
      {children}
    </div>
  )
}