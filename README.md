# design-canvas

Draft visual designs as self-contained HTML artboards laid out on one pan/zoom canvas.

No hosted service, no account, no network. The output is one HTML file that opens in any browser.

## Use

```bash
node assets/seed.mjs \
  --template assets/canvas.template.html \
  --out spring-menu.html --title "Spring Menu" \
  --artboard Main.html --artboard Pricing.html \
  --image hero.png --canvas canvas.json

node assets/seed.mjs --check spring-menu.html          # verify it parses
node assets/seed.mjs --extract spring-menu.html --to ./back   # read working files back
```

## Layout

```
SKILL.md                      workflow and the rules that bite
references/craft.md           aesthetic, typography, color, variations, slop
references/screens.md         app UI, mobile, landing pages, prototypes
references/print.md           posters, flyers, brochures, documents
references/canvas-format.md   artboard format and canvas.json
assets/canvas.template.html   the canvas host (pan/zoom, notes, pages, print)
assets/seed.mjs               assembles artboards into one file
```

## What the canvas does

Pan and zoom, fit-to-view, sticky notes, named pages, double-click an artboard to focus it,
Export PDF through the browser's print pipeline.

Each artboard renders in its own `sandbox="allow-scripts"` iframe with **no** `allow-same-origin`,
so it runs on an opaque origin and the host page cannot read into it. Artboards share no state.

## Not yet

Element-level editing (click-to-select plus a properties panel) is the next step. The intended
route is [GrapesJS](https://github.com/GrapesJS/grapesjs) (BSD-3-Clause) mounted over the focused
artboard, writing back to the working files. Deliberately **not** tldraw: its licence is
source-available, not open source, and production embedding needs a commercial agreement.
