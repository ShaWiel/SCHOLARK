# SCHOLAVERUM r278 — production release candidate

## Release
- Application version: `r278-language-live-surface`
- Production service: Render `scholark-web` (manual deploy only)
- Approved source merge: `617abd07319cafc95aca2978e195380d37b1af65`
- PR: https://github.com/ShaWiel/SCHOLARK/pull/49
- PR validation: SCHOLARK CI 38992768148 success; CodeQL 38992768151 success
- Merged main validation: SCHOLARK CI 38993341349 success; CodeQL 38993341366 success

## Improvements
- 75-language registry preserved, including Arabic/RTL, Mandarin, Swahili and all existing interface choices.
- Detect live in-place changes to DOM text nodes and controls rather than reapplying stale original copy.
- Translate input placeholders, button aria labels, titles and image alt text, including the root element itself.
- Protect user-submitted content, document/code editors, personal chat messages and password fields from automatic UI translation.
- Live mutation observer skips its own writes to prevent infinite translation loops.
- Restore canonical English text and metadata when switching back.
- Recognize public #home, #pricing, #start and #credit-store routes; maintain homepage-to-workspace language choice.
- Broader discovery of dynamically loaded workspace features and additional core ARKI/Tutor translations.
- Safe fallback if browser storage is unavailable.
- New Playwright r278 smoke passed on desktop and mobile with nl/fr/es/en, Swahili provider translation, Arabic RTL and dynamic attributes.

## Invariants and cautions
- Connect must stay Coming Soon; Supabase launch gate stays closed.
- Paddle remains Sandbox; no live payment or trial-policy changes.
- All prior r277 ARKI/Tutor profile privacy and API burst controls preserved.
- Do not assume 100% machine translation quality for all dynamically translated languages; failure must fail soft and preserve usability.

## Production process
Run full [release-gate] workflow on this documentation commit and require CI, CodeQL and Gate success on the *same exact SHA* before deploying. Then confirm Render live and run [live-smoke] against deployed website.
