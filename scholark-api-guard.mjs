import http from 'node:http';
import {createHash} from 'node:crypto';

const previousEmit = http.Server.prototype.emit;
const buckets = new Map();
let activeExpensive = 0;
const WINDOW_MS = 5 * 60 * 1000;
const MAX_CONCURRENT = 18;
const MAX_BUCKETS = 10000;
const testMode = /^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE || ''));

const rules = [
  { match:(m,p)=>m==='POST' && p==='/api/studio/generate', limit:testMode?80:30, maxBytes:3*1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/studio/image', limit:testMode?100:40, maxBytes:25*1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/studio/research', limit:testMode?80:30, maxBytes:2*1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p.startsWith('/api/learning/'), limit:testMode?240:120, maxBytes:1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/feedback', limit:testMode?80:12, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='GET' && p==='/api/account/export', limit:testMode?30:3, maxBytes:1024, expensive:true },
  { match:(m,p)=>m==='DELETE' && p==='/api/account', limit:testMode?20:3, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/portal', limit:testMode?80:8, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/checkout', limit:testMode?80:8, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/credits/checkout', limit:testMode?80:8, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/finalize', limit:testMode?80:20, maxBytes:16*1024, expensive:false }
];

function clientKey(req) {
  const auth=String(req.headers?.authorization||'').trim();
  if(/^Bearer\s+\S+/i.test(auth)){
    try{return 'auth:'+createHash('sha256').update(auth).digest('hex').slice(0,32)}catch{}
  }
  const cf = String(req.headers?.['cf-connecting-ip'] || '').trim();
  if (cf) return 'ip:'+cf.slice(0,120);
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  if (forwarded) return 'ip:'+forwarded.slice(0,120);
  return 'ip:'+String(req.socket?.remoteAddress || 'unknown').slice(0,120);
}

function securityHeaders(res) {
  if (res.headersSent) return;
  try {
    if (!res.hasHeader('x-content-type-options')) res.setHeader('x-content-type-options','nosniff');
    if (!res.hasHeader('referrer-policy')) res.setHeader('referrer-policy','strict-origin-when-cross-origin');
    if (!res.hasHeader('x-frame-options')) res.setHeader('x-frame-options','DENY');
    if (!res.hasHeader('cross-origin-opener-policy')) res.setHeader('cross-origin-opener-policy','same-origin-allow-popups');
    if (!res.hasHeader('cross-origin-resource-policy')) res.setHeader('cross-origin-resource-policy','same-origin');
    if (!res.hasHeader('permissions-policy')) res.setHeader('permissions-policy','geolocation=(self), camera=(), microphone=(), usb=()');
    if (!res.hasHeader('x-permitted-cross-domain-policies')) res.setHeader('x-permitted-cross-domain-policies','none');
    if (!res.hasHeader('x-dns-prefetch-control')) res.setHeader('x-dns-prefetch-control','off');
    if (!res.hasHeader('x-download-options')) res.setHeader('x-download-options','noopen');
    if (!res.hasHeader('origin-agent-cluster')) res.setHeader('origin-agent-cluster','?1');
    if (!res.hasHeader('content-security-policy')) res.setHeader('content-security-policy',"base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'");
    if (!res.hasHeader('strict-transport-security')) res.setHeader('strict-transport-security','max-age=31536000; includeSubDomains; preload');
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
    json(res,200,{ok:true,testMode,activeExpensive,trackedClients:buckets.size,windowSeconds:WINDOW_MS/1000,maxConcurrent:MAX_CONCURRENT,maxBuckets:MAX_BUCKETS,ruleCount:rules.length,originGuard:true,securityHeaders:true,requestBodyLimits:true,billingAndAccountGuards:true,jsonMutationGuard:true,tokenHashedRateKeys:true,frameEmbeddingBlocked:true,rateLimitMode:testMode?'test-bypass':'enforced'});
    return true;
  }

  if (String(req.url||'').length > 4096) {
    json(res,414,{ok:false,code:'URI_TOO_LONG',error:'Request URI is too long.'});
    return true;
  }

  const rule = rules.find(r => r.match(req.method,url.pathname));
  if (!rule) return previousEmit.call(this,type,...args);

  if (['POST','PUT','PATCH','DELETE'].includes(String(req.method||'').toUpperCase())) {
    const type=String(req.headers?.['content-type']||'').toLowerCase();
    if (!type.startsWith('application/json')) {
      json(res,415,{ok:false,code:'UNSUPPORTED_MEDIA_TYPE',error:'SCHOLARK API mutations require application/json.'});
      return true;
    }
  }

  if (!requestOriginAllowed(req)) {
    json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED',error:'Cross-origin request blocked.'});
    return true;
  }

  const declaredBytes = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(declaredBytes) && declaredBytes > Number(rule.maxBytes || Infinity)) {
    json(res,413,{ok:false,code:'REQUEST_TOO_LARGE',error:'Request body is too large for this SCHOLARK endpoint.'});
    return true;
  }

  if (testMode) {
    // CI/test containers exercise many independent browser and translation flows
    // through one loopback client. Keep every production protection below intact
    // (origin guard, body limits and expensive-request concurrency), but do not
    // let a synthetic single-IP test matrix exhaust the production rate bucket.
    res.setHeader('x-ratelimit-limit','test-bypass');
    res.setHeader('x-ratelimit-remaining','test-bypass');
  } else {
    const rate = consume(clientKey(req),url.pathname,rule.limit);
    res.setHeader('x-ratelimit-limit',String(rule.limit));
    res.setHeader('x-ratelimit-remaining',String(rate.remaining));
    if (!rate.allowed) {
      json(res,429,{ok:false,code:'RATE_LIMITED',error:'Too many requests. Please wait and try again.'},{'retry-after':String(rate.retryAfter)});
      return true;
    }
  }
  if (rule.expensive && activeExpensive >= MAX_CONCURRENT) {
    json(res,503,{ok:false,code:'SCHOLARK_BUSY',error:'SCHOLARK is handling many requests right now. Please retry shortly.'},{'retry-after':'3'});
    return true;
  }

  if(!rule.expensive)return previousEmit.call(this,type,...args);
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