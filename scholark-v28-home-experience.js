(() => {
  // V28 homepage retired. V29 is the only public SCHOLARK homepage.
  window.__SCHOLARK_V28_HOME__ = true;

  const cleanup = () => {
    document.getElementById('v28-home')?.remove();
    document.getElementById('v28-home-style')?.remove();
    document.querySelectorAll('[data-v28-old-home="1"]').forEach(el => {
      el.style.removeProperty('display');
      delete el.dataset.v28OldHome;
    });
  };

  cleanup();
  document.addEventListener('DOMContentLoaded', cleanup, { once: true });
})();