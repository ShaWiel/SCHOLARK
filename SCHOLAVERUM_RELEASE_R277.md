# SCHOLAVERUM r277 — ARKI + AI Tutor privacy, recovery & resilience release

Application release: `r277-arki-tutor-isolation`
Docker/runtime assets: `20261016-r277-arki-tutor-isolation`

Source merge commit: `29330bc38bef30754a1a5a3adaebf528baddbb13`
Release service: Render `scholark-web`, branch `main`; auto-deploy remains disabled.

## Verified candidate
- PR #47 CI success: https://github.com/ShaWiel/SCHOLARK/actions/runs/38946156507
- PR #47 CodeQL success: https://github.com/ShaWiel/SCHOLARK/actions/runs/38946156443
- Merged `main` CI success: https://github.com/ShaWiel/SCHOLARK/actions/runs/38947022319
- Merged `main` CodeQL success: https://github.com/ShaWiel/SCHOLARK/actions/runs/38947022221

## Release contents
- Isolate ARKI chats, active sessions, saved drafts and Tutor conversations by signed-in account on a shared browser.
- Associate in-flight ARKI/Tutor results with the originating account, and Tutor results with the originating chat.
- Prevent duplicate parallel Tutor sends to conserve model calls and avoid double charge attempts.
- Invalidate ongoing photo/document attachments and quota snapshots on account switch.
- Restore previous device-wide chats only after explicit user confirmation, never deleting the originals or evicting current account chats; allow incremental recovery where chat limits permit.
- Carry forward merged r276 Gemini model cooldown rescue and previously green ARKI, education, safety, global school and workspace regressions.
- Keep Connect Coming Soon and Supabase Connect browser RPC/table lock in place.
- Keep Paddle Sandbox and unchanged subscription trial terms; do not process live charges.

## Before production deploy
This documentation-only [release-gate] commit must complete Release Gate **and** main CI/CodeQL successfully. Deploy the exact release-gate SHA manually to Render only after all checks are green. After Render confirms it is live, trigger a separate [live-smoke] and verify real production health, UI navigation and boundaries.

Do not represent unauthenticated smoke tests as a full signed-in AI conversation or payment transaction.
