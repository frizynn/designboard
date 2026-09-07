# Contributing

## Run the tests

```bash
npm test
```

The suite drives `assets/seed.mjs` end to end: seed, `--check`, `--extract` round-trip, and every
input guard. It needs only Node 18+, no browser.

## The one rule that will bite you

**Never emit the literal `<!--` or `<script` inside the canvas template's own `<script>` block.**

Together they put the HTML parser into *script-data-double-escaped* state. `</script>` stops
closing the block, the script is left unterminated, and it silently never executes — no console
error, no exception, just a dead page. Split them: `"<" + "!--"`, `` `<scr` + `ipt>` ``.

`npm test` checks for this. So should you, before assuming your JS is broken.

## Architecture in one paragraph

Each artboard renders in its own `sandbox="allow-scripts"` iframe with **no** `allow-same-origin`,
so it runs on an opaque origin the host page cannot read into. Everything — selection, styling,
text, resize, serialisation — travels over `postMessage` to a small agent injected into each
artboard. That isolation is load-bearing: artboard content is untrusted, and nothing may weaken it.

## Motion and craft

`SKILL.md` carries the motion contract and the design rules. Keep them: only `transform`, `opacity`
and colours animate, nothing over 200ms in the chrome, every pressable element gets `:active`
feedback, hover sits behind a fine-pointer query, and everything collapses under
`prefers-reduced-motion`.
