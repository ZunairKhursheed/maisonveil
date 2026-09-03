if (!customElements.get('maison-acclaim')) {
  class MaisonAcclaim extends HTMLElement {
    connectedCallback() {
      this.quoteEl = this.querySelector('[data-acclaim-quote]');
      this.authorEl = this.querySelector('[data-acclaim-author]');
      this.logos = this.querySelectorAll('[data-acclaim-logo]');
      this.quotes = this.parseQuotes();

      this.logos.forEach((btn) => {
        btn.addEventListener('click', () => this.switchQuote(Number(btn.getAttribute('data-acclaim-index'))));
      });

      this.initReveals();
    }

    parseQuotes() {
      const el = this.querySelector('[data-acclaim-quotes]');
      if (!el) return [];
      try {
        return JSON.parse(el.textContent);
      } catch (e) {
        return [];
      }
    }

    switchQuote(index) {
      const quote = this.quotes[index];
      if (!quote) return;
      if (this.quoteEl) this.quoteEl.textContent = quote.quote || '';
      if (this.authorEl) this.authorEl.textContent = quote.author || '';
      this.logos.forEach((btn) => {
        const isActive = Number(btn.getAttribute('data-acclaim-index')) === index;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
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

  customElements.define('maison-acclaim', MaisonAcclaim);
}
