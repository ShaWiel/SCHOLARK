import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const failures=[];
const check=(cond,msg)=>{if(!cond)failures.push(msg)};

try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e?.message||e)));
  await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.body.classList.contains('v51-workspace')&&document.querySelector('#v51-sidebar')&&document.querySelector('#v51-main [data-v51-page="dashboard"].active'),{timeout:15000});
  await page.waitForFunction(()=>window.__SCHOLARK_V91__&&window.__SCHOLARK_CREDITS__,{timeout:15000});
  await page.waitForTimeout(700);

  async function inspect(label){
    const state=await page.evaluate(()=>{
      const side=document.querySelector('#v51-sidebar');
      const brand=side?.querySelector('.v51-brand');
      const home=side?.querySelector('#v51-home');
      const firstSection=side?.querySelector('.v51-section');
      const actions=side?.querySelector('#v51-sidebar-actions');
      const help=actions?.querySelector('#v51-help');
      const account=actions?.querySelector('#v51-account');
      const nav=side?.querySelector('[data-v51-tool="ai"]');
      const pick=el=>{if(!el)return null;const cs=getComputedStyle(el);return {bg:cs.backgroundColor,border:cs.borderTopWidth+' '+cs.borderTopStyle,borderRadius:cs.borderRadius,padding:cs.padding,fontSize:cs.fontSize,fontWeight:cs.fontWeight}};
      return {
        usage:document.querySelectorAll('#v51-main [data-v51-page="dashboard"] .v85-dash').length,
        resume:document.querySelectorAll('#v51-main [data-v51-page="dashboard"] .v91-resume').length,
        homeCount:document.querySelectorAll('#v51-home').length,
        helpCount:document.querySelectorAll('#v51-help').length,
        accountCount:document.querySelectorAll('#v51-account').length,
        homeDirect:home?.parentElement===side,
        homeAfterBrand:brand?.nextElementSibling===home,
        homeBeforeWorkspace:firstSection?.previousElementSibling===home,
        homeNav:home?.classList.contains('v51-nav')&&home?.classList.contains('v51-home-nav'),
        helpNav:help?.classList.contains('v51-nav')&&help?.classList.contains('v51-side-action'),
        accountNav:account?.classList.contains('v51-nav')&&account?.classList.contains('v51-side-action'),
        homeInsideActions:!!home&&!!actions&&actions.contains(home),
        helpStyle:pick(help),
        accountStyle:pick(account),
        navStyle:pick(nav),
        sidebarActionsReady:actions?.dataset.v51SidebarActionsReady||''
      };
    });
    check(state.usage===0,label+': Usage foundation returned '+JSON.stringify(state));
    check(state.resume===0,label+': Continue where you left off returned '+JSON.stringify(state));
    check(state.homeCount===1&&state.helpCount===1&&state.accountCount===1,label+': sidebar utility controls duplicated '+JSON.stringify(state));
    check(state.homeDirect&&state.homeAfterBrand&&state.homeBeforeWorkspace&&!state.homeInsideActions,label+': Home is not the top navigation row '+JSON.stringify(state));
    check(state.homeNav&&state.helpNav&&state.accountNav,label+': Home/Help/Account are not first-class sidebar nav rows '+JSON.stringify(state));
    check(state.sidebarActionsReady==='1',label+': canonical sidebar actions are not ready '+JSON.stringify(state));
    for(const key of ['helpStyle','accountStyle']){
      const x=state[key],n=state.navStyle;
      check(!!x&&!!n&&x.border===n.border&&x.borderRadius===n.borderRadius&&x.padding===n.padding&&x.fontSize===n.fontSize&&x.fontWeight===n.fontWeight,
        label+': '+key+' does not match sidebar nav styling '+JSON.stringify(state));
    }
    return state;
  }

  await inspect('dashboard boot');

  await page.click('#v51-sidebar [data-v51-tool="ai"]');
  await page.waitForFunction(()=>location.hash==='#ai',{timeout:5000});
  await page.waitForTimeout(350);
  await page.evaluate(()=>{location.hash='dashboard'});
  await page.waitForFunction(()=>location.hash==='#dashboard'&&document.querySelector('#v51-main [data-v51-page="dashboard"].active'),{timeout:7000});
  await page.waitForTimeout(700);
  await inspect('dashboard re-entry');

  check(errors.length===0,'browser errors: '+errors.join(' | '));
  console.log('SCHOLARK R219 SIDEBAR/DASHBOARD SMOKE',JSON.stringify({ok:failures.length===0}));
} finally {
  await browser.close();
}
if(failures.length){
  failures.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
