# SCHOLAVERUM r293 — editorial homepage pricing integration

## Intent
Bring subscriptions visually and functionally into the approved modern SCHOLAVERUM homepage. This is strictly a presentation/route update, NOT a pricing, wallet, plan-tier, credit, Paddle, or subscription change.

## Canonical pricing ownership
- The existing `scholark-v41-home-pricing-dashboard.js` remains the only owner of `#v41-home-pricing` and its 3 active buttons (`data-plan=free/plus/pro`). `scholark-v115-billing.js` continues to own Paddle payment clicks, auth-first checkout, and sandbox environment indications.
- Display prices are preserved: Free `$0`, Plus `$14.99/month`, Pro `$19.99/month`. Credit allowances are still 30/750/2,500 per month; feature lists and plan IDs are unchanged.
- Rebrand visible SCHOLARK subscription headings to SCHOLAVERUM, preserving precise prices and inclusions.
- The pre-existing pricing element is moved into `#v280-pricing-slot` within the authoritative r280 homepage instead of being cloned (avoids duplicate checkout buttons). Early-load mount and subsequent route navigation both recover the same node.

## Visual treatment
- Editorial 'MORE SPACE. MORE POSSIBILITY.' heading at homepage scale, dark navy background, ambient lime and lilac orbital accents.
- Three original plan cards with differentiated dark/cream/lime treatments, softer radii, plan hierarchies, large clear prices, checkmark features and working CTA buttons.
- Responsive one-column pricing on mobile, readable contrast and focus rings, reduced-motion support.
- Navigation includes Plans & pricing; direct `#pricing` retains the rebuilt homepage, never the old landing page.
- Preserve the approved r292 3D homepage sphere and remaining features, as well as Coming Soon labels for Studio AI and Book Studio.

## Tests and release process
- New browser smoke verifies placement, no old/duplicate pricing, plan descriptions and prices/credit totals, checkout button ownership, direct `#pricing`, mobile responsive layout/overflow and login-first Plus behavior.
- Run full CI, CodeQL and Release Gate including Docker API/browser/mobile QA; deploy only the approved SHA to Render and follow with read-only production verification.
- No production user data, quotas, paid product configuration, payment credentials or databases are modified.
## Release candidate verification retry
First gate confirmed the V41 price grid mounted in the V280 editorial slot. The test read an offscreen headline using `innerText` and got an empty string; it now reads DOM text using `textContent` and separately verifies a positive rendered heading height and visible CSS. The identical adjustment applies to offscreen monthly price and credits assertions; application data/behavior has not changed.

## Release gate QA correction 2
The updated gate confirms editorial pricing heading, canonical ownership, all three existing prices/credit allowances, and all billing hooks. The pricing-position assertion had referred to the visual class `.v280-final` instead of the actual final section ID `v280-start`. The test now compares the real DOM element IDs. No runtime behavior was modified.

## Mobile CSS tightening
The full gate verified pricing content and section ordering; the 390px responsive test flagged a card-size limit. The pricing grid and cards now explicitly use 100%-bounded widths, min-width zero and `minmax(0,1fr)` on mobile to stop text-driven grid overflow. The test also reports actual measured widths if that problem persists. No prices or billing hooks changed.

## Direct #pricing route compatibility
The responsive gate confirms the visual pricing grid and mobile card bounds. It also revealed that legacy route ownership could hide the editor homepage when the location hash was exactly #pricing. The modern home owner now normalizes #pricing to the canonical #home using history.replaceState, then scrolls to the existing V41 price cards once mounted. The price section and Paddle callbacks stay single-owned and no retired homepage is restored.
