self.addEventListener('push',event=>{
  let data={};try{data=event.data?event.data.json():{}}catch{try{data={body:event.data?.text?.()||''}}catch{}}
  const title=String(data.title||'SCHOLARK');
  const options={body:String(data.body||''),tag:String(data.tag||'scholark-reminder'),renotify:false,icon:'/scholark-logo.png',badge:'/scholark-logo.png',data:{url:String(data.url||'/#dashboard'),kind:String(data.kind||'reminder')}};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification?.data?.url||'/#dashboard',self.location.origin).href;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    const same=list.find(c=>{try{return new URL(c.url).origin===self.location.origin}catch{return false}});
    if(same){same.navigate(target);return same.focus()}
    return clients.openWindow(target);
  }));
});
