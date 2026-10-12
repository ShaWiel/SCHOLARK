# SCHOLAVERUM Connect — native collaboration roadmap

## Non-negotiable product decision (11 October 2026)
Connect is an **independent SCHOLAVERUM Workspace feature**. Do not redirect or integrate sessions with Google Meet, Microsoft Teams, Skype, WhatsApp or Discord. Users stay in SCHOLAVERUM for messaging and meetings. Shared WebRTC/STUN/TURN infrastructure may be used as transport but must never make users open another meeting application.

## Priority 1 — Friends, messaging and safety
- Private SCHOLAVERUM username/handle and opt-in discovery
- Friend requests, acceptance, removal, blocking and direct messages
- Authenticated users only, database RLS, read-only client tables and SECURITY DEFINER RPC checks
- No public email address, location or school exposure
- Request rate limits, private profile discovery rules and chat text sanitization
- Follow-up improvements: native push notifications, typing state, online/offline presence, unread counts, report/moderation workflow, parental and school safeguards

## Priority 2 — Native meetings and Study Rooms
Implemented initial small-group **WebRTC mesh**:
- Create/join using a private, strong invitation code; up to 4 participants
- Camera and microphone with browser permissions; screen share on supported browsers
- Meeting chat, study-room format, collaborative whiteboard and host remove/end controls
- No automatic recording or AI analysis
- Only signed-in users with valid invite codes may join; meeting membership governs access
- WebRTC connectivity currently uses a STUN discovery endpoint. **No dedicated TURN relay or SFU is configured.** Some networks will fail media connectivity even when the room/chat loads.
- Important next reliability milestone: privately operated or managed TURN, ICE diagnostics, reconnect/rejoin, background resource cleanup, WebSocket-based signaling, multi-device testing and server capacity monitoring.
- Google Meet-class parity is **not** claimed. For large, reliable group meetings, build a dedicated authenticated SFU media tier, moderation, waiting rooms, participant controls, breakouts, captions, scheduling, consent-based recording, moderation and abuse protection. Design all capacity limits and pricing before relaxing the 4-person cap.

## Priority 3 — Remember for a future phase; do not build now
The user explicitly requested this phase to be remembered and deferred:
- Invite **ARKI** or **AI Tutor** into a meeting / study room, but only after clear participant opt-in.
- On-demand AI explanations for group study, guided quizzes, problem-solving and assignment coaching.
- Consent-based AI summaries, action items, shared notes and integration with SCHOLAVERUM Classroom, Planner, Assignments and Goals.
- No silent recording, transcription, screen scraping or training-data collection.
- Explicitly budget provider costs, permissions, moderation and participant privacy before activation.

## Release principles
Ship only behind SCHOLAVERUM authentication. Keep phase 1+2 independently usable without phase 3. Validate RLS, social controls, browser permissions and media teardown. Avoid claims of large-room reliability until dedicated TURN/SFU infrastructure and tests exist.
