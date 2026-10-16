# SCHOLAVERUM r275 production live smoke verification

Production application commit: c56e78628178c4df9e982f469fc5b32fa8973a24
Render deployment ID: dep-db8tqruq1p3s739cejog
Render service: scholark-web (manual deployment)
Production URL: https://scholark-app-shawiel.onrender.com
Release: r275-api-burst-bounds

## Validated before production
- Release Gate run 38871870534: success on production commit.
- SCHOLARK CI run 38871870494: success on the same commit.
- CodeQL run 38871870447: success on the same commit.
- Render reported the intended commit as live; startup confirmed the r275 release.
- Credit connection and self-test: PASS.
- Document exports (PPTX/PDF/DOCX), reference extraction and public artifact sanitization: PASS.
- Global school discovery startup self-test: PASS.

## Guardrails
- Connect remains Coming Soon with database browser-facing RPC/table grants revoked.
- Paddle remains Sandbox; Pro sandbox price check returns trial_policy_mismatch. Prices/trial terms and webhooks have **not** been changed.
- Browser-facing rate-limit memory has a 10,000-client cap and a 32-request/minute expensive burst threshold.
- Multi-cycle rapid language switching, stale home callback and 75-language layout are covered by regression tests.

The documentation-only [live-smoke] commit triggers the GitHub live-resilience-smoke job against the actual SCHOLAVERUM production URL. The production deployment remains pinned to the validated c56e786 commit; this documentation change does not alter application code.
Unauthenticated live smoke does not prove authenticated user AI responses or real payment transactions.
