import { CONTAINER } from "@/lib/constants"

const CAPABILITIES = [
  {
    number: "01",
    title: "AI-Native Engineering",
    text: "The bottleneck has moved from implementation speed to specification quality and execution. We work at that bottleneck — enterprise AI adoption strategy, agent workflow architecture, and specification-driven development. Author of Spec Driven Development. The dark factory doesn't happen by accident.",
  },
  {
    number: "02",
    title: "Platform Engineering & DevEx",
    text: "Build and operate internal developer platforms that AI-native teams depend on. CI/CD architecture, Kubernetes, Terraform, infrastructure as code. Nestlé global DevOps platform from zero. Dematic CI/CD transformation. CERN Kubernetes architecture review. GitLab ×9, GitHub ×4 certified.",
  },
  {
    number: "03",
    title: "Assessment & Transition",
    text: "A structured diagnostic of where your engineering org sits on the AI-native spectrum — and a clear migration path to move it forward. Most teams are two levels behind where they think they are. We tell you exactly where you are, what's blocking the transition, and what the path forward looks like for your specific stack, team, and codebase.",
  },
  {
    number: "04",
    title: "Delivery Management",
    text: "We embed with client teams and run the programme that makes the transition happen. Not a report. Not a deck. Working pipelines, working practice, shipped. 11 years client-embedded at Cprime. Built and transferred teams at Nestlé and Dematic. Stakeholder management to C-suite. The capability most contractors lack.",
  },
  {
    number: "05",
    title: "AI Governance & Ethics",
    text: "AI-native adoption without governance is a liability. Published 70,000 words on AI governance, the EU AI Act, and the societal dynamics of automation. Trinity College Dublin AI Ethics CPD. NatWest board-level AI adoption recommendations. Governance built in from the start, not bolted on at the end.",
  },
  {
    number: "06",
    title: "DevOps & CI/CD",
    text: "Pipeline architecture, automation, and modernisation for teams operating at AI-native scale. AI-generated code at volume demands different testing strategies, review processes, and deployment gates than human-written code. DORA four key metrics as governance framework. Infrastructure as Code with Terraform and Bicep — versioned, tested, repeatable.",
  },
]

export default function CapabilitiesSection() {
  return (
    <section className="section" id="capabilities">
      <div style={CONTAINER}>
        <div className="section__header reveal">
          <div className="section__number">02</div>
          <div>
            <div className="section__subtitle">Capabilities</div>
            <h2 className="display-lg">Where I<br />Operate</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 reveal" style={{ gap: 0 }}>
          {CAPABILITIES.map((cap) => (
            <div key={cap.number} className="capability">
              <div className="capability__number">{cap.number}</div>
              <h3 className="capability__title">{cap.title}</h3>
              <p className="capability__text">{cap.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}