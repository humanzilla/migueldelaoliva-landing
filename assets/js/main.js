document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

const hero = document.querySelector('.hero');
if (hero) {
  hero.style.opacity = '1';
  hero.style.transform = 'translateY(0)';
}

// Map facade — click to load.
//
// The Google Maps iframe ships inside a <template>, which the browser parses
// into an inert fragment and never fetches. So no third-party request leaves
// the page until someone asks for the map. This is the only third-party call
// the site makes, and on a psychiatry site it should not fire on arrival.
//
// The facade itself is hidden in the markup and only unhidden here, because a
// button that loads a map is useless without JS. In that case the block stays
// collapsed and the "Ver en Google Maps" link below it carries the location.

(() => {
  const facade = document.querySelector('[data-map-facade]');
  if (!facade) return;

  const button = facade.querySelector('button');
  const template = facade.querySelector('template');
  if (!button || !template || !('content' in template)) return;

  facade.hidden = false;

  button.addEventListener('click', () => {
    const fragment = template.content.cloneNode(true);
    const iframe = fragment.querySelector('iframe');
    if (!iframe) return;

    facade.textContent = '';
    facade.appendChild(fragment);

    // The button that had focus is gone; move focus into the map rather than
    // dropping it on <body> and losing a keyboard visitor's place.
    iframe.focus();
  }, { once: true });
})();

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
