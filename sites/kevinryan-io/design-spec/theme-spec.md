---
id: 002-site-theme
title: Kevin Ryan & Associates, site theme
status: locked
version: 3.1.0
authority: this document
supersedes: 3.0.0 · 2.0.0, the washed-lime-on-neutral palette
artefacts:
  - app/globals.css                # canonical implementation
  - design-spec/theme-sheet.html   # rendered specimen, visual acceptance. Generated.
  - design-spec/mksheet.py         # regenerates the sheet from globals.css
  - design-spec/sheet-chrome.css   # the sheet's own furniture, the only CSS authored there
palette-source: dotfiles/.chezmoidata.yaml → theme.tokyo_night_moon
related:
  - 001-book-theme                 # The AI-Native Engineer. Sibling, not parent.
  - brand-kevinryan-io/public/kra-brand-guidelines.md   # the mark, and the print accent set
---

## Intent

A single theme for kevinryan.io. Tokyo Night Moon ground, a full accent ramp used semantically, Swiss International Style grid, developer register. The site is a design sibling to *The AI-Native Engineer* rather than a copy of it: it shares the discipline and shares none of the signature devices.

The theme is consumed by generators as well as by people. Every value in it must be reproducible by an agent working from this document alone.

## Authority

This document is the authority. `app/globals.css` is the canonical implementation and must not diverge from it. `design-spec/theme-sheet.html` is the visual acceptance artefact. If the three disagree, this document wins and the others are rebuilt.

As of 3.1.0 the sheet is generated rather than authored. It inlines `app/globals.css` verbatim, with the `@theme` block lifted into `:root` so the custom properties resolve without Tailwind, and the fonts embedded so it renders identically from disk. The only CSS written by hand is the specimen furniture in `sheet-chrome.css`. Run `python3 design-spec/mksheet.py` after changing the stylesheet. Editing the sheet by hand is what let it drift out of date between 3.0.0 and 3.1.0.

The palette is not owned here. It is lifted verbatim from `theme.tokyo_night_moon` in the `dotfiles` repository, which is the same source the terminal, editor, k9s, btop and lazygit configurations read. If that block changes, this theme changes with it. No colour is invented in this file.

## Changed in 3.1.0

Seven additions and one resolution. Nothing in B1 to B33 was altered, so those numbers still mean what they meant.

- The voice question, logged in 3.0.0 as open item O2, is settled. See Voice below.
- The wordmark is specified, B34, and the name lockup that sits under it, B35.
- Heading hierarchy is specified, B36. `SectionHeader` rendered an `h1`, so the home page was emitting seven of them.
- The propositions Venn is specified, B37, and the hero that carries it, B38.
- Native form controls are normalised, B39, and the field focus ring is strengthened, B40.
- Three open items, O4 to O6, are struck because the refactor removed the code they referred to.
- The theme sheet is regenerated and is now produced from `app/globals.css` rather than from a hand-kept copy of it, so it cannot fall behind again. It covers the wordmark, the lockup, the Venn, the set cards and every form control.

## The organising idea

The page is syntax-highlighted. Each section owns one accent from the ramp, and every accented thing inside that section reads from it: the eyebrow, the cell hover edge, the tag, the figure, the link underline, the focus ring. Scrolling the page walks the ramp the way scrolling a source file does.

This is what makes a multi-accent palette disciplined rather than decorative. A colour is never chosen for a component. It is inherited from the section the component sits in.

## Behaviour

### Colour

- B1. Accents are assigned per section through a single `data-accent` attribute on the `<section>` element, which sets `--sec`. Every accented rule reads `var(--sec)`. A component never names a colour.
- B2. Blue is the site-wide interaction colour. It holds the top bar action, the primary button, the cover and the contact section. Where a control sits outside any section, it uses blue.
- B3. There is no second theme. The site is dark only. No `data-theme` attribute, no toggle, no auto-detection.
- B4. Body text meets 7:1 against its background. Muted text meets 4.5:1. Measured on `bg`: `fg` 10.3:1, `fg_dark` 7.2:1, `change_gray` 4.6:1. `dark5` at 3.7:1 and `comment` at 3.1:1 are decorative only and must never carry text.
- B5. Every accent clears 4.5:1 on `bg` except `blue0` at 2.3:1 and `red1` at 3.0:1, which are borders and markers only, never type.
- B6. Green encodes the live and published state, yellow encodes drafting, `dark5` encodes planned, red encodes failure. These are the same hues used as section accents elsewhere; state is distinguished by component, not by reserving a hue.
- B7. The Moon surfaces sit close together. `bg` to `bg_alt` is only 1.05:1, so `page_bg` is used as the sunken section colour to give a visible step, and `bg_highlight` is used for hover where the change must register.

### Section accent map

| Section | Accent |
|---|---|
| Cover, contact, top bar | `blue` |
| Documentation callout | `cyan1` |
| About | `cyan` |
| Capabilities | `teal` |
| Enterprise delivery | `orange` |
| Notable clients | `blue1` |
| Career arc | `magenta` |
| Published work | `yellow` |
| Certifications | `green` |
| Assessment: the problem | `red` |
| Assessment: engagement | `cyan` |
| Assessment: deliverables | `green` |
| Assessment: audience | `magenta` |
| Assessment: evidence | `yellow` |
| Propositions hero | `blue` |

The three propositions carry fixed set colours rather than section accents, because they are a legend and must stay stable wherever they appear: AI-Native Engineering `teal`, Digital Sovereignty `yellow`, Ethical Technology `magenta`. That is the most even three-way hue split the ramp allows, 134, 132 and 94 degrees apart. Cyan was tried for the second and sat 24 degrees from teal, which read as one colour.

Three places cycle the ramp within a section rather than taking one accent: the keyword band separators, the four About figures, and the career-arc markers, which run cool to warm across the decades so the colour carries the chronology.

### Voice

Resolves O2 from 3.0.0.

- V1. `/kevin` is a person and speaks in the first person singular. Every other page is the firm and speaks in the first person plural.
- V2. Where a named individual is the point on a plural page, name him in the third person rather than switching voice. The contact page does this: "You can also reach out to Kevin directly."
- V3. Audited at the time of writing: the nine components that make up `/` and `/contact` contain no first person singular. `HeroSection` and `AboutSection` on `/kevin` retain theirs by design.

### Typography

- B8. Three families. Space Grotesk for display, headings and UI names. IBM Plex Sans for reading body only. IBM Plex Mono for all structure: numbers, metadata, tags, buttons, labels, table headers.
- B9. Fonts are self-hosted through `@fontsource` and imported in `app/layout.tsx`. No request leaves the origin to render type. This is a sovereignty requirement, not a performance one.
- B10. Eleven fixed type steps exist. Generated output uses those steps and no intermediate values.
- B11. Two steps are fluid and clamped: `display` and `h1`. All others are fixed.
- B12. Uppercase is set in the mono face only. Display and body faces are never uppercased by CSS.
- B13. The heading map is `.t-display`, `h1`/`.t-h1`, `h2`/`.t-h2`, `h3`/`.t-h3`, `.label`. No intermediate levels. `.t-display` appears once per site, on the cover.
- B14. Section heads carry a mono eyebrow above the title. No numeral, no section marker glyph.
- B15. `.label` is a utility label outside the reading hierarchy. It never introduces reading content.
- B16. Reading measure is set by `.prose` from `--measure`. No other element sets a measure.
- B34. The wordmark is `.wordmark`, live text rather than an asset, so the ampersand reads `--sec` and takes the accent of whatever section it sits in. Space Grotesk 700, tracking `-0.05em`, `0.02em` of optical padding either side of the ampersand. It is never set as an image on this site; the fixed-colour files in the brand repository exist for contexts outside it.
- B35. The full name may lock under the mark as `.phero__name`, one glyph per flex item with `space-between`, so the slack distributes as even tracking rather than as three large word gaps. It aligns to the mark's ink, not its box: Space Grotesk carries a `0.066em` left bearing on the K and `0.018em` on the right of the A, which over a `2.373em` mark is 2.78% and 0.76% of the width. Those percentages resolve against the head, so the correction holds at every size.

### Structure and surface

- B17. Border radius is zero everywhere.
- B18. There are no shadows, gradients, glows or glass effects. Depth is expressed with the surface ramp and hairlines only.
- B19. Structural lines are 1px `--line`. Emphasis edges are 2px and appear only on blockquotes, callout left edges, cell hover edges and stat top rules.
- B20. Dashed borders appear on the empty state and nowhere else.
- B21. All spacing derives from the 8px scale. Arbitrary pixel values are a defect.
- B22. Sections alternate between `bg` and `page_bg` to give rhythm.
- B36. One `h1` per page and no skipped levels. `SectionHeader` renders `h2` and takes `as="h1"` only where a section head is the page's own heading, which is `/contact` and nowhere else. `/` takes its `h1` from the wordmark in the propositions hero, `/kevin` from its cover.

### Components

- B23. Exactly three status pills exist: live, draft, plan.
- B24. Callouts are `.callout > .callout__label + p`. Colour lives on the left edge and the label. The body stays neutral. Callouts carry no icons.
- B25. Tables have no vertical rules, no zebra striping and no outer border. Numeric columns use `.num` with tabular figures.
- B26. One primary button per view.
- B27. The top bar is a left-aligned row of routes with no wordmark and no locus readout. There is no scroll progress bar and no gauge anywhere in the system.
- B37. The propositions Venn is HTML and CSS only. No SVG, no image, no script. It is a fixed
  900 by 700 coordinate space that scales as one unit rather than reflowing, built from a radius
  of 180 and a centre separation of 170, with every other offset derived. Three constructions in
  it are computed rather than eyed and must not be nudged by hand: the overlap captions sit on
  the pole of inaccessibility of their region, because the centroid of a crescent falls in its
  thin part; the arrow is a 90 degree arc drawn by a single border side, routed through the only
  corridor that crosses no caption; and the head is a clipped dart hinged on its own tip. The
  stage is offset 130px so the circle cluster, rather than the bounding box, lands on the page
  axis.
- B38. Cards that restate a set quote that set's construction rather than adding a device. The card top hairline uses the same expression as the ring, `color-mix(in srgb, var(--sec) 58%, transparent)`, so it is the same colour and not an approximation.
- B39. Native form chrome is suppressed. `color-scheme: dark` on `html`, without which the select popup, the caret, autofill and the scrollbars all render in the light system theme on a dark page. `appearance: none` on `.field`, `select.field` and `.btn`, without which Safari rounds corners and adds an inner shadow, breaking B17 and B18. Autofill is overridden with an inset shadow, which is the only mechanism Chrome honours. The select popup list itself is drawn by the OS and cannot be styled beyond `color-scheme`.

### Motion and accessibility

- B28. Nothing animates on entry. Motion responds to input only. Scroll-triggered reveals are prohibited, as are marquees and any other self-starting animation.
- B29. Focus is visible as a 2px square ring in the section accent at 3px offset.
- B40. A form field takes the ring inwards instead, `inset 0 0 0 1px` in the section accent on top of the 1px border, because an outline at 3px offset collides with the panel edge. Invalid state uses `:user-invalid` so it fires after interaction and never on load.
- B30. All transitions and animations are suppressed under `prefers-reduced-motion`.
- B31. At 1180px the three and four column grids drop to two and the client grid drops to four. At 900px all cell grids become single column, the timeline loses its spine, and the cover stacks.

### Print

- B32. Print output drops the top bar and the keyword band, inverts to black on white, and removes the reading measure.
- B33. Headings do not break from the content that follows them, and cells do not break internally.

## Tokens

Defined in `app/globals.css` under `@theme` so Tailwind utilities resolve against them. Names in the right column are the keys in `theme.tokyo_night_moon`.

### Surfaces

| Token | Value | Source key |
|---|---|---|
| `--color-bg` | `#222436` | `bg` |
| `--color-bg-sink` | `#1a1b26` | `page_bg` |
| `--color-bg-panel` | `#1f2335` | `bg_dark` |
| `--color-bg-raise` | `#2f334d` | `bg_highlight` |
| `--color-line` | `#3b4261` | `fg_gutter` |
| `--color-line-strong` | `#444a73` | `terminal_black` |
| `--color-selection` | `#2d3f76` | `selection` |

### Foregrounds

| Token | Value | Source key | On bg |
|---|---|---|---|
| `--color-ink` | `#c8d3f5` | `fg` | 10.3:1 |
| `--color-ink-2` | `#a9b1d6` | `fg_dark` | 7.2:1 |
| `--color-ink-3` | `#828bb8` | `change_gray` | 4.6:1 |
| `--color-ink-4` | `#737aa2` | `dark5` | 3.7:1, decorative |
| `--color-comment` | `#636da6` | `comment` | 3.1:1, decorative |

### Accents

| Token | Value | On bg |
|---|---|---|
| `--color-blue` | `#82aaff` | 6.7:1 |
| `--color-blue1` | `#7aa2f7` | 6.1:1 |
| `--color-blue0` | `#3d59a1` | 2.3:1, borders only |
| `--color-cyan` | `#86e1fc` | 10.3:1 |
| `--color-cyan1` | `#7dcfff` | 8.9:1 |
| `--color-teal` | `#4fd6be` | 8.5:1 |
| `--color-border-teal` | `#0db9d7` | 6.5:1 |
| `--color-green` | `#c3e88d` | 11.1:1 |
| `--color-yellow` | `#ffc777` | 10.0:1 |
| `--color-orange` | `#ff966c` | 7.2:1 |
| `--color-red` | `#ff757f` | 5.9:1 |
| `--color-red-alt` | `#f7768e` | 5.8:1 |
| `--color-red1` | `#c53b53` | 3.0:1, markers only |
| `--color-magenta` | `#c099ff` | 6.7:1 |

Type steps: micro 10, label 11, caption 12, code 13, ui 14, read 17, lead 19, h3 21, h2 24, h1 44 (clamped), display 100 (clamped).

Spacing: 8, 16, 24, 32, 40, 48, 56, 64, 80, 112.

Layout: topbar 52, measure 68ch, shell 1400, page padding `clamp(24px, 5vw, 72px)`.

### Component scoped

Four variables are declared on a component rather than in `@theme`, because they describe one construction and nothing else should read them.

| Token | Declared on | Purpose |
|---|---|---|
| `--set-a`, `--set-b`, `--set-c` | `.venn` | The three proposition colours |
| `--venn-nudge` | `.venn` | Stage offset so the cluster lands on the page axis |

The print accent set is not defined here. It belongs to the brand book, which derives it from the Moon accents by holding hue and walking lightness down until each clears 5.5:1 on warm white. See `kra-brand-guidelines.md`.

## Non-goals

- N1. No component library or framework binding beyond Tailwind's token layer. The component classes are plain CSS and are consumable from any renderer.
- N2. No light theme in this version. Tokyo Night has a Day variant; adopting it is a separate decision.
- N3. No icon set. Labels do the work icons would do.
- N4. No animation library.
- N5. No responsive type interpolation beyond the two clamped steps.

## Open

- O1. The site is internally consistent at six GitLab badges and fourteen credentials in total, and the hero states the same. The practice brief says nine GitLab. Reconcile the brief or the badges.
- O3. Six headings are authored in upper case as literal strings, `AI-NATIVE READINESS ASSESSMENT` and the five `SectionHeader` titles on the assessment page. This conflicts with B12 in spirit, since the display face is being uppercased by hand rather than by CSS. Lowering them is a content change and has not been made.
- O7. This directory sits at the site root rather than the monorepo root. If the theme is to be shared across the other seven sites, move it up and import from there.

### Struck in 3.1.0

- O2. Resolved. See Voice.
- O4. `fitty` is no longer a dependency.
- O5. `hooks/useRevealOnScroll.ts` is gone and nothing references `Reveal`.
- O6. `AssessmentCredibility.tsx` has been deleted.
- O8. Raised and closed within 3.1.0. The sheet is regenerated and is now derived from the stylesheet, so the class of defect it described cannot recur.

## Acceptance

The implementation is accepted when `design-spec/theme-sheet.html` renders every component without visual defect, when no generated file violates a constraint listed above, and when `pnpm build` completes with no type or lint errors.

The 3.1.0 additions were verified by rendering `app/globals.css` directly, with the `@theme`
block lifted into `:root` so the custom properties resolve without Tailwind, against the same
DOM the components emit. Measurements taken that way: the lockup matches the mark's ink to
within 0.3px at eight viewport widths, the circle cluster lands on the page axis at desktop,
and neither the site nor the sheet has horizontal overflow from 1600 down to 375. Regenerating
the sheet also surfaced and fixed a 3.0.0 defect: the type specimen table overflowed a phone
viewport and now scrolls in its own container.

`pnpm build` has not been run against these changes, because `node_modules/.bin` resolves through the pnpm store and was not reachable from the environment they were authored in. The changed components were typechecked in an isolated project instead, which passed. Run the build before deploying.

## Install note

The three font dependencies are present in `package.json` as of 3.1.0 and need no separate step:

    @fontsource/space-grotesk
    @fontsource/ibm-plex-sans
    @fontsource/ibm-plex-mono
