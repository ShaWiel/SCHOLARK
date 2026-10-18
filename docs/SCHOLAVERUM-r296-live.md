# SCHOLAVERUM r296 — approved orbital globe production record

## Scope approved
- Real 3D central sphere using the approved SCHOLAVERUM logo and original purple/lime palette.
- Spacious, thin purple and lime orbit rings with independent satellites traveling in opposite directions.
- Reduced motion, WebGL rendering and CPU fallback. This is restricted to the public homepage; no payment, account or learning data changes.
- PR #56 merged with release-gated commit `6c587c2b16b090ed27b47ae88d553ae3ebb195b2`.

## Verified gates and deployment
- GitHub CI: success.
- GitHub CodeQL: success.
- GitHub Release Gate: success, including browser and responsive regression checks.
- Render target: `scholark-web` (`srv-d9u3r3ht0dsc73cgkch0`).
- Render deployment `dep-dbaaqglg1s2s73be1ct0`, from the exact release commit above, status **live**.
- Production URL: https://scholark-app-shawiel.onrender.com/

## Follow-up
- Launch the read-only live verification against the deployed r296 binary.
- Separate resilience work is in PR #57 and must pass gates before any further production deployment.
