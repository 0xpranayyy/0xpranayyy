"""Paper & ink — README assets for 0xpranayy. Light + dark variants of every piece."""
import math, os, glob
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = "/home/claude/readme5/assets"; os.makedirs(OUT, exist_ok=True)
F = "/home/claude/readme4/assets/fonts"
FONTS = {"serif": "instrument-serif-latin-400-normal.woff", "serifi": "instrument-serif-latin-400-italic.woff",
         "ui": "inter-latin-500-normal.woff", "ui6": "inter-latin-600-normal.woff"}
_fc = {}
def font(k):
    if k not in _fc:
        f = TTFont(os.path.join(F, FONTS[k])); _fc[k] = (f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm, f["hmtx"])
    return _fc[k]
def T(s, x, y, size, k="ui", fill="#000", anchor="start", ls=0.0, opacity=1):
    gs, cmap, upm, hmtx = font(k); sc = size / upm
    names = [cmap.get(ord(ch), "space") for ch in s]
    width = sum(hmtx[n][0] * sc + ls for n in names) - (ls if names else 0)
    cx = x - (width / 2 if anchor == "middle" else width if anchor == "end" else 0)
    ds = []
    for n in names:
        pen = SVGPathPen(gs); gs[n].draw(TransformPen(pen, (sc, 0, 0, -sc, cx, y)))
        if pen.getCommands(): ds.append(pen.getCommands())
        cx += hmtx[n][0] * sc + ls
    op = f' opacity="{opacity}"' if opacity != 1 else ""
    return f'<path d="{" ".join(ds)}" fill="{fill}"{op}/>'
def TW(s, size, k, ls=0):
    gs, cmap, upm, hmtx = font(k); return sum(hmtx[cmap.get(ord(c), "space")][0] * size / upm + ls for c in s) - ls

THEME = {
    "light": dict(paper="#F2EBDD", ink="#1C2233", muted="#6E6A66", faint="#B9B0A0", red="#E0533A", grain=.16),
    "dark":  dict(paper="#14161C", ink="#EDE6D6", muted="#9C968A", faint="#4A4A4E", red="#EC6248", grain=.12),
}
ROUGH = ('<filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="4"/>'
         '<feDisplacementMap in="SourceGraphic" scale="6"/></filter>'
         '<filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="1" seed="7"/>'
         '<feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>')
def GRAIN(op): return (f'<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/>'
                       f'<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 {op} 0"/></filter>')
def svg(w, h, body, defs="", style="", clip=False):
    cd = f'<clipPath id="fr"><rect width="{w}" height="{h}" rx="26"/></clipPath>' if clip else ""
    inner = f'<g clip-path="url(#fr)">{body}</g>' if clip else body
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'<defs>{defs}{cd}</defs><style>{style}@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}</style>{inner}</svg>')

def waves(x0, x1, top, n, gap, amp, ink, paper, step=8, base_op=.25, cls="wv"):
    o = []
    sea = [f"{i},{top + amp*math.sin(i*.011) + 5*math.sin(i*.031):.1f}" for i in range(x0, x1 + 1, step)]
    o.append(f'<polygon points="{x0},{top+n*gap+60} {" ".join(sea)} {x1},{top+n*gap+60}" fill="{paper}"/>')
    for k in range(n):
        a = amp - k * amp * .025
        pts = " ".join(f"{i},{top + k*gap + a*math.sin(i*.011 + k*.06) + 5*math.sin(i*.031 + k*.05):.1f}" for i in range(x0, x1 + 1, step))
        o.append(f'<polyline class="{cls}" style="animation-delay:{-k*.4:.1f}s" points="{pts}" fill="none" stroke="{ink}" '
                 f'stroke-width="{1.7 if k%3==0 else 1.05}" opacity="{base_op + (1-base_op)*.9*(k/n):.2f}"/>')
    return "".join(o)

WAVE_CSS = ".wv{animation:wv 7s ease-in-out infinite alternate}@keyframes wv{to{transform:translateX(-18px)}}"

# ================================================================= HEADER
def header(th):
    t = THEME[th]; W, H = 1200, 540
    b = [f'<rect width="{W}" height="{H}" rx="26" fill="{t["paper"]}"/>']
    b.append(f'<circle cx="910" cy="236" r="128" fill="{t["red"]}" filter="url(#rough)"/>')
    b.append(waves(0, W, 350, 26, 8, 18, t["ink"], t["paper"]))
    b.append(f'<rect width="{W}" height="{H}" rx="26" filter="url(#grain)"/>')
    b.append(T("ENGINEER", 88, 118, 12, "ui6", t["ink"], ls=4.2, opacity=.6))
    b.append(f'<rect x="{88 + TW("ENGINEER", 12, "ui6", 4.2) + 16:.0f}" y="112" width="34" height="1.2" fill="{t["ink"]}" opacity=".45"/>')
    b.append(T("WEB3", 88 + TW("ENGINEER", 12, "ui6", 4.2) + 66, 118, 12, "ui6", t["ink"], ls=4.2, opacity=.6))
    b.append(T("0xpranayy", 78, 250, 150, "serif", t["ink"], ls=-3))
    b.append(T("building products at the edge of web3", 88, 298, 20, "serifi", t["ink"], opacity=.8))
    vx = W - 64
    b.append(f'<g transform="rotate(90 {vx} 70)">' + T("PULSESWIPE  ·  CRICBET  ·  MMXXVI", vx, 70, 11, "ui6", t["ink"], ls=4, opacity=.5) + '</g>')
    hx, hy = 1040, 350
    b.append(f'<g filter="url(#rough)"><rect x="{hx}" y="{hy}" width="60" height="60" rx="6" fill="{t["paper"]}" stroke="{t["red"]}" stroke-width="4"/>'
             + T("0x", hx + 30, hy + 42, 34, "serifi", t["red"], anchor="middle") + '</g>')
    return svg(W, H, "".join(b), ROUGH + GRAIN(t["grain"]), WAVE_CSS, clip=True)

# ================================================================= INTRO (transparent)
def intro(th):
    t = THEME[th]; W, H = 1200, 230
    b = [f'<circle cx="{W/2}" cy="34" r="7" fill="{t["red"]}"/>',
         T("I care about products that feel inevitable —", W / 2, 106, 40, "serifi", t["ink"], anchor="middle"),
         T("fast, quiet, and obvious in hindsight.", W / 2, 152, 40, "serifi", t["ink"], anchor="middle"),
         T("CURRENTLY BUILDING CONSUMER EXPERIENCES ON CRYPTO RAILS", W / 2, 206, 11, "ui6", t["muted"], anchor="middle", ls=3.6)]
    return svg(W, H, "".join(b))

# ================================================================= SECTION TITLE
def section(th, roman, title):
    t = THEME[th]; W, H = 1200, 110
    tw = TW(title, 15, "ui6", 5)
    b = [T(roman, 0, 70, 30, "serifi", t["red"]),
         T(title, 56, 66, 15, "ui6", t["ink"], ls=5),
         f'<line x1="{56 + tw + 28:.0f}" y1="61" x2="{W}" y2="61" stroke="{t["ink"]}" stroke-opacity=".25" stroke-width="1"/>']
    return svg(W, H, "".join(b))

# ================================================================= PROJECT ENTRIES (with ink drawings)
def draw_cards(t, cx, cy):
    """pulseswipe: three cards fanned mid-swipe."""
    o = []
    for i, (ang, dx, fill) in enumerate([(-14, -34, "none"), (-4, -8, "none"), (10, 26, t["red"])]):
        o.append(f'<g transform="translate({cx+dx} {cy}) rotate({ang})">'
                 f'<rect x="-52" y="-74" width="104" height="148" rx="12" fill="{t["paper"] if fill=="none" else fill}" stroke="{t["ink"]}" stroke-width="1.6"/>')
        if fill != "none":
            o.append(f'<circle cx="0" cy="-14" r="22" fill="none" stroke="{t["paper"]}" stroke-width="1.6"/>'
                     f'<line x1="-30" y1="34" x2="30" y2="34" stroke="{t["paper"]}" stroke-width="1.6"/>'
                     f'<line x1="-30" y1="46" x2="12" y2="46" stroke="{t["paper"]}" stroke-width="1.6"/>')
        else:
            for k in range(5):
                o.append(f'<line x1="-34" y1="{-50+k*14}" x2="{34 - (k%2)*18}" y2="{-50+k*14}" stroke="{t["ink"]}" stroke-width="1" opacity=".35"/>')
        o.append('</g>')
    # swipe arc
    o.append(f'<path d="M{cx+70},{cy-96} q36,-6 52,22" fill="none" stroke="{t["ink"]}" stroke-width="1.4" stroke-linecap="round"/>'
             f'<path d="M{cx+116},{cy-84} l6,12 l-13,-1" fill="none" stroke="{t["ink"]}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>')
    return f'<g filter="url(#ink)">{"".join(o)}</g>'

def draw_cricket(t, cx, cy):
    """cricbet: stumps, bails, and a ball in flight."""
    o = []
    for i in (-22, 0, 22):
        o.append(f'<line x1="{cx+i}" y1="{cy-70}" x2="{cx+i}" y2="{cy+70}" stroke="{t["ink"]}" stroke-width="5" stroke-linecap="round"/>')
    o.append(f'<line x1="{cx-26}" y1="{cy-76}" x2="{cx-2}" y2="{cy-76}" stroke="{t["ink"]}" stroke-width="3.5" stroke-linecap="round"/>'
             f'<line x1="{cx+2}" y1="{cy-76}" x2="{cx+26}" y2="{cy-76}" stroke="{t["ink"]}" stroke-width="3.5" stroke-linecap="round"/>')
    o.append(f'<line x1="{cx-80}" y1="{cy+72}" x2="{cx+80}" y2="{cy+72}" stroke="{t["ink"]}" stroke-width="1.2" opacity=".5"/>')
    bx, by = cx + 96, cy - 28
    o.append(f'<path d="M{cx-120},{cy+40} Q{cx-10},{cy-150} {bx-14},{by+2}" fill="none" stroke="{t["ink"]}" stroke-width="1.2" stroke-dasharray="3 6" stroke-linecap="round" opacity=".6"/>')
    o.append(f'<circle cx="{bx}" cy="{by}" r="17" fill="{t["red"]}"/>'
             f'<path d="M{bx-11},{by-12} q9,12 0,24 M{bx-5},{by-15} q9,15 0,30" fill="none" stroke="{t["paper"]}" stroke-width="1.1" opacity=".9"/>')
    return f'<g filter="url(#ink)">{"".join(o)}</g>'

def project(th, num, name, lines, tags, drawing):
    t = THEME[th]; W, H = 1200, 300
    b = [T(num, 0, 70, 13, "ui6", t["red"], ls=3),
         T(name, -4, 150, 88, "serif", t["ink"], ls=-1.5)]
    for i, l in enumerate(lines):
        b.append(T(l, 0, 200 + i * 30, 22, "serifi", t["ink"], opacity=.78))
    b.append(T("  ·  ".join(tags).upper(), 0, 276, 11, "ui6", t["muted"], ls=3))
    b.append(T("READ THE CODE", 640, 276, 11, "ui6", t["ink"], anchor="end", ls=3))
    b.append(f'<line x1="{640 - TW("READ THE CODE", 11, "ui6", 3):.0f}" y1="284" x2="640" y2="284" stroke="{t["red"]}" stroke-width="1.5"/>')
    b.append(drawing(t, 950, 150))
    b.append(f'<line x1="0" y1="{H-1}" x2="{W}" y2="{H-1}" stroke="{t["ink"]}" stroke-opacity=".14"/>')
    return svg(W, H, "".join(b), ROUGH)

# ================================================================= TOOLS LINE
def tools(th):
    t = THEME[th]; W, H = 1200, 90
    items = ["TypeScript", "React", "Next.js", "Node", "Solidity", "PostgreSQL"]
    size, gap = 34, 34
    widths = [TW(s, size, "serifi") for s in items]
    total = sum(widths) + gap * 2 * (len(items) - 1)
    x = (W - total) / 2; b = []
    for i, (s, w) in enumerate(zip(items, widths)):
        b.append(T(s, x, 56, size, "serifi", t["ink"]))
        x += w
        if i < len(items) - 1:
            b.append(f'<circle cx="{x + gap:.1f}" cy="45" r="3.5" fill="{t["red"]}"/>'); x += gap * 2
    return svg(W, H, "".join(b))

# ================================================================= FOOTER
def footer(th):
    t = THEME[th]; W, H = 1200, 300
    b = [f'<rect width="{W}" height="{H}" rx="26" fill="{t["paper"]}"/>',
         f'<circle cx="{W/2}" cy="196" r="40" fill="{t["red"]}" filter="url(#rough)"/>',
         waves(0, W, 206, 10, 8, 8, t["ink"], t["paper"], base_op=.3),
         f'<rect width="{W}" height="{H}" rx="26" filter="url(#grain)"/>',
         T("thank you for stopping by.", W / 2, 84, 38, "serifi", t["ink"], anchor="middle"),
         T("SEE YOU IN THE COMMITS", W / 2, 118, 11, "ui6", t["muted"], anchor="middle", ls=4)]
    return svg(W, H, "".join(b), ROUGH + GRAIN(t["grain"]), WAVE_CSS, clip=True)

for th in THEME:
    out = {
        "header": header(th), "intro": intro(th),
        "s-work": section(th, "i.", "SELECTED WORK"), "s-tools": section(th, "ii.", "MATERIALS"),
        "pulseswipe": project(th, "NO. 01", "pulseswipe", ["Swipe-first discovery for onchain markets —", "find what's moving with a flick of the thumb."],
                              ["consumer", "onchain"], draw_cards),
        "cricbet": project(th, "NO. 02", "cricbet", ["Real-time cricket prediction markets —", "every ball, a market."],
                           ["real-time", "markets"], draw_cricket),
        "tools": tools(th), "footer": footer(th),
    }
    for n, s in out.items(): open(f"{OUT}/{n}-{th}.svg", "w").write(s)
print("ok")
