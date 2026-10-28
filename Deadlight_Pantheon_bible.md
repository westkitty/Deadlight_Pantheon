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

## 2026-10-27 / Reference-Fidelity & Exploration Polish
- First-person exploration established as default mode (`APP.view='first'`), eliminating third-person character obstruction and placing the viewer directly in the monumental Gothic nave. Third-person remains switchable via V key or HUD button.
- Resolved compass distance HUD clipping bug by replacing broad `.compass span` selector with `.compass>span:first-child`, preventing distorted text rotation in the corner.
- Dynamic realm metadata correctly updates `#location-label` and `#location` across all six chapters to reflect canonical domain names and chapter titles.
- Shared Gothic nave architecture refined to maintain open axial sightlines to the six titans, matching the framing of the 2D film stills.
- Automated browser suite verified with Google Chrome headless software WebGL: 60 FPS equivalent host frame time, bounded GPU resources across 6 realms, strict < 20% overlay union (5.17%–19.57%), all 18 testimonies, all 3 ending branches, and context loss recovery.

## 2026-10-28 / Procedural Soundscape & Kinematic Atmosphere Uplift
- Procedural Web Audio soundscape engine (`SOUND`): zero runtime dependencies, strictly offline, opt-in via audio toggle button (`♩`/`♫`).
- Tuned realm-specific frequency chords and acoustic timbres:
  - Cathedral: A minor shimmer (55.0/110.0/130.81 Hz + 220 Hz detuned by 1.5 Hz creating a slow hypnotic acoustic beat).
  - Basilica: Sub-bass F0/C1 stillness (43.65/65.41/87.31 Hz) with filtered white-noise cathedral drafts.
  - Obsidian Court: Tritone dissonance (low D1 at 36.71 Hz + G#1 augmented fourth at 51.91 Hz) with filtered saw grind.
  - City of Bells: Pentatonic bronze cluster (73.42/110.0/146.83/293.66 Hz).
  - Mourning Spire: Cataract sub-bass (58.27/69.30 Hz) with dynamic lowpass noise simulating cascading blue rivers.
  - The Unhappened: 110.0/110.6 Hz binaural beating pair (0.6 Hz delta-alpha wave resonance) with delicate 880 Hz glass overtone.
- Seamless cross-fading of ambient drone tracks during realm transitions.
- Tactile stone footstep synthesis (`SOUND.step`) synced with player movement cadence and sprint speed.
- Resonant dual-tone bronze witness chime upon opening memories, distinct harmonic verdict chords (unbound ascending major triad vs sealed deep fifth), and resonant ascending lowpass gate sweeps.
- First-person kinematic head-bob and subtle lateral sway synced with movement, automatically disabled when reduced motion is preferred.
- Titan organic micro-animations: systolic/diastolic double heartbeat for Seraphine's forbidden heart, rhythmic breathing pulse for Malach's mask, Thaum-IX's resonant waveform chest, and Azrath's electric quantum jitter.
- Empirically verified with `tests/smoke.py`: 60 FPS equivalent frame times (16.67 ms mean/p95), 6 live Three.js transitions, HUD overlay strictly < 20% (5.17%–19.57%), 18 memories, 3 endings, 0 errors, 0 network requests.

## 2026-10-28 / AAA Visual & Atmospheric Overhaul
- Comprehensive PBR material overhaul: defined surface-specific physical roughness and metalness across all 16 material types in `src/engine.js`. Polished dark obsidian stone (`r:0.16, m:0.45`), heavy forged steel (`r:0.38, m:0.76`), high-luster bronze/gold metallic trim (`m:0.84–0.90`), porcelain bone (`r:0.82`), and glistening low-roughness crystals (`r:0.18–0.22`).
- Dynamic per-realm lighting & atmospheric grading in Three.js (`GLWorld.render`): direction key light, rim light, ambient sky/ground light, and fog distances tuned dynamically per realm (Cathedral golden lantern key / cyan rim; Basilica cold monochrome key / icy diamond rim; Eclipse amber key / blood-red rim; Bells antique bronze key / teal rim; Mourning Spire misty key / cascading aquamarine rim; Unhappened quantum key / electric violet rim).
- Environmental living animation: animated flickering flame braziers along the Gothic nave aisle, active memory beacon acceleration and scale pulsation, and swirling 3D organic vortex motion for ambient ember motes.
- Added cinematic camera trauma impulse (`CAMERA.shake` & `CAMERA.kick`) on decisions and gate passage, smoothly damping in `renderGame`.
- Polished commercial glassmorphic HUD styling with dark frosted glass (`backdrop-filter: blur(16px)`), luminous hairline borders, glowing hover states, and refined typography.
- Mobile overlay occupancy tightened (1920x1080: 5.46%, 1440x900: 10.55%, 390x844: 16.18%, 360x800: 18.49% — well below the hard 20% limit).
- Rebuilt `index.html` (2,681,666 bytes) and verified with full smoke test suite: 60 FPS frame time (16.67 ms mean/p95), 6 live Three.js realm transitions with bounded resources, 0 page errors, 0 network requests.
