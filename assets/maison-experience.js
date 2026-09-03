if (!customElements.get('maison-experience')) {
  class MaisonExperience extends HTMLElement {
    connectedCallback() {
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

  customElements.define('maison-experience', MaisonExperience);
}
