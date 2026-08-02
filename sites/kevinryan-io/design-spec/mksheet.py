#!/usr/bin/env python3
"""Regenerates design-spec/theme-sheet.html for 002-site-theme.

The component CSS is app/globals.css verbatim, with the @theme block
lifted into :root so the custom properties resolve without Tailwind.
Only the specimen chrome is authored here. That is deliberate: the
3.0.0 sheet carried a hand-maintained copy of the component CSS, which
drifted, which is what open item O8 recorded.
"""
import re, sys

GLOBALS = "../app/globals.css"
OLD     = "theme-sheet.html"        # read for its embedded fonts and its blocks
CHROME  = "sheet-chrome.css"
OUT     = "theme-sheet.html"

old = open(OLD).read()
fonts = "\n".join(re.findall(r'@font-face\{[^}]*\}', old))
css   = open(GLOBALS).read()
theme = re.search(r"@theme \{(.*?)\n\}", css, re.S).group(1)
shim  = ":root{\n" + "\n".join(l for l in theme.split("\n") if re.match(r"\s*--", l)) + "\n}"
css   = css.replace('@import "tailwindcss";', '')
chrome = open(CHROME).read()

# ── body: keep every 3.0.0 block, add the 3.1.0 ones ──────────────
body = old[old.index('<body>')+len('<body>'):old.rindex('</body>')]
body = body.replace('002-site-theme · v3.0.0 · locked', '002-site-theme · v3.1.0 · locked')

# the type specimen table is wider than a phone and was pushing the page
body = body.replace('<table class="scale">', '<div class="scroll-x"><table class="scale">')
body = body.replace('</table>', '</table></div>')
body = body.replace(
  'system renders here. If something on the site is not on this sheet, it is not in the system.',
  'system renders here. If something on the site is not on this sheet, it is not in the system.\n      The component CSS below is app/globals.css verbatim, so this sheet cannot drift from it.')

WORDMARK = '''
  <!-- ══ WORDMARK ══ -->
  <section class="block" data-accent="blue">
    <h2>Wordmark and lockup · B34, B35</h2>
    <div class="phero__head" style="display:inline-block">
      <p class="wordmark" style="font-size:5rem">KR<i>&amp;</i>A</p>
      <p class="phero__name">%s</p>
    </div>
    <p class="note">
      Live text, never an image on this site. The ampersand reads --sec, so it takes the accent of
      whatever section it sits in: <span class="wordmark" style="font-size:var(--text-h2)" data-accent="teal">KR<i>&amp;</i>A</span>
      <span class="wordmark" style="font-size:var(--text-h2)" data-accent="orange">KR<i>&amp;</i>A</span>
      <span class="wordmark" style="font-size:var(--text-h2)" data-accent="magenta">KR<i>&amp;</i>A</span><br>
      The name locks to the mark's ink, not its box. Space Grotesk carries a 0.066em left bearing on
      the K and 0.018em on the right of the A, so the lockup insets by 2.78%% and 0.76%% of the width.
    </p>
  </section>
''' % "".join('<span class="sp"></span>' if ch == ' '
              else '<span>%s</span>' % ('&amp;' if ch == '&' else ch)
              for ch in 'Kevin Ryan & Associates')

SETS = [("a", "AI-Native Engineering", "Proposition 01"),
        ("b", "Digital Sovereignty",   "Proposition 02"),
        ("c", "Ethical Technology",    "Proposition 03")]
LUNES = [("ab", "Sovereign delivery",   "In jurisdiction,", "at speed"),
         ("ac", "People centric",       "Maximising",       "human potential"),
         ("bc", "Compliance by design", "Structure,",       "not policy")]
CARDS = [("01", "teal",    "AI-Native Engineering", "Methodology"),
         ("02", "yellow",  "Digital Sovereignty",   "Architecture"),
         ("03", "magenta", "Ethical Technology",    "Governance")]

VENN = '''
  <!-- ══ PROPOSITIONS VENN ══ -->
  <section class="block" data-accent="blue">
    <h2>Propositions Venn · B37</h2>
    <div class="venn" style="--venn-nudge:0px">
      <div class="venn__stage">
%s
%s
%s
        <div class="venn__core"><p class="wordmark">KR<i>&amp;</i>A</p></div>
        <div class="venn__arrow"></div>
        <div class="venn__caller"><b>We are here</b></div>
      </div>
    </div>
    <p class="note">
      HTML and CSS only. No SVG, no image, no script. A fixed 900 by 700 space that scales as one
      unit, built from a radius of 180 and a centre separation of 170. The overlap captions sit on
      the pole of inaccessibility of their region, the arrow is one border side routed through the
      only corridor that crosses no caption, and the head is a clipped dart hinged on its own tip.
      Set colours are fixed, not section accents: they are a legend.
    </p>
  </section>

  <!-- ══ SET CARDS ══ -->
  <section class="block" data-accent="blue">
    <h2>Set cards · B38</h2>
    <div class="phero__cells cells cells--3" style="margin-top:0">
%s
    </div>
    <p class="note">
      A card that restates a set quotes that set's construction rather than adding a device. The top
      hairline uses the same expression as the ring, color-mix(in srgb, var(--sec) 58%%, transparent),
      so it is the same colour and not an approximation.
    </p>
  </section>
''' % (
  "\n".join('        <div class="venn__set venn__set--%s"></div>' % k for k, _, _ in SETS),
  "\n".join('        <div class="venn__title venn__title--%s">%s<i>%s</i></div>' % (k, t, n) for k, t, n in SETS),
  "\n".join('        <div class="venn__lune venn__lune--%s"><b>%s</b>%s<br>%s</div>' % l for l in LUNES),
  "\n".join('''      <div class="cell" data-accent="%s">
        <div class="cell__n">%s</div>
        <h3>%s</h3>
        <p>One card per set, carrying that set's colour on its top hairline.</p>
        <div class="cell__grow"></div>
        <div class="cell__foot">%s</div>
      </div>''' % (a, n, t, f) for n, a, t, f in CARDS),
)

FORM = '''  <!-- ══ FORM ══ -->
  <section class="block" data-accent="blue">
    <h2>Form controls · B39, B40</h2>
    <div class="grid2">
      <div class="form-panel">
        <div class="form-panel__hd"><span class="label">Every control in the system</span></div>
        <div class="form-panel__bd">
          <div class="frow">
            <div class="fgroup">
              <label class="label flabel" for="ts-name">Text</label>
              <input class="field" id="ts-name" type="text" placeholder="Your name">
            </div>
            <div class="fgroup">
              <label class="label flabel" for="ts-email">Email, filled</label>
              <input class="field" id="ts-email" type="email" value="you@company.com">
            </div>
          </div>
          <div class="fgroup">
            <label class="label flabel" for="ts-role">Select, on its empty option</label>
            <select class="field" id="ts-role" required>
              <option value="" disabled selected>Select your role</option>
              <option>CTO / VP Engineering</option>
              <option>Head of Platform / DevOps</option>
            </select>
          </div>
          <div class="fgroup">
            <label class="label flabel" for="ts-msg">Textarea <span class="fnote">(optional)</span></label>
            <textarea class="field" id="ts-msg" rows="3" placeholder="Tell us briefly about your situation."></textarea>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn--primary" type="button">Primary</button>
            <button class="btn" type="button">Secondary</button>
            <button class="btn" type="button" disabled>Disabled</button>
          </div>
          <p class="note" style="margin-top:var(--sp-3)">
            color-scheme is dark, so the select popup, the caret and the scrollbars follow the page
            rather than the OS. appearance is none on the field, the select and the button, so Safari
            adds no radius and no inner shadow. Autofill is overridden with an inset shadow, the only
            mechanism Chrome honours. Focus takes the ring inwards, because an outline at 3px offset
            collides with the panel edge. Invalid uses :user-invalid, so it fires after interaction.
          </p>
        </div>
      </div>
      <div class="empty-state">
        <h3 style="font-family:var(--font-display);font-weight:600;font-size:var(--text-h3);margin:0 0 var(--sp-1)">Nothing here yet</h3>
        <p style="color:var(--ink-3);font-size:var(--text-ui);margin:0">The dashed border appears on the empty state and nowhere else in the system.</p>
      </div>
    </div>
  </section>
'''

# splice: wordmark after the type scale block, venn and cards before the form,
# and the form block replaced wholesale
anchor = body.index('  <!-- ══ FORM ══ -->')
end    = body.index('  <!-- ══ CONSTRAINTS ══ -->')
body   = body[:anchor] + VENN + "\n" + FORM + "\n" + body[end:]

m = re.search(r'(  <!-- ══ PROSE ══ -->|  <!-- ══ CONTROLS ══ -->)', body)
insert_at = m.start() if m else body.index('  <!-- ══ FORM ══ -->')
body = body[:insert_at] + WORDMARK + "\n" + body[insert_at:]

# new constraints, matching the new behaviour statements
body = body.replace('      <li>One primary button per view.</li>',
'''      <li>One primary button per view.</li>
      <li>The wordmark is live text. Its ampersand reads the section accent.</li>
      <li>One h1 per page. Section heads are h2.</li>
      <li>Native form chrome is suppressed. color-scheme is dark.</li>
      <li>/kevin speaks as a person. Every other page speaks as the firm.</li>''')

body = body.replace('same faces through @fontsource. No request leaves the origin to render type.',
'''same faces through @fontsource. No request leaves the origin to render type.<br>
      The component CSS in this file is app/globals.css verbatim. Regenerate with design-spec/mksheet.py
      rather than editing by hand.''')

open(OUT, "w").write(
  '<!DOCTYPE html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  '<title>Theme sheet · Kevin Ryan &amp; Associates · 002-site-theme v3.1.0</title>\n'
  '<style>' + fonts + '</style>\n'
  '<style>' + shim + '</style>\n'
  '<style>' + css + '</style>\n'
  '<style>' + chrome + '</style>\n'
  '</head>\n<body>' + body + '</body>\n</html>\n')
print("theme-sheet.html", len(open(OUT).read()), "bytes")
