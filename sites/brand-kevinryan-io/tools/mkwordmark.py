from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

SRC = "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2"
f = TTFont(SRC)
upm = f["head"].unitsPerEm
gs = f.getGlyphSet()
cmap = f.getBestCmap()
hmtx = f["hmtx"]

TRACK = -0.05          # em, matches --track-display on the mark
AMP_PAD = 0.02         # em either side of the ampersand
TEXT = "KR&A"

def gname(ch): return cmap[ord(ch)]

# lay out
pen_data = []
x = 0.0
for i, ch in enumerate(TEXT):
    g = gname(ch)
    adv = hmtx[g][0] / upm
    pad = AMP_PAD if ch == "&" else 0.0
    x += pad
    pen_data.append((ch, g, x))
    x += adv + pad + TRACK
total_w = x - TRACK   # drop the trailing tracking

# vertical: cap height box
cap = f["OS/2"].sCapHeight / upm if hasattr(f["OS/2"], "sCapHeight") and f["OS/2"].sCapHeight else 0.7

paths = {}
for ch, g, xoff in pen_data:
    spen = SVGPathPen(gs)
    # flip y, scale to 1em, translate
    t = Transform(1/upm, 0, 0, -1/upm, xoff, cap)
    tp = TransformPen(spen, t)
    gs[g].draw(tp)
    paths[ch] = spen.getCommands()

# emit at a 1000-unit scale for clean numbers
S = 1000
W = round(total_w * S, 2)
H = round(cap * S, 2)

def scaled(d):
    # re-run at scale S directly instead of string maths
    return d

out = []
for ch, g, xoff in pen_data:
    spen = SVGPathPen(gs)
    t = Transform(S/upm, 0, 0, -S/upm, xoff*S, cap*S)
    gs[g].draw(TransformPen(spen, t))
    out.append((ch, spen.getCommands()))

letters = " ".join(d for ch, d in out if ch != "&")
amp     = [d for ch, d in out if ch == "&"][0]

open("wordmark-paths.txt","w").write(
    f"W={W}\nH={H}\nLETTERS={letters}\nAMP={amp}\n")
print("viewBox 0 0", W, H, "| cap", cap, "| upm", upm)
print("letters bytes", len(letters), "amp bytes", len(amp))
