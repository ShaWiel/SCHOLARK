# SCHOLAVERUM r301 — Celestial Front Orbits

## Requested behavior
- Fix the planeet cinematic layering glitch.
- Keep the new user-supplied purple/lime graduation-cap **S** on the planet.
- Keep all five SCHOLAVERUM feature orbs **in front of the S logo** in smooth semi-orbits; no clipping behind the logo or jumping across the central emblem.
- Richer purple/indigo/lime nebula colors across the **entire** homepage hero and each of the eight fullscreen cinematic scenes.
- Two distant planets (with a small extra distant moon on discovery/intro scenes), periodic meteor streaks, a small rocket, and one or two satellites.
- Cinematic lighting with legible hero copy; no childish icons, gold styling or overcrowded effects.

## Changes
- `scholark-v129-knowledge-planet.js`: foreground feature-orb canvas separate from background planet canvas; fixed, gentle orbital angles, five distinct nodes (three on compact mobile), canvas resets and role; retains the existing intro/skip/reduced-motion behavior.
- `scholark-v129-knowledge-planet.css`: reliable layer order (planet canvas 1, user crest 3, feature moons 5, skip action 8).
- `scholark-v130-cosmic-worlds.js`: nebula intensity and broader saturated hues; physically drawn rocket, panelled satellites, distant planets, periodic meteors, varied presentation palettes; respecting reduced motion.
- Loader, Docker and foundation updated to release `r301-celestial-front-orbits`. The existing pricing, Workspace, ARKI, Tutor, connectivity, payment flows and fullscreen story mechanics are preserved.

## Verification and deployment
- New `scripts/scholaverum-r301-front-orbits-smoke.mjs` checks foreground z-order, live feature-orb pixels, clear logo center, no duplicate canvas after route changes, mobile viewport and reduced motion.
- Existing r298, r299 and r300 cinematic tests and full browser regression remain mandatory.
- GitHub CI + CodeQL + Release Gate must be successful before manual Render deployment.
- Space detail counts are diagnostic and may vary by cinematic scene so each environment is appropriate rather than overcrowded.

## Technical limitations
Visuals are live browser-rendered 3D-like layered Canvas2D graphics, not a pre-rendered photorealistic 4K video or a true WebGL mesh engine.