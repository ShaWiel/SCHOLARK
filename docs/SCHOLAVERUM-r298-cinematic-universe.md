# SCHOLAVERUM r298 — Cinematic Universe

## Scope
Transform the approved editorial homepage into a more cinematic, scrollable introduction to the real SCHOLAVERUM learning Workspace. The design uses the approved violet/lime brand system, native-resolution scalable graphics and a custom orbital knowledge engine rather than the retired r296 mapped globe.

## Delivered
- Authoritative homepage remains \`#v280-editorial-home\`; all account, language, Workspace, subscription, Credit Store and checkout ownership remains untouched.
- New \`scholark-v128-cinematic-studio.js\` and stylesheet add a custom Canvas2D orbital visual with separate **counter-rotating lime and purple satellites**, glass-light core, official icon and subtle floating particles.
- Workspace cinematic gallery with ARKI, AI Tutor, Language Learner and Focus Sessions; animation pauses offscreen, on hidden tab or reduced-motion preference.
- Accessible topbar action **Wat is SCHOLAVERUM**, including mobile, launches a dedicated cinematic presentation rather than the prior guided tooltip tour.
- Eight full-viewport automatically presented scenes: vision, Workspace, ARKI, AI Tutor, languages, focus, schools, closing. Native display-resolution canvas (up to **3840×2160**) alongside crisp DOM/vector UI. Responsive below 950px and 680px.
- Accessible close, play/pause, previous/next, scene jump, keyboard arrows/Escape, focus restoration, hidden-document suspension, motion-reduction behavior and direct Workspace entry.
- A 30 fps frame budget for canvas motion, DPR ceiling and mobile-specific caps to avoid unnecessary rendering load.

## Non-goals and guardrails
- This is not a pre-encoded 4K movie. It is adaptive, resolution-aware browser-rendered graphics; a native 4K output requires a capable 4K or equivalent high-DPI display. It does not imply a 4K panel on devices that do not support it.
- Do not modify AI endpoints, authentication, pricing, billing, files, credits, quotas or Supabase tables.
- Keep existing \`#v280-pricing-slot\`, product previews, route guards and legacy lock intact.
- Old r296 source is retained for historical reference and old contract checks, but is no longer loaded by the home runtime.
- Release to Render only after CI, CodeQL and the release gate succeed, then verify the deployed SHA.

## QA
\`scripts/scholaverum-r298-cinematic-smoke.mjs\` tests desktop/mobile navigation, dialog scenes, pause/next/Escape, native 4K render target at 1920×1080 deviceScaleFactor 2, reduced motion, pricing isolation and no page errors. The r281 hero and r290 official brand tests now reflect the replacement motion engine. 
