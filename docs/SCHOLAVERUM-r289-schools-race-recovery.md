# SCHOLAVERUM r289 — production navigation recovery

## Scope
- Carry forward the fully approved and live r288 Workspace orbital logo and the gently rotating homepage sphere, preserving the old purple/lime SCHOLAVERUM brand.
- Fix production Schools Near Me transition failures seen in the anonymous live browser regression when switching from Reminders to Schools Near Me.

## Root cause and resilience
Route cleanup could unset v51-schools while the lazy school-finder module was pending. The previous mount aborted because it required v51-schools to already be present and attempted recovery only once. Runtime readiness in slow production differs from the CI container.
- The mount validates #schools as the current route, restores the school mode, calls the canonical school-finder API and verifies the one open school surface.
- After lazy ensure, bounded guarded retries try again at 100–9000 ms, canceling automatically when the user navigates away.
- A fallback is shown only after the last attempt. There is no second Workspace or retired UI layer.
- The existing r286 browser smoke deliberately delays the school-finder script to reproduce a slow production connection and asserts the school mode remains attached.

## Rollout safety
Release after full static audit, CI, CodeQL and browser release gate pass. Deploy exactly the gated commit to Render. Run read-only production verification afterwards. No user cloud data, billing, quota policies or AI providers modified.