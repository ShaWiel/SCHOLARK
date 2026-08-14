const originalFetch = globalThis.fetch?.bind(globalThis);
const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');

if (originalFetch && serviceKey.startsWith('sb_secret_') && supabaseUrl) {
  const supabaseOrigin = new URL(supabaseUrl).origin;

  globalThis.fetch = async (input, init = {}) => {
    let target;
    try {
      if (input instanceof Request) target = new URL(input.url);
      else target = new URL(String(input));
    } catch {
      return originalFetch(input, init);
    }

    if (target.origin !== supabaseOrigin) {
      return originalFetch(input, init);
    }

    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    const authorization = headers.get('authorization');
    const expectedBearer = `Bearer ${serviceKey}`;

    if (authorization === expectedBearer || authorization === serviceKey) {
      headers.set('apikey', serviceKey);
      headers.delete('authorization');

      if (input instanceof Request) {
        return originalFetch(new Request(input, { ...init, headers }));
      }
      return originalFetch(input, { ...init, headers });
    }

    return originalFetch(input, init);
  };
}
