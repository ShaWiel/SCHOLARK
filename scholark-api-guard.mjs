import http from 'node:http';
import {createHash} from 'node:crypto';

const previousEmit = http.Server.prototype.emit;
const buckets = new Map();
const activeExpensiveByClient = new Map();
let activeExpensive = 0;
const WINDOW_MS = 5 * 60 * 1000;
const MAX_CONCURRENT = 18;
const MAX_CONCURRENT_PER_CLIENT = 6;
const MAX_BUCKETS = 10000;
const testMode = /^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE || ''));
const HEALTH_STARTED_AT = Date.now();
const HEALTH_RELEASE = String(process.env.SCHOLARK_RELEASE || 'dev');

const rules = [
  { match:(m,p)=>m==='POST' && p==='/api/studio/generate', limit:testMode?80:30, maxBytes:3*1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/studio/image', limit:testMode?100:40, maxBytes:25*1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/studio/research', limit:testMode?80:30, maxBytes:2*1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p.startsWith('/api/learning/'), limit:testMode?240:120, maxBytes:1024*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/feedback', limit:testMode?80:12, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/security/step-up', limit:testMode?100:20, maxBytes:4*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/schools/search', limit:testMode?180:36, maxBytes:16*1024, expensive:true },
  { match:(m,p)=>m==='POST' && p==='/api/schools/location', limit:testMode?180:45, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/schools/reviews', limit:testMode?100:18, maxBytes:12*1024, expensive:true },
  { match:(m,p)=>m==='GET' && p==='/api/notifications/preferences', limit:testMode?240:90, maxBytes:1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/notifications/preferences', limit:testMode?180:45, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/notifications/subscription', limit:testMode?160:30, maxBytes:32*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/notifications/unsubscribe', limit:testMode?160:30, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/notifications/test', limit:testMode?100:10, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/notifications/dispatch', limit:testMode?600:180, maxBytes:4*1024, expensive:false },
  { match:(m,p)=>m==='GET' && p==='/api/account/export', limit:testMode?30:3, maxBytes:1024, expensive:true },
  { match:(m,p)=>m==='DELETE' && p==='/api/account', limit:testMode?20:3, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/portal', limit:testMode?80:8, maxBytes:8*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/checkout', limit:testMode?80:8, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/credits/checkout', limit:testMode?80:8, maxBytes:16*1024, expensive:false },
  { match:(m,p)=>m==='POST' && p==='/api/billing/finalize', limit:testMode?80:20, maxBytes:16*1024, expensive:false }
];

function sourceIp(req) {
  const cf = String(req.headers?.['cf-connecting-ip'] || '').trim();
  if (cf) return cf.slice(0,120);
  const real = String(req.headers?.['x-real-ip'] || '').trim();
  if (real) return real.slice(0,120);
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  if (forwarded) return forwarded.slice(0,120);
  return String(req.socket?.remoteAddress || 'unknown').slice(0,120);
}

function clientKey(req) {
  // Rate limiting must never trust an unverified Bearer string. Hash only the
  // network source so rotating fake tokens cannot create fresh abuse buckets.
  try{return 'ip:'+createHash('sha256').update(sourceIp(req)).digest('hex').slice(0,32)}
  catch{return 'ip:unknown'}
}

function securityHeaders(res) {
  if (res.headersSent) return;
  try {
    if (!res.hasHeader('x-content-type-options')) res.setHeader('x-content-type-options','nosniff');
    if (!res.hasHeader('referrer-policy')) res.setHeader('referrer-policy','strict-origin-when-cross-origin');
    if (!res.hasHeader('x-frame-options')) res.setHeader('x-frame-options','DENY');
    if (!res.hasHeader('cross-origin-opener-policy')) res.setHeader('cross-origin-opener-policy','same-origin-allow-popups');
    if (!res.hasHeader('cross-origin-resource-policy')) res.setHeader('cross-origin-resource-policy','same-origin');
    if (!res.hasHeader('permissions-policy')) res.setHeader('permissions-policy','geolocation=(self), camera=(), microphone=(), usb=(), payment=(self), publickey-credentials-get=(self), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()');
    if (!res.hasHeader('x-permitted-cross-domain-policies')) res.setHeader('x-permitted-cross-domain-policies','none');
    if (!res.hasHeader('x-dns-prefetch-control')) res.setHeader('x-dns-prefetch-control','off');
    if (!res.hasHeader('x-download-options')) res.setHeader('x-download-options','noopen');
    if (!res.hasHeader('origin-agent-cluster')) res.setHeader('origin-agent-cluster','?1');
    if (!res.hasHeader('content-security-policy')) res.setHeader('content-security-policy',"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://cdn.paddle.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; connect-src 'self' https://yhafbwdnnpvuedycdkll.supabase.co wss://yhafbwdnnpvuedycdkll.supabase.co https://api.paddle.com https://sandbox-api.paddle.com https://*.paddle.com https://challenges.cloudflare.com; frame-src https://*.paddle.com https://challenges.cloudflare.com; worker-src 'self' blob:; manifest-src 'self'");
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

function hardenServer(server) {
  if (!server || server.__scholarkTransportHardened) return;
  server.__scholarkTransportHardened = true;
  try { server.requestTimeout = 120000; } catch {}
  try { server.headersTimeout = 20000; } catch {}
  try { server.keepAliveTimeout = 5000; } catch {}
  try { server.maxHeadersCount = 100; } catch {}
  try { server.maxRequestsPerSocket = 250; } catch {}
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
  hardenServer(this);
  securityHeaders(res);
  let url;
  try { url = new URL(req.url || '/','http://localhost'); }
  catch { return previousEmit.call(this,type,...args); }

  // Render needs a dependency-free liveness signal as soon as the Node server
  // accepts requests. Keep this endpoint intentionally local: no Supabase,
  // Paddle, AI provider, geocoder or startup self-test may delay/degrade it.
  if (req.method === 'GET' && url.pathname === '/api/health') {
    json(res,200,{ok:true,service:'scholark',release:HEALTH_RELEASE,healthSource:'api-guard',uptimeSeconds:Math.max(0,Math.round((Date.now()-HEALTH_STARTED_AT)/1000))});
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/guard/health') {
    json(res,200,{ok:true,testMode,activeExpensive,trackedClients:buckets.size,trackedConcurrentClients:activeExpensiveByClient.size,windowSeconds:WINDOW_MS/1000,maxConcurrent:MAX_CONCURRENT,maxConcurrentPerClient:MAX_CONCURRENT_PER_CLIENT,maxBuckets:MAX_BUCKETS,ruleCount:rules.length,originGuard:true,securityHeaders:true,requestBodyLimits:true,billingAndAccountGuards:true,schoolDiscoveryGuards:true,pushNotificationGuards:true,securityStepUpGuard:true,jsonMutationGuard:true,strictApiMethods:true,strictMutationOrigin:true,ipHashedRateKeys:true,bearerRotationSafe:true,sensitiveQueryGuard:true,frameEmbeddingBlocked:true,perClientConcurrencyGuard:true,apiNoStore:true,transportHardening:true,requestTimeoutMs:120000,headersTimeoutMs:20000,maxHeadersCount:100,maxRequestsPerSocket:250,rateLimitMode:testMode?'test-bypass':'enforced'});
    return true;
  }

  if (url.pathname.startsWith('/api/') && !res.hasHeader('cache-control')) res.setHeader('cache-control','no-store');

  if (url.pathname.startsWith('/api/') && !['GET','POST','DELETE','OPTIONS'].includes(String(req.method||'').toUpperCase())) {
    json(res,405,{ok:false,code:'METHOD_NOT_ALLOWED',error:'HTTP method is not allowed for SCHOLARK APIs.'},{allow:'GET, POST, DELETE, OPTIONS'});
    return true;
  }

  if (url.pathname.startsWith('/api/') && ['POST','DELETE'].includes(String(req.method||'').toUpperCase()) && url.pathname!=='/api/billing/webhook' && !requestOriginAllowed(req)) {
    json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED',error:'Cross-origin request blocked.'});
    return true;
  }

  if (String(req.url||'').length > 4096) {
    json(res,414,{ok:false,code:'URI_TOO_LONG',error:'Request URI is too long.'});
    return true;
  }

  if (url.pathname.startsWith('/api/')) {
    for (const key of url.searchParams.keys()) {
      if (/^(access_token|refresh_token|token|authorization|api_?key|apikey|password|secret)$/i.test(String(key))) {
        json(res,400,{ok:false,code:'SENSITIVE_QUERY_BLOCKED',error:'Sensitive credentials must not be sent in the URL.'});
        return true;
      }
    }
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

  const client = clientKey(req);
  if (testMode) {
    // CI/test containers exercise many independent browser and translation flows
    // through one loopback client. Keep every production protection below intact
    // (origin guard, body limits and expensive-request concurrency), but do not
    // let a synthetic single-IP test matrix exhaust the production rate bucket.
    res.setHeader('x-ratelimit-limit','test-bypass');
    res.setHeader('x-ratelimit-remaining','test-bypass');
  } else {
    const rate = consume(client,url.pathname,rule.limit);
    res.setHeader('x-ratelimit-limit',String(rule.limit));
    res.setHeader('x-ratelimit-remaining',String(rate.remaining));
    if (!rate.allowed) {
      json(res,429,{ok:false,code:'RATE_LIMITED',error:'Too many requests. Please wait and try again.'},{'retry-after':String(rate.retryAfter)});
      return true;
    }
  }
  if (rule.expensive && (activeExpensiveByClient.get(client)||0) >= MAX_CONCURRENT_PER_CLIENT) {
    json(res,429,{ok:false,code:'CLIENT_CONCURRENCY_LIMIT',error:'Too many concurrent SCHOLARK requests from this client. Please retry shortly.'},{'retry-after':'2'});
    return true;
  }
  if (rule.expensive && activeExpensive >= MAX_CONCURRENT) {
    json(res,503,{ok:false,code:'SCHOLARK_BUSY',error:'SCHOLARK is handling many requests right now. Please retry shortly.'},{'retry-after':'3'});
    return true;
  }

  if(!rule.expensive)return previousEmit.call(this,type,...args);
  activeExpensive++;
  activeExpensiveByClient.set(client,(activeExpensiveByClient.get(client)||0)+1);
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeExpensive = Math.max(0,activeExpensive-1);
    const left=Math.max(0,(activeExpensiveByClient.get(client)||1)-1);
    if(left)activeExpensiveByClient.set(client,left);else activeExpensiveByClient.delete(client);
  };
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