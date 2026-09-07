# Artboard format and canvas.json

## An artboard is a plain, self-contained HTML file

```html
<!doctype html>
<meta charset="utf-8">
<title>Hero</title>
<style>
  body { margin: 0; font-family: "Söhne", system-ui, sans-serif; background: #faf9f7; }
  a { color: #b45309; } a:hover { color: #92400e; }
</style>
<div style="display: flex; flex-direction: column; gap: 24px; padding: 48px">
  <h1 style="margin: 0; font-size: 44px; line-height: 1.05; color: #1c1917">Spring menu</h1>
  <p style="margin: 0; max-width: 44ch; color: #57534e; text-wrap: pretty">Opens 14 March.</p>
</div>
```

No build step, no framework, no imports. Everything the artboard needs is in the file, except
images (base64 files entries, referenced by bare filename) and Google Fonts (a `<link>`).

**Inline styles for anything visual**; the `<style>` block is for `@font-face`, link colors and
resets only. Inline is what an inspector can edit and what survives being copied elsewhere.

## canvas.json

```json
{
  "artboards": [
    { "file": "Hero.html",  "x": 0,   "y": 0, "w": 880, "h": 560 },
    { "file": "Main.html",  "x": 960, "y": 0, "w": 560, "h": 640, "title": "Checkout" }
  ],
  "notes": [
    { "id": "brief", "x": 40, "y": -120, "w": 240, "text": "Client wants warmer type." }
  ],
  "pages": [
    { "id": "page-1", "name": "Flows" },
    { "id": "page-2", "name": "Components" }
  ],
  "launch": { "view": "canvas", "page": "page-1" }
}
```

**artboards** - `x`/`y`/`w`/`h` are CSS px on the infinite canvas at zoom 1. Leave **≥80 px
between frames in a row** and **≥120 px between rows**: the name strip sits above each frame.
`w`/`h` size the frame and neither scale nor crop.

Optional per-artboard keys:

| Key | Meaning |
|---|---|
| `title` | Cosmetic header rename. The filename stays the identity |
| `page` | Which page it belongs to. Omit on a single-page canvas |
| `print` | `"fixed"` (default, exports as one page) or `"flow"` (paginates) |
| `interactive` | `true` when the artboard has working controls |

**notes** - sticky notes on the canvas, manifest-only, no backing file. `id` is a unique handle of
1-40 chars (letters, digits, `-`, `_`). `x`/`y`/`w` in canvas px, width 120-2000; height auto-fits,
so no `h`. `text` is one plain string - use `\n` for newlines, never an array.

**pages** - splits the canvas into named sets the viewer flips between. At most 40, each exactly
`{id, name}`. Artboards and notes join one with `"page": "<id>"`; anything without a `page` belongs
to `pages[0]`. Omit `pages` entirely for a single-page canvas - do not add it just to name one page.

Use pages for genuinely separable sets - flows vs. a component sheet, v1 vs. v2. Not to paginate a
print piece: those are a series of artboards on **one** page.

**launch** - which view a fresh open lands on. Exactly two shapes:
`{"view": "canvas"}` (optional `"page"`) or `{"view": "focused", "file": "<a listed artboard>"}`.

## Rules the seeder enforces

- Artboard stems are unique, case-insensitively.
- Every `file` in `canvas.json` must be an artboard you passed with `--artboard`.
- Every `page` referenced must be listed in `pages`.
- Note ids are unique and well-formed; a bad one is refused, not silently dropped.
- Images are stored as bare base64 under their **basename** - `--image photos/pool.jpg` becomes
  `pool.jpg`. Two images sharing a basename are refused.
- Generic output names and titles are refused.
- Artboards you do not list in `canvas.json` get slots appended in a row.
