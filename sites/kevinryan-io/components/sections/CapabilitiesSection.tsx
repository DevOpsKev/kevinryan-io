import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'

const CAPABILITIES = [
  {
    number: "01",
    title: "AI-Native Engineering",
    text: "The bottleneck has moved from implementation speed to specification quality and execution. We work at that bottleneck. Enterprise AI adoption strategy, agent workflow architecture and specification quality. Author of The AI-Native Engineer. The dark factory does not happen by accident.",
  },
  {
    number: "02",
    title: "Platform Engineering & DevEx",
    text: "Build and operate the internal developer platforms that AI-native teams depend on. CI/CD architecture, Kubernetes, Terraform, infrastructure as code. Nestlé global DevOps platform from zero. Dematic CI/CD transformation. CERN Kubernetes architecture review.",
  },
  {
    number: "03",
    title: "Assessment & Transition",
    text: "A structured diagnostic of where your engineering organisation sits on the AI-native spectrum, and a clear migration path to move it forward. Most teams are two levels behind where they think they are. We tell you exactly where you are, what is blocking the transition and what the path forward looks like for your stack, team and codebase.",
  },
  {
    number: "04",
    title: "Delivery Management",
    text: "We embed with client teams and run the programme that makes the transition happen. Not a report. Not a deck. Working pipelines, working practice, shipped. Eleven years client-embedded at Cprime. Built and transferred teams at Nestlé and Dematic. Stakeholder management to C-suite. The capability most contractors lack.",
  },
  {
    number: "05",
    title: "AI Governance & Ethics",
    text: "AI-native adoption without governance is a liability. Published 70,000 words on AI governance, the EU AI Act and the societal dynamics of automation. Trinity College Dublin AI Ethics CPD. NatWest board-level AI adoption recommendations. Governance built in from the start, not bolted on at the end.",
  },
  {
    number: "06",
    title: "DevOps & CI/CD",
    text: "Pipeline architecture, automation and modernisation for teams operating at AI-native scale. AI-generated code at volume demands different testing strategies, review processes and deployment gates than human-written code. DORA four key metrics as the governance framework. Infrastructure as code with Terraform and Bicep, versioned, tested, repeatable.",
  },
]

export default function CapabilitiesSection() {
  return (
    <section className="section" id="capabilities" data-accent="teal">
      <Container>
        <SectionHeader subtitle="Capabilities" title="Where I operate" />
        <div className="cells cells--3">
          {CAPABILITIES.map((cap) => (
            <div className="cell" key={cap.number}>
              <span className="cell__n">{cap.number}</span>
              <h3>{cap.title}</h3>
              <p>{cap.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
