import Image from "next/image"
import SiteHeader from "@/components/SiteHeader"

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="max-w-5xl mx-auto px-6">
        <div className="relative w-60 aspect-square -mt-6 mb-6 rounded-full overflow-hidden">
          <Image
            src="/kevin.jpg"
            alt="Kevin Ryan"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6">
        <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl text-base-content/80">
          I work at the intersection of software engineering, artificial
          intelligence, and technical writing—focusing on clarity, systems, and
          long-term thinking.
        </p>
      </section>
    </main>

  )
}
