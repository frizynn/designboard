# Changelog

All notable changes to Designboard are documented in this file.

The project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The canvas chrome follows the current Claude Design layout: a tools pill top left with the
  page menu, a play, panel and zoom pill top right, and a properties panel that opens on demand.
  The bottom zoom bar is gone.
- Selection and ink use one blue accent instead of rose.

### Added

- Share links: with `DESIGNBOARD_SHARE_DIR` and `DESIGNBOARD_SHARE_URL` (environment or
  `~/.config/designboard/share.env`), `seed.mjs` prints a `share:` URL next to the `file:` URL,
  and the handover gives both. The README covers publishing over `tailscale serve`, any static
  server, or not at all, with the precautions for each.
- Save asks for the format: the editable HTML canvas (`⌘ S` still saves it directly) or a PDF of
  this page, all pages or the selected artboard.
- Pages can be created, renamed, reordered and deleted from the page menu, and an artboard can
  move between pages from its properties.
- Artboard properties: name, size, position, page, prototype flag, PDF mode, duplicate, delete.
- Artboards drag by their name strip; name strips stay legible at any zoom.
- Zoom menu (fit, selection, 50/100/200%), `⌘ +`, `⌘ −`, `⌘ 0`, `⇧ 1`, `⇧ 2`, a Hand tool (`H`)
  and Space to pan from any tool.
- Play menu listing prototypes and static artboards, and a PLAY button on each prototype.
- PDF export of the selected artboard, the current page or all pages.
- Section title notes (`"kind": "title"`).

### Fixed

- Two-finger pan is the browser's native, threaded scrolling with the platform's momentum. On a
  20-artboard canvas its latency p95 fell from about 40 ms to 18 ms, and it no longer drops frames
  when the page is busy.
- In Chromium browsers that isolate sandboxed iframes (Chrome, Helium, recent Chromium), a pinch
  over an artboard did nothing and two-finger scroll over an artboard lost about 40% of the
  gesture. Artboards no longer take pointer input on the canvas; the canvas owns it and forwards
  hover, clicks and resize drags to the artboard.
- Wheel bursts now paint once per frame, and the canvas layer re-rasters crisp after zooming.
- The properties panel starts open again, and remembers when you close it.
- A pinch or `⌘` + wheel over the header, toolbars or panel zoomed the whole browser page.
- Pinch over an artboard zoomed around the window centre instead of the cursor.
- The zoom buttons zoomed around the canvas origin, throwing the view off screen.
- PDF export printed the page chrome on one Letter sheet. Each artboard now prints on a sheet of
  its own size, and `"print": "flow"` artboards print their full height.
- The seeder warned about overlaps between artboards on different pages.
- A literal `$&` in an artboard expanded during seeding.

## [0.1.0] - 2026-09-07

### Added

- Portable, self-contained HTML canvases assembled from one or more artboards.
- Infinite pan and zoom, pages, focus mode, notes, arrows, and freehand drawing.
- Visual editing for content, appearance, text, sizing, position, and layout.
- Live HTML source and CSS custom property editing.
- Present and read-only view modes.
- Save, PDF export, validation, and source extraction workflows.
- Sandboxed artboard execution without same-origin access.
- Automated tests for round-trip fidelity, adversarial content, input guards, and parser safety.

[0.1.0]: https://github.com/frizynn/designboard/releases/tag/v0.1.0
