import { CONTAINER } from "@/lib/constants"

export default function SpecMcpSection() {
  return (
    <>
      <section className="specmcp" id="specmcp">
        <div className="specmcp__glow specmcp__glow--1" />
        <div className="specmcp__glow specmcp__glow--2" />
        <div className="specmcp__inner" style={CONTAINER}>

          {/* Label bar */}
          <div className="specmcp__label-bar reveal">
            <div className="specmcp__section-tag">07</div>
            <div className="specmcp__product-badge">
              <span className="pulse-dot" />
              Launching 2026
            </div>
          </div>

          {/* Hero: headline + terminal */}
          <div className="specmcp__hero reveal">
            <div>
              <div className="specmcp__logo">
                <div className="specmcp__logo-icon">S</div>
                specmcp.ai
              </div>
              <h2 className="specmcp__title">
                The coordination layer<br />for <span className="smcp-highlight">multi-agent</span> development
              </h2>
              <p className="specmcp__desc">
                A managed MCP server that keeps multiple AI agents coherent. Shared specs, versioned decisions, one source of truth — so every agent builds the same thing.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="https://specmcp.ai" target="_blank" rel="noopener noreferrer" className="specmcp__cta">
                  Get Early Access ↗
                </a>
                <a href="https://sddbook.com" target="_blank" rel="noopener noreferrer" className="specmcp__cta-secondary">
                  Read the methodology
                </a>
              </div>
            </div>
            <div className="specmcp__terminal">
              <div className="specmcp__terminal-bar">
                <div className="specmcp__terminal-dot" />
                <div className="specmcp__terminal-dot" />
                <div className="specmcp__terminal-dot" />
                <div className="specmcp__terminal-title">3 agents — 1 spec — specmcp</div>
              </div>
              <div className="specmcp__terminal-body">
                <div><span className="t-comment">{'// Three agents. Same spec. No drift.'}</span></div>
                <div><span className="t-agent-a">[agent:implementer]</span> <span className="t-muted">→</span> <span className="t-key">get_spec</span>(<span className="t-string">&quot;auth-service-v2&quot;</span>)</div>
                <div><span className="t-agent-b">[agent:tester]</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-muted">→</span> <span className="t-key">get_spec</span>(<span className="t-string">&quot;auth-service-v2&quot;</span>)</div>
                <div><span className="t-agent-c">[agent:reviewer]</span> &nbsp;&nbsp;<span className="t-muted">→</span> <span className="t-key">get_spec</span>(<span className="t-string">&quot;auth-service-v2&quot;</span>)</div>
                <div>&nbsp;</div>
                <div><span className="t-comment">{'// All read the same canonical version'}</span></div>
                <div><span className="t-muted">{'{'}</span> <span className="t-key">spec</span>: <span className="t-string">&quot;auth-service-v2&quot;</span>, <span className="t-key">version</span>: <span className="t-string">&quot;1.4.2&quot;</span>,</div>
                <div>&nbsp; <span className="t-key">agents_reading</span>: <span className="t-muted">3,</span> <span className="t-key">drift</span>: <span className="t-string">&quot;none&quot;</span> <span className="t-muted">{'}'}</span></div>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="specmcp__features reveal">
            <div className="specmcp__feature">
              <div className="specmcp__feature-icon">🤝</div>
              <h3>Agent Coordination</h3>
              <p>Implementer, tester, reviewer — all reading the same spec version. Prevents agents contradicting each other or drifting from intent.</p>
            </div>
            <div className="specmcp__feature">
              <div className="specmcp__feature-icon">🔌</div>
              <h3>MCP Native</h3>
              <p>Works instantly with Claude Code, Cursor, Windsurf, and any MCP-compatible AI tool. Drop in, no config.</p>
            </div>
            <div className="specmcp__feature">
              <div className="specmcp__feature-icon">🔒</div>
              <h3>Role-Scoped Access</h3>
              <p>Define which agents can read specs and which can write them. The spec is a controlled artefact, not a free-for-all.</p>
            </div>
          </div>

          {/* Pillars — inline styles, no new CSS classes needed */}
          <div className="reveal" style={{ marginTop: '80px' }}>
            <h3 style={{
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 700,
              letterSpacing: '-0.8px',
              lineHeight: 1.2,
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              The spec is the contract.<br />Every agent answers to it.
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}>
              {[
                {
                  num: '01',
                  title: 'Multi-Agent Coherence',
                  body: 'Without a shared spec, parallel agents hallucinate intent independently. specmcp gives every agent the same ground truth — so divergence signals a real problem, not a coordination failure.',
                },
                {
                  num: '02',
                  title: 'Shared Enterprise Specs',
                  body: "Publish org-wide design guidelines, API standards, and architecture patterns as shared specs. Every team's AI tools inherit your guardrails automatically.",
                },
                {
                  num: '03',
                  title: 'Agentic Provenance',
                  body: 'Know exactly which spec version each agent used when it generated code or made a decision. Full traceability from spec to output, every time.',
                },
                {
                  num: '04',
                  title: 'Audit Everything',
                  body: 'Which agent read what spec, when, and from which tool. Complete logs for compliance, debugging, and understanding how AI agents interact with your specifications.',
                },
              ].map(({ num, title, body }) => (
                <div key={num} style={{
                  background: 'var(--smcp-surface, rgba(255,255,255,0.03))',
                  border: '1px solid var(--smcp-border, rgba(255,255,255,0.08))',
                  borderRadius: '14px',
                  padding: '28px 24px',
                }}>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    color: 'var(--smcp-accent, #6ee7b7)',
                    marginBottom: '12px',
                  }}>{num}</div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '-0.3px',
                    marginBottom: '10px',
                  }}>{title}</h4>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
                    opacity: 0.6,
                  }}>{body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
