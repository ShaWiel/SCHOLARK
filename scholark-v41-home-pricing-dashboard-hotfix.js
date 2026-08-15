(() => {
  if (window.__SCHOLARK_V41_HOME_PRICING_DASHBOARD__) return;
  window.__SCHOLARK_V41_HOME_PRICING_DASHBOARD__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = el => (el?.textContent || '').replace(/\s+/g, ' ').trim();
  const hash = () => (location.hash || '').toLowerCase();
  const workspaceHash = () => /dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education/.test(hash());
  const publicHome = () => !workspaceHash() && !/pricing/.test(hash());

  const style = document.createElement('style');
  style.id = 'scholark-v41-home-hotfix-style';
  style.textContent = `
    #v40-home-pricing,#v37-home-pricing,#v39-home-pricing{display:none!important}
    #v41-dashboard-entry{position:fixed;top:18px;right:28px;z-index:2147483646;border:0;border-radius:14px;padding:11px 17px;background:#17191f;color:#fff;font:900 11px/1 Inter,system-ui;letter-spacing:.01em;box-shadow:0 12px 34px rgba(0,0,0,.20);cursor:pointer;display:none;align-items:center;gap:7px;transition:.2s ease}
    #v41-dashboard-entry:hover{transform:translateY(-2px);background:#25283a}
    #v41-dashboard-entry .mark{color:#c9ff6a;font-size:13px}
    body.v41-on-home #v41-dashboard-entry{display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    #v41-home-pricing{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;width:100%!important;max-width:1240px!important;margin:82px auto 72px!important;padding:0 28px!important;box-sizing:border-box!important;color:#17191f!important;overflow:visible!important}
    #v41-home-pricing .v41-head{text-align:center;max-width:790px;margin:0 auto 34px}
    #v41-home-pricing .v41-head small{font:900 10px/1 Inter,system-ui;letter-spacing:.14em;color:#6d5dfc}
    #v41-home-pricing .v41-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter,system-ui;margin:10px 0 14px;letter-spacing:-.05em;color:#17191f}
    #v41-home-pricing .v41-head p{font:600 14px/1.55 Inter,system-ui;color:#716d78}
    #v41-home-pricing .v41-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    #v41-home-pricing .v41-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column}
    #v41-home-pricing .v41-plan.plus{background:#17191f;color:#fff}
    #v41-home-pricing .v41-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a;box-shadow:0 28px 85px rgba(46,34,101,.24);transform:translateY(-10px)}
    #v41-home-pricing .v41-kicker{font:950 10px/1 Inter,system-ui;letter-spacing:.14em;color:#7d7887}
    #v41-home-pricing .plus .v41-kicker,#v41-home-pricing .pro .v41-kicker{color:#c9ff6a}
    #v41-home-pricing h3{font:950 30px/1 Inter,system-ui;margin:13px 0 8px}
    #v41-home-pricing .v41-desc{font:600 12px/1.5 Inter,system-ui;opacity:.72;min-height:38px}
    #v41-home-pricing .v41-price{font:950 52px/1 Inter,system-ui;margin:24px 0 20px}
    #v41-home-pricing .v41-price small{font:700 11px Inter,system-ui;opacity:.62}
    #v41-home-pricing .v41-trial{font:800 10px/1.45 Inter,system-ui;margin:-8px 0 18px;color:#635e6c}
    #v41-home-pricing .plus .v41-trial,#v41-home-pricing .pro .v41-trial{color:#d7d3df}
    #v41-home-pricing ul{list-style:none;padding:0;margin:0 0 24px}
    #v41-home-pricing li{font:680 11.5px/1.45 Inter,system-ui;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}
    #v41-home-pricing li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}
    #v41-home-pricing .plus li:before,#v41-home-pricing .pro li:before{color:#c9ff6a}
    #v41-home-pricing button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter,system-ui;cursor:pointer;background:#ececf1;color:#17191f}
    #v41-home-pricing .plus button,#v41-home-pricing .pro button{background:#c9ff6a;color:#111}
    #v41-home-pricing .v41-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter,system-ui;letter-spacing:.06em}
    @media(max-width:900px){#v41-home-pricing{padding:0 16px!important}#v41-home-pricing .v41-grid{grid-template-columns:1fr}#v41-home-pricing .v41-plan.pro{transform:none}}
    @media(max-width:640px){#v41-dashboard-entry{top:12px;right:12px;padding:10px 13px;font-size:10px}}
  `;
  document.head.appendChild(style);

  function pricingMarkup() {
    return `
      <div class="v41-head">
        <small>SCHOLARK PLANS</small>
        <h2>Kies hoeveel voorsprong je wilt.</h2>
        <p>Begin gratis of probeer Plus en Pro 7 dagen gratis. Vergelijk alle plannen rechtstreeks op de SCHOLARK-homepage.</p>
      </div>
      <div class="v41-grid">
        <article class="v41-plan free">
          <div class="v41-kicker">FREE</div><h3>SCHOLARK Free</h3>
          <div class="v41-desc">Voor dagelijks leren, oefenen en plannen.</div>
          <div class="v41-price">$0 <small>/ month</small></div>
          <div class="v41-trial">Geen betaalmethode nodig.</div>
          <ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul>
          <button data-v41-plan="free">Start free</button>
        </article>
        <article class="v41-plan plus">
          <div class="v41-kicker">PLUS</div><h3>SCHOLARK Plus</h3>
          <div class="v41-desc">Voor creators die Studio AI regelmatig gebruiken.</div>
          <div class="v41-price">$14.99 <small>/ month</small></div>
          <div class="v41-trial">7 days free, then $14.99/month. Cancel anytime.</div>
          <ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul>
          <button data-v41-plan="plus">Start Plus free trial</button>
        </article>
        <article class="v41-plan pro">
          <span class="v41-most">MOST POPULAR</span>
          <div class="v41-kicker">PRO</div><h3>SCHOLARK Pro</h3>
          <div class="v41-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div>
          <div class="v41-price">$19.99 <small>/ month</small></div>
          <div class="v41-trial">7 days free, then $19.99/month. Cancel anytime.</div>
          <ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul>
          <button data-v41-plan="pro">Start Pro free trial</button>
        </article>
      </div>`;
  }

  function openDashboard() {
    document.body.classList.remove('v40-public-home', 'v31-public-home');
    const layer = $('#v29-home-layer');
    if (layer) {
      layer.hidden = true;
      layer.style.setProperty('display', 'none', 'important');
    }
    location.hash = 'dashboard';
    setTimeout(() => {
      const native = $$('button,a,[role="button"]')
        .filter(el => !el.closest('#v29-home-layer') && el.id !== 'v41-dashboard-entry')
        .find(el => /^(dashboard|open dashboard|dashboard openen)$/i.test(txt(el)));
      try { native?.click(); } catch {}
    }, 120);
  }

  function ensureDashboardButton() {
    let btn = $('#v41-dashboard-entry');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'v41-dashboard-entry';
      btn.type = 'button';
      btn.innerHTML = '<span class="mark">↗</span><span>Dashboard</span>';
      btn.addEventListener('click', openDashboard);
      document.body.appendChild(btn);
    } else if (btn.parentElement !== document.body) {
      document.body.appendChild(btn);
    }
    return btn;
  }

  function bindPlanButtons(section) {
    $$('[data-v41-plan]', section).forEach(btn => {
      if (btn.dataset.v41Bound) return;
      btn.dataset.v41Bound = '1';
      btn.addEventListener('click', () => {
        const plan = btn.dataset.v41Plan;
        localStorage.setItem('scholark_selected_plan', plan);
        location.hash = plan === 'free' ? 'dashboard' : 'pricing';
      });
    });
  }

  function ensurePricing() {
    if (!publicHome()) return;
    const layer = $('#v29-home-layer');
    if (!layer) return;
    const shell = $('.v29-shell', layer) || layer;
    shell.style.setProperty('overflow', 'visible', 'important');

    let section = $('#v41-home-pricing');
    if (!section) {
      section = document.createElement('section');
      section.id = 'v41-home-pricing';
      section.innerHTML = pricingMarkup();
    }

    if (section.parentElement !== shell) {
      const final = $('.v29-final,.v29-final-cta,[class*="final-cta"]', shell) ||
        [...shell.children].find(el => /volgende voorsprong|next advantage|beginnen|start vandaag|start today/i.test(txt(el)));
      if (final?.parentElement === shell) shell.insertBefore(section, final);
      else shell.appendChild(section);
    }

    section.hidden = false;
    section.style.setProperty('display', 'block', 'important');
    section.style.setProperty('visibility', 'visible', 'important');
    section.style.setProperty('opacity', '1', 'important');
    bindPlanButtons(section);
  }

  function sync() {
    ensureDashboardButton();
    const home = publicHome() && !!$('#v29-home-layer');
    document.body.classList.toggle('v41-on-home', home);
    if (home) {
      const layer = $('#v29-home-layer');
      if (layer) {
        layer.hidden = false;
        layer.style.setProperty('overflow', 'visible', 'important');
      }
      ensurePricing();
    }
  }

  document.addEventListener('click', e => {
    if (!publicHome()) return;
    const el = e.target.closest('a,button,[role="button"]');
    if (!el || !/^(prijzen|pricing|plans)$/i.test(txt(el))) return;
    e.preventDefault();
    e.stopPropagation();
    ensurePricing();
    $('#v41-home-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, true);

  addEventListener('hashchange', () => setTimeout(sync, 25));
  addEventListener('popstate', () => setTimeout(sync, 25));
  new MutationObserver(() => {
    clearTimeout(window.__scholarkV41Sync);
    window.__scholarkV41Sync = setTimeout(sync, 70);
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });

  setInterval(sync, 400);
  setTimeout(sync, 40);
})();