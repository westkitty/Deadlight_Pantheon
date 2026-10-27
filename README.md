# THE DEADLIGHT PANTHEON — A Walkable Three.js Atlas

A self-contained, offline, dark-fantasy interactive fiction experience with six explorable 3D realms and 18 sequential witness memories.

## Start

Open `index.html` in a browser with WebGL support. It embeds the official Three.js r186 runtime and does not require a server, network connection, fonts, trackers or CDN scripts. In browsers without WebGL, the six-character visual-story atlas remains playable, including all 18 decisions and all endings.

**Desktop:** WASD or arrow keys to walk; Shift to run; mouse drag to look; E/F to witness; M for atlas; C for dossiers; V to change camera; Escape to close an open panel. Read the directional waypoint and approach the three reliquaries in each domain. The portal advances to the next realm after all three testimonies are heard. All six domains are selectable in any order.

**Touch:** Virtual movement joystick, drag to look, WITNESS and RUN controls. A battery-saving graphics setting is the default on coarse-pointer devices; visual quality and motion can be changed in the field guide. The story can also be explored without WebGL using the static source-film gallery.

## Experience and story

- Six distinct environments, each with a source-inspired titan and unique architectural identity: resurrection festival, motionless basilica, eclipse court, city of bells, living-memory city and fractured future.
- 18 source-video witness frames, one per event, plus six original chapter plates from the same film.
- 18 choices stored with their consequences; an in-world monument changes to turquoise or amber according to its recorded memory. Recorded decisions can be recalled but not overwritten by replay.
- Three possible conclusions. The last gate **requires all 18 memories**, even if chapter six is completed first.
- In-world waypoint compass, optional first-person or third-person camera, opt-in synthesized drone, reduced-motion control, and local testimony JSON export.
- Resilient fallback when WebGL is missing or lost; a restoration attempt is made when the browser signals that GPU context has returned.

## Visual source boundaries

The film is an authored reference. The video does **not** contain source meshes, rigging or a multi-view 3D scan. Titan bodies are original procedural **interpretations** of the visible mask expressions, horns, crowns, claws, cores, armor and city-scale silhouettes. They are not exact extracted or approved 3D models. The added memory plates are frames extracted from the original film at the times recorded in `src/assets/echo_manifest.json`.

**Runtime:** official `three@0.186.1`, locally vendored and embedded into the standalone artifact. The world remains an evidence-grounded procedural interpretation; exact-likeness mesh reconstruction still requires source models or multi-view reference material that the film does not contain.

## Build (no package manager)

```bash
python3 src/build.py
```

`src/build.py` combines the pinned Three.js runtime, authored JavaScript, HTML/CSS, six reference stills and 18 event frames into `index.html`, without runtime network dependencies. The artifact is approximately 2.7 MB. Keep `src/vendor`, `src/assets/echo_manifest.json` and its extracted frames together to rebuild.

## Test

The optional browser-smoke suite requires Python Playwright and a Chromium-family browser. It loads the standalone HTML directly, without a server or network, and exercises all 18 scenes and story paths.

```bash
python3 tests/smoke.py
```

The current Chromium run exercised a live software-WebGL context. **Verified:** official Three.js r186 rendering; six finite and distinct constructed scene graphs; actual movement through the `file://` artifact; all 18 narrative paths and visual plates; chapter reordering and conclusion gate; in-world choice colors; all three ending variants; modal keyboard behavior; tablet/phone-width static gallery; no runtime network requests; and WebGL loss/fallback/restoration. **Unverified:** sustained performance and touch behavior on physical devices, hardware-GPU behavior, and long-session reliability. Do not upgrade those facts to proof.

See `QUALITY_REPORT.md` and `OPERATIONAL_STATE.md` for evidence and remaining debt.

## Repository and Pages

The Git history preserves the original commit `9dc9ea186499db22a2d65bda7a66e2928d22d03b`. `.github/workflows/pages.yml` rebuilds the standalone artifact, verifies that it is committed deterministically, checks every authored JavaScript module, and deploys only `index.html` to GitHub Pages. Remote creation and publication are separate from local verification; inspect `git remote -v`, the workflow run, and the resulting Pages URL for current publication truth.

Stinky Weasel Productions · October 2026
