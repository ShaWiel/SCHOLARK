# SCHOLAVERUM r290 — unified official brand

## Decision
The approved transparent purple/lime orbital SCHOLAVERUM image is now the official identity across the website. **Only the rotating homepage sphere remains on its existing, original S with graduation cap**.

## Assets
- `scholaverum-official-logo-r290.webp`: high-quality transparent image derived from the user's approved official image. Embedded at full width in the Dashboard, Workspace sidebar, loading screen, public topbar and social preview.
- `scholaverum-official-icon-r290.png`: square, transparent app icon derived from the same approved official image. Used for favicon, PWA icon, Apple touch icon and push notification icons.
- `scholaverum-logo-r246.png`: legacy original art *retained solely* inside `.v288-sphere-spin .v288-sphere-face img` on the rotating homepage ball.

## Compatibility
- Replace legacy logo aliases during the production Docker build. Preserve the original r246 asset only for the rotating sphere. Explicitly exclude the homepage sphere implementation from bulk logo rewrite.
- Update central V98 logo migration to replace any retired brand asset after DOM reconstruction while excluding the homepage sphere.
- First paint uses the new logo so no old logo flashes before the canonical UI appears.
- Preserve current homepage sphere rotation and accessibility, all AI tools, user records, pricing and authentication behavior.

## QA
`scripts/scholaverum-r290-brand-unification-smoke.mjs` tests logo and icon HTTP responses, PWA manifest, preload and OG tags, Dashboard/sidebar/mobile, public topbar, singleton Workspace, and unchanged homepage sphere. Existing cross-browser, mobile, cinematic, and school tests remain mandatory. Deploy only after full CI, CodeQL, and release gate; then run production verification.

## QA retry — historical navigation brand guard
The first release-gate run passed the new brand-specific QA, including the homepage sphere exception, but detected a legacy foundation brand predicate during history reload. The r290 fix updates the V113 hardening module to repair the canonical logo before its audit and updates the V53 emergency logo to match. The full browser gate is rerun; deployment remains blocked until green.

## Live release verification
The approved r290 SHA `e54bb7b75917e80d682705f086ccaf1aa0c1f30e` passed Release Gate, CI, and CodeQL and is live on Render `scholark-web` via `dep-db9pap8m7kps73e85gf0`. Production retains `/scholaverum-logo-r246.png` on both rotating homepage sphere faces. This documentation-only commit requests post-deployment live browser verification without changing the deployed runtime assets.
