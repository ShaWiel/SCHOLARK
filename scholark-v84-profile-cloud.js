(() => {
  if(window.__SCHOLARK_V84_PROFILE_CLOUD__)return;
  window.__SCHOLARK_V84_PROFILE_CLOUD__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let hydrated=false,busy=false;

  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  function root(){
    const heads=$$('h1,h2,h3');
    const h=heads.find(el=>/een paar vragen|a few questions|daarna wordt alles persoonlijk|then everything becomes personal/i.test(clean(el.textContent)));
    return h?.closest('main,section,[role="main"],.page,.screen,.view')||h?.parentElement||null;
  }
  function fieldByLabel(r,re){
    const labels=$$('label',r);
    for(const l of labels){if(re.test(clean(l.textContent))){const id=l.getAttribute('for');const el=id?$('#'+CSS.escape(id),r):$('input,select,textarea',l.parentElement);if(el)return el}}
    const all=$$('input,select,textarea',r);
    return all.find(el=>re.test(clean(el.placeholder||el.getAttribute('aria-label')||el.name||'')))||null;
  }
  function values(){
    const r=root();if(!r)return null;
    const display=fieldByLabel(r,/naam|name|bijv\. shakur/i)||$$('input',r).find(x=>/shakur|name|naam/i.test(x.placeholder||''));
    const age=fieldByLabel(r,/leeftijd|age/i)||$$('input[type="number"]',r)[0];
    const level=fieldByLabel(r,/leerfase|learning phase|education level/i)||$$('select',r)[0];
    const goal=fieldByLabel(r,/vooral bereiken|goal|doel/i)||$$('select',r)[1];
    const subjects=fieldByLabel(r,/vakken|onderwerpen|subjects|topics/i)||$$('input',r).find(x=>/wiskunde|nederlands|economie|subjects|topics/i.test(x.placeholder||''));
    return {
      display_name:clean(display?.value),
      education_level:clean(level?.value),
      preferences:{age:Number(age?.value)||null,goal:clean(goal?.value),subjects:clean(subjects?.value).split(/[,;\n]/).map(clean).filter(Boolean).slice(0,30)}
    };
  }
  async function saveProfile(){
    if(busy)return;const v=values();if(!v)return;const x=await ctx();if(!x)return;
    busy=true;
    try{
      const body={user_id:x.uid,display_name:v.display_name||null,education_level:v.education_level||null,language:localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en',onboarding_completed:true,preferences:v.preferences,updated_at:new Date().toISOString()};
      const r=await x.c.request('/rest/v1/profiles?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
      if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.message||'Profile save failed')}
      if(v.education_level)localStorage.setItem('scholark_learning_level',v.education_level);
      localStorage.setItem('scholark_profile_cloud_synced','1');
    }catch(e){console.warn('[SCHOLARK] Profile cloud save:',clean(e?.message||e))}finally{busy=false}
  }
  async function hydrate(){
    if(hydrated)return;const r=root();if(!r)return;const x=await ctx();if(!x)return;hydrated=true;
    try{
      const res=await x.c.request('/rest/v1/profiles?select=display_name,education_level,language,preferences,onboarding_completed&user_id=eq.'+encodeURIComponent(x.uid)+'&limit=1',{method:'GET'});
      const d=await res.json().catch(()=>[]);if(!res.ok)return;const p=Array.isArray(d)?d[0]:d;if(!p)return;
      const display=fieldByLabel(r,/naam|name/i)||$$('input',r).find(x=>/shakur|name|naam/i.test(x.placeholder||''));
      const age=fieldByLabel(r,/leeftijd|age/i)||$$('input[type="number"]',r)[0];
      const level=fieldByLabel(r,/leerfase|learning phase|education level/i)||$$('select',r)[0];
      const goal=fieldByLabel(r,/vooral bereiken|goal|doel/i)||$$('select',r)[1];
      const subjects=fieldByLabel(r,/vakken|onderwerpen|subjects|topics/i)||$$('input',r).find(x=>/wiskunde|nederlands|economie|subjects|topics/i.test(x.placeholder||''));
      if(display&&!display.value&&p.display_name)display.value=p.display_name;
      if(age&&!age.value&&p.preferences?.age)age.value=p.preferences.age;
      if(level&&p.education_level&&[...level.options].some(o=>o.value===p.education_level))level.value=p.education_level;
      if(goal&&p.preferences?.goal&&[...goal.options].some(o=>o.value===p.preferences.goal))goal.value=p.preferences.goal;
      if(subjects&&!subjects.value&&Array.isArray(p.preferences?.subjects))subjects.value=p.preferences.subjects.join(', ');
      if(p.education_level)localStorage.setItem('scholark_learning_level',p.education_level);
    }catch(e){console.warn('[SCHOLARK] Profile hydrate:',clean(e?.message||e))}
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('button,[role="button"],input[type="submit"]');if(!b||!root()?.contains(b))return;
    if(/maak mijn scholark|make my scholark|save profile|profiel opslaan/i.test(clean(b.textContent||b.value))){setTimeout(saveProfile,0)}
  },true);
  document.addEventListener('change',e=>{if(root()?.contains(e.target))clearTimeout(window.__v84save),window.__v84save=setTimeout(saveProfile,900)},true);
  function sync(){if(root()){hydrate()}}
  addEventListener('hashchange',()=>{setTimeout(sync,120);setTimeout(sync,360)});
  [500,1200].forEach(ms=>setTimeout(sync,ms));
})();