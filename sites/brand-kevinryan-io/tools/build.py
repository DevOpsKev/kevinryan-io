#!/usr/bin/env python3
"""Builds public/index.html for the Kevin Ryan & Associates brand book.

Repetitive blocks (swatches, accent map, asset library) are generated from
the same data that produced the assets, so the document cannot drift from
what is actually on disk.
"""
import os, glob, html

A = "public/assets"

# ── contrast ────────────────────────────────────────────────────────────
def lum(h):
    h = h.lstrip('#'); r, g, b = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    f = lambda c: c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)
def cr(a, b):
    l1, l2 = sorted([lum(a), lum(b)], reverse=True)
    return (l1+0.05)/(l2+0.05)

BG, SINK, PANEL, RAISE, WW = "#222436", "#1a1b26", "#1f2335", "#2f334d", "#F5F3EF"

SURFACES = [
    ("Background",  "--bg",          BG,        "bg",             "Section ground and page default"),
    ("Sunken",      "--bg-sink",     SINK,      "page_bg",        "Alternating sections, footer, code"),
    ("Panel",       "--bg-panel",    PANEL,     "bg_dark",        "Wells, form panels, feature cells"),
    ("Raised",      "--bg-raise",    RAISE,     "bg_highlight",   "Hover only"),
    ("Hairline",    "--line",        "#3b4261", "fg_gutter",      "Every structural rule, 1px"),
    ("Rule strong", "--line-strong", "#444a73", "terminal_black", "Table head, field border"),
]
FOREGROUNDS = [
    ("Ink",       "--ink",     "#c8d3f5", "fg",          "Headings, emphasis, figures"),
    ("Ink 2",     "--ink-2",   "#a9b1d6", "fg_dark",     "Body copy"),
    ("Ink 3",     "--ink-3",   "#828bb8", "change_gray", "Labels and metadata. Muted floor"),
    ("Ink 4",     "--ink-4",   "#737aa2", "dark5",       "Decorative only. Never type"),
    ("Comment",   "--comment", "#636da6", "comment",     "Decorative only. Never type"),
]
ACCENTS = [
    ("Blue",     "--blue",        "#82aaff", "Interaction, cover, contact, top bar"),
    ("Blue 1",   "--blue1",       "#7aa2f7", "Clients"),
    ("Blue 0",   "--blue0",       "#3d59a1", "Borders and markers only"),
    ("Cyan",     "--cyan",        "#86e1fc", "About, infrastructure"),
    ("Cyan 1",   "--cyan1",       "#7dcfff", "Documentation"),
    ("Teal",     "--teal",        "#4fd6be", "Capabilities, specifications"),
    ("Green",    "--green",       "#c3e88d", "Certifications, observability, live state"),
    ("Yellow",   "--yellow",      "#ffc777", "Published work, sites, draft state"),
    ("Orange",   "--orange",      "#ff966c", "Enterprise delivery, CI and CD"),
    ("Red",      "--red",         "#ff757f", "The problem, risk, failure state"),
    ("Magenta",  "--magenta",     "#c099ff", "Career arc, decision records"),
    ("Red 1",    "--red1",        "#c53b53", "Markers only"),
]
PRINT = [
    ("Print ink",     "--p-ink",     "#222436"),
    ("Print blue",    "--p-blue",    "#3D5DA4"),
    ("Print cyan",    "--p-cyan",    "#00697F"),
    ("Print teal",    "--p-teal",    "#006D5F"),
    ("Print green",   "--p-green",   "#4C6913"),
    ("Print yellow",  "--p-yellow",  "#865901"),
    ("Print orange",  "--p-orange",  "#A04822"),
    ("Print red",     "--p-red",     "#AD3543"),
    ("Print magenta", "--p-magenta", "#714DA3"),
]

# ampersand rotation. The allowlist plus the neutral fallback.
AMP_MAP = [
    ("blue",    "#82aaff", "Default, cover, contact"),
    ("cyan1",   "#7dcfff", "Documentation"),
    ("cyan",    "#86e1fc", "About, infrastructure"),
    ("teal",    "#4fd6be", "Capabilities, specifications"),
    ("orange",  "#ff966c", "Enterprise delivery, CI and CD"),
    ("magenta", "#c099ff", "Career arc, decision records"),
    ("ink",     "#c8d3f5", "Neutral fallback"),
]

def swatch(name, tok, hexv, src, use, ground=BG, surface=False):
    ratio = cr(hexv, ground)
    cls = "swatch swatch--surface" if surface else "swatch"
    if surface:
        step = cr(hexv, BG)
        meta = f'<span>{src}</span><span class="ratio">{step:.2f}:1 vs bg</span>'
    else:
        cls_r = "ratio ratio--pass" if ratio >= 4.5 else "ratio"
        meta = f'<span>{src}</span><span class="{cls_r}">{ratio:.1f}:1</span>'
    return f'''      <div class="{cls}" style="--c:{hexv}">
        <div class="swatch__chip"></div>
        <div class="swatch__body">
          <div class="swatch__name">{name}</div>
          <div class="swatch__tok">{tok} · {hexv.upper()}</div>
          <div class="swatch__meta">{meta}</div>
          <p class="swatch__tok" style="margin:8px 0 0;color:var(--ink-3);letter-spacing:0;font-family:var(--font-body);font-size:var(--text-caption);line-height:1.5">{use}</p>
        </div>
      </div>'''

def swatch_print(name, tok, hexv):
    ratio = cr(hexv, WW)
    return f'''      <div class="swatch" style="--c:{hexv}">
        <div class="swatch__chip"></div>
        <div class="swatch__body">
          <div class="swatch__name">{name}</div>
          <div class="swatch__tok">{tok} · {hexv.upper()}</div>
          <div class="swatch__meta"><span>on #F5F3EF</span><span class="ratio">{ratio:.1f}:1</span></div>
        </div>
      </div>'''

surfaces_html   = "\n".join(swatch(n, t, h, s, u, surface=True) for n, t, h, s, u in SURFACES)
foregrounds_html= "\n".join(swatch(n, t, h, s, u) for n, t, h, s, u in FOREGROUNDS)
accents_html    = "\n".join(swatch(n, t, h, "on bg", u) for n, t, h, u in ACCENTS)
print_html      = "\n".join(swatch_print(n, t, h) for n, t, h in PRINT)

amap_html = "\n".join(
f'''      <div class="amap__cell" data-accent="{'blue' if k=='ink' else k}">
        <img src="assets/kra-wordmark-{k}.svg" alt="KR&amp;A with the {k} ampersand" loading="lazy">
        <span class="ctx">{ctx}</span>
        <span class="hex">{k.upper()} {hexv.upper()}</span>
      </div>''' for k, hexv, ctx in AMP_MAP)

# ── asset library ───────────────────────────────────────────────────────
def kb(p):
    b = os.path.getsize(p)
    return f"{b/1024:.0f} KB" if b >= 1024 else f"{b} B"

LIGHT_GROUND = ("black", "print", "light")

def asset_row(path, use, thumb=None):
    rel = path.replace("public/", "")
    name = os.path.basename(path)
    th = thumb or rel
    light = " asset__thumb--light" if any(t in name for t in LIGHT_GROUND) else ""
    return f'''      <a class="asset" href="{rel}" download>
        <span class="asset__thumb{light}"><img src="{th}" alt="" loading="lazy"></span>
        <span class="asset__name">{name}</span>
        <span class="asset__use">{use}</span>
        <span class="asset__go">{kb(path)} ↓</span>
      </a>'''

def group(title, rows):
    return f'''    <h3 style="margin-top:var(--sp-6)">{title}</h3>
    <div class="assets">
{chr(10).join(rows)}
    </div>'''

wordmark_svgs = sorted(glob.glob(f"{A}/kra-wordmark-*.svg"))
mark_svgs     = sorted(glob.glob(f"{A}/kra-mark-*.svg"))

USE_WORDMARK = {
 "live": "Inline, inherits --sec", "ink": "Neutral on dark", "print": "Warm white ground",
 "black": "Single colour, light", "white": "Single colour, dark",
}
rows_wordmark = [asset_row(p, USE_WORDMARK.get(os.path.basename(p)[13:-4], "Accent on dark"),
                 thumb=p.replace("public/", "").replace("-live.svg", "-blue.svg"))
                 for p in wordmark_svgs]

USE_MARK = {"light": "Warm white ground", "sink": "Sunken ground", "transparent": "Watermark, overlay"}
rows_mark = [asset_row(p, USE_MARK.get(os.path.basename(p)[9:-4], "Accent on dark")) for p in mark_svgs]

png_word = sorted(glob.glob(f"{A}/kra-wordmark-*-2000.png")) + \
           sorted(glob.glob(f"{A}/kra-wordmark-*-1200.png"))
rows_png_word = [asset_row(p, "Raster, transparent") for p in png_word]

png_mark = sorted(glob.glob(f"{A}/kra-mark-*-512.png")) + sorted(glob.glob(f"{A}/kra-mark-*-192.png"))
rows_png_mark = [asset_row(p, "App icon, avatar") for p in png_mark]

rows_social = [asset_row(p, "Social avatar") for p in sorted(glob.glob(f"{A}/kra-social-*.png"))]
rows_fav = [asset_row(p, "Browser favicon",
            thumb=("assets/kra-mark-light-64.png" if "light" in p else "assets/kra-mark-blue-64.png"))
            for p in sorted(glob.glob("public/favicon-*.ico"))]

assets_html = "\n".join([
    group("Wordmark, SVG masters", rows_wordmark),
    group("Mark, SVG masters", rows_mark),
    group("Wordmark rasters, 1200 and 2000px", rows_png_word),
    group("Mark rasters, 192 and 512px", rows_png_mark),
    group("Social avatars", rows_social),
    group("Favicons", rows_fav),
])

TOTAL = (len(glob.glob(f"{A}/*")) + len(glob.glob("public/favicon-*.ico")))

# ── document ────────────────────────────────────────────────────────────
DOC = f'''<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brand Book · Kevin Ryan &amp; Associates</title>
<meta name="description" content="Visual identity for Kevin Ryan &amp; Associates. Wordmark, contextual ampersand, Tokyo Night Moon palette, typography, grid and asset library.">
<meta name="theme-color" content="#222436">
<link rel="icon" href="favicon-dark.ico" sizes="any">
<link rel="icon" href="assets/kra-mark-blue-192.png" type="image/png">
<link rel="apple-touch-icon" href="assets/kra-mark-blue-192.png">
<meta property="og:title" content="Brand Book · Kevin Ryan &amp; Associates">
<meta property="og:description" content="Visual identity, version 3.0.">
<meta property="og:image" content="https://brand.kevinryan.io/assets/kra-social-dark-800.png">
<meta property="og:type" content="website">
<link rel="preload" href="fonts/space-grotesk-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/ibm-plex-mono-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="brand.css">
<script defer src="https://analytics.kevinryan.io/script.js" data-website-id="c41e7b1b-81ea-422d-ba9b-9ac2e73f2192"></script>
</head>
<body>

<nav class="topbar">
  <div class="topbar__nav">
    <a class="tool" href="#top">00 Home</a>
    <a class="tool" href="#wordmark">01 Wordmark</a>
    <a class="tool" href="#ampersand">02 Ampersand</a>
    <a class="tool" href="#mark">03 Mark</a>
    <a class="tool" href="#colour">04 Colour</a>
    <a class="tool" href="#type">05 Type</a>
    <a class="tool" href="#grid">06 Grid</a>
    <a class="tool" href="#structure">07 Structure</a>
    <a class="tool" href="#usage">08 Usage</a>
    <a class="tool tool--accent" href="#assets">09 Assets ↓</a>
  </div>
</nav>

<!-- ═══ COVER ═══ -->
<header class="section cover" id="top" data-accent="blue">
  <div class="shell">
    <div class="cover__grid">
      <div class="cover__main">
        <img class="cover__logo" src="assets/kra-wordmark-blue.svg" alt="Kevin Ryan &amp; Associates">
        <h1 style="max-width:none;font-size:clamp(2rem,4.4vw,3.25rem);margin-bottom:var(--sp-2)">Brand book</h1>
        <p class="t-meta" style="margin:0">Kevin Ryan &amp; Associates · Visual identity · Version 3.1.0</p>
        <hr class="rule--accent">
        <p class="t-lead prose">The identity for Kevin Ryan &amp; Associates. One wordmark, one mark, one palette
        taken from the development environment, and a set of rules that a person or an agent can apply without
        asking a further question.</p>
        <div class="actions">
          <a class="btn btn--primary" href="#assets">Asset library <small>{TOTAL} files</small></a>
          <a class="btn" href="https://kevinryan.io">kevinryan.io</a>
        </div>
      </div>
      <aside class="cover__side">
        <div class="meta-panel">
          <div class="row"><span class="k">Version</span><span class="v">3.1.0</span></div>
          <div class="row"><span class="k">Status</span><span class="v"><span class="pill pill--live">Current</span></span></div>
          <div class="row"><span class="k">Supersedes</span><span class="v">3.0.0 · 2.0, Feb 2026</span></div>
          <div class="row"><span class="k">Palette</span><span class="v">Tokyo Night Moon</span></div>
          <div class="row"><span class="k">Source</span><span class="v">dotfiles/.chezmoidata.yaml</span></div>
          <div class="row"><span class="k">Authority</span><span class="v">002-site-theme</span></div>
          <div class="row"><span class="k">Applies to</span><span class="v">kevinryan.io<br>docs.kevinryan.io<br>brand.kevinryan.io</span></div>
        </div>
        <div class="callout" style="margin-top:var(--sp-3)">
          <div class="callout__label">Changed in 3.1.0</div>
          <p>Two colour decisions moved after 3.0.0 was stamped, so a 3.0.0 copy of this book carries
          different hexes. The light lockup is now the site background with a print blue ampersand,
          having been black with teal. The print accent set is now derived rather than chosen: hue is
          held from the Moon value and lightness walked down until each clears 5.5:1 on warm white.
          Nothing else changed.</p>
        </div>
      </aside>
    </div>
  </div>
</header>

<div class="band">
  <div class="shell"><div class="band__inner">
    <span class="band__item">Wordmark</span><span class="band__item">Contextual accent</span>
    <span class="band__item">Tokyo Night Moon</span><span class="band__item">Space Grotesk</span>
    <span class="band__item">IBM Plex</span><span class="band__item">Zero radius</span>
    <span class="band__item">Hairline structure</span><span class="band__item">8px scale</span>
    <span class="band__item">Swiss International</span><span class="band__item">Self-hosted type</span>
  </div></div>
</div>

<!-- ═══ 00 CONTENTS ═══ -->
<section class="section section--sink" data-accent="blue">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">00</span>
      <h1>Contents</h1>
    </div>
    <div class="split split--start">
      <div>
        <a class="index-row" href="#wordmark"><span class="n">01</span><span class="t">The wordmark</span><span class="x">KR&amp;A</span></a>
        <a class="index-row" href="#ampersand"><span class="n">02</span><span class="t">The contextual ampersand</span><span class="x">7 accents</span></a>
        <a class="index-row" href="#mark"><span class="n">03</span><span class="t">The mark</span><span class="x">Diagonal split</span></a>
        <a class="index-row" href="#colour"><span class="n">04</span><span class="t">Colour</span><span class="x">Moon ramp</span></a>
        <a class="index-row" href="#type"><span class="n">05</span><span class="t">Typography</span><span class="x">3 families</span></a>
        <a class="index-row" href="#grid"><span class="n">06</span><span class="t">Grid and spacing</span><span class="x">8px</span></a>
        <a class="index-row" href="#structure"><span class="n">07</span><span class="t">Structure and motion</span><span class="x">Hairline</span></a>
        <a class="index-row" href="#usage"><span class="n">08</span><span class="t">Usage</span><span class="x">Do, do not</span></a>
        <a class="index-row" href="#assets"><span class="n">09</span><span class="t">Asset library</span><span class="x">{TOTAL} files</span></a>
      </div>
      <div class="callout">
        <div class="callout__label">How to read this</div>
        <p>Every value in this document is a token, not a description. Where a colour, size or space appears,
        the token name is printed beside it. Copy the token, not the value.</p>
        <p>The palette is not owned here. It is lifted verbatim from the Tokyo Night Moon block in the dotfiles
        repository, which is the same source the terminal, editor and cluster tooling read. If that block
        changes, this document changes with it.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══ 01 WORDMARK ═══ -->
<section class="section" id="wordmark" data-accent="blue">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">01</span>
      <h1>The wordmark</h1>
    </div>
    <div class="prose" style="margin-bottom:var(--sp-6)">
      <p>The wordmark is <strong>KR&amp;A</strong> set in Space Grotesk at weight 700, tracked to
      <code>-0.05em</code>. All four characters share one weight and one size. The ampersand takes
      <code>0.02em</code> of optical padding either side because its bowl sits tighter than the flat sides of
      the R and the A.</p>
      <p>The ampersand is the only glyph that carries colour. It is what separates the mark from plain text,
      so it is never dropped, never reweighted and never replaced with the word "and".</p>
    </div>

    <div class="spec-grid" style="margin-bottom:var(--sp-6)">
      <div class="spec">
        <div class="spec__stage"><img src="assets/kra-wordmark-blue.svg" alt="Wordmark on the section ground"></div>
        <div class="spec__foot"><span>Section ground</span><span class="hex">#222436</span></div>
      </div>
      <div class="spec">
        <div class="spec__stage spec__stage--sink"><img src="assets/kra-wordmark-blue.svg" alt="Wordmark on the sunken ground"></div>
        <div class="spec__foot"><span>Sunken ground</span><span class="hex">#1A1B26</span></div>
      </div>
      <div class="spec">
        <div class="spec__stage spec__stage--light"><img src="assets/kra-wordmark-print.svg" alt="Wordmark on warm white"></div>
        <div class="spec__foot"><span>Print ground</span><span class="hex">#F5F3EF</span></div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <h2>Clear space</h2>
        <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui)">Clear space is one cap height of
        the K on every side. Nothing intrudes into that zone: no rule, no edge, no other mark. The dashed
        boundary below is drawn to scale.</p>
        <div class="clearspace" style="margin-top:var(--sp-3)">
          <div class="clearspace__inner"><img src="assets/kra-wordmark-blue.svg" alt="Wordmark with its clear space drawn"></div>
          <div class="clearspace__note">Gutter = cap height of K</div>
        </div>
      </div>
      <div>
        <h2>Minimum size</h2>
        <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui)">The wordmark holds down to
        <strong>68px wide</strong> on screen and <strong>18mm</strong> in print. Below that the ampersand thins
        past the point where the colour registers, and the mark reads as plain text. Use the mark instead.</p>
        <div class="minsize" style="margin-top:var(--sp-3)">
          <figure><img src="assets/kra-wordmark-blue.svg" style="width:170px" alt="Wordmark at 170px"><figcaption>170px</figcaption></figure>
          <figure><img src="assets/kra-wordmark-blue.svg" style="width:110px" alt="Wordmark at 110px"><figcaption>110px</figcaption></figure>
          <figure><img src="assets/kra-wordmark-blue.svg" style="width:68px" alt="Wordmark at 68px"><figcaption class="ok">68px floor</figcaption></figure>
          <figure><img src="assets/kra-wordmark-blue.svg" style="width:44px" alt="Wordmark at 44px, below the floor"><figcaption class="no">44px too small</figcaption></figure>
        </div>
      </div>
    </div>

    <h2 style="margin-top:var(--sp-8)">Construction</h2>
    <table class="table">
      <thead><tr><th>Property</th><th>Value</th><th>Token</th></tr></thead>
      <tbody>
        <tr><td class="name">Face</td><td>Space Grotesk</td><td class="tok">--font-display</td></tr>
        <tr><td class="name">Weight</td><td>700, all four characters</td><td class="tok">700</td></tr>
        <tr><td class="name">Tracking</td><td>-0.05em</td><td class="tok">--track-display</td></tr>
        <tr><td class="name">Ampersand padding</td><td>0.02em either side</td><td class="tok">–</td></tr>
        <tr><td class="name">Letter colour</td><td>#C8D3F5 on dark, #222436 on light</td><td class="tok">--ink, --p-ink</td></tr>
        <tr><td class="name">Ampersand colour</td><td>Section accent</td><td class="tok">--sec</td></tr>
        <tr><td class="name">Aspect</td><td>2373 : 700</td><td class="tok">viewBox</td></tr>
        <tr><td class="name">Master format</td><td>SVG, outlined paths</td><td class="tok">.svg</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- ═══ 02 AMPERSAND ═══ -->
<section class="section section--sink" id="ampersand" data-accent="cyan1">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">02</span>
      <h1>The contextual ampersand</h1>
    </div>
    <div class="prose" style="margin-bottom:var(--sp-6)">
      <p>The page is syntax-highlighted. Each section owns one accent from the ramp and every accented thing
      inside it reads from the same variable. The ampersand is one of those things. It inherits
      <code>--sec</code> from the section it sits in, so the mark shifts colour as the reader moves down the
      page without a single per-page logo asset existing.</p>
      <p>Seven accents are in the rotation. The remainder of the ramp is reserved for section furniture and is
      not used on the mark, because at small sizes yellow and green sit close enough to ink that the ampersand
      stops reading as accented, and red reads as an error state rather than a section cue.</p>
    </div>

    <div class="amap" style="margin-bottom:var(--sp-6)">
{amap_html}
    </div>

    <div class="callout" data-accent="cyan1">
      <div class="callout__label">Implementation</div>
      <p>Use <code>kra-wordmark-live.svg</code>, which fills the letters with <code>currentColor</code> and the
      ampersand with <code>var(--sec)</code>. Inline it rather than loading it through an <code>img</code>
      element, because an external SVG cannot see the page's custom properties. The fixed-colour files exist
      for contexts outside the site, not for the site itself.</p>
    </div>
  </div>
</section>

<!-- ═══ 03 MARK ═══ -->
<section class="section" id="mark" data-accent="cyan">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">03</span>
      <h1>The mark</h1>
    </div>
    <div class="prose" style="margin-bottom:var(--sp-6)">
      <p>The mark is a square split on the diagonal. The upper left triangle is ink, the lower right is the
      accent, and a gap of 6.25% of the mark separates them. The whole figure is inset 16% from the edge of
      its ground, which is what keeps it legible as a favicon at 16px.</p>
      <p>It is not a monogram and carries no letterforms. Where the wordmark is too small to hold, this
      replaces it: favicons, app icons, avatars, watermarks and anything below 68px wide.</p>
    </div>

    <div class="spec-grid spec-grid--tight" style="margin-bottom:var(--sp-6)">
      <div class="spec"><div class="spec__stage"><img src="assets/kra-mark-blue.svg" style="width:132px" alt="Mark in blue"></div><div class="spec__foot"><span>Blue</span><span class="hex">#82AAFF</span></div></div>
      <div class="spec"><div class="spec__stage"><img src="assets/kra-mark-cyan.svg" style="width:132px" alt="Mark in cyan"></div><div class="spec__foot"><span>Cyan</span><span class="hex">#86E1FC</span></div></div>
      <div class="spec"><div class="spec__stage"><img src="assets/kra-mark-teal.svg" style="width:132px" alt="Mark in teal"></div><div class="spec__foot"><span>Teal</span><span class="hex">#4FD6BE</span></div></div>
      <div class="spec"><div class="spec__stage spec__stage--light"><img src="assets/kra-mark-light.svg" style="width:132px" alt="Mark on warm white"></div><div class="spec__foot"><span>Print</span><span class="hex">#3D5DA4</span></div></div>
    </div>

    <div class="cells cells--4">
      <div class="cell"><div class="cell__n">16 / 32 / 48</div><h3>Favicon</h3><p>ICO with three frames. Dark for the sites, light for anything rendered on a warm white ground.</p><div class="cell__grow"></div><div class="cell__foot cell__foot--file">favicon-dark.ico</div></div>
      <div class="cell"><div class="cell__n">192 / 512</div><h3>App icon</h3><p>PNG on the section ground. Android takes 192, the App Store takes 512.</p><div class="cell__grow"></div><div class="cell__foot cell__foot--file">kra-mark-blue-512.png</div></div>
      <div class="cell"><div class="cell__n">400 / 800</div><h3>Avatar</h3><p>Square, mark centred at 62% of the frame. LinkedIn, GitHub, Slack.</p><div class="cell__grow"></div><div class="cell__foot cell__foot--file">kra-social-dark-800.png</div></div>
      <div class="cell"><div class="cell__n">Any</div><h3>Watermark</h3><p>Transparent ground. Use at reduced opacity over a solid panel, never over a photograph.</p><div class="cell__grow"></div><div class="cell__foot cell__foot--file">kra-mark-transparent.svg</div></div>
    </div>
  </div>
</section>

<!-- ═══ 04 COLOUR ═══ -->
<section class="section section--sink" id="colour" data-accent="teal">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">04</span>
      <h1>Colour</h1>
    </div>
    <div class="prose" style="margin-bottom:var(--sp-6)">
      <p>One theme. Dark only. There is no light variant, no toggle and no automatic detection. Body text
      meets 7:1 against its background and muted text meets 4.5:1. Every ratio printed below is measured, not
      estimated.</p>
      <p>The Moon surfaces sit close together, so depth is carried by hairlines rather than by tonal contrast.
      The sunken surface exists to give alternating sections a visible step where the panel surface would be
      indistinguishable.</p>
    </div>

    <h2>Surfaces</h2>
    <div class="swatches" style="margin:var(--sp-3) 0 var(--sp-6)">
{surfaces_html}
    </div>

    <h2>Foregrounds</h2>
    <div class="swatches" style="margin:var(--sp-3) 0 var(--sp-6)">
{foregrounds_html}
    </div>

    <h2>Accents</h2>
    <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui);margin:var(--sp-2) 0 0">Every accent
    clears 4.5:1 on the section ground except blue&nbsp;0 and red&nbsp;1, which are borders and markers and
    never carry type.</p>
    <div class="swatches" style="margin:var(--sp-3) 0 var(--sp-6)">
{accents_html}
    </div>

    <h2>Print accents</h2>
    <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui);margin:var(--sp-2) 0 0">Every Moon
    accent falls below 4.5:1 on warm white, so print takes a darkened set. Hue is held from the Moon value and
    lightness is walked down until the colour clears 5.5:1, which is a derivation rather than a choice and can
    be rerun from <code>tools/printset.py</code>. Print ink is the site background itself, so the light lockup
    stays in the family instead of falling back to black, paired with print blue on the ampersand.</p>
    <div class="swatches" style="margin:var(--sp-3) 0 0">
{print_html}
    </div>
  </div>
</section>

<!-- ═══ 05 TYPE ═══ -->
<section class="section" id="type" data-accent="orange">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">05</span>
      <h1>Typography</h1>
    </div>
    <div class="prose" style="margin-bottom:var(--sp-6)">
      <p>Three families with fixed roles. Space Grotesk for display, headings and names. IBM Plex Sans for
      reading body only. IBM Plex Mono for all structure: numbers, metadata, tags, buttons, labels and table
      headers.</p>
      <p>Uppercase is set in the mono face and nowhere else. The display and body faces are never uppercased
      by CSS. All three are self-hosted as woff2. No request leaves the origin to render type, which is a
      sovereignty requirement rather than a performance one.</p>
    </div>

    <div class="cells cells--3" style="margin-bottom:var(--sp-8)">
      <div class="cell cell--feature">
        <div class="cell__tag">Display</div>
        <span class="cell__stat" style="font-size:3.5rem;letter-spacing:-.045em">Aa</span>
        <h3>Space Grotesk</h3><p>Weights 500, 600, 700. Headings, the wordmark, names and figures.</p>
        <div class="cell__grow"></div><div class="cell__foot cell__foot--file">--font-display</div>
      </div>
      <div class="cell">
        <div class="cell__tag">Body</div>
        <span class="cell__stat" style="font-family:var(--font-body);font-size:3.5rem;font-weight:400">Aa</span>
        <h3>IBM Plex Sans</h3><p>Weights 400, 600. Reading copy only. Never a label, never a number.</p>
        <div class="cell__grow"></div><div class="cell__foot cell__foot--file">--font-body</div>
      </div>
      <div class="cell">
        <div class="cell__tag">Mono</div>
        <span class="cell__stat" style="font-family:var(--font-mono);font-size:3.5rem;font-weight:400">Aa</span>
        <h3>IBM Plex Mono</h3><p>Weights 400, 500. Every label, tag, figure, button and table header.</p>
        <div class="cell__grow"></div><div class="cell__foot cell__foot--file">--font-mono</div>
      </div>
    </div>

    <h2>The scale</h2>
    <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui);margin:var(--sp-2) 0 var(--sp-4)">
    Eleven fixed steps. Two are fluid and clamped. Generated output uses these steps and no intermediate
    values.</p>

    <div class="type-row"><div class="type-row__meta"><b>--text-display</b>100px · clamped 44 to 100<br>Space Grotesk 700</div><div class="type-row__spec" style="font-family:var(--font-display);font-weight:700;font-size:var(--fluid-display);line-height:.92;letter-spacing:var(--track-display)">KR&amp;A</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-h1</b>44px · clamped 30 to 44<br>Space Grotesk 700</div><div class="type-row__spec" style="font-family:var(--font-display);font-weight:700;font-size:var(--fluid-h1);line-height:var(--lh-title);letter-spacing:var(--track-title)">Digital sovereignty</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-h2</b>24px<br>Space Grotesk 600</div><div class="type-row__spec" style="font-family:var(--font-display);font-weight:600;font-size:var(--text-h2);letter-spacing:var(--track-heading)">AI-native engineering</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-h3</b>21px<br>Space Grotesk 600</div><div class="type-row__spec" style="font-family:var(--font-display);font-weight:600;font-size:var(--text-h3);letter-spacing:var(--track-tight)">Specification quality is the bottleneck</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-lead</b>19px<br>IBM Plex Sans 400</div><div class="type-row__spec" style="font-size:var(--text-lead);line-height:var(--lh-lead);color:var(--ink-2)">A locked specification is the single source of authority.</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-read</b>17px<br>IBM Plex Sans 400</div><div class="type-row__spec" style="font-size:var(--text-read);line-height:var(--lh-body);color:var(--ink-2)">Forkability under an OSI-approved licence, plus jurisdictional control of data flow at runtime.</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-ui</b>14px<br>IBM Plex Sans 400</div><div class="type-row__spec" style="font-size:var(--text-ui);line-height:1.6;color:var(--ink-2)">Vendor domicile alone is insufficient. The licence model is the operative mechanism.</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-code</b>13px<br>IBM Plex Mono 400</div><div class="type-row__spec" style="font-family:var(--font-mono);font-size:var(--text-code);color:var(--ink-2)">kubectl get nodes -o wide</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-caption</b>12px<br>IBM Plex Mono 500</div><div class="type-row__spec" style="font-family:var(--font-mono);font-weight:500;font-size:var(--text-caption);letter-spacing:var(--track-mono);color:var(--ink-3)">01 · CAPABILITIES</div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-label</b>11px<br>IBM Plex Mono 500</div><div class="type-row__spec"><span class="label">Enterprise delivery</span></div></div>
    <div class="type-row"><div class="type-row__meta"><b>--text-micro</b>10px<br>IBM Plex Mono 500</div><div class="type-row__spec"><span class="pill pill--live">Live</span> <span class="pill pill--draft">Draft</span> <span class="pill pill--plan">Planned</span></div></div>
  </div>
</section>

<!-- ═══ 06 GRID ═══ -->
<section class="section section--sink" id="grid" data-accent="magenta">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">06</span>
      <h1>Grid and spacing</h1>
    </div>
    <div class="prose" style="margin-bottom:var(--sp-6)">
      <p>All spacing derives from an 8px scale. An arbitrary pixel value is a defect, not a judgement call.
      The shell is 1400px with fluid padding, and the cover uses a twelve column grid that collapses to one at
      900px.</p>
    </div>

    <div class="split split--start">
      <div>
        <h2>The scale</h2>
        <div class="ruler" style="margin-top:var(--sp-3)">
          <div class="ruler__row"><span class="ruler__k">--sp-1 · 8</span><span class="ruler__bar" style="--w:8px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-2 · 16</span><span class="ruler__bar" style="--w:16px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-3 · 24</span><span class="ruler__bar" style="--w:24px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-4 · 32</span><span class="ruler__bar" style="--w:32px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-5 · 40</span><span class="ruler__bar" style="--w:40px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-6 · 48</span><span class="ruler__bar" style="--w:48px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-7 · 56</span><span class="ruler__bar" style="--w:56px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-8 · 64</span><span class="ruler__bar" style="--w:64px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-10 · 80</span><span class="ruler__bar" style="--w:80px"></span></div>
          <div class="ruler__row"><span class="ruler__k">--sp-14 · 112</span><span class="ruler__bar" style="--w:112px"></span></div>
        </div>
      </div>
      <div class="meta-panel">
        <div class="row"><span class="k">Shell</span><span class="v">1400px</span></div>
        <div class="row"><span class="k">Page padding</span><span class="v">clamp(24, 5vw, 72)</span></div>
        <div class="row"><span class="k">Top bar</span><span class="v">52px</span></div>
        <div class="row"><span class="k">Section padding</span><span class="v">112px, 64 below 900</span></div>
        <div class="row"><span class="k">Reading measure</span><span class="v">68ch</span></div>
        <div class="row"><span class="k">Cover grid</span><span class="v">12 col, 7 / 5 split</span></div>
        <div class="row"><span class="k">Break, wide</span><span class="v">1180px</span></div>
        <div class="row"><span class="k">Break, narrow</span><span class="v">900px</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ 07 STRUCTURE ═══ -->
<section class="section" id="structure" data-accent="blue1">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">07</span>
      <h1>Structure and motion</h1>
    </div>
    <div class="cells cells--3">
      <div class="cell cell--phase"><div class="cell__n">01</div><h3>Zero radius</h3><p>Border radius is zero on every element without exception. Buttons, fields, panels, pills and images all square.</p></div>
      <div class="cell cell--phase"><div class="cell__n">02</div><h3>No depth effects</h3><p>No shadows, gradients, glows or glass. Depth is expressed with the surface ramp and hairlines only.</p></div>
      <div class="cell cell--phase"><div class="cell__n">03</div><h3>Hairline structure</h3><p>Structural lines are 1px. Emphasis edges are 2px and appear only on blockquotes, callout edges, cell hover edges and figure rules.</p></div>
      <div class="cell cell--phase"><div class="cell__n">04</div><h3>One dashed border</h3><p>The dashed border belongs to the empty state and the clear-space diagram. It appears nowhere else.</p></div>
      <div class="cell cell--phase"><div class="cell__n">05</div><h3>Motion on input</h3><p>Nothing animates on entry. Scroll-triggered reveals, marquees and any self-starting animation are prohibited.</p></div>
      <div class="cell cell--phase"><div class="cell__n">06</div><h3>Visible focus</h3><p>Focus is a 2px square ring in the section accent at 3px offset. All motion is suppressed under reduced-motion.</p></div>
    </div>

    <div class="two-col" style="margin-top:var(--sp-8)">
      <div>
        <h2>Components that exist</h2>
        <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui)">The system is deliberately small.
        Adding a component is a decision, not a convenience.</p>
        <table class="table" style="margin-top:var(--sp-3)">
          <thead><tr><th>Component</th><th>Rule</th></tr></thead>
          <tbody>
            <tr><td class="name">Status pill</td><td>Exactly three: live, draft, planned</td></tr>
            <tr><td class="name">Callout</td><td>Left edge and label carry colour. Body stays neutral. No icons</td></tr>
            <tr><td class="name">Table</td><td>No vertical rules, no zebra, no outer border</td></tr>
            <tr><td class="name">Button</td><td>One primary per view</td></tr>
            <tr><td class="name">Top bar</td><td>Left-aligned routes. No wordmark, no progress bar</td></tr>
            <tr><td class="name">Cell grid</td><td>The only card primitive. Two, three or four across</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2>Deliberate absences</h2>
        <p class="prose" style="color:var(--ink-2);font-size:var(--text-ui)">Non-bloat is a feature. These are
        not gaps waiting to be filled.</p>
        <div class="cells cells--2" style="margin-top:var(--sp-3)">
          <div class="cell" style="padding:var(--sp-3)"><h3 style="font-size:var(--text-ui)">No icon set</h3><p>Labels do the work icons would do.</p></div>
          <div class="cell" style="padding:var(--sp-3)"><h3 style="font-size:var(--text-ui)">No light theme</h3><p>Adopting Tokyo Night Day is a separate decision.</p></div>
          <div class="cell" style="padding:var(--sp-3)"><h3 style="font-size:var(--text-ui)">No animation library</h3><p>Transitions are CSS and respond to input.</p></div>
          <div class="cell" style="padding:var(--sp-3)"><h3 style="font-size:var(--text-ui)">No component framework</h3><p>Plain CSS classes, consumable from any renderer.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ 08 USAGE ═══ -->
<section class="section section--sink" id="usage" data-accent="yellow">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">08</span>
      <h1>Usage</h1>
    </div>
    <div class="rules">
      <div class="rules__col rules--do">
        <h3><span class="mk">✓</span> Do</h3>
        <ul>
          <li>Use the outlined SVG masters as the primary source. They render identically everywhere.</li>
          <li>Inline <code>kra-wordmark-live.svg</code> on the sites so the ampersand inherits the section accent.</li>
          <li>Keep one cap height of clear space on every side of the wordmark.</li>
          <li>Swap to the mark below 68px wide, rather than shrinking the wordmark further.</li>
          <li>Use the print accent set on warm white grounds, and only there.</li>
          <li>Take colours, sizes and spaces by token name. Copy the token, not the value.</li>
        </ul>
      </div>
      <div class="rules__col rules--dont">
        <h3><span class="mk">✕</span> Do not</h3>
        <ul>
          <li>Reweight, resize or reposition the ampersand relative to the letters.</li>
          <li>Set the ampersand in yellow, green or red. Those three are outside the rotation.</li>
          <li>Recreate the wordmark by typing it. Space Grotesk must be present and tracked, so use the file.</li>
          <li>Apply shadows, gradients, outlines, glows or opacity changes to either mark.</li>
          <li>Place a mark on a photograph without a solid backing panel.</li>
          <li>Introduce a colour, a type size or a spacing value that is not in this document.</li>
        </ul>
      </div>
    </div>

    <div class="callout" data-accent="red" style="margin-top:var(--sp-8)">
      <div class="callout__label">If the palette changes</div>
      <p>This identity does not own its colours. They are read from the Tokyo Night Moon block in the dotfiles
      repository. If that block changes, regenerate the assets and this document rather than editing a hex value
      in either. The generator lives beside the site.</p>
    </div>
  </div>
</section>

<!-- ═══ 09 ASSETS ═══ -->
<section class="section" id="assets" data-accent="green">
  <div class="shell">
    <div class="sec-head">
      <span class="sec-mark">09</span>
      <h1>Asset library</h1>
    </div>
    <p class="t-lead prose" style="margin-bottom:var(--sp-6)">{TOTAL} files. SVG is the master format in every
    case. Rasters are provided for contexts that cannot take vector, and are regenerated from the SVG rather
    than edited.</p>

{assets_html}
  </div>
</section>

<footer class="site-footer">
  <div class="shell site-footer__inner">
    <span>Kevin Ryan &amp; Associates · Brand book v3.1.0 · {{{{COMMIT_SHA}}}}</span>
    <span>Tokyo Night Moon · dotfiles/.chezmoidata.yaml</span>
    <span><a href="https://kevinryan.io">kevinryan.io</a> · <a href="https://docs.kevinryan.io">docs</a></span>
  </div>
</footer>

</body>
</html>
'''

open("public/index.html", "w").write(DOC)
print("index.html", os.path.getsize("public/index.html"), "bytes ·", TOTAL, "assets")
