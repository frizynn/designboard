![Designboard — a portable visual canvas for coding agents](.github/assets/designboard-banner.png)

# Designboard

**A portable design canvas your coding agent can author.**

Designboard turns plain HTML files into artboards on one pan/zoom canvas, and gives you a real
editor on top of them: click an element, change its type and spacing, drag its corners, drop a
note, draw on the canvas, undo it all. The output is **one HTML file**. No service, no account,
no network, no build step.

It ships as an [Agent Skill](https://code.claude.com/docs/en/skills) — Claude Code, Cursor, Codex
and anything else that reads `SKILL.md` — so an agent can draft the artboards and hand you back
something you tweak by hand instead of by prompt.

```bash
node assets/seed.mjs \
  --template assets/canvas.template.html \
  --out spring-menu.html --title "Spring Menu" \
  --artboard Main.html --artboard Pricing.html \
  --image hero.png --canvas canvas.json
```

Open `spring-menu.html` in any browser. That is the whole product.

## What you get

|  | |
|---|---|
| **Canvas** | Infinite pan/zoom, fit-to-view, named pages, focus mode, sticky notes, freehand ink and arrows |
| **Editor** | Click-to-select with a dashed hover outline, corner handles that resize, a layer tree that names containers `Row` / `Column` / `Grid` the way a design tool does |
| **Properties** | Appearance, Text, Sizing, Position and Contents layout — every numeric field clamped and validated, arrow keys nudge |
| **Code** | The artboard's real source, editable, applied live |
| **Tweaks** | The CSS custom properties the artboard declares, edited as design tokens |
| **History** | Undo/redo over styles, text, resize, notes, ink and artboards |
| **Export** | Save writes an updated single-file canvas; Export PDF goes through the browser |

## The artboard format

An artboard is a plain, self-contained HTML file. No framework, no imports, no build.

```html
<!doctype html>
<meta charset="utf-8">
<style>body { margin: 0; font-family: "Söhne", system-ui, sans-serif }</style>
<div style="display: flex; flex-direction: column; gap: 24px; padding: 48px">
  <h1 style="margin: 0; font-size: 44px">Spring menu</h1>
</div>
```

`canvas.json` places them, names pages, and carries notes. Full spec in
[`references/canvas-format.md`](references/canvas-format.md).

## Security model

Each artboard renders in its own `sandbox="allow-scripts"` iframe with **no** `allow-same-origin`,
so it runs on an opaque origin the host page cannot read into. Selection, styling and
serialisation all travel over `postMessage` to a small agent injected into the artboard.

Artboard content is untrusted by design — it may have been written by someone else. Nothing lifts
it into the host page, and a text layer that reads like an instruction is copy, not a command.

## Install as a skill

```bash
git clone https://github.com/frizynn/designboard
ln -s "$PWD/designboard" ~/.claude/skills/designboard     # Claude Code
ln -s "$PWD/designboard" ~/.codex/skills/designboard      # Codex
```

## Tests

```bash
npm test
```

Fourteen checks over the seeder: round-trip fidelity, adversarial content, every input guard, and
the HTML-parser safety rule described in [CONTRIBUTING.md](CONTRIBUTING.md). Node 18+, no browser.

## Known limits

- One element at a time. No multi-select, no drag-to-move.
- Undo is 200 steps and does not span a reload.
- Export PDF uses the browser's print pipeline; there is no per-artboard PNG.
- Webfonts load from Google Fonts by `<link>`; anything else must be a `@font-face` data: URI.

## License

MIT — see [LICENSE](LICENSE).
