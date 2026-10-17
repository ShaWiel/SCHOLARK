# SCHOLAVERUM r291 — full official orbital homepage logo and larger prepaint logo

## User-approved scope
- Replace the entire old gradient sphere, old graduate S logo, and independent orbit rings in the homepage hero with the complete approved official r290 orbit-logo asset. Nothing from the old orb remains in the hero DOM.
- The circular center of the official artwork should retain the visual diameter of the former sphere. The old sphere occupied 76% of the hero-art width; the center of the official art occupies approximately 30% of its own image width. The replacement image is thus 253.3% of the art container width, centered at 55%/50%. Orbit lines appropriately extend beyond the old sphere, behind the ARKI/AI Tutor floating cards.
- Continuously rotate the entire official image a full 360 degrees, linear 22 seconds/revolution, infinite repetition. Do not leave a gradient sphere behind it or rotate only the old S.
- Increase the prepaint/loading official logo to clamp(245px, 31vw, 380px), retaining the exact dark background and first-paint lock.
- Honor user-configured reduced-motion accessibility preference while normal animations keep running perpetually.

## Implementation
- `scholark-v124-editorial-home.js` removes the old `v280-planet`, the two `v280-orbit` elements, and legacy front/back r246 logo faces; inserts one image for `/scholaverum-official-logo-r290.webp` with `v291-official-logo-spin`.
- `scholark-v124-editorial-home.css` removes retired r288 sphere CSS and adds the 360-degree center-preserving spin, responsive behavior, and reduced-motion support.
- `scholark-prepaint-head.html` increases official loading logo dimensions and bumps stylesheet cache version.
- Runtime release identity is r291, including the Docker build and existing cache contract tests.
- The r281 motion smoke and r290 official branding smoke now require the new markup and animation behavior, including center diameter and no old sphere. Historical r288 smoke delegates to the canonical brand check.

## Release gate
The production release must pass full CI, CodeQL, all browser QA (Chromium, Firefox, WebKit, mobile), and the gated Docker/API build before manual Render deployment. Afterwards trigger live verification on exact deployed SHA. No backend or user data changes.