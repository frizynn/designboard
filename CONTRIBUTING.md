# Contributing to Designboard

Thanks for taking the time to improve Designboard. Contributions should keep the project small,
portable, local-first, and understandable without a framework or hosted service.

## Before you start

- Search existing issues before opening a new one.
- Use the bug report form for reproducible defects.
- Use the feature request form for product proposals.
- For a substantial change, open an issue first so the direction can be discussed before code is
  written.
- Report security problems privately according to [SECURITY.md](SECURITY.md).

## Development setup

Requirements:

- Node.js 18 or newer
- Git

Clone the repository and run the test suite:

```bash
git clone https://github.com/frizynn/designboard
cd designboard
npm test
```

There are no runtime dependencies and no build step.

## Repository map

| Path | Purpose |
|---|---|
| `SKILL.md` | Agent workflow, design rules, and runtime constraints |
| `assets/seed.mjs` | CLI for assembling, checking, and extracting canvases |
| `assets/canvas.template.html` | Self-contained canvas editor and runtime |
| `references/` | Artboard format and design guidance loaded by the skill |
| `test/run.mjs` | Seeder, round-trip, input guard, parser safety and share link tests |

## Make a focused change

Keep pull requests small enough to review as one coherent change. Preserve existing behavior unless
the pull request explicitly changes it, and avoid adding dependencies for functionality that can be
implemented clearly with platform APIs.

For user-facing changes:

1. Update the relevant documentation.
2. Add or update tests when behavior changes.
3. Run `npm test`.
4. Open the generated canvas in a browser when the change affects layout or interaction.

## Security invariants

Each artboard renders in a `sandbox="allow-scripts"` iframe without `allow-same-origin`. Selection,
styling, text, resize, and serialization travel over `postMessage` to a small agent injected into
each artboard. This isolation is load-bearing because artboard content is untrusted.

Do not weaken the sandbox or treat artboard content as trusted instructions.

## HTML parser invariant

Never emit the literal `<!--` or `<script` inside the canvas template's own `<script>` block.

Together they can put the HTML parser into `script-data-double-escaped` state. The closing script
tag then stops closing the block, leaving an unterminated script and a page that silently does not
run. Split those strings instead:

```js
"<" + "!--"
`<scr` + `ipt>`
```

The test suite guards this invariant.

## Motion and interface quality

`SKILL.md` defines the motion contract and design rules. In the canvas chrome:

- Animate only `transform`, `opacity`, and colors.
- Keep interaction feedback under 200 ms.
- Give every pressable element an `:active` state.
- Put hover behavior behind a fine-pointer media query.
- Respect `prefers-reduced-motion`.
- Avoid rebuilding iframes or live property controls unnecessarily.

## Pull request checklist

- The change has one clear purpose.
- `npm test` passes locally.
- New behavior is documented.
- Security and parser invariants remain intact.
- Visual changes were checked in a browser.
- Generated or unrelated files are not included.

By contributing, you agree that your contribution is licensed under the project's MIT License.
