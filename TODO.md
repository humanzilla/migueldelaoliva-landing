# TODO — migueldelaoliva.com

Round 2. Work items from the **design and accessibility review of 2026-08-12**, run against
the built site in headless Chromium at 1440×900 and 375×812 with the Playwright MCP. Every
finding below was measured in a browser, not inferred from the source.

Scope constraint for **all** items, unchanged from round 1: **do not redesign the visual
language.** Reuse the existing palette, type scale and class names in `assets/css/main.css`
(810 lines, no custom properties — pull the literal hex values). New CSS only where a
genuinely new component requires it, and it must look like it was always there.

**Round 1 is finished and its record lives in git, not here.** All seventeen items landed
and were committed; `TODO.md` was emptied in `1cbf690`. To read why something was built the
way it was — and several items below depend on those decisions — use:

```bash
git show 1cbf690^:TODO.md          # the full round-1 file, 1540 lines
```

The decisions most likely to bite you are flagged inline in the items below.

Deferred out of this round (do not action): FAQ section + FAQPage schema, crisis/emergency
block, insurance/`seguros` copy, honorarios, duración de consulta. These need answers from
the doctor first, not effort.

---

## Status board

| Item | Wave | Status |
| --- | --- | --- |
| W18 — Sticky bar collides with the hero CTA on mobile | 1 | ✅ Done — 2026-08-12 |
| W19 — The mobile header is 64 px of nothing | 2 | ⬜ Not started |
| W20 — Touch targets below 44×44 | 2 | ⬜ Not started |
| W21 — Focus states are effectively unstyled | 2 | ⬜ Not started |
| W22 — Legibility: hairline body text, over-tight titles, sub-12 px labels | 2 | ⬜ Not started |
| W23 — The stretched composer card and the left-pinned hero | 3 | ⬜ Not started |
| W12b — Voice and tone sweep across all copy | 4 | ⬜ Not started |
| W26 — One way in: every CTA leads to the composer | 1 | ✅ Done — 2026-08-12 |
| W24 — Two-column hero | — | ⏸️ Blocked — needs an owner decision |
| W25 — Verify on a real phone over a real connection | — | ⏸️ Blocked — needs hardware |

Legend: ⬜ Not started · 🟡 In progress · ✅ Done · ⏸️ Blocked

**W12b carries over from round 1 unfinished.** It was always meant to run last, and it still
is — three of the defects this review found are copy defects that belong to it. They have
been folded into its instructions rather than duplicated as new items.

---

## Completion protocol

**Every work item ends by updating this file.** An item is not finished when the code
works — it is finished when the next person can tell that it worked. On completing an item:

1. **Verify first.** Run `hugo --gc --minify` and whatever check the item's own
   instructions specify. Do not mark anything done on the strength of "the edit applied".
2. Change the item's row in the **Status board** above to ✅ **Done** with today's date.
3. Add ✅ **DONE** to the item's `##` heading.
4. Append a short **Outcome** block directly under that heading recording: what actually
   landed, which files changed, how it was verified, and anything that deviated from the
   instructions or was left undone. Deviations matter more than confirmations — if you
   skipped part of the item, say so there rather than leaving it to be discovered.
5. If the work surfaced a new problem outside the item's scope, add it as a new work item
   rather than silently fixing it or dropping it.
6. **Commit to the current branch.** One commit per work item, including the `TODO.md`
   update, so each item is a single reviewable and revertable unit:

   ```bash
   git add -A
   git commit -m "W20: 44 px touch targets on chips, pills and social links"
   ```

   Subject line format: `<ID>: <what changed>`. Do not squash several items into one
   commit. Do not push unless asked.

If an item is only partly done, mark it 🟡 **In progress** and record precisely what
remains. Never mark something ✅ that a reviewer would disagree with.

### Verify before believing

Do not mark an item done because a session reported it done. Check the working tree:
`git status`, `git diff --stat`, and grep for the thing that was supposed to change. A
session can end without its edits applying, and a `TODO.md` that claims work exists when it
does not is worse than one that says nothing.

### How to verify in a browser

Per `CLAUDE.md`: **Playwright MCP only.** Not the Chrome extension, not `Google Chrome.app`
from Bash. Serve the *built* output, never `hugo server` — livereload holds a websocket open
and a headless page never settles:

```bash
hugo --gc --minify && python3 -m http.server 1399 --directory public
```

Pick a different port if 1399 is taken; parallel sessions on this repo collide on it.

**One trap, worth knowing before you waste time on it:** a full-page screenshot catches the
scroll reveal in its hidden state and comes back almost blank. That is the screenshot, not
the page. Force the revealed state first:

```js
document.documentElement.classList.remove('js-reveal');
document.querySelectorAll('main > section').forEach(s => s.classList.add('is-revealed'));
```

---

## Site map

| File | Role | Lines |
| --- | --- | --- |
| `hugo.toml` | All site params: contact, hero, whatsapp, GA4 | — |
| `content/_index.md` | The first-person "quién soy" narrative | 25 |
| `layouts/index.html` | The entire single page | 191 |
| `layouts/partials/header.html` | Nav only — **no logo, this is W19** | 9 |
| `layouts/partials/footer.html` | Copyright + analytics privacy line | 12 |
| `layouts/partials/whatsapp-cta.html` | The only place a WhatsApp URL is built | — |
| `layouts/partials/composer.html` | Stepped Alpine composer + no-JS fallback | 118 |
| `layouts/partials/schema.html` | JSON-LD `@graph` | — |
| `layouts/partials/head.html` | Meta, favicons, CSS, reveal bootstrap, analytics | 69 |
| `assets/css/main.css` | No custom properties, colours hardcoded | 810 |
| `assets/js/main.js` | Reveal + Alpine composer + WhatsApp tracking | 179 |
| `assets/js/vendor/alpine.min.js` | Vendored Alpine, never a CDN | — |
| `data/*.yaml` | social, services, credentials, motivos | — |

---

## W18 — The sticky WhatsApp bar collides with the hero CTA on mobile ✅ DONE

> **W26 moved these numbers on the same day.** The general CTAs now carry a longer label
> that wraps to two lines at 375 px, so the bar is 86 px tall, not 72, and `.hero` and
> `footer` padding went to 7rem. The mechanism below is unchanged; the measurements in
> W26's Outcome are the current ones.

### Outcome — 2026-08-12

The bar now stays off screen while `.hero-actions` is in view and slides up once it leaves.
Files changed: `assets/css/main.css`, `assets/js/main.js`, `layouts/partials/head.html`.

- **CSS** (inside the existing 768 px block): `html.js-sticky .sticky-cta` gets
  `transform: translateY(110%)` and `.is-visible` takes it back, as the item specified.
  Added beyond the snippet: `visibility: hidden` on the hidden state, with the transition
  delayed until the slide finishes (`transition: transform 0.25s ease, visibility 0s linear
  0.25s`). Without it the bar is off screen but its link is still tabbable — a keyboard lands
  on a WhatsApp link nobody can see, with no way to scroll to it because the bar is fixed.
- **Hero padding floor**: `.hero { padding: 3rem 0 4rem }` → `3rem 0 6rem` (64 px → 96 px),
  clearing the bar's measured 72 px and matching `footer { padding-bottom: 6rem }`, which is
  paired with the same number. The bar's height did not change, so that footer value stands.
- **JS**: a new IIFE at the top of `main.js`, after the reveal and before the Alpine block —
  its own IIFE for the reason the item gives. It observes `.hero-actions` (not the button:
  "Ver dirección y horarios" sits in the same row and was covered too) and toggles
  `.is-visible`.
- **Deviation — where `js-sticky` is set.** The item said "from JavaScript, not from the
  server"; it is set by a small inline script in `head.html`, not by `main.js`. `main.js` is
  deferred, so setting it there means the bar paints visible and then slides away on load —
  a piece of downward motion, at load, on a page that owes its readers calm. Putting it in
  the head applies the hidden state before first paint, and it is W8's exact pattern: the
  script drops the class again after 2 s unless `main.js` has set `sticky-ready`, so a
  blocked or slow script leaves the bar always visible rather than permanently hidden.
  Verified by aborting the `main.js` request — `js-sticky` was gone and the bar was back.
  Unlike the reveal script this one does **not** bail on reduced motion: the bar must still
  behave, it just must not animate.

Verified in headless Chromium (Playwright MCP) against the built site on `:1399`:

| Check | Result |
| --- | --- |
| 375×812, on load | Bar at y 819, below the 812 fold. Hero actions 696–806, unobstructed. Screenshot confirms one CTA on screen, not two. |
| 375×812, scrolled past hero | Bar at y 740, visible. Back to top: hidden again. |
| 375×667, on load | Hero actions are below the fold, so the bar shows — correct. At the scroll position where the hero's bottom edge rests at the viewport bottom, actions end at 571 vs bar top 674. Under the old 64 px padding that same position clipped the row by 8 px. |
| Scripting disabled, 375×812 | No `js-sticky`; bar `display: block`, `visibility: visible`, `transform: none`. Every `main > section` at opacity 1 — W8 intact. |
| `prefers-reduced-motion: reduce` | `transition-duration` computes to 1e-05s, so the bar snaps. Hidden at load, present after scrolling, `aria-label` and `wa.me` href unchanged. |
| 1280 px | `display: none`, as before. |
| `hugo --gc --minify` | Clean. |

**Known residual, and it is not fixable from this item.** With scripting disabled and the
page at scroll 0, the always-visible bar still sits over the lower part of the hero actions
(bar top 740, CTA bottom 757). A fixed bar covers the bottom 72 px of the viewport at every
scroll position; only moving the hero content up would clear it at scroll 0, and hero
spacing belongs to **W23**. Nothing here made that case worse — it is what the page does
today — and the padding floor removes the overlap everywhere else. **W23 should re-measure
the no-JS hero at 375×812 after it reorders the hero and the social links**; if the actions
row lands above y 740 there, the residual disappears with it.

**Update, same day, after W26:** that residual is now 60 px, not 17. The hero button carries
the two-line label and runs 696–786; the bar starts at 726. The mis-tap it invites is
harmless — both the button and the bar go to `#tu-mensaje` now — but the overlap is more
visible, and it is one more reason for W23 to check that geometry.

**Highest priority item in this round.** It is the first thing a phone visitor sees and it
looks broken.

### Context

Measured at 375×812 against the built site:

| Measurement | Value |
| --- | --- |
| Hero CTA bottom edge | y = 757 |
| Sticky bar top edge | y = 740 |
| **Overlap** | **17 px** |
| Hero CTA label | "Escribime por WhatsApp" |
| Sticky bar label | "Escribime por WhatsApp" — identical |

So on the initial viewport of a common phone, two buttons with the same words sit on top of
each other, one dark and one green, with the green one covering the bottom of the dark one.
It reads as a rendering bug, on the highest-traffic viewport, above the fold.

W2's Outcome block predicted the collision without quite naming it: *"The hero CTA sits
below the fold on a 375×667 screen (its bottom edge is at 756 px)… a real fix would mean
moving the social links below the CTA, which is a layout decision W12b or a later pass can
take."* This is that later pass. W23 moves the social links; this item stops the overlap.

### Instructions

Make the sticky bar appear only once the hero CTA has scrolled out of view.

**The no-JS guarantee from W8 is not negotiable and this item can easily break it.** If you
hide the bar in CSS and reveal it with JavaScript, a visitor without JS loses the bar
entirely. Use W8's own pattern — the hidden state is gated behind a class that only exists
when the script is running:

```css
/* inside the existing @media (max-width: 768px) block */
html.js-sticky .sticky-cta { transform: translateY(110%); transition: transform 0.25s ease; }
html.js-sticky .sticky-cta.is-visible { transform: none; }
```

- Add `js-sticky` to `<html>` from JavaScript, not from the server, so no JS means no class
  means the bar is simply always visible — which is what it does today.
- In `assets/js/main.js`, observe `.hero-actions` with an `IntersectionObserver` and toggle
  `.is-visible` on `.sticky-cta` as it leaves and re-enters the viewport. **Append it as its
  own IIFE.** W8's Outcome is explicit about why: the reveal IIFE returns early when
  `js-reveal` is absent, so anything nested inside it silently stops running for
  reduced-motion and no-JS visitors.
- Add a floor so the collision is impossible even in the always-visible case: raise
  `.hero { padding-bottom }` in the 768 px block (`main.css:750`) past the bar's measured
  72 px. This is the fix that protects the no-JS path.
- Respect `prefers-reduced-motion`. The global reduce block at `main.css:801` already zeroes
  transition durations, so the bar will snap rather than slide — that is correct, but
  confirm it rather than assuming it.

Do **not** change the labels to differentiate them. "Escribime por WhatsApp" is the settled
CTA copy in `params.whatsapp.label` and three placements share it; the problem is that both
are on screen at once, not that they say the same thing.

**`footer { padding-bottom: 6rem }` at `main.css:795` is paired with the bar's 72 px height.**
If your change alters that height, that number moves with it. There is a comment saying so.

### Verify

- 375×812 and 375×667: on load, the hero CTA is fully visible and unobstructed; no sticky
  bar over it.
- Scroll past the hero: the bar appears. Scroll back up: it goes away.
- Scripting disabled: the bar is present and visible, and does not overlap the hero CTA.
- `prefers-reduced-motion: reduce`: no transition, bar still functions.
- 1280 px: bar still `display: none`.

### Start command

```bash
claude "Read TODO.md and implement work item W18: stop the sticky WhatsApp bar from overlapping the hero CTA on mobile. Follow the instructions in that item exactly — in particular, the bar must remain visible when JavaScript is unavailable, per W8's no-JS guarantee, so gate the hidden state behind a JS-set class and add a hero padding floor. Verify at 375x812 with and without scripting. When finished, mark W18 done in TODO.md per the Completion protocol."
```

---

## W19 — The mobile header is 64 px of nothing

### Context

`layouts/partials/header.html` renders a `<nav>` containing only the three nav links. There
is no logo, no name, nothing else. At ≤768 px, `main.css:746` sets `.nav-links { display:
none }`.

The result, measured: a **64 px-tall empty header** on every phone visit. No wayfinding, no
identity, and the first 64 px of a trust-first page spent on blank space.

On desktop the same absence shows up differently — the three pills float at the right and
the entire left half of the header is empty (`nav` is `justify-content: space-between` with
`.nav-links { margin-left: auto }`, so there is a slot there waiting for something).

`.logo` is already defined at `main.css:64` — `1.5rem`, weight 800, `#1f2937`, no
underline — and **nothing in the site uses it.** It was styled for exactly this and then
never filled.

The doctor's name is the cheapest trust signal the page has and it currently appears nowhere
above the fold except inside the intro paragraph.

### Instructions

- Add the name to `header.html` as the first child of `<nav>`, using the existing `.logo`
  class:

  ```html
  <a class="logo" href="#">{{ site.Params.hero.name }}</a>
  ```

- **Read it from `site.Params.hero.name`, never hardcode it.** That is a `CLAUDE.md` rule,
  and that key already exists (`hugo.toml`, `[params.hero]`) — W5 deliberately kept it
  because `schema.html` reads it as `alternateName`.
- Decide what `href` it should carry. `#` jumps to the top but adds a history entry and a
  bare `#` in the URL; `href="/"` reloads. Either is defensible — pick one and say which in
  the Outcome block. Whatever you choose, it needs an accessible name that says where it
  goes, per `CLAUDE.md`'s micro-copy section.
- At ≤768 px, `1.5rem` at weight 800 is roughly 22 characters of "Dr. Miguel de la Oliva" in
  a 335 px content width. **Check that it does not wrap to two lines** and reduce the size
  inside the existing 768 px block if it does. Do not let the header grow taller than it is
  now.
- Leave the nav links hidden on mobile. A hamburger menu for a three-anchor single page is
  more machinery than the page needs, and the sticky CTA already carries the one action that
  matters. If you disagree, raise it as a new item rather than building it here.

### Verify

- 375 px: the name is visible in the header, on one line, header height unchanged at 64 px.
- 1440 px: the name sits left, the three pills right, nothing overlaps.
- Accessibility tree: the link's accessible name reads as a sentence, not a slug.
- The `<h1>` is still the only `h1` and the heading outline is unchanged.

### Start command

```bash
claude "Read TODO.md and implement work item W19: put the doctor's name in the site header using the existing unused .logo class, read from site.Params.hero.name. Follow the instructions in that item, including the mobile wrap check at 375px. Do not add a hamburger menu. When finished, mark W19 done in TODO.md per the Completion protocol."
```

---

## W20 — Touch targets below 44×44

### Context

Every secondary interactive element on the page is under the 44×44 px minimum. Measured
heights from the built site:

| Element | Selector | Height | Where |
| --- | --- | --- | --- |
| Nav pills | `.nav-links a` | **31 px** | `main.css:88` |
| Social links | `.social-links a` | **24 px** | `main.css:673` |
| Contact buttons | `.btn-contact` | **41 px** | `main.css:453` |
| Composer chips | `.chip` | **35 px** | `main.css:576` |

The chips matter most: they are the primary interaction of the composer, which is the
site's conversion path, and there are ten of them on a phone.

The primary CTAs are fine — `.cta-button` and `.sticky-cta__link` both clear 44 px.

### Instructions

Raise the vertical padding on each of the four, keeping the existing border-radius, colours
and font sizes. Do not change the type scale to get there — padding only.

Rough targets, but **measure rather than trusting these**, since line-height and border
widths differ per component:

- `.chip` — `padding: 0.5rem 0.85rem` → about `0.65rem 0.95rem`
- `.btn-contact` — `padding: 0.65rem 1.1rem` → about `0.8rem 1.15rem`
- `.nav-links a` — `padding: 0.35rem 1rem` → about `0.6rem 1rem`
- `.social-links a` — has no padding; add vertical padding rather than a fixed height so the
  icon and label stay centred

Note the interactions:

- **`.btn-contact--motivo` is the no-JS fallback list** in `composer.html`, and it inherits
  `.btn-contact`. It is `width: 100%` and can be two lines. Check that the extra padding
  does not make that list absurdly tall with JS disabled.
- **`.composer__cta` and `.sticky-cta__link` both extend `.btn-contact`** with their own
  padding overrides. Confirm they are unchanged, or deliberately updated.
- **The chips wrap.** W17's verification recorded "chips wrap to four rows" at 375 px. More
  padding means more rows. Confirm there is still no horizontal overflow and the composer
  card does not become unreasonably tall on a phone.
- `.social-links` sits above the hero CTA today, so making it taller pushes the CTA further
  down — which W18 and W23 are both working against. Coordinate: if W23 has already moved
  the social links below the CTA, this is free; if not, keep the added padding modest.

### Verify

- Re-run the measurement at 375 px and 1440 px: every `<a>`, `<button>` and `<input>` on the
  page is ≥44 px tall, or is documented in the Outcome block as a deliberate exception.
- Adjacent targets keep ≥8 px of separation — the `.chips { gap: 0.4rem }` is 6.4 px and may
  need to go to `0.5rem`.
- No horizontal overflow at 375 px.
- Nothing in the desktop layout shifts noticeably.

### Start command

```bash
claude "Read TODO.md and implement work item W20: raise every interactive element to a 44x44px minimum touch target via padding only, not font-size changes. Follow the instructions in that item, including the knock-on checks for .btn-contact--motivo, .composer__cta, .sticky-cta__link and chip wrapping at 375px. When finished, mark W20 done in TODO.md per the Completion protocol."
```

---

## W21 — Focus states are effectively unstyled

### Context

The built stylesheet has **103 rules and exactly two of them mention `:focus`**:

```css
.map-facade:focus-visible { outline: 2px solid #1f2937; outline-offset: -2px; }   /* main.css:420 */
.composer-input:focus     { border-color: #1f2937; outline: none; }               /* main.css:604 */
```

Everything else — every link, every chip, every button, the entire composer — falls back to
the user-agent focus ring, which is inconsistent across browsers and close to invisible on
the dark `.cta-button` and the green `.btn-contact--whatsapp`.

The second rule is the worse one. It removes the outline from the **only text input on the
site** and replaces it with a 1.5 px border-colour change from `#e5e7eb` to `#1f2937`. That
is not an adequate replacement.

This matters more here than on an average site. `CLAUDE.md` commits to neurodivergent
readers as part of the audience, and the composer is explicitly built to be completable by
keyboard — W17 verified the whole step flow keyboard-only. That is worth very little if the
focus position is invisible while you do it.

### Instructions

- Add one global `:focus-visible` rule near the top of `main.css`, using the same treatment
  `.map-facade` already established so it looks like it was always there:

  ```css
  a:focus-visible,
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #1f2937;
    outline-offset: 2px;
    border-radius: 4px;
  }
  ```

- Fix `.composer-input`: keep the border-colour change if you like it, but restore a real
  ring. `outline: none` must not survive this item anywhere in the file.
- **Do not regress `.map-facade`.** Its `outline-offset: -2px` is deliberate and commented:
  `.map-embed` clips with `overflow: hidden`, so an outline drawn outside the button is
  invisible. Keep that rule and make sure the global one does not override it — check the
  cascade, do not assume.
- Use `:focus-visible`, not `:focus`, so a mouse click on a chip does not leave a ring
  behind.
- On the dark surfaces — `.cta-button`, `.btn-contact--whatsapp`, the `.mission` band — a
  `#1f2937` ring will be low-contrast or invisible. Those need a light ring. Use `#ffffff`
  and confirm it is visible against the WhatsApp green `#25d366` as well as the slate.

### Verify

- Tab through the entire page at 1440 px and again at 375 px. Every stop has a clearly
  visible ring, including on the dark hero CTA, the green WhatsApp buttons, the chips and
  the name input.
- The composer's full step flow is completable keyboard-only with the focus position visible
  at every step — this is W17's check 6, re-run with the rings in place.
- Clicking a chip with a mouse leaves no lingering ring.
- `.map-facade`'s ring is still drawn inside its box and is not clipped.

### Start command

```bash
claude "Read TODO.md and implement work item W21: add a global :focus-visible ring and remove the outline:none on .composer-input. Follow the instructions in that item — use a light ring on dark surfaces, use :focus-visible rather than :focus, and do not regress the deliberate negative outline-offset on .map-facade. Verify by tabbing the whole page at 1440px and 375px. When finished, mark W21 done in TODO.md per the Completion protocol."
```

---

## W22 — Legibility: hairline body text, over-tight titles, sub-12 px labels

### Context

Three separate legibility problems, grouped because they are all pure `main.css` type
adjustments in the same pass and all trace to the same audience concern.

**1. The doctor's personal story is set in the thinnest weight on the site.**

```css
.story-text p { font-weight: 200; font-size: 1.125rem; color: #374151; }   /* main.css:196 */
```

That is the `content/_index.md` narrative — "Nací en La Paz… Entendí que ninguna herramienta
médica alcanza si no hay primero un vínculo humano" — the single passage carrying the site's
entire proposition.

Its computed contrast is 9.86:1 and it passes WCAG comfortably, so an automated checker will
never flag it. **WCAG does not model stroke weight.** At weight 200 on the system font stack
the strokes are hairline, and the measured ratio overstates how readable it actually is.

**2. Mobile section titles are tracked at `-0.1em`.**

```css
.section-title { font-size: 2rem; letter-spacing: -0.1em; }   /* main.css:731, inside the 768 px block */
```

At 32 px that is **−3.2 px per character**. Letters touch. It reads as a fix for a wrapping
problem — "¿Quién soy y por qué hago esto?" is a long heading on a 375 px screen — and
`text-wrap: balance` solves that without crushing the letterforms.

**3. `.composer-step__label` computes to 11.2 px** (`0.7rem`, `main.css:551`), under the
12 px floor. It is uppercase with `0.11em` tracking so it is not the worst case, but it is
the scaffolding that tells someone which step they are on.

All three land hardest on the readers `CLAUDE.md` names explicitly: *"Neurodivergent readers
are part of the audience in form as well as content: plain language, predictable structure."*
Hairline type and crushed tracking are the typographic equivalent of failing that.

### Instructions

- `.story-text p` — `font-weight: 200` → `400`. If 400 reads too heavy against the
  `#f9fafb` panel, `300` is an acceptable compromise; below that, do not go. Say which you
  chose and why in the Outcome block.
- `.section-title` in the 768 px block — delete `letter-spacing: -0.1em` and add
  `text-wrap: balance` to `.section-title` in the base rule (`main.css:44`). `text-wrap` is
  unsupported in older Safari, where it degrades to normal wrapping — acceptable, since the
  fallback is simply the heading wrapping as it naturally would.
- `.composer-step__label` — `0.7rem` → `0.75rem` (12 px). Keep the uppercase and tracking;
  they are correct for a field label and were a deliberate choice in W17.

Check but do not necessarily change: `.hero .big-text` is `1.375rem` weight 400 and reads
well; `.mission-text` runs to **80 characters per line** at 1440 px, at the top of the
recommended 65–75 range. If a `max-width` reduction there is a one-line change that does not
disturb the centred layout, take it; if it fights the design, leave it and note it.

### Verify

- 375 px: every `.section-title` wraps sensibly with no letters touching. Check
  "¿Quién soy y por qué hago esto?" and "Trabajemos juntos" specifically — the first is the
  longest heading on the page.
- 1440 px and 375 px: the story section reads as body copy, not as display type.
- Re-run the contrast measurement across all text styles and confirm nothing regressed —
  all 18 styles measured currently pass 4.5:1 and that must remain true.
- No layout shift in the story grid from the weight change.

### Start command

```bash
claude "Read TODO.md and implement work item W22: fix three legibility problems in assets/css/main.css — the 200-weight story text, the -0.1em mobile section-title tracking, and the 11.2px composer step label. Follow the instructions in that item. Re-check heading wrapping at 375px and re-run the contrast measurement afterwards. When finished, mark W22 done in TODO.md per the Completion protocol."
```

---

## W23 — The stretched composer card and the left-pinned hero

### Context

**The composer card is stretched to fill a row it does not fill.** `.contact-grid`
(`main.css:336`) is a two-column grid with the default `align-items: stretch`. Measured at
1440 px, both columns are **978 px tall** — but the composer's content ends well before
that, so the `#f9fafb` card runs on as a large empty grey rectangle below the chips. It
reads as a component that failed to load.

**The hero uses 56% of the viewport and pins everything left.** Measured at 1440×900:

| Element | Width | Left edge |
| --- | --- | --- |
| `.container` | 1100 px | x = 170 |
| `.hero-content` | 800 px | x = 210 |
| `.hero .big-text` | 600 px | x = 210 |

So the intro paragraph occupies 600 px of a 1440 px screen and the right two-fifths of the
hero is empty. That is not generous whitespace; it is unbalanced.

**The portrait is 96 px** (`index.html:10`, `main.css:123`) — the strongest trust asset on
the page, at avatar size, on a site whose entire proposition is trust.

**The four social links sit between the intro and the primary CTA** (`index.html:15-24`),
pushing the CTA down and splitting attention before the one action the page wants. W2's
Outcome flagged exactly this and handed it forward.

### Instructions

This item is deliberately the conservative version. The bolder alternative is W24, which is
blocked on a decision — do not pre-empt it here.

- `.contact-grid` — add `align-items: start`. One line; kills the grey rectangle.
- `layouts/index.html` — move the `<ul class="social-links">` block to **after** the
  `.hero-actions` div, so the order becomes: portrait → h1 → subheadline → intro → CTA →
  social links. Nothing else about the markup changes.
- `.hero-photo` — 96 px → 140 px. **Update the `width` and `height` attributes on the `<img>`
  in `index.html:10` to match**, or you reintroduce layout shift on a page that currently has
  none. The image is `loading="eager"` and should stay that way.
- `.hero .big-text` — `max-width: 600px` → `680px` (`main.css:115-118`). That is roughly 62
  characters at 22 px, still inside the comfortable range, and it takes some of the dead
  width back without touching the layout system.
- `.social-links { padding-bottom: 4rem }` (`main.css:663`) was spacing the list away from
  the CTA below it. Once the list moves below the CTA that padding is doing something
  different — check it and adjust rather than leaving it by inertia.

Do **not** change `.container`, the grid definitions, or the section padding rhythm. Do not
introduce a two-column hero — that is W24.

### Verify

- 1440 px: no empty grey area below the composer; the contact columns top-align.
- 1440 px and 375 px: the hero reads portrait → heading → subheading → intro → CTA → social,
  and the CTA is visually before the social links.
- 375 px: the CTA sits higher than it did. Record the measured y-position before and after —
  this is the number W18 also cares about. **Since W26 the hero button is two lines at 375 px
  (696–786) and the always-visible no-JS bar starts at 726.** Moving the social links below
  the CTA is worth roughly the 60 px that would clear that overlap; check whether it does.
- The larger portrait causes no layout shift: check that the rendered `<img>` box matches its
  `width`/`height` attributes.
- The story and services sections are untouched.

### Start command

```bash
claude "Read TODO.md and implement work item W23: add align-items:start to .contact-grid, move the hero social links below the primary CTA, raise the portrait to 140px including its width/height attributes, and widen .hero .big-text to 680px. Follow the instructions in that item. Do not build a two-column hero — that is W24 and it is blocked. Verify there is no layout shift from the portrait change. When finished, mark W23 done in TODO.md per the Completion protocol."
```

---

## W12b — Voice and tone sweep across all copy

**Carried over from round 1, still unfinished. Run LAST** — it edits the final text of
everything the other items produce.

### Context

`CLAUDE.md` is the guide (round 1's W12a wrote it). This item applies it. Running it before
W18–W23 means running it twice, since W19 adds a header string and W23 reorders the hero.

### Instructions

Sweep every piece of user-facing text against `CLAUDE.md`:

- `content/_index.md`
- `data/services.yaml`, `data/credentials.yaml`, `data/motivos.yaml`, `data/social.yaml`
- `layouts/index.html` — all inline strings including headings and `aria-label`s
- `layouts/partials/header.html`, `footer.html`, `composer.html`, `whatsapp-cta.html`
- `hugo.toml` — `title`, `description`, `[params.hero]`, `[params.whatsapp]`,
  `[params.contact]` labels

**Known specific fixes — the first three were found in the 2026-08-12 design review and are
confirmed present in the built page:**

1. `layouts/index.html:100` — **"No tienes que hacerlo solo."** is tuteo. → **"No tenés que
   hacerlo solo."** Also reconsider "solo" entirely: the site's own thesis, in
   `data/services.yaml`, is *"Sanar no es tarea de uno solo."* The sentence argues against
   itself.
2. `layouts/partials/header.html` — nav labels **"Mi Historia"** and **"Qué Hago"** are
   English title case. → **"Mi historia"**, **"Qué hago"**. `CLAUDE.md`: *"Capitalisation is
   Spanish sentence case, not English title case."*
3. `layouts/index.html:105` — **"Información de Consulta"** → **"Información de consulta"**.
   Same rule.
4. `data/services.yaml` — check every second-person verb form for voseo.
5. All motive strings in `data/motivos.yaml` and the CTA labels in `[params.whatsapp]`.

Also check that alt text, `aria-label`s and the iframe `title` read as written language, not
as slugs — they are read aloud, and they are part of the voice too.

**Do not "fix" two things that look wrong and are not:**

- The composer messages address the doctor as **`usted`**, not `vos`. That is deliberate and
  recorded in W2's and W17's Outcome blocks: the site speaks to the reader as `vos`, but
  those sentences are written *by* the reader *to* a psychiatrist they have not met. Changing
  it is a real copy decision, not a consistency fix — if you want to make it, make it
  knowingly and say so.
- Negative commands use `no te preocupes`, not `no te preocupés`. Camba voseo does not take
  the `-és` subjunctive. W12a's Outcome says explicitly: do not "correct" this.

Do not change meaning or invent claims. This is a register and consistency pass, not a
rewrite. Anything that turns out to be an unverified factual claim gets marked `COMPLETAR`,
not smoothed over.

**One thing to raise rather than fix:** `data/credentials.yaml` contains *"Psiquiatra con más
de 15 años de experiencia clínica."* `CLAUDE.md` lists years of experience among the things
that must never be invented, and its verified-credentials list is "máster en TEA,
especialista en adicciones, experiencia clínica" without a number. W6 deliberately excluded
this line from the JSON-LD `hasCredential` for that reason. It may well be true and simply
undocumented — but confirm it with the doctor rather than assuming, and if it cannot be
confirmed, raise it as a new item instead of quietly deleting a claim he may stand behind.

### Start command

```bash
claude "Read TODO.md and implement work item W12b: sweep all user-facing copy across content/, data/, layouts/ and hugo.toml for consistent voseo, voice and tone per CLAUDE.md. Follow the instructions in that item, including the five known specific fixes and the two things that look wrong but are deliberate. This is a register pass, not a rewrite — do not change meaning or invent claims. Confirm W18 through W23 have landed first. When finished, mark W12b done in TODO.md per the Completion protocol."
```

---

## W24 — Two-column hero ⏸️ BLOCKED

**Blocked on a decision from the site owner, not on effort. Do not start this without one.**

### The question

W23 takes the conservative fix for the hero's 56%-of-viewport problem: bigger portrait,
reordered elements, slightly wider measure. It improves the balance; it does not solve it.
The structural fix is a real two-column hero at ≥900 px — text left, portrait right at
roughly 320 px — which uses the full 1100 px container and gives the portrait the presence a
trust-first page should give it.

**That is a redesign**, and `CLAUDE.md` says in bold that the visual design is settled. So it
is not a call a session should make on its own.

### What a decision needs to cover

- Whether the hero may change shape at all, or whether W23's conservative version is the end
  of it.
- Whether a 320 px portrait is wanted, given the current file is a studio headshot at an
  unknown source resolution — check `static/images/profile-miguel-oliva.jpg` before promising
  it will hold up at that size. If it will not, this item needs a new photograph first, which
  is a request to the doctor.
- Mobile is unaffected either way: it stays single-column.

If the answer is no, mark this item ✅ with an Outcome block saying it was declined and why.
A recorded "no" is worth as much here as a recorded "yes" — it stops the next reviewer
raising it again.

---

## W25 — Verify on a real phone over a real connection ⏸️ BLOCKED

Raised by W17's Outcome and still true: *"nobody has seen this on a real phone over a real
connection. Everything above is a headless browser on localhost."*

Every check in both rounds — this review included — is headless Chromium against
`localhost`. That is genuinely good for the accessibility tree, the DOM, contrast and network
behaviour. It proves nothing about how the composer feels to a thumb on an Android
mid-ranger over mobile data in Santa Cruz, which is the actual delivery context.

Blocked on hardware and a deployed URL, not on effort. Worth doing after W18–W23 land, since
W18 and W20 both change how the page behaves under a thumb specifically.

---

## W26 — One way in: every CTA leads to the composer ✅ DONE

### Context

Raised by the owner right after W18 landed, looking at the contact section: *"«Tu mensaje, ya
escrito» and the contact by WhatsApp seem to be competing for attention. There must be one
way to contact."*

He is describing what the page had actually become. W1 and W3 added the composer without
retiring anything, so five entry points shipped at once — hero, mid band, sticky bar and the
contact number all opened the **same empty chat** with the same generic `defaultMessage`,
while the composer sitting next to the last of them existed precisely because that empty chat
is the thing people stall on. Four shortcuts past the one feature built to help.

### What landed

The general CTAs no longer open WhatsApp. They go to the composer, and WhatsApp opens from
there with the message already written.

| Placement | Before | After |
| --- | --- | --- |
| Hero | `wa.me` + `defaultMessage` | `#tu-mensaje` |
| Mid band | `wa.me` + `defaultMessage` | `#tu-mensaje` |
| Sticky bar | `wa.me` + `defaultMessage` | `#tu-mensaje` |
| Contact number | `wa.me` + `defaultMessage` | unchanged — **owner's call**, see below |
| Composer (7 motives, no-JS) | `wa.me` + per-motive message | unchanged |
| Composer (Alpine) | `wa.me` + built message | unchanged |

- **`whatsapp-cta.html` grew a `destino` parameter** (`whatsapp` | `composer`). It is still
  the only place a WhatsApp URL is built. With `composer` the link is internal: `#tu-mensaje`,
  no `target="_blank"`, no `rel` — both describe a new tab that does not open — and a
  `data-destino="composer"` hook for analytics. The WhatsApp glyph stays on both: it names
  the channel the conversation will leave through.
- **Copy, `hugo.toml`.** New `params.whatsapp.composerLabel = "Escribime — te ayudo con el
  mensaje"`, chosen by the owner from three options. `label` stays "Escribime por WhatsApp"
  on the two links that really do open WhatsApp. A button that said "Escribime por WhatsApp"
  and instead scrolled the page would promise one thing and do another. `defaultMessage` now
  serves only the contact number and the no-JS motive list; its comment says so.
- **The composer is now an anchor**: `id="tu-mensaje"`, `tabindex="-1"` so the jump moves the
  focus and not just the viewport, and `scroll-margin-top: 1.5rem` so its heading is not
  flush against the top edge.
- **The sticky bar now steps aside for the composer too.** W18's observer watched
  `.hero-actions`; it watches `#tu-mensaje` as well and shows the bar only when neither is on
  screen. While the composer is visible the bar is a second copy of a button already there —
  which is the complaint this item came from.
- **Analytics keeps the funnel.** `hero`, `mid` and `sticky` would otherwise have stopped
  reporting entirely, since they are no longer `wa.me` links. They now emit `composer_open`
  with the same placement; `whatsapp_click` still fires for the contact number and the
  composer. The W15 allowlist is untouched and no motive is sent — verified by stubbing
  `gtag` and clicking all four: `composer_open/hero`, `composer_open/mid`,
  `composer_open/sticky`, `whatsapp_click/contact`.
- **Owner's decision, recorded because it is a deliberate exception:** the contact-block
  number stays a direct WhatsApp link. Asked whether to make it plain text, point it at the
  composer, or leave it, he chose to leave it. So one shortcut past the composer survives, by
  choice, in the place where someone is already reading the address and hours.

### Knock-on: the label wraps, so the bar is taller

At 375 px the new label is two lines. Measured: the sticky bar went **72 px → 86 px** and the
hero button **61 px → 90 px**. The bar's height is paired with two paddings and both moved
with it — `.hero { padding-bottom }` and `footer { padding-bottom }`, 6rem → 7rem (112 px,
26 px of clearance over the bar, matching what W18 left). The owner picked the label from a
preview that showed the two-line wrap, so the wrap is accepted, not overlooked.

### Verified

Playwright MCP, headless Chromium, built site on `:1399`:

| Check | Result |
| --- | --- |
| Every `data-cta` in the built HTML | hero/mid/sticky → `#tu-mensaje`, no `target`; contact + 7 motives → `wa.me`. |
| 375×812, tap the hero CTA | Scrolls to the composer, `location.hash = #tu-mensaje`, `document.activeElement` is `tu-mensaje`, composer 24 px from the top. |
| Sticky bar, 375×812 | Hidden at the top, visible mid-page (86 px tall), hidden again at the bottom with the composer on screen. |
| Composer still works | Chip click builds the preview and the `wa.me` href; the no-JS fallback is hidden once Alpine boots. |
| Analytics | The four events above, placement only. |
| No JavaScript, 375×812 | Hero CTA is `#tu-mensaje`; fragment navigation lands the composer 24 px from the top with its 7 motive links; the bar is visible with `transform: none`; the footer text clears it (700 vs 726). |
| 1440 px | Hero and mid buttons 405×61, one line. Sticky bar `display: none`. |
| `hugo --gc --minify` | Clean. |

### Left undone

The no-JS overlap at scroll 0 got bigger, not smaller: 17 px → 60 px, because the hero button
is two lines now. Both the button and the bar lead to `#tu-mensaje`, so a mis-tap costs
nothing, but it looks worse than it did. Fixing it means moving hero content up, which is
**W23** — and W23 already moves the social links below the CTA, which is exactly the ~70 px
that would clear it. Recorded at the end of W18's Outcome too.

---

# Execution plan

## The constraint

**Six of the seven actionable items write `assets/css/main.css`.** That is the whole story of
this round's parallelism, the same way `layouts/index.html` was last round's.

| File | Items that write to it |
| --- | --- |
| `assets/css/main.css` | W18, W19, W20, W21, W22, W23 |
| `layouts/index.html` | W23, W12b |
| `layouts/partials/header.html` | W19, W12b |
| `assets/js/main.js` | W18, W26 |
| `layouts/partials/head.html` | W18 only — the `js-sticky` opt-in script |
| `layouts/partials/whatsapp-cta.html` | W26 only — the `destino` parameter |
| `hugo.toml` | W12b only |

Running two sessions concurrently against an 810-line stylesheet produces conflicts that cost
more to resolve than the items take to do. Round 1's Outcome blocks are full of sessions
hand-staging blobs with `git update-index` to avoid sweeping each other's work in — do not
recreate that situation for items this small.

**Recommendation: run these serially, one item per commit.** The whole round is a few hours.

## Waves

### Wave 1 — alone, first

**W18** (sticky bar collision). It is the worst defect, it is the only item touching
`main.js`, and it changes the mobile hero geometry that W23 also cares about. Land it first
so W23 measures against a fixed page.

### Wave 2 — serial, one session

**W19 → W20 → W21 → W22.** All four are `main.css`, in unrelated regions, and W19 adds one
line to `header.html`. Comfortably one session, four commits.

Order matters slightly: W19 before W20, because W19 adds the header link and W20 then sizes
every target including that one.

*If you must parallelise:* W21 (a new block near the top) and W22 (three existing type rules)
touch genuinely disjoint regions and would merge cleanly. The saving is maybe twenty minutes.
Not worth the coordination.

### Wave 3 — serial

**W23** (composer card + hero composition). Touches `index.html` and `main.css`; needs W18's
mobile geometry settled first, and is cleaner after W20 has finished resizing the social
links it moves.

### Wave 4 — serial, last

**W12b** (copy sweep) — by definition operates on the final text of everything above,
including the header string W19 introduces.

Then a full verification pass, per `CLAUDE.md`:

```bash
hugo --gc --minify && python3 -m http.server 1399 --directory public
```

- Accessibility tree at 1440 px and 375 px
- Tab-through with the new focus rings
- `prefers-reduced-motion: reduce` — content visible, nothing transitions
- Scripting disabled — every section visible, composer fallback links present, sticky bar
  present and not overlapping
- Network log — nothing reaches Google before a deliberate click on the map facade
- Contrast re-measured across all text styles

## Critical path

```
W18 → [W19 → W20 → W21 → W22] → W23 → W12b
```

Nothing here is genuinely parallel and nothing needs to be. W24 and W25 sit off the path
entirely, both blocked on someone other than a coding session.

## What is deliberately not in this round

Recorded so the next reviewer does not re-derive them:

- **The colour palette and typeface stay.** The design-intelligence database consulted for
  this review suggested a cyan `#0891B2` healthcare palette and a Lexend / Source Sans 3
  pairing from Google Fonts. Both were rejected: the palette contradicts the settled design,
  and the webfont import would reintroduce exactly the third-party page-load request round
  1's W14 removed. The system font stack stays.
- **Atkinson Hyperlegible** — genuinely interesting for this audience, and self-hosting it
  would avoid the third-party problem. Still a typeface change on a settled design, and it
  costs bytes on a site whose JS budget was already argued over in W17. If anyone wants it,
  it needs the same kind of decision as W24.
- **No new components.** Everything in W18–W23 is an adjustment to something that already
  exists.

## What the review found and did not turn into work

Credit where the site is already right, so nobody "fixes" it:

- **Contrast passes 4.5:1 at all 18 text styles measured**, in both light panels and the dark
  `.mission` band.
- **No horizontal overflow and no element escaping the viewport at 375 px.**
- **`prefers-reduced-motion` is handled properly**, at two levels — the reveal never arms and
  a global block zeroes every transition.
- **The no-JS composer fallback genuinely works**, and W17 verified it by aborting the Alpine
  request rather than by assuming.
- **Nothing third-party loads before a deliberate click**, other than GA4 under the DNT gate.
