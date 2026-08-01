import os
os.makedirs("public/assets", exist_ok=True)
ACC = {"blue":"#82aaff","cyan":"#86e1fc","teal":"#4fd6be","orange":"#ff966c",
       "magenta":"#c099ff","ink":"#c8d3f5"}
BG_DARK  = "#222436"
BG_SINK  = "#1a1b26"
INK      = "#c8d3f5"

def mark(bg, tri1, tri2, transparent=False):
    rect = "" if transparent else f'<rect width="64" height="64" fill="{bg}"/>'
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" '
            'role="img" aria-label="Kevin Ryan &amp; Associates">'
            f'{rect}'
            f'<path d="M10.24 10.24 H51.837 L10.24 51.837 Z" fill="{tri1}"/>'
            f'<path d="M53.76 12.163 V53.76 H12.163 Z" fill="{tri2}"/></svg>')

made=[]
for n,h in ACC.items():
    p=f"public/assets/kra-mark-{n}.svg"; open(p,"w").write(mark(BG_DARK, INK, h)); made.append(p)
open("public/assets/kra-mark-sink.svg","w").write(mark(BG_SINK, INK, ACC["blue"])); made.append("public/assets/kra-mark-sink.svg")
open("public/assets/kra-mark-light.svg","w").write(mark("#F5F3EF", "#222436", "#3D5DA4")); made.append("public/assets/kra-mark-light.svg")
open("public/assets/kra-mark-transparent.svg","w").write(mark(None, INK, ACC["blue"], transparent=True)); made.append("public/assets/kra-mark-transparent.svg")
for m in made: print(m)
