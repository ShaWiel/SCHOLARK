import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const previousEmit = http.Server.prototype.emit;
const originalEnv = process.env;
const context = new AsyncLocalStorage();

const liveEnabled = /^(1|true|yes|on)$/i.test(String(originalEnv.SCHOLARK_AI_LIVE || ''));
const provider = String(originalEnv.SCHOLARK_AI_PROVIDER || 'gemini').trim().toLowerCase();
const primaryModel = String(originalEnv.GEMINI_PRIMARY_MODEL || originalEnv.GEMINI_FAST_MODEL || 'gemini-3.8-flash').trim() || 'gemini-3.8-flash';
const geminiConfigured = Boolean(String(originalEnv.GEMINI_API_KEY || '').trim());

const AI_PATHS = new Set([
  '/api/studio/generate',
  '/api/studio/health',
  '/api/learning/generate',
  '/api/learning/health',
]);

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

  return context.run({ geminiPrimary: true }, () => previousEmit.call(this, type, ...args));
};

console.log(`[SCHOLARK] Gemini primary ${liveEnabled ? 'enabled' : 'disabled'} · model ${primaryModel} · key ${geminiConfigured ? 'configured' : 'missing'}`);
