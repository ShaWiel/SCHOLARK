import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ui=read('scholark-v122-connect.js');
const runtime=read('scholark-runtime-loader.js');
const shell=read('scholark-v51-workspace-shell.js');
const docker=read('Dockerfile');
const migration=read('supabase/migrations/20261011_connect_native_friends_meetings_r258.sql');
const hardening=read('supabase/migrations/20261011_connect_security_hardening_r258.sql');
const roadmap=read('SCHOLAVERUM_CONNECT_ROADMAP.md');
const privacy=read('supabase/migrations/20261011_connect_private_discovery_r258.sql');
const reporting=read('supabase/migrations/20261011_connect_reporting_r258.sql');
const audioNine=read('supabase/migrations/20261012_connect_audio_nine_mesh_r260.sql');
const deviceContacts=read('supabase/migrations/20261012_connect_optin_contact_discovery_r261.sql');
const requireAll=(value,fragments,label)=>fragments.forEach(fragment=>assert.ok(value.includes(fragment),label+' missing '+fragment));
new Function(ui);
requireAll(runtime,["connect:['scholark-v122-connect.js']","'scholark-v122-connect.js'","'connect','schools'"],'Connect runtime');
requireAll(shell,["['connect','◉','Connect']","card('connect','◉','Connect'","id==='connect'","h.startsWith('#connect')"],'Connect workspace route');
requireAll(docker,['COPY scholark-v122-connect.js','ENV SCHOLARK_RELEASE=r258-native-connect'],'Connect Docker');
requireAll(ui,['connect_friend_request','connect_friend_action','connect_block','connect_report','data-friend-report','data-report','connect_send_message','connect_create_room','connect_join_room','connect_leave_room','connect_end_room','connect_signal','connect_room_message','RTCPeerConnection','getUserMedia','getDisplayMedia','v122-board','stopScreen()','scholark-workspace-change','pagehide','getState:'],'Connect UI core');
requireAll(migration,['enable row level security','connect_room_members','connect_signals','connect_member','connect_find_people','on conflict(room_id,user_id)','revoke insert,update,delete','gen_random_bytes(20)'],'Connect schema');
requireAll(hardening,['grant execute on function public.connect_member','Too many meeting updates','rate-limit','connect identities searchable and contacts'],'Connect security');
requireAll(privacy,['searchable set default false'],'Private discovery');
requireAll(reporting,['connect_reports','enable row level security','Daily report limit reached'],'Report moderation');
requireAll(audioNine,['max_participants between 2 and 9','max_participants set default 9','create or replace function public.connect_join_room','where id=p_room for update','r.invite_code<>p_code','connect_screen_share','screen_share_expires_at','45 seconds',"p_action not in ('claim'",'to authenticated'],'Voice calls, nine-person admission and exclusive screen sharing');
requireAll(ui,['getUserMedia({','video:false','audio:{echoCancellation:true','getDisplayMedia({video:{frameRate:','pc.addTransceiver(\'video\'','__screenSender','replaceTrack(track)','replaceTrack(null)','r260-audio-nine-connect'],'Audio-only WebRTC and screen-share negotiation');
for(const forbidden of ['id="v122-camera"','getVideoTracks()?.[0]||null','video:true})','VIDEO MEETING','up to four participants']){
  assert.ok(!ui.includes(forbidden),'Camera UI or old four-person text found: '+forbidden);
}
requireAll(ui,["$$('[data-report]',host).forEach","$$('[data-kick]',host).forEach"],'Every report/kick button must be bound');
requireAll(ui,["p_action:'claim'","p_action:'renew'","p_action:'release'","Another participant is already sharing","updateScreenShareControl()"],'One sharer per room');
assert.ok(!ui.includes('eight participants'),'Old eight-user cap remains in Connect copy');
requireAll(roadmap,['Priority 3','ARKI','AI Tutor','SFU','TURN'],'Deferred plans');
requireAll(deviceContacts,['contact_discovery_enabled boolean not null default false','enable row level security','revoke all on public.connect_contact_lookup_quota','create or replace function public.connect_find_contacts','u.email_confirmed_at is not null','u.phone_confirmed_at is not null','i.contact_discovery_enabled is true','connect_blocks','connect_friends','coalesce(cardinality(p_emails),0)+coalesce(cardinality(p_phones),0)>30','attempts<3','connect_set_contact_discovery','connect_contact_match_grants','g.expires_at>now()','to authenticated'],'Opt-in private contacts and throttling');
requireAll(ui,['navigator.contacts.select','connect_find_contacts','connect_set_contact_discovery','readVCF','readCSV','clearDeviceContacts()','v122-contact-optin-profile','wireDeviceContactDiscovery','Maximum contact file size','30 identifiers per search'],'Consent-only device contacts UI');
assert.ok(!/localStorage\.setItem\([^\n]*contact/i.test(ui),'Contact data must not be saved in localStorage');
assert.ok(!/getUserMedia\(\{[^\n]*video:true/.test(ui),'Webcam capture must stay disabled');
for(const forbidden of ['meet.google.com','teams.microsoft.com','join.skype.com','sdk.daily.co','livekit-client']){
  assert.ok(!ui.includes(forbidden),'Connect must not embed a third-party meeting application: '+forbidden);
}
const mockWindow={addEventListener(){},navigator:{},};
const mockDocument={createElement:()=>({id:'',textContent:''}),head:{appendChild(){}},addEventListener(){},querySelector(){return null}};
const sandbox={window:mockWindow,document:mockDocument,setInterval:()=>1,clearInterval(){},fetch:()=>{throw Error('Unexpected network call on initialization')},console,URLSearchParams,URL,MediaStream:function(){}};
vm.runInNewContext(ui,sandbox,{filename:'scholark-v122-connect.js'});
assert.equal(mockWindow.__SCHOLARK_CONNECT__.version,'r260-audio-nine-connect');
assert.equal(mockWindow.__SCHOLARK_CONNECT__.getState().friends,0);
assert.equal(mockWindow.__SCHOLARK_CONNECT__.getState().meeting,false);
console.log('SCHOLAVERUM CONNECT SMOKE PASS: voice-only mesh, nine seats, safe screen-share sender, privacy and host controls');
