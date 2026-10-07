const CACHE_VERSION='scholark-push-v1';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?.json?.()||{}}catch{data={body:event.data?.text?.()||''}}
  const title=String(data.title||'SCHOLARK').slice(0,180);
  const url=String(data.url||'/#dashboard');
  const options={
    body:String(data.body||'').slice(0,600),
    icon:'/scholark-logo.png',
    badge:'/scholark-logo.png',
    tag:String(data.tag||'scholark-notification').slice(0,180),
    renotify:false,
    requireInteraction:data.urgency==='high',
    data:{url,kind:String(data.kind||'general')},
    timestamp:Date.now()
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification?.data?.url||'/#dashboard';
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of windows){
      try{
        const target=new URL(url,self.location.origin);
        if(new URL(client.url).origin===target.origin){
          await client.focus();
          if('navigate' in client)await client.navigate(target.href);
          return;
        }
      }catch{}
    }
    return self.clients.openWindow(url);
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SCHOLARK_SKIP_WAITING')self.skipWaiting();
});
