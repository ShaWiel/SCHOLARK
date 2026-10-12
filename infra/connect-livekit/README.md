# SCHOLAVERUM Connect: self-hosted LiveKit SFU and TURN
Status: infrastructure preparation only; **no VPS has been purchased or deployed**.
The Connect user experience remains entirely in SCHOLAVERUM. LiveKit provides only a media
relay, not a third-party meeting app. Google Meet/Teams/etc. are not integrated.

## Architecture
1. SCHOLAVERUM (Render) handles authentication-facing workspace UI.
2. Supabase Connect RPCs authorize room creation, invitation, membership, chat and host decisions.
3. Supabase Edge Function connect-media-token verifies the caller's Supabase access
   token, then reads room + active membership under their own RLS. It issues an HS256 LiveKit
   JWT for one room and one user, valid for **120 seconds to establish a connection**.
   The API secret is never exposed to the browser.
4. LiveKit runs on an independently operated VPS with built-in TURN/UDP and TURN/TLS.
   The media server does not receive user email and uses opaque UUIDs.
5. Migration 20261012_connect_sfu_rollout_disabled_r259.sql keeps mesh as the default.
   Only a manually enabled, tested rollout allows newly created rooms to use SFU.
   Existing 4-person mesh rooms remain mesh.

## Provisioning (requires separate user-selected VPS and domain)
Choose a Linux VPS with a **public IPv4 address, full UDP/TCP support, generous egress
and capacity scaling**. Web-only Render hosting is **not** a substitute for the SFU.
No provider, price tier, payment method or hostname has been selected.

Follow the official LiveKit generator rather than committing hard-coded
passwords, TLS private keys or unverified hand-written production networking configs:

    docker pull livekit/generate
    docker run --rm -it -v "$PWD:/output" livekit/generate

Generated artifacts include docker-compose.yaml, caddy.yaml, livekit.yaml,
redis.conf and a VM bootstrap script. Configure two DNS A records pointing to the
VPS IP, e.g. media.<your-domain> for HTTPS/WSS signaling and
turn.<your-domain> for TURN/TLS. Run the generated init_script.sh with appropriate
privileges on the VPS, or use the generated cloud-init. LiveKit's generator sets up
Caddy and handles TLS certificates; verify issuance and renewal.

Open inbound as documented by LiveKit:
- TCP 80,443: certificate issuance and WSS/HTTPS;
- TCP 7881: fallback WebRTC transport;
- UDP 3478: TURN/UDP;
- UDP 50000–60000: ICE/RTC media (or configured equivalent range);
- TURN/TLS port per generator configuration; check if it uses 443 or dedicated
  TCP 5349. Also inspect whether UDP 443 is used by your generator.
Never expose LiveKit server admin API port 7880 directly to the Internet without
the reverse proxy. Restrict SSH to known administrative IPs and configure basic
host firewall, unattended security upgrades, system metrics and backups.

Sources:
https://docs.livekit.io/transport/self-hosting/vm/
https://docs.livekit.io/transport/self-hosting/ports-firewall/

## Secrets and staged rollout

Provision these secrets *in the Supabase Edge Function runtime*, never in GitHub
files, browser JS, public tables or screenshots:

- CONNECT_LIVEKIT_URL=wss://media.<your-domain>
- CONNECT_LIVEKIT_API_KEY=(generated in livekit.yaml)
- CONNECT_LIVEKIT_API_SECRET=(generated in livekit.yaml)
- CONNECT_ALLOWED_ORIGINS=(optional additional allowed exact HTTPS origins)

The Supabase runtime provides SUPABASE_URL + SUPABASE_ANON_KEY. Deploy both supabase/functions/connect-media-token/index.ts and
supabase/functions/connect-media-admin/index.ts as Edge Functions with
verify_jwt=true. The host moderation function calls LiveKit Twirp RemoveParticipant
or DeleteRoom with server-side-only admin permissions. Do not activate the rollout just because tokens are generated.

## Required blockers before live SFU rollout
1. Provision/verify DNS, TLS, TURN over UDP + TLS; real multi-network calling.
2. Integrate LiveKit browser track handling (camera/mic/screen, reconnect, remote audio).
3. **Server-side host moderation** is staged using the connect-media-admin endpoint,
   which authenticates the room host and invokes LiveKit RemoveParticipant or
   DeleteRoom. Verify behavior on the actual self-hosted LiveKit version, including
   network failures and token reuse. A database membership change alone cannot
   eject a malicious WebRTC client; a previous 120-second token may still briefly
   allow reconnection after a kick on self-hosted LiveKit.
4. Ensure join credentials stop after membership revoked and after room end; validate
   room expiry during ongoing sessions (idle/room cleanup). Rate limit token issuance.
5. Verify working audio/video with 2–4 devices from separate ISPs, then 10/25/50
   participants; record CPU, RAM, ingress/egress, packet loss, TURN fallback, latency.
6. Review child safety and report moderation before large public rooms. No recording
   or ARKI listening/transcription without explicit multi-party consent.
7. Gradually enable the protected rollout flag **only after all gates pass**.
   Initial configured capacity 25 is a test goal, not verified production
   capacity; later raise after documented load test to 50 and 100.

## Rollback
Set the protected rollout flag false for *future* rooms. Existing SFU rooms must
be ended via server-side DeleteRoom, and users informed before cutover.
Keep mesh support available for existing small rooms until all active rooms have ended.
Do not convert the media_mode of a live SFU room: that would split participants
into incompatible media systems.

## Cost/risk
Open-source LiveKit is free software; **VPS, traffic, monitoring, DNS and backups
are not necessarily free**. Data/egress can dominate during group video lessons.
Do not claim support for 100 or 500 participants without SFU saturation and TURN tests.
