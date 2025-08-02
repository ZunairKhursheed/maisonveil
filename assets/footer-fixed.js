class FixedFooter {
  constructor() {
    this.footer = document.querySelector(".footer");
    this.body = document.body;
    this.resizeObserver = null;
    this.init();
  }

  init() {
    if (!this.footer) return;

    this.updateBodyMargin();
    this.setupResizeObserver();
    this.setupWindowResize();
  }

  updateBodyMargin() {
    if (!this.footer || !this.body) return;

    const footerHeight = this.footer.offsetHeight;
    this.body.style.marginBottom = `${footerHeight}px`;
  }

  setupResizeObserver() {
    if (!window.ResizeObserver) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.updateBodyMargin();
    });

    this.resizeObserver.observe(this.footer);
  }

  setupWindowResize() {
    window.addEventListener("resize", () => {
      this.updateBodyMargin();
    });
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener("resize", this.updateBodyMargin);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new FixedFooter();
});

// Also initialize for dynamic content (like Shopify's section rendering)
document.addEventListener("shopify:section:load", () => {
  new FixedFooter();
});
