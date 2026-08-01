# Kevin Ryan & Associates · Brand Guidelines

**Version 3.0.0**
**brand.kevinryan.io**

Supersedes version 2.0, February 2026, and the lime-on-warm-white identity it described.

---

## Contents

1. The wordmark
2. The contextual ampersand
3. The mark
4. Colour
5. Typography
6. Grid and spacing
7. Structure and motion
8. Usage
9. Asset library

---

## 01 · The wordmark

The wordmark is **KR&A** set in Space Grotesk at weight 700, tracked to `-0.05em`. All four characters share one weight and one size. The ampersand takes `0.02em` of optical padding either side because its bowl sits tighter than the flat sides of the R and the A.

The ampersand is the only glyph that carries colour. It is what separates the mark from plain text, so it is never dropped, never reweighted and never replaced with the word "and".

**Clear space.** One cap height of the K on every side. Nothing intrudes into that zone: no rule, no edge, no other mark.

**Minimum size.** 68px wide on screen, 18mm in print. Below that the ampersand thins past the point where the colour registers and the mark reads as plain text. Use the mark instead.

### Construction

| Property | Value | Token |
|---|---|---|
| Face | Space Grotesk | `--font-display` |
| Weight | 700, all four characters | 700 |
| Tracking | -0.05em | `--track-display` |
| Ampersand padding | 0.02em either side | – |
| Letter colour | #C8D3F5 on dark, #222436 on light | `--ink`, `--p-ink` |
| Ampersand colour | Section accent | `--sec` |
| Aspect | 2373 : 700 | viewBox |
| Master format | SVG, outlined paths | `.svg` |

---

## 02 · The contextual ampersand

The page is syntax-highlighted. Each section owns one accent from the ramp and every accented thing inside it reads from the same variable. The ampersand is one of those things. It inherits `--sec` from the section it sits in, so the mark shifts colour as the reader moves down the page without a single per-page logo asset existing.

Seven accents are in the rotation. The remainder of the ramp is reserved for section furniture and is not used on the mark, because at small sizes yellow and green sit close enough to ink that the ampersand stops reading as accented, and red reads as an error state rather than a section cue.

| Context | Accent | Hex |
|---|---|---|
| Default, cover, contact | blue | `#82AAFF` |
| Documentation | cyan1 | `#7DCFFF` |
| About, infrastructure | cyan | `#86E1FC` |
| Capabilities, specifications | teal | `#4FD6BE` |
| Enterprise delivery, CI and CD | orange | `#FF966C` |
| Career arc, decision records | magenta | `#C099FF` |
| Neutral fallback | ink | `#C8D3F5` |

**Implementation.** Use `kra-wordmark-live.svg`, which fills the letters with `currentColor` and the ampersand with `var(--sec)`. Inline it rather than loading it through an `img` element, because an external SVG cannot see the page's custom properties. The fixed-colour files exist for contexts outside the site, not for the site itself.

---

## 03 · The mark

The mark is a square split on the diagonal. The upper left triangle is ink, the lower right is the accent, and a gap of 6.25% of the mark separates them. The whole figure is inset 16% from the edge of its ground, which is what keeps it legible as a favicon at 16px.

It is not a monogram and carries no letterforms. Where the wordmark is too small to hold, this replaces it.

| Context | Size | File |
|---|---|---|
| Browser favicon | 16, 32, 48 | `favicon-dark.ico`, `favicon-light.ico` |
| App icon | 192, 512 | `kra-mark-blue-512.png` |
| Social avatar | 400, 800 | `kra-social-dark-800.png` |
| Watermark | any | `kra-mark-transparent.svg` |

---

## 04 · Colour

One theme. Dark only. There is no light variant, no toggle and no automatic detection. Body text meets 7:1 against its background and muted text meets 4.5:1. Every ratio below is measured.

The palette is not owned by this document. It is lifted verbatim from the Tokyo Night Moon block in `dotfiles/.chezmoidata.yaml`, which is the same source the terminal, editor and cluster tooling read. If that block changes, this identity changes with it.

### Surfaces

| Name | Token | Hex | Source key | Use |
|---|---|---|---|---|
| Background | `--bg` | `#222436` | `bg` | Section ground and page default |
| Sunken | `--bg-sink` | `#1A1B26` | `page_bg` | Alternating sections, footer, code |
| Panel | `--bg-panel` | `#1F2335` | `bg_dark` | Wells, form panels, feature cells |
| Raised | `--bg-raise` | `#2F334D` | `bg_highlight` | Hover only |
| Hairline | `--line` | `#3B4261` | `fg_gutter` | Every structural rule, 1px |
| Rule strong | `--line-strong` | `#444A73` | `terminal_black` | Table head, field border |

### Foregrounds

| Name | Token | Hex | On bg | Use |
|---|---|---|---|---|
| Ink | `--ink` | `#C8D3F5` | 10.3:1 | Headings, emphasis, figures |
| Ink 2 | `--ink-2` | `#A9B1D6` | 7.2:1 | Body copy |
| Ink 3 | `--ink-3` | `#828BB8` | 4.6:1 | Labels and metadata. Muted floor |
| Ink 4 | `--ink-4` | `#737AA2` | 3.7:1 | Decorative only. Never type |
| Comment | `--comment` | `#636DA6` | 3.1:1 | Decorative only. Never type |

### Accents

Every accent clears 4.5:1 on the section ground except blue 0 and red 1, which are borders and markers and never carry type.

| Name | Token | Hex | On bg | Use |
|---|---|---|---|---|
| Blue | `--blue` | `#82AAFF` | 6.7:1 | Interaction, cover, contact, top bar |
| Blue 1 | `--blue1` | `#7AA2F7` | 6.1:1 | Clients |
| Blue 0 | `--blue0` | `#3D59A1` | 2.3:1 | Borders and markers only |
| Cyan | `--cyan` | `#86E1FC` | 10.3:1 | About, infrastructure |
| Cyan 1 | `--cyan1` | `#7DCFFF` | 8.9:1 | Documentation |
| Teal | `--teal` | `#4FD6BE` | 8.5:1 | Capabilities, specifications |
| Green | `--green` | `#C3E88D` | 11.1:1 | Certifications, observability, live state |
| Yellow | `--yellow` | `#FFC777` | 10.0:1 | Published work, sites, draft state |
| Orange | `--orange` | `#FF966C` | 7.2:1 | Enterprise delivery, CI and CD |
| Red | `--red` | `#FF757F` | 5.9:1 | The problem, risk, failure state |
| Magenta | `--magenta` | `#C099FF` | 6.7:1 | Career arc, decision records |
| Red 1 | `--red1` | `#C53B53` | 3.0:1 | Markers only |

### Print accents

Every Moon accent falls below 4.5:1 on warm white, so print takes a darkened set. Hue is held from the Moon value and lightness is walked down until the colour clears 5.5:1, which makes the set a derivation rather than a choice. Rerun it with `tools/printset.py`. Print ink is the site background itself, so the light lockup stays inside the family instead of falling back to black. The light lockup pairs that ink with `--p-blue` on the ampersand. These are the only permitted substitutions and they apply on `#F5F3EF` only.

| Token | Hex | On #F5F3EF |
|---|---|---|
| `--p-ink` | `#222436` | 13.8:1 |
| `--p-blue` | `#3D5DA4` | 5.7:1 |
| `--p-cyan` | `#00697F` | 5.7:1 |
| `--p-teal` | `#006D5F` | 5.7:1 |
| `--p-green` | `#4C6913` | 5.7:1 |
| `--p-yellow` | `#865901` | 5.5:1 |
| `--p-orange` | `#A04822` | 5.5:1 |
| `--p-red` | `#AD3543` | 5.6:1 |
| `--p-magenta` | `#714DA3` | 5.8:1 |

---

## 05 · Typography

Three families with fixed roles. Space Grotesk for display, headings and names. IBM Plex Sans for reading body only. IBM Plex Mono for all structure: numbers, metadata, tags, buttons, labels and table headers.

Uppercase is set in the mono face and nowhere else. The display and body faces are never uppercased by CSS. All three are self-hosted as woff2. No request leaves the origin to render type, which is a sovereignty requirement rather than a performance one.

### The scale

Eleven fixed steps. Two are fluid and clamped. Generated output uses these steps and no intermediate values.

| Token | Size | Face |
|---|---|---|
| `--text-display` | 100px, clamped 44 to 100 | Space Grotesk 700 |
| `--text-h1` | 44px, clamped 30 to 44 | Space Grotesk 700 |
| `--text-h2` | 24px | Space Grotesk 600 |
| `--text-h3` | 21px | Space Grotesk 600 |
| `--text-lead` | 19px | IBM Plex Sans 400 |
| `--text-read` | 17px | IBM Plex Sans 400 |
| `--text-ui` | 14px | IBM Plex Sans 400 |
| `--text-code` | 13px | IBM Plex Mono 400 |
| `--text-caption` | 12px | IBM Plex Mono 500 |
| `--text-label` | 11px | IBM Plex Mono 500 |
| `--text-micro` | 10px | IBM Plex Mono 500 |

---

## 06 · Grid and spacing

All spacing derives from an 8px scale. An arbitrary pixel value is a defect, not a judgement call.

| Token | Value |
|---|---|
| `--sp-1` to `--sp-14` | 8, 16, 24, 32, 40, 48, 56, 64, 80, 112 |
| Shell | 1400px |
| Page padding | `clamp(24px, 5vw, 72px)` |
| Top bar | 52px |
| Section padding | 112px, 64px below 900 |
| Reading measure | 68ch |
| Cover grid | 12 column, 7 / 5 split |
| Break, wide | 1180px |
| Break, narrow | 900px |

---

## 07 · Structure and motion

Border radius is zero on every element without exception. There are no shadows, gradients, glows or glass effects; depth is expressed with the surface ramp and hairlines only. Structural lines are 1px, and emphasis edges are 2px and appear only on blockquotes, callout left edges, cell hover edges and figure rules. The dashed border belongs to the empty state and the clear-space diagram and appears nowhere else.

Nothing animates on entry. Motion responds to input only. Scroll-triggered reveals, marquees and any other self-starting animation are prohibited. Focus is a 2px square ring in the section accent at 3px offset. All transitions are suppressed under `prefers-reduced-motion`.

### Components that exist

| Component | Rule |
|---|---|
| Status pill | Exactly three: live, draft, planned |
| Callout | Left edge and label carry colour. Body stays neutral. No icons |
| Table | No vertical rules, no zebra, no outer border |
| Button | One primary per view |
| Top bar | Left-aligned routes. No wordmark, no progress bar |
| Cell grid | The only card primitive. Two, three or four across |

### Deliberate absences

No icon set, because labels do the work icons would do. No light theme, because adopting Tokyo Night Day is a separate decision. No animation library. No component framework beyond plain CSS classes.

---

## 08 · Usage

### Do

- Use the outlined SVG masters as the primary source. They render identically everywhere.
- Inline `kra-wordmark-live.svg` on the sites so the ampersand inherits the section accent.
- Keep one cap height of clear space on every side of the wordmark.
- Swap to the mark below 68px wide, rather than shrinking the wordmark further.
- Use the print accent set on warm white grounds, and only there.
- Take colours, sizes and spaces by token name. Copy the token, not the value.

### Do not

- Reweight, resize or reposition the ampersand relative to the letters.
- Set the ampersand in yellow, green or red. Those three are outside the rotation.
- Recreate the wordmark by typing it. Space Grotesk must be present and tracked, so use the file.
- Apply shadows, gradients, outlines, glows or opacity changes to either mark.
- Place a mark on a photograph without a solid backing panel.
- Introduce a colour, a type size or a spacing value that is not in this document.

---

## 09 · Asset library

The complete set is browsable at [brand.kevinryan.io](https://brand.kevinryan.io). SVG is the master format in every case. Rasters are provided for contexts that cannot take vector, and are regenerated from the SVG rather than edited.

| Group | Contents |
|---|---|
| Wordmark, SVG | Ten accents, plus ink, print, black, white and the live-text master |
| Mark, SVG | Six accents, plus sunken, light and transparent grounds |
| Wordmark, PNG | 400, 800, 1200 and 2000px wide, transparent |
| Mark, PNG | 64, 128, 192, 256 and 512px square |
| Social | 400 and 800px, dark and light |
| Favicons | ICO at 16, 32 and 48, dark and light |

---

**Kevin Ryan & Associates** · brand.kevinryan.io
Version 3.0.0. Palette source: `dotfiles/.chezmoidata.yaml → theme.tokyo_night_moon`.
Authority: `sites/kevinryan-io/design-spec/theme-spec.md`, specification `002-site-theme`.
