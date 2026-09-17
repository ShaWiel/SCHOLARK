(() => {
  if (window.__SCHOLARK_V103_LANGUAGE_NEXT__) return;
  window.__SCHOLARK_V103_LANGUAGE_NEXT__ = true;

  const clean = v => String(v ?? '').replace(/\s+/g, ' ').trim();
  let observer = null;

  function nextPanel(root = document) {
    return [...root.querySelectorAll?.('.v93-section .v93-row > div') || []].find(el =>
      clean(el.querySelector('h3')?.textContent).toLowerCase() === 'next lesson'
    ) || null;
  }

  async function startNext(panel) {
    if (!panel || panel.dataset.v103Busy === '1') return;
    const next = clean(panel.querySelector('p')?.textContent) || 'Continue with the next practical lesson';
    const topic = document.querySelector('#v93-topic');
    const api = window.__SCHOLARK_V93_LANGUAGE__;
    if (!topic || !api?.buildLesson) return;

    panel.dataset.v103Busy = '1';
    const button = panel.querySelector('[data-v103-next]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Building next lesson…';
    }

    topic.value = next;
    topic.dispatchEvent(new Event('input', { bubbles: true }));
    try {
      await api.buildLesson();
    } finally {
      panel.dataset.v103Busy = '0';
      if (button?.isConnected) {
        button.disabled = false;
        button.textContent = 'Start next lesson';
      }
    }
  }

  function decorate(root = document) {
    const panel = nextPanel(root) || nextPanel(document);
    if (!panel || panel.dataset.v103Ready === '1') return;
    panel.dataset.v103Ready = '1';
    panel.classList.add('v103-next-card');
    panel.setAttribute('role', 'button');
    panel.setAttribute('tabindex', '0');
    panel.setAttribute('aria-label', 'Start next language lesson');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'v93-btn ghost v103-next-button';
    button.dataset.v103Next = '1';
    button.textContent = 'Start next lesson';
    panel.appendChild(button);

    panel.addEventListener('click', event => {
      if (event.target.closest('[data-v103-next]') || event.target === panel || event.target.closest('h3,p')) {
        event.preventDefault();
        startNext(panel);
      }
    });
    panel.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      startNext(panel);
    });
  }

  function watch() {
    if (!String(location.hash || '').toLowerCase().startsWith('#language')) return;
    decorate(document);
    if (observer) return;
    observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          decorate(node);
          if (node.querySelector?.('.v93-section')) decorate(document);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  const style = document.createElement('style');
  style.id = 'scholark-v103-language-next-style';
  style.textContent = `
    .v103-next-card{cursor:pointer;border-radius:16px;padding:12px;transition:background .15s ease,transform .15s ease,box-shadow .15s ease;outline:none}
    .v103-next-card:hover{background:#f6f4ff;transform:translateY(-1px)}
    .v103-next-card:focus-visible{box-shadow:0 0 0 3px rgba(109,93,252,.16)}
    .v103-next-button{margin-top:10px}
    .v103-next-button:disabled{cursor:wait;opacity:.6}
  `;
  document.head.appendChild(style);

  addEventListener('hashchange', () => setTimeout(watch, 30));
  addEventListener('pageshow', () => setTimeout(watch, 30));
  setTimeout(watch, 180);

  window.__SCHOLARK_V103_LANGUAGE_NEXT_API__ = { decorate: () => decorate(document) };
})();
