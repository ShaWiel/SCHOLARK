# SCHOLAVERUM r300 — Cosmic Cinematics

## Objective
Match the premium 3D space reference across the **whole homepage hero** and across **all eight** fullscreen cinematics, instead of limiting the nebula background to the small planet stage.

## Changes
- New `scholark-v130-cosmic-worlds.js` and CSS. Native Canvas2D full-bleed animated stars, rich volumetric purple/lime nebula, starlight wisps, gas planets, asteroid layers and inclined orbit paths. Hero covers full width/height.
- Eight distinct cinematic environments (vision, workspace, ARKI, Tutor, Languages, Focus, Schools, Final), with different atmosphere seeds, lighting and planetary arrangements. Product mockup cards get 3D depth, reflections and scene-specific light.
- Replaces the homepage planet emblem **only** with the user's supplied new purple/lime 3D S graduation crest, cropped from their second uploaded image; official site icon, favicon and unrelated brand placements remain unchanged.
- Asset is stored as base64-encoded WebP text; the Dockerfile decodes it to binary during the build, then copies into each served HTML directory. File bytes were verified against the original crop by a per-segment hash comparison.
- Rendering is capped and throttled, textures cached, offscreen/hidden scenes suspended, prefers-reduced-motion uses one still frame.
- Story dialog mechanics, controls, nav, pricing, Workspace and account security unchanged.
- Release marker `r300-cosmic-cinematics`.

## QA / release
- `scripts/scholaverum-r300-cosmic-worlds-smoke.mjs` asserts full-width canvas, valid user's image, 8 distinct fullscreen worlds, responsive mobile, reduced motion, keyboard close and existing pricing.
- Existing r290 branding smoke checks new planet image while retaining original PWA icon.
- GitHub CI + CodeQL + mandatory release gate must pass before Render deployment. Rollout is manual because autoDeploy is off.

Rendering note: the look is a real-time browser-generated 3D-like cinematic (layered 2D canvas with volumetric shading), not a pre-rendered 4K video or a WebGL mesh-based photorealistic universe.