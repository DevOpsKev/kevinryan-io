import re, os, json
d = dict(l.split("=",1) for l in open("wordmark-paths.txt").read().strip().split("\n") if "=" in l)
W, H, LET, AMP = d["W"], d["H"], d["LETTERS"], d["AMP"]

ACC = {
  "blue":    "#82aaff",
  "cyan":    "#86e1fc",
  "cyan1":   "#7dcfff",
  "teal":    "#4fd6be",
  "orange":  "#ff966c",
  "magenta": "#c099ff",
  "green":   "#c3e88d",
  "yellow":  "#ffc777",
  "blue1":   "#7aa2f7",
  "red":     "#ff757f",
}
INK   = "#c8d3f5"
BLACK = "#0A0A0A"
NAVY  = "#222436"   # site bg, the ink for warm white grounds

os.makedirs("public/assets", exist_ok=True)

def svg(letter_fill, amp_fill, extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'width="{W}" height="{H}" role="img" aria-label="KR&amp;A">{extra}'
            f'<path fill="{letter_fill}" d="{LET}"/>'
            f'<path fill="{amp_fill}" d="{AMP}"/></svg>')

made = []
# accent set on dark
for name, hexv in ACC.items():
    p = f"public/assets/kra-wordmark-{name}.svg"
    open(p,"w").write(svg(INK, hexv)); made.append(p)
# neutral on dark
open("public/assets/kra-wordmark-ink.svg","w").write(svg(INK, INK)); made.append("public/assets/kra-wordmark-ink.svg")
# print, black on warm white, darkened teal
open("public/assets/kra-wordmark-print.svg","w").write(svg(NAVY, "#3D5DA4")); made.append("public/assets/kra-wordmark-print.svg")
# mono black and mono white for single-colour reproduction
open("public/assets/kra-wordmark-black.svg","w").write(svg(BLACK, BLACK)); made.append("public/assets/kra-wordmark-black.svg")
open("public/assets/kra-wordmark-white.svg","w").write(svg("#FFFFFF","#FFFFFF")); made.append("public/assets/kra-wordmark-white.svg")
# live text, inherits currentColor and --sec so it can sit inline in a page
open("public/assets/kra-wordmark-live.svg","w").write(
  f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="KR&amp;A">'
  f'<path fill="currentColor" d="{LET}"/>'
  f'<path fill="var(--sec, #82aaff)" d="{AMP}"/></svg>')
made.append("public/assets/kra-wordmark-live.svg")

print(len(made), "svgs")
for m in sorted(made): print(" ", m, os.path.getsize(m))
