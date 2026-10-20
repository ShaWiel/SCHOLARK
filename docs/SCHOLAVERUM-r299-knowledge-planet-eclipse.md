# SCHOLAVERUM r299 — Knowledge Planet Eclipse
## Product scope
Replace the r298 two-orbit homepage sphere with a bespoke Knowledge Planet Eclipse visual. The new engine only mounts inside the canonical r280 editorial homepage and does not modify Workspace features, accounts, credits or billing.

### Experience
- 12-second desktop reveal; 8-second first-view mobile reveal.
- Six timed phases: space, foreground eclipse, planet/logo reveal, four directional data rings, five feature moons, settled idle.
- Abstract branded planet with subtle purple/lime energy topography; not an Earth design.
- Four inclined elliptical rings with opposite orbital velocities and restrained data pulses.
- ARKI, AI Tutor, Language Learner, Focus Sessions and Schools Near Me as five orbiting feature moons.
- Official graduation-cap logo, purple/lime palette, no gold.
- Skip intro action, shorter return-home presentation and static reduced-motion rendering.
- Canvas2D pixel-density caps, ~30 fps throttling, offscreen/hidden suspension.
- Preserve full-screen Wat is SCHOLAVERUM cinematic experience.

### Files and release
- New scholark-v129-knowledge-planet.js and scholark-v129-knowledge-planet.css.
- The r128 hero mount delegates to r299 but r128 gallery and fullscreen cinematic remain.
- Remove old v292/v296/r298 globe markup on mount.
- Release r299-knowledge-planet-eclipse.

### QA
- CI runs node syntax audit and dedicated r299 eclipse smoke.
- Existing editorial, logo, 4K fullscreen dialog, mobile, motion and Workspace checks remain.
- Manual Render deploy after CI, CodeQL and release gate are green.
