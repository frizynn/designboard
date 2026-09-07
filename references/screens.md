# Screens: app UI, mobile, landing pages, prototypes

## Scales

In **mockup content** - the buttons and rows inside a phone artboard, not the canvas chrome -
hit targets are never smaller than **44px**. Text is sized for its real viewing distance, not for
how it looks zoomed out on the canvas.

Common frames:

| Frame | Size |
|---|---|
| Phone | 390 × 844 |
| Phone (large) | 430 × 932 |
| Tablet | 834 × 1194 |
| Desktop | 1440 × 900 |
| Desktop (wide) | 1920 × 1080 |

The artboard's `w`/`h` in `canvas.json` set the **frame**. They do not scale or crop: a 1440-wide
root inside a 560-wide frame scrolls and clips, it does not shrink. Match them.

## No fake chrome

Do **not** draw a fake iOS status bar - the "9:41 · wifi · battery" strip - and do not draw a fake
virtual keyboard. On a real phone the real ones render on top of your layout, so a painted fake
looks doubled up and amateurish. Leave that space alone.

Same inside a desktop artboard that contains a phone rectangle: no fake status bar in it either.

## Landing pages

Build with marketing-page anatomy:

- **A hero that states the offer in one sentence**, with one clear call to action.
- **Proof the visitor can trust** - testimonials, client logos, numbers - drawn from the user's
  own material, or visibly marked as placeholder.
- **Benefit sections that answer real doubts**, not a list of features.
- **One primary action per page**, repeated down the page. Not three competing buttons.

**The copy is the product.** Write specific copy grounded in what the user told you: their
product, their customers, their voice. Never lorem ipsum, never "Welcome to our website", never
interchangeable filler that could describe any business.

Where a real fact is missing - a price, a date, an address - put a visibly marked placeholder like
`[YOUR PRICE]` for the user to fill. Do not fabricate one.

The exception: an interactive prototype may use realistic **sample** values where the interaction
depends on them (a billing toggle needs prices). Label them as sample at handover. Structural copy
may be drafted. Other hard facts - names, dates, codes, contacts - stay bracketed.

**Check responsive behavior before presenting.** Look at the page at a phone width and fix what
breaks: wrapping headlines, squashed grids, text too small to read.

## Static mockups vs. clickable prototypes

Ask which, once, when the brief does not settle it. Build a prototype when the brief says
prototype, clickable, flow, or "works".

For a prototype, keep interaction state in a small `<script>` inside the artboard. Remember that
artboards share nothing - a prototype spanning three screens either lives in one artboard with
internal view switching, or duplicates what each screen needs.

Do not attach global keydown handlers that swallow Cmd+Z - the canvas needs those keys.

## Recreating an existing UI

When the source is reachable - a repo checkout, pasted files, an attached design system - build
from the real source, not from memory of the app:

- Explore what exists. Read the components and the styles.
- Copy the assets the page actually loads: icons, fonts, images, stylesheets. Not bundler-only
  component source.
- Copy **exact numeric values** - paddings, radii, font sizes, line-heights - from the source.
  Never round them, never snap them to a 4/8px grid or a framework default.

Recreating from code and design context is far more accurate than recreating from screenshots.
When source is available, treat screenshots as high-level guidance only. If you cannot read the
source, say so rather than inventing from memory.
