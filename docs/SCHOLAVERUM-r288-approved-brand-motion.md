# SCHOLAVERUM r288 — approved orbital emblem and rotating hero sphere

## Approved brand intent
- Preserve the original purple/lime SCHOLAVERUM logo including the graduation-cap S and wordmark.
- Use the approved quiet orbital composition as a small, dark navy Dashboard mark, with a blue/lime orbit pair and two planets. Remove the tagline from this emblem.
- Keep the large homepage gradient ball and cinematic cards; brand the rotating sphere with the original S + wordmark (not the new orbital emblem).
- Rotate continuously at 22 seconds per turn, with `prefers-reduced-motion` support and responsive clipping to prevent overlap.

## Implementation
- `scholaverum-orbital-emblem-r288.svg` embeds the original official SCHOLAVERUM PNG exactly and supplies lightweight vector orbital geometry.
- `scholark-v51-workspace-shell.js` references the orbital SVG in the canonical r285 Workspace Dashboard; previous tagline DOM is absent.
- `scholark-v126-workspace-integrity.css` sizes this emblem on large and small screens.
- `scholark-v124-editorial-home.js` places the original official logo on two backface-hidden surfaces of the homepage ball, which appear as the sphere rotates.
- `scholark-v124-editorial-home.css` animates the ball at 22 seconds/revolution and respects reduced motion and motion-pause controls.
- Docker ships the orbital SVG as a real immutable static asset; stylesheet versions and runtime identity are bumped to r288.
- `scripts/scholaverum-r288-branding-motion-smoke.mjs` verifies the original-logo preservation, no tagline, responsiveness, active rotation and reduced-motion fallback. The test is part of the release and live production verification gates.

## Safe rollout
No Paddle payment settings, account data, RLS, AI routes, subscription handling or legacy Home ownership are modified. Release only after all checks pass; deploy the gated SHA explicitly to scholark-web, then run the production smoke. Existing Workspace tests remain enabled.
## Gate retry 1
The brand test correctly found the new SVG, original logo and motion, but measured the mobile CSS duration after the mobile Dashboard leg while expecting desktop speed. The test now restores desktop viewport for 22-second animation and checks the 25-second mobile variant separately. Runtime assets are unchanged.
