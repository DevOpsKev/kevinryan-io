import { Fragment } from 'react'
import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const TIMELINE = [
  { date: "Mid-1990s", title: "Software Engineer", desc: "Writing code. Foundation layer." },
  { date: "Late 1990s", title: "XP, TDD, BDD, CI/CD", desc: "Super early adopter. These practices were fringe. Most teams had not heard of them." },
  { date: "2000s", title: "Agile & Scrum", desc: "Adopted agile methodologies before they became the industry default." },
  { date: "2007 – 2016", title: "Agile Transformation", desc: "Barclays, Heathrow, Pearson, Financial Times, BBC Worldwide, EY, McKinsey. UK Agile Award 2014." },
  { date: "2010s", title: "Cloud & Containerisation", desc: "Cloud-native development and infrastructure as code before it was mainstream." },
  { date: "2012 – 2018", title: "DevOps & DORA Metrics", desc: "Nicole Forsgren's Accelerate as a personal touchstone. DORA four key metrics as the governance framework." },
  { date: "2014 – 2020", title: "Platform Engineering", desc: "Nestlé, Dematic, CERN. DevEx and developer productivity before it had its own conference circuit." },
  { date: "2020 →", title: "AI-Native Engineering", desc: "GitHub Copilot beta. Writing The AI-Native Engineer. The next level of abstraction, and I am early again." },
]

export default function TimelineSection() {
  return (
    <section className="section section--sink" id="timeline" data-accent="magenta">
      <Container>
        <SectionHeader subtitle="Career arc" title="Early to every wave" />
        <div className="tl">
          {TIMELINE.map((t) => (
            <Fragment key={t.date}>
              <div className="tl__when"><span>{t.date}</span></div>
              <div className="tl__spine"><span className="tl__mark" /></div>
              <div className="tl__what">
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  )
}
