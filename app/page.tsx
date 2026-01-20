export default function Page() {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <section className="w-full max-w-2xl bg-base-100 rounded-box shadow-sm p-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-base-content">
            Kevin Ryan
          </h1>
          <p className="text-base-content/70">
            Software • AI • Systems
          </p>
        </header>

        <div className="prose prose-sm max-w-none text-base-content/80">
          <p>
            I work on software systems, artificial intelligence, and the
            practical realities of building reliable technology.
          </p>
        </div>

        <footer className="pt-4 flex gap-3">
          <a href="/about" className="btn btn-ghost btn-sm">
            About
          </a>
          <a href="/writing" className="btn btn-ghost btn-sm">
            Writing
          </a>
          <a href="/contact" className="btn btn-primary btn-sm">
            Contact
          </a>
        </footer>
      </section>
    </main>
  )
}
