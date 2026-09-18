(() => {
  if (window.__SCHOLARK_V103_LANGUAGE_NEXT__) return;
  window.__SCHOLARK_V103_LANGUAGE_NEXT__ = true;

  const VERSION='20260918-language-next-v2';
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();

  async function startNext(){
    const api=window.__SCHOLARK_V93_LANGUAGE__;
    if(api?.nextLesson)return api.nextLesson();
    const panel=[...document.querySelectorAll('.v93-section .v93-row > div')].find(el=>/next lesson|volgende les/i.test(clean(el.querySelector('h3')?.textContent)));
    const topic=document.querySelector('#v93-topic');
    if(!api?.buildLesson||!topic)return null;
    topic.value=clean(panel?.querySelector('p')?.textContent)||'Continue with the next practical lesson';
    topic.dispatchEvent(new Event('input',{bubbles:true}));
    return api.buildLesson();
  }

  function verify(){
    if(!String(location.hash||'').toLowerCase().startsWith('#language'))return false;
    const button=document.querySelector('#v93-next');
    if(!button)return false;
    button.dataset.v103Next='1';
    button.setAttribute('aria-label',clean(button.textContent)||'Next lesson');
    return true;
  }

  addEventListener('scholark-language-lesson-rendered',()=>requestAnimationFrame(verify));
  addEventListener('hashchange',()=>setTimeout(verify,40));
  addEventListener('pageshow',()=>setTimeout(verify,40));
  setTimeout(verify,180);

  window.__SCHOLARK_V103_LANGUAGE_NEXT_API__={version:VERSION,startNext,verify};
})();