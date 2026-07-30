import Container from '@/components/Container'

/**
 * Static keyword band. This was a scrolling marquee. The theme requires
 * that motion responds to input, so the animation was removed and the
 * same content is set as a hairline band. See theme-spec.md B28.
 */
const ITEMS = [
  "Systems thinking", "AI-Native Engineering", "Platform Engineering",
  "Specification quality", "Agent orchestration", "Deterministic automation",
  "Enterprise delivery", "Cloud-native architecture", "CI/CD", "Kubernetes",
]

export default function TickerBar() {
  return (
    <div className="band">
      <Container>
        <div className="band__inner">
          {ITEMS.map((item) => (
            <span className="band__item" key={item}>{item}</span>
          ))}
        </div>
      </Container>
    </div>
  )
}
