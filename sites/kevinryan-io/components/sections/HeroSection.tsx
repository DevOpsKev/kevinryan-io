'use client'

import Image from "next/image"
import Container from "@/components/Container"

const TAGS = ['AI-Native', 'DevEx', 'Platform', 'Author']

export default function HeroSection() {
  return (
    <>
      <section className="hero-section flex flex-col justify-end pt-28 min-h-screen relative overflow-hidden">
        {/* Grid texture background */}
        {/* justify: dual cross-hatch grid texture — two stacked linear-gradients, not expressible as a single Tailwind utility */}
        <div
          className="absolute inset-0 z-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-grey-200) 1px, transparent 1px), linear-gradient(90deg, var(--color-grey-200) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <Container className="relative z-10">
          {/* Top bar: section number + availability */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-[clamp(2rem,4vw,4rem)]">
            <span className="font-display text-[clamp(3rem,5vw,5rem)] text-accent leading-none">
              00
            </span>
            <div className="flex items-center gap-[0.7rem]">
              <span className="hero-dot inline-block h-[9px] w-[9px] rounded-full bg-accent" />
              <span className="font-bold text-[0.7rem] tracking-[0.18em] uppercase text-grey-600">
                Available for contract
              </span>
            </div>
          </div>

          {/* Main two-column grid */}
          <div className="hero-grid grid items-center pb-16 grid-cols-[1.1fr_0.9fr] gap-[clamp(2rem,4vw,5rem)]">
            {/* Text column */}
            <div>
              <div className="flex flex-wrap text-[0.7rem] font-bold tracking-[0.18em] uppercase text-accent-dim mb-6 gap-6">
                {TAGS.map((item, i, arr) => (
                  <span key={item}>
                    {item}
                    {i < arr.length - 1 && (
                      <span className="ml-6 text-accent font-black">·</span>
                    )}
                  </span>
                ))}
              </div>

              <h1 className="font-display leading-[0.86] tracking-[0.02em] uppercase text-black text-[clamp(3rem,8vw,6rem)] mb-2">
                Kevin <span className="text-accent">Ryan</span>
              </h1>

              {/* Lime rule */}
              <div className="w-[100px] h-1 bg-accent my-7" />

              {/* Description */}
              <p className="text-[1.05rem] leading-[1.7] text-grey-600 max-w-[500px] mb-9">
                I used to direct teams of software engineers. Now I coordinate AI agents. A career building software and shipping products taught me the job was never about the tools &mdash; it&rsquo;s specification, role clarity, and amplifying human ingenuity. The tools change. The reality is, it still takes great teams of people to build great products. Agents just mean we do it faster.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center text-[0.72rem] font-extrabold tracking-[0.14em] uppercase px-[1.1rem] py-4 bg-black border-2 border-black text-white transition-all duration-200 hover:bg-accent hover:border-accent hover:text-black"
                >
                  Get in touch
                </a>
                <a
                  href="#delivery"
                  className="inline-flex items-center text-[0.72rem] font-extrabold tracking-[0.14em] uppercase px-[1.1rem] py-4 bg-transparent border-2 border-grey-200 text-black transition-all duration-200 hover:border-black"
                >
                  Case studies
                </a>
              </div>
            </div>

            {/* Photo column */}
            <div className="hero-image-col">
              <div className="hero-image-frame relative aspect-[3/4] overflow-hidden bg-black">
                <Image
                  src="/kevin.jpg"
                  alt="Kevin Ryan"
                  fill
                  className="object-cover grayscale opacity-90"
                  priority
                />
                {/* Lime stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-accent" />
                {/* Badge top-left */}
                <div className="absolute top-6 left-6 bg-black/85 backdrop-blur-[8px] px-5 py-3 font-bold text-[0.65rem] tracking-[0.14em] uppercase text-white">
                  Remote First
                </div>
                {/* Location bottom-left */}
                <div className="absolute bottom-6 left-6 font-bold text-[0.65rem] tracking-[0.14em] uppercase text-white">
                  Budapest <span className="text-accent">·</span> Dublin
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <style jsx>{`
        .hero-dot {
          animation: heroPulse 2s ease-in-out infinite;
        }
        @keyframes heroPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168,225,12,0.4); }
          50% { box-shadow: 0 0 0 7px rgba(168,225,12,0); }
        }
        @media (max-width: 768px) {
          .hero-image-col { order: -1; }
          .hero-image-frame { aspect-ratio: 1 / 1 !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}