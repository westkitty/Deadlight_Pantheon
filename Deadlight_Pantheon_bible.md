# Deadlight Pantheon — Project Bible

## 2026-10-27 / Baseline and uplift contract
- Origin: user supplied a 30-second LED-mask titan film, requested six mythologies then an interactive offline walkable HTML world.
- Baseline: one-file custom WebGL renderer, six procedural titan worlds, 18 witness memory events, dialogues, atlas, codex, local save/export, offline visual fallback.
- Protected: local/offline-only, user-supplied film appearance (source stills and distinguishing silhouettes), six named titan mythologies, all 18 testimonies, accessibility fallback, independent saved decisions.
- Honesty: exact reference-model extraction is not available from video alone. Custom WebGL does not equal official Three.js. GPU behavior on hardware is unverified here.
- Git: previous committed main at 9dc9ea1; no remote/push recorded.
- Uplift scope: three groups — source-specific memory plates + world-responsive choices; six realm signatures; exploration accessibility and GPU recovery. No dependency migration or Git publication.

## 2026-10-27 / Uplift implementation (uncommitted)
- Added 18 individually timestamped source-video stills; each witness narrative now has a distinct archival plate.
- Added `realm-identity.js` with 6 differentiated architectural signatures; structural tests see 1,118–1,610 finite scene-graph nodes per realm and all 18 scenes.
- All recorded 0/1 choices now tint their 3D memory reliquary and expose a witness marker; replay recalls the original choice. Three distinct endings exist, with all 18 required to open the final gate.
- Added directional wayfinding, modal keyboard focus containment, reduced-motion preference, phone-friendly ECO default and WebGL context-loss fallback/retry logic.
- Commands: `python3 src/build.py` PASS; `node --check` on JS PASS; `python3 tests/smoke.py` PASS for all event paths, branching, six scenes, keyboard/mobile fallback and no network requests.
- Visual screenshot review: intro, source-film scene, witness response, mobile atlas, mobile visual fallback.
- Known unverified: real GPU display, GPU restoration on actual hardware, mobile FPS, persistence after real browser restart. Official Three.js and exact 3D source mesh recreation are still out of scope/unmet.
- Source state: initial Git HEAD `9dc9ea1`; current improvements remain uncommitted. No remote or GitHub push.
- Authorship scanner: PASS_WITH_REVIEW; canonical dialogue and in-world Codex term narrowly allowed; base64 false positives documented.

## 2026-10-27 / Three.js release candidate
- Replaced the live custom-renderer boundary with official, vendored `three@0.186.1` while preserving the authored Node graph, story, save key and all 18 decisions.
- The standalone `index.html` embeds the Three.js IIFE bundle and all imagery; the actual `file://` artifact generated movement/state screenshots with no runtime error artifact.
- Measured exploration overlay union is 4.73%–18.62% across the required desktop/mobile viewports. The old permanent rail is gone; Atlas, dossiers and testimony panels are explicitly paused archive-reading modes; H provides complete HUD hide/restore.
- Fresh Chrome evidence covers a non-empty live Three.js canvas, all six structural realms, 18 witnesses, three endings, mobile overflow, zero requests and successful context restoration under software WebGL.
- Remaining boundary: models are still source-informed procedural interpretations; physical GPU, touch, thermals, long-session persistence and human visual acceptance are not proved.
- GitHub Pages workflow is prepared, but no upstream exists yet. Do not describe push, Pages deployment or live acceptance as complete until an explicit remote is confirmed and its workflow/URL are read back.
