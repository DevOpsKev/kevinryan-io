export default function SiteFooter(): React.JSX.Element {
  return (
    <footer className="py-6 border-t-2 border-accent bg-black text-grey-600">
      <div className="flex justify-between items-center mx-auto max-w-[1400px] px-[clamp(1.5rem,5vw,6rem)] text-[0.72rem] tracking-[0.05em]">
        <span>© {new Date().getFullYear()} Kevin Ryan. All rights reserved.</span>
        <span className="font-mono text-[0.65rem] opacity-50">
          {process.env.NEXT_PUBLIC_COMMIT_SHA}
        </span>
        <span className="font-display tracking-[0.12em] uppercase">
          Budapest · Dublin · <a href="https://hq.kevinryan.io/" target="_blank" rel="noopener noreferrer" className="text-grey-800 no-underline">HQ</a>
        </span>
      </div>
    </footer>
  )
}