#!/usr/bin/env python3
"""Derives the print accent set from the Moon accents.

Hue is held. Chroma is trimmed slightly because deep sRGB values clip.
Lightness is walked down until the colour clears 5.5:1 on the warm white
ground. Nothing here is hand-picked, so the set can be re-derived whenever
the Moon block changes.
"""
import math

WW = "#F5F3EF"
TARGET = 5.5

def s2l(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
def l2s(c):
    c = max(0.0, min(1.0, c))
    return 12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4)-0.055
def hex2rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def rgb2hex(r,g,b): return '#%02X%02X%02X' % tuple(round(max(0,min(1,v))*255) for v in (r,g,b))
def oklab(h):
    r,g,b = [s2l(v) for v in hex2rgb(h)]
    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
    l, m, s = l**(1/3), m**(1/3), s**(1/3)
    return (0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
            1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
            0.0259040371*l + 0.7827717662*m - 0.8086757660*s)
def oklab2hex(L,a,b):
    l = (L + 0.3963377774*a + 0.2158037573*b)**3
    m = (L - 0.1055613458*a - 0.0638541728*b)**3
    s = (L - 0.0894841775*a - 1.2914855480*b)**3
    return rgb2hex(l2s( 4.0767416621*l - 3.3077115913*m + 0.2309699292*s),
                   l2s(-1.2684380046*l + 2.6097574011*m - 0.3413193965*s),
                   l2s(-0.0041960863*l - 0.7034186147*m + 1.7076147010*s))
def lch2hex(L, C, H):
    return oklab2hex(L, C*math.cos(H), C*math.sin(H))

def in_gamut(L, C, H):
    a, b = C*math.cos(H), C*math.sin(H)
    l = (L + 0.3963377774*a + 0.2158037573*b)**3
    m = (L - 0.1055613458*a - 0.0638541728*b)**3
    s = (L - 0.0894841775*a - 1.2914855480*b)**3
    rgb = ( 4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
           -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
           -0.0041960863*l - 0.7034186147*m + 1.7076147010*s)
    return all(-0.0005 <= v <= 1.0005 for v in rgb)

def lum(h):
    r,g,b = [s2l(v) for v in hex2rgb(h)]
    return 0.2126*r + 0.7152*g + 0.0722*b
def cr(a,b):
    l1,l2 = sorted([lum(a),lum(b)], reverse=True); return (l1+0.05)/(l2+0.05)

MOON = [("blue","#82aaff"),("cyan","#86e1fc"),("teal","#4fd6be"),("green","#c3e88d"),
        ("yellow","#ffc777"),("orange","#ff966c"),("red","#ff757f"),("magenta","#c099ff")]

out = []
for name, src in MOON:
    L, a, b = oklab(src)
    C, H = math.hypot(a,b), math.atan2(b,a)
    best = None
    for step in range(90, 19, -1):          # walk lightness down in 0.01 steps
        Lc = step/100
        # trim chroma until the colour is inside sRGB at this lightness
        for f in [x/100 for x in range(92, 29, -2)]:
            cand = lch2hex(Lc, C*f, H)
            if in_gamut(Lc, C*f, H):
                break
        if cr(cand, WW) >= TARGET:
            best = cand; break
    assert best, name
    out.append((name, src, best, cr(best, WW)))

print(f"{'accent':9s} {'moon':9s} -> {'print':9s} on #F5F3EF")
for n, s, p, r in out:
    print(f"  {n:8s} {s.upper()} -> {p}  {r:.2f}:1")
print()
print("  " + " ".join(f"--p-{n}: {p};" for n, s, p, r in out))
