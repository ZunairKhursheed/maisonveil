class FixedFooter {
  constructor() {
    this.footer = document.querySelector(".footer");
    this.mainContent = this.findMainContent();
    this.resizeObserver = null;
    this.isDesktop = window.innerWidth >= 750;
    this.init();
  }

  init() {
    if (!this.footer) return;

    this.updateMainContentMargin();
    this.setupResizeObserver();
    this.setupWindowResize();
  }

  findMainContent() {
    // Try different selectors for main content
    return (
      document.querySelector("main") ||
      document.querySelector(".main-content") ||
      document.querySelector("#MainContent") ||
      document.querySelector(".page-width") ||
      document.body
    ); // fallback
  }

  updateMainContentMargin() {
    if (!this.footer || !this.mainContent) return;

    // Only apply margin on desktop (750px and above)
    if (window.innerWidth >= 750) {
      const footerHeight = this.footer.offsetHeight;
      this.mainContent.style.marginBottom = `${footerHeight}px`;
    } else {
      // Remove margin on mobile
      this.mainContent.style.marginBottom = "0";
    }
  }

  setupResizeObserver() {
    if (!window.ResizeObserver) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.updateMainContentMargin();
    });

    this.resizeObserver.observe(this.footer);
  }

  setupWindowResize() {
    window.addEventListener("resize", () => {
      const wasDesktop = this.isDesktop;
      this.isDesktop = window.innerWidth >= 750;

      // Only update if desktop state changed
      if (wasDesktop !== this.isDesktop) {
        this.updateMainContentMargin();
      } else {
        this.updateMainContentMargin();
      }
    });
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener("resize", this.updateMainContentMargin);
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
