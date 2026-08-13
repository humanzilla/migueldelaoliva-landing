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
| W19 — The mobile header is 64 px of nothing | 2 | ✅ Done — 2026-08-13 |
| W20 — Touch targets below 44×44 | 2 | ✅ Done — 2026-08-13 |
| W21 — Focus states are effectively unstyled | 2 | ✅ Done — 2026-08-13 |
| W22 — Legibility: hairline body text, over-tight titles, sub-12 px labels | 2 | ✅ Done — 2026-08-13 |
| W23 — The stretched composer card and the left-pinned hero | 3 | ✅ Done — 2026-08-13 |
| W12b — Voice and tone sweep across all copy | 4 | ⬜ Not started |
| W27 — `.services-grid` overflows below 390 px | 2 | ✅ Done — 2026-08-13 |
| W28 — Text on the WhatsApp green fails contrast | 2 | ✅ Done — 2026-08-13 |
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

## W19 — The mobile header is 64 px of nothing ✅ DONE

### Outcome — 2026-08-13

The doctor's name now sits in the header, read from `site.Params.hero.name`, and the mobile
header is still exactly 64 px. Files changed: `layouts/partials/header.html`,
`assets/css/main.css`.

- **`header.html`** — one `<a class="logo">` as the first child of `<nav>`, before the
  `<ul class="nav-links">`. `.logo` was already styled at `main.css:64` and unused, as the
  item said; **no new CSS rule was needed for it**, only the mobile padding below.
- **`href="#"` — the choice, and why.** It scrolls to the top with no network request, which
  `href="/"` cannot do: a mis-tap on a phone over mobile data in Santa Cruz would cost a full
  page reload. The price is the two things the item names — a `#` left in the URL and a
  history entry — both verified and both accepted. Measured: from `scrollY 2000` the click
  lands at `scrollY 0`, `location.href` becomes `/#`, `history.length` grows by one, no
  reload. `scroll-behavior: smooth` (`main.css:699`) applies, and it is already inside the
  `prefers-reduced-motion: no-preference` block, so a reduced-motion visitor gets a jump.
- **Accessible name**: `aria-label="Dr. Miguel de la Oliva — volver al inicio de la página"`.
  The visible text is just the name, which does not say where the link goes; the label does,
  per `CLAUDE.md`'s micro-copy rule. Infinitive, not an imperative — the interface-imperative
  exception is fenced at two strings and this does not join them. Confirmed in the
  accessibility tree as `link "Dr. Miguel de la Oliva — volver al inicio de la página"`.
- **Deviation — the mobile header padding moved.** The item says the header must not grow
  taller, and adding a 24 px/weight-800 line to a 2rem-padded box makes it 102 px. So the
  768 px block now carries `header { padding: 0.8rem 0 }`: 12.8 px × 2 plus the 38.4 px line
  box is 64.0 px, the same height as the empty header it replaces. Nothing below it moved —
  the hero still starts at y 64 and `.hero-actions` still at y 696, which is the number W18
  and W23 both care about.
- **Desktop grew 12.8 px, deliberately: 89.6 px → 102.4 px.** The 24 px logo's line box
  (38.4 px) is taller than the nav pills (25.6 px), so it sets the nav height. The item's
  "do not grow" is written about the ≤768 px case and the desktop cost is 13 px on a 900 px
  viewport, so it was left rather than crushing `.logo`'s line-height. Say so here in case a
  later item measures the header and wonders.
- **No hamburger.** Nav links stay hidden at ≤768 px, as instructed.

Verified in headless Chromium (Playwright MCP) against the built site on `:1401` — 1399 was
avoided per the note about parallel sessions:

| Check | Result |
| --- | --- |
| 375×812 | Name visible, **one line** (`getClientRects().length === 1`), 234.78 px of the 335 px content width. Header 63.98 px — unchanged. No horizontal overflow. |
| 320×700 | Still one line, still 234.78 px in 280 px of content — fits. Header 63.98 px. (Page overflows 50 px here, but not from this item — see **W27**.) |
| 769×800 | The breakpoint's other side: logo ends at x 275, first nav pill starts at x 379, 104 px of gap. No overlap, no overflow. |
| 1440×900 | Logo left at x 210, the three pills right at 880–1230. Header 102.39 px. |
| Accessibility tree | `banner → navigation "Navegación principal" → link "Dr. Miguel de la Oliva — volver al inicio de la página"`, then the list. Reads as a sentence. |
| Heading outline | One `h1` ("Psiquiatra en Santa Cruz de la Sierra"), then the same five `h2`s. Unchanged — the logo is an `<a>`, not a heading. |
| Logo click | `scrollY 2000 → 0`, `href → /#`, one history entry, no reload. |
| `hugo --gc --minify` | Clean. |

**For W20:** the logo is a new interactive target and it is **38.4 px tall**, under the 44 px
minimum — it belongs on W20's list, which is why the wave order puts W19 first. Note the
constraint it inherits: raising it to 44 px pushes the mobile header past the 64 px this item
just held. Either drop `header`'s mobile padding to ~0.6rem to absorb the extra 5.6 px, or
record the header as a deliberate exception. Do not silently undo the 64 px.

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

## W20 — Touch targets below 44×44 ✅ DONE

### Outcome — 2026-08-13

Every interactive element on the page now measures ≥44×44 px, at 375 px and at 1440 px, with
the composer expanded and with JavaScript disabled. **There are no documented exceptions —
the list is empty.** Only file changed: `assets/css/main.css`.

**Three targets the item's table did not list turned up in the sweep** and are fixed here
too, since the Verify says *every* `<a>`, `<button>` and `<input>`:

| Element | Selector | Before | After | Change |
| --- | --- | --- | --- | --- |
| Composer chips | `.chip` | 34.8 | **44.39** | `padding: 0.5rem 0.85rem` → `0.8rem 0.95rem` |
| Contact buttons | `.btn-contact` | 40.8 | **45.6** | `0.65rem 1.1rem` → `0.8rem 1.15rem` |
| Nav pills | `.nav-links a` | 31.2 | **45.59** | `0.35rem 1rem` → `0.8rem 1rem` |
| Social links | `.social-links a` | 24 | **44.8** | added `padding: 0.65rem 0` |
| **Header name** | `.logo` | 38.4 | **44.77** | added `padding: 0.2rem 0` — handed over by W19 |
| **Hero secondary link** | `.hero-actions__secondary` | 25.6 | **44.8** | added `padding: 0.6rem 0` |
| **No-JS motive links** | `.btn-contact--motivo` | 41.5 | **46.3** | inherited from `.btn-contact` |

Padding only, as instructed. No font-size, border-radius or colour moved anywhere.

- **`.composer-input` was measured and left alone.** It is the third thing the sweep turned
  up and the only one that did *not* need fixing: it computes to **47.09 px** and always did
  — it never appears in a static snapshot because it lives in step 3 of the composer, which
  is why no review had measured it. An edit to it was written and then reverted once measured.
- **`.composer__cta` (47.19) and `.sticky-cta__link` (bar 86.2 px) are unchanged**, confirmed
  rather than assumed: both declare their own `0.85rem 1.1rem`, which is still larger than
  `.btn-contact`'s new `0.8rem`, and both rules sit later in the file. The sticky bar's height
  did not move, so the `footer`/`hero` padding pairing from W18 and W26 stands untouched.
- **Separation**: `.chips { gap }` 0.4rem → 0.5rem, as the item suggested. An all-pairs sweep
  of every visible target — 24 at 375 px, 26 at 1440 px, composer expanded — found **no pair
  closer than 8 px** at 320, 360, 375 or 1440.

**Deviation — two `gap`s were split into row/column rather than left alone.** Adding vertical
padding to a link that had none also adds visible air, and on two flex rows that air landed on
top of an existing gap. `.hero-actions` goes `1.5rem` → `0.9rem 1.5rem` and `.social-links`
goes `1rem` → `0.5rem 1rem`; the column values, which are what desktop uses, are unchanged.
The net effect is that the spacing *looks* the same as before while part of it is now
touchable. `.social-links { padding-bottom }` went `4rem` → `3.4rem` for the same reason — the
0.65rem each link now carries below its icon was previously the container's job. **W23 still
owns that number**, per its own instructions; this only changes the value it starts from.

**Deviation — the mobile header padding moved again, to hold 64 px.** W19 set `0.6rem` as the
figure that would absorb a tappable logo and that is exactly what it took: `header { padding:
0.8rem 0 }` → `0.6rem 0`, so 9.6 × 2 + 44.8 = **64.0 px**, the same height for the third
round running. W19's instruction not to silently undo the 64 px is honoured.

**Desktop header grew 6.4 px, 102.4 → 108.8**, and the reason is worth recording because it
is not the obvious one. `.logo` is a flex item of `nav`, so it is blockified and its padding
raises the header. `.nav-links a` is an inline `<a>` inside an `<li>`, which is *not* a flex
item, so its new padding overflows the line box without growing anything — the pills are
45.59 px to a finger and to `getBoundingClientRect`, but they cost the header nothing. Hit
testing includes the padding box, so the target is real. The 6.4 px is entirely the logo. A
screenshot at 1440 confirms the pills render fully inside the header with no clipping.

**Cost on the mobile hero, and it is the one the item warned about.** W23 has not run yet, so
the social links are still above the CTA and making them 44 px tall pushes it down:

| Measurement, 375 px | Before | After |
| --- | --- | --- |
| `.social-links` block | 128 | 152 |
| Hero CTA top edge | 696 | **719.9** |
| `.hero-actions` block | 139.2 | 148.8 |
| Composer card, collapsed | 372.8 | 416 |
| Composer card, all steps open | 846.3 | 910.3 |

Chips still wrap to **four rows** at 375 px, not five — the wider chips repack identically.

**The no-JS overlap at scroll 0 grew again: 60 px → 83.7 px** (bar top 725.8, CTA bottom
809.5). W18 recorded it at 17 px, W26 took it to 60, this takes it to 84. It is still the same
harmless mis-tap — both the button and the bar lead to `#su-mensaje` — and it is still **W23's
to clear**, which is exactly what moving the social links below the CTA is worth. No new item
raised: W18, W26 and W23 all already carry this handoff, and this is the third entry on it.

Verified in headless Chromium (Playwright MCP) against the built site on `:1402`:

| Check | Result |
| --- | --- |
| 375×812, composer expanded | 24 visible targets, **0 under 44×44**. No horizontal overflow. |
| 1440×900 | 26 visible targets, **0 under 44×44**. No overflow. |
| 769×800 | 0 under 44×44. Logo ends x 274.8, first pill starts x 378.6 — no overlap. |
| Adjacent-target separation | All-pairs sweep at 320/360/375/1440: no pair under 8 px. |
| Scripting disabled (`**/js/**` aborted) | 0 under 44×44. Seven motive links at 46.3 px, one line each, list 372.2 px. `js-reveal`/`js-sticky` dropped after the 2 s fallback, every section at opacity 1, bar `transform: none` — W8 and W18 intact. |
| Sticky bar with JS | Hidden at the top, visible at scroll 2200 (86.2 px, unchanged), hidden again back at the top. W18's observer unaffected. |
| `prefers-reduced-motion: reduce` | All sections visible, 0 under 44×44, chip `transition-duration` 1e-05s. |
| 320 / 360 px | Only `.service-item` overflows — **pre-existing W27, unchanged**. Nothing new escapes. |
| Screenshots | Header at 1440 and chips at 375 look like they were always this size; nothing clipped. |
| `hugo --gc --minify` | Clean. |

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

## W21 — Focus states are effectively unstyled ✅ DONE

### Outcome — 2026-08-13

Every keyboard stop on the page now draws the same `2px solid #1f2937` ring, and the
`outline: none` on the only text input is gone. **Zero user-agent focus rings remain.**
Only file changed: `assets/css/main.css` (+33 −1).

- **The global rule**, placed after `body` as the item specified, covering
  `a`/`button`/`input` at `outline-offset: 2px` — the same treatment `.map-facade` already
  used, so it looks like it was always there.
- **`.composer-input`** — `outline: none` deleted, the `#1f2937` border-colour change kept.
  The input now carries the ring like everything else. `outline: none` appears nowhere in
  the file (the one grep hit is the comment explaining its removal).
- **`.map-facade` not regressed.** Its `-2px` offset is `(0,2,0)` against the global rule's
  `(0,1,1)`, so it wins on specificity regardless of order — checked as a computed value at
  every tab stop, not assumed, and screenshotted to confirm the ring is still drawn inside
  the clipping box.

**Deviation — no `border-radius: 4px`.** The item's snippet includes it; it is a defect.
`border-radius` in a `:focus-visible` rule sets *the element's own* radius, not the
outline's, so it would square off the 999px pills — every `.chip` and every `.btn-contact` —
at the moment they are focused. Browsers already draw the outline following each element's
curve, which the screenshots confirm. Dropped, deliberately.

**Deviation — no light ring on dark surfaces, and the instruction's premise does not hold.**
The item asks for `#ffffff` on `.cta-button`, `.btn-contact--whatsapp` and the `.mission`
band. With `outline-offset: 2px` the ring is drawn *outside* the border box, so its contrast
is against the page behind it, not against the button's fill. Measured:

| Ring | Against | Ratio |
| --- | --- | --- |
| `#1f2937` | white page | **14.68:1** |
| `#1f2937` | `#f9fafb` composer card | **14.05:1** |
| `#ffffff` | white page | **1.00:1** — invisible |

A white ring is the one that would disappear. The dark ring is correct on both the dark
`#1f2937` hero button and the green `#25d366` WhatsApp buttons, verified by sampling the
painted pixels across the button edge: white page → 2 px `#1f2937` ring → 2 px white gap →
fill. **`.mission` was moot in any case — it contains no focusable element**, only a heading
and a paragraph, so there was nothing there to give a ring to.

**Added beyond the item — `.composer-step:focus-visible`.** Alpine moves focus to each step
as it appears (W17's step management, `tabindex="-1"`), and with a keyboard that was lighting
the browser's blue `1px auto rgb(0,95,204)` ring — the last UA fallback on the page, and
exactly what this item's Context objects to. Same ring at `outline-offset: 4px`, since it
surrounds a block rather than a pill. `#su-mensaje` carries `tabindex="-1"` too but needs
nothing: on a mouse-driven CTA jump `:focus-visible` does not match, so no ring is drawn
around the whole card.

**A measurement trap, recorded because it cost real time and will catch the next session.**
`.cta-button` and `.btn-contact` both carry `transition: all 0.2s ease`, which includes
`outline-color` and `outline-offset`. Read `getComputedStyle` immediately after a `Tab` and
you get an interpolated value that looks exactly like a browser override — `3px solid
rgb(255,255,255) @ 0px`, the UA default's signature — and a screenshot taken at the same
moment paints a half-blended `#eff0f1`. It led to a wrong diagnosis and a discarded
box-shadow workaround before a settle wait showed the plain rule was correct all along.
**Wait ≥300 ms after focusing before measuring or screenshotting anything on this page.**

Verified in headless Chromium (Playwright MCP) against the built site on `:1403`:

| Check | Result |
| --- | --- |
| Tab through, 1440×900, composer expanded | **22 stops, all `2px solid rgb(31,41,55)`**, all `:focus-visible`, 0 UA fallbacks. |
| Tab through, 375×812 | **23 stops** (the sticky bar link is the extra), same result. No horizontal overflow. |
| Offsets | `+2px` everywhere except `.map-facade` at `-2px` — correct on every stop. |
| Painted pixels, dark hero button | white → 2 px `#1f2937` → 2 px white gap → fill. Ring is real, not just computed. |
| Green `.btn-contact--whatsapp`, pressed `.chip` (dark fill), `.composer-input` | Ring visible on all three; screenshots confirm. |
| Composer flow, keyboard only | 6 stops chip → paso 2 → chip → paso 3 → input → CTA, ring visible at every one, 0 blue rings. Built `wa.me` href carries the typed name. W17 check 6 re-run and passing. |
| Mouse click on a chip | `:focus-visible` false, `outline-style: none` — no lingering ring. |
| `.map-facade` | `2px solid #1f2937 @ -2px`, drawn inside `.map-embed`, not clipped. |
| Scripting disabled (`**/js/**` aborted) | 14 stops walked, all with the correct ring. |
| `prefers-reduced-motion: reduce` | Ring present, `transition-duration` 1e-05s, all sections visible. |
| `outline: none` anywhere in the repo | None. |
| `hugo --gc --minify` | Clean. |

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

## W22 — Legibility: hairline body text, over-tight titles, sub-12 px labels ✅ DONE

### Outcome — 2026-08-13

All three defects fixed, plus the optional `.mission-text` measure. Only file changed:
`assets/css/main.css` (+14 −4).

| Change | Before | After |
| --- | --- | --- |
| `.story-text p` weight | 200 | **400** |
| `.section-title` mobile tracking | `-0.1em` | **removed** |
| `.section-title` base | — | **`text-wrap: balance`** |
| `.composer-step__label` | `0.7rem` (11.2 px) | **`0.75rem` (12 px)** |
| `.mission-text` max-width | `800px` | **`680px`** |

- **Weight 400, not 300.** The screenshot at 400 reads as body copy, not as display type,
  and it is not heavy against the `#f9fafb` panel — so there was no reason to take the
  compromise. **The change is real and measured, not just declared:** the four weights
  resolve to genuinely distinct faces in the system stack (the string "Nací en La Paz" is
  114.64 px at 200, 116.20 at 300, 117.81 at 400, 123.34 at 700), and ink coverage over the
  first paragraph rose **0.0778 → 0.1009, +30 %**. Worth knowing for the next session: at
  18 px the difference is subtle in a headless screenshot despite that number — trust the
  measurement over the eye here, and remember the audience is on iOS and Android, where SF
  and Roboto both ship real Thin/Light faces and the hairline problem is at its worst.
- **No layout shift from the weight change, at all.** Line counts per paragraph are
  identical at 200, 300 and 400 (6/8/5/3/3/2 at 375 px), `.story-text` stays 939 px and
  `.story-grid` 1413 px. The ~2.7 % width delta never crossed a break boundary.
- **`text-wrap: balance` earns its place — it is not decoration.** Measured line widths for
  "¿Quién soy y por qué hago esto?" at 375 px: **251/234 with balance, 315/169 without**.
  Screenshots of the old and new states are the clearest evidence in this item: at `-0.1em`
  the heading renders as `¿Quiénsoyyyporquéhago / esto?` with words visibly fused; with
  normal tracking the letters are plainly separated.
- **Removing the tracking costs one extra line on one heading**, and this is the trade the
  item asked for: "Mi propósito es simple" goes from 1 line to 2 at 375 px (38 → 77 px). The
  other three are unchanged in line count. At ≥769 px all four are single-line, so
  `text-wrap: balance` has **no desktop effect whatsoever** — nothing about the desktop
  layout moved.
- **`.mission-text` — the optional change was taken, and the item's premise was understated.**
  It reports 80 characters per line at 1440 px; measured against a real character advance
  (8.86 px at 20 px), the two long lines are **89 and 88 characters**, well past the 65–75
  range rather than at the top of it. At `680px` they become **72 and 73**. It qualifies as
  the item's "one-line change that does not disturb the centred layout": same 5 line boxes,
  same 384 px band height, still centred (380 px of gutter each side), and no mobile effect
  at all since the container caps it at 335 px there.
- **`.hero .big-text` checked and left alone**, as the item allows: 22 px / weight 400 /
  43 characters per line. It reads well; nothing to do.
- **Knock-on: the composer card grew 4.7 px at 375 px** (910.3 → 915) from the four 12 px
  step labels. Recorded because W20 measured that number; nothing else in the composer moved.

**Verify caught a defect outside this item's scope — raised as W28, not fixed here.** The
item says all 18 measured text styles pass 4.5:1 "and that must remain true". Re-running the
sweep, **nothing regressed — no colour was touched, and the diff proves it** — but the sweep
enumerated **34** distinct combinations rather than 18, because it descends into the inner
`<span>`s of buttons and resolves the painted ancestor background. Three of those 34 fail,
all of them text on the WhatsApp green `#25d366`, all pre-existing. The worst is visibly
wrong in a screenshot. See **W28**.

Verified in headless Chromium (Playwright MCP) against the built site on `:1404`:

| Check | Result |
| --- | --- |
| 375×812, all four `.section-title`s | No tracking, balanced wrap, **none escaping the viewport**. Screenshot: letters clearly separated. |
| 320 / 360 / 375 / 414 / 768 / 769 / 1440 px | **No section title escapes at any width.** Only overflow anywhere is the pre-existing **W27** `.service-item` (50 px at 320, 10 px at 360) — unchanged. |
| Story text, 375 px and 1440 px | Weight 400, 18 px, `#374151`; 50 chars/line at 1440. Reads as body copy. |
| Story grid layout shift | None — identical line counts and heights at 200/300/400. |
| Composer step labels, composer expanded, 375 px | All four **12 px, one line each**, 287 px wide. |
| `.mission-text`, 1440 px | 680 px, 72/73 chars max, 5 lines, band still 384 px, still centred. |
| Contrast sweep, 34 combinations | Nothing regressed. 3 pre-existing failures, all on `#25d366` → **W28**. |
| `prefers-reduced-motion: reduce` | All sections visible; tracking normal, `balance` applied, weight 400, label 12 px, no overflow. |
| Scripting disabled (`**/js/**` aborted) | All sections visible, labels 12 px and one line, 7 motive links present, no overflow. W8 intact. |
| `hugo --gc --minify` | Clean. |

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

## W23 — The stretched composer card and the left-pinned hero ✅ DONE

### Outcome — 2026-08-13

All five changes landed as written. Files changed: `assets/css/main.css` (+15 −8, ten of which
are two comments), `layouts/index.html` (the hero block reordered, one attribute pair).

| Change | Before | After |
| --- | --- | --- |
| `.contact-grid` | `align-items: stretch` (default) | **`align-items: start`** |
| Hero order | … intro → **social** → CTA | … intro → **CTA** → social |
| `<img class="hero-photo">` | `width="96" height="96"` | **`140` / `140`** |
| `.hero .big-text` max-width | `600px` | **`680px`** |
| `.social-links` padding | `padding-bottom: 3.4rem` | **`padding: 2rem 0 0`** |

**The grey rectangle is gone, and the number is bigger than the item implies.** At 1440 px the
composer column was **986.7 px** tall against **336.8 px** of content — **650 px of empty
`#f9fafb`**. It is now **396.8 px**, and the 60 px below the last chip is the card's own 40 px
of padding plus the chip row's margin. The columns top-align at y 3892. Fully expanded
(motive → destinatario → name typed) the card is **895 px** against the info column's 986.7 —
so it no longer stretches in either state, which is the case the one-line fix could have got
wrong.

**`.hero-photo` needed no CSS.** The item points at `main.css:123` for the 96 px; there is no
size there — `.hero-photo` only sets `display`, `border-radius` and `margin-bottom`, and the
box comes entirely from the HTML attributes. Changing the attributes was the whole change, and
it is also what keeps the aspect ratio reserved before the image decodes.

**Zero layout shift, measured rather than asserted.** A `PerformanceObserver` on `layout-shift`
over a fresh load reports **CLS 0.000 at 375 px and at 1440 px**, and the rendered box is
exactly 140×140.

**The source image is 256×256** (`static/images/profile-miguel-oliva.jpg`, 21 kB). At 140 px
that is 1.83× — fine on a 2× phone, and it was 2.67× at 96 px, so this spends real headroom.
**This answers one of W24's open questions and the answer is no:** a 320 px portrait would be
upscaled from a 256 px source. A note to that effect has been added to W24.

#### The no-JS overlap that W18, W26 and W20 each handed forward is closed

That is the point of moving the social links, and it worked with room to spare:

| Measurement, 375×812, scripting disabled, scroll 0 | W18 | W26 | W20 | **Now** |
| --- | --- | --- | --- | --- |
| Hero CTA bottom edge | 757 | 786 | 809.5 | **701.5** |
| Sticky bar top edge | 740 | 726 | 725.8 | **725.8** |
| **Overlap** | 17 px | 60 px | 83.7 px | **none — 24.3 px of clearance** |

The CTA moved up **108 px** (719.9 → 611.9) even though the portrait grew 44 px, because the
152 px social block left from above it and came back 22.4 px shorter.

**The padding floor still does its job, now for the social list.** At the scroll position where
the hero's bottom edge rests at the viewport bottom — the case `.hero { padding-bottom: 7rem }`
exists for — the last social link ends at y 700.3 against the bar's 725.8: **25.5 px clear**,
matching the ~26 px W18 and W26 left. That number was checked rather than assumed, because the
element the floor protects is not the same element any more.

**Known and accepted:** with scripting disabled at scroll 0, the always-visible bar covers the
first row of social links. A fixed bar covers the bottom 86 px of the viewport at every scroll
position, so *something* is always under it; this trades a covered primary CTA for a covered
secondary link that scrolls clear immediately. Nothing to fix, and nothing new — it is the same
mechanism W18 recorded.

**`.social-links` padding — re-decided, as the item asked, not left by inertia.** The 3.4 rem
underneath was separating the list from the CTA *below* it. With the CTA above, the thing that
needs separating is on the other side, and the space down to the end of the section is already
the hero's own padding — 6rem on desktop, 7rem on mobile. So it is `2rem 0 0`: 32 px plus the
0.65 rem each link carries reads as ~42 px of air under the button, close to the 48 px the
intro paragraph has above it. The block is **129.6 px** at 375 px, down from 152.

**`.hero .big-text` at 680 px is a real improvement, not just a wider box.** The intro drops
from **3 lines to 2** at 1440 px, and the longest line goes from ~59 to **67 characters** —
inside the 65–75 range, measured with a `Range` over the text node rather than estimated. The
hero still ends at x 890 of 1440, so the fundamental imbalance the Context describes is
unchanged; that is W24's, and this item is deliberately the conservative version.

Verified in headless Chromium (Playwright MCP) against the built site on `:1407` — 1399–1406
were avoided per the note about parallel sessions:

| Check | Result |
| --- | --- |
| 1440×900, composer collapsed | Columns top-align at 3892; composer 396.8 px vs info 986.7. Screenshot: the card ends under the chips, no grey run-on. |
| 1440×900, composer fully expanded | 895 px vs 986.7 — still no stretch. `wa.me` href carries the typed name, so W17's flow is intact. |
| Hero order, 1440 px and 375 px | DOM, visual and accessibility tree all read portrait → h1 → subheading → intro → CTA → social. Tab order follows. |
| 375×812 | Hero CTA 611.9–701.5, fully above the fold; social block starts at 760.7. |
| 375×812, scripting disabled (`**/js/**` aborted) | `js-reveal`/`js-sticky` both dropped after the 2 s fallback, all 6 sections at opacity 1, 7 motive links, bar visible with `transform: none`. **No overlap** — see the table above. |
| Layout shift | CLS **0.000** at 375 px and 1440 px; rendered box 140×140 = the attributes. |
| Sticky bar with JS, 375 px | Hidden at the top, visible at scroll 2200, hidden again with the composer centred, hidden back at the top. W18's and W26's observer unaffected. |
| `prefers-reduced-motion: reduce`, 375 px | All sections visible, geometry identical, `transition-duration` 1e-05s. |
| W20 — touch targets | 23 visible targets at 375 px, 23 at 320 px, 26 at 1440 px, composer expanded — **0 under 44×44** at any of them. |
| W27 — overflow | `scrollWidth === innerWidth` and **no element escaping the viewport** at 320, 375 and 1440 px. |
| W22 — regression guards | Story weight 400, title tracking `normal` + `text-wrap: balance`, step label 12 px, `.mission-text` 680 px. |
| Story and services sections | Untouched — the diff reaches neither, and `.social-links` is used nowhere but the hero. |
| `hugo --gc --minify` | Clean. |

**Nothing was left undone**, and nothing new was raised: the one finding outside this item's
scope — the 256 px source image — belongs to W24 and is recorded there.

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
  this is the number W18 also cares about. ~~**Since W26 the hero button is two lines at 375 px
  (696–786) and the always-visible no-JS bar starts at 726.**~~ **W20 moved these on
  2026-08-13**: 44 px social links pushed the hero button down to **719.9–809.5**, the bar
  still starts at 725.8, so the no-JS overlap is now **83.7 px**. The social block is 152 px
  tall and carries `padding-bottom: 3.4rem` (W20 traded 0.6rem of it for the padding each link
  now has) — moving it below the CTA is worth more than enough to clear the overlap. Check
  whether it does, and re-decide that 3.4rem once the list is in its new place.
- The larger portrait causes no layout shift: check that the rendered `<img>` box matches its
  `width`/`height` attributes.
- The story and services sections are untouched.

### Start command

```bash
claude "Read TODO.md and implement work item W23: add align-items:start to .contact-grid, move the hero social links below the primary CTA, raise the portrait to 140px including its width/height attributes, and widen .hero .big-text to 680px. Follow the instructions in that item. Do not build a two-column hero — that is W24 and it is blocked. Verify there is no layout shift from the portrait change. When finished, mark W23 done in TODO.md per the Completion protocol."
```

---

## W27 — `.services-grid` overflows the viewport below 390 px ✅ DONE

### Outcome — 2026-08-13

`.services-grid` joined the `.story-grid, .contact-grid` rule in the existing 768 px block —
the item's preferred fix, and the smaller of the two it offered. Only file changed:
`assets/css/main.css` (+7 −2, four of which are a comment).

**The `gap` question the item raised answers itself: there is nothing to reconcile.**
`.services-grid`'s base rule already declares `gap: 2rem`, which is exactly what the
neighbouring rule sets, so joining that selector list changes `grid-template-columns` and
nothing else. Measured stacked gap is 32 px at every width below 769 px — the same 2rem it
had before.

| Viewport | Before | After |
| --- | --- | --- |
| 320 px | **50 px of horizontal overflow**, items 350 px wide ending at x 370 | **0 px**, items 280 px, x 20 → 300 |
| 360 px | **10 px of overflow** | **0 px**, items 320 px, x 20 → 340 |
| 375 px | No document overflow, but items ran to x 370 — 5 px from the screen edge | **0 px**, items 335 px, x 20 → 355, flush with the container gutter |
| 390 / 414 / 768 px | — | 0 px, one column, inside the gutter |
| 769 / 1024 / 1440 px | — | **Unchanged.** 1440 px: 2 columns, 494 px each, x 210 → 1230 |

At 375 px this fixes the second, quieter half of the defect too: the cards used to sit 15 px
past the container gutter while every other section respected 20 px, which is why no overflow
check ever flagged them. They now line up with everything else.

**Desktop is structurally untouched** — the rule lives inside `@media (max-width: 768px)`.
The 769 px column count is 1 both before and after, and that is the base `auto-fit` rule
doing its job, not this change: two 350 px tracks plus the 32 px gap need 732 px and the
container offers 689 px there.

**Correction to this item's Context, for whoever reads it next:** it says "the five
`data/services.yaml` entries". There are **six** — `Inclusión` was added and the count in the
item was never updated. Nothing depends on the number; recorded so it is not re-derived.

Verified in headless Chromium (Playwright MCP) against the built site on `:1405`:

| Check | Result |
| --- | --- |
| 320 / 360 / 375 / 390 / 414 / 768 / 769 / 1024 / 1440 px | `scrollWidth === innerWidth` at **every** width. All six `.service-item`s inside the gutter at each. |
| Full overflow sweep at 320 px | **No element overflows** — re-run rather than assumed, per the item. The list is now empty; it previously returned `.service-item` and its children. |
| Stacked gap | 32 px (2rem) at every width ≤768 px. |
| 1440 px | 2 columns, 494 px each — same column count and widths as before. |
| Screenshot, 320 px | Cards stack full-width inside the 20 px gutter, dividers and rhythm unchanged. |
| Scripting disabled (`**/js/**` aborted), 320 px | 1 column, 280 px, no overflow, every section visible. W8 intact. |
| `prefers-reduced-motion: reduce`, 320 px | Same, all sections visible. |
| Touch targets at 320 px | 19 visible targets, **0 under 44×44** — W20 holds at the width it could not previously clear. |
| W22 regression guards | Story weight 400, title tracking normal, label 12 px, `.mission-text` 680 px — all intact. |
| `hugo --gc --minify` | Clean. |

### Context

**Found while verifying W19 at 320 px. Pre-existing — nothing in W19 caused it, and it is
not a regression from any round-2 item.** Raised here rather than fixed there, per the
completion protocol.

### Context

```css
.services-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }  /* main.css:243 */
```

The `768 px` block collapses `.story-grid` and `.contact-grid` to `1fr` but **not**
`.services-grid`, so its track floor stays 350 px at every width. With `.container`'s 20 px
of mobile padding on each side, the grid needs **390 px** of viewport to fit.

Measured against the built site:

| Viewport | Result |
| --- | --- |
| 320 px | Every `.service-item` is 350 px wide and ends at x 370 — **50 px of horizontal overflow**, the whole page scrolls sideways |
| 375 px | 350 px wide, ends at x 370 of 375. No document overflow, so nothing flagged it — but the five service cards sit 15 px past the container gutter and 5 px from the screen edge, while everything else on the page respects 20 px |

That second row is why both rounds of review missed it: **the round-2 review checked 375 px
and 1440 px and correctly reported "no horizontal overflow"**. It is true at 375 px. It stops
being true at 360 px (a very common Android width) and below.

The section is the five `data/services.yaml` entries — the copy carrying the site's thesis
about autism and addiction, so it is not a minor corner of the page.

### Instructions

- Add `.services-grid { grid-template-columns: 1fr }` to the existing `@media (max-width:
  768px)` block, next to the `.story-grid, .contact-grid` rule that already does exactly
  this. Adding it to that same selector list is the smaller change and probably the right
  one — check that `.services-grid`'s `gap: 2rem` still reads correctly stacked, since the
  neighbouring rule also drops the gap to `2rem`.
- Alternatively lower the `minmax` floor so the track can shrink. Prefer the media-query fix:
  it matches how the other two grids are already handled and does not change desktop.
- Do not touch the desktop layout — `auto-fit` at ≥769 px is doing the right thing.

### Verify

- 320 px, 360 px and 375 px: `document.documentElement.scrollWidth === window.innerWidth`,
  and every `.service-item` sits inside the container gutter (left edge x 20, right edge
  x `innerWidth - 20`).
- 1440 px: the services section is unchanged — same column count, same widths.
- No other element overflows at 320 px. The sweep that found this one only reported
  `.service-item` and its children, but re-run it after the fix rather than assuming.

### Start command

```bash
claude "Read TODO.md and implement work item W27: .services-grid keeps a 350px minmax floor at every width, so it overflows the viewport below 390px. Collapse it to a single column inside the existing 768px media block, as .story-grid and .contact-grid already are. Verify at 320px, 360px and 375px that nothing overflows and every .service-item respects the container gutter, and that 1440px is unchanged. When finished, mark W27 done in TODO.md per the Completion protocol."
```

---

## W28 — Text on the WhatsApp green fails contrast, and one button is grey on green ✅ DONE

### Outcome — 2026-08-13

**Zero sub-4.5:1 combinations remain on the page.** The three failures resolve to one number,
**7.40:1**, and they resolve for the same reason: the label on the WhatsApp green is now the
site's own `#1f2937`. Only file changed: `assets/css/main.css` (+20 −3, 14 of which are two
comments).

**The owner's decision, 2026-08-13 — this is half the item, so it is recorded first.** Asked
whether to keep the brand green and accept 1.98:1, darken the fill, or keep the fill and
darken the text, he chose: **keep `#25d366` exactly, take the text to `#1f2937`.** The fill,
the border and the hover are untouched; the green still does its job as the channel signal,
and it is the *text* that moved. **The next contrast sweep should not re-raise this.**

| Combination | Ratio | |
| --- | --- | --- |
| `#ffffff` on `#25d366` — what shipped | **1.98:1** | fails 4.5:1, and fails the 3:1 large-text bar too |
| **`#1f2937` on `#25d366` — what ships now** | **7.40:1** | |
| `#1f2937` on `#1ebe5b`, the hover fill | **5.99:1** | measured by hovering, not assumed |
| `#ffffff` on `#128c7e` | 4.13:1 | **still fails** |

**Correction to this item's own Context, and it matters.** It offers `#128c7e` as a fill that
"carries white comfortably". It does not — white on it is **4.13:1**, under 4.5:1 for normal
text, so the fix this item proposed would not have fixed it. Anyone reaching for that number
later should reach for something else.

**One rule covered all three buttons.** `.composer__cta` and `.sticky-cta__link` both compose
`btn-contact--whatsapp` and override only layout, never colour, so `color: #fff` → `#1f2937`
at `main.css:535` reached the contact number, the composer CTA and the sticky bar at once. The
glyph followed on its own — `.btn-contact svg` is `fill: currentColor`.

#### The grey one was a cascade collision, and it reached two things this item did not know about

`.contact-item span, .contact-item p` is `(0,1,1)`, which beats any single-class rule on a
descendant no matter what the source order is. So inside `.contact-item` it was silently
winning three arguments it was never meant to enter — not one:

| Target | Its own rule asks for | What actually rendered |
| --- | --- | --- |
| `.btn-contact--whatsapp span` — the phone button | white, from `main.css:535` | `#6b7280` on green, **2.44:1** |
| `.map-facade__label` | 16 px `#1f2937` | 15.6 px `#6b7280` |
| `.map-facade__note` | 13 px `#6b7280` | 15.6 px `#6b7280` |

The map facade lives inside the first `.contact-item` (`index.html:129`), which is why it was
caught. Both facade overrides were found while planning this item and **the owner chose to
un-do them here** rather than defer them: `.map-facade__label` and `.map-facade__note` had
been rendering at the same size, so the component had no label/note hierarchy at all. The
before/after screenshots are the clearest evidence in this item.

The fix is a child combinator, and it needed no `:not()` or `:is()` — neither appears anywhere
in this file:

```css
.contact-item > span,
.contact-item address { color: #6b7280; font-size: 0.975rem; }
```

The first `.contact-item` has no direct `<span>` child, so neither `.map-embed > button > span`
nor `.contact-actions > a > span` is reachable any more. `<address>` inherits down to its own
`<p>` and `<span>`, so nothing about the address block moved. `.contact-item address
{ font-style: normal }` was left as its own rule — merging it would have been a bigger diff
for nothing.

**A side effect worth naming, because it is an improvement and someone will notice it.** The
phone label was 15.6 px only because `.contact-item span` was setting it; it now inherits
`.btn-contact`'s 14.4 px and therefore matches "Ver en Google Maps" sitting beside it. The two
buttons in that row were different text sizes before and are not any more.

**A second correction to this item's Context.** Its table lists the `.sticky-cta__link` label
at 14.4 px. Measured, it is **16 px** — `.sticky-cta__link` declares `font-size: 1rem` and
wins on source order over `.btn-contact`'s `0.9rem`. The 14.4 px entry is most likely the
`<a class="btn-contact btn-contact--whatsapp">` element itself, which is white-on-green at
14.4 px and is a fourth instance of the same failure, not a third. Nothing turns on it — every
one of them is `#1f2937` now — but the table should not be quoted as measured.

**The 34-combination sweep is now the baseline, and the count is viewport-dependent.** Re-run
as the item asked, descending into inner `<span>`s and resolving the nearest *painted*
ancestor background: **35 combinations at 1440×900** and **33 at 375×812**, composer expanded
in both, **zero failures at either**. The weakest thing on the page is now `.map-facade__note`
at **4.63:1** — 13 px `#6b7280` on the `#f9fafb` facade, which passes, and which only exists
as a distinct combination *because* this item restored its 13 px. Quote 33–35, not 34: the
figure moves with the viewport, since the sticky bar and the nav pills are not both present at
any one width.

Not touched, deliberately: `.btn-contact--motivo svg { fill: #25d366 }`. It is an
`aria-hidden` glyph beside its own dark label — decorative, not text, and not a control
boundary that has to carry 3:1.

Verified in headless Chromium (Playwright MCP) against the built site on `:1406` — 1399–1405
were avoided per the note about parallel sessions:

| Check | Result |
| --- | --- |
| Contrast sweep, 1440×900, composer expanded | **35 combinations, 0 failures.** Weakest 4.63:1. |
| Contrast sweep, 375×812, composer expanded | **33 combinations, 0 failures.** Weakest 4.63:1. |
| The three green labels | Contact number, composer CTA and sticky bar all `rgb(31,41,55)` on `rgb(37,211,102)` — **7.40:1**. |
| Hover | `#1ebe5b` fill, label still `#1f2937` — 5.99:1. Hovered and measured, not inferred. |
| Painted pixels | Element screenshots of all three buttons: dark type on green, legible; the glyph darkened with it. The before shot shows the murky grey the item describes. |
| Map facade | Label **16 px `#1f2937`**, note **13 px `#6b7280`** — its own rules, applying for the first time. |
| Nothing else `.contact-item` styles | Four detail `<span>`s and three `<address>` lines all still `#6b7280` at 15.6 px. |
| W20 — touch targets | 24 visible targets at 375 px and 0 under 44×44; same at 320 px. Phone button 45.6 px, one line. |
| W21 — focus rings | 26 stops at 1440 px, **every one `2px solid rgb(31,41,55)`**, all `:focus-visible`, offsets `+2px` except `.map-facade`'s `−2px`. Measured after a 320 ms settle, per W21's own trap. |
| W22 | Story weight 400, title tracking `normal` + `text-wrap: balance`, step label 12 px, `.mission-text` 680 px. |
| W27 | `scrollWidth === innerWidth` at 320, 360 and 375 px; nothing escaping the viewport at 320. |
| Scripting disabled (`**/js/**` aborted) | `js-reveal`/`js-sticky` both dropped after the 2 s fallback, all 6 sections at opacity 1, 7 motive links, bar visible with `transform: none`, both green labels dark. W8 and W18 intact. |
| `prefers-reduced-motion: reduce` | All sections visible, `transition-duration` 1e-05s, colours and sizes as above. |
| `hugo --gc --minify` | Clean. |

**Nothing was left undone.** Both halves of the item are closed: the defect is fixed and the
design question has a recorded answer rather than a deferral.

### Context

### Context

Both rounds recorded "contrast passes 4.5:1 at all 18 text styles measured". That is true of
the 18 that were measured. The W22 sweep enumerated **34** distinct
colour/background/size/weight combinations — it descends into the inner `<span>`s of buttons
and resolves the nearest *painted* ancestor background rather than the element's own
transparent one — and three of them fail:

| Element | Colour | On | Size | Ratio |
| --- | --- | --- | --- | --- |
| Contact-block phone number | `#6b7280` **grey** | `#25d366` | 15.6 px / 600 | **2.44:1** |
| `.composer__cta` label | `#ffffff` | `#25d366` | 16 px / 600 | **1.98:1** |
| `.sticky-cta__link` label | `#ffffff` | `#25d366` | 14.4 px / 600 | **1.98:1** |

**These are two different problems and only the first is unambiguous.**

**1. The grey one is a cascade collision and looks like a bug.** `main.css:419` sets

```css
.contact-item span,
.contact-item p { color: #6b7280; font-size: 0.975rem; }
```

The WhatsApp phone button sits inside a `.contact-item`, so that selector reaches the
`<span>` *inside* the green button and overrides the white it should inherit from
`.btn-contact--whatsapp` (`main.css:533`). A screenshot confirms it renders as murky grey
type on green — it does not read as a deliberate choice, and it is the one direct WhatsApp
link the owner explicitly chose to keep in W26. Scoping the rule so it does not reach inside
`.btn-contact` is the obvious fix, but check what else `.contact-item span` legitimately
styles before narrowing it.

**2. White on `#25d366` at 1.98:1 is the WhatsApp brand button**, and it is what every
WhatsApp button on the web looks like. Fixing it means either darkening the fill away from
the brand green or putting dark text on it — both are visual-design decisions, and
`CLAUDE.md` says the design is settled. **Do not change it unilaterally.** Options worth
putting to the owner: keep it and accept the ratio on brand grounds; or darken the fill to
around `#128c7e` (WhatsApp's own darker brand teal), which carries white comfortably. The
green is doing real work as a channel signal, so "just make it grey" is not an answer.

### Instructions

- Fix the grey-on-green phone button. That one is a defect with no design question attached.
- Raise the white-on-green question with the owner rather than deciding it. Record the answer
  here either way — a recorded "keep the brand green" is worth as much as a change, and it
  stops the next contrast sweep re-raising it.
- While in there, re-run the 34-combination sweep rather than the 18-style one, and record
  that the larger number is now the baseline.

### Verify

- The contact-block phone button reads white on green, ≥4.5:1, and nothing else that
  `.contact-item span` styles changed appearance.
- Re-run the full sweep at 1440 px and 375 px with the composer expanded; the only remaining
  sub-4.5:1 entries are the brand-green ones, and they are there by a recorded decision.

---

## W12b — Voice and tone sweep across all copy

**Carried over from round 1, still unfinished. Run LAST** — it edits the final text of
everything the other items produce.

### Context

`CLAUDE.md` is the guide (round 1's W12a wrote it). This item applies it. Running it before
W18–W23 means running it twice, since W19 adds a header string and W23 reorders the hero.

> **2026-08-12 — the language rule changed under this item.** The doctor read the site and
> rejected `voseo` as not proper for a doctor. The reader is now addressed as **`usted`**
> throughout; see the rewritten **Language** and **Person** sections of `CLAUDE.md`, which
> also cover the one deliberate exception (interface imperatives stay `tú`: `Elige`, `Baja`).
> The `usted` conversion itself was already applied across every file listed below — so what
> is left for this item is the rest of the sweep (capitalisation, alt text, `aria-label`s),
> not the person. **Do not convert anything back to `vos`.**

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

1. ~~`layouts/index.html:100` — **"No tienes que hacerlo solo."** is tuteo.~~ **Done
   2026-08-12**, as **"No tiene que hacerlo solo."** — `usted`, not the `tenés` this item
   originally called for. Still open: reconsider "solo" entirely, since the site's own
   thesis in `data/services.yaml` is *"Sanar no es tarea de uno solo."* The sentence argues
   against itself, and that is a meaning change the doctor should approve.
2. ~~`layouts/partials/header.html` — nav labels **"Mi Historia"** and **"Qué Hago"** are
   English title case.~~ **Done 2026-08-12** → "Mi historia", "Qué hago".
3. ~~`layouts/index.html:105` — **"Información de Consulta"**.~~ **Done 2026-08-12** →
   "Información de consulta".

   The same sweep also caught the five service `<h3>`s in `data/services.yaml`, which the
   original item missed: "Consulta psiquiátrica integral", "Acompañamiento en autismo",
   "Recuperación de adicciones", "Terapia familiar", "Educación comunitaria". Nothing
   downstream reads those titles — `schema.html` does not touch `data/services.yaml`.

   **Deliberately left in title case, both need the doctor:**
   - `data/credentials.yaml` — "Máster en Trastornos del Espectro Autista", "Especialista
     en Tratamiento de Adicciones". These are formal qualification names, and `CLAUDE.md`
     fences credentials off from editing.
   - `hugo.toml` `contact.specialties` — "Salud Mental General". It is in the verified-facts
     table, so restyling it is his call, not a sweep's.
   - `hugo.toml` `title` — "Psiquiatra Especialista en Autismo y Adicciones". A
     search-result string, not a heading; `description` already uses lower case, so the two
     disagree. Worth a decision, not a silent fix.
4. ~~`data/services.yaml` — check every second-person verb form for voseo.~~ **Done
   2026-08-12** as `usted`: `le lleva`, `su proceso`, `su libertad`.
5. ~~All motive strings in `data/motivos.yaml` and the CTA labels in `[params.whatsapp]`.~~
   **Done 2026-08-12.** The motive strings never needed it — they are written by the
   visitor and were already `usted`. The CTA labels became `Escríbame por WhatsApp` and
   `Escríbame — le ayudo con el mensaje`.

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
- Whether a 320 px portrait is wanted. ~~given the current file is a studio headshot at an
  unknown source resolution — check `static/images/profile-miguel-oliva.jpg` before promising
  it will hold up at that size.~~ **Measured 2026-08-13 while doing W23: the file is
  256×256 px, 21 kB.** So a 320 px portrait would be *upscaled* even on a 1× screen, and W23
  already spent most of the headroom taking it to 140 px (1.83× on a 2× phone, down from
  2.67×). **This item needs a new photograph first**, at 640 px or more, which is a request to
  the doctor and not something a session can resolve.
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
| `assets/css/main.css` | W18, W19, W20, W21, W22, W23, W27, W28 |
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

**W27** was raised by W19 and belongs in this wave too — it is one line in the same 768 px
block W19 and W20 both edit, so run it anywhere in the serial chain rather than concurrently.
**W28** was raised by W22 the same way and sits in the same wave, with the same caveat: its
`main.css` edit is small, but half of it is a question for the owner rather than a change.

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

- ~~**Contrast passes 4.5:1 at all 18 text styles measured**, in both light panels and the dark
  `.mission` band.~~ ~~**Superseded 2026-08-13 by W22's re-run.** True of those 18, and the light
  panels and the `.mission` band are genuinely fine. But a sweep that also descends into the
  `<span>`s inside buttons finds **34** combinations, and **three fail** — all text on the
  WhatsApp green. Now tracked as **W28**. Use the 34-combination sweep as the baseline; the
  18-style figure understates what is on the page.~~ **Fixed 2026-08-13 by W28.** All of them
  pass now: **33 combinations at 375 px and 35 at 1440 px, zero failures**, weakest 4.63:1. The
  count is viewport-dependent, so quote 33–35 rather than 34. The WhatsApp green keeps its
  `#25d366` fill by the owner's decision and carries `#1f2937` text at 7.40:1 — see W28's
  Outcome before re-opening it. **Never quote the 18-style figure**; it counts neither the
  `<span>`s inside buttons nor the composer, which only exists once expanded.
- ~~**No horizontal overflow and no element escaping the viewport at 375 px** — true, and true
  *only* at 375 px. `.services-grid` overflows at 360 px and below; found while verifying
  W19 and now tracked as **W27**.~~ **Fixed 2026-08-13 by W27.** Now true at 320, 360, 375,
  390, 414 and 768 px as well. Check 320 px, not 375 px, when testing overflow on this site —
  375 px is the width that hid this for two rounds.
- **`prefers-reduced-motion` is handled properly**, at two levels — the reveal never arms and
  a global block zeroes every transition.
- **The no-JS composer fallback genuinely works**, and W17 verified it by aborting the Alpine
  request rather than by assuming.
- **Nothing third-party loads before a deliberate click**, other than GA4 under the DNT gate.
