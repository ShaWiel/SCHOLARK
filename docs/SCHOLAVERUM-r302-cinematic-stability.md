# SCHOLAVERUM r302 — Cinematic Stability and Visual Polish

## User-reported issues addressed
1. ARKI, AI Tutor, Languages, Focus and Schools feature moons looked frozen: increase slow oscillatory orbital movement (angle and secondary bobbing) while keeping all feature orbs above the crest.
2. Restore **SCHOLAVERUM** text beneath the supplied new purple/lime S on the hero planet.
3. Remove the duplicate giant background/ghost disc directly behind the planet; retain two much smaller distant planets and satellites.
4. Reduce eclipse conflicts by drawing exactly one bounded dark eclipse silhouette that fades before idle, and removing CSS opacity interpolation that fought per-frame Canvas timing.
5. Stabilize first-paint logo: disable accidental CSS transforms/animations on splash while prepaint is active, preserve the fixed high-contrast branded loader, and preload the new hero icon.
6. Remove the obsolete **What is SCHOLAVERUM** homepage topbar button and its fullscreen presentation CTA. The programmatic open action is disabled and modal is not mounted. The normal four-feature gallery stays.
7. Improve the other homepage feature cinematics (ARKI, AI Tutor, Language Learner, Focus) with individualized 3D-like palettes, depth, rim lights, glass layers and animated art.
8. Add contextual micro-details (AI THINKING, STEP BY STEP, language glyphs, focus timer), subtle halos and lower visual noise.

## Files changed
- `scholark-v129-knowledge-planet.js/css`: accelerated but smooth front-floating, one bounded eclipse, wordmark, single compositor (no competing CSS transitions).
- `scholark-v130-cosmic-worlds.js`: remove close duplicate planet and old giant orbit loop in the hero only.
- `scholark-v128-cinematic-studio.js`: retire presentation/trigger, stop replacing gallery DOM each cycle, inject per-card details, lazy-load r302 polish.
- `scholark-v132-cinematic-polish.css`: new contextual 3D visuals and reduced-motion rules.
- `scholark-prepaint-head.html`: loader-stability and preload.
- `Dockerfile`, runtime loader and core foundation: release r302.

## QA
- Update older r298/r300/r290 browser assertions that expected the intentionally removed presentation.
- New `scripts/scholaverum-r302-cinematic-stability-smoke.mjs` checks loader CSS, duplicate-engine protection, real orb pixel motion, wordmark opacity, mobile, reduced motion, and route lifecycle.
- Keep r299 and r301 globe/orbit tests, pricing, subscriptions, account isolation, language, AI, file safety, Workspace and release gates. CodeQL and CI must pass before Render deployment.
- This is a targeted front-end fix with full automated regression coverage, not a claim that every feature of the production site is defect-free.

## WebKit desktop topbar hardening
- Critical desktop WebKit regression showed a hidden (but mounted) public topbar during `#home` startup; Firefox and mobile WebKit passed.
- Fix public topbar route ownership: explicit URL hash is authoritative, remove stale Workspace classes on public routes, and win the public topbar visibility cascade only when the public surface owns the page.
- Cross-browser smoke diagnostics now report relevant HTML/body classes, surface, URL, prepaint and topbar computed visibility if the regression recurs.
- Final release candidate includes this fix and retains all r302 homepage, loader, cinematic, ARKI, Tutor, Schools, security and Workspace regression coverage. Do not deploy unless full release gate, CI and CodeQL pass on the exact same SHA.
