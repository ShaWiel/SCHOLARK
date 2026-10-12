# SCHOLAVERUM Connect — native collaboration roadmap

## Non-negotiable product decision (11 October 2026)
Connect is an **independent SCHOLAVERUM Workspace feature**. Do not redirect or integrate sessions with Google Meet, Microsoft Teams, Skype, WhatsApp or Discord. Users stay in SCHOLAVERUM for messaging and meetings. Shared WebRTC/STUN/TURN infrastructure may be used as transport but must never make users open another meeting application.

## Priority 1 — Friends, messaging and safety
- Private SCHOLAVERUM username/handle and opt-in discovery
- Friend requests, acceptance, removal, blocking and direct messages
- Authenticated users only, database RLS, read-only client tables and SECURITY DEFINER RPC checks
- No public email address, location or school exposure
- Opt-in discovery is **off by default** for newly created Connect profiles
- Private safety reports (harassment, bullying, spam, unsafe content) stored for authorized review
- Request rate limits, private profile discovery rules and chat text sanitization
- Follow-up improvements: native push notifications, typing state, online/offline presence, unread counts, report/moderation workflow, parental and school safeguards

### r261 optional contacts discovery (draft, not deployed)
- Signed-in users can explicitly select individual contacts through the Contact Picker API when supported (usually Chromium-based Android), or locally import an exported .vcf/.csv file on desktop and other devices.
- **No automatic/background sync, no cross-device access without an export, and no persistent address book**. The browser must never silently access the phone's contacts. Selected identifiers only travel via authenticated TLS RPC for a one-time exact match; names and unmatched identifiers are not stored in Connect's tables.
- Matching requires an independently verified Supabase Auth email or international-format phone number and **separate target opt-in**, default OFF; target email and phone are never returned.
- RLS-protected usage counter only stores user ID, UTC day, attempts. Maximum 30 identifiers/request and three lookup requests/day, with blocks and existing/pending friend relationships excluded. Authenticated RPCs only.
- Only user-approved matches get an **Add friend** action; private contact-only profiles also require an expiring 10-minute server-issued matching grant, so a UUID alone cannot bypass contacts discovery. Existing block checks and throttling still apply.
- Imported contacts remain in in-memory browser state only; clear on account switch, sign-out and page exit. A native OS-level periodic contacts sync would require separate mobile permissions/integration and is NOT promised in web.
- Verify Android picker API permission and format, iOS fallback, CSV quoting, folded vCards, verified phone normalization (+country code), opt-in revocation, private RLS, search throttles and cross-account contamination before deploy.

## Priority 2 — Native meetings and Study Rooms
Initial release r258 was a 4-person camera/microphone WebRTC mesh. The proposed r260 transition (not deployed until approved) is **voice-only mesh with optional screen sharing**:
- Create/join using a private, strong invitation code; up to 9 participants including the host for newly created calls
- Microphone with browser permissions; **do not request or transmit webcam video**
- Screen sharing is optional and uses a separate display-media video track; a private room-level 45s lease with 15s renewal lets only one cooperative browser share at once. The token expires after lost connections; a malicious modified browser is outside this guarantee
- Existing active rooms retain their original cap; new-room default becomes 9 after the r260 database migration
- Meeting chat, study-room format, collaborative whiteboard and host remove/end controls
- No automatic recording or AI analysis
- Only signed-in users with valid invite codes may join; meeting membership governs access
- WebRTC connectivity currently uses a STUN discovery endpoint. **No dedicated TURN relay or SFU is configured.** Some networks will fail media connectivity even when the room/chat loads.
- Important next reliability milestone: privately operated or managed TURN, ICE diagnostics, reconnect/rejoin, background resource cleanup, WebSocket-based signaling, multi-device testing and server capacity monitoring.
- Google Meet-class parity is **not** claimed. For large, reliable group meetings, build a dedicated authenticated SFU media tier, moderation, waiting rooms, participant controls, breakouts, captions, scheduling, consent-based recording, moderation and abuse protection. A nine-person audio call with one screensharer still requires up to eight upstream screen streams from the sharer; this is an experimental maximum, not an SLA.

### r260 verification gate
- Apply the DB migration and frontend release together only after CI/static audit checks.
- Use at least 9 independent authenticated browsers/devices to test admission: 9th joins, 10th denied, host kick/end, leave/rejoin, duplicate joins.
- Validate audio-only capture (no camera permission), mute/unmute, browser autoplay restrictions, and one sender's screen reaching eight receivers.
- Run network tests across desktop/mobile, restricted networks, weak uplinks and NATs; without TURN, some calls will not connect.
- Measure upstream bandwidth, packet loss, CPU and screen text readability at 7–9 participants.
- Roll back frontend and reset the new-room default/constraint if serious issues appear; never market 9 as a guaranteed reliable capacity before tests.

## Priority 3 — Remember for a future phase; do not build now
The user explicitly requested this phase to be remembered and deferred:
- Invite **ARKI** or **AI Tutor** into a meeting / study room, but only after clear participant opt-in.
- On-demand AI explanations for group study, guided quizzes, problem-solving and assignment coaching.
- Consent-based AI summaries, action items, shared notes and integration with SCHOLAVERUM Classroom, Planner, Assignments and Goals.
- No silent recording, transcription, screen scraping or training-data collection.
- Explicitly budget provider costs, permissions, moderation and participant privacy before activation.

## Release principles
Ship only behind SCHOLAVERUM authentication. Keep phase 1+2 independently usable without phase 3. Validate RLS, social controls, browser permissions and media teardown. Avoid claims of large-room reliability until dedicated TURN/SFU infrastructure and tests exist.
