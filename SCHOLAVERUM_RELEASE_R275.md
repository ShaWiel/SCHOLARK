# SCHOLAVERUM release r275 – approval candidate

## Version
- Release: `r275-api-burst-bounds`
- Expected Docker/runtime asset release: `20261016-r275-api-burst-bounds`
- Production service: Render `scholark-web` on branch `main` (manual deploy only)
- Source merge commit: `3baf63eb98851f49d4dee35995cfe7be840e27b3`

## Verified before release gate
- PR #44 corrected the stale home-foundation callback that could replay German after the user selected Dutch.
- New deterministic stale-selection regressions, multi-cycle fast-switch tests, RTL and mobile layout checks.
- PR #45 bounded AI burst rate-limit client memory at 10,000 keys while preserving 32/minute client limiting; new 11,500-client regression.
- Main branch CI succeeded in run 38870449433; CodeQL succeeded in run 38870449226.
- Existing Paddle Sandbox, Connect Coming Soon and private Connect RPC/table launch lock remain unchanged.

## Production requirements
Trigger the [release-gate] CI and validate its complete result **before** any Render deploy.
Deploy **this exact release-gate main SHA**, not the merge SHA above, only after the gate, main CI and CodeQL pass.
Then verify the intended commit is live and run a separate production [live-smoke].
Do not change Paddle environment, pricing, trials or transaction states.
Never describe simulated unauthenticated model checks as real authenticated user sessions.
