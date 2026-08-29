(() => {
  if (window.__SCHOLARK_V61_FREE_PROVIDER_MESSAGING__) return;
  window.__SCHOLARK_V61_FREE_PROVIDER_MESSAGING__ = true;
  const rewrite = () => {
    const msg = document.querySelector('#v59-generating .v59-message');
    if (msg && /OPENAI_API_KEY|real Studio AI engine is not connected/i.test(msg.textContent || '')) {
      msg.textContent = 'Studio AI needs a free-first provider key. Add POLLINATIONS_API_KEY in Render, save the environment variables and redeploy. OpenAI remains optional for later.';
    }
    const status = document.querySelector('#v41-status');
    if (status && /OPENAI_API_KEY|real Studio AI engine is not connected/i.test(status.textContent || '')) {
      status.textContent = 'Add POLLINATIONS_API_KEY in Render for free-first Studio AI generation. OpenAI is optional.';
    }
  };
  addEventListener('hashchange',()=>setTimeout(rewrite,120));
  document.addEventListener('click',e=>{if(e.target.closest?.('.v41-generate,.sv24-generate'))setTimeout(rewrite,1200)},true);
  setTimeout(rewrite, 100);
})();
