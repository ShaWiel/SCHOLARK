# SCHOLAVERUM r277 production verification

Application SHA on Render: bcec37ab0b68ae3b364cc19eb85c0c7c2a5db4d0
Render deploy: dep-db9729eq1p3s73ar01c0
Render service: scholark-web (manual deploy; auto deploy disabled)
URL: https://scholark-app-shawiel.onrender.com
Release: r277-arki-tutor-isolation

## Release checks verified on the exact production application commit
- Main CI: GitHub run 38947923325 succeeded.
- CodeQL: GitHub run 38947923635 succeeded.
- Release Gate: GitHub run 38947923792 succeeded.
- Render status: live, startup r277-arki-tutor-isolation, security foundation enabled.
- Credit service Supabase HTTP 200 self-test passed.
- Public artifact sanitization, document exports/reference extraction and global schools startup self-tests passed.
- No in-place changes to existing chats or databases were made by this deploy.

## ARKI and AI Tutor protection
- ARKI chats and drafts, Tutor saved chats/progress/feedback and attachments are isolated by current account.
- Requests and late replies are associated with originating account/chat rather than the most recently opened account/chat.
- Tutor duplicate in-flight request guard.
- Legacy shared-device chat restore is explicit opt-in, preserving the original data and protecting existing per-account chats.
- Copy messages, in-chat HTML preview, translation race guard and AI fallback remain available.

## Guardrails and known issue
- Connect remains Coming Soon with browser RPC/database access denied.
- Paddle remains sandbox; Pro price has trial_policy_mismatch. No pricing, billing mode or subscriptions changed.
- Live smoke is unauthenticated and cannot prove actual paid-auth AI responses or transactions.

This **documentation-only [live-smoke]** commit triggers the live-resilience-smoke GitHub job on the active r277 production website without modifying the deployed app code.

## Rerun after r277 live-smoke harness correction (2026-10-16)
- Previous live check (run 38951518115) failed at HTML-preview probing because it wrote to the pre-r277 unscoped ARKI keys.
- PR #48 corrected the smoke harness to write the guest account-scoped chat and active ID; GitHub CI run 38954412045 and CodeQL 38954411965 both succeeded.
- This follow-up [live-smoke] rechecks the same deployed application commit without altering production code or user data.
- Do not describe live AI replies as authenticated model verification: this browser suite is not signed in.
