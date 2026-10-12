import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// A real WebRTC RTP transport test inside Chromium: eight peer connections,
// actual audio tracks plus one canvas video track sent to eight receivers.
// This deliberately uses loopback ICE, NOT nine physical devices or TURN.
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream']});
try{
  const context=await browser.newContext({viewport:{width:1000,height:720}});
  const page=await context.newPage();
  await page.setContent('<main><h1>SCHOLAVERUM Connect RTP QA</h1></main>');
  const result=await page.evaluate(async()=>{
    const wait=async(test,ms,label)=>{
      const start=performance.now();
      while(performance.now()-start<ms){
        if(test())return true;
        await new Promise(r=>setTimeout(r,100));
      }
      throw Error('Timeout waiting for '+label);
    };
    const audioContext=new AudioContext();
    const audioDestination=audioContext.createMediaStreamDestination();
    const generator=audioContext.createOscillator();
    generator.frequency.value=280;
    generator.connect(audioDestination);
    generator.start();
    await audioContext.resume();
    const audio=audioDestination.stream.getAudioTracks()[0];
    if(!audio)throw Error('No generated WebAudio stream track');

    const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;
    canvas.style.cssText='display:block;width:320px;height:180px;';
    document.body.append(canvas);
    const ctx=canvas.getContext('2d');
    let frame=0;
    const draw=()=>{
      ctx.fillStyle='#122f45';ctx.fillRect(0,0,320,180);
      ctx.fillStyle='#ffffff';ctx.font='bold 24px sans-serif';
      ctx.fillText('SCHOLAVERUM',30,70);
      ctx.fillText('FRAME '+frame++,30,110);
    };
    draw();
    const drawTimer=setInterval(draw,100);
    const displayTrack=canvas.captureStream(8).getVideoTracks()[0];
    if(!displayTrack)throw Error('No canvas video track');

    const links=[];
    try{
      for(let i=0;i<8;i++){
        const senderPC=new RTCPeerConnection({iceServers:[]});
        const receiverPC=new RTCPeerConnection({iceServers:[]});
        const pendingToReceiver=[],pendingToSender=[];
        const forward=(pc,pending,candidate)=>{
          if(pc.remoteDescription)void pc.addIceCandidate(candidate).catch(()=>{});
          else pending.push(candidate);
        };
        senderPC.onicecandidate=e=>{if(e.candidate)forward(receiverPC,pendingToReceiver,e.candidate)};
        receiverPC.onicecandidate=e=>{if(e.candidate)forward(senderPC,pendingToSender,e.candidate)};
        const remoteTracks={audio:[],video:[]};
        const video=document.createElement('video');video.muted=true;video.autoplay=true;video.playsInline=true;
        video.style.width='160px';document.body.appendChild(video);
        receiverPC.ontrack=e=>{
          remoteTracks[e.track.kind]?.push(e.track);
          if(e.track.kind==='video'){
            video.srcObject=new MediaStream([e.track]);
            void video.play().catch(()=>{});
          }
        };
        // Actual audio RTP is exchanged; screen video sender begins empty.
        senderPC.addTrack(audio,audioDestination.stream);
        receiverPC.addTrack(audio,audioDestination.stream);
        const screenSender=senderPC.addTransceiver('video',{direction:'sendrecv'}).sender;
        const offer=await senderPC.createOffer();
        await senderPC.setLocalDescription(offer);
        await receiverPC.setRemoteDescription(offer);
        const answer=await receiverPC.createAnswer();
        await receiverPC.setLocalDescription(answer);
        await senderPC.setRemoteDescription(answer);
        for(const c of pendingToReceiver)await receiverPC.addIceCandidate(c);
        for(const c of pendingToSender)await senderPC.addIceCandidate(c);
        links.push({senderPC,receiverPC,screenSender,video,remoteTracks});
      }
      await wait(()=>links.every(x=>
        x.senderPC.connectionState==='connected'&&x.receiverPC.connectionState==='connected'
        &&x.remoteTracks.audio.length>0),25000,'eight audio connections');
      if(links.some(x=>x.screenSender.track!==null))throw Error('Camera/display video published before consent');
      await Promise.all(links.map(x=>x.screenSender.replaceTrack(displayTrack)));
      await wait(()=>links.every(x=>x.video.videoWidth>0&&x.remoteTracks.video.some(t=>!t.muted)),25000,'eight screen receivers');
      const connected=links.filter(x=>x.senderPC.connectionState==='connected').length;
      const screens=links.filter(x=>x.video.videoWidth>0).length;
      await Promise.all(links.map(x=>x.screenSender.replaceTrack(null)));
      await wait(()=>links.every(x=>x.screenSender.track===null),5000,'screenshare stop');
      return {connected,remoteAudio:links.filter(x=>x.remoteTracks.audio.length>0).length,
        screenReceivers:screens,videoPublishedInitially:false,screenStopped:true};
    }finally{
      clearInterval(drawTimer);displayTrack.stop();
      for(const link of links){link.senderPC.close();link.receiverPC.close();link.video.remove()}
      generator.stop();audio.stop();await audioContext.close();
      canvas.remove();
    }
  });
  assert.equal(result.connected,8,'Nine-person host did not reach eight receivers');
  assert.equal(result.remoteAudio,8,'Audio RTP track did not reach eight receivers');
  assert.equal(result.screenReceivers,8,'Actual screen frame did not reach eight receivers');
  assert.equal(result.videoPublishedInitially,false,'Screen started before user action');
  assert.equal(result.screenStopped,true,'Screen track remained after stopping');
  console.log('CONNECT WEBRTC RTP LOOPBACK PASS: '+JSON.stringify(result));
  await context.close();
}finally{await browser.close()}
