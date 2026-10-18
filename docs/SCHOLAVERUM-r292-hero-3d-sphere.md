# SCHOLAVERUM r292 — original-size official branded 3D homepage sphere

## Corrected visual behavior
- The r291 implementation used the full 960x640 official artwork at 253.3% width of the hero container and rotated it clockwise in 2D, producing extreme overflow. This is removed entirely.
- A NEW compact 3D sphere is built with the official `/scholaverum-official-logo-r290.webp`, never the old `r246` logo or old `v280-planet` DOM asset.
- The sphere's shell matches the old ball's original width (76% of the existing hero art) and location (7% right, 11% bottom). The blue volumetric shell creates gentle depth while the approved original brand artwork is composed onto the front and back as a cropped centered official circle. Two unobtrusive orbit rings reproduce the APPROVED orbital identity.
- Front/back faces and orbits rotate together about the Y axis at 22 seconds per 360-degree revolution (25 seconds on small mobile screens), linearly and infinitely. No Z-axis clockwise rotation, no gigantic logo and no old gradient sphere restoration.
- Preserve existing loading-screen sizing, workspace/dashboard/sidebar official logo, homepage cards, lock against older Home and Workspace overlays.
- Honor prefers-reduced-motion accessibility settings.

## Verification
- r290 branding browser smoke now rejects former huge flat r291 hero and old r246 source, checks r292 blue sphere diameter against 76%-of-art baseline, official asset on both sides, orbit count, CSS Y-axis keyframes, real frame-to-frame movement, infinite repetition, reduced motion, and mobile overflow.
- r281 cinematic smoke now expects the single r292 3D rotor.
- Refresh stylesheet and runtime version to r292 to invalidate old cached 2D animation.
- Run full code checks, Docker image build and browser release gate, CI and CodeQL; only after green release deploy the tested commit to Render and re-run read-only live verification.
## Live deployment
Gated commit `87625a26930e528b635e0a9acc05be0bff472682` passed Release Gate, CI and CodeQL. Render deploy `dep-dba0uffavr4c73fnteug` entered LIVE state. This documentation-only commit triggers read-only production browser verification; no deployed runtime content is changed.
