# SCHOLAVERUM r304 — production live verification (2026-10-30)

- Render application commit: `a23547d57065d11cbb21743d6244c81bd2190106`
- Render deployment: `dep-dbig8m942hec73f3s1qg`
- Production service: `scholark-web`; manual deploy, Auto Deploy off
- Live URL: https://scholark-app-shawiel.onrender.com
- Release: `r304-cinematic-depth-stability`
- Standard GitHub CI and CodeQL: successful on PR source SHA `62e96f83813229a9161fd428a60049ba6b63b061`.
- Production release gate: run `41125798675`, successful on deployed merge SHA.
- Render deploy: confirmed **live** and commit matches approved release.
- Postdeploy smoke: triggered by this documentation-only `[live-smoke]` commit.
- No Supabase schema migration, data mutation, Edge Function replacement or secret changes required for these public Canvas2D/CSS homepage refinements.
- Paddle remains Sandbox, Connect remains Coming Soon.
- The GitHub live-smoke trigger only changes this document, not the already deployed application binary.

---

# SCHOLAVERUM r278 production live validation

## Release identity
- Render app code commit: `e6760297626c36fc1dbd20d727ea6cb08219d9af`
- Render deployment ID: `dep-db9dku7btjjs73bb0ldg`
- Render production service: `scholark-web` (manual deploy)
- Production: https://scholark-app-shawiel.onrender.com
- Version: `r278-language-live-surface`
- Render: status **live**; version and 75-language registry confirmed in startup logs.

## Required production checks
- Standard CI on exact deployed commit: 38993796570 success.
- CodeQL on exact deployed commit: 38993796615 success.
- Release Gate on exact deployed commit: 38993796554 success.
- Deploy only after all three matched: completed.
- **Postdeploy live smoke:** trigger via this documentation-only `[live-smoke]` change.

## Localization release scope
- Translate changes on existing DOM text nodes and placeholders, ARIA labels, titles and image alt descriptions, not just newly mounted elements.
- Preserve last user-selected locale across homepage, workspace, Start, Pricing and Credit Store.
- Correct return to English after dynamic and RTL locale switching; Arabic has correct RTL direction.
- Increase visible feature coverage for all 75 registered locales and add offline copy for key ARKI/Tutor controls in six core translation languages.
- Desktop and mobile integration tests cover nl/fr/es/en, mocked Swahili translation provider, Arabic RTL and English restoration.
- Do not translate user-authored messages, password fields, code blocks, document editor contents or other protected private content.

## Production constraints
- Paddle still Sandbox. Do not alter trial policy, payment settings or subscriptions.
- Connect remains Coming Soon with browser-access API revoked.
- Runtime real-model credentials, authenticated conversations and real payment transactions are not proven by unauthenticated smoke alone.
- Dynamic translations beyond offline core locales may depend on translation provider availability; failure should not block navigation.

This documentation-only commit does not update the deployed Render application binary; it activates the separate live-resilience smoke workflow.
