import http from 'node:http';

const previousEmit = http.Server.prototype.emit;
const buckets = new Map();
let activeExpensive = 0;
const WINDOW_MS = 5 * 60 * 1000;
const MAX_CONCURRENT = 18;
const MAX_BUCKETS = 10000;
const testMode = /^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE || ''));

const rules = [
  { match:(m,p)=>m==='POST' && p==='/api/studio/generate', limit:testMode?80:30 },
  { match:(m,p)=>m==='POST' && p==='/api/studio/image', limit:testMode?100:40 },
  { match:(m,p)=>m==='POST' && p==='/api/studio/research', limit:testMode?80:30 },
  { match:(m,p)=>m==='POST' && p.startsWith('/api/learning/'), limit:testMode?240:120 }
];

function clientKey(req) {
  const cf = String(req.headers?.['cf-connecting-ip'] || '').trim();
  if (cf) return cf.slice(0,120);
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  if (forwarded) return forwarded.slice(0,120);
  return String(req.socket?.remoteAddress || 'unknown').slice(0,120);
}

function securityHeaders(res) {
  if (res.headersSent) return;
  try {
    if (!res.hasHeader('x-content-type-options')) res.setHeader('x-content-type-options','nosniff');
    if (!res.hasHeader('referrer-policy')) res.setHeader('referrer-policy','strict-origin-when-cross-origin');
    if (!res.hasHeader('x-frame-options')) res.setHeader('x-frame-options','SAMEORIGIN');
    if (!res.hasHeader('cross-origin-opener-policy')) res.setHeader('cross-origin-opener-policy','same-origin-allow-popups');
    if (!res.hasHeader('cross-origin-resource-policy')) res.setHeader('cross-origin-resource-policy','same-origin');
    if (!res.hasHeader('permissions-policy')) res.setHeader('permissions-policy','geolocation=(self), camera=(), microphone=(), payment=(), usb=()');
    if (!res.hasHeader('x-permitted-cross-domain-policies')) res.setHeader('x-permitted-cross-domain-policies','none');
    if (!res.hasHeader('content-security-policy')) res.setHeader('content-security-policy',"base-uri 'self'; object-src 'none'; frame-ancestors 'self'");
    if (!res.hasHeader('strict-transport-security')) res.setHeader('strict-transport-security','max-age=15552000; includeSubDomains');
  } catch {}
}

function json(res,status,obj,extra={}) {
  if (res.headersSent) return;
  securityHeaders(res);
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store',...extra});
  res.end(JSON.stringify(obj));
}

function consume(ip, path, limit) {
  const now = Date.now();
  const key = ip + '|' + path;
  if (!buckets.has(key) && buckets.size >= MAX_BUCKETS) {
    let removed = 0;
    for (const oldKey of buckets.keys()) {
      buckets.delete(oldKey);
      if (++removed >= 500) break;
    }
  }
  let b = buckets.get(key);
  if (!b || now - b.started >= WINDOW_MS) b = {started:now,count:0};
  b.count++;
  buckets.set(key,b);
  const remaining = Math.max(0,limit-b.count);
  return {allowed:b.count<=limit, remaining, retryAfter:Math.max(1,Math.ceil((WINDOW_MS-(now-b.started))/1000))};
}

function requestOriginAllowed(req) {
  const site = String(req.headers?.['sec-fetch-site'] || '').toLowerCase();
  if (site === 'cross-site') return false;
  const origin = String(req.headers?.origin || '').trim();
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host.toLowerCase();
    const forwardedHost = String(req.headers?.['x-forwarded-host'] || '').split(',')[0].trim().toLowerCase();
    const host = forwardedHost || String(req.headers?.host || '').trim().toLowerCase();
    return !!host && originHost === host;
  } catch { return false; }
}

http.Server.prototype.emit = function(type,...args) {
  if (type !== 'request') return previousEmit.call(this,type,...args);
  const [req,res] = args;
  securityHeaders(res);
  let url;
  try { url = new URL(req.url || '/','http://localhost'); }
  catch { return previousEmit.call(this,type,...args); }

  if (req.method === 'GET' && url.pathname === '/api/guard/health') {
    json(res,200,{ok:true,testMode,activeExpensive,trackedClients:buckets.size,windowSeconds:WINDOW_MS/1000,maxConcurrent:MAX_CONCURRENT,maxBuckets:MAX_BUCKETS,originGuard:true,securityHeaders:true});
    return true;
  }

  const rule = rules.find(r => r.match(req.method,url.pathname));
  if (!rule) return previousEmit.call(this,type,...args);

  if (!requestOriginAllowed(req)) {
    json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED',error:'Cross-origin request blocked.'});
    return true;
  }

  const rate = consume(clientKey(req),url.pathname,rule.limit);
  res.setHeader('x-ratelimit-limit',String(rule.limit));
  res.setHeader('x-ratelimit-remaining',String(rate.remaining));
  if (!rate.allowed) {
    json(res,429,{ok:false,code:'RATE_LIMITED',error:'Too many requests. Please wait and try again.'},{'retry-after':String(rate.retryAfter)});
    return true;
  }
  if (activeExpensive >= MAX_CONCURRENT) {
    json(res,503,{ok:false,code:'SCHOLARK_BUSY',error:'SCHOLARK is handling many requests right now. Please retry shortly.'},{'retry-after':'3'});
    return true;
  }

  activeExpensive++;
  let released = false;
  const release = () => { if (!released) { released = true; activeExpensive = Math.max(0,activeExpensive-1); } };
  res.once('finish',release);
  res.once('close',release);
  try { return previousEmit.call(this,type,...args); }
  catch (e) { release(); throw e; }
};

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS * 2;
  for (const [key,b] of buckets) if (b.started < cutoff) buckets.delete(key);
}, WINDOW_MS).unref?.();

console.log('[SCHOLARK] API guard ready');