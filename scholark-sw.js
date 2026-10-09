const SW_RELEASE='20261009-r247-push';
const safeNotificationUrl=raw=>{try{const u=new URL(String(raw||'/#dashboard'),self.location.origin);return u.origin===self.location.origin?u.href:new URL('/#dashboard',self.location.origin).href}catch{return new URL('/#dashboard',self.location.origin).href}};
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};try{data=event.data?event.data.json():{}}catch{try{data={body:event.data?.text?.()||''}}catch{}}
  const title=String(data.title||'SCHOLAVERUM'),kind=String(data.kind||'reminder'),tag=String(data.tag||('scholaverum-reminder-'+Date.now()));
  const options={body:String(data.body||''),tag,renotify:kind==='custom',requireInteraction:kind==='custom',silent:false,icon:'/scholaverum-icon-512-r242.png',badge:'/scholaverum-icon-512-r242.png',timestamp:Date.now(),data:{url:safeNotificationUrl(data.url),kind,tag}};
  event.waitUntil((async()=>{
    let displayOk=true,error='';
    try{await self.registration.showNotification(title,options)}catch(e){displayOk=false;error=String(e?.message||e||'notification display failed').slice(0,220)}
    try{
      const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      list.forEach(c=>c.postMessage({type:'scholark-push-received',tag,kind,displayOk,error,at:Date.now(),release:SW_RELEASE}));
    }catch{}
  })());
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=safeNotificationUrl(event.notification?.data?.url);
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    const same=list.find(c=>{try{return new URL(c.url).origin===self.location.origin}catch{return false}});
    if(same){same.navigate(target);return same.focus()}
    return self.clients.openWindow(target);
  }));
});