// SCHOLAVERUM Connect: optional, lazy LiveKit media client.
// Only used for explicitly marked SFU rooms. Mesh rooms never load this bundle.
(() => {
  'use strict';
  if(window.__SCHOLARK_CONNECT_SFU__)return;
  const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
  const KEY='sb_publishable_1f1KQE-QMOM8rR3RqvQlsw__79lCn6A';
  let scriptPromise=null;
  function loadSdk(){
    if(window.LivekitClient?.Room)return Promise.resolve(window.LivekitClient);
    if(scriptPromise)return scriptPromise;
    scriptPromise=new Promise((resolve,reject)=>{
      const tag=document.createElement('script');
      tag.src='scholark-livekit-client.umd.min.js';
      tag.async=true;
      tag.onload=()=>window.LivekitClient?.Room?resolve(window.LivekitClient):reject(Error('LiveKit media library is unavailable.'));
      tag.onerror=()=>reject(Error('Could not load the SCHOLAVERUM media library.'));
      document.head.appendChild(tag);
    }).catch(e=>{scriptPromise=null;throw e});
    return scriptPromise;
  }
  const safeId=s=>String(s||'').replace(/[^0-9a-z_-]/gi,'');
  async function connect(roomId,who,onStatus){
    if(!/^[0-9a-f-]{36}$/i.test(roomId))throw Error('Invalid meeting identifier.');
    const session=window.__SCHOLARK_V72_CLOUD__?.currentSession?.();
    if(!session?.access_token)throw Error('Sign in again to join this meeting.');
    const response=await fetch(SB+'/functions/v1/connect-media-token',{
      method:'POST',
      headers:{'apikey':KEY,'authorization':'Bearer '+session.access_token,
        'content-type':'application/json','accept':'application/json'},
      body:JSON.stringify({room_id:roomId}),cache:'no-store',
    });
    const cred=await response.json().catch(()=>null);
    if(!response.ok||cred?.mode!=='sfu'||!cred?.token||!/^wss:\/\//i.test(cred?.url||'')){
      throw Error(response.status===503?'SCHOLAVERUM video server is not ready yet. Chat remains available.':
        'Media access was denied. Please rejoin this meeting.');
    }
    const SDK=await loadSdk();
    const client=new SDK.Room({adaptiveStream:true,dynacast:true});
    let stopped=false;
    const current=new Map();
    function container(id,label){
      const host=document.getElementById('v122-videos');
      if(!host)return null;
      let wrapper=document.getElementById(id);
      if(!wrapper){wrapper=document.createElement('div');wrapper.className='v122-video';wrapper.id=id;
        const name=document.createElement('span');name.textContent=label;wrapper.appendChild(name);host.appendChild(wrapper)}
      return wrapper;
    }
    const addTrack=(track,participant)=>{
      if(stopped||!track||!['video','audio'].includes(track.kind))return;
      const identity=participant?.identity||'unknown';
      const local=identity===session.user.id;
      const trackKey=(local?'local-':'remote-')+safeId(identity)+'-'+safeId(track.sid||track.mediaStreamTrack?.id||track.kind);
      if(current.has(trackKey))return;
      const host=local?document.getElementById('v122-own-video'):container('v122-sfu-'+trackKey,who(identity));
      if(!host)return;
      const element=document.createElement(track.kind==='audio'?'audio':'video');
      element.autoplay=true;element.playsInline=true;if(local)element.muted=true;
      const original=local&&track.kind==='video'?document.getElementById('v122-local-video'):null;
      if(original){try{original.pause();original.style.display='none'}catch{}}
      try{track.attach(element)}catch{return}
      host.insertBefore(element,host.querySelector('span'));
      current.set(trackKey,{track,element,host,local});
      if(!local&&track.kind==='audio')void element.play().catch(()=>onStatus('Tap the meeting to allow sound playback.'));
    };
    function removeTrack(track,participant){
      for(const [key,value] of current){
        if(value.track===track&&(!participant||key.includes(safeId(participant.identity)))){
          try{track.detach(value.element)}catch{}
          value.element.remove();current.delete(key);
          if(!value.local&&value.host.id.startsWith('v122-sfu-'))value.host.remove();
        }
      }
    }
    client.on(SDK.RoomEvent.TrackSubscribed,(track,_publication,participant)=>addTrack(track,participant));
    client.on(SDK.RoomEvent.TrackUnsubscribed,(track,_publication,participant)=>removeTrack(track,participant));
    client.on(SDK.RoomEvent.LocalTrackPublished,(publication)=>addTrack(publication.track,client.localParticipant));
    client.on(SDK.RoomEvent.LocalTrackUnpublished,(publication)=>removeTrack(publication.track,client.localParticipant));
    client.on(SDK.RoomEvent.ParticipantDisconnected,(participant)=>{
      for(const value of [...current.values()]){
        if(value.host?.id.includes('remote-'+safeId(participant.identity)))removeTrack(value.track,participant);
      }
    });
    client.on(SDK.RoomEvent.Reconnecting,()=>onStatus('Reconnecting to SCHOLAVERUM media server…'));
    client.on(SDK.RoomEvent.Reconnected,()=>onStatus('Video connection restored.'));
    client.on(SDK.RoomEvent.Disconnected,()=>{if(!stopped)onStatus('Video connection interrupted. Meeting chat is still available.')});
    try{
      await client.connect(cred.url,cred.token,{autoSubscribe:true});
      for(const participant of client.remoteParticipants.values())
        for(const publication of participant.trackPublications.values())
          if(publication.track)addTrack(publication.track,participant);
      const media=await Promise.allSettled([
        client.localParticipant.setMicrophoneEnabled(true),
        client.localParticipant.setCameraEnabled(true),
      ]);
      if(media.every(x=>x.status==='rejected'))onStatus('Camera and microphone unavailable. Meeting chat still works.');
      else onStatus('Connected through SCHOLAVERUM SFU / TURN.');
    }catch(e){stopped=true;client.disconnect();throw e}
    return {
      async toggleMic(){const next=!client.localParticipant.isMicrophoneEnabled;await client.localParticipant.setMicrophoneEnabled(next);return next},
      async toggleCam(){const next=!client.localParticipant.isCameraEnabled;await client.localParticipant.setCameraEnabled(next);return next},
      async toggleScreen(){const next=!client.localParticipant.isScreenShareEnabled;await client.localParticipant.setScreenShareEnabled(next);return next},
      disconnect(){stopped=true;for(const value of current.values()){try{value.track.detach(value.element)}catch{}value.element.remove();if(value.host?.id.startsWith('v122-sfu-'))value.host.remove()}current.clear();client.disconnect()},
    };
  }
  window.__SCHOLARK_CONNECT_SFU__={connect,ready:()=>!!window.LivekitClient?.Room};
})();
