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
- Keep remote creation, local commit, push, Pages deployment and browser acceptance as distinct states.

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
- COMMIT: release commit `67059dca263443b85fb5aade45551c484b7fcd3e` records the tested Three.js experience.
- PUSH: local and GitHub `main` both resolved to `67059dca263443b85fb5aade45551c484b7fcd3e` after publication.
- DEPLOYMENT: GitHub Pages workflow run `40480556718` completed successfully for that exact commit. The public endpoint is `https://westkitty.github.io/Deadlight_Pantheon/`.
- LIVE ARTIFACT: the public endpoint returned HTTP 200 and its 2,669,131-byte HTML matched the committed `index.html` SHA-256 `580a1410b381088897c21111a4ed1549d7176167f105718ac0d90d01c3fd0e3c` byte-for-byte.
- BROWSER OBSERVATION: the public title screen and Vespera/Malach Vex Three.js realm rendered in the in-app browser and accepted the Enter Vespera action.
- UNVERIFIED: no physical hardware-GPU, physical touch-device, long-session, or human acceptance claim is made.

## Reference-Fidelity & Exploration Polish — revision 4 / 2026-10-27
- VERIFIED: First-person exploration is now the default mode (`APP.view='first'`), providing an unobstructed viewpoint of the colossal titans, Gothic naves, and causeways. Player avatar is cleanly hidden during first-person view, with seamless toggle to third-person via V key or HUD button.
- VERIFIED: Fixed HUD compass indicator styling where `.compass span` improperly matched the distance text span (`#dist-text`), causing text clipping and rotation in the bottom-right corner. Restructured to `.compass>span:first-child`, restoring crisp, clean, horizontal readouts.
- VERIFIED: Dynamic realm crumbs now accurately display each realm's domain and chapter title (`THE FESTIVAL OF LAST CHANCES / DEADLIGHT 01`, `THE BASILICA OF UNSPOKEN NAMES / DEADLIGHT 02`, etc.) rather than hardcoded "VESPERA".
- VERIFIED: Rebuilt shared Gothic nave framing to open center sightlines, emphasize warm firelight floors, cyan crystalline silhouettes, and dominant centered titans matching the film stills.
- VERIFIED: Full test suite (`tests/smoke.py`) passed cleanly: 60 FPS equivalent frame times (16.67 ms mean/p95), 6 live Three.js realm transitions with bounded resources, strict < 20% HUD occupancy across 4 viewports (5.17%–19.57%), all 18 witness choices, all 3 ending branches, save restoration, and context recovery.
## Procedural Soundscape & Kinematic Atmosphere Uplift — revision 5 / 2026-10-28
- VERIFIED: Procedural Web Audio soundscape engine (`SOUND`) added: opt-in, zero runtime dependencies, strictly offline. Features realm-specific tuned frequency drones (Cathedral A minor shimmer with 1.5 Hz acoustic beat; Basilica sub-bass F0/C1 stillness with filtered cathedral breath; Obsidian Court low D1/G#1 tritone dissonance; City of Bells pentatonic bronze overtone cluster; Mourning Spire deep Bb0/Db2 cataract drone with filtered cascading water; Unhappened 110.0/110.6 Hz binaural beating pair with 880 Hz glass overtone).
- VERIFIED: Smooth cross-faded realm transitions on chapter change, tactile stone footstep synthesis (`SOUND.step`) tied to movement cadence and sprint speed, resonant bronze witness chimes on relic approach, distinct harmonic verdict chords (unbound ascending major triad vs sealed deep fifth), and resonant ascending gate pass sweeps.
- VERIFIED: First-person kinematic head-bob and subtle lateral sway synced with movement, automatically disabled when reduced motion is preferred.
- VERIFIED: Titan organic micro-animations added: systolic/diastolic double heartbeat for Seraphine's forbidden heart, rhythmic breathing pulse for Malach's mask, Thaum-IX's resonant waveform chest breathing, and Azrath's electric quantum jitter.
- VERIFIED: Full test suite (`tests/smoke.py`) passed cleanly: 60 FPS equivalent frame times (16.67 ms mean/p95), 6 live Three.js realm transitions with bounded resources, strict < 20% HUD occupancy across 4 viewports (5.17%–19.57%), all 18 witness choices, all 3 ending branches, save restoration, and context recovery.
- UNVERIFIED: Physical hardware GPU, physical touch-device thermals, and human visual acceptance remain separate from test-host software WebGL evidence.
