# TODO — migueldelaoliva.com

Work items derived from the site audit (August 2026). Scope constraint for **all** items:
**do not redesign the visual language.** Reuse the existing palette, type scale, and class
names in `assets/css/main.css`. New CSS is allowed only where a new component genuinely
requires it, and it must look like it was always there.

Deferred out of this round (do not action): FAQ section + FAQPage schema, crisis/emergency
block, insurance/`seguros` copy. These need answers from the doctor first.

---

## Status board

| Item | Wave | Status |
| --- | --- | --- |
| W12a — Voice guide → CLAUDE.md | 0 | ✅ **Done** — 2026-08-12 |
| W7 — robots.txt AI crawler rules | 1A | ✅ **Done** — 2026-08-12 |
| W9 — Favicon | 1A | ⬜ Not started |
| W4 — Remove clinic affiliation | 1B | ✅ **Done** — 2026-08-12 |
| W6 — Schema `@graph` | 1B | ⬜ Not started |
| W8 — Reduced motion / no JS-hidden content | 1C | ⬜ Not started — *reported done 2026-08-12, but no changes found in working tree; see item* |
| W5 — Keyword-led H1 | 2 | ⬜ Not started |
| W2 — WhatsApp primary CTA | 2 | ⬜ Not started |
| W3 + W1 — Dead box → message composer | 2 | ⬜ Not started |
| W14 — Map click-to-load facade | 3 | ⬜ Not started |
| W15 — GA4 + conversion tracking | 3 | ⬜ Not started |
| W12b — Voice and tone sweep | 4 | ⬜ Not started |

Legend: ⬜ Not started · 🟡 In progress · ✅ Done · ⏸️ Blocked

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
   git commit -m "W7: explicit AI crawler allow rules in robots.txt"
   ```

   Subject line format: `<ID>: <what changed>`. Do not squash several items into one
   commit — the wave plan depends on being able to revert a single item cleanly. Do not
   push unless asked.

If an item is only partly done, mark it 🟡 **In progress** and record precisely what
remains. Never mark something ✅ that a reviewer would disagree with.

### Marked done, not deleted

Completed items **stay in this file** with their Outcome block. Do not delete them.
The instructions explain *why* a thing was built the way it was, and later items depend on
that: W14 and W15 both write `assets/js/main.js` after W8 restructures it, W6 rewrites the
schema W4 pruned, and W1 reuses the partial W2 creates. Deleting a finished item removes
the record of decisions its successors were built on — and removes the evidence that it
was verified at all.

### Verify before believing

Do not mark an item done because a session reported it done. Check the working tree:
`git status`, `git diff --stat`, and grep for the thing that was supposed to change. A
session can end without its edits applying, and a `TODO.md` that claims work exists when
it does not is worse than one that says nothing.

---

## Site map (for context in every item)

The whole site is small. Nearly every item touches one of these five files, which is why
the parallelisation analysis at the bottom matters.

| File | Role |
| --- | --- |
| `hugo.toml` | All site params: contact block, hero block, SEO defaults |
| `content/_index.md` | The first-person "quién soy" narrative |
| `layouts/index.html` | The entire single page — hero, historia, servicios, misión, contacto |
| `layouts/partials/schema.html` | JSON-LD |
| `layouts/partials/head.html` | Meta tags, favicons, CSS |
| `assets/css/main.css` | 478 lines, no custom properties, colours hardcoded |
| `assets/js/main.js` | Smooth scroll + IntersectionObserver reveal |
| `data/social.yaml`, `data/services.yaml`, `data/credentials.yaml` | Content data |

---

## W12a — Voice, style and tone guide in CLAUDE.md ✅ DONE

**Run this FIRST. It blocks nothing but informs every other item's copy.**

### Outcome — 2026-08-12

`CLAUDE.md` created at the repo root, 245 lines. Checked line by line against this item's
checklist — every required point is covered: voseo table, person, register
(acompañar/tratar), neurodiversity-affirming rules, hard prohibitions with `COMPLETAR`,
the verified-facts block sourced from `hugo.toml`, and the design constraint.

- **Files changed:** `CLAUDE.md` (new).
- **Verified:** read in full against the W12a instruction list; no invented facts — the
  contact table, social profiles and credentials all trace to `hugo.toml` and `data/`.
  No site copy was touched, as instructed.
- **Deviations:** none, but it exceeds the brief in four useful ways, all of which are
  now binding on later items:
  - A **Micro-copy** section covering `alt`, `aria-label`, iframe `title` and button
    labels — feeds W5 (alt text), W2 (CTA labels) and W14 (iframe title).
  - A **Before shipping any copy change** checklist — use it as W12b's acceptance test.
  - Addiction language ("no 'adicto' as a noun-label, no 'limpio', no 'recaída' framed as
    failure"), which was not in the brief and should have been.
  - It carries W15's analytics privacy rule and W4's independent-practice rule forward as
    editorial law, so those decisions survive even if the items are re-run.
- **Judgment call worth knowing about:** on negative commands it prescribes
  `no te preocupes`, not `no te preocupés`, and says to rewrite around uncertain forms.
  That is correct for Santa Cruz — River Plate voseo takes the `-és` subjunctive, camba
  voseo generally does not. Do not "fix" this in W12b.

### Context

The site's copy is inconsistent in how it addresses the reader. Bolivia — and Santa Cruz
specifically — uses *voseo*. The site currently mixes it: `layouts/index.html:82` says
"No tienes que hacerlo **solo**" (tuteo), while other lines happen to be voseo-neutral
because `te`/`tu` are identical in both. The result reads as imported Spanish rather than
local Spanish, which costs trust on a page whose entire proposition is trust.

There is also no persisted record of the editorial rules the audit established, so every
future session re-derives them or contradicts them.

### Instructions

Create `CLAUDE.md` at the repo root. It must capture, at minimum:

- **Language**: Spanish, es-BO, *voseo* (`tenés`, `podés`, `escribime`, `contame`). Never
  `tú`/`tienes`/`puedes`. Never Peninsular Spanish (`vosotros`, `coger`).
- **Person**: first person singular for the doctor ("acompaño", "trabajo con"), second
  person singular voseo for the reader.
- **Register**: warm, plain, anti-stigma, dignity-first. "Acompañar", not "tratar" or
  "manejar". The family is part of the process, not a bystander.
- **Neurodiversity-affirming language**: autism is not a disease and is never "cured".
  Medication addresses co-occurring conditions, never identity. No puzzle-piece imagery
  or metaphors. Prefer identity-first or neutral phrasing consistent with how the doctor
  already writes.
- **Hard prohibitions**: never invent credentials, registration numbers, fees, session
  lengths, or payment methods — unverified facts stay marked `COMPLETAR`. No patient
  testimonials (restricted in medical advertising across most of Latin America). Never
  claim online/video consultations — the practice is in-person only.
- **Verified facts block**: consultorio address, coordinates, hours (Lunes a Sábados
  15:00–18:00), WhatsApp `+591 6000 5594`, the four social profiles, "psiquiatra
  independiente — sin afiliación a clínica" (see W4). Copy these from `hugo.toml` so
  there is a single source of truth.
- **Design constraint**: the visual design is settled; changes are content/UX/schema only.

Do **not** rewrite site copy in this item. W12b does the sweep, at the end.

### Start command

```bash
claude "Read TODO.md and implement work item W12a: create CLAUDE.md with the voice, style and tone guide. Follow the instructions in that item exactly. Do not change any site copy in this item — W12b handles the sweep. When finished, mark W12a done in TODO.md per the Completion protocol."
```

---

## W7 — robots.txt with explicit AI crawler allow rules ✅ DONE

### Outcome — 2026-08-12

Landed as specified. `layouts/robots.txt` now carries the catch-all plus explicit
`Allow: /` blocks for all 14 named agents from the instructions, grouped by vendor with
comments, and a header comment stating the redundancy is deliberate so nobody strips it
later as dead weight.

- **Files changed:** `layouts/robots.txt` (only).
- **Verified:** `hugo --gc --minify` builds clean; `public/robots.txt` renders all blocks
  and the sitemap line resolves absolute to
  `https://www.migueldelaoliva.com/sitemap.xml`.
- **Deviations:** none.
- **Note for later:** the audit's original point stands that this only proves *intent* —
  it does not prove crawlers can actually reach the site. Confirming that no Vercel or
  CDN default is silently blocking these agents needs server-log or fetch-test evidence,
  which is off-site work and not covered by this item.

### Context

`layouts/robots.txt` is currently `User-agent: * / Allow: /` plus the sitemap line. That
already permits AI crawlers by default, so this is a low-risk item — but explicit named
rules remove any ambiguity, and they document intent for whoever touches hosting next.
Vercel serves it with a 1h cache (`vercel.json`), and `enableRobotsTXT = true` is already
set in `hugo.toml`, so the template is live.

### Instructions

Rewrite `layouts/robots.txt` keeping the existing catch-all and the templated sitemap
line, adding explicit `Allow: /` blocks for at least:

`OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `Claude-SearchBot`, `Claude-User`, `ClaudeBot`,
`PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `Bingbot`,
`Amazonbot`, `meta-externalagent`, `DuckDuckBot`.

Keep the Hugo templating for the sitemap (`{{ "sitemap.xml" | absURL }}`). Add a short
comment at the top saying the explicit blocks are intentional and that the site *wants*
AI assistant indexing. Verify with `hugo` that the rendered `public/robots.txt` is correct
and that the sitemap URL is absolute.

### Start command

```bash
claude "Read TODO.md and implement work item W7: rewrite layouts/robots.txt with explicit allow rules for AI and search crawlers. Follow the instructions in that item, then run hugo and verify the rendered public/robots.txt. When finished, mark W7 done in TODO.md per the Completion protocol."
```

---

## W9 — Replace the portrait-JPEG favicon

### Context

`layouts/partials/head.html:39-40` uses the 21 KB portrait photo as both the favicon and
the apple-touch-icon:

```html
<link rel="icon" type="image/jpeg" href="/images/profile-miguel-oliva.jpg">
<link rel="apple-touch-icon" href="/images/profile-miguel-oliva.jpg">
```

A photographic headshot is unreadable at 16px and unnecessarily heavy for an icon slot.

### Instructions

- Create a simple SVG mark in `static/` — a monogram (`MO` or `dO`) or a minimal symbol,
  in the site's existing palette (read the colours out of `assets/css/main.css`; there are
  no custom properties, so pull the literal hex values). Keep it legible at 16px: one
  shape, high contrast, no fine detail.
- Reference it as `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.
- Provide a PNG fallback for Safari/apple-touch-icon at 180×180 (`static/apple-touch-icon.png`).
  If no image tooling is available, generate it from the SVG with whatever is present
  (`rsvg-convert`, `sips`, ImageMagick) — and if none is, say so rather than shipping a
  broken reference.
- Add `<link rel="icon" href="/favicon.ico" sizes="32x32">` only if you actually produce
  the file. Do not reference files that do not exist.
- Leave `og:image` pointing at the portrait — that one is correct as a photo.

### Start command

```bash
claude "Read TODO.md and implement work item W9: replace the portrait-JPEG favicon with a proper icon set. Follow the instructions in that item. Do not reference any file you did not actually create. When finished, mark W9 done in TODO.md per the Completion protocol."
```

---

## W4 — Remove the clinic affiliation; the practice is independent ✅ DONE

### Outcome — 2026-08-12

The `clinic` param is gone. `grep -rn "clinic" hugo.toml layouts/ data/ content/` now
returns exactly one line — the iframe `title` in `index.html`, deliberately left to W14 —
and the rendered `public/index.html` contains no `worksFor` and no `MedicalClinic`.

- **Files changed:** `hugo.toml` (deleted `clinic = ""` from `[params.contact]`),
  `layouts/partials/schema.html` (deleted the `$clinic` `MedicalClinic` dict and the
  `if $contact.clinic` / `worksFor` merge), `layouts/index.html` (deleted the
  `{{- with $contact.clinic }}` paragraph from the `<address>`), `CLAUDE.md` (see
  deviations).
- **Verified:** `hugo --gc --minify` builds clean (4 pages, no warnings). Both JSON-LD
  blocks in `public/index.html` parse as valid JSON; the `Physician` node keeps
  `address`, `geo` and `hasMap` and lost nothing else. The rendered `<address>` is now
  `Edificio Las Palmas Golf View / Avenida Ibérica y Calle 2, Piso 2, Apartamento 20 /
  Santa Cruz de la Sierra, Bolivia`.
- **Left for W14, as instructed:** the iframe `title` attribute still interpolates
  `$contact.clinic`. Worth knowing: with the key deleted, Hugo renders the missing param
  as an empty string rather than erroring or printing `<no value>`, so the rendered title
  is byte-identical to before — `"Mapa de ubicación: , Edificio Las Palmas Golf View"`,
  leading comma and all. Not a regression, but it also means the build will *not* warn
  W14 that the reference is dangling. W14 must delete the interpolation explicitly.
- **Deviations:**
  - Also edited `CLAUDE.md:209-210`, which stated `contact.clinic = ""` exists and that
    "W4 removes it". Left as-is it would read as pending work and invite someone to
    re-add the key. Rewritten to past tense with an explicit "do not reintroduce".
  - The schema `["Physician", "MedicalBusiness"]` question is **not** decided here — it
    belongs to W6, which had not run. Left a Hugo comment at the top of `schema.html`
    recording the decision (independent practice, no `worksFor`, do not reintroduce a
    `MedicalClinic` entity) so W6 inherits the constraint. W6 should replace that comment
    with the real implementation.

### Context

`hugo.toml:34` has `clinic = ""`. The doctor previously worked with a clinic and is now
**fully independent, and wants the website to present him that way permanently.** The empty
string is not a placeholder to fill — the field should go.

The empty value currently causes two real defects:

1. `layouts/index.html:102` renders the map iframe's accessible title as
   `"Mapa de ubicación: , Edificio Las Palmas Golf View"` — a leading comma, read aloud
   by screen readers.
2. `layouts/partials/schema.html:5` builds a `MedicalClinic` node that is never emitted,
   because `worksFor` is gated behind `{{- if $contact.clinic -}}` at line 10. Dead code.

### Instructions

- Delete `clinic` from `[params.contact]` in `hugo.toml`.
- In `layouts/partials/schema.html`, delete the `$clinic` variable (line 5) and the
  `if $contact.clinic` / `worksFor` merge block (lines 10–12). The `Physician` node keeps
  its own `address`, `geo`, and `hasMap` — he *is* the practice.
- In `layouts/index.html`, remove the `{{- with $contact.clinic }}` block in the address
  (lines 92–94).
- **Do not touch the iframe `title` attribute in this item** — that line belongs to W14,
  which restructures the map block. Leaving it to W14 keeps this item out of the
  contested part of `index.html`. Note the dependency in your commit message.
- Consider whether the schema should gain `"@type": ["Physician", "MedicalBusiness"]` to
  express that he is the business — but coordinate with W6, which owns the schema rewrite.
  If W6 has not run yet, leave a comment; if it has, this belongs there.

### Start command

```bash
claude "Read TODO.md and implement work item W4: remove the clinic affiliation from hugo.toml, schema.html and index.html. The doctor is fully independent. Follow the instructions in that item — in particular, do NOT touch the map iframe title attribute, which belongs to W14. When finished, mark W4 done in TODO.md per the Completion protocol."
```

---

## W6 — Expand the JSON-LD schema

### Context

`layouts/partials/schema.html` emits only a `Physician` node and a `WebSite` node, as two
separate unlinked scripts. It ignores data the repo already has, and contains one factual
error.

Current gaps:

- **No `sameAs`.** `data/social.yaml` holds four verified profiles (Instagram, TikTok,
  Facebook, YouTube). `sameAs` is among the strongest entity-disambiguation signals
  available and it is currently unused.
- **No `hasCredential`.** `data/credentials.yaml` holds the master's degree and the
  addictions specialisation.
- **`openingHours` is a bare string** `"Mo-Sa 15:00-18:00"` (`hugo.toml:48`). The
  structured `openingHoursSpecification` form is what parsers actually consume reliably.
- **No `@graph`, no `@id`.** The two nodes are unrelated as far as a parser is concerned.
- **`medicalSpecialty: ["Psychiatric", "Addiction"]` (line 7) is wrong.** `Addiction` is
  not a member of the schema.org `MedicalSpecialty` enumeration. Only `Psychiatric` is
  valid; use the full URL form `https://schema.org/Psychiatric` and move addictions into
  `knowsAbout`, where it belongs.

### Instructions

Rewrite `layouts/partials/schema.html` to emit a single `@graph` with `@id`-linked nodes:

- `Physician` (`@id: {baseURL}#physician`) — `name`, `alternateName`, `image`,
  `description`, `medicalSpecialty` (URL form, `Psychiatric` only), `knowsAbout` (expand:
  autismo, TEA, TDAH, adicciones, patología dual, ansiedad, salud mental, terapia
  familiar), `telephone`, `address`, `geo`, `hasMap`, `areaServed`,
  `openingHoursSpecification`, `sameAs` (ranged from `data/social.yaml`), `hasCredential`
  (ranged from `data/credentials.yaml` as `EducationalOccupationalCredential`),
  `availableLanguage: es`.
- `MedicalBusiness` or `LocalBusiness` (`@id: {baseURL}#practice`) for the consultorio
  itself, linked to the Physician — see W4's note about the independent practice. Do not
  reintroduce a clinic entity.
- `WebSite` (`@id: {baseURL}#website`) with `publisher` pointing at `#physician`.

Build `openingHoursSpecification` from a structured source. Add a
`[params.contact.openingHours]` array in `hugo.toml` (days + opens + closes) rather than
parsing the `"Mo-Sa 15:00-18:00"` string. Keep the human-readable `hours` string for
display; keep or drop `schemaHours` depending on whether anything still reads it.

Do **not** add `FAQPage` — the FAQ content item is deferred. Do not invent `priceRange`,
`aggregateRating`, or a registration number.

Validate the output: `hugo` then paste `public/index.html` into
https://validator.schema.org/ or run a local JSON-LD parse. The build must produce valid,
parseable JSON — watch the `jsonify | safeJS` pipeline for escaping issues.

**Depends on W4** (same file). Run after it.

### Start command

```bash
claude "Read TODO.md and implement work item W6: rewrite layouts/partials/schema.html as a linked @graph with sameAs, hasCredential and openingHoursSpecification, and fix the invalid medicalSpecialty value. Follow the instructions in that item. Confirm W4 has already been applied before starting, and validate the rendered JSON-LD. When finished, mark W6 done in TODO.md per the Completion protocol."
```

---

## W8 — Fix the scroll reveal: no JS-dependent hiding, honour prefers-reduced-motion

> ⚠️ **Reported complete on 2026-08-12, but nothing landed.** Checked before marking:
> `git diff --stat` shows only `layouts/robots.txt` modified; `assets/js/main.js` is
> byte-identical to `HEAD`, still setting `opacity: 0` on every `<section>` at line 21; and
> `grep -rn 'prefers-reduced-motion\|scroll-behavior\|js-reveal' assets/ layouts/` returns
> nothing. Left as **Not started**. If a session did this work, its edits did not reach
> the working tree — re-run the start command below.

### Context

`assets/js/main.js:20-25` sets `opacity: 0` and a translate on **every** `<section>` from
JavaScript, then reveals them via IntersectionObserver:

```js
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  ...
});
```

Two problems:

1. The script is `defer`red (`baseof.html:13`). If it fails, is blocked, or is slow, the
   visitor sees the hero and then nothing. The content is in the HTML so crawlers are
   fine, but a human on a bad connection is not.
2. It ignores `prefers-reduced-motion`. On a mental-health site aimed partly at autistic
   visitors — a population with elevated rates of motion and vestibular sensitivity —
   that is not a cosmetic detail. The smooth-scroll handler at lines 1–9 has the same
   problem.

### Instructions

- Move the initial hidden state into `assets/css/main.css`, gated so it only applies when
  the reveal can actually run: e.g. a `.js-reveal` class added to `<html>` by a tiny
  inline script in `<head>`, or `@media (prefers-reduced-motion: no-preference)` on the
  hidden state. Default — no JS, or reduced motion — must be **fully visible content**.
- Wrap the IntersectionObserver setup in a `prefers-reduced-motion: reduce` check and skip
  it entirely when set.
- Do the same for the smooth-scroll handler: under reduced motion, let the browser jump
  natively. Better still, drop the JS handler and use `scroll-behavior: smooth` in CSS
  inside a `no-preference` media query — the JS version also breaks the URL hash and
  therefore back-button behaviour, which the CSS version does not.
- Unobserve each section once revealed; it currently keeps observing forever.
- Verify: load with JS disabled — all content visible. Load with reduced motion on
  (macOS: System Settings → Accessibility → Display → Reduce motion) — no transitions,
  all content visible.

### Start command

```bash
claude "Read TODO.md and implement work item W8: fix the scroll reveal in assets/js/main.js and assets/css/main.css so content is never hidden by default and prefers-reduced-motion is honoured. Follow the instructions in that item, including the smooth-scroll change, and verify both with JS disabled and with reduced motion enabled. When finished, mark W8 done in TODO.md per the Completion protocol."
```

---

## W5 — Keyword-led H1, portrait out of the heading

### Context

`layouts/index.html:7-11`:

```html
<h1 class="headline">
  <img src="{{ $hero.photo }}" alt="{{ site.Params.author }}" width="96" height="96" class="hero-photo" ...>
  <br>
  {{ $hero.name }}
</h1>
```

Two problems:

1. The `<img>` sits **inside** the `<h1>` with `alt` set to the author's name, so the
   heading's accessible name computes to the name twice — "Dr. Miguel Angel de la Oliva
   Dr. Miguel de la Oliva". A screen-reader user hears it stuttered.
2. The H1 is only his name. That serves people who already know who he is — the ones who
   least need the page. The `<title>` in `hugo.toml:4` is already keyword-led; the H1 is not.

### Instructions

- Move the portrait out of the `<h1>` into its own element, retaining the existing
  `.hero-photo` styling (`main.css:115`) and the `width`/`height`/`loading="eager"`
  attributes.
- Give it descriptive alt text — describe the person and setting, not the filename. Follow
  the voice guide (W12a). Something in the register of "Dr. Miguel de la Oliva, psiquiatra,
  en su consultorio en Santa Cruz de la Sierra."
- New H1: specialty + city, e.g. **"Psiquiatra en Santa Cruz de la Sierra"** with a
  subheading covering autismo, TDAH y adicciones — the exact wording is yours, but it must
  contain the specialty and the city in the H1 itself.
- Move the name and the first-person line into the deck below, using the existing
  `.big-text` / `.subheadline` classes (`.subheadline` at `main.css:30` is defined but
  currently unused — use it).
- Restructure `[params.hero]` in `hugo.toml` to carry the new fields (`h1`, `name`,
  `intro`, `photoAlt`, …) rather than hardcoding strings in the template.
- Keep the `<h1>` visually close to what it looks like now. If the new heading is longer
  and wraps badly on mobile, adjust the `@media (max-width: 768px)` block at `main.css:441`
  — that is an allowed change, a redesign is not.

**Sets the hero markup that W2 builds on. Run before W2.**

### Start command

```bash
claude "Read TODO.md and implement work item W5: restructure the hero H1 in layouts/index.html to be keyword-led, move the portrait out of the heading with descriptive alt text, and move the new fields into hugo.toml's [params.hero]. Follow the instructions in that item and the voice guide in CLAUDE.md. When finished, mark W5 done in TODO.md per the Completion protocol."
```

---

## W2 — Make WhatsApp the primary, repeated call to action

### Context

Today the hero CTA is `<a href="#contacto" class="cta-button">Hablemos</a>`
(`layouts/index.html:25`). It scrolls to the contact section, where the WhatsApp link
appears **exactly once** — as the *second* button inside `.contact-actions`, below the
address and the map, competing with "Ver en Google Maps" (`index.html:108-117`).

So the single conversion path on the site is: read hero → click a vague CTA → scroll →
skip past an address and a map → notice the second of two buttons. Every step loses people.

### Instructions

Build a reusable WhatsApp CTA and place it deliberately:

- Create `layouts/partials/whatsapp-cta.html` taking parameters for label, message text
  and variant (primary / sticky / inline), so the link is constructed in exactly one place.
  Read the number from `site.Params.contact.phoneE164`; keep the existing
  `replace ... "+" ""` normalisation.
- **Hero**: the primary CTA becomes WhatsApp directly, not an anchor to `#contacto`. Reuse
  `.cta-button` (`main.css:122`). Keep a secondary, quieter link to `#contacto` for people
  who want the address first.
- **Mid-page**: add one CTA after the `.mission` section — the emotional high point of the
  page and currently a dead end.
- **Sticky mobile bar**: fixed to the bottom on `max-width: 768px` only. Must not cover
  the footer content — add matching bottom padding to `body` or `footer` at that
  breakpoint. Reuse the WhatsApp green already defined at `.btn-contact--whatsapp`
  (`main.css:367`) rather than introducing a new colour.
- All WhatsApp links: `rel="noopener noreferrer"`, `target="_blank"`, and an
  `aria-label` that says where the link goes.
- Give every CTA a stable `data-` attribute or class that W15 can hook analytics onto
  (e.g. `data-cta="hero"` / `"mid"` / `"sticky"` / `"contact"`). W15 depends on this.
- Do **not** add the pre-filled message picker here — that is W1. Use a single sensible
  default message for now, so W1 has something to extend.

**Depends on W5** (hero markup). **W15 depends on this.**

### Start command

```bash
claude "Read TODO.md and implement work item W2: make WhatsApp the primary repeated CTA via a reusable layouts/partials/whatsapp-cta.html partial, placed in the hero, mid-page after .mission, and as a sticky mobile bar. Follow the instructions in that item, including the data- attributes W15 needs. Confirm W5 has been applied first. When finished, mark W2 done in TODO.md per the Completion protocol."
```

---

## W3 + W1 — Replace the dead booking box with a WhatsApp message composer

> **Run these two together in one session.** W3 empties the slot, W1 fills it. Splitting
> them across sessions leaves the page in a worse state than it started.

### W3 context — the dead box

`layouts/index.html:141-144`:

```html
<div class="contact-form">
  <h3>Agendamiento en línea</h3>
  <strong>Próximamente</strong>
</div>
```

This occupies half of the contact grid — the highest-intent real estate on the page — and
its entire message to a visitor who has scrolled that far is *"the thing you want does not
exist yet."* It is the worst possible payload for that position.

### W1 context — the composer

Every WhatsApp link on the site is a bare `wa.me/59160005594` with no `?text=` parameter.
The audit's core finding is that the real drop-off in psychiatric care is not price — it
is **not knowing how to write the first message.** A visitor who taps through lands in an
empty chat window and has to compose, cold, a sentence about their own or their child's
mental health. Many do not.

Pre-filling the message removes that. The full interactive composer from the proposal
(reason × who-it's-for, live preview bubble) is a larger build; a preset-link version
captures most of the value with a data file and a `range` block.

### Instructions

- Delete the `.contact-form` block. Keep the `.contact-grid` two-column layout
  (`main.css:273`) — the new component takes the vacated cell.
- Create `data/motivos.yaml`: a list of consultation reasons, each with `id`, `label`, and
  a `message` written in the doctor's voice (see CLAUDE.md from W12a). Cover at least:
  autismo (adulto), autismo (hijo/a), atención / TDAH, consumo y adicciones, ansiedad,
  ánimo bajo, orientación familiar.
- Messages must be first-person *from the visitor*, warm and low-commitment, and must not
  put words in their mouth about a diagnosis they may not have. Aim for the register of
  "Hola doctor, escribo porque me gustaría consultar sobre un posible diagnóstico de
  autismo en mí. ¿Podemos coordinar una cita?" — an opener, not a case history.
- URL-encode with Hugo's `urlquery` in the `wa.me/...?text=` construction. Test with
  accented characters and `¿` — those are exactly what breaks.
- Render as a labelled set of buttons/links under a heading in the doctor's voice
  (e.g. "¿Sobre qué querés consultar?"). Reuse `.btn-contact` styling. Every option must
  be a real `<a href>` so it works without JS and is keyboard-navigable — **no JS-only
  composer**.
- Optional enhancement, only if it stays JS-free-degradable: a small textarea letting the
  visitor edit the message before it opens. Progressive enhancement only.
- Carry the `data-cta` convention from W2 so W15 can track which motive was chosen —
  **but read the privacy note in W15 before deciding what to send.**
- Update the existing contact-block WhatsApp button (`index.html:113`) to use the shared
  partial from W2 rather than its own hardcoded URL.

**Depends on W2** (the shared partial) and **W12a** (message voice).

### Start command

```bash
claude "Read TODO.md and implement work items W3 and W1 together: delete the dead 'Agendamiento en línea / Próximamente' box in layouts/index.html and replace it with a WhatsApp message composer driven by a new data/motivos.yaml. Follow the instructions in that item, including the no-JS-required constraint and urlquery encoding. Confirm W2 and W12a have been applied first. When finished, mark W3 and W1 done in TODO.md per the Completion protocol."
```

---

## W14 — Keep the map, remove the third-party call on page load

### Context

The map stays — it draws attention and that is worth keeping. But in its current form
(`layouts/index.html:99-107`) it is a Google-hosted iframe that fires on every page load.
That means Google receives a record of every visitor to a psychiatry site *before the
visitor has clicked anything*, and it is by a wide margin the heaviest thing on the page.
It is also currently the only third-party request the site makes.

There is a standard fix that keeps the map fully functional: a click-to-load facade.

Note also that `index.html:102` renders the iframe title as
`"Mapa de ubicación: , Edificio Las Palmas Golf View"` because `clinic` is empty — W4
deliberately left this line for this item.

### Instructions

- Replace the eager iframe with a facade: a static, self-hosted map image (or a styled
  placeholder block in the site palette) carrying a clear affordance — "Ver mapa" — that
  swaps in the real iframe on click. Once clicked, behaviour is exactly as today.
- If you use a static image, generate it once and commit it to `static/images/`. Do
  **not** hotlink a Google Static Maps URL — that reintroduces the same request on load
  and would need an API key.
- The facade must be keyboard-accessible: a real `<button>` with an accessible name, not
  a `<div>` with a click handler.
- No-JS fallback: render the existing "Ver en Google Maps" link (`index.html:109-112`) as
  the fallback path so the location is always reachable.
- Fix the iframe `title` attribute — remove the `{{ $contact.clinic }}` interpolation and
  its leading comma. Something like
  `"Mapa de ubicación: {{ $contact.building }}, {{ $contact.city }}"`.
- Keep `loading="lazy"` and `referrerpolicy="no-referrer-when-downgrade"` on the iframe
  once it is injected. Keep the existing `.map-embed` sizing (`main.css:315-327`).
- Sanity-check against `vercel.json` — the CSP-adjacent headers there (`X-Frame-Options`,
  `Permissions-Policy`) do not block this, but confirm nothing regresses.

**Depends on W4** (owns the surrounding contact-section markup state) and touches the same
region as W3/W1 — run after them.

### Start command

```bash
claude "Read TODO.md and implement work item W14: convert the Google Maps iframe in layouts/index.html to a click-to-load facade so no third-party request fires on page load, and fix the broken iframe title attribute left over from W4. Follow the instructions in that item, including the keyboard-accessible button and no-JS fallback. Confirm W4, W3 and W1 have been applied first. When finished, mark W14 done in TODO.md per the Completion protocol."
```

---

## W15 — Google Analytics 4 and WhatsApp conversion tracking

### Context

The site has no analytics of any kind, so there is currently no way to tell whether any of
the work above changed anything.

**Note on the ID:** `G-DPX00H2N9R` is a **GA4 Measurement ID**, not a Google Tag Manager
container ID (those look like `GTM-XXXXXXX`). So this is a direct `gtag.js` install, not a
GTM container. If a GTM container was also created and is wanted as the delivery layer,
that is a different snippet and needs the `GTM-` ID — confirm before assuming.

### Privacy consideration — needs a decision

W1 produces a set of motives: autismo, TDAH, consumo, ansiedad, ánimo bajo. Tracking
*which* one a visitor clicked is genuinely useful — it tells the doctor what the demand
actually is. But that event, joined to GA4's client ID, is a record that a specific device
expressed interest in a specific mental-health concern. Google's own policy prohibits
sending health data that can be associated with an individual, and beyond policy it is
simply not a nice thing to hold on a psychiatry site.

Recommended default: **track the count and placement of WhatsApp clicks (hero / mid /
sticky / contact), and track that a motive was selected, but do not send which motive.**
If per-motive breakdown is wanted, get an explicit decision on it first rather than
shipping it by default.

### Instructions

- Add the `gtag.js` snippet for `G-DPX00H2N9R` via a new partial
  (`layouts/partials/analytics.html`), included from `layouts/partials/head.html`.
- Put the ID in `hugo.toml` under `[params]` (e.g. `googleAnalytics = "G-DPX00H2N9R"`) and
  guard the partial on its presence, so local/dev builds without it stay clean. Hugo has a
  built-in `google_analytics` template — evaluate it before hand-rolling; the built-in
  respects `[privacy.googleAnalytics]` config, which is worth using here.
- Enable Hugo's privacy config: `[privacy.googleAnalytics] respectDoNotTrack = true`.
- Bind conversion events to the `data-cta` attributes established in W2/W1. Fire a
  `generate_lead` or custom `whatsapp_click` event carrying the **placement**, per the
  privacy note above.
- Do not block rendering: `async`, and no analytics code in the critical path.
- Verify in GA4 Realtime that events arrive, and confirm nothing appears in the console.
- Add a short privacy line in the footer stating that anonymous usage statistics are
  collected. A full privacy policy is out of scope for this round, but the site should not
  be silent about it.

**Run LAST of the code items** — it instruments the CTAs that W2 and W1 create.

### Start command

```bash
claude "Read TODO.md and implement work item W15: install GA4 (Measurement ID G-DPX00H2N9R) via a guarded Hugo partial with respectDoNotTrack, and bind WhatsApp conversion events to the data-cta attributes from W2/W1. Follow the instructions in that item — in particular, read the privacy consideration and do NOT send which consultation motive was selected without an explicit decision. Confirm W2 and W1 have been applied first. When finished, mark W15 done in TODO.md per the Completion protocol."
```

---

## W12b — Voice and tone sweep across all copy

**Run LAST.** It edits the final text of everything the other items produce.

### Context

W12a writes the guide. This item applies it. Running it earlier means re-running it, since
W1, W2, W5 and W14 all introduce new user-facing copy.

### Instructions

Sweep every piece of user-facing text against `CLAUDE.md`:

- `content/_index.md`
- `data/services.yaml`, `data/credentials.yaml`, `data/motivos.yaml` (new, from W1)
- `layouts/index.html` — all inline strings including headings and `aria-label`s
- `layouts/partials/header.html`, `footer.html`
- `hugo.toml` — `title`, `description`, `[params.hero]`, `[params.contact]` labels

Known specific fixes:

- `layouts/index.html:82` — "No tienes que hacerlo solo" → voseo ("No tenés que hacerlo
  solo"). Also reconsider "solo": the site's own thesis is that the family is part of the
  process.
- `data/services.yaml` — check every second-person verb form for voseo.
- All new W1 motive messages and W2 CTA labels.

Also check that alt text, `aria-label`s and the iframe title read as written language, not
as slugs — they are read aloud, and they are part of the voice too.

Do not change meaning or invent claims. This is a register and consistency pass, not a
rewrite. Anything that turns out to be an unverified factual claim gets marked `COMPLETAR`,
not smoothed over.

### Start command

```bash
claude "Read TODO.md and implement work item W12b: sweep all user-facing copy across content/, data/, layouts/ and hugo.toml for consistent voseo, voice and tone per CLAUDE.md. Follow the instructions in that item. This is a register pass, not a rewrite — do not change meaning or invent claims. When finished, mark W12b done in TODO.md per the Completion protocol."
```

---

# Execution plan — what runs in parallel, what must run serially

## The constraint

This is an eight-file site. Five of the twelve items want `layouts/index.html`, five want
`assets/css/main.css`, three want `assets/js/main.js`. **File contention, not logical
dependency, is what actually limits parallelism here.** Running two agents on
`index.html` simultaneously produces merge conflicts on a 148-line file — the coordination
cost exceeds the time saved.

### Contention map

| File | Items that write to it |
| --- | --- |
| `layouts/index.html` | W4, W5, W2, W3+W1, W14, W12b |
| `assets/css/main.css` | W9, W8, W5, W2, W3+W1, W14 |
| `assets/js/main.js` | W8, W14, W15 |
| `layouts/partials/schema.html` | W4, W6 |
| `layouts/partials/head.html` | W9, W15 |
| `hugo.toml` | W4, W5, W6, W15, W12b |
| `layouts/robots.txt` | W7 only |

## Waves

### Wave 0 — serial, alone

**W12a** (voice guide → `CLAUDE.md`).

New file, zero contention. Runs alone not because it conflicts but because everything
downstream that writes copy should read it first. Fast — 15 minutes of work.

### Wave 1 — three lanes, genuinely parallel

Disjoint file sets. Safe to run as three concurrent agents.

| Lane | Items | Files touched |
| --- | --- | --- |
| **A** | W7 → W9 | `layouts/robots.txt`; then `static/*`, `head.html`, `main.css` |
| **B** | W4 → W6 | `hugo.toml`, `schema.html`, small `index.html` address block |
| **C** | W8 | `main.js`, `main.css` |

Within lanes B and A, the items are **serial** — W6 rewrites the file W4 edits, and both
of A's items are trivially short anyway.

Lane A (W9) and Lane C (W8) both touch `main.css`, but in unrelated regions: W9 adds no
CSS at all in practice, W8 touches the reveal/transition rules. Low conflict risk. If you
want zero risk, run Lane A's W9 in Wave 2 instead — it costs nothing to defer.

Lane B's W4 touches a few lines of `index.html`, which Wave 2 rewrites heavily. This is
why W4's instructions explicitly hand the iframe `title` line to W14 — it keeps W4 out of
the region Wave 2 restructures.

### Wave 2 — strictly serial, single lane

All of these rewrite `layouts/index.html` and add to `main.css`. **Do not parallelise.**

```
W5  (hero H1 + portrait)
 ↓   sets the hero markup
W2  (WhatsApp primary CTA, partial, sticky bar)
 ↓   creates the shared partial + data-cta attributes
W3 + W1  (dead box out, composer in)   ← one session, not two
```

The dependency here is real, not just file-level: W2's partial is what W1 reuses, and
W2's `data-cta` convention is what W15 hooks into.

*Possible but not recommended:* W5+W2 (hero) and W3+W1 (contact section) touch distant
regions of `index.html` and could run in git worktrees. Skip it — W1 needs the partial W2
creates, so you would serialise on the logic anyway.

### Wave 3 — serial

```
W14  (map facade)   — needs the contact section settled by W3+W1
 ↓
W15  (GA4)          — instruments the CTAs from W2 and W1; also touches main.js after W14
```

W14 and W15 both write `main.js`. Serial.

### Wave 4 — serial, last

**W12b** (copy sweep) — by definition operates on the final text of everything above.

Then a verification pass: `hugo --gc --minify`, schema validation, a JS-disabled load, a
reduced-motion load, and a mobile-width check of the sticky bar against the footer.

## Critical path

```
W12a → [W5 → W2 → W3+W1] → W14 → W15 → W12b
```

Wave 1's three lanes (W7, W9, W4→W6, W8) all fall **off** the critical path — they can run
concurrently alongside the start of Wave 2 if you have the agents to spare, with the single
caveat that Lane B's W4 should land before W5 begins to avoid touching `index.html` twice.

Realistically: Wave 1 is a few hours of small, low-risk changes. Wave 2 is the substantive
work and the part worth reviewing carefully. Waves 3–4 are short.
