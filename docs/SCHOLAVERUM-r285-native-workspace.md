# SCHOLAVERUM r285 — a Workspace with its own identity

The Workspace is rebuilt around SCHOLAVERUM's night-blue canvas, lime and lilac surfaces, strong sans-serif typography, branded learning orbit and consistent SVG tool icons. The dashboard moves from a centered assistant landing screen to a workbench: assistant and next action side by side, actual weekly activity, recent work, study directions, personal setup and a searchable tool directory. ARKI and AI Tutor share the brand rail and typography while their conversations retain quiet reading surfaces.

The dashboard remains owned by the canonical V51 template. Its existing `data-workspace-owner="r284"` marker is a compatibility protocol for the legacy guards; `data-workspace-layout="r285"` identifies the new design. Retaining the ownership protocol preserves the first-paint lock, duplicate repairs, existing routes and Coming Soon boundaries.

Weekly task completions, focus minutes and active goals come from the existing core computation. Empty profiles show zero and honest empty states. Tool search works against translated directory copy and preserves its query, assistant choice and unfinished question across structural recovery.

Submitting a question during the first cold load now waits for the handoff module, retains the selected assistant and draft, prevents duplicate submissions and cancels on navigation. A failed load leaves the question in the composer with a retry message instead of forwarding a Tutor question to an ARKI draft.

Validation covers the actual brand and responsive layout, live data updates, filtering and its empty state, structural recovery, Dutch copy, a deliberately delayed first Tutor handoff and the retained legacy, tour, account, route, browser and security regressions. Deployment follows the repository's CI, release gate and production verification sequence.
