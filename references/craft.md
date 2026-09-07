# Craft: aesthetic, type, color, variations

## Settle the aesthetic with the user, not for them

If the user gave no aesthetic, no references and no design system, get their input before
committing. Either ask, or sketch **2-4 genuinely different low-fi direction artboards** and let
them pick one they can see.

Do not just pick your own aesthetic and build the whole thing. That is how you get slop: a
competent, forgettable design nobody asked for, that now costs a rebuild to change.

**When you cannot ask** - nobody in the loop this turn, or the user said not to ask - do not stop.
Commit to one direction grounded in whatever signal exists (supplied brand assets settle palette
and tone; an internal-tool brief means utilitarian), build the deliverable this turn, state the
assumption in one line at handover, and where the aesthetic was genuinely open put 1-2 low-fi
alternates *beside* the deliverable - never instead of it.

A brief that names a concrete deliverable (a clickable prototype, three screens, a two-page
brochure) settles the same question even with the user present: build it, one direction with
alternates beside it, and fold what is left into the handover.

Once a direction is settled, or a design system is attached, stop re-asking.

## Commit to a small system

**Type.** 1-3 families, no more. Web-safe, Google Fonts (a `<link>` in the artboard's `<head>`),
or embedded faces. Give every face a real fallback stack with close metrics - PNG export does not
embed webfonts, so exported text shows the fallback.

**Foreground and background.** Pick a temperature - warm, cool, neutral - and hold it. Use subtly
toned whites and blacks, never pure `#fff` on `#000`. Keep saturation under 0.02 for whites.

**Accents.** Zero to two. Define them in `oklch()` and give them the **same chroma and lightness**,
varying only hue - that is what makes two accents look like they belong to the same system.

**Borrowing.** Prefer colors from the brand or design system when there is one. If it is too
restrictive, extend it in `oklch` from the existing values. Avoid inventing a palette from scratch
when one already exists.

## When no brand governs, be bold

For work not governed by an existing brand, commit to a direction before building:

- **Purpose** - what problem does this solve, for whom?
- **Tone** - pick an extreme and stay true to it: brutally minimal, maximalist, retro-futuristic,
  organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial.
- **Differentiation** - what makes this unforgettable?

Maximalism and refined minimalism both work. Intentionality, not intensity. Then execute:

- **Typography** - distinctive, characterful faces. A display face paired with a refined body face.
- **Color** - dominant colors with sharp accents beat timid, even palettes.
- **Motion** - CSS in the artboard. One well-orchestrated reveal beats scattered micro-interactions.
- **Composition** - asymmetry, overlap, diagonal flow, grid-breaking elements. Generous negative
  space *or* controlled density - pick one.
- **Depth** - atmosphere over flat fills: gradient meshes, noise, patterns, layered transparencies,
  grain.

Match implementation complexity to the vision: maximalism needs elaborate effects, minimalism
needs restraint and exact spacing. And **vary across generations** - never converge on the same
fonts and palette every time.

## Hi-fi is rooted in context

Hi-fi mockups come from real context: the codebase, brand assets, product screenshots, an attached
design system. Acquire it before designing, and ask for it if you cannot find it. Mocking a full
product from scratch is a last resort.

State assumptions early and show work as soon as there is something to react to. Missing an icon,
asset or component? Draw a marked placeholder - better than a bad attempt at the real thing.

## Variations on the canvas

The multi-artboard canvas exists to explore options. Use it deliberately.

- **Settle open direction decisions first.** Overall direction, hero layout, type pairing, color
  stance, density. Offer 2-4 candidates, each exploring an axis you can name - "Warm editorial"
  vs "Dense data-first". Five shades of one aesthetic is no choice at all.
- **Decision fidelity is not deliverable fidelity.** Low-fi sketches are enough to pick a
  direction.
- **Give each option an honest motivation and its main tradeoff.** A set where only your favorite
  gets a case made for it is a rigged vote.
- **Keep option names stable.** Once an artboard is "Option B" or "Warm editorial", it keeps that
  identity. Never renumber across turns.
- Sketch directions as their own artboards (`DirectionA.html`); keep `Main.html` for the
  deliverable. When the user picks one, build the final **into** `Main.html`, move the unchosen
  sketches to a second page or delete them, and keep the canvas title the design's name - never
  "...Directions".
- **When the direction is settled and they want variations to keep**, give 3+ across several
  dimensions: by-the-book beside novel interactions, layouts, metaphors and styles. Basic first,
  more adventurous as you go. Remix the brand's DNA - scale, fills, texture, rhythm, layering,
  type. The goal is atomic variations they can mix and match, not one perfect option.
- **For early exploration, wireframe.** Breadth over polish: 3-5 distinctly different approaches
  per idea. Simple shapes, placeholder text, minimal color, so the focus stays on structure and
  flow.

## Avoid AI slop

Recognisable tells, all of them worth avoiding unless the brand actually calls for them:

- Aggressive gradient backgrounds, especially purple-to-blue
- Emoji as iconography or decoration
- Rounded containers with a left-border accent stripe
- Overused families: Inter, Roboto, Arial, Fraunces
- "Data slop" - numbers, stats, badges and icons that carry no information
- Three competing call-to-action buttons of equal weight
- Every section the same height, the same rhythm, the same card grid

Less is more. Bias toward minimalism, and make every element earn its place.

## Do not recreate copyrighted designs

If asked to recreate a company's distinctive UI patterns, proprietary command structures or
branded visual elements, decline unless the user works there. Understand what they actually want
to build and help them make something original instead. Ask when it is unclear.
