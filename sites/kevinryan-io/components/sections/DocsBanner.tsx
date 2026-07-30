export default function DocsBanner() {
  return (
    <div className="bg-black px-[clamp(1.5rem,5vw,6rem)]">
      <div className="mx-auto max-w-[1400px] border-t border-grey-800">
        <div className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-accent pt-5 pb-3">
          See it in production
        </div>
        <div className="grid pb-7 grid-cols-1 md:grid-cols-[1fr_auto] items-start md:items-end gap-4 md:gap-12">
          <p className="text-[1.05rem] leading-[1.6] text-grey-400 max-w-[54ch] m-0">
            This entire platform &mdash; <strong className="text-white font-bold">seven sites</strong>, one monorepo, full <strong className="text-white font-bold">analytics and observability</strong> &mdash; is agent-built, spec-driven, and deployed through <strong className="text-white font-bold">deterministic automation</strong>. The documentation is the portfolio.
          </p>
          <a
            href="https://docs.kevinryan.io"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 font-sans text-[0.82rem] font-extrabold tracking-[0.14em] uppercase whitespace-nowrap text-accent border-b-2 border-accent pb-[0.15rem] transition-colors duration-200 hover:text-white hover:border-white"
          >
            docs.kevinryan.io
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}