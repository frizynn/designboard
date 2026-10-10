![Designboard, a portable visual canvas for coding agents](.github/assets/designboard-banner.png)

# Designboard

[![CI](https://github.com/frizynn/designboard/actions/workflows/ci.yml/badge.svg)](https://github.com/frizynn/designboard/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/frizynn/designboard?color=111111)](https://github.com/frizynn/designboard/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-111111.svg)](LICENSE)

**A portable visual canvas for coding agents.**

Designboard lets an AI agent draft real HTML artboards and hand them back on an editable,
pan-and-zoom canvas. Refine text, color, spacing, layout, and source directly in the browser, then
save the entire design as one portable HTML file.

No hosted service. No account. No build step. No lock-in.

## Install

Install Designboard as an [Agent Skill](https://agentskills.io):

```bash
npx skills add frizynn/designboard
```

The installer detects supported coding agents and lets you choose where to install the skill.
Designboard follows the open [`SKILL.md` specification](https://agentskills.io/specification), so
it works with compatible clients such as Codex, Claude Code, Cursor, and others.

<details>
<summary>Manual installation</summary>

```bash
git clone https://github.com/frizynn/designboard
ln -s "$PWD/designboard" ~/.codex/skills/designboard
ln -s "$PWD/designboard" ~/.claude/skills/designboard
```

</details>

## Use it

Ask your coding agent for a visual design. For example:

```text
Use Designboard to draft a responsive pricing page that matches this repository's design system.
Include desktop and mobile artboards.
```

The agent inspects the current product, authors one or more HTML artboards, and returns a single
canvas file. Open that file in any modern browser to review and edit the result.

## Why Designboard

Most agent-generated mockups end as screenshots, throwaway code, or another hosted project.
Designboard uses plain HTML as both the source and the handoff:

- **Agent-native:** the skill teaches compatible coding agents how to inspect an existing design
  system and produce editable artboards.
- **Visually editable:** select elements, adjust styles and layout, edit source, add notes, draw,
  resize frames, and undo changes.
- **Portable:** the canvas, artboards, images, notes, and editor travel in one HTML file.
- **Local-first:** Designboard itself does not require a server, account, telemetry, or network
  connection.
- **Inspectable:** the artifact remains HTML and CSS rather than a proprietary document format.

Remote assets referenced by an artboard, such as Google Fonts, still require their original
network connection. Embed assets when the final canvas must work fully offline.

## What is included

| Area | Capabilities |
|---|---|
| Canvas | Trackpad pan and pinch zoom anchored to the cursor, zoom menu and shortcuts, pages you create, rename, reorder and delete in the canvas, draggable artboards, section titles, notes, freehand ink, and arrows |
| Editor | Element selection, resize handles, a semantic layer tree, and inline property controls |
| Code | Live editing of each artboard's real HTML source |
| Tweaks | Editing for CSS custom properties exposed by the artboard |
| History | Up to 200 undo and redo steps for visual and source changes |
| Play and present | Open any artboard full window, play prototypes, or present a page as a deck |
| Export | Save as a portable HTML file, or a PDF of one artboard, one page or every page, each artboard on a sheet of its own size |

## Build a canvas directly

Designboard can also be used without an agent. Create a self-contained `Main.html`, then run:

```bash
node assets/seed.mjs \
  --template assets/canvas.template.html \
  --out spring-menu.html \
  --title "Spring Menu" \
  --artboard Main.html
```

For multiple artboards, pass `--artboard` more than once. Use `canvas.json` to control placement,
pages, notes, and the initial view:

```bash
node assets/seed.mjs \
  --template assets/canvas.template.html \
  --out spring-menu.html \
  --title "Spring Menu" \
  --artboard Main.html \
  --artboard Pricing.html \
  --image hero.png \
  --canvas canvas.json
```

Validate or extract a canvas with:

```bash
node assets/seed.mjs --check spring-menu.html
node assets/seed.mjs --extract spring-menu.html --to extracted-canvas
```

See the [canvas format reference](references/canvas-format.md) for the complete schema.

## How it works

```text
HTML artboards + optional images + canvas.json
                    |
                    v
               assets/seed.mjs
                    |
                    v
       one self-contained editable HTML file
```

Each artboard runs inside a sandboxed iframe. A small injected editing agent communicates with the
host through `postMessage`; the host never receives same-origin access to artboard content. Saving
serializes the edited artboards back into the portable file, while extraction restores their
individual source files.

## Security

Artboard content is treated as untrusted. Each artboard runs in a `sandbox="allow-scripts"` iframe
without `allow-same-origin`, and its contents are never treated as agent instructions.

See [SECURITY.md](SECURITY.md) for supported versions and private vulnerability reporting.

## Requirements

- Node.js 18 or newer for seeding, checking, and extracting canvases
- A modern browser for viewing and editing
- A compatible coding agent only when using Designboard as a skill

## Current limitations

- One element can be selected at a time.
- Elements cannot yet be dragged to move them.
- Undo history does not survive a page reload.
- PDF export goes through the browser's print dialog; pick "Save as PDF" there.
- Per-artboard PNG export is not yet available.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing the
canvas runtime, especially its iframe isolation and HTML parser safeguards.

Published changes are tracked in the [changelog](CHANGELOG.md).

## License

Designboard is available under the [MIT License](LICENSE).
