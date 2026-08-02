import Container from '@/components/Container'

/**
 * The three propositions, as a Venn diagram.
 *
 * Built in HTML and CSS only, no SVG and no image, so the diagram
 * inherits the theme and stays live text for search and screen
 * readers. The geometry lives in globals.css under PROPOSITIONS
 * VENN; every offset there is a stage pixel derived from a radius
 * of 180 and a centre separation of 170.
 */

const SETS = [
  { k: 'a', title: 'AI-Native Engineering', n: 'Proposition 01' },
  { k: 'b', title: 'Digital Sovereignty', n: 'Proposition 02' },
  { k: 'c', title: 'Ethical Technology', n: 'Proposition 03' },
] as const

const LUNES = [
  { k: 'ab', head: 'Sovereign delivery', body: ['In jurisdiction,', 'at speed'] },
  { k: 'ac', head: 'People centric', body: ['Maximising', 'human potential'] },
  { k: 'bc', head: 'Compliance by design', body: ['Structure,', 'not policy'] },
] as const

const PROPOSITIONS = [
  {
    n: '01',
    accent: 'teal',
    title: 'AI-Native Engineering',
    body:
      'Building software with AI as the primary implementer rather than an autocomplete. ' +
      'The specification is the source of authority, and the bottleneck, not the code.',
    foot: 'Methodology',
  },
  {
    n: '02',
    accent: 'yellow',
    title: 'Digital Sovereignty',
    body:
      'Jurisdictional and architectural control over infrastructure, data flow and models. ' +
      'Forkability under an OSI-approved licence, and control of data flow at runtime.',
    foot: 'Architecture',
  },
  {
    n: '03',
    accent: 'magenta',
    title: 'Ethical Technology',
    body:
      'Provenance, fair economic distribution and regulatory compliance. The Distributed ' +
      'Equity Licence and EU AI Act Article 4 as the working floor.',
    foot: 'Governance',
  },
] as const

/* Set one glyph per element so the name can be tracked out to the
   exact width of the mark above it. aria-label carries the readable
   string, since the glyphs on their own are not one. */
const NAME = 'Kevin Ryan & Associates'

export default function PropositionsHero() {
  return (
    <section className="section phero" id="top" data-accent="blue">
      <Container>
        <div className="phero__head">
          <h1 className="wordmark">KR<i>&amp;</i>A</h1>
          <p className="phero__name" aria-label={NAME}>
            {NAME.split('').map((ch, i) =>
              ch === ' '
                ? <span className="sp" key={`${i}-sp`} aria-hidden="true" />
                : <span key={`${i}-${ch}`} aria-hidden="true">{ch}</span>,
            )}
          </p>
        </div>

        <div className="phero__venn venn">
          <div className="venn__stage">
            {SETS.map((s) => (
              <div key={`set-${s.k}`} className={`venn__set venn__set--${s.k}`} />
            ))}

            {SETS.map((s) => (
              <div key={`title-${s.k}`} className={`venn__title venn__title--${s.k}`}>
                {s.title}
                <i>{s.n}</i>
              </div>
            ))}

            {LUNES.map((l) => (
              <div key={l.k} className={`venn__lune venn__lune--${l.k}`}>
                <b>{l.head}</b>
                {l.body[0]}
                <br />
                {l.body[1]}
              </div>
            ))}

            <div className="venn__core">
              <p className="wordmark">KR<i>&amp;</i>A</p>
            </div>

            <div className="venn__arrow" />
            <div className="venn__caller">
              <b>We are here</b>
            </div>
          </div>
        </div>

        <div className="phero__cells cells cells--3">
          {PROPOSITIONS.map((p) => (
            <div className="cell" key={p.n} data-accent={p.accent}>
              <div className="cell__n">{p.n}</div>
              <h2 className="t-h3">{p.title}</h2>
              <p>{p.body}</p>
              <div className="cell__grow" />
              <div className="cell__foot">{p.foot}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
