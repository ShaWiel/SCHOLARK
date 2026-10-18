# SCHOLAVERUM r297 — production follow-up

## Change and scope
- PR #57 merged after its CI and CodeQL checks passed.
- Release commit `a21e76ea955f513c5f24d8135d68aab28d2a0455` passed GitHub CI, CodeQL, and Release Gate.
- WebGL loss now causes the public homepage's rotating globe to recover using a fresh CPU-rendered canvas.
- Orbit canvas backing buffers are capped on high-resolution devices.
- The approved SCHOLAVERUM logo, purple/lime rings and counter-rotating satellites remain unchanged.
- No billing, user account, credits, or personal records changed.

## Live deploy
- Render service `scholark-web`, ID `srv-d9u3r3ht0dsc73cgkch0`.
- Deployment `dep-dbab0a49v7es73frajqg` on the approved release commit, status **live**.
- Public URL: https://scholark-app-shawiel.onrender.com

## Next check
- Run the standard read-only live verification workflow against r297.
- Paddle remains configured for sandbox according to startup logs; do not change billing mode or credentials without owner-supplied live setup.
