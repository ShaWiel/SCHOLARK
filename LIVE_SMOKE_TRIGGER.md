# SCHOLAVERUM r272 post-deployment verification

Production application commit: c3c3db1575c8dc078afc70fa66970ef01ca54b55
Render deployment: dep-db89n0ivcj2c738nmg70
Render service: scholark-web (manual deployment)
Production URL: https://scholark-app-shawiel.onrender.com
Release: r272-foundation-privacy

Confirmed via Render:
- Deployment status live, startup release r272-foundation-privacy.
- Security foundation, API guard, learning route and workspace modules initialized.
- Credit service startup self-test passed; document exports and references passed.
- Paddle remains in sandbox; production logs report a Pro catalog verification warning (http_unknown) that requires separate follow-up.

The documentation-only live-smoke GitHub commit triggers live health/API/ARKI/Workspace/Language Learner/Schools Near Me browser and resilience smoke coverage. It does not change deployed application code, payment configuration, account data, or Connect release status.

Authenticated live-model responses are not guaranteed by unauthenticated smoke tests; do not consume real users' credits.
