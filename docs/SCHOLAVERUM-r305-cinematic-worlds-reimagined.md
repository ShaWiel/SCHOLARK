# SCHOLAVERUM r305 — Cinematic Worlds Reimagined

## Product and visual scope

The r304 polish did not meaningfully change the homepage visual language. r305 is a deliberate layout and illustration redesign:
- Four cramped feature tiles become a spacious 2 × 2 widescreen cinematic gallery on desktop; each mobile scene receives its own full-width panel.
- The legacy generic glass-window and square-symbol overlays are hidden so original illustrated worlds remain fully visible.
- ARKI is a faceted violet/lime neural engine with rotating modules, energy pathways and an illuminated intelligence core.
- AI Tutor is a large glowing holographic open book with page depth, floating knowledge modules and mathematical formulae.
- Language Learner is a distinctive rotating world globe with landmasses, multiple language cards and flowing translation packets.
- Focus Sessions is a large instrument-panel chronograph with visible timer typography, orbital details and progress arc.
- Schools Near Me has an independent navigation atlas with topographic land forms, radar scanning, campus markers and routes.
- The hero planet keeps its approved official logo and existing orbital system; the surrounding canvas gains subtle purple auroras, constellations and richer background light.
- Unlike r304, all visible scene cards animate. Non-selected cards are throttled to reduce CPU load; offscreen cards stay static.
- Motion and interaction respect reduced-motion preferences and the established route, resize and focus contracts.

## Release controls

1. Require green SCHOLARK CI and CodeQL on the exact r305 PR commit.
2. Require the `[release-gate]` full production matrix on the merged main SHA.
3. Trigger the correct manual Render service `scholark-web` only after the release gate succeeds; verify exact SHA live.
4. Trigger documentation-only `[live-smoke]` and verify production health/browser acceptance.
5. Leave Supabase schemas, rows, Edge Functions, credentials and billing settings unchanged. r305 is a frontend-only visual release.
6. Keep existing Paddle sandbox and Connect Coming Soon guards.

## Acceptance tests

- Baseline r303 and r304 feature-world regression scripts remain active.
- New `scripts/scholaverum-r305-cinematic-redesign-smoke.mjs` verifies r305 version, desktop two-column wide layout, previously obscuring decorative elements removed, four real canvases, non-selected visible scene motion, idempotent mount, single-column mobile layout and absence of horizontal overflow.
