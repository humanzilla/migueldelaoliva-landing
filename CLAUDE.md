# CLAUDE.md — migueldelaoliva.com

Personal site of **Dr. Miguel Angel de la Oliva**, psiquiatra in Santa Cruz de la Sierra,
Bolivia. Hugo, single page. The entire proposition of the page is **trust**, so the copy
is the product. Read this before writing or editing any user-facing string.

`TODO.md` at the repo root is the source of truth for planned work and its order.

**JavaScript: Alpine.js, self-hosted, progressive enhancement only.** W17 introduced it
for the message composer; before that the site had no framework. Three rules come with it
and none is negotiable:

- **Self-hosted, never a CDN.** `assets/js/vendor/alpine.min.js` is committed and served
  from this domain. A third-party request on page load is what W14 removed, and a psychiatry
  site should not hand a visitor list to anyone before they click.
- **The page must be complete before Alpine runs.** Anything Alpine builds ships
  server-rendered first — real `<a href>`s, real content — and Alpine replaces it. If the
  script never arrives, what stays on screen has to be usable, not a hole. See
  `layouts/partials/composer.html`.
- **No Spanish inside the JavaScript.** Copy lives in `data/` and reaches Alpine as JSON,
  so the no-JS and the interactive paths cannot drift apart, and so W12b has one place to
  sweep.

---

## Design constraint

**The visual design is settled. Do not redesign it.** Changes in this round are
content, UX, accessibility and schema only. Reuse the existing palette, type scale and
class names in `assets/css/main.css` (478 lines, no custom properties — pull literal hex
values). New CSS only where a genuinely new component requires it, and it must look like
it was always there.

---

## Language — Spanish, es-BO, **usted**

The reader is addressed as **`usted`**, everywhere. This is the doctor's own decision,
taken 2026-08-12 after he read the site: *the tone is not proper for a doctor and feels
awkward.* It replaces the `voseo` rule the site was built on. Do not revert it as if it
were a dialect regression — it is not.

The old rule confused **dialect** with **register**. Voseo is genuinely what Santa Cruz
speaks — with people it already knows. A psychiatrist writing to someone who has not met
him, often a parent, often older than he is, uses `usted`. That is not imported or
neutral-Mexican Spanish; it is the correct distance for a **first introduction**, which
is exactly what this page is.

Half the site already agreed. The messages the *visitor* sends — every `frase` in
`data/motivos.yaml`, and `whatsapp.defaultMessage` in `hugo.toml` — have always used
`usted` toward the doctor. The page used to have the patient speaking formally upward
while the doctor spoke familiarly downward. That asymmetry was most of what felt wrong.

**Use `usted`. Never `vos`, never `tú`.**

| Never (vos / tú) | Always (usted) |
| --- | --- |
| tenés / tienes | tiene |
| podés / puedes | puede |
| querés / quieres | quiere |
| sos / eres | es |
| sabés / sabes | sabe |
| necesitás / necesitas | necesita |
| sentís / sientes | siente |
| tu, tus | su, sus |
| te (object) | le / lo / la |
| ti, contigo, tuyo | usted, con usted, suyo |
| escribime / escríbeme | escríbame |
| contame / cuéntame | cuénteme |
| si querés / si quieres | si quiere |
| cuando estés listo | cuando esté listo |
| no te preocupes | no se preocupe |

The plural is **`ustedes`** — the only plural this site has.

**Formal is not cold.** Warmth lives in vocabulary and sentence shape, not in
grammatical person. *"No hace falta que tenga las palabras exactas"* is exactly as warm
as the `vos` version was. Nothing in **Register** below is loosened by this change:
short sentences, no clinical distance, `persona` not `paciente`, no urgency. If a line
lands stiff after conversion, rewrite the line — do not reach back for `vos`.

**Prefer no imperative at all.** Infinitive (`escribir cuando quiera`), first person
plural (`coordinamos una cita`) and impersonal (`no se envía nada hasta que toque
enviar`) all sidestep the question, and usually read warmer than a command.

### The one exception — interface instructions

The split is by **who is speaking**:

- **The doctor addressing the reader → `usted`,** his imperatives included:
  `Escríbame por WhatsApp`; `Si algo de esto le suena, escríbame`.
- **The interface instructing the user → light imperative, `tú` form:**
  `Elige un par de cosas`; `Baja a «Su mensaje, ya escrito»`.

Also the doctor's call, and deliberate. `Elija` reads as a bureaucratic order on a
form; `Elige` reads as a button label. It is how software is written across Latin
America and it does not register as an error. It covers **only** instructions about
operating the page, never anything the doctor says. Exactly two strings on the site
qualify — `composer.html` and the `aria-label` in `whatsapp-cta.html`. Do not grow the
list, and do not "fix" those two into `usted`.

**Never Peninsular Spanish:** no `vosotros` / `os` / `vuestro`, no `coger`, no
`ordenador`, no `vale`, no `¡venga!`.

**Accents and punctuation are mandatory**, including opening `¿` and `¡`, and in `alt`,
`aria-label`, `title` and `<meta>` values. When any of these ends up inside a URL —
`wa.me/...?text=` in particular — encode it with Hugo's `urlquery` and test with `¿` and
accented characters, which are exactly what breaks.

---

## Person

- **The doctor: first person singular — unchanged by the move to `usted`.** His voice was
  never the problem; only the distance to the reader was. "Acompaño", "trabajo con",
  "involucro a la familia", "doy charlas". He speaks in his own voice throughout — the
  site is not written *about* him in the third person. Existing example,
  `content/_index.md`: *"Hoy vivo en Santa Cruz, donde acompaño a personas y familias en
  momentos difíciles."* That file holds no second-person forms at all, and did not change.
- **The reader: `usted`.** "Puede escribirme", "cuénteme qué le pasa".
- **First person plural for shared work** — "trabajamos juntos", "creamos un plan",
  "coordinamos una cita". This is the register of `data/services.yaml` and it carries the
  site's thesis: the process is shared, not administered. It is also the best escape hatch
  when an `usted` construction lands stiff.
- **Do not soften his headings into the plural.** "Así es como trabajo con usted" stays
  his; "Así es como trabajamos juntos" quietly changes whose voice it is. Fix stiffness
  inside a sentence, not by moving it out of his mouth.
- Third person only in schema, meta descriptions and the `<title>`, where a machine or a
  search result is the audience.

---

## Register

Warm, plain, anti-stigma, dignity-first. Short sentences. No clinical distance, no
marketing gloss, no urgency tactics, no exclamation marks.

| Avoid | Prefer |
| --- | --- |
| tratar, manejar, abordar (a la persona) | acompañar, escuchar, trabajar con |
| paciente (as a label) | persona, usted, su hijo, su hija, la familia |
| sufre de, padece de | vive con, tiene |
| caso | historia, situación |
| solución, resultados garantizados | proceso, camino, acompañamiento |
| tiene que, debe | puede, si quiere, cuando esté listo |

**The family is part of the process, not a bystander.** `data/services.yaml` already
says it: *"Sanar no es tarea de uno solo."* Copy that addresses a parent should address
them as a participant, not as an escort. Be careful with "solo" — the site's own thesis
argues against it.

The reader is often frightened, ashamed, or exhausted. Lower the cost of the first
message rather than raising the stakes of not sending it. No fear-based framing about
what happens if they wait.

---

## Neurodiversity-affirming language

Non-negotiable — this is the doctor's stated position and the reason people come to the
site.

- **Autism is not a disease, an illness, a disorder to defeat, or a tragedy.** It is a
  way of being. `data/services.yaml` states it: *"el autismo no es una frontera a
  cruzar, sino una forma distinta —y valiosa— de habitar el mundo."*
- **Never "cure", "curar", "revertir", "superar el autismo", "recuperarse del
  autismo"**, and never "niños que sufren de autismo".
- **Medication addresses co-occurring conditions** — ansiedad, sueño, TDAH,
  depresión — **never identity.** Never imply medication treats autism itself.
- **No puzzle-piece imagery or metaphors**, in copy, in SVG, in alt text, in favicons.
  Nothing about "missing pieces", "completar el rompecabezas", "encajar".
- **Identity-first or neutral phrasing**, matching how the doctor already writes:
  "persona autista", "persona neurodivergente", "el autismo", "neurodivergencias".
  Avoid "persona con autismo" where a neutral rewrite exists; never
  "afectado por el autismo".
- Terminology: **TEA** and **autismo** both fine, **TDAH** (never ADHD), **patología
  dual** for co-occurring addiction and mental health.
- **Addiction is an illness, not a moral failure** — `data/services.yaml`: *"La adicción
  no es falta de voluntad."* Never "adicto" as a noun-label, never "limpio", never
  "recaída" framed as failure. Use "consumo", "persona en recuperación".
- Neurodivergent readers are part of the audience in form as well as content: plain
  language, predictable structure, literal link text, no ambiguous idiom, and honour
  `prefers-reduced-motion` (see `TODO.md` W8).

---

## Hard prohibitions

Breaking any of these is a defect, not a style preference.

1. **Never invent facts.** No credentials, registration numbers (`matrícula`,
   `SEDES`, `Colegio Médico`), years of experience, fees, session lengths, cancellation
   policies, payment methods, insurance names, or crisis-line numbers. Anything not
   verified below or already committed in `hugo.toml` / `data/` **stays marked
   `COMPLETAR`** — visible in the source, never smoothed over with a plausible-sounding
   value.
2. **No patient testimonials, reviews, ratings or before/after stories.** Restricted in
   medical advertising across most of Latin America, and a confidentiality problem
   regardless. No `aggregateRating` or `review` in JSON-LD.
3. **No online, video or telephone consultations.** The practice is **in-person only**
   (`modality = "Consulta presencial"`). Never write, imply or schema-tag remote care.
   WhatsApp is for coordinating an appointment — not for consulting.
4. **No clinic, employer or institutional affiliation.** He is an independent
   psychiatrist and wants the site to say so permanently. Never reintroduce a clinic
   entity, `worksFor`, or a `MedicalClinic` node; he *is* the practice.
5. **No diagnosis, no clinical advice, no medication guidance** in site copy, and never
   language that presumes the reader's diagnosis. Consultation-reason copy must read as
   an opener, not a case history: *"escribo porque me gustaría consultar sobre un posible
   diagnóstico de autismo en mí"* — not *"tengo autismo"*.
6. **No health data in analytics.** Track that a WhatsApp CTA was clicked and where
   (hero / mid / sticky / contact); do **not** send which consultation motive was
   selected. See `TODO.md` W15.
7. **No urgency, scarcity, guarantees, or superlatives** — no "el mejor", "líder",
   "resultados garantizados", "cupos limitados".

---

## Verified facts

`hugo.toml` is the **single source of truth**. Read these from
`site.Params.contact` in templates; never hardcode them in markup. The values below are
for review — if they disagree with `hugo.toml`, `hugo.toml` wins.

| Fact | Value | Key |
| --- | --- | --- |
| Nombre | Dr. Miguel Angel de la Oliva | `params.author` |
| Nombre corto | Dr. Miguel de la Oliva | `params.hero.name` |
| Práctica | Psiquiatra independiente — sin afiliación a clínica | — |
| Edificio | Edificio Las Palmas Golf View | `contact.building` |
| Dirección | Avenida Ibérica y Calle 2 | `contact.addressLine` |
| Unidad | Piso 2, Apartamento 20 | `contact.unit` |
| Ciudad | Santa Cruz de la Sierra, Santa Cruz, Bolivia (BO) | `contact.city` / `.region` / `.country` |
| Coordenadas | -17.8035547, -63.2099454 | `contact.latitude` / `.longitude` |
| Mapa | https://maps.app.goo.gl/rxsUtVZS3LtbASoN6 | `contact.mapUrl` |
| Horario | Lunes a Sábados: 15:00 - 18:00 | `contact.hours` |
| WhatsApp / teléfono | +591 6000 5594 (E.164 `+59160005594`) | `contact.phone` / `.phoneE164` |
| Modalidad | Consulta presencial | `contact.modality` |
| Especialidades | Autismo • Adicciones • Salud Mental General | `contact.specialties` |

**Social profiles** — four verified accounts, in `data/social.yaml`. These are the only
ones; do not add others.

| Red | URL |
| --- | --- |
| Instagram | https://www.instagram.com/drdelaolivapsiquiatra/ |
| TikTok | https://www.tiktok.com/@drdelaolivapsiquiatra |
| Facebook | https://www.facebook.com/drmiguel.delaolivapsiquiatra |
| YouTube | https://www.youtube.com/@miguelpsiq |

**Credentials** — only what is in `data/credentials.yaml` (máster en TEA, especialista en
adicciones, experiencia clínica). Do not add, upgrade or embellish. Any new credential
needs the doctor.

### Not verified — mark `COMPLETAR`, do not fill in

Honorarios · duración de la consulta · métodos de pago · número de registro profesional ·
convenios y seguros (`contact.insurance = "Consulta por convenios disponibles"` is vague
and deferred — do not build copy on it) · líneas de crisis en Bolivia · FAQ content.
These are blocked on the doctor, not on effort.

`contact.clinic` was a leftover from a former arrangement, **not** a placeholder awaiting a
value. W4 removed it from `hugo.toml` on 2026-08-12. Do not reintroduce the key.

---

## Micro-copy

Alt text, `aria-label`s, iframe `title`s, `<meta>` descriptions and button labels are
part of the voice. They are read aloud by screen readers — write them as sentences, not
as slugs or filenames.

- **Alt text describes the person and setting**, not the file: *"Dr. Miguel de la Oliva,
  psiquiatra, en su consultorio en Santa Cruz de la Sierra."* Never repeat a heading the
  image sits inside — the accessible name gets read twice.
- **Link and button labels say where they go and what happens**: "Escríbame por
  WhatsApp", "Ver en Google Maps". Never "clic aquí", "más", "leer más".
- **Headings are sentences in his voice** — the existing ones set the register:
  "¿Quién soy y por qué hago esto?", "Así es como trabajo con usted", "Mi propósito es
  simple", "Trabajemos juntos".
- Capitalisation is Spanish sentence case, not English title case: "Información de
  consulta", not "Información De Consulta".
- Every WhatsApp link: `target="_blank"`, `rel="noopener noreferrer"`, and an
  `aria-label` that names the destination.

---

## Before shipping any copy change

- [ ] No `vos`/`tú` forms — `usted` throughout. No `tenés`/`podés`/`tienes`/`puedes`, no
      `te`/`tu`/`tus`/`contigo` aimed at the reader. The two interface imperatives
      (`Elige`, `Baja`) are the only exceptions and are already written.
- [ ] Accents, `¿` and `¡` present, including in `alt`, `aria-label` and `title`.
- [ ] Doctor in first person, reader in `usted`, shared work in first person plural.
- [ ] Nothing invented — every fact traces to `hugo.toml`, `data/`, or is `COMPLETAR`.
- [ ] No cure/disease framing for autism, no puzzle imagery, no moral framing of
      addiction.
- [ ] No testimonials, no remote-consultation claim, no clinic affiliation.
- [ ] Meaning unchanged unless the item explicitly asked for new copy.
- [ ] `hugo --gc --minify` builds clean.

---

## Browser testing — use the Playwright MCP

**Verify in the browser with the Playwright MCP (`mcp__playwright__*`). Do not use the
Chrome extension (`mcp__claude-in-chrome__*`) and do not drive `Google Chrome.app`
by hand from Bash.** Both were tried while implementing W8 and both cost real time: the
extension timed out on `tabs_context_mcp` with no recovery, and headless Chrome by
CLI cannot verify a scripting-disabled load at all — `--dump-dom` itself needs
scripting, so it returns an empty document.

Configured in `.mcp.json` at the repo root, project scope, so every session gets it:

```json
{ "command": "npx",
  "args": ["-y", "@playwright/mcp@latest", "--headless", "--isolated"] }
```

- `--headless` — verification runs must not steal window focus.
- `--isolated` — profile in memory, never on disk. **This matters here:** work on this
  repo runs as parallel sessions (see the wave plan in `TODO.md`), and a shared
  persistent profile is exactly what makes concurrent browser runs fight each other.
- Tested against `@playwright/mcp` 0.0.79. Chromium is already in
  `~/Library/Caches/ms-playwright` — no `playwright install` needed.
- **A new `.mcp.json` is only picked up when a session starts**, and project-scoped
  servers prompt for approval on first use. A session already running when the file
  changed will not see the tools.

### How to verify this site

Serve the **built** output, not `hugo server` — livereload holds a websocket open, which
keeps a headless page from ever settling:

```bash
hugo --gc --minify && python3 -m http.server 1399 --directory public
```

Then drive `http://localhost:1399/`. Useful checks, all of which this site actually
needs:

- **Accessibility tree over screenshots.** Playwright's snapshot is text, so it is the
  fastest way to confirm the things this project cares about — that an `aria-label` reads
  as a sentence, that a heading is not announced twice, that a button has an accessible
  name. Screenshot only when the question is genuinely visual.
- **Reduced motion**, non-negotiable per the neurodiversity section above: emulate
  `prefers-reduced-motion: reduce` and confirm content is fully visible and nothing
  transitions.
- **No JavaScript**: load with scripting disabled and confirm every section is visible.
  The reveal in `assets/js/main.js` is progressive enhancement and must degrade to
  visible — see W8's Outcome in `TODO.md`.
- **Third-party requests**: watch the network log and confirm nothing hits Google before
  a deliberate click (W14's map facade).

Record what was actually run in the item's Outcome block. If a check could not be run,
say so there and say what the claim rests on instead — do not imply a browser confirmed
something it never loaded.
