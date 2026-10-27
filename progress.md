# Deadlight Pantheon progress

Original prompt: Deadlight Pantheon — the world and titans especially need to look more like the reference clip.

## 2026-10-27 bootstrap baseline

- Authoritative project extracted from `Deadlight_Pantheon_Codex_Handoff_2026-10-27.zip`.
- Package integrity: 104/104 SHA-256 entries pass.
- Repository identity: `main` at `9dc9ea186499db22a2d65bda7a66e2928d22d03b`; packaged uplift is intentionally dirty; no remote is configured.
- Preserved the separate scratch repository at `/Users/andrew/Deadlight_Pantheon` unchanged.
- `python3 src/build.py` rebuilt `index.html` byte-for-byte (`59a62caeabeca0d6c68f21929a3c322f34f7cf2f932cad13be029669c49dfbbe`).
- `node --check` passed for `story.js`, `engine.js`, `world.js`, `realm-identity.js`, and `app.js`.
- `python3 tests/smoke.py` is BLOCKED before execution: `ModuleNotFoundError: No module named 'playwright'`.
- Governing mission gap: current renderer is custom WebGL, not locally bundled Three.js; live GPU and physical touch proof remain unverified.

## Current publication state

- Authoritative repository: `https://github.com/westkitty/Deadlight_Pantheon` (public).
- Public build: `https://westkitty.github.io/Deadlight_Pantheon/`.
- Release commit `67059dca263443b85fb5aade45551c484b7fcd3e` was pushed to `origin/main` after the source and browser checks passed.
- Pages run `40480556718` completed successfully for the release commit.
- The live 2,669,131-byte artifact matched the committed artifact SHA-256 `580a1410b381088897c21111a4ed1549d7176167f105718ac0d90d01c3fd0e3c`.
- The public title screen and first live Three.js realm were visually observed in the in-app browser. Physical-device and human acceptance remain separate and unverified.

## 2026-10-27 Three.js release candidate

- Vendored official `three@0.186.1` plus license; `src/build.py` embeds it into the offline artifact.
- Replaced the live renderer with a Three.js adapter while retaining the authored scene graph and save/story contracts.
- Added compact/mobile HUD composition, complete H-key UI hide mode, explicit archive-reading modes, deterministic state/time hooks and overlay-union measurement.
- Browser suite PASS: live Three.js r186 (606 calls, 33,664 triangles, 8 geometries, 11 textures), 16.67 ms mean/p95 host frame time, six finite/live realm transitions, 18 witness paths, three endings, context restoration, mobile layout and zero requests.
- Required overlay viewports PASS: 4.73%–18.62% in walking and interaction-prompt states.
- Supplied movement harness PASS on actual `file://`; player moved across both iterations, state remained coherent, no error file emitted.
- Added GitHub Pages workflow using current official action majors.

## 2026-10-27 public release

- Created public GitHub repository `westkitty/Deadlight_Pantheon` and configured `origin` over SSH.
- Pushed tested release commit `67059dca263443b85fb5aade45551c484b7fcd3e`; remote ref readback matched.
- Enabled workflow-based GitHub Pages. Run `40480556718` passed its build and deploy jobs against the exact release commit.
- Public endpoint returned HTTP 200 and byte-for-byte matched committed `index.html` at SHA-256 `580a1410b381088897c21111a4ed1549d7176167f105718ac0d90d01c3fd0e3c`.
- Public-browser observation passed for the title screen, Enter Vespera transition and rendered Vespera/Malach Vex realm.

## 2026-10-27 reference-fidelity pass & exploration polish

- Reference comparison found that central roof beams and realm rings obscured the titans, while the film consistently uses an open Gothic nave, firelit floor, crystalline upper silhouette and dominant centered god.
- Rebuilt the shared nave framing to keep the center sightline open, strengthen warm/cyan source colors and expose the embedded reference environment behind the 3D geometry.
- Enlarged and moved the procedural titans into the primary composition; rebuilt their armor, luminous ribs, masks, crystal coronae, shoulder plates, arms and claws around the six chapter reference stills.
- Retained Iona's city-body and Azrath's electric birth-event as their source-specific silhouettes.
- Established first-person view as the default (`APP.view='first'`), removing third-person traveler obstruction and offering direct monumental immersion. Third-person remains switchable with V key or HUD icon.
- Fixed compass HUD layout glitch where `.compass span` applied a 7px cyan square constraint to `#dist-text`, rotating and clipping distance text in the bottom right corner. Changed selector to `.compass>span:first-child`.
- Made realm crumb display dynamic across all 6 realms (`${BOOK[i].domain} / DEADLIGHT ${BOOK[i].num}`).
- Ran full browser verification suite (`tests/smoke.py`) via Google Chrome: all 6 realms, all 18 events, 3 endings, context loss/restoration, bounded resources, 60 FPS host frame timing, and strict < 20% HUD occupancy across all 4 viewports passed with 0 errors.
