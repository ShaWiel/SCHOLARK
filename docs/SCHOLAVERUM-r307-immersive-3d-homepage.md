# SCHOLAVERUM r307 — Immersive 3D homepage

## User requirement

The user asked for a **whole-page high-impact realistic 3D rebuild**, not another small tweak to the original homepage, and explicitly included **all features shown or linked on the homepage**.

## Implementation

- Native WebGL2 shader pipeline (no Three.js / CDN dependency) creates physically lit, raymarched scenes with rounded solid geometry, metallic highlight/specular lighting, reflections, soft shadowing, surface normals and depth/fog.
- Five feature-specific visual worlds: ARKI neural core, AI Tutor three-dimensional book, Languages illuminated globe, Focus chronograph, Schools world/campus atlas. The feature theater tracks the selected ARKI/Tutor/Languages/Schools tab.
- A sixth GPU atmosphere scene in the hero sits behind the previously approved official logo/planet, which is preserved.
- The Language Learner and Schools Near Me feature panels have dedicated full-size GPU scenes.
- Entire homepage gets one consistent immersive cosmic aesthetic: hero, feature dock, learning journey, four-scene gallery, interactive theater, two feature panels, six 3D-styled toolkit cards, pricing surroundings, final CTA and footer.
- Lime green and violet brand palette remains, with no extra neon palette or new duplicate official planet.
- Preserves navigation, pricing, translation ownership, route guards, loading/loading-screen behavior, existing 2D fallback, and reduced-motion preferences.

## Performance and resilience

- WebGL2 canvases mount on the homepage only. GPU frames are lazy/viewport-intersecting and frame-limited (desktop ~17fps; mobile ~9fps), with resolution caps for memory and battery savings.
- The previous 2D feature-world renderer pauses when its GPU canvas is working, but returns automatically if WebGL fails or a context is lost.
- Contexts, observers and frames are released when the homepage is removed.
- Completely avoids remote shader, texture and font downloads.

## Validation

- Node syntax checks for the new WebGL runtime, static-audit and Docker image build.
- Browser r307 smoke: GPU stage coverage, distinct feature scenes, theater routing, preserved brand logo, all six tools, pricing, responsive layout, reduced motion, no overflow or JS exceptions.
- Older r298–r306 and workspace suites remain in CI and the production Release Gate.
- Do not promote to production until PR CI + CodeQL are green and the merged release SHA passes the production Release Gate.
- Frontend-only release: no Supabase migrations/functions, account settings or payment changes.
