# THE DEADLIGHT PANTHEON — A Walkable Atlas

A self-contained offline HTML adventure inspired by the six titan manifestations in the supplied 30-second video.

## Launch

Open `index.html` in a modern desktop or mobile browser with WebGL support. No server, network or installation is needed. The entire gallery, source frames, narrative and rendering code is embedded.

Use **WASD/arrow keys** to walk, **Shift** to sprint, **drag** to look around, **E/F** to examine memory beacons, **M** for the six-realm atlas, **C** for the current titan dossier and **V** to toggle first/third person. On a touchscreen, use the virtual joystick, RUN and WITNESS. There is a chapter selector and three clickable memory markers in each realm. All six chapters can be selected directly.

Each of the six worlds has three memory events (18 in total), short branching witness responses, local progress, a concluding scene and a JSON testimony export. Audio is opt-in and synthesized locally.

## Asset and runtime status — important

- **WebGL, not the official Three.js library.** The standalone viewer includes a custom, small WebGL scene graph and renderer because a distributable Three.js bundle could not be obtained in the execution environment. It does not claim to be a Three.js implementation.
- **Procedural interpretations, not exact original meshes.** 3D characters recreate visible traits from the film (X-eyed luminous mask, jagged crystal crown, skull/scream mask, black armored claws, ribcage, circular waveform heart, red eclipse horns, city-giant and electrical singularity). Precise scene meshes, rigs and geometry were not present in the video and cannot be recovered from it as-is. Embedded source-video frames let viewers compare the original compositions.
- **Real 3D GPU playback is not independently verified in this test environment.** Its headless Chromium disallows WebGL entirely. When a browser similarly blocks WebGL, the document displays an accessible fallback with original source frames, biographies and every story choice instead of a blank canvas.
- **Offline property:** no third-party runtime dependencies, fonts, remote assets, trackers or CDN calls. Embedded image data increases the HTML size to ~1.3 MB.

## Test evidence

- JavaScript parse check: PASS (`node --check`).
- Six procedural scene construction and animation passes with no NaN transforms: PASS.
- All 18 story events, choices, chapter selection, ending and testimony JSON export through browser fallback: PASS.
- Mobile controls/navigation and 390px layout: PASS; no horizontal overflow or unhandled JavaScript errors during the tested paths.
- Live WebGL rendering / accurate mobile frame rate: UNVERIFIED due test browser restrictions.
- Browser localStorage restore after restarting: UNVERIFIED; local storage writes are coded with graceful failure handling and testimony JSON can be exported.

## Source layout

- `src/story.js` — six bios, events, dialogue and save schema
- `src/engine.js` — custom offline WebGL renderer, procedural geometry and mask textures
- `src/world.js` — six domains, characters, props, three event monuments per domain
- `src/app.js` — movement, navigation, interface, choice progression and export
- `src/index.template.html` — embedded layout and styling
- `src/assets/` — six visual-source video stills
- `src/build.py` — reconstructs `index.html` entirely offline

To rebuild on a system with Python 3: `python3 src/build.py`. You may replace this engine with an official vendored Three.js release if strict library compatibility is required; doing so requires a separate migration and GPU QA pass.

Stinky Weasel Productions · Source media supplied by user · October 2026
