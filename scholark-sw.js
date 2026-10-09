const safeNotificationUrl=raw=>{try{const u=new URL(String(raw||'/#dashboard'),self.location.origin);return u.origin===self.location.origin?u.href:new URL('/#dashboard',self.location.origin).href}catch{return new URL('/#dashboard',self.location.origin).href}};
self.addEventListener('push',event=>{
  let data={};try{data=event.data?event.data.json():{}}catch{try{data={body:event.data?.text?.()||''}}catch{}}
  const title=String(data.title||'SCHOLAVERUM');
  const options={body:String(data.body||''),tag:String(data.tag||'scholark-reminder'),renotify:false,icon:'/scholaverum-icon-512-r242.png',badge:'/scholaverum-icon-512-r242.png',timestamp:Date.now(),data:{url:safeNotificationUrl(data.url),kind:String(data.kind||'reminder')}};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=safeNotificationUrl(event.notification?.data?.url);
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    const same=list.find(c=>{try{return new URL(c.url).origin===self.location.origin}catch{return false}});
    if(same){same.navigate(target);return same.focus()}
    return clients.openWindow(target);
  }));
});
