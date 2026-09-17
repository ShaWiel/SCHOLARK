import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const previousEmit = http.Server.prototype.emit;
const originalEnv = process.env;
const context = new AsyncLocalStorage();
const nativeFetch = globalThis.fetch.bind(globalThis);

const ROUTER_VERSION = '20260917-gemini-resilience-v3';
const liveEnabled = /^(1|true|yes|on)$/i.test(String(originalEnv.SCHOLARK_AI_LIVE || ''));
const provider = String(originalEnv.SCHOLARK_AI_PROVIDER || 'gemini').trim().toLowerCase();
const primaryModel = String(originalEnv.GEMINI_PRIMARY_MODEL || originalEnv.GEMINI_FAST_MODEL || 'gemini-3.8-flash').trim() || 'gemini-3.8-flash';
const fallbackModels = [...new Set(
  String(originalEnv.GEMINI_FALLBACK_MODELS || 'gemini-3.7-flash,gemini-3.6-flash,gemini-3.5-flash-lite')
    .split(/[\s,]+/)
    .map(x => x.trim())
    .filter(Boolean)
    .filter(x => x !== primaryModel)
)];
const modelChain = [primaryModel, ...fallbackModels];
const geminiConfigured = Boolean(String(originalEnv.GEMINI_API_KEY || '').trim());
const pollinationsKey = String(originalEnv.POLLINATIONS_API_KEY || '').trim();
const pollinationsConfigured = Boolean(pollinationsKey && pollinationsKey !== 'false' && pollinationsKey !== 'sync: false' && pollinationsKey !== 'snyc: false');
const pollinationsModel = String(originalEnv.POLLINATIONS_BALANCED_MODEL || originalEnv.POLLINATIONS_MODEL || 'gpt-5.6-terra').trim() || 'gpt-5.6-terra';
const retryableStatuses = new Set([400, 404, 408, 409, 422, 425, 429, 500, 502, 503, 504]);
const modelState = new Map();
const BASE_COOLDOWN_MS = 45_000;
const MAX_COOLDOWN_MS = 5 * 60_000;

const AI_PATHS = new Set([
  '/api/studio/generate',
  '/api/studio/health',
  '/api/learning/generate',
  '/api/learning/health',
]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function geminiRequestInfo(input) {
  if (typeof input !== 'string' && !(input instanceof URL)) return null;
  const raw = String(input);
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (url.hostname !== 'generativelanguage.googleapis.com') return null;
  const match = url.pathname.match(/\/models\/([^/:]+):generateContent$/);
  if (!match) return null;
  return { raw, model: decodeURIComponent(match[1]) };
}

function geminiUrlForModel(raw, model) {
  const url = new URL(raw);
  url.pathname = url.pathname.replace(/(\/models\/)[^/:]+(:generateContent)$/, `$1${encodeURIComponent(model)}$2`);
  return url.toString();
}

function timeoutFor(store, index) {
  const studio = store?.pathname === '/api/studio/generate';
  const schedule = studio ? [42_000, 36_000, 32_000, 28_000] : [28_000, 24_000, 20_000, 18_000];
  return schedule[Math.min(index, schedule.length - 1)];
}

function stateFor(model) {
  if (!modelState.has(model)) modelState.set(model, { failures:0, cooldownUntil:0, lastReason:'', lastFailureAt:0, lastSuccessAt:0 });
  return modelState.get(model);
}

function markSuccess(model) {
  const s = stateFor(model);
  s.failures = 0;
  s.cooldownUntil = 0;
  s.lastReason = '';
  s.lastSuccessAt = Date.now();
}

function markFailure(model, reason) {
  const s = stateFor(model);
  s.failures = Math.min(8, (s.failures || 0) + 1);
  s.lastReason = reason;
  s.lastFailureAt = Date.now();
  const transient = reason === 'timeout' || reason === 'network_error' || /^http_(408|425|429|5\d\d)$/.test(reason);
  if (transient) s.cooldownUntil = Date.now() + Math.min(MAX_COOLDOWN_MS, BASE_COOLDOWN_MS * Math.max(1, 2 ** (s.failures - 1)));
}

function availableChain(requestedModel) {
  const raw = [requestedModel, ...fallbackModels.filter(model => model !== requestedModel)];
  const now = Date.now();
  const active = raw.filter(model => stateFor(model).cooldownUntil <= now);
  return active.length ? active : raw.slice().sort((a,b) => stateFor(a).cooldownUntil - stateFor(b).cooldownUntil);
}

function parseInitBody(init) {
  try { return typeof init?.body === 'string' ? JSON.parse(init.body) : null; }
  catch { return null; }
}

function syntheticGeminiResponse(text) {
  return new Response(JSON.stringify({ candidates:[{ content:{ parts:[{ text:String(text || '') }] } }] }), {
    status:200,
    headers:{ 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store' }
  });
}

async function emergencyPollinations(init, store) {
  if (!pollinationsConfigured) return null;
  const geminiBody = parseInitBody(init);
  if (!geminiBody) return null;
  const system = (geminiBody.systemInstruction?.parts || []).map(p => p?.text || '').filter(Boolean).join('\n');
  const user = (geminiBody.contents || []).flatMap(c => c?.parts || []).map(p => p?.text || '').filter(Boolean).join('\n');
  const schema = geminiBody.generationConfig?.responseJsonSchema;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), store?.pathname === '/api/studio/generate' ? 55_000 : 35_000);
  store.emergencyAttempted = true;
  try {
    const body = {
      model:pollinationsModel,
      stream:false,
      messages:[{role:'system',content:system || 'Return valid JSON only.'},{role:'user',content:user}],
    };
    if (schema) body.response_format = { type:'json_schema', json_schema:{ name:'scholark_emergency_result', strict:true, schema } };
    const response = await nativeFetch('https://gen.pollinations.ai/v1/chat/completions', {
      method:'POST',
      headers:{ authorization:`Bearer ${pollinationsKey}`, 'content-type':'application/json' },
      body:JSON.stringify(body),
      signal:controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      store.failures.push({ model:pollinationsModel, provider:'pollinations', reason:`http_${response.status}`, message:data?.error?.message || data?.message || 'Emergency provider failed' });
      return null;
    }
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      store.failures.push({ model:pollinationsModel, provider:'pollinations', reason:'empty_response' });
      return null;
    }
    store.actualProvider = 'pollinations';
    store.actualGeminiModel = pollinationsModel;
    store.fallbackUsed = true;
    store.fallbackReason = 'gemini_chain_exhausted';
    console.warn(`[SCHOLARK] Gemini chain exhausted; recovered with emergency Pollinations model ${pollinationsModel}`);
    return syntheticGeminiResponse(text);
  } catch (error) {
    store.failures.push({ model:pollinationsModel, provider:'pollinations', reason:controller.signal.aborted ? 'timeout' : 'network_error', message:String(error?.message || error) });
    return null;
  } finally {
    clearTimeout(timer);
  }
}

globalThis.fetch = async function scholarkGeminiFetch(input, init) {
  const store = context.getStore();
  const info = geminiRequestInfo(input);
  if (!store?.geminiPrimary || !liveEnabled || provider !== 'gemini' || !info) return nativeFetch(input, init);

  const requestedModel = info.model || primaryModel;
  const chain = availableChain(requestedModel);
  store.attemptedModels = [];
  store.actualGeminiModel = '';
  store.actualProvider = 'gemini';
  store.fallbackReason = '';
  store.failures = [];
  store.skippedModels = modelChain.filter(model => !chain.includes(model));

  for (let index = 0; index < chain.length; index += 1) {
    const model = chain[index];
    const target = geminiUrlForModel(info.raw, model);
    const timeoutMs = timeoutFor(store, index);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    store.attemptedModels.push(model);

    try {
      const response = await nativeFetch(target, { ...(init || {}), signal:controller.signal });
      store.lastGeminiStatus = response.status;
      if (response.ok) {
        markSuccess(model);
        store.actualGeminiModel = model;
        store.actualProvider = 'gemini';
        store.fallbackUsed = model !== requestedModel || store.skippedModels.length > 0;
        if (store.fallbackUsed) console.warn(`[SCHOLARK] Gemini recovered with ${model}; attempts ${store.attemptedModels.join(' -> ')}`);
        return response;
      }

      const reason = `http_${response.status}`;
      store.failures.push({ model, provider:'gemini', reason });
      markFailure(model, reason);
      const shouldFallback = retryableStatuses.has(response.status);
      if (!shouldFallback) return response;
      store.fallbackReason = reason;
      await response.arrayBuffer().catch(() => {});
    } catch (error) {
      const timedOut = controller.signal.aborted;
      const reason = timedOut ? 'timeout' : 'network_error';
      store.failures.push({ model, provider:'gemini', reason, message:timedOut ? `Timed out after ${Math.round(timeoutMs / 1000)}s` : String(error?.message || 'Network error') });
      markFailure(model, reason);
      store.fallbackReason = reason;
    } finally {
      clearTimeout(timer);
    }

    if (index < chain.length - 1) await sleep(Math.min(700, 120 * (2 ** index)));
  }

  const emergency = await emergencyPollinations(init, store);
  if (emergency) return emergency;

  const error = new Error('All Gemini models and emergency providers failed');
  error.code = 'AI_PROVIDER_CHAIN_FAILED';
  throw error;
};

// Core text-generation routes use the live Gemini router while the rest of SCHOLARK can
// remain in safe testing mode. Other provider keys are hidden from the route itself so
// Gemini stays primary; this router can still use the original keys for emergency failover.
process.env = new Proxy(originalEnv, {
  get(target, prop, receiver) {
    const store = context.getStore();
    if (store?.geminiPrimary && liveEnabled && provider === 'gemini') {
      if (prop === 'SCHOLARK_TEST_MODE') return '0';
      if (prop === 'GEMINI_FAST_MODEL') return primaryModel;
      if (prop === 'POLLINATIONS_API_KEY' || prop === 'OPENAI_API_KEY') return '';
    }
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) { return Reflect.set(target, prop, value, receiver); },
  has(target, prop) {
    if (context.getStore()?.geminiPrimary && liveEnabled && provider === 'gemini' && prop === 'GEMINI_FAST_MODEL') return true;
    return Reflect.has(target, prop);
  },
});

function json(res, status, body) {
  if (res.headersSent) return;
  res.writeHead(status, {
    'content-type':'application/json; charset=utf-8',
    'cache-control':'no-store',
    'x-content-type-options':'nosniff',
  });
  res.end(JSON.stringify(body));
}

function publicModelHealth() {
  const now = Date.now();
  return Object.fromEntries(modelChain.map(model => {
    const s = stateFor(model);
    return [model, {
      failures:s.failures,
      coolingDown:s.cooldownUntil > now,
      cooldownSeconds:s.cooldownUntil > now ? Math.ceil((s.cooldownUntil - now) / 1000) : 0,
      lastReason:s.lastReason || null,
      lastFailureAt:s.lastFailureAt || null,
      lastSuccessAt:s.lastSuccessAt || null,
    }];
  }));
}

function installResponseDiagnostics(res, store) {
  const originalEnd = res.end;
  res.end = function scholarkGeminiEnd(chunk, encoding, callback) {
    let nextChunk = chunk;
    if (chunk != null) {
      const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : (typeof chunk === 'string' ? chunk : null);
      if (text && text.trimStart().startsWith('{')) {
        try {
          const body = JSON.parse(text);
          if (body?.ok !== false && store.actualGeminiModel) {
            body.provider = store.actualProvider || body.provider || 'gemini';
            body.model = store.actualGeminiModel;
            body.primaryModel = primaryModel;
            body.fallbackUsed = Boolean(store.fallbackUsed);
            body.geminiAttempts = [...(store.attemptedModels || [])];
            if (store.skippedModels?.length) body.geminiSkipped = [...store.skippedModels];
            if (store.fallbackReason) body.fallbackReason = store.fallbackReason;
            if (store.failures?.length) body.geminiFailures = [...store.failures];
            if (store.actualProvider && store.actualProvider !== 'gemini') body.emergencyProvider = store.actualProvider;
            nextChunk = JSON.stringify(body);
            if (res.hasHeader?.('content-length')) res.removeHeader('content-length');
          } else if (body?.ok === false && store.attemptedModels?.length) {
            body.geminiAttempts = [...store.attemptedModels];
            body.geminiFailures = [...(store.failures || [])];
            body.primaryModel = primaryModel;
            nextChunk = JSON.stringify(body);
            if (res.hasHeader?.('content-length')) res.removeHeader('content-length');
          }
        } catch {}
      }
    }
    if (nextChunk === chunk) return originalEnd.apply(this, arguments);
    if (typeof encoding === 'function') return originalEnd.call(this, nextChunk, encoding);
    return originalEnd.call(this, nextChunk, encoding, callback);
  };
}

http.Server.prototype.emit = function(type, ...args) {
  if (type !== 'request') return previousEmit.call(this, type, ...args);
  const [req, res] = args;
  let pathname = '';
  try { pathname = new URL(req.url || '/', 'http://localhost').pathname; }
  catch { return previousEmit.call(this, type, ...args); }

  if (req.method === 'GET' && pathname === '/api/gemini/health') {
    json(res, 200, {
      ok:liveEnabled && provider === 'gemini' && geminiConfigured,
      provider,
      model:primaryModel,
      primaryModel,
      fallbackModels,
      modelChain,
      fallbackEnabled:fallbackModels.length > 0,
      routerVersion:ROUTER_VERSION,
      liveEnabled,
      configured:geminiConfigured,
      emergencyProviders:{ pollinations:pollinationsConfigured, model:pollinationsConfigured ? pollinationsModel : null },
      globalTestMode:/^(1|true|yes|on)$/i.test(String(originalEnv.SCHOLARK_TEST_MODE || '')),
      scopedRoutes:[...AI_PATHS],
      modelHealth:publicModelHealth(),
    });
    return true;
  }

  if (!AI_PATHS.has(pathname) || !liveEnabled || provider !== 'gemini') return previousEmit.call(this, type, ...args);

  const store = {
    geminiPrimary:true,
    pathname,
    attemptedModels:[],
    skippedModels:[],
    actualGeminiModel:'',
    actualProvider:'gemini',
    fallbackUsed:false,
    fallbackReason:'',
    failures:[],
    emergencyAttempted:false,
  };
  installResponseDiagnostics(res, store);
  return context.run(store, () => previousEmit.call(this, type, ...args));
};

console.log(`[SCHOLARK] Gemini router ${ROUTER_VERSION} · primary ${primaryModel} · fallbacks ${fallbackModels.join(' -> ') || 'none'} · emergency Pollinations ${pollinationsConfigured ? pollinationsModel : 'off'} · key ${geminiConfigured ? 'configured' : 'missing'}`);
