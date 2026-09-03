if (!customElements.get('maison-engraving')) {
  class MaisonEngraving extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('[data-engraving-input]');
      this.display = this.querySelector('[data-engraving-display]');
      this.count = this.querySelector('[data-engraving-count]');
      this.max = Number(this.input?.getAttribute('maxlength') || 12);
      this.fontButtons = this.querySelectorAll('[data-engraving-font]');

      this.input?.addEventListener('input', () => this.updatePreview());
      this.fontButtons.forEach((btn) => {
        btn.addEventListener('click', () => this.setFont(btn));
      });

      this.updatePreview();
      this.initReveals();
    }

    updatePreview() {
      if (!this.input || !this.display) return;
      const val = this.input.value.toUpperCase();
      this.display.textContent = val || 'INSCRIPTION';
      if (this.count) this.count.textContent = val.length;
    }

    setFont(btn) {
      const font = btn.getAttribute('data-engraving-font');
      this.fontButtons.forEach((el) => el.classList.toggle('is-active', el === btn));
      this.display?.classList.toggle('is-editorial', font === 'editorial');
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

  customElements.define('maison-engraving', MaisonEngraving);
}
