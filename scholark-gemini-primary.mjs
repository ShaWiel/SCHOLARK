import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const previousEmit = http.Server.prototype.emit;
const originalEnv = process.env;
const context = new AsyncLocalStorage();
const nativeFetch = globalThis.fetch.bind(globalThis);

const ROUTER_VERSION = '20260917-gemini-fallback-v2';
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
const retryableStatuses = new Set([400, 404, 408, 409, 422, 429, 500, 502, 503, 504]);
const attemptTimeoutsMs = [45_000, 38_000, 32_000, 28_000];

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

// Gemini requests get a fresh timeout per model. Studio and Tutor previously shared one
// route-wide AbortSignal, so a slow primary could consume the whole 90-second budget and
// abort the fallback chain before a healthy model was tried.
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
  store.failures = [];

  for (let index = 0; index < chain.length; index += 1) {
    const model = chain[index];
    const target = geminiUrlForModel(info.raw, model);
    const timeoutMs = attemptTimeoutsMs[Math.min(index, attemptTimeoutsMs.length - 1)];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    store.attemptedModels.push(model);

    try {
      // Intentionally replace the caller's route-wide signal with a model-specific one.
      // Each attempt stays bounded, while one slow model can no longer kill all fallbacks.
      const response = await nativeFetch(target, { ...(init || {}), signal: controller.signal });
      store.lastGeminiStatus = response.status;

      if (response.ok) {
        store.actualGeminiModel = model;
        store.fallbackUsed = model !== requestedModel;
        if (store.fallbackUsed) {
          console.warn(`[SCHOLARK] Gemini recovered with ${model} after ${store.attemptedModels.slice(0, -1).join(' -> ')}`);
        }
        return response;
      }

      const failure = { model, reason: `http_${response.status}` };
      store.failures.push(failure);
      const shouldFallback = retryableStatuses.has(response.status) && index < chain.length - 1;
      if (!shouldFallback) return response;

      store.fallbackReason = failure.reason;
      await response.arrayBuffer().catch(() => {});
    } catch (error) {
      const timedOut = controller.signal.aborted;
      const failure = {
        model,
        reason: timedOut ? 'timeout' : 'network_error',
        message: timedOut ? `Timed out after ${Math.round(timeoutMs / 1000)}s` : String(error?.message || 'Network error'),
      };
      store.failures.push(failure);
      store.fallbackReason = failure.reason;

      if (index >= chain.length - 1) {
        const finalError = timedOut
          ? new Error(`Gemini fallback chain timed out on ${model}`)
          : error;
        if (timedOut) {
          finalError.name = 'TimeoutError';
          finalError.code = 'GEMINI_TIMEOUT';
        }
        throw finalError;
      }
    } finally {
      clearTimeout(timer);
    }

    await sleep(Math.min(900, 150 * (2 ** index)));
  }

  throw new Error('Gemini fallback chain ended without a response');
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
    if (chunk != null) {
      const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : (typeof chunk === 'string' ? chunk : null);
      if (text && text.trimStart().startsWith('{')) {
        try {
          const body = JSON.parse(text);
          if (body?.provider === 'gemini' && store.actualGeminiModel) {
            body.model = store.actualGeminiModel;
            body.primaryModel = primaryModel;
            body.fallbackUsed = store.actualGeminiModel !== primaryModel;
            body.geminiAttempts = [...(store.attemptedModels || [])];
            if (body.fallbackUsed && store.fallbackReason) body.fallbackReason = store.fallbackReason;
            if (store.failures?.length) body.geminiFailures = [...store.failures];
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
      attemptTimeoutsSeconds: attemptTimeoutsMs.map(ms => Math.round(ms / 1000)),
    });
    return true;
  }

  if (!AI_PATHS.has(pathname) || !liveEnabled || provider !== 'gemini') {
    return previousEmit.call(this, type, ...args);
  }

  const store = {
    geminiPrimary: true,
    attemptedModels: [],
    actualGeminiModel: '',
    fallbackUsed: false,
    fallbackReason: '',
    failures: [],
  };
  installResponseDiagnostics(res, store);
  return context.run(store, () => previousEmit.call(this, type, ...args));
};

console.log(`[SCHOLARK] Gemini router ${ROUTER_VERSION} · primary ${primaryModel} · fallbacks ${fallbackModels.join(' -> ') || 'none'} · key ${geminiConfigured ? 'configured' : 'missing'}`);
