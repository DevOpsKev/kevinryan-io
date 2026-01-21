import Image from "next/image"
import SiteHeader from "@/components/SiteHeader"

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Pull content up to visually bind with the masthead */}
      <section className="max-w-5xl mx-auto px-6 -mt-3 md:-mt-4">
        {/* Profile image */}
        <div className="mt-2 mb-5 flex justify-center md:justify-start">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden border border-base-content/15">
            <Image
              src="/kevin.jpg"
              alt="Kevin Ryan"
              fill
              sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Main text */}
        <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl text-base-content/80">
          I work at the intersection of software engineering, artificial
          intelligence, and technical writing—focusing on clarity, systems, and
          long-term thinking.
        </p>
      </section>
    </main>
  )
}
