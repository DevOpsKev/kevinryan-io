import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Speaking',
  description:
    'Talks on AI-native software engineering, spec driven development, and the transition from traditional to autonomous development teams.',
}

const css = `
#speaking-root {
  font-family: 'Archivo', sans-serif;
  color: var(--grey-600);
  line-height: 1.6;
}

/* ── HERO ── */
.speaking-hero {
  background: var(--black);
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 140px clamp(1.5rem, 5vw, 6rem) 96px;
  position: relative;
  overflow: hidden;
}
.speaking-hero::after {
  content: '';
  position: absolute;
  right: -120px; top: -120px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(168,225,12,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.speaking-hero-inner {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
.speaking-hero-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 28px;
}
.speaking-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(72px, 12vw, 160px);
  line-height: .86;
  letter-spacing: 2px;
  color: var(--white);
}
.speaking-hero-sub {
  font-size: clamp(16px, 2vw, 21px);
  color: var(--grey-400);
  max-width: 720px;
  margin-top: 36px;
  line-height: 1.65;
}

/* ── INTRO SECTION ── */
.speaking-intro {
  background: var(--grey-100);
  padding: 112px clamp(1.5rem, 5vw, 6rem);
}
.speaking-intro-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.speaking-intro-text h2 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 5rem);
  color: var(--black);
  line-height: .88;
  letter-spacing: 1px;
  margin-bottom: 28px;
}
.speaking-intro-text p {
  font-size: 16px;
  color: var(--grey-600);
  line-height: 1.7;
  margin-bottom: 16px;
  max-width: 560px;
}
.speaking-intro-formats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.speaking-format-card {
  background: var(--white);
  border-left: 4px solid var(--accent);
  padding: 24px 20px;
}
.speaking-format-card h4 {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--black);
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.speaking-format-card p {
  font-size: 13px;
  color: var(--grey-600);
  line-height: 1.6;
}

/* ── TALKS SECTION ── */
.speaking-talks {
  background: var(--white);
  padding: 112px clamp(1.5rem, 5vw, 6rem);
}
.speaking-talks-inner {
  max-width: 1400px;
  margin: 0 auto;
}
.speaking-section-header {
  margin-bottom: 64px;
}
.speaking-section-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 6rem);
  color: var(--black);
  line-height: .88;
  letter-spacing: 1px;
  margin-top: 8px;
}

/* ── TALK CARDS ── */
.speaking-talk-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.speaking-talk-card {
  background: var(--black);
  border-left: 8px solid var(--accent);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  position: relative;
  overflow: hidden;
}
.speaking-talk-card::after {
  content: '';
  position: absolute;
  right: -60px; bottom: -60px;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(168,225,12,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.speaking-talk-card-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3.5px;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 20px;
}
.speaking-talk-card h3 {
  font-family: var(--font-display);
  font-size: clamp(40px, 4vw, 64px);
  color: var(--white);
  line-height: .88;
  letter-spacing: 1px;
}
.speaking-talk-card h3 span {
  color: var(--accent);
}
.speaking-talk-card-desc {
  font-size: 15px;
  color: var(--grey-400);
  line-height: 1.65;
  margin-top: 20px;
  max-width: 480px;
}

/* ── TALK METADATA ── */
.speaking-talk-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--grey-800);
}
.speaking-talk-meta-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--grey-600);
  text-transform: uppercase;
}
.speaking-talk-meta-val {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--white);
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* ── TALK LINKS ── */
.speaking-talk-links {
  display: flex;
  gap: 16px;
  margin-top: auto;
  padding-top: 32px;
}
.speaking-talk-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 12px 24px;
  transition: all 0.2s;
}
.speaking-talk-link-primary {
  background: var(--accent);
  color: var(--black);
}
.speaking-talk-link-primary:hover {
  background: var(--accent-dim);
}
.speaking-talk-link-secondary {
  border: 1px solid var(--grey-800);
  color: var(--grey-400);
}
.speaking-talk-link-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.speaking-talk-link .arrow {
  font-size: 16px;
  transition: transform 0.2s;
}
.speaking-talk-link:hover .arrow {
  transform: translateX(3px);
}

/* ── AVAILABILITY BANNER ── */
.speaking-availability {
  background: var(--dark);
  padding: 80px clamp(1.5rem, 5vw, 6rem);
  text-align: center;
}
.speaking-availability-inner {
  max-width: 720px;
  margin: 0 auto;
}
.speaking-availability h2 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: var(--white);
  line-height: .88;
  letter-spacing: 1px;
}
.speaking-availability p {
  font-size: 16px;
  color: var(--grey-400);
  line-height: 1.65;
  margin-top: 20px;
}
.speaking-availability-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 14px 32px;
  background: var(--accent);
  color: var(--black);
  transition: background 0.2s;
}
.speaking-availability-cta:hover {
  background: var(--accent-dim);
}

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .speaking-intro-inner { grid-template-columns: 1fr; gap: 48px; }
  .speaking-talk-cards { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .speaking-hero { min-height: 60vh; padding-top: 120px; }
  .speaking-intro-formats { grid-template-columns: 1fr; }
  .speaking-talk-card { padding: 32px 24px; }
  .speaking-talk-meta { grid-template-columns: 1fr; }
  .speaking-talk-links { flex-direction: column; }
  .speaking-talk-link { justify-content: center; }
}
`

const html = `
<!-- ═══ HERO ═══ -->
<section class="speaking-hero">
  <div class="speaking-hero-inner">
    <div class="speaking-hero-kicker">Speaking — Kevin Ryan</div>
    <h1>TALKS &amp;<br>SESSIONS</h1>
    <p class="speaking-hero-sub">Practical talks for engineering leaders on AI-native transformation, spec driven development, and what it actually takes to move teams from assisted coding to autonomous software delivery.</p>
  </div>
</section>

<!-- ═══ INTRO ═══ -->
<section class="speaking-intro">
  <div class="speaking-intro-inner">
    <div class="speaking-intro-text">
      <h2>BRING IT TO<br>YOUR TEAM.</h2>
      <p>I speak at conferences, company all-hands, engineering off-sites, and leadership sessions — in person or remote. Every talk draws on thirty years of hands-on delivery and the AI-native engineering work I'm doing right now.</p>
      <p>Fees depend on format, audience, and context. <a href="/#contact" style="color:var(--accent);text-decoration:none;font-weight:700;">Get in touch</a> and we'll work it out.</p>
    </div>
    <div class="speaking-intro-formats">
      <div class="speaking-format-card">
        <h4>PUBLIC SESSIONS</h4>
        <p>Conference talks, meetups, and community events. Standard session formats with Q&amp;A.</p>
      </div>
      <div class="speaking-format-card">
        <h4>INTERNAL SESSIONS</h4>
        <p>Company-specific sessions adapted to your stack, your team, and where you are on the AI-native spectrum.</p>
      </div>
      <div class="speaking-format-card">
        <h4>PRE-SALES &amp; BD</h4>
        <p>Joint sessions with consulting partners and associates. Position your offering alongside the methodology.</p>
      </div>
      <div class="speaking-format-card">
        <h4>CUSTOM FORMAT</h4>
        <p>Half-day workshops, executive briefings, or panel appearances. Shaped to what you need.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══ TALKS ═══ -->
<section class="speaking-talks">
  <div class="speaking-talks-inner">
    <div class="speaking-section-header">
      <h2 class="speaking-section-title">THE TALKS.</h2>
    </div>

    <div class="speaking-talk-cards">

      <!-- ── THE DARK FACTORY ── -->
      <div class="speaking-talk-card">
        <div class="speaking-talk-card-kicker">Talk</div>
        <h3>THE DARK<br><span>FACTORY</span></h3>
        <p class="speaking-talk-card-desc">The gap between AI-native software teams and everyone else — and what it takes to cross it. Dan Shapiro's Five Levels framework, the METR evidence, and a clear migration path from assisted coding to autonomous delivery.</p>

        <div class="speaking-talk-meta">
          <div>
            <div class="speaking-talk-meta-label">Format</div>
            <div class="speaking-talk-meta-val">Talk + Q&amp;A</div>
          </div>
          <div>
            <div class="speaking-talk-meta-label">Duration</div>
            <div class="speaking-talk-meta-val">45 + 15 min</div>
          </div>
          <div>
            <div class="speaking-talk-meta-label">Audience</div>
            <div class="speaking-talk-meta-val">Engineering Leaders</div>
          </div>
          <div>
            <div class="speaking-talk-meta-label">Delivery</div>
            <div class="speaking-talk-meta-val">In-Person or Remote</div>
          </div>
        </div>

        <div class="speaking-talk-links">
          <a href="/speaking/dark-factory" target="_blank" rel="noopener" class="speaking-talk-link speaking-talk-link-primary">
            Session Brief <span class="arrow">→</span>
          </a>
          <a href="/speaking/dark-factory/deck" target="_blank" rel="noopener" class="speaking-talk-link speaking-talk-link-secondary">
            View Slides <span class="arrow">→</span>
          </a>
        </div>
      </div>

      <!-- ── SPEC DRIVEN DEVELOPMENT ── -->
      <div class="speaking-talk-card">
        <div class="speaking-talk-card-kicker">Talk</div>
        <h3>SPEC DRIVEN<br><span>DEVELOPMENT</span></h3>
        <p class="speaking-talk-card-desc">A practical method for AI-native software engineering. One spec. Two agents. Five artefacts. Complete traceability from intent to verification. The methodology behind the book.</p>

        <div class="speaking-talk-meta">
          <div>
            <div class="speaking-talk-meta-label">Format</div>
            <div class="speaking-talk-meta-val">Talk + Q&amp;A</div>
          </div>
          <div>
            <div class="speaking-talk-meta-label">Duration</div>
            <div class="speaking-talk-meta-val">45 + 15 min</div>
          </div>
          <div>
            <div class="speaking-talk-meta-label">Audience</div>
            <div class="speaking-talk-meta-val">Engineers &amp; Tech Leads</div>
          </div>
          <div>
            <div class="speaking-talk-meta-label">Delivery</div>
            <div class="speaking-talk-meta-val">In-Person or Remote</div>
          </div>
        </div>

        <div class="speaking-talk-links">
          <a href="/speaking/spec-driven-development" target="_blank" rel="noopener" class="speaking-talk-link speaking-talk-link-primary">
            Session Brief <span class="arrow">→</span>
          </a>
          <a href="/speaking/spec-driven-development/deck" target="_blank" rel="noopener" class="speaking-talk-link speaking-talk-link-secondary">
            View Slides <span class="arrow">→</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══ AVAILABILITY ═══ -->
<section class="speaking-availability">
  <div class="speaking-availability-inner">
    <h2>BOOK A SESSION</h2>
    <p>Available for conference talks, company all-hands, engineering off-sites, and leadership sessions. Remote or in-person. Talks can be adapted to your audience and context.</p>
    <a href="/#contact" class="speaking-availability-cta">Get in Touch <span style="font-size:16px;">→</span></a>
  </div>
</section>
`

export default function SpeakingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        id="speaking-root"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
