(function () {
  function initMaisonCursor() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const spotlight =
      document.getElementById('cursorSpotlight') || document.getElementById('mvCursorSpotlight');
    if (!spotlight || reduce.matches) return;

    spotlight.style.opacity = '1';

    window.addEventListener(
      'pointermove',
      (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMaisonCursor);
  } else {
    initMaisonCursor();
  }
})();
