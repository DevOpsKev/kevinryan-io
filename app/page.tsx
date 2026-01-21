import SiteHeader from "@/components/SiteHeader"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Optional future content */}
      <section className="max-w-5xl mx-auto px-6 mt-24 text-base-content/80">
        <p className="font-sans text-lg leading-relaxed max-w-2xl">
          I work at the intersection of software engineering, artificial
          intelligence, and technical writing—focusing on clarity, systems,
          and long-term thinking.
        </p>
      </section>
    </main>
  )
}
