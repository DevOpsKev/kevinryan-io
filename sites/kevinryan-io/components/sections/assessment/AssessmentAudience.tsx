import Container from '@/components/Container'

const AUDIENCES = [
  { n: '01', title: 'CTOs & VPs ENGINEERING', text: "You've invested in AI tooling. Adoption is patchy. You need evidence-based guidance on where to invest next and a framework to justify that investment to the board." },
  { n: '02', title: 'HEADS OF PLATFORM', text: "Your platform is the distribution layer for AI's benefits. This assessment shows where your platform is amplifying value — and where it's creating bottlenecks." },
  { n: '03', title: 'ENGINEERING MANAGERS', text: 'Your teams are using AI but results are inconsistent. You need a diagnostic that names the gaps and a workshop that gets your team aligned on what to fix first.' },
]

export default function AssessmentAudience() {
  return (
    <section className="section section--sink" id="audience" data-accent="magenta">
      <Container>
        <div className="sec-head">
          <span className="sec-mark">05 · Audience</span>
          <h1 className="t-h1">WHO THIS IS FOR.</h1>
        </div>

        <div className="cells cells--3">
          {AUDIENCES.map((a) => (
            <div className="cell" key={a.title}>
              <span className="cell__n">{a.n}</span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
