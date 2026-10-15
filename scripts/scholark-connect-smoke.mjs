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
const requireAll=(value,fragments,label)=>fragments.forEach(fragment=>assert.ok(value.includes(fragment),label+' missing '+fragment));
new Function(ui);
requireAll(runtime,["connect:[]","'scholark-v122-connect.js'","'connect','schools'","connect:false"],'Coming Soon runtime');
requireAll(shell,["const COMING=[['connect','◉','Connect']","const INACTIVE=new Set(['connect','studio','book']);","if(INACTIVE.has(id)){showComingSoon(id);return}","h.startsWith('#connect')"],'Connect Coming Soon route');
requireAll(docker,['COPY scholark-v122-connect.js','ENV SCHOLARK_RELEASE=r268-auth-connect-hold'],'Connect Docker');
requireAll(ui,['connect_friend_request','connect_friend_action','connect_block','connect_report','data-friend-report','data-report','connect_send_message','connect_create_room','connect_join_room','connect_leave_room','connect_end_room','connect_signal','connect_room_message','RTCPeerConnection','getUserMedia','getDisplayMedia','v122-board','stopScreen()','scholark-workspace-change','pagehide','getState:'],'Connect UI core');
requireAll(migration,['enable row level security','connect_room_members','connect_signals','connect_member','connect_find_people','on conflict(room_id,user_id)','revoke insert,update,delete','gen_random_bytes(20)'],'Connect schema');
requireAll(hardening,['grant execute on function public.connect_member','Too many meeting updates','rate-limit','connect identities searchable and contacts'],'Connect security');
requireAll(privacy,['searchable set default false'],'Private discovery');
requireAll(reporting,['connect_reports','enable row level security','Daily report limit reached'],'Report moderation');
requireAll(roadmap,['Priority 3','ARKI','AI Tutor','SFU','TURN'],'Deferred plans');
for(const forbidden of ['meet.google.com','teams.microsoft.com','join.skype.com','sdk.daily.co','livekit-client']){
  assert.ok(!ui.includes(forbidden),'Connect must not embed a third-party meeting application: '+forbidden);
}
const mockWindow={addEventListener(){},navigator:{},};
const mockDocument={createElement:()=>({id:'',textContent:''}),head:{appendChild(){}},addEventListener(){},querySelector(){return null}};
const sandbox={window:mockWindow,document:mockDocument,setInterval:()=>1,clearInterval(){},fetch:()=>{throw Error('Unexpected network call on initialization')},console,URLSearchParams,URL,MediaStream:function(){}};
vm.runInNewContext(ui,sandbox,{filename:'scholark-v122-connect.js'});
assert.equal(mockWindow.__SCHOLARK_CONNECT__.version,'r268-coming-soon');
assert.equal(mockWindow.__SCHOLARK_CONNECT__.getState().available,false);
assert.equal(mockWindow.__SCHOLARK_CONNECT__.getState().comingSoon,true);
assert.equal(mockWindow.__SCHOLARK_CONNECT__.getState().meeting,false);
console.log('SCHOLAVERUM CONNECT COMING SOON PASS: navigation guarded, media and chat unavailable, protected code preserved');
