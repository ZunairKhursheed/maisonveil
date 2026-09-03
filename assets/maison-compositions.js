class MaisonCompositions extends HTMLElement {
  connectedCallback() {
    this.filters = Array.from(this.querySelectorAll('[data-maison-filter]'));
    this.cards = Array.from(this.querySelectorAll('[data-maison-category]'));

    this.filters.forEach((btn) => {
      btn.addEventListener('click', () => this.applyFilter(btn.dataset.maisonFilter, btn));
    });

    this.initReveals();
  }

  applyFilter(filter, activeBtn) {
    const value = (filter || 'all').toLowerCase();

    this.filters.forEach((btn) => btn.classList.toggle('is-active', btn === activeBtn));

    this.cards.forEach((card) => {
      const category = (card.dataset.maisonCategory || 'all').toLowerCase();
      const show = value === 'all' || category === value || category.split(/\s+/).includes(value);
      card.classList.toggle('is-hidden', !show);
    });
  }

  initReveals() {
    const reveals = this.querySelectorAll('.mv-reveal');
    if (!reveals.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    reveals.forEach((el) => observer.observe(el));
  }
}

if (!customElements.get('maison-compositions')) {
  customElements.define('maison-compositions', MaisonCompositions);
}
