class MaisonHero extends HTMLElement {
  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll('[data-maison-slide]'));
    this.dots = Array.from(this.querySelectorAll('[data-maison-hero-dot]'));
    this.index = this.slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (this.index < 0) this.index = 0;
    this.isAnimating = false;

    this.querySelector('[data-maison-hero-prev]')?.addEventListener('click', () => this.go(this.index - 1, 'prev'));
    this.querySelector('[data-maison-hero-next]')?.addEventListener('click', () => this.go(this.index + 1, 'next'));
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.go(i, i > this.index ? 'next' : 'prev')));

    this.initReveals();
    this.bindTilt();
  }

  initReveals() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = this.querySelectorAll('.mv-reveal');
    if (reduce || !('IntersectionObserver' in window)) {
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

  go(next, direction = 'next') {
    if (!this.slides.length || this.isAnimating) return;
    const len = this.slides.length;
    const target = ((next % len) + len) % len;
    if (target === this.index) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const current = this.slides[this.index];
    const incoming = this.slides[target];
    const fromX = direction === 'prev' ? '-48px' : '48px';
    const leaveX = direction === 'prev' ? '48px' : '-48px';

    this.isAnimating = true;
    this.index = target;

    if (reduce) {
      this.slides.forEach((slide, i) => {
        const active = i === this.index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.style.transform = '';
      });
      this.dots.forEach((dot, i) => dot.classList.toggle('is-active', i === this.index));
      this.isAnimating = false;
      this.bindTilt();
      return;
    }

    incoming.style.transition = 'none';
    incoming.style.transform = `translateX(${fromX})`;
    incoming.style.opacity = '0';
    incoming.style.visibility = 'visible';
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.style.transition = '';
        incoming.style.transform = 'translateX(0)';
        incoming.style.opacity = '1';

        current.classList.add('is-leaving');
        current.style.transform = `translateX(${leaveX})`;
        current.style.opacity = '0';

        window.setTimeout(() => {
          current.classList.remove('is-active', 'is-leaving');
          current.setAttribute('aria-hidden', 'true');
          current.style.transform = '';
          current.style.opacity = '';
          current.style.visibility = '';
          incoming.style.transform = '';
          incoming.style.opacity = '';
          incoming.style.visibility = '';
          this.isAnimating = false;
          this.bindTilt();
        }, 700);
      });
    });

    this.dots.forEach((dot, i) => dot.classList.toggle('is-active', i === this.index));
  }

  bindTilt() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const stage = this.slides[this.index]?.querySelector('[data-maison-hero-stage]');
    const media = this.slides[this.index]?.querySelector('[data-maison-hero-tilt]');
    if (!stage || !media || reduce || coarse) return;

    if (this._tiltCleanup) this._tiltCleanup();

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = y * -18;
      targetY = x * 22;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      media.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      raf = requestAnimationFrame(tick);
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    this._tiltCleanup = () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }
}

if (!customElements.get('maison-hero')) {
  customElements.define('maison-hero', MaisonHero);
}
