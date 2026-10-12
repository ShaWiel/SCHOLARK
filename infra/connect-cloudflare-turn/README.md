# SCHOLAVERUM Connect — managed TURN relay (r262, STAGED ONLY)

**No external meeting applications.** WebRTC peer-to-peer connections, room chat,
private friend requests, admission and moderation stay in SCHOLAVERUM. Cloudflare
Realtime TURN is only the optional TURN relay for ICE candidates.

## Provider decision and costs

- Cloudflare Realtime TURN: first 1,000 GB of monthly Realtime egress free,
  shared with Realtime SFU; additional egress $0.05/GB as of October 2026.
- Separate Cloudflare billing setup may be required. This is **not** an absolute
  spending cap. Alerts/budget monitoring and account billing controls are required.
- Cloudflare free STUN works without TURN credentials; it does not solve all NAT issues.
- A separate DigitalOcean/Coturn server is **not** provisioned. Do not infer one exists.
- In a nine-person mesh, TURN can relay up to 36 pairs of connections; TURN does not
  solve a participant's poor upstream screen-sharing bandwidth.

Provider docs:
https://developers.cloudflare.com/realtime/turn/generate-credentials/
https://developers.cloudflare.com/realtime/sfu/platform/pricing/

## Setup (not yet configured)

1. In the Cloudflare Dashboard create a **Realtime TURN key**. Retain the generated
   key ID and secret API token in a password manager. Do not post them in chats,
   repository commits, environment example values or browser console output.
2. In Supabase SCHOLAVERUM project `yhafbwdnnpvuedycdkll`, run migration
   `supabase/migrations/20261012_connect_turn_issuance_gate_r262.sql`. Review
   the isolated SQL security tests and RLS/grants first.
3. Deploy `supabase/functions/connect-turn-ice/index.ts` as Edge Function
   `connect-turn-ice` with `verify_jwt=true`.
4. Set these **Supabase Edge Function secrets** (not GitHub/Render/browser):
   - `CONNECT_CLOUDFLARE_TURN_KEY_ID` = private Cloudflare TURN key ID
   - `CONNECT_CLOUDFLARE_TURN_API_TOKEN` = private TURN key's API token
   - `CONNECT_TURN_ENABLED` = `1`, **only after** test credentials and provider
     billing have been verified and deployment approved.
   - `CONNECT_TURN_ALLOWED_ORIGINS` = comma-separated additional exact HTTPS
     frontend origins, if a custom domain is in use. The known
     `https://scholark-app-shawiel.onrender.com` domain is already allowed.
   - Supabase provides `SUPABASE_URL` and the publishable / anon API key;
     verify those are present in this Edge runtime.
5. Release the matching `scholark-v122-connect.js` browser implementation only
   through SCHOLAVERUM's existing production release gate after green CI.
6. Run real signed-in calling tests from at least **two different ISPs/mobile
   networks** including an ICE `relay` candidate under a restrictive NAT, a
   fresh nine-person audio call, a ninth participant, denied tenth participant,
   host kick/end, eight screen-share recipients, leave/rejoin and devices asleep/
   awake. Test Chromium, Safari and Firefox; check browser sound permissions.
7. Use Cloudflare Realtime usage reporting and billing alerts. Do not advertise
   production TURN until connectivity, usage and egress costs have been measured.

## Credential and failure model

- The Edge endpoint accepts `POST {room_id}` with a verified Supabase user's
  bearer token. It checks active membership using the security-definer gate,
  which applies an atomic **20/hour/user** credential issue quota.
- A Cloudflare TURN key/token remains server-side; browsers receive only Cloudflare
  **temporary ICE credentials**, issued for 4 hours. The client refreshes them
  before expiry. The current 12-hour meeting expiry remains unchanged.
- Browser ICE configuration uses direct STUN while TURN is disabled or unreachable.
  This is a **degraded mode**, not a guarantee of connectivity.
- Do not store the TURN API token in Supabase database tables or public
  account metadata. Never turn the Edge endpoint into an open credential issuer.
- Ensure origin restrictions, JWT/RLS, feature gate, RPC quota, and TURN response
  validation pass. TURN secrets can be revoked/rotated in the Cloudflare dashboard.
- No room audio or shared screens are recorded or processed by ARKI.

## Current state

As of 12 Oct 2026: **the r262 authorization migration and the JWT-protected
`connect-turn-ice` Edge Function (version 1) are now deployed in Supabase**.
The function remains **disabled** because no Cloudflare TURN key or private API
token has been configured. No paid TURN service or production media relay has
been activated. The production SCHOLAVERUM client still uses STUN and four-person rooms.
Do not merge or release r262 unless the provider credentials are available and
all release checks are green.
