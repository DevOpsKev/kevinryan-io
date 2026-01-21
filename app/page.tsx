import Image from "next/image"
import SiteHeader from "@/components/SiteHeader"

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Pull content up to visually bind with the masthead */}
      <section className="max-w-5xl mx-auto px-6 -mt-3 md:-mt-4">
        <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl text-base-content/80">
          I work at the intersection of software engineering, artificial
          intelligence, and technical writing—focusing on clarity, systems, and
          long-term thinking.
        </p>
      </section>
    </main>
  )
}
