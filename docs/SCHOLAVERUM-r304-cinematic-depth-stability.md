# SCHOLAVERUM r304 — Cinematic Depth & Stability

## Owner request
Continue improving all homepage cinematics while keeping the approved SCHOLAVERUM eclipse planet, official purple/lime colors, S mark, front feature moons, and stable loader. Do not reintroduce the removed presentation.

## Updates
- ARKI: richer purple intelligence field with three independent orbiting energy packets.
- AI Tutor: deeper blue teaching galaxy, extra scientific labels and the existing floating learning pages.
- Language Learner: traveling light packets along international routes and a more saturated purple sky.
- Focus Sessions: a soft scanning ring in the time observatory.
- Schools Near Me: its own education-discovery atlas with travel paths and four moving navigation beacons, not a reused languages illustration.
- All illustrations: distinct tonal gradients, nebular orbital filaments, occasional subdued shooting star and a second parallax dust plane.
- Homepage branded planet: richer *background only*, without changing the central crest, eclipse behavior, feature moons or adding a ghost planet.
- Cards and theater: improved contrast and depth cues, responsive overlays, reduced-motion support.
- Stability: no repeated card or theater pointer listeners on re-mount; repaint after viewport resize; avoid repainting an offscreen selected card on every theater frame.
- Gallery: automatic carousel never overrides a user's hovered or focused feature; it resumes after disengagement.

## Integration
- Runtime and foundation both declare `r304-cinematic-depth-stability`, with fresh asset keys in loader and Dockerfile.
- No new runtime libraries or animation engines; the shared Canvas2D loop and its existing visibility/performance limits remain in place.
- No changes to Workspace, pricing, billing, authentication, homepage navigation ownership, or approved logo assets.

## Quality gates
- Existing r298-r303 cinematic tests still run unchanged, including eclipse and foreground orbit pixel checks.
- Added `scripts/scholaverum-r304-cinematic-depth-smoke.mjs` to GitHub CI and full release gate: verify active r304 engine, idempotent mounting, hover stability, distinct school/language worlds, resizing and no JS errors.
- Release deployment remains gated on exact commit SHA: static audit, Docker smoke, accessibility/mobile/browser coverage, CodeQL, full release gate and postdeploy live verification. No direct production push before checks pass.
