class MaisonLaboratory extends HTMLElement {
  connectedCallback() {
    this.slider = this.querySelector('[data-lab-slider]');
    this.cards = Array.from(this.querySelectorAll('[data-lab-card]'));
    this.markers = Array.from(this.querySelectorAll('[data-lab-marker]'));
    this.nameEl = this.querySelector('[data-lab-phase-name]');
    this.subEl = this.querySelector('[data-lab-phase-sub]');
    this.timeEl = this.querySelector('[data-lab-phase-time]');

    this.slider?.addEventListener('input', () => this.go(Number(this.slider.value)));
    this.markers.forEach((marker) => {
      marker.addEventListener('click', () => {
        const index = Number(marker.dataset.labIndex || 0);
        if (this.slider) this.slider.value = String(index);
        this.go(index);
      });
    });

    this.initReveals();
    this.go(0);
  }

  go(index) {
    if (!this.cards.length) return;
    const safeIndex = Math.max(0, Math.min(index, this.cards.length - 1));
    const active = this.cards[safeIndex];

    this.cards.forEach((card, i) => card.classList.toggle('is-active', i === safeIndex));
    this.markers.forEach((marker, i) => marker.classList.toggle('is-active', i === safeIndex));

    if (this.nameEl) this.nameEl.textContent = active.dataset.headline || '';
    if (this.subEl) this.subEl.textContent = active.dataset.subheadline || '';
    if (this.timeEl) this.timeEl.textContent = active.dataset.time || '';
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

if (!customElements.get('maison-laboratory')) {
  customElements.define('maison-laboratory', MaisonLaboratory);
}
