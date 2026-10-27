# Deadlight Pantheon progress

## 2026-10-27 bootstrap baseline

- Authoritative project extracted from `Deadlight_Pantheon_Codex_Handoff_2026-10-27.zip`.
- Package integrity: 104/104 SHA-256 entries pass.
- Repository identity: `main` at `9dc9ea186499db22a2d65bda7a66e2928d22d03b`; packaged uplift is intentionally dirty; no remote is configured.
- Preserved the separate scratch repository at `/Users/andrew/Deadlight_Pantheon` unchanged.
- `python3 src/build.py` rebuilt `index.html` byte-for-byte (`59a62caeabeca0d6c68f21929a3c322f34f7cf2f932cad13be029669c49dfbbe`).
- `node --check` passed for `story.js`, `engine.js`, `world.js`, `realm-identity.js`, and `app.js`.
- `python3 tests/smoke.py` is BLOCKED before execution: `ModuleNotFoundError: No module named 'playwright'`.
- Governing mission gap: current renderer is custom WebGL, not locally bundled Three.js; live GPU and physical touch proof remain unverified.

## Current objective

- Inspect the existing artifact and source-video references.
- Close feasible master-mission gaps without discarding the packaged uplift.
- Rebuild and verify the standalone offline artifact.
- Stage and commit an explicit allowlist only after checks pass.
- Push and enable GitHub Pages only against a confirmed writable upstream; no remote currently exists.

## 2026-10-27 Three.js release candidate

- Vendored official `three@0.186.1` plus license; `src/build.py` embeds it into the offline artifact.
- Replaced the live renderer with a Three.js adapter while retaining the authored scene graph and save/story contracts.
- Added compact/mobile HUD composition, complete H-key UI hide mode, explicit archive-reading modes, deterministic state/time hooks and overlay-union measurement.
- Browser suite PASS: live Three.js r186 (606 calls, 33,664 triangles, 8 geometries, 11 textures), 16.67 ms mean/p95 host frame time, six finite/live realm transitions, 18 witness paths, three endings, context restoration, mobile layout and zero requests.
- Required overlay viewports PASS: 4.73%–18.62% in walking and interaction-prompt states.
- Supplied movement harness PASS on actual `file://`; player moved across both iterations, state remained coherent, no error file emitted.
- Added GitHub Pages workflow using current official action majors. No matching repository exists under authenticated account `westkitty`; remote creation remains unresolved.
