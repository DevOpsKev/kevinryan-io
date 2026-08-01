import cairosvg, os
from PIL import Image
A="public/assets"
jobs=[]
# wordmark PNGs, transparent, at widths
for name in ["blue","cyan","teal","orange","magenta","ink","white","black","print"]:
    for w in [400,800,1200,2000]:
        jobs.append((f"{A}/kra-wordmark-{name}.svg", f"{A}/kra-wordmark-{name}-{w}.png", w, None))
# mark PNGs, square
for name in ["blue","cyan","teal","orange","magenta","ink","sink","light","transparent"]:
    for s in [64,128,192,256,512]:
        jobs.append((f"{A}/kra-mark-{name}.svg", f"{A}/kra-mark-{name}-{s}.png", s, s))
n=0
for src,dst,w,h in jobs:
    if h: cairosvg.svg2png(url=src, write_to=dst, output_width=w, output_height=h)
    else: cairosvg.svg2png(url=src, write_to=dst, output_width=w)
    n+=1
print(n,"png")

# favicons
for tag,src in [("dark", f"{A}/kra-mark-blue.svg"), ("light", f"{A}/kra-mark-light.svg")]:
    ims=[]
    for s in (16,32,48):
        p=f"/tmp/fav-{tag}-{s}.png"
        cairosvg.svg2png(url=src, write_to=p, output_width=s, output_height=s)
        ims.append(Image.open(p).convert("RGBA"))
    ims[0].save(f"public/favicon-{tag}.ico", format="ICO",
                sizes=[(16,16),(32,32),(48,48)], append_images=ims[1:])
print("favicons")

# social avatars 400/800, mark centred on bg with padding
for tag,src,bg in [("dark", f"{A}/kra-mark-blue.svg", (34,36,54,255)),
                   ("light", f"{A}/kra-mark-light.svg", (245,243,239,255))]:
    for s in (400,800):
        inner=int(s*0.62)
        p=f"/tmp/soc-{tag}-{s}.png"
        cairosvg.svg2png(url=src, write_to=p, output_width=inner, output_height=inner)
        base=Image.new("RGBA",(s,s),bg)
        m=Image.open(p).convert("RGBA")
        base.paste(m, ((s-inner)//2,(s-inner)//2), m)
        base.save(f"{A}/kra-social-{tag}-{s}.png")
print("social")
