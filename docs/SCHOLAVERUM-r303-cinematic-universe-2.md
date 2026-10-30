# SCHOLAVERUM r303 — Cinematic Universe 2.0

## Scope
Real-time high-depth feature cinematics focused on four previously flat public homepage illustrations and their existing Workspace demonstration. **The approved branded eclipse planet, graduation-cap S, front-facing feature moons, loading screen, pricing, and the removed 'What is SCHOLAVERUM' modal remain unchanged.**

### New visual worlds
- **ARKI · Intelligence Core:** illuminated planet-like AI nucleus, projected neural connections, orbital intelligence nodes and processing pulses.
- **AI Tutor · Knowledge Galaxy:** suspended knowledge pages, moving orbital equations, atmospheric learning core.
- **Language Learner · Global Connection:** shaded animated globe, rotating longitude/latitude guides, global routes and floating multilingual words.
- **Focus Sessions · Time Observatory:** a dark observatory planet, concentric time rings and moving precision clock hands.
- **Schools Near Me demonstration:** global-discovery planet with destination markers and a route ring.

### Experience
- Each of the four cards is interactive via pointer, click and keyboard focus, and retains the existing auto-selection flow.
- The demo theater maintains the real existing SCHOLAVERUM Workspace feature preview; a matching background changes when tabs change.
- Pointer-controlled gentle parallax on desktop; mobile and reduced-motion fallbacks.
- No extra runtime packages, external animation/CDN dependency or invasive Workspace modification.
- One animation loop for the entire feature experience; frame rate cap about 24 fps desktop and 11 fps mobile, only active card and visible theater animated; all other cards statically rendered.
- Procedurally shaded Canvas2D worlds with CSS perspective on interactive product mockups. This is an enhanced **3D-like** browser visualization, not a true WebGL/Three.js mesh nor pre-rendered 4K film.
- Static star textures cached; canvas resolution capped; offscreen and hidden-page suspension; `prefers-reduced-motion` still rendering.

## Files
- `scholark-v133-cinematic-worlds.js`
- `scholark-v133-cinematic-worlds.css`
- `scripts/scholaverum-r303-cinematic-worlds-smoke.mjs`
- Loader / Docker / Foundation version r303

## Deployment criteria
GitHub CI, CodeQL and full release gate must all pass on the exact current main SHA; test theater tab switching, every illustration, mobile, reduced motion, homepage <=> Workspace route return, pricing and critical security regressions. Manual Render deployment only after passing checks, followed by verifying Render reports LIVE and the expected commit.
