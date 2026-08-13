// Scroll reveal — progressive enhancement only.
//
// The hidden state lives in main.css and applies only under the `js-reveal`
// class, which the inline script in head.html puts on <html> when JavaScript is
// running, IntersectionObserver exists and the visitor has not asked for reduced
// motion. If that class is absent — no JS, reduced motion, or the head failsafe
// already fired because this file was slow to arrive — every section is already
// visible and there is nothing to do here.
//
// Smooth scrolling is CSS (`scroll-behavior`), not JS, so anchor links keep the
// URL hash and the back button working.

(() => {
  const root = document.documentElement;
  if (!root.classList.contains('js-reveal')) return;

  // Tells the head failsafe that the reveal is under control.
  root.classList.add('reveal-ready');

  const sections = document.querySelectorAll('main > section:not(.hero)');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

  sections.forEach(section => observer.observe(section));
})();

// Sticky WhatsApp bar — appears once the hero CTA has scrolled away.
//
// Its own IIFE on purpose. The reveal above returns early whenever `js-reveal`
// is absent — no JS, reduced motion, slow load — and anything nested inside it
// would silently stop running for exactly the visitors who still need the bar.
//
// The hidden state is CSS gated on `js-sticky`, which head.html adds and takes
// back if this file never arrives. `sticky-ready` is what tells it the observer
// is up; it goes on only after the two elements are found, so a page without
// them ends up with the always-visible bar rather than a hidden one.

(() => {
  const root = document.documentElement;
  if (!root.classList.contains('js-sticky')) return;

  const bar = document.querySelector('.sticky-cta');
  const heroActions = document.querySelector('.hero-actions');
  if (!bar || !heroActions) return;

  root.classList.add('sticky-ready');

  // Observing .hero-actions, not the button: the secondary "Ver dirección y
  // horarios" link sits in the same row and the bar covered that too.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      bar.classList.toggle('is-visible', !entry.isIntersecting);
    });
  });

  observer.observe(heroActions);
})();

// Alpine components.
//
// Alpine is loaded from assets/js/vendor/, not from a CDN: a third-party
// request on page load is exactly what W14 removed, and it should not come
// back through the front door. It is deferred and only on the home page.
//
// Registration happens on `alpine:init` rather than at parse time — this file
// and Alpine are both deferred, so this runs first and the components are
// waiting when Alpine boots.
//
// Everything here is progressive enhancement. The markup arrives usable: the
// composer ships server-rendered WhatsApp links, and the map block ships
// hidden with its location reachable through "Ver en Google Maps". Alpine
// upgrades both. If it never loads, nothing breaks — see composer.html.

document.addEventListener('alpine:init', () => {
  // --- Redactor del primer mensaje -----------------------------------------
  //
  // No a single Spanish string in here. Every phrase — the greeting, the
  // clauses, the labels — comes from data/motivos.yaml through the JSON block
  // the partial renders, so the server-rendered fallback and this composer can
  // never drift apart. This file only decides the ORDER the pieces go in.
  window.Alpine.data('composer', () => ({
    motivos: [],
    personas: [],
    plantilla: {},
    base: '',
    motivo: '',
    persona: '',
    nombre: '',
    // Focus moves to a step the first time it appears, and only then: a
    // visitor who changes their mind about step 1 should not be thrown
    // forward again.
    vistos: {},

    init() {
      const config = this.$el.querySelector('[data-composer-config]');
      if (!config) return;

      try {
        Object.assign(this, JSON.parse(config.textContent));
      } catch (e) {
        // Leave the server-rendered links in place rather than swapping a
        // working list for a composer with no phrases in it.
        return;
      }

      this.$refs.fallback.hidden = true;
      this.$refs.steps.hidden = false;
    },

    elegirMotivo(id) {
      this.motivo = id;
      this.enfocar('paso2');
    },

    elegirPersona(id) {
      this.persona = id;
      this.enfocar('paso3');
    },

    enfocar(ref) {
      if (this.vistos[ref]) return;
      this.vistos[ref] = true;
      this.$nextTick(() => this.$refs[ref] && this.$refs[ref].focus());
    },

    frase(lista, id) {
      const item = lista.find(x => x.id === id);
      return item ? item.frase : '';
    },

    get mensaje() {
      const t = this.plantilla;
      const nombre = this.nombre.trim();

      // The preview only renders once a motive is chosen, so this is a guard,
      // not an empty state.
      if (!this.motivo) return '';

      const partes = [
        nombre ? t.conNombre.replace('{nombre}', nombre) : t.sinNombre,
        t.motivo.replace('{motivo}', this.frase(this.motivos, this.motivo)),
      ];

      if (this.persona) {
        partes.push(t.persona.replace('{persona}', this.frase(this.personas, this.persona)));
      }

      partes.push(t.cierre);
      return partes.join(' ');
    },

    get href() {
      return this.base + encodeURIComponent(this.mensaje);
    },
  }));
});

// --- Map facade — click to load ---------------------------------------------
//
// Was a hand-rolled IIFE cloning a <template>; it is now `<template x-if>` in
// index.html, which is the same idea expressed in Alpine. What has not changed
// is the property that matters: the iframe lives inside a <template>, the
// parser treats it as an inert fragment, and Google is not contacted until
// somebody presses the button.
//
// The block itself ships `hidden` and Alpine unhides it, because a button that
// loads a map is useless without JS. In that case it stays collapsed and the
// "Ver en Google Maps" link below carries the location.

// WhatsApp conversion tracking.
//
// One delegated listener on <document>, not per-CTA wiring: every wa.me link
// counts, including ones that do not exist yet. W2's whatsapp-cta.html partial
// stamps data-cta on each of them, and W1's motive links will come through the
// same partial — so neither item has any analytics work to do.
//
// PRIVACY — this is a rule, not a preference. What gets sent is WHERE the button
// was tapped. What never gets sent is what the visitor wanted to consult about.
// A motive (autismo, TDAH, consumo…) joined to a GA4 client ID is a health-data
// record; Google's own policy forbids it and it has no business on this site.
//
// The PLACEMENTS allowlist is what enforces that, and it is the reason this is a
// list rather than a passthrough: if a future data-cta ever carries a motive —
// data-cta="motivo-autismo" — it collapses to 'other' instead of shipping a
// health fact to Google. Markup alone cannot leak. Widen this list deliberately
// or not at all. See W15 in TODO.md and prohibition 6 in CLAUDE.md.

(() => {
  const PLACEMENTS = ['hero', 'mid', 'sticky', 'contact', 'motivo'];

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href*="wa.me/"]');
    if (!link) return;

    // gtag is absent when the visitor asked for Do Not Track, when a blocker
    // stopped the load, or when no measurement ID is configured. Nothing to do.
    if (typeof window.gtag !== 'function') return;

    // No transport_type: 'beacon' needed — every WhatsApp link is target="_blank",
    // so the page is not unloaded and the hit has time to leave.
    const cta = link.dataset.cta;
    window.gtag('event', 'whatsapp_click', {
      placement: PLACEMENTS.includes(cta) ? cta : 'other',
    });
  });
})();
