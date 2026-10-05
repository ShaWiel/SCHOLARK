# SCHOLARK production release process

SCHOLARK production uses a controlled manual release process. The production Render service `scholark-web` intentionally keeps Auto Deploy off so a normal push to `main` cannot bypass validation.

## Release sequence

1. Push normal development changes to `main` and require the standard **SCHOLARK CI** run to finish green.
2. Before a production release, make a final release-candidate commit containing **[release-gate]**. The Release Gate must pass static/syntax checks, the production Docker build, API/global Schools/load/credit resilience checks, Chromium, Firefox, WebKit, mobile-device QA, and the homepage/runtime contract.
3. Only after the gate is green, manually deploy the intended `main` commit to the Render service **scholark-web**. Do not deploy an older SHA.
4. Confirm Render reports the intended commit as **live** and that startup logs show the expected SCHOLARK release.
5. Run the post-deploy live smoke using **[live-smoke]** or the SCHOLARK CI workflow dispatch. The live smoke checks production health, the AI resilience router, API/security boundaries, Home, Wallet, Credit Store, Workspace, ARKI UI, Language Learner, Schools Near Me, representative languages, and Home/Workspace language re-entry.
6. If either the Release Gate or live smoke is red, the release is not accepted. Fix the regression and repeat the gate; for a broken production deploy, restore the last known-good Render deploy.
7. Paddle must remain in Sandbox until the separate live-payment end-to-end validation is intentionally performed.

## Production rule

A GitHub commit is not considered a SCHOLARK production release merely because it exists on `main`. A release is accepted only when the release gate is green, the intended Render deploy is live, and the post-deploy live smoke is green.
