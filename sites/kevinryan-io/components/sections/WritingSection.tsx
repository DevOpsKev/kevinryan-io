import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import Reveal from '@/components/Reveal'

const PROJECTS = [
  { label: 'Book — Forthcoming', title: 'The AI Native Engineer', desc: 'The practices, knowledge and judgement software engineers need when agents write the code. Not a manual. A working body of knowledge for the era of agentic AI.', url: 'https://ai-native-engineer.io', urlLabel: 'ai-native-engineer.io' },
  { label: 'Book — Published', title: 'AI Immigrants', desc: '70,000 words on AI governance, the EU AI Act, and the societal dynamics of automation. The governance thinking enterprises need before letting AI into production.', url: 'https://aiimmigrants.com', urlLabel: 'aiimmigrants.com' },
  { label: 'Non-Profit', title: 'Distributed Equity', desc: 'Ensuring the benefits of AI are distributed equitably across society. Research, advocacy, and community building.', url: 'https://distributedequity.org', urlLabel: 'distributedequity.org' },
]

export default function WritingSection() {
  return (
    <section className="section" id="projects">
      <Container>
        <SectionHeader number="06" subtitle="Writing &amp; Projects" title={<>Published<br />Work</>} />
        <Reveal className="grid grid-cols-1 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <div key={p.title} className="project">
              <div className="project__label">{p.label}</div>
              <h3 className="project__title">{p.title}</h3>
              <p className="project__desc">{p.desc}</p>
              <a href={p.url} className="project__link" target="_blank" rel="noopener noreferrer">
                {p.urlLabel} <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}