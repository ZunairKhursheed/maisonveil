(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  const spotlight = document.getElementById('mvCursorSpotlight');
  if (!spotlight || reduce.matches || coarse.matches) return;

  const onMove = (e) => {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
    spotlight.classList.add('is-active');
  };

  window.addEventListener('pointermove', onMove, { passive: true });
})();
