(() => {
  'use strict';
  if (window.__SCHOLARK_CONNECT__) return;
  const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
  const KEY='sb_publishable_1f1KQE-QMOM8rR3RqvQlsw__79lCn6A';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  const clean=s=>String(s??'').trim();
  const uid=s=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(s||''));
  const state={me:null,profile:null,friends:[],identities:new Map(),pending:[],requests:[],selected:null,messages:[],contacts:[],contactPicked:new Set(),contactMatches:[],contactBusy:false,room:null,members:[],peers:new Map(),local:null,screen:null,screenBusy:false,screenOwner:null,screenLeaseUntil:0,timers:[],signalSeen:0,chatSeen:0,dmBusy:false,roomBusy:false,signalsBusy:false,roomChatBusy:false,tab:'friends',mediaError:'',whiteboard:false,drawing:false,lastPoint:null,lastBoardAt:0};
  const own=()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()||null;
  const header=()=>{const s=own();if(!s?.access_token)throw Error('Sign in to use SCHOLAVERUM Connect.');return {apikey:KEY,authorization:'Bearer '+s.access_token,accept:'application/json','content-type':'application/json'}};
  async function request(path,method='GET',body){
    const r=await fetch(SB+'/rest/v1/'+path,{method,headers:header(),body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
    const d=await r.json().catch(()=>null);
    if(!r.ok){const e=new Error(d?.message||d?.error||d?.hint||'Connect could not complete the request.');e.status=r.status;throw e}
    return d;
  }
  const rpc=(name,args={})=>request('rpc/'+name,'POST',args);
  const status=(msg,err=false)=>{const p=$('#v122-status');if(p){p.textContent=msg||'';p.classList.toggle('error',!!err)}};
  const handleError=e=>{status(e?.message||'Connect is temporarily unavailable.',true);if(window.__SCHOLARK_TEST_MODE__)console.warn('[Connect]',e)};
  const css=document.createElement('style');css.id='scholark-connect-style';css.textContent=
    '#v122-connect{font:500 13px/1.5 Inter,system-ui,sans-serif;color:#222331;max-width:1480px;margin:auto;padding:26px 22px 55px}' +
    '#v122-connect *{box-sizing:border-box}#v122-connect h1{font-size:clamp(27px,3.3vw,43px);letter-spacing:-.04em;margin:3px 0}' +
    '#v122-connect h2{font-size:19px;margin:0 0 9px}#v122-connect p{color:#6b6875;margin:0 0 13px}' +
    '.v122-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.v122-between{justify-content:space-between}' +
    '.v122-panel{background:#fff;border:1px solid #e8e6ef;border-radius:20px;padding:19px;box-shadow:0 12px 42px rgba(12,15,33,.05)}' +
    '.v122-grid{display:grid;grid-template-columns:minmax(250px,320px) minmax(0,1fr);gap:15px}.v122-tabs{display:flex;gap:8px;margin:18px 0}' +
    '.v122-btn{border:0;border-radius:11px;background:#17191f;color:#fff;padding:10px 14px;cursor:pointer;font:750 12px Inter,system-ui;min-height:39px}' +
    '.v122-btn.alt{background:#eff0f5;color:#292b40}.v122-btn.lime{background:#c9ff6a;color:#17191f}.v122-btn.danger{background:#fee9e8;color:#a12727}' +
    '.v122-btn:disabled{opacity:.45;cursor:wait}.v122-tabs .v122-btn.active{background:#c9ff6a;color:#17191f}' +
    '.v122-input{width:100%;border:1px solid #d8d8e2;border-radius:11px;background:#fff;padding:11px;font:500 12px Inter,system-ui;min-width:0}' +
    '.v122-field{display:grid;gap:5px;margin:9px 0}.v122-field label{font-size:11px;font-weight:750;color:#555364}' +
    '.v122-entry{border:1px solid #efedf3;border-radius:12px;padding:11px;margin:7px 0}.v122-entry b{font-size:12px}.v122-entry small{color:#79778a}' +
    '.v122-entry button{font-size:10px;min-height:32px;padding:7px 9px}.v122-scroll{overflow:auto;max-height:520px}' +
    '#v122-status{min-height:24px;color:#48559e;font:700 12px Inter,system-ui;margin:8px 0}#v122-status.error{color:#b02336}' +
    '.v122-chat{height:min(49vh,450px);min-height:180px;overflow:auto;background:#f7f7fa;border-radius:12px;padding:12px;margin:10px 0}' +
    '.v122-bubble{padding:9px 11px;border-radius:12px;margin:6px 0;max-width:85%;width:fit-content;background:#fff;border:1px solid #eceaf0;overflow-wrap:anywhere}' +
    '.v122-bubble.mine{background:#e9ffc9;margin-left:auto}.v122-bubble small{display:block;color:#77717e;font-size:10px}' +
    '.v122-compose{display:flex;gap:8px}.v122-compose .v122-input{flex:1}.v122-quiet{font-size:11px;color:#817b8e}' +
    '.v122-videos{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:14px 0}' +
    '.v122-video[hidden]{display:none}' +
    '.v122-video{background:#17191f;color:#fff;border-radius:16px;overflow:hidden;min-height:180px;position:relative;display:grid;place-items:center}' +
    '.v122-video video{display:block;width:100%;height:100%;max-height:330px;object-fit:cover;background:#151821}' +
    '.v122-video span{position:absolute;bottom:8px;left:9px;background:#0009;padding:4px 7px;border-radius:7px;font-size:10px}' +
    '.v122-meetcols{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,320px);gap:15px}' +
    '.v122-board{width:100%;height:230px;background:#fff;border:1px solid #ddd;border-radius:12px;touch-action:none;cursor:crosshair}' +
    '.v122-formrow{display:flex;gap:8px;align-items:center;margin-top:9px}.v122-formrow .v122-input{flex:1}' +
    '.v122-warning{font-size:11px;padding:10px;background:#fff6e3;border-radius:10px;color:#5c481c}' +
    '@media(max-width:850px){.v122-grid,.v122-meetcols{grid-template-columns:1fr}#v122-connect{padding:14px 9px 40px}.v122-panel{padding:12px}.v122-video{min-height:165px}}';
  document.head.appendChild(css);

  const profileMarkup=()=>'<div class="v122-panel" style="max-width:560px"><h2>Create your Connect profile</h2><p>Choose a unique handle. People can find you by your handle only if you allow it. Your email is never shown.</p>' +
    '<div class="v122-field"><label for="v122-handle">Username</label><input id="v122-handle" class="v122-input" maxlength="24" placeholder="e.g. studybuddy_12" autocomplete="off"></div>' +
    '<div class="v122-field"><label for="v122-name">Display name</label><input id="v122-name" class="v122-input" maxlength="60" placeholder="Your name"></div>' +
    '<label class="v122-row"><input type="checkbox" id="v122-searchable"> Let other users find me by username</label><label class="v122-row"><input type="checkbox" id="v122-contact-optin-profile"> Allow friends who know my verified email or phone to find me</label><div class="v122-row" style="margin-top:15px"><button class="v122-btn lime" id="v122-register">Create Connect profile</button></div></div>';
  function showProfile(){
    const mount=$('#v122-body');if(!mount)return;mount.innerHTML=profileMarkup();
    $('#v122-name').value=clean(state.me?.user_metadata?.full_name||'').slice(0,60);
    $('#v122-register').onclick=async()=>{
      try{
        const h=clean($('#v122-handle').value).toLowerCase(),n=clean($('#v122-name').value);
        if(!/^[a-z0-9_]{3,24}$/.test(h))throw Error('Username must have 3–24 lowercase letters, numbers or underscores.');
        if(!n||n.length>60)throw Error('Enter a display name.');
        state.profile=await rpc('connect_register',{p_handle:h,p_name:n,p_searchable:$('#v122-searchable').checked});
        state.profile.contact_discovery_enabled=await rpc('connect_set_contact_discovery',{p_enabled:$('#v122-contact-optin-profile').checked});
        await refresh();renderApp();status('Your private Connect profile is ready.');
      }catch(e){handleError(e)}
    };
  }
  function renderBase(){
    const host=$('#v51-fallback');if(!host)return false;
    host.innerHTML='<section id="v122-connect"><div class="v122-row v122-between"><div><span class="v122-quiet">SCHOLAVERUM WORKSPACE</span><h1>Connect</h1><p>Friends, private messages, voice calls, screen sharing and study rooms — all inside SCHOLAVERUM.</p></div><span class="v122-warning">Voice calls · up to 9 people · no external meeting apps</span></div><div id="v122-status" role="status" aria-live="polite"></div><div id="v122-body"></div></section>';
    return true;
  }
  async function people(ids){
    const valid=[...new Set(ids.filter(uid))];if(!valid.length)return;
    const rows=await request('connect_identities?select=user_id,handle,display_name&user_id=in.('+valid.join(',')+')');
    for(const row of rows||[])state.identities.set(row.user_id,row);
  }
  function who(id){const p=state.identities.get(id);return p?.display_name||p?.handle||'Participant';}
  async function refresh(){
    if(!state.me)return;
    const rows=await request('connect_friends?select=id,requester,recipient,status,created_at&or=(requester.eq.'+state.me.id+',recipient.eq.'+state.me.id+')&order=created_at.desc');
    const entries=Array.isArray(rows)?rows:[];
    state.friends=entries.filter(x=>x.status==='accepted');
    if(state.selected&&!state.friends.some(x=>(x.requester===state.me.id?x.recipient:x.requester)===state.selected))state.selected=null;
    state.requests=entries.filter(x=>x.status==='pending'&&x.recipient===state.me.id);
    state.pending=entries.filter(x=>x.status==='pending'&&x.requester===state.me.id);
    await people(entries.map(x=>x.requester===state.me.id?x.recipient:x.requester));
  }
  const peerId=row=>row.requester===state.me.id?row.recipient:row.requester;
  function renderFriends(){
    const el=$('#v122-friends-list');if(!el)return;
    el.innerHTML=(state.requests.length?'<h2>Friend requests</h2>'+state.requests.map(x=>'<div class="v122-entry"><div class="v122-row v122-between"><div><b>'+esc(who(peerId(x)))+'</b><br><small>Wants to connect</small></div><div class="v122-row"><button class="v122-btn lime" data-friend-accept="'+esc(x.id)+'">Accept</button><button class="v122-btn alt" data-friend-reject="'+esc(x.id)+'">Decline</button></div></div></div>').join(''):'')+
      '<h2>Your friends</h2>'+(state.friends.length?state.friends.map(x=>'<div class="v122-entry"><div class="v122-row v122-between"><div><b>'+esc(who(peerId(x)))+'</b><br><small>@'+esc(state.identities.get(peerId(x))?.handle||'friend')+'</small></div><div class="v122-row"><button class="v122-btn alt" data-chat="'+esc(peerId(x))+'">Message</button><button class="v122-btn alt" data-friend-remove="'+esc(x.id)+'">Remove</button><button class="v122-btn alt" data-friend-report="'+esc(peerId(x))+'">Report</button><button class="v122-btn danger" data-friend-block="'+esc(peerId(x))+'">Block</button></div></div></div>').join(''):'<p>No friends yet. Search for classmates by username.</p>')+
      (state.pending.length?'<h2>Sent requests</h2>'+state.pending.map(x=>'<div class="v122-entry"><b>'+esc(who(peerId(x)))+'</b><small> · Pending</small><button class="v122-btn alt" data-friend-cancel="'+esc(x.id)+'" style="margin-left:9px">Cancel</button></div>').join(''):'');
    $$('[data-friend-accept],[data-friend-reject],[data-friend-remove],[data-friend-cancel],[data-friend-block],[data-friend-report]',el).forEach(btn=>btn.onclick=async()=>{
      try{
        const id=btn.dataset.friendAccept||btn.dataset.friendReject||btn.dataset.friendRemove||btn.dataset.friendCancel;
        if(btn.dataset.friendReport){await reportUser(btn.dataset.friendReport,'message');return}
        if(btn.dataset.friendBlock){if(!confirm('Block this person and remove them from your friends?'))return;await rpc('connect_block',{p_target:btn.dataset.friendBlock,p_block:true})}
        else await rpc('connect_friend_action',{p_id:id,p_action:btn.dataset.friendAccept?'accept':btn.dataset.friendReject?'reject':btn.dataset.friendCancel?'cancel':'remove'});
        await refresh();renderFriends();status('Friend list updated.');
      }catch(e){handleError(e)}
    });
    $$('[data-chat]',el).forEach(btn=>btn.onclick=()=>selectFriend(btn.dataset.chat));
  }
  async function reportUser(target,context){
    if(!uid(target))return;
    const category=clean(window.prompt('Report reason: harassment, bullying, spam, unsafe_content, other','harassment')||'').toLowerCase();
    if(!category)return;
    if(!['harassment','bullying','spam','unsafe_content','other'].includes(category)){status('Choose a valid report category.',true);return}
    const details=clean(window.prompt('Describe the safety concern (optional; no passwords or private information):','')||'').slice(0,1000);
    try{await rpc('connect_report',{p_target:target,p_category:category,p_context:context,p_details:details});status('Report submitted privately. You can also block this person.')}
    catch(e){handleError(e)}
  }
  async function lookup(){
    try{
      const query=clean($('#v122-search').value);if(query.length<3)throw Error('Enter at least 3 characters.');
      const results=await rpc('connect_find_people',{p_query:query});
      const host=$('#v122-results');
      host.innerHTML=(results||[]).map(p=>'<div class="v122-entry v122-row v122-between"><span><b>'+esc(p.display_name)+'</b><br><small>@'+esc(p.handle)+'</small></span><button class="v122-btn lime" data-add="'+esc(p.user_id)+'">Add friend</button></div>').join('')||'<p>No matching public Connect profiles.</p>';
      $$('[data-add]',host).forEach(btn=>btn.onclick=async()=>{try{await rpc('connect_friend_request',{p_target:btn.dataset.add});await refresh();renderFriends();status('Friend request sent.')}catch(e){handleError(e)}});
    }catch(e){handleError(e)}
  }

  // Consent-only lookup: selected identifiers are compared transiently by RPC.
  const emailOk=t=>/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(t)&&t.length<=254;
  function phoneE164(number,prefix){
    let n=clean(number).replace(/[\s()\-\.]/g,'');
    if(n.startsWith('00'))n='+'+n.slice(2);
    if(!n.startsWith('+')&&prefix)n=prefix+n.replace(/^0+/,'');
    return /^\+[1-9]\d{7,14}$/.test(n)?n:'';
  }
  function clearDeviceContacts(){
    state.contacts=[];state.contactPicked.clear();state.contactMatches=[];
    const c=$('#v122-contact-candidates'),m=$('#v122-contact-matches');
    if(c)c.textContent='';if(m)m.textContent='';
  }
  function addDeviceContacts(rows){
    state.contacts=[];state.contactPicked.clear();state.contactMatches=[];
    for(const person of rows||[]){
      const many=x=>Array.isArray(x)?x:(x?[x]:[]);
      const emails=many(person.email||person.emails).map(x=>clean(x).toLowerCase()).filter(emailOk);
      const phones=many(person.tel||person.phone).map(clean).filter(Boolean);
      if(!emails.length&&!phones.length)continue;
      state.contacts.push({name:clean(many(person.name)[0]||emails[0]||phones[0]).slice(0,90),emails,phones});
      if(state.contacts.length>=500)break;
    }
    renderDeviceContacts();
    status(state.contacts.length+' contacts loaded privately. Select up to 30 to check.');
  }
  function readVCF(source){
    const out=[];
    for(const block of source.replace(/\r?\n[ \t]/g,'').split(/BEGIN:VCARD/i).slice(1,501)){
      const lines=(block.split(/END:VCARD/i)[0]||'').split(/\r?\n/);
      const val=key=>lines.filter(x=>new RegExp('^(?:item\\d+\\.)?'+key+'(?:;[^:]*)?:','i').test(x))
        .map(x=>x.slice(x.indexOf(':')+1).replace(/\\n/gi,' '));
      out.push({name:val('FN')[0]||'',email:val('EMAIL'),tel:val('TEL')});
    }
    return out;
  }
  function readCSV(source){
    const rows=[];let row=[],field='',quoted=false;
    for(let i=0;i<source.length&&rows.length<502;i++){
      const c=source[i];
      if(c==='"'&&quoted&&source[i+1]==='"'){field+='"';i++;continue}
      if(c==='"'){quoted=!quoted;continue}
      if(c===','&&!quoted){row.push(field);field='';continue}
      if((c==='\r'||c==='\n')&&!quoted){if(c==='\r'&&source[i+1]==='\n')i++;row.push(field);rows.push(row);row=[];field='';continue}
      field+=c;
    }
    if(row.length||field){row.push(field);rows.push(row)}
    if(!rows.length)return[];
    const columns=rows.shift().map(x=>clean(x).toLowerCase());
    const inds=re=>columns.flatMap((c,i)=>re.test(c)?[i]:[]);
    const em=inds(/e-?mail/),ph=inds(/phone|mobile|telephone|tel/),nm=inds(/^(name|full name|display name|first name)$/);
    if(!em.length&&!ph.length)throw Error('CSV needs an Email or Phone column');
    return rows.map(x=>({name:x[nm[0]]||'',email:em.map(i=>x[i]||''),tel:ph.map(i=>x[i]||'')})).slice(0,500);
  }
  function renderDeviceContacts(){
    const target=$('#v122-contact-candidates');if(!target)return;
    const q=clean($('#v122-contact-filter')?.value||'').toLowerCase();
    const visible=state.contacts.map((c,i)=>({c,i})).filter(({c})=>!q||(c.name+' '+c.emails.join(' ')+' '+c.phones.join(' ')).toLowerCase().includes(q)).slice(0,70);
    target.innerHTML=visible.map(({c,i})=>'<label class="v122-entry v122-row"><input type="checkbox" data-contact="'+i+'" '+(state.contactPicked.has(i)?'checked':'')+'><span><b>'+esc(c.name)+'</b><small> · '+esc(c.emails[0]||c.phones[0]||'')+'</small></span></label>').join('')+
      '<p class="v122-quiet">'+state.contactPicked.size+' selected · '+state.contacts.length+' available · showing '+visible.length+'</p>';
    $$('[data-contact]',target).forEach(box=>box.onchange=()=>{
      const i=Number(box.dataset.contact);
      if(box.checked&&state.contactPicked.size>=30){box.checked=false;status('Select no more than 30 contacts.',true);return}
      if(box.checked)state.contactPicked.add(i);else state.contactPicked.delete(i);
      renderDeviceContacts();
    });
  }
  function renderContactMatches(){
    const host=$('#v122-contact-matches');if(!host)return;
    host.innerHTML='<h3>Matching accounts</h3>'+(state.contactMatches.length?
      state.contactMatches.map(p=>'<div class="v122-entry v122-row v122-between"><span><b>'+esc(p.display_name)+'</b><small> @'+esc(p.handle)+'</small></span><button class="v122-btn lime" data-contact-add="'+esc(p.user_id)+'">Add friend</button></div>').join(''):
      '<p>No eligible matching profiles found. Your contacts might not use SCHOLAVERUM or might have discovery off.</p>');
    $$('[data-contact-add]',host).forEach(b=>b.onclick=async()=>{
      try{b.disabled=true;await rpc('connect_friend_request',{p_target:b.dataset.contactAdd});
        state.contactMatches=state.contactMatches.filter(p=>p.user_id!==b.dataset.contactAdd);
        await refresh();renderFriends();renderContactMatches();status('Friend request sent.')}
      catch(e){b.disabled=false;handleError(e)}
    });
  }
  async function runContactLookup(){
    if(state.contactBusy)return;
    const entries=[...state.contactPicked].map(i=>state.contacts[i]).filter(Boolean);
    if(!entries.length){status('Choose contacts before searching.',true);return}
    const prefix=clean($('#v122-phone-prefix')?.value||'');
    if(prefix&&!/^\+[1-9]\d{0,3}$/.test(prefix)){status('Use a country code like +597 or leave the field empty.',true);return}
    const emails=new Set(),phones=new Set();
    for(const p of entries){
      for(const x of p.emails)if(emails.size+phones.size<30)emails.add(x);
      for(const x of p.phones){const value=phoneE164(x,prefix);
        if(value&&emails.size+phones.size<30)phones.add(value)}
    }
    if(!emails.size&&!phones.size){status('No valid email or international phone numbers selected.',true);return}
    if(!confirm('Securely compare '+(emails.size+phones.size)+' selected contact identifiers with opted-in SCHOLAVERUM accounts? This is a one-time check, not a background sync.'))return;
    state.contactBusy=true;const b=$('#v122-search-contacts');if(b)b.disabled=true;
    try{
      const found=await rpc('connect_find_contacts',{p_emails:[...emails],p_phones:[...phones]});
      state.contactMatches=Array.isArray(found)?found:[];
      state.contacts=[];state.contactPicked.clear();
      renderDeviceContacts();renderContactMatches();
      status(state.contactMatches.length+' matching Connect account(s). Your selected contacts were cleared from this session.');
    }catch(e){handleError(e)}finally{state.contactBusy=false;if(b)b.disabled=false}
  }
  function wireDeviceContactDiscovery(){
    const toggle=$('#v122-contacts-visible');
    toggle.checked=!!state.profile?.contact_discovery_enabled;
    toggle.onchange=async()=>{
      toggle.disabled=true;
      try{const enabled=await rpc('connect_set_contact_discovery',{p_enabled:toggle.checked});
        state.profile.contact_discovery_enabled=enabled;status(enabled?'You can now be found by contacts with your verified details.':'Contact discovery is off.')}
      catch(e){toggle.checked=!!state.profile?.contact_discovery_enabled;handleError(e)}
      finally{toggle.disabled=false}
    };
    $('#v122-pick').onclick=async()=>{
      if(!navigator.contacts?.select){status('Your browser cannot open device contacts. Please import a .vcf or .csv file.',true);return}
      try{const rows=await navigator.contacts.select(['name','email','tel'],{multiple:true});
        if(rows?.length)addDeviceContacts(rows)}
      catch(e){if(e?.name!=='AbortError')handleError(e)}
    };
    $('#v122-import').onclick=()=>$('#v122-file')?.click();
    $('#v122-file').onchange=async e=>{
      const file=e.target.files?.[0];e.target.value='';if(!file)return;
      if(file.size>1024*1024){status('Maximum contact file size is 1 MB.',true);return}
      try{const content=await file.text();const parsed=/\.vcf$/i.test(file.name)?readVCF(content):/\.csv$/i.test(file.name)?readCSV(content):[];
        if(!parsed.length)throw Error('No valid .vcf or .csv contacts found');addDeviceContacts(parsed)}
      catch(err){handleError(err)}
    };
    $('#v122-contact-filter').oninput=renderDeviceContacts;
    $('#v122-clear-contacts').onclick=()=>{clearDeviceContacts();renderDeviceContacts();status('Contact data cleared from this session.')};
    $('#v122-search-contacts').onclick=()=>void runContactLookup();
    renderDeviceContacts();
  }

  function renderApp(){
    if(!state.profile)return showProfile();
    const root=$('#v122-body');if(!root)return;
    root.innerHTML='<div class="v122-row v122-between"><div class="v122-quiet">Signed in as @'+esc(state.profile.handle)+'</div><button class="v122-btn alt" id="v122-edit-profile">Edit profile</button></div>'+
    '<div class="v122-tabs"><button class="v122-btn active" data-tab="friends">Friends & messages</button><button class="v122-btn alt" data-tab="meetings">Meetings & study rooms</button></div>'+
    '<div id="v122-friends-tab"><div class="v122-grid"><aside class="v122-panel v122-scroll"><h2>Find people</h2><div class="v122-formrow"><input class="v122-input" id="v122-search" placeholder="Username or name" maxlength="32"><button class="v122-btn" id="v122-find">Search</button></div><div id="v122-results"></div><div class="v122-entry" id="v122-sync"><h3>Find friends from contacts</h3><p class="v122-quiet">Choose contacts from your device on supported browsers or import a .vcf/.csv contact file. No background sync; only identifiers you select are sent for matching.</p><label class="v122-row"><input id="v122-contacts-visible" type="checkbox"> Allow people with my verified contact details to find me</label><div class="v122-row" style="margin-top:9px"><button class="v122-btn alt" id="v122-pick" type="button">Choose device contacts</button><button class="v122-btn alt" id="v122-import" type="button">Import .vcf / .csv</button><button class="v122-btn alt" id="v122-clear-contacts" type="button">Clear contacts</button><input id="v122-file" type="file" accept=".vcf,.csv,text/vcard,text/csv" hidden></div><div class="v122-field"><label for="v122-phone-prefix">Country code for local numbers (optional)</label><input class="v122-input" id="v122-phone-prefix" placeholder="e.g. +597" maxlength="5" inputmode="tel"></div><input class="v122-input" id="v122-contact-filter" placeholder="Filter contacts on this device" maxlength="100"><div class="v122-scroll" id="v122-contact-candidates"></div><button class="v122-btn lime" id="v122-search-contacts" type="button">Find matching Connect accounts</button><div id="v122-contact-matches" aria-live="polite"></div><p class="v122-quiet">Other accounts must opt in and verify an email or phone. No unmatched contacts are stored. Maximum 30 identifiers per search and 3 searches per day.</p></div><div id="v122-friends-list" style="margin-top:18px"></div></aside><section class="v122-panel"><h2 id="v122-dm-title">Private messages</h2><p class="v122-quiet">Choose an accepted friend to start a private conversation.</p><div class="v122-chat" id="v122-dm"></div><form id="v122-dm-form" class="v122-compose"><input class="v122-input" id="v122-dm-input" maxlength="2000" placeholder="Your private message…" required disabled><button class="v122-btn" id="v122-dm-send" disabled>Send</button></form></section></div></div>'+
    '<div id="v122-meetings-tab" hidden><div id="v122-meeting-content"></div></div>';
    $$('[data-tab]',root).forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
    wireDeviceContactDiscovery();
    $('#v122-find').onclick=lookup;$('#v122-search').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();lookup()}};
    $('#v122-dm-form').onsubmit=async e=>{e.preventDefault();const input=$('#v122-dm-input'),body=clean(input.value);if(!state.selected||!body)return;try{await rpc('connect_send_message',{p_target:state.selected,p_body:body});input.value='';await loadDM()}catch(err){handleError(err)}};
    $('#v122-edit-profile').onclick=()=>{showProfile();$('#v122-handle').value=state.profile.handle;$('#v122-name').value=state.profile.display_name;$('#v122-searchable').checked=state.profile.searchable;$('#v122-contact-optin-profile').checked=!!state.profile.contact_discovery_enabled};
    renderFriends();renderMeeting();setTab(state.tab);
    if(state.selected&&state.friends.some(x=>peerId(x)===state.selected))selectFriend(state.selected);
  }
  function setTab(which){
    if(!['friends','meetings'].includes(which))return;
    state.tab=which;
    const a=$('#v122-friends-tab'),b=$('#v122-meetings-tab');if(!a||!b)return;
    a.hidden=which!=='friends';b.hidden=which!=='meetings';
    $$('[data-tab]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.tab===which);btn.classList.toggle('alt',btn.dataset.tab!==which)});
  }
  async function selectFriend(id){
    if(!state.friends.some(x=>peerId(x)===id))return;
    state.selected=id;const title=$('#v122-dm-title');if(title)title.textContent='Chat with '+who(id);
    const input=$('#v122-dm-input'),btn=$('#v122-dm-send');if(input)input.disabled=false;if(btn)btn.disabled=false;
    await loadDM();
  }
  function linkify(body){
    const raw=String(body||'');const m=raw.match(/#connect\?room=([0-9a-f-]{36})&code=([0-9a-f]{40})/i);
    if(!m||!uid(m[1]))return esc(raw);
    const url='#connect?room='+m[1]+'&code='+m[2];
    return esc(raw.slice(0,m.index))+'<a href="'+esc(url)+'" data-join-link="1">Join SCHOLAVERUM meeting</a>'+esc(raw.slice(m.index+m[0].length));
  }
  async function loadDM(){
    if(!state.selected||state.dmBusy||!state.me)return;state.dmBusy=true;
    try{
      const other=state.selected,me=state.me.id;
      const filter='or=(and(sender.eq.'+me+',recipient.eq.'+other+'),and(sender.eq.'+other+',recipient.eq.'+me+'))';
      const rows=await request('connect_messages?select=id,sender,recipient,body,created_at&'+filter+'&order=id.desc&limit=80');
      if(other!==state.selected)return;
      const host=$('#v122-dm');if(!host)return;
      const atBottom=host.scrollTop+host.clientHeight>=host.scrollHeight-90;
      host.innerHTML=(rows||[]).reverse().map(x=>'<div class="v122-bubble '+(x.sender===me?'mine':'')+'"><small>'+esc(x.sender===me?'You':who(other))+'</small>'+linkify(x.body)+'</div>').join('')||'<p>Messages between you and your friend are private to your accounts.</p>';
      if(atBottom)host.scrollTop=host.scrollHeight;
      $$('[data-join-link]',host).forEach(a=>a.onclick=()=>{setTimeout(()=>{const parts=new URLSearchParams(location.hash.split('?')[1]||'');if(parts.has('room')){setTab('meetings');renderMeeting()}},30)});
    }catch(e){handleError(e)}finally{state.dmBusy=false}
  }
  const roomUrl=()=>state.room?location.origin+location.pathname+'#connect?room='+state.room.id+'&code='+state.room.invite_code:'';
  function renderMeeting(){
    const host=$('#v122-meeting-content');if(!host)return;
    if(!state.room){
      const qp=new URLSearchParams(location.hash.split('?')[1]||'');
      host.innerHTML='<div class="v122-grid"><section class="v122-panel"><h2>Create a voice call</h2><p>Invite friends using a private SCHOLAVERUM link. Calls use your microphone only; you can share your screen when needed.</p><div class="v122-field"><label>Meeting title</label><input id="v122-room-title" class="v122-input" maxlength="100" value="Study together"></div><div class="v122-field"><label>Meeting type</label><select class="v122-input" id="v122-room-kind"><option value="meeting">Voice call</option><option value="study">Study room</option></select></div><button class="v122-btn lime" id="v122-create-room">Create meeting</button></section>'+
      '<section class="v122-panel"><h2>Join a meeting</h2><p>Use an invitation from a friend or an authorized meeting organizer.</p><div class="v122-field"><label>Room ID</label><input class="v122-input" id="v122-join-id" placeholder="Meeting ID"></div><div class="v122-field"><label>Invitation code</label><input class="v122-input" id="v122-join-code" placeholder="Private invitation code"></div><button class="v122-btn" id="v122-join-room">Join meeting</button><p class="v122-warning" style="margin-top:15px">Voice calls support up to nine people, including the host. Screen sharing uses extra upload bandwidth. Some networks need TURN, which is not yet configured.</p></section></div>';
      if(uid(qp.get('room'))&&/^[a-f0-9]{40}$/i.test(qp.get('code')||'')){$('#v122-join-id').value=qp.get('room');$('#v122-join-code').value=qp.get('code')}
      $('#v122-create-room').onclick=async()=>{try{const title=clean($('#v122-room-title').value),kind=$('#v122-room-kind').value;state.room=await rpc('connect_create_room',{p_title:title,p_kind:kind});await enterRoom()}catch(e){handleError(e)}};
      $('#v122-join-room').onclick=async()=>{try{const id=clean($('#v122-join-id').value),code=clean($('#v122-join-code').value);if(!uid(id)||!/^[a-f0-9]{40}$/i.test(code))throw Error('Enter a valid meeting ID and code.');state.room=await rpc('connect_join_room',{p_room:id,p_code:code});await enterRoom()}catch(e){handleError(e)}};
      return;
    }
    host.innerHTML='<div class="v122-panel"><div class="v122-row v122-between"><div><span class="v122-quiet">'+(state.room.kind==='study'?'STUDY ROOM':'VOICE CALL')+'</span><h2>'+esc(state.room.title)+'</h2><small>Private invitation · up to '+Number(state.room.max_participants||9)+' participants</small></div><div class="v122-row"><button class="v122-btn alt" id="v122-copy-room">Copy invite link</button><button class="v122-btn danger" id="v122-leave-room">'+(state.room.owner_id===state.me.id?'End meeting':'Leave meeting')+'</button></div></div><div class="v122-row" style="margin-top:12px"><button class="v122-btn alt" id="v122-mic">Mute microphone</button><button class="v122-btn alt" id="v122-screen">Share screen</button><button class="v122-btn alt" id="v122-board-toggle">Whiteboard</button><button class="v122-btn alt" id="v122-invite-friend" '+(!state.selected?'disabled':'')+'>Invite current friend</button></div><div class="v122-quiet" id="v122-call-status">Connecting participants securely…</div><div class="v122-videos" id="v122-videos"><div class="v122-video" id="v122-own-video" hidden><video id="v122-local-video" autoplay muted playsinline></video><span>Your screen</span></div></div><div id="v122-board-wrap" hidden><h2>Shared study whiteboard</h2><canvas class="v122-board" id="v122-board" width="920" height="280" aria-label="Shared whiteboard"></canvas><button class="v122-btn alt" id="v122-board-clear">Clear locally</button><p class="v122-quiet">Board drawings are sent only to active participants. No recording or automatic AI analysis.</p></div></div>'+
    '<div class="v122-meetcols" style="margin-top:15px"><div class="v122-panel"><h2>Participants</h2><div id="v122-participants"></div><p class="v122-quiet">The host can remove a participant. Recording is not enabled.</p></div><div class="v122-panel"><h2>Meeting chat</h2><div class="v122-chat" id="v122-room-chat" style="height:240px;min-height:130px"></div><form class="v122-compose" id="v122-room-chat-form"><input class="v122-input" id="v122-room-chat-input" maxlength="1500" required placeholder="Message everyone…"><button class="v122-btn">Send</button></form></div></div>';
    $('#v122-copy-room').onclick=async()=>{try{await navigator.clipboard.writeText(roomUrl());status('Private meeting link copied.')}catch{status('Copy this meeting link: '+roomUrl())}};
    $('#v122-leave-room').onclick=()=>leaveRoom();
    $('#v122-invite-friend').onclick=async()=>{if(!state.selected)return;try{await rpc('connect_send_message',{p_target:state.selected,p_body:'Join my SCHOLAVERUM meeting: '+roomUrl()});status('Sent a meeting invitation to '+who(state.selected)+'.')}catch(e){handleError(e)}};
    $('#v122-room-chat-form').onsubmit=async e=>{e.preventDefault();const input=$('#v122-room-chat-input'),message=clean(input.value);if(!message)return;try{await rpc('connect_room_message',{p_room:state.room.id,p_body:message});input.value='';await pollRoomChat()}catch(err){handleError(err)}};
    $('#v122-mic').onclick=()=>{const track=state.local?.getAudioTracks()?.[0];if(!track){status('Microphone is not available on this device.',true);return}track.enabled=!track.enabled;$('#v122-mic').textContent=track.enabled?'Mute microphone':'Unmute microphone'};
    $('#v122-screen').onclick=shareScreen;
    $('#v122-board-toggle').onclick=()=>{const target=$('#v122-board-wrap');target.hidden=!target.hidden;state.whiteboard=!target.hidden;if(!target.hidden)wireBoard()};
    $('#v122-board-clear').onclick=()=>{const c=$('#v122-board');c?.getContext('2d')?.clearRect(0,0,c.width,c.height)};
    renderMembers();
  }
  async function enterRoom(){
    state.signalSeen=0;state.chatSeen=0;state.peers.clear();setTab('meetings');renderMeeting();
    // Audio-only by default: never request webcam capture for a voice call.
    try{state.local=await navigator.mediaDevices.getUserMedia({
      audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false
    })}
    catch{state.mediaError='Microphone unavailable. You can still use meeting chat and screen sharing.'}
    if(state.mediaError)status(state.mediaError,true);
    await syncRoom();await pollSignals();await pollRoomChat();
    stopTimers();state.timers=[
      setInterval(()=>{void syncRoom().catch(handleError)},2200),
      setInterval(()=>{void pollSignals().catch(handleError)},800),
      setInterval(()=>{void pollRoomChat().catch(handleError)},3000),
      setInterval(()=>{if(!state.room||!state.screen)return;const id=state.room.id;
        void rpc('connect_screen_share',{p_room:id,p_action:'renew'}).then(ok=>{
          if(state.room?.id===id&&state.screen&&!ok){
            stopScreen();status('Screen sharing stopped because your permission expired.',true)
          }
        }).catch(()=>{
          if(state.room?.id===id&&state.screen){
            stopScreen();status('Screen sharing stopped because authorization could not be renewed.',true)
          }
        });
      },15000)
    ];
  }
  async function syncRoom(){
    if(!state.room||state.roomBusy)return;state.roomBusy=true;
    try{
      const id=state.room.id;
      const rows=await request('connect_rooms?select=id,active,expires_at,screen_share_owner,screen_share_expires_at&id=eq.'+id+'&limit=1');
      if(!state.room||state.room.id!==id)return;
      if(!rows?.[0]?.active||new Date(rows[0].expires_at).getTime()<=Date.now()){status('This meeting has ended.');await leaveRoom(false);return}
      const members=await request('connect_room_members?select=user_id,joined_at&room_id=eq.'+id+'&left_at=is.null');
      if(!members.some(x=>x.user_id===state.me.id)){status('The host removed you from this meeting.',true);await leaveRoom(false);return}
      state.members=members;
      const leaseExpiry=new Date(rows[0].screen_share_expires_at||0).getTime();
      state.screenOwner=leaseExpiry>Date.now()?rows[0].screen_share_owner:null;
      state.screenLeaseUntil=leaseExpiry;
      if(state.screen&&state.screenOwner&&state.screenOwner!==state.me.id){
        stopScreen();status('Another participant has the screen share slot.',true);
      }
      await people(members.map(x=>x.user_id));
      for(const m of members){if(m.user_id===state.me.id)continue;
        if(!state.peers.has(m.user_id)&&state.me.id<m.user_id)void peer(m.user_id,true).catch(handleError);
      }
      for(const [other,p] of state.peers){if(!members.some(m=>m.user_id===other)){p.close();state.peers.delete(other);$('#v122-remote-'+other)?.remove();$('#v122-audio-'+other)?.remove()}}
      renderMembers();updateScreenShareControl();
      const s=$('#v122-call-status');if(s)s.textContent=members.length+' participant'+(members.length===1?'':'s')+' · '+(state.mediaError?'Microphone unavailable':'Voice call · screen sharing available');
    }finally{state.roomBusy=false}
  }
  function renderMembers(){
    const host=$('#v122-participants');if(!host||!state.room)return;
    host.innerHTML=state.members.map(m=>'<div class="v122-entry v122-row v122-between"><span><b>'+esc(who(m.user_id))+'</b> <small>'+(m.user_id===state.room.owner_id?'Host':m.user_id===state.me.id?'You':'Participant')+'</small></span>'+(m.user_id!==state.me.id?'<div class="v122-row"><button class="v122-btn alt" data-report="'+esc(m.user_id)+'">Report</button>'+(state.room.owner_id===state.me.id?'<button class="v122-btn danger" data-kick="'+esc(m.user_id)+'">Remove</button>':'')+'</div>':'')+'</div>').join('')||'<p>Waiting for participants…</p>';
    $$('[data-report]',host).forEach(b=>b.onclick=()=>void reportUser(b.dataset.report,'meeting'));
    $$('[data-kick]',host).forEach(b=>b.onclick=async()=>{if(!confirm('Remove this participant?'))return;try{await rpc('connect_end_room',{p_room:state.room.id,p_kick:b.dataset.kick});await syncRoom()}catch(e){handleError(e)}});
  }
  async function signal(to,kind,payload){
    if(!state.room||!uid(to))return;
    await rpc('connect_signal',{p_room:state.room.id,p_target:to,p_kind:kind,p_payload:payload||{}});
  }
  async function peer(id,offer){
    if(!state.room||!uid(id))return null;
    if(state.peers.has(id))return state.peers.get(id);
    const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.cloudflare.com:3478'}],bundlePolicy:'balanced'});
    state.peers.set(id,pc);
    for(const track of state.local?.getAudioTracks()||[])pc.addTrack(track,state.local);
    // Negotiate a video m-line without a camera. Screen sharing can then start or stop
    // with replaceTrack and does not require offers from the other eight recipients.
    pc.__screenSender=pc.addTransceiver('video',{direction:'sendrecv'}).sender;
    const sharing=state.screen?.getVideoTracks()?.[0];
    if(sharing)await pc.__screenSender.replaceTrack(sharing);
    // Keep chat-only sessions negotiable if microphone access is denied.
    if(!state.local?.getAudioTracks().length)pc.createDataChannel('scholaverum-sync');
    pc.onicecandidate=e=>{if(e.candidate)void signal(id,'ice',e.candidate.toJSON()).catch(()=>{})};
    pc.ontrack=e=>{
      if(e.track.kind==='audio'){
        let audio=$('#v122-audio-'+id);
        if(!audio){audio=document.createElement('audio');audio.id='v122-audio-'+id;audio.autoplay=true;audio.playsInline=true;$('#v122-videos')?.appendChild(audio)}
        audio.srcObject=new MediaStream([e.track]);
        void audio.play().catch(()=>{status('Audio playback was blocked. Interact with the call to enable sound.',true)});
        return;
      }
      if(e.track.kind!=='video')return;
      let container=$('#v122-remote-'+id);
      if(!container){container=document.createElement('div');container.className='v122-video';container.id='v122-remote-'+id;container.hidden=true;container.innerHTML='<video autoplay muted playsinline></video><span>'+esc(who(id))+' · shared screen</span>';$('#v122-videos')?.appendChild(container)}
      const video=$('video',container);
      if(video){video.srcObject=new MediaStream([e.track]);void video.play().catch(()=>{})}
      const visible=()=>{container.hidden=e.track.muted||e.track.readyState==='ended'};
      e.track.addEventListener('mute',visible);
      e.track.addEventListener('unmute',visible);
      e.track.addEventListener('ended',visible);
      visible();
    };
    pc.onconnectionstatechange=()=>{const row=$('#v122-remote-'+id);if(row)row.title='Connection: '+pc.connectionState};
    if(offer){
      try{const desc=await pc.createOffer();await pc.setLocalDescription(desc);await signal(id,'offer',{sdp:pc.localDescription?.sdp,type:'offer'})}
      catch(e){handleError(e)}
    }
    return pc;
  }
  async function pollSignals(){
    if(!state.room||state.signalsBusy||!state.me)return;state.signalsBusy=true;
    try{
      const id=state.room.id;
      const rows=await request('connect_signals?select=id,sender,kind,payload&room_id=eq.'+id+'&recipient=eq.'+state.me.id+'&id=gt.'+state.signalSeen+'&order=id.asc&limit=120');
      for(const x of rows||[]){
        if(!state.room||state.room.id!==id)return;
        state.signalSeen=Math.max(state.signalSeen,Number(x.id));
        if(!state.members.some(y=>y.user_id===x.sender))continue;
        if(x.kind==='board'){drawSegment(x.payload);continue}
        if(x.kind==='bye'){state.peers.get(x.sender)?.close();state.peers.delete(x.sender);$('#v122-remote-'+x.sender)?.remove();$('#v122-audio-'+x.sender)?.remove();continue}
        const pc=await peer(x.sender,false);if(!pc)continue;
        try{
          if(x.kind==='offer'){
            await pc.setRemoteDescription({type:'offer',sdp:x.payload.sdp});
            const answer=await pc.createAnswer();await pc.setLocalDescription(answer);
            await signal(x.sender,'answer',{type:'answer',sdp:pc.localDescription?.sdp});
          }else if(x.kind==='answer'&&pc.signalingState==='have-local-offer'){
            await pc.setRemoteDescription({type:'answer',sdp:x.payload.sdp});
          }else if(x.kind==='ice'){
            if(pc.remoteDescription)await pc.addIceCandidate(x.payload);
            else{pc.__pendingIce=pc.__pendingIce||[];pc.__pendingIce.push(x.payload)}
          }
          if(pc.remoteDescription&&pc.__pendingIce?.length){
            const pending=pc.__pendingIce.splice(0);for(const candidate of pending)await pc.addIceCandidate(candidate).catch(()=>{});
          }
        }catch(err){handleError(err)}
      }
    }finally{state.signalsBusy=false}
  }
  async function pollRoomChat(){
    if(!state.room||state.roomChatBusy)return;state.roomChatBusy=true;
    try{
      const id=state.room.id,rows=await request('connect_room_chat?select=id,sender,body,created_at&room_id=eq.'+id+'&order=id.desc&limit=100');
      const host=$('#v122-room-chat');if(!host||state.room?.id!==id)return;
      const bottom=host.scrollTop+host.clientHeight>=host.scrollHeight-80;
      host.innerHTML=(rows||[]).reverse().map(m=>'<div class="v122-bubble '+(m.sender===state.me.id?'mine':'')+'"><small>'+esc(m.sender===state.me.id?'You':who(m.sender))+'</small>'+esc(m.body)+'</div>').join('')||'<p>Meeting messages will appear here.</p>';
      if(bottom)host.scrollTop=host.scrollHeight;
    }finally{state.roomChatBusy=false}
  }
  function updateScreenShareControl(){
    const btn=$('#v122-screen');if(!btn)return;
    const occupied=!!state.screenOwner&&state.screenOwner!==state.me?.id&&state.screenLeaseUntil>Date.now();
    btn.disabled=!!state.screenBusy||(!state.screen&&occupied);
    btn.textContent=state.screen?'Stop sharing':state.screenBusy?'Starting screen share…':occupied?'Another person is sharing':'Share screen';
  }
  async function shareScreen(){
    if(!state.room||state.screenBusy)return;
    if(state.screen){stopScreen();return}
    if(state.screenOwner&&state.screenOwner!==state.me?.id&&state.screenLeaseUntil>Date.now()){
      status('Only one participant can share their screen at a time.',true);return;
    }
    if(typeof navigator.mediaDevices?.getDisplayMedia!=='function'){
      status('This browser does not support screen sharing.',true);return;
    }
    const id=state.room.id;
    let captured=null,claimed=false;
    state.screenBusy=true;updateScreenShareControl();
    try{
      // getDisplayMedia must be initiated by the user click, before any await.
      captured=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:10,max:12}},audio:false});
      const track=captured.getVideoTracks()[0];if(!track)throw Error('No screen track');
      if(state.room?.id!==id){for(const t of captured.getTracks())t.stop();return}
      claimed=await rpc('connect_screen_share',{p_room:id,p_action:'claim'});
      if(!claimed){
        status('Another participant is already sharing their screen.',true);
        for(const t of captured.getTracks())t.stop();return;
      }
      if(state.room?.id!==id){
        for(const t of captured.getTracks())t.stop();
        void rpc('connect_screen_share',{p_room:id,p_action:'release'}).catch(()=>{});
        return;
      }
      state.screen=captured;state.screenOwner=state.me.id;
      state.screenLeaseUntil=Date.now()+45000;
      const results=await Promise.allSettled([...state.peers.values()].map(pc=>pc.__screenSender?.replaceTrack(track)||Promise.resolve()));
      const local=$('#v122-local-video');if(local)local.srcObject=captured;
      const ownTile=$('#v122-own-video');if(ownTile)ownTile.hidden=false;
      if(results.some(x=>x.status==='rejected')){
        status('Some participants may not see your shared screen. Check connection quality.',true);
      }
      track.onended=()=>stopScreen();
    }catch(e){
      if(captured&&!state.screen)for(const track of captured.getTracks())track.stop();
      if(claimed&&!state.screen)void rpc('connect_screen_share',{p_room:id,p_action:'release'}).catch(()=>{});
      handleError(e);
    }finally{state.screenBusy=false;updateScreenShareControl()}
  }
  function stopScreen(){
    if(!state.screen)return;
    const roomId=state.room?.id;
    for(const track of state.screen.getTracks())track.stop();
    state.screen=null;
    for(const pc of state.peers.values())if(pc.__screenSender)void pc.__screenSender.replaceTrack(null).catch(()=>{});
    const local=$('#v122-local-video');if(local)local.srcObject=null;
    const ownTile=$('#v122-own-video');if(ownTile)ownTile.hidden=true;
    if(state.screenOwner===state.me?.id)state.screenOwner=null;
    state.screenLeaseUntil=0;
    updateScreenShareControl();
    // Lease expires even if the network drops before this RPC can finish.
    if(roomId)void rpc('connect_screen_share',{p_room:roomId,p_action:'release'}).catch(()=>{});
  }
  function drawSegment(p){
    const canvas=$('#v122-board');if(!canvas||!p)return;
    const vals=[p.x,p.y,p.x2,p.y2];if(vals.some(v=>!Number.isFinite(v)||v<0||v>1))return;
    const ctx=canvas.getContext('2d');ctx.strokeStyle='#6859d8';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();
    ctx.moveTo(p.x*canvas.width,p.y*canvas.height);ctx.lineTo(p.x2*canvas.width,p.y2*canvas.height);ctx.stroke();
  }
  function wireBoard(){
    const canvas=$('#v122-board');if(!canvas||canvas.dataset.bound)return;canvas.dataset.bound='1';
    const coords=e=>{const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))}};
    canvas.onpointerdown=e=>{state.drawing=true;state.lastPoint=coords(e);canvas.setPointerCapture(e.pointerId)};
    canvas.onpointerup=()=>{state.drawing=false;state.lastPoint=null};
    canvas.onpointercancel=()=>{state.drawing=false;state.lastPoint=null};
    canvas.onpointermove=e=>{
      if(!state.drawing||!state.lastPoint)return;
      const next=coords(e),point={...state.lastPoint,x2:next.x,y2:next.y};drawSegment(point);state.lastPoint=next;
      if(Date.now()-state.lastBoardAt<450)return;state.lastBoardAt=Date.now();
      for(const p of state.members)if(p.user_id!==state.me.id)void signal(p.user_id,'board',point).catch(()=>{});
    };
  }
  function stopTimers(){for(const t of state.timers)clearInterval(t);state.timers=[]}
  async function leaveRoom(write=true){
    const room=state.room;if(!room)return;
    stopTimers();stopScreen();
    for(const [id,pc] of state.peers){pc.close();if(write)void signal(id,'bye',{}).catch(()=>{})}
    state.peers.clear();
    for(const track of state.local?.getTracks()||[])track.stop();state.local=null;
    state.room=null;state.members=[];state.screenOwner=null;state.screenLeaseUntil=0;state.mediaError='';
    if(write)try{await rpc('connect_leave_room',{p_room:room.id})}catch(e){handleError(e)}
    renderMeeting();status(write?'You left the meeting.':'The meeting is no longer available.');
  }
  async function open(){
    const s=own();
    if(state.room&&state.me?.id===s?.user?.id&&$('#v122-videos')?.isConnected)return;
    if(!renderBase())return;if(!s?.access_token||!s?.user?.id){
      if(state.room)await leaveRoom(false);
      clearDeviceContacts();state.me=null;state.profile=null;state.selected=null;state.identities.clear();state.friends=[];state.requests=[];state.pending=[];state.messages=[];
      $('#v122-body').innerHTML='<div class="v122-panel"><h2>Sign in to Connect</h2><p>Meetings, friend requests and chat require a verified SCHOLAVERUM account.</p><button class="v122-btn lime" id="v122-signin">Sign in</button></div>';
      $('#v122-signin').onclick=()=>window.__SCHOLARK_V72_CLOUD__?.openAuth?.('signin');return;
    }
    const previous=state.me?.id;state.me=s.user;
    if(previous&&previous!==state.me.id){clearDeviceContacts();await leaveRoom(false);state.selected=null;state.profile=null;state.identities.clear();state.friends=[];state.requests=[];state.pending=[];state.messages=[]}
    try{
      const rows=await request('connect_identities?select=user_id,handle,display_name,searchable&user_id=eq.'+state.me.id+'&limit=1');
      state.profile=rows?.[0]||null;
      if(!state.profile){showProfile();return}
      state.identities.set(state.me.id,state.profile);
      await refresh();renderApp();
      const qp=new URLSearchParams(location.hash.split('?')[1]||'');
      if(qp.has('room')){setTab('meetings');renderMeeting()}
      status('Connect ready. Your personal messages and rooms are protected by account permissions.');
    }catch(e){handleError(e)}
  }
  window.addEventListener('scholark:auth-changed',()=>{if(location.hash.startsWith('#connect'))void open();else if(state.room)void leaveRoom(false)});
  window.addEventListener('scholark-workspace-change',e=>{if(state.room&&e.detail?.to!=='connect')void leaveRoom()});
  window.addEventListener('pagehide',()=>{clearDeviceContacts();stopTimers();stopScreen();for(const pc of state.peers.values())pc.close();for(const track of state.local?.getTracks()||[])track.stop()});
  window.addEventListener('hashchange',()=>{if(state.room&&!location.hash.startsWith('#connect'))void leaveRoom()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.selected&&location.hash.startsWith('#connect'))void loadDM()});
  // Poll private social data conservatively; room signaling uses a faster, bounded cycle.
  setInterval(()=>{if(document.hidden||!location.hash.startsWith('#connect')||!state.profile)return;
    if(!state.room){void refresh().then(renderFriends).catch(()=>{});if(state.selected)void loadDM()}
  },7000);
  window.__SCHOLARK_CONNECT__={open,leaveRoom,version:'r260-audio-nine-connect',getState:()=>({signedIn:!!state.me,profile:!!state.profile,friends:state.friends.length,meeting:!!state.room,participants:state.members.length})};
})();