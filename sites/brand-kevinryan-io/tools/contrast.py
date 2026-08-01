def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    l1,l2=sorted([lum(a),lum(b)],reverse=True); return (l1+0.05)/(l2+0.05)
BG="#222436"; SINK="#1a1b26"; PANEL="#1f2335"; RAISE="#2f334d"; WW="#F5F3EF"
fg={"ink":"#c8d3f5","ink-2":"#a9b1d6","ink-3":"#828bb8","ink-4":"#737aa2","comment":"#636da6"}
ac={"blue":"#82aaff","blue1":"#7aa2f7","blue0":"#3d59a1","cyan":"#86e1fc","cyan1":"#7dcfff",
    "teal":"#4fd6be","border-teal":"#0db9d7","green":"#c3e88d","yellow":"#ffc777",
    "orange":"#ff966c","red":"#ff757f","red-alt":"#f7768e","red1":"#c53b53","magenta":"#c099ff"}
pr={"p-blue":"#2C4FA8","p-cyan":"#1C6A82","p-teal":"#0F7A6A","p-green":"#4C6B25",
    "p-yellow":"#7A5300","p-orange":"#A33B12","p-red":"#A62233","p-magenta":"#6B3FB0"}
print("FOREGROUNDS on bg / sink / panel")
for k,v in fg.items(): print(f"  {k:9s} {v}  {cr(v,BG):5.2f}  {cr(v,SINK):5.2f}  {cr(v,PANEL):5.2f}")
print("ACCENTS on bg / sink / panel / raise")
for k,v in ac.items(): print(f"  {k:12s} {v}  {cr(v,BG):5.2f}  {cr(v,SINK):5.2f}  {cr(v,PANEL):5.2f}  {cr(v,RAISE):5.2f}")
print("PRINT accents on #F5F3EF")
for k,v in pr.items(): print(f"  {k:10s} {v}  {cr(v,WW):5.2f}")
print("surfaces: bg/sink", round(cr(BG,SINK),3), " bg/panel", round(cr(BG,PANEL),3), " bg/raise", round(cr(BG,RAISE),3))
print("black on warm white", round(cr('#0A0A0A',WW),2))
