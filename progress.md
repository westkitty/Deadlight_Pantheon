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

## 2026-10-28 procedural soundscape & kinematic atmosphere uplift

- Implemented procedural Web Audio soundscape engine (`SOUND`): zero runtime dependencies, strictly offline, opt-in via audio toggle button (`♩`/`♫`).
- Tuned realm-specific frequency chords and acoustic timbres:
  - Cathedral: A minor shimmer (55.0/110.0/130.81 Hz + 220 Hz detuned by 1.5 Hz creating a slow hypnotic acoustic beat).
  - Basilica: Sub-bass F0/C1 stillness (43.65/65.41/87.31 Hz) with filtered white-noise cathedral drafts.
  - Obsidian Court: Tritone dissonance (low D1 at 36.71 Hz + G#1 augmented fourth at 51.91 Hz) with filtered saw grind.
  - City of Bells: Pentatonic bronze cluster (73.42/110.0/146.83/293.66 Hz).
  - Mourning Spire: Cataract sub-bass (58.27/69.30 Hz) with dynamic lowpass noise simulating cascading blue rivers.
  - The Unhappened: 110.0/110.6 Hz binaural beating pair (0.6 Hz delta-alpha wave resonance) with delicate 880 Hz glass overtone.
- Seamless cross-fading of ambient drone tracks during realm transitions.
- Added tactile stone footstep synthesis (`SOUND.step`) synced with player movement cadence and sprint speed.
- Resonant dual-tone bronze witness chime upon opening memories, distinct harmonic verdict chords (unbound ascending major triad vs sealed deep fifth), and resonant ascending lowpass gate sweeps.
- Added first-person kinematic head-bob and subtle lateral sway synced with movement, automatically disabled when reduced motion is preferred.
- Added titan organic micro-animations: systolic/diastolic double heartbeat for Seraphine's forbidden heart, rhythmic breathing pulse for Malach's mask, Thaum-IX's resonant waveform chest, and Azrath's electric quantum jitter.
- Rebuilt `index.html` (2,677,062 bytes) and executed full smoke test suite: all 6 realms, all 18 events, 3 endings, context recovery, 60 FPS frame time (16.67 ms mean/p95), and strict < 20% HUD occupancy passed with 0 errors.

## 2026-10-28 AAA-quality visual & atmospheric overhaul

- Comprehensive PBR material overhaul: defined surface-specific physical roughness and metalness across all 16 material types in `src/engine.js`. Polished dark obsidian stone (`r:0.16, m:0.45`), heavy forged steel (`r:0.38, m:0.76`), high-luster bronze/gold metallic trim (`m:0.84–0.90`), porcelain bone (`r:0.82`), and glistening low-roughness crystals (`r:0.18–0.22`).
- Dynamic per-realm lighting & atmospheric grading in Three.js (`GLWorld.render`): direction key light, rim light, ambient sky/ground light, and fog distances tuned dynamically per realm (Cathedral golden lantern key / cyan rim; Basilica cold monochrome key / icy diamond rim; Eclipse amber key / blood-red rim; Bells antique bronze key / teal rim; Mourning Spire misty key / cascading aquamarine rim; Unhappened quantum key / electric violet rim).
- Environmental living animation: animated flickering flame braziers along the Gothic nave aisle, active memory beacon acceleration and scale pulsation, and swirling 3D organic vortex motion for ambient ember motes.
- Added cinematic camera trauma impulse (`CAMERA.shake` & `CAMERA.kick`) on decisions and gate passage, smoothly damping in `renderGame`.
- Polished commercial glassmorphic HUD styling with dark frosted glass (`backdrop-filter: blur(16px)`), luminous hairline borders, glowing hover states, and refined typography.
- Mobile overlay occupancy tightened (1920x1080: 5.46%, 1440x900: 10.55%, 390x844: 16.18%, 360x800: 18.49% — well below the hard 20% limit).
- Rebuilt `index.html` (2,681,666 bytes) and verified with full smoke test suite: 60 FPS frame time (16.67 ms mean/p95), 6 live Three.js realm transitions with bounded resources, 0 page errors, 0 network requests.

## 2026-10-28 Colossus Gaze Tracking, Spatial Audio & Radiant Feedback

- Titan living colossus gaze tracking: `stage.face` dynamically tracks the traveler's horizontal position across the nave aisle and tilts downward as the traveler nears the monument (`clamp(PLAYER.x * .022, -.14, .14)` yaw, `clamp((8 - PLAYER.z) * .003, 0, .11)` pitch), creating an overwhelming sense of ancient colossal scale and awareness.
- Companion hound and aura motion: dog companion wags tail with speed-dependent cadence, and traveler aura rotates with breathing scale.
- Dynamic celestial lighting drift: Three.js key and rim directional lights sway organically with subtle intensity modulation in `GLWorld.render`, producing breathing specular highlights across metallic and stone surfaces.
- Spatial Web Audio beacon resonance and titan infrasound: crystalline harmonic beacon hum scales up smoothly as player approaches memory altars (`d < 22m`), and a profound sub-bass infrasound drone (43.65 Hz) resonates when the player tilts their gaze upward toward the towering titan head.
- Radiant full-screen verdict flash: `#flash-fx` overlay bursts with cyan radial bloom for Unbound verdicts and warm amber for Sealed verdicts, synchronizing with camera trauma kick.
- Rebuilt `index.html` (2,684,404 bytes) and verified with full smoke test suite: 60 FPS frame time (16.67 ms mean/p95), 6 live Three.js realm transitions with bounded resources, 0 page errors, 0 network requests.
