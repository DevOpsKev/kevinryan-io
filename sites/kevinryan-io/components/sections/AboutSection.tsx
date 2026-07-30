import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import Reveal from '@/components/Reveal'

const STATS = [
  { num: '30', label: 'Years in technology' },
  { num: '14', label: 'Certifications' },
  { num: '40+', label: 'Enterprise clients' },
  { num: '£20m+', label: 'Programme budgets' },
]

export default function AboutSection() {
  return (
    <section className="section section--grey" id="about">
      <Container>
        <SectionHeader number="01" subtitle="About" title={<>When AI Writes<br />The Code</>} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <Reveal>
            <p className="text-[1.05rem] leading-[1.7] max-w-[60ch] mb-6">
              The market has shifted. Anthropic hires generalists with &ldquo;quirky side projects&rdquo; over narrow specialists. OpenAI seeks &ldquo;builders who thrive in ambiguity.&rdquo; Spotify&rsquo;s best engineers have not written a line of code since December 2025 &mdash; they orchestrate AI agents while making architectural decisions the machines cannot. The signal is clear: when AI fills in the implementation details, you need people who think in systems.
            </p>
            <p className="text-[1.05rem] leading-[1.7] max-w-[60ch] mb-6">
              That is what thirty years of breadth gives you. I have built production pipelines, run multi-million-pound delivery programmes, and operated platforms for Vodafone, Nestl&eacute;, NatWest, and the BBC. AI amplifies everything I already know &mdash; and you cannot shortcut that context. Most contractors are infrastructure specialists who have never managed a client engagement, or consultants who have never touched a pipeline. I have done both.
            </p>
            <blockquote className="border-l-4 border-accent pl-6 text-[1.1rem] italic leading-[1.65] mt-10 max-w-[50ch]">
              &ldquo;Grady Booch calls this the third golden age of software engineering &mdash; the age of systems. I have been building for all three.&rdquo;
            </blockquote>
          </Reveal>
          <Reveal className="[transition-delay:0.2s]">
            <p className="text-[1.05rem] leading-[1.7] max-w-[60ch] mb-6">
              I have been early to every wave. XP and TDD when they were fringe. Agile before it was the default. Cloud-native and containerisation before the industry caught up. VentureBeat now argues that hiring specialists made sense before AI &mdash; now generalists win. This is the shift I have spent three decades preparing for.
            </p>
            <p className="text-[1.05rem] leading-[1.7] max-w-[60ch] mb-6">
              I am not theorising about AI-native engineering. I am practising it &mdash; writing the book on Spec Driven Development and building the tooling. I conduct the agents. They build the software. The entire lifecycle ships through deterministic automation.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              {STATS.map((s) => (
                <div key={s.label} className="border-t-[3px] border-black pt-4">
                  <div className="font-display text-[3.8rem] leading-none mb-1">{s.num}</div>
                  <div className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-grey-600">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}