# SCHOLAVERUM r286 — expanded learning level selection and Study Ahead cleanup

## Requested improvements
- Expand the Your Learning Level section across the full dashboard width when opened. Show all Suriname level groups and worldwide categories in a responsive grid with no internal sideways carousel.
- Quarantine retired homepage and Workspace surfaces by route-specific prepaint CSS and the Workspace integrity guard, and require a single canonical r285 layout before initial Workspace paint.
- Add Remove per saved Study Ahead plan and confirmed Remove all, delete authenticated user-owned records from Supabase, clear currently displayed removed records and local cache, prevent stale loads during deletion, and provide accessible feedback.

## Safety and verification
- Supabase study_ahead has RLS enabled, authenticated SELECT/DELETE grants and authenticated user ownership policies; anon cannot DELETE.
- Frontend destructive operations require an authenticated session and specify user_id filters. Remove all requires confirmation. Requests report failures without hiding unsaved data.
- r286 browser smoke uses mocked cloud requests and verifies account isolation without deleting any real production study data.
- CI static checks and full cross-browser regression passed on application commit `036a0ced7867b32bcc25cf516e2dac11c3ac978c`.
- Release gate must pass before manual Render deployment; then run production verification.

## Gate retry
The first release gate caught a browser test that required a retired Home element to remain present. The test now accepts the stronger condition where that element has been completely removed, as well as when it is hidden. The runtime implementation is unchanged.

## Live deployment
The approved release `e8cff157e2124457c7b566c5f22695f0dec41483` is live on Render `scholark-web` via deployment `dep-db9k6j6q1p3s738iicfg`. This documentation-only commit requests read-only production browser verification of r286; no application assets changed after the approved release.

## Final live smoke alignment
The live application remains deployed at `e8cff157e2124457c7b566c5f22695f0dec41483`. The production smoke expectation was updated to recognize the stricter r286 canonical prepaint invariant (`#v51-main` singleton plus r285 layout). This documentation-only change triggers read-only live verification with no runtime deployment.
