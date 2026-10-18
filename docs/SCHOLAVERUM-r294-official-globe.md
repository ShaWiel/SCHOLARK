# SCHOLAVERUM r294 — official 3D globe

- Replace the previous r292 flat face artwork with 24 longitude strips on the front and 24 on the back, all rendered from the approved official `/scholaverum-official-logo-r290.webp` asset.
- Preserve a continuous 360-degree Y-axis rotation (22 seconds desktop, 25 seconds mobile), accessible reduced-motion behavior, and original hero ball dimensions.
- Retain the approved homepage, Workspace, pricing, ARKI and Tutor flows without changing backend data, quotas, payments or credentials.
- Update bootstrap, foundation and Docker release identifiers and browser smoke assertions for the r294 official globe.
- Deploy only after CI, CodeQL and release gate report green. Verify the Render `scholark-web` runtime on the deployed commit.
