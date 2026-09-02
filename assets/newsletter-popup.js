class NewsletterPopup extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    if (!this.dialog) return;

    this.storageKey = this.dataset.storageKey;
    this.hideDays = Number(this.dataset.hideDays) || 3;
    this.isDesignMode = Boolean(window.Shopify?.designMode);

    this.querySelectorAll('[data-newsletter-popup-close]').forEach((button) => {
      button.addEventListener('click', () => this.close({ persist: !this.isDesignMode }));
    });

    this.dialog.addEventListener('cancel', (event) => {
      if (this.isDesignMode) {
        event.preventDefault();
        return;
      }

      this.#persistHide();
    });

    this.dialog.addEventListener('click', (event) => {
      if (event.target !== this.dialog || this.isDesignMode) return;
      this.close({ persist: true });
    });

    if (this.dataset.success === 'true' || this.querySelector('.newsletter-popup__message--success')) {
      this.#persistHide();
      this.open();
      return;
    }

    if (this.isDesignMode || !this.#isHidden()) {
      this.open();
    }
  }

  open() {
    if (!this.dialog || this.dialog.open) return;
    this.dialog.showModal();
  }

  close({ persist = true } = {}) {
    if (!this.dialog) return;
    if (persist) this.#persistHide();
    this.dialog.close();
  }

  #isHidden() {
    if (!this.storageKey) return false;

    try {
      const until = Number(localStorage.getItem(this.storageKey));
      return Boolean(until) && Date.now() < until;
    } catch {
      return false;
    }
  }

  #persistHide() {
    if (!this.storageKey || this.isDesignMode) return;

    try {
      const until = Date.now() + this.hideDays * 24 * 60 * 60 * 1000;
      localStorage.setItem(this.storageKey, String(until));
    } catch {
      // localStorage may be unavailable
    }
  }
}

if (!customElements.get('newsletter-popup')) {
  customElements.define('newsletter-popup', NewsletterPopup);
}
