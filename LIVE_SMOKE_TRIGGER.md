# SCHOLAVERUM r273 post-deployment verification

Production application commit: 7fc5c6f88352f2ae2f2673abf13d6eef4fe43da3
Render deployment: dep-db8q7qff3r2c73f19sv0
Render service: scholark-web (manual release; Auto Deploy disabled)
Production URL: https://scholark-app-shawiel.onrender.com
Release: r273-connect-gate
Date: 2026-10-16 (America/Paramaribo)

Render startup confirms:
- Live deploy and correct release marker.
- Security foundation/step-up and credit self-tests passed.
- Export, references, public artifact sanitizer and global school discovery startup tests passed.
- Paddle remains Sandbox; Plus price OK, webhook OK, branding OK.
- Pro Sandbox price has a trial_policy_mismatch: investigate the Paddle Pro trial setup without silently modifying subscription terms.
- Connect API closed for browser JWTs at Supabase; service role retained.

This documentation-only [live-smoke] commit triggers the CI live health/API/ARKI/workspace/browser/resilience smoke test suite. It does not alter production code, customer data, billing mode, payment terms or Connect visibility. Authenticated AI answer quality and real payment flow are not covered by unauthenticated live smoke.
