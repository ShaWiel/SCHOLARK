import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const previousEmit = http.Server.prototype.emit;
const originalEnv = process.env;
const context = new AsyncLocalStorage();
const nativeFetch = globalThis.fetch.bind(globalThis);

const ROUTER_VERSION = '20260916-gemini-fallback-v1';
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
const retryableStatuses = new Set([404, 408, 429, 500, 502, 503, 504]);

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

// Retry only transient/capacity failures. Authentication, permission and malformed
// request errors are returned immediately so real configuration problems stay visible.
globalThis.fetch = async function scholarkGeminiFetch(input, init) {
  const store = context.getStore();
  const info = geminiRequestInfo(input);
  if (!store?.geminiPrimary || !liveEnabled || provider !== 'gemini' || !info) {
    return nativeFetch(input, init);
  }

  const requestedModel = info.model || primaryModel;
  const chain = [requestedModel, ...fallbackModels.filter(model => model !== requestedModel)];
  store.attemptedModels = [];
  store.actualGeminiModel = '';
  store.fallbackReason = '';
  let lastResponse = null;
  let lastError = null;

  for (let index = 0; index < chain.length; index += 1) {
    if (init?.signal?.aborted) {
      const aborted = new Error('Gemini request aborted');
      aborted.name = 'AbortError';
      throw aborted;
    }

    const model = chain[index];
    store.attemptedModels.push(model);
    const target = geminiUrlForModel(info.raw, model);

    try {
      const response = await nativeFetch(target, init);
      lastResponse = response;
      store.lastGeminiStatus = response.status;

      if (response.ok) {
        store.actualGeminiModel = model;
        store.fallbackUsed = model !== requestedModel;
        return response;
      }

      const shouldFallback = retryableStatuses.has(response.status) && index < chain.length - 1;
      if (!shouldFallback) return response;

      store.fallbackReason = `http_${response.status}`;
      // Drain failed response bodies before retrying so keep-alive connections can be reused.
      await response.arrayBuffer().catch(() => {});
    } catch (error) {
      if (init?.signal?.aborted || error?.name === 'AbortError') throw error;
      lastError = error;
      store.fallbackReason = 'network_error';
      if (index >= chain.length - 1) throw error;
    }

    // Small exponential backoff keeps failover fast while avoiding an immediate thundering herd.
    await sleep(Math.min(900, 150 * (2 ** index)));
  }

  if (lastResponse) return lastResponse;
  if (lastError) throw lastError;
  return nativeFetch(input, init);
};

// Existing SCHOLARK test mode protects media/research/payment-adjacent test flows.
// This request-scoped environment view lets only core text-generation routes use
// Gemini without globally disabling those safeguards.
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
  set(target, prop, value, receiver) {
    return Reflect.set(target, prop, value, receiver);
  },
  has(target, prop) {
    if (context.getStore()?.geminiPrimary && liveEnabled && provider === 'gemini' && prop === 'GEMINI_FAST_MODEL') return true;
    return Reflect.has(target, prop);
  },
});

function json(res, status, body) {
  if (res.headersSent) return;
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  res.end(JSON.stringify(body));
}

function installResponseDiagnostics(res, store) {
  const originalEnd = res.end;
  res.end = function scholarkGeminiEnd(chunk, encoding, callback) {
    let nextChunk = chunk;
    if (store.actualGeminiModel && chunk != null) {
      const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : (typeof chunk === 'string' ? chunk : null);
      if (text && text.trimStart().startsWith('{')) {
        try {
          const body = JSON.parse(text);
          if (body?.provider === 'gemini') {
            body.model = store.actualGeminiModel;
            body.primaryModel = primaryModel;
            body.fallbackUsed = store.actualGeminiModel !== primaryModel;
            body.geminiAttempts = [...(store.attemptedModels || [])];
            if (body.fallbackUsed && store.fallbackReason) body.fallbackReason = store.fallbackReason;
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
      ok: liveEnabled && provider === 'gemini' && geminiConfigured,
      provider,
      model: primaryModel,
      primaryModel,
      fallbackModels,
      modelChain,
      fallbackEnabled: fallbackModels.length > 0,
      routerVersion: ROUTER_VERSION,
      liveEnabled,
      configured: geminiConfigured,
      globalTestMode: /^(1|true|yes|on)$/i.test(String(originalEnv.SCHOLARK_TEST_MODE || '')),
      scopedRoutes: [...AI_PATHS],
    });
    return true;
  }

  if (!AI_PATHS.has(pathname) || !liveEnabled || provider !== 'gemini') {
    return previousEmit.call(this, type, ...args);
  }

  const store = { geminiPrimary: true, attemptedModels: [], actualGeminiModel: '', fallbackUsed: false, fallbackReason: '' };
  installResponseDiagnostics(res, store);
  return context.run(store, () => previousEmit.call(this, type, ...args));
};

console.log(`[SCHOLARK] Gemini router ${ROUTER_VERSION} · primary ${primaryModel} · fallbacks ${fallbackModels.join(' -> ') || 'none'} · key ${geminiConfigured ? 'configured' : 'missing'}`);
