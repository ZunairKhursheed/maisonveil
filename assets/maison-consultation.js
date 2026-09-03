if (!customElements.get('maison-consultation')) {
  class MaisonConsultation extends HTMLElement {
    connectedCallback() {
      this.answers = [];
      this.currentStep = 1;
      this.steps = this.querySelectorAll('[data-quiz-step]');
      this.progress = this.querySelectorAll('[data-quiz-progress]');
      this.resultEl = this.querySelector('[data-quiz-result]');
      this.results = this.parseResults();

      this.querySelectorAll('[data-quiz-choice]').forEach((btn) => {
        btn.addEventListener('click', () => this.selectAnswer(btn));
      });

      const resetBtn = this.querySelector('[data-quiz-reset]');
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

      this.initReveals();
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

    parseResults() {
      const el = this.querySelector('[data-quiz-results]');
      if (!el) return {};
      try {
        return JSON.parse(el.textContent);
      } catch (e) {
        return {};
      }
    }

    selectAnswer(btn) {
      const stepIndex = Number(btn.getAttribute('data-quiz-step-index'));
      const key = btn.getAttribute('data-quiz-choice');
      this.answers[stepIndex - 1] = key;

      btn.closest('.maison-consultation__options')
        ?.querySelectorAll('.maison-consultation__option')
        .forEach((el) => el.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      window.setTimeout(() => {
        if (stepIndex < this.steps.length) {
          this.showStep(stepIndex + 1);
        } else {
          this.showResult();
        }
      }, 280);
    }

    showStep(n) {
      this.currentStep = n;
      this.steps.forEach((step) => {
        const idx = Number(step.getAttribute('data-quiz-step'));
        step.classList.toggle('is-hidden', idx !== n);
      });
      this.progress.forEach((dot) => {
        const idx = Number(dot.getAttribute('data-quiz-progress'));
        dot.classList.toggle('is-done', idx <= n);
      });
      if (this.resultEl) this.resultEl.hidden = true;
    }

    showResult() {
      const tally = {};
      this.answers.forEach((key) => {
        if (!key) return;
        tally[key] = (tally[key] || 0) + 1;
      });

      let winner = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0] || 'noir';
      const data = this.results[winner] || Object.values(this.results)[0] || {
        title: 'Noir Veil',
        score: '98% Sensory Affinity Match',
        desc: 'Your temperament gravitates towards deep nocturnal intimacy.',
        url: '#',
      };

      this.steps.forEach((step) => step.classList.add('is-hidden'));
      this.progress.forEach((dot) => dot.classList.add('is-done'));

      if (this.resultEl) {
        this.resultEl.hidden = false;
        const score = this.resultEl.querySelector('[data-quiz-score]');
        const title = this.resultEl.querySelector('[data-quiz-title]');
        const desc = this.resultEl.querySelector('[data-quiz-desc]');
        const claim = this.resultEl.querySelector('[data-quiz-claim]');
        if (score) score.textContent = data.score || '';
        if (title) title.textContent = data.title || '';
        if (desc) desc.textContent = data.desc || '';

        this.resultEl.querySelectorAll('[data-quiz-card]').forEach((card) => {
          card.hidden = card.getAttribute('data-quiz-card') !== winner;
        });

        if (claim) {
          claim.href = data.url || '#';
          claim.style.display = data.url ? '' : 'none';

          if (data.hasProducts) {
            const visibleGroup = this.resultEl.querySelector(`[data-quiz-card="${winner}"]:not([hidden])`);
            const firstProductLink = visibleGroup?.querySelector('.maison-flacon-card__title a, .maison-flacon-card__btn--view');
            if (firstProductLink?.href) {
              claim.href = firstProductLink.href;
              claim.style.display = '';
            }
          }
        }
      }
    }

    reset() {
      this.answers = [];
      this.querySelectorAll('.maison-consultation__option').forEach((el) => {
        el.classList.remove('is-selected');
      });
      this.showStep(1);
      this.querySelectorAll('[data-quiz-card]').forEach((card) => {
        card.hidden = true;
      });
    }
  }

  customElements.define('maison-consultation', MaisonConsultation);
}
