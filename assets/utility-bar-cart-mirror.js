(function () {
  const HEADER_CART_ID = 'cart-icon-bubble';

  function syncCount() {
    const source = document.getElementById(HEADER_CART_ID);
    const mirrors = document.querySelectorAll('[data-cart-count-mirror]');
    if (!source || !mirrors.length) return;

    const bubble = source.querySelector('.cart-count-bubble');
    mirrors.forEach((mirror) => {
      mirror.innerHTML = bubble ? bubble.outerHTML : '';
    });
  }

  function bindCartClicks() {
    document.querySelectorAll('[data-cart-icon-mirror]').forEach((mirror) => {
      if (mirror.dataset.mirrorBound === 'true') return;
      mirror.dataset.mirrorBound = 'true';
      mirror.addEventListener('click', (event) => {
        const headerCart = document.getElementById(HEADER_CART_ID);
        if (!headerCart) return;
        event.preventDefault();
        headerCart.click();
      });
    });
  }

  function init() {
    bindCartClicks();
    syncCount();

    const headerCart = document.getElementById(HEADER_CART_ID);
    if (headerCart && 'MutationObserver' in window) {
      new MutationObserver(syncCount).observe(headerCart, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
