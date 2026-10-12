import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Genuine Chromium RTCPeerConnections using the same audio + empty-video
// transceiver topology as Connect. Nine *logical* participants on ONE runner:
// this does not validate NAT/TURN, device-specific CPU, or nine real uplinks.
const browser=await chromium.launch({
  headless:true,
  args:['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream']
});
try{
  const page=await browser.newPage();
  const observed=await page.evaluate(async()=>{
    const N=9;
    const audioCtx=new AudioContext();
    await audioCtx.resume();
    const oscillator=audioCtx.createOscillator();
    oscillator.frequency.value=440;
    const destination=audioCtx.createMediaStreamDestination();
    oscillator.connect(destination);
    oscillator.start();
    const originAudio=destination.stream.getAudioTracks()[0];
    const members=Array.from({length:N},(_,id)=>({
      id, audio:originAudio.clone(), links:new Map(), audioReceived:new Map(), videoReceived:new Map()
    }));
    const connections=[];
    const errors=[];
    const wait=async(predicate,ms=20000)=>{
      const until=Date.now()+ms;
      while(Date.now()<until){
        if(predicate())return true;
        await new Promise(r=>setTimeout(r,200));
      }
      return false;
    };
    try{
      // Build all 36 pairs (72 real RTCPeerConnections) without a media server.
      for(let a=0;a<N;a++)for(let b=a+1;b<N;b++){
        const left=members[a],right=members[b];
        const pcA=new RTCPeerConnection({iceServers:[]});
        const pcB=new RTCPeerConnection({iceServers:[]});
        const queuedA=[],queuedB=[];
        pcA.addTrack(left.audio,new MediaStream([left.audio]));
        pcB.addTrack(right.audio,new MediaStream([right.audio]));
        const videoA=pcA.addTransceiver('video',{direction:'sendrecv'}).sender;
        const videoB=pcB.addTransceiver('video',{direction:'sendrecv'}).sender;
        pcA.ontrack=e=>e.track.kind==='audio'
          ?left.audioReceived.set(b,e.track)
          :left.videoReceived.set(b,e.track);
        pcB.ontrack=e=>e.track.kind==='audio'
          ?right.audioReceived.set(a,e.track)
          :right.videoReceived.set(a,e.track);
        pcA.onicecandidate=e=>{
          if(!e.candidate)return;
          const c=e.candidate.toJSON();
          if(pcB.remoteDescription)void pcB.addIceCandidate(c).catch(x=>errors.push(String(x)));
          else queuedB.push(c);
        };
        pcB.onicecandidate=e=>{
          if(!e.candidate)return;
          const c=e.candidate.toJSON();
          if(pcA.remoteDescription)void pcA.addIceCandidate(c).catch(x=>errors.push(String(x)));
          else queuedA.push(c);
        };
        left.links.set(b,{pc:pcA,screen:videoA});
        right.links.set(a,{pc:pcB,screen:videoB});
        connections.push(pcA,pcB);
        await pcA.setLocalDescription(await pcA.createOffer());
        await pcB.setRemoteDescription(pcA.localDescription);
        await pcB.setLocalDescription(await pcB.createAnswer());
        await pcA.setRemoteDescription(pcB.localDescription);
        for(const c of queuedB)await pcB.addIceCandidate(c);
        for(const c of queuedA)await pcA.addIceCandidate(c);
      }
      const allConnected=await wait(()=>connections.every(pc=>pc.connectionState==='connected'),25000);
      if(!allConnected)throw Error('9-way local mesh not connected: '+JSON.stringify(
        connections.reduce((acc,pc)=>{acc[pc.connectionState]=(acc[pc.connectionState]||0)+1;return acc},{})
      ));
      if(!members.every(m=>m.audioReceived.size===N-1))
        throw Error('Missing audio receivers: '+members.map(m=>m.audioReceived.size).join(','));

      // No webcam was requested. Media starts without any video sender track.
      if(members.some(m=>[...m.links.values()].some(x=>x.screen.track)))
        throw Error('Video sender was nonempty before explicitly sharing the screen');

      // A synthetic display stream stands in for a user-clicked getDisplayMedia
      // track, so this also exercises real browser RTP rather than a mocked sender.
      const canvas=document.createElement('canvas');
      canvas.width=960;canvas.height=540;
      const paint=canvas.getContext('2d');
      let count=0;
      const draw=()=>{
        paint.fillStyle=count++%2?'white':'black';
        paint.fillRect(0,0,canvas.width,canvas.height);
        paint.fillStyle=count%2?'black':'white';
        paint.font='38px sans-serif';
        paint.fillText('SCHOLAVERUM screen sharing frame '+count,35,85);
      };
      draw();
      const animate=setInterval(draw,125);
      const screenStream=canvas.captureStream(8);
      const screenTrack=screenStream.getVideoTracks()[0];
      try{
        await Promise.all([...members[0].links.values()].map(x=>x.screen.replaceTrack(screenTrack)));
        const screenReceived=await wait(()=>[...members[0].links.keys()].every(id=>{
          const track=members[id].videoReceived.get(0);
          return track&&track.readyState==='live'&&!track.muted;
        }),15000);
        if(!screenReceived)throw Error('Screen track did not become active on all 8 remote receivers: '+
          [...members[0].links.keys()].map(id=>({
            id,received:members[id].videoReceived.has(0),muted:members[id].videoReceived.get(0)?.muted
          })).map(x=>JSON.stringify(x)).join(','));
        await Promise.all([...members[0].links.values()].map(x=>x.screen.replaceTrack(null)));
        return {logicalParticipants:N,rtcConnections:connections.length/2,
          audioReceivers:members.reduce((n,m)=>n+m.audioReceived.size,0),
          screenshareReceivers:N-1,realRtp:true,sharedScreenStopped:true};
      }finally{
        clearInterval(animate);
        screenTrack.stop();
      }
    }finally{
      for(const pc of connections)pc.close();
      for(const m of members)m.audio.stop();
      originAudio.stop();oscillator.stop();await audioCtx.close();
    }
  });
  assert.equal(observed.logicalParticipants,9);
  assert.equal(observed.rtcConnections,36);
  assert.equal(observed.audioReceivers,72);
  assert.equal(observed.screenshareReceivers,8);
  assert.equal(observed.sharedScreenStopped,true);
  console.log('CONNECT NINE LOGICAL RTC QA PASS: '+JSON.stringify(observed));
}finally{await browser.close()}
