# Deadlight Pantheon — Operational State

Project ID: deadlight-pantheon
Revision: 3 (2026-10-27; Three.js release candidate)

## Artifact contract
- A standalone offline HTML story world with six titan realms and 18 witness events.
- Original user-supplied video frames remain the authoritative visual reference; procedural 3D models are interpretations, not exact reverse-engineered meshes.
- Desktop and touch controls, atlas, dossiers, testimony export, and recovery path when WebGL is unavailable are protected.
- Current live renderer is official Three.js r186, vendored locally and embedded by `src/build.py`.

## Baseline
- Local Git repository on main, HEAD 9dc9ea186499db22a2d65bda7a66e2928d22d03b.
- No remote configured and no verified GitHub push.
- `src/build.py` creates standalone embedded `index.html` without external assets.
- Static Chromium fallback renders; WebGL unavailable in current test browser.
- State is stored in localStorage key `deadlight-v1`; witness data must not be lost.

## Known weaknesses / unknowns
- Six stages retain a shared pilgrimage causeway beneath their realm-specific architecture.
- Procedural titan bodies are not source meshes and cannot establish exact unseen geometry.
- Hardware-GPU behavior, physical touch, thermals and sustained performance remain unverified on actual devices.
- Browser-restart persistence still needs a physical-browser acceptance pass.

## Release scope
- Preserve the authored world graph, `deadlight-v1` save schema, story, derived film plates and original Git history.
- Replace only the live renderer boundary with pinned, locally bundled Three.js.
- Keep remote creation distinct from local commit and Pages workflow preparation.

## Validation obligations
- Embedded output exactly reconstructs from source with no runtime URLs.
- 18 scenes, options, progress, atlas, final ending, export and save restoration remain available.
- No browser errors on fallback or menu flows; keyboard/touch affordances remain usable.
- Six 3D scene builds yield finite transforms; resources and context-loss behavior are bounded.

## Uplift outcome — revision 2 / 2026-10-27
- VERIFIED: structural builds for six realms with distinct authored geometry; all 18 distinct source-film memory plates present; 18 scripted witness/decision routes pass browser static-fallback tests.
- VERIFIED: previous incomplete-final-chapter loophole closed; all 18 now required; sequential event access enforced; all three endings pass; memory monuments have distinct saved decision colors.
- VERIFIED: static mobile atlas, keyboard scene dialog flow, loss-of-GPU fallback, no runtime requests; output remains rebuildable offline.
- PARTIAL: actual navigation gestures, GPU renderer appearance, recovery from genuine GPU context loss and device performance remain unverified on hardware.
- PRESERVED: source video-derived six core reference stills, six named titans, original narrative/codex, Git initial commit and full local source tree.
- NOT MET: official Three.js runtime and exact source-derived 3D meshes. Both need a separate authorized work package and proof.
- DELIVERY: `index.html` and project source ZIP. No new commit or GitHub push was authorized in this uplift task.

## Three.js release candidate — revision 3 / 2026-10-27
- VERIFIED: `three@0.186.1` is vendored with its license and embedded into the 2.67 MB standalone artifact; live runtime reports `Three.js r186`.
- VERIFIED: headless Chrome software-WebGL rendered 606 calls / 33,664 triangles in the first realm, with 8 geometries and 11 textures; the canvas was non-empty. Frame timing measured 16.67 ms mean/p95 over 89 samples on that host.
- VERIFIED: six live Three.js realm transitions completed with geometry memory fixed at 8 and texture memory bounded at 2–11; current canvas captures are stored under `qa/current/`.
- VERIFIED: the actual `file://` artifact accepted movement through the supplied game harness, emitted deterministic state snapshots, and produced no console/page-error artifact.
- VERIFIED: exploration overlay union remained below 20% at 1920x1080, 1440x900, 390x844 and 360x800; measured range 4.73%–18.62%. Archive dialogs are explicitly labeled reading mode and pause the world.
- VERIFIED: all six structural realm builds, all 18 witness paths, all three endings, source plates, choice-colored geometry, fallback, and successful Three.js context restoration pass.
- PARTIAL: evidence is Chrome headless/software-WebGL, not a physical hardware-GPU or touch-device acceptance run.
- PUBLICATION: Pages workflow prepared; no remote exists, so push, workflow execution, Pages URL and public acceptance are not yet verified.
