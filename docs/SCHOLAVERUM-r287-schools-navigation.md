# SCHOLAVERUM r287 — Schools Near Me lazy navigation recovery

The r286 Workspace improvements (full Learning Level grid, Study Ahead Remove/Remove all, and legacy Home/Workspace isolation) remain unchanged.

## Defect discovered by production browser verification
A direct programmatic transition from Reminders to Schools Near Me could leave Schools Near Me unopened because the existing Workspace shell clicked a legacy launcher and retried only once after 35 ms. The school finder module is loaded on demand, so it may not yet exist at that time.

## Fix
- The canonical Workspace shell mounts Schools Near Me through the exposed Schools API once runtime.ensure('schools') completes.
- The asynchronous mount checks that #schools is still active, preventing stale route callbacks from opening over other pages.
- The existing r286 live surface/Study Ahead regression also tests navigation from Reminders to Schools Near Me and singleton rendering.
- Runtime asset cache and release identity bumped to r287.

## Verification
Run static and full CI, the gated browser regression, then deploy only the approved commit and rerun live verification. Browser smoke mocks Study Ahead records; it never deletes real user data.