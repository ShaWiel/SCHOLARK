// SCHOLAVERUM Connect TURN credentials.
// Cloudflare Realtime is a network relay ONLY, not a meeting application.
// IMPORTANT: deploy verify_jwt=true; TURN API token stays only in Edge secrets.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
function publishableKey(): string {
  const explicit = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (explicit) return explicit;
  try {
    const names = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
    return Deno.env.get(String(names.default || "")) || "";
  } catch { return ""; }
}
const BASE_SITE = "https://scholark-app-shawiel.onrender.com";
const allowed = new Set([BASE_SITE, ...(Deno.env.get("CONNECT_TURN_ALLOWED_ORIGINS") || "")
  .split(",").map(s => s.trim()).filter(s => /^https:\/\/[^/]+$/.test(s))]);
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TTL_SECONDS = 14400; // four hours; browser renews well before expiry

function cors(origin: string): Record<string,string> {
  return {
    "access-control-allow-origin": allowed.has(origin) ? origin : BASE_SITE,
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "Origin",
    "cache-control": "no-store"
  };
}
function json(body: Record<string, unknown>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...cors(origin), "content-type": "application/json" }
  });
}
function allowedIce(ice: unknown): ice is Array<{urls:string[];username?:string;credential?:string}> {
  if (!Array.isArray(ice) || ice.length < 2 || ice.length > 8) return false;
  let hasTurn = false;
  for (const entry of ice) {
    if (!entry || typeof entry !== "object") return false;
    const e = entry as Record<string, unknown>;
    const urls = Array.isArray(e.urls) ? e.urls : [e.urls];
    if (urls.length < 1 || urls.length > 12 || !urls.every(url => typeof url === "string")) return false;
    for (const url of urls as string[]) {
      if (/^turns?:turn\.cloudflare\.com:\d{2,5}\?transport=(udp|tcp)$/.test(url)) {
        if (typeof e.username !== "string" || !e.username || typeof e.credential !== "string" || !e.credential) return false;
        hasTurn = true;
      } else if (!/^stun:stun\.cloudflare\.com:3478$/.test(url)) return false;
    }
  }
  return hasTurn;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !allowed.has(origin)) return json({ code: "ORIGIN_DENIED" }, 403, origin);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ code: "METHOD_NOT_ALLOWED" }, 405, origin);
  if (Number(req.headers.get("content-length") || 0) > 2048) return json({ code: "INVALID_REQUEST" }, 413, origin);

  const authorization = req.headers.get("authorization") || "";
  const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1]?.trim() || "";
  if (!token || !SUPABASE_URL || !publishableKey()) return json({ code: "UNAUTHORIZED" }, 401, origin);
  const raw = await req.text().catch(() => "");
  if (!raw || raw.length > 2048) return json({ code: "INVALID_REQUEST" }, 400, origin);
  let roomId: string;
  try {
    const body = JSON.parse(raw);
    roomId = typeof body?.room_id === "string" ? body.room_id : "";
  } catch { return json({ code: "INVALID_REQUEST" }, 400, origin); }
  if (!ID.test(roomId)) return json({ code: "INVALID_ROOM" }, 400, origin);

  const sb = createClient(SUPABASE_URL, publishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: "Bearer " + token } }
  });
  const { data: auth, error: authError } = await sb.auth.getUser(token);
  if (authError || !auth.user?.id) return json({ code: "UNAUTHORIZED" }, 401, origin);
  if (Deno.env.get("CONNECT_TURN_ENABLED") !== "1") return json({ code: "TURN_DISABLED" }, 503, origin);

  const turnKeyId = Deno.env.get("CONNECT_CLOUDFLARE_TURN_KEY_ID") || "";
  const turnApiToken = Deno.env.get("CONNECT_CLOUDFLARE_TURN_API_TOKEN") || "";
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(turnKeyId) || turnApiToken.length < 32)
    return json({ code: "TURN_NOT_CONFIGURED" }, 503, origin);

  // Atomic gate: auth.uid() is checked against current, non-expired room
  // membership and permits at most 20 credential grants per user per hour.
  const { data: permitted, error: quotaError } = await sb.rpc("connect_turn_issue_allowed", { p_room: roomId });
  if (quotaError) return json({ code: "TURN_AUTHORIZATION_UNAVAILABLE" }, 503, origin);
  if (!permitted) return json({ code: "ROOM_NOT_AVAILABLE_OR_RATE_LIMITED" }, 403, origin);

  try {
    const remote = await fetch(
      "https://rtc.live.cloudflare.com/v1/turn/keys/" + encodeURIComponent(turnKeyId) + "/credentials/generate-ice-servers",
      {
        method: "POST",
        headers: { Authorization: "Bearer " + turnApiToken, "content-type": "application/json" },
        body: JSON.stringify({ ttl: TTL_SECONDS }),
        signal: AbortSignal.timeout(5000)
      }
    );
    if (!remote.ok) return json({ code: "TURN_PROVIDER_UNAVAILABLE" }, 502, origin);
    const payload = await remote.json();
    if (!allowedIce(payload?.iceServers)) return json({ code: "TURN_PROVIDER_RESPONSE_INVALID" }, 502, origin);
    return json({ iceServers: payload.iceServers, expiresAt: Date.now() + TTL_SECONDS * 1000 }, 200, origin);
  } catch { return json({ code: "TURN_PROVIDER_UNAVAILABLE" }, 502, origin); }
});
