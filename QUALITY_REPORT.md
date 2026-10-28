# Deadlight Pantheon — Three.js Release Quality Record

2026-10-27 · Scope: offline Three.js experience · Browser test host: Chrome headless with software WebGL

## Change groups

1. **Original-film memory witnesses:** 18 individually sourced frames (times in manifest); source-specific dialogue presentation; persistent 0/1 witness colors on 3D reliquaries; replays show the recorded response; all-three-endings logic and strict 18-memory final gate.
2. **Spatial authorship:** six realm-specific architectural extensions generated as local geometry, preserving source-defined titan silhouettes and the three original causeway interactions per realm.
3. **Traversal and resilience:** directional memory waypoint, modal focus containment, locked out-of-order scene access, hardware-conscious touch graphic default, persistent reduced-motion preference where storage is available, self-contained WebGL context-loss fallback and context-restored reinitialization path.

## Verified evidence

| Requirement | State | Evidence |
|---|---|---|
| Offline standalone file | PASS | 2,669,131-byte embedded HTML; browser smoke captured zero network requests |
| Six scene graphs | PASS (structural) | 1,118–1,610 nodes each, finite transforms, three altars and titan each; all six have different node counts |
| Distinct memory plates | PASS | 18 JPEG files and manifest; rendered in scene dialogs; scene images differ from chapter stills |
| Narrative path and gating | PASS | All 18 choices; blocked future memory; chapter six premature gate returns to atlas |
| Choice consequences | PASS (structural) | Saved decision changes witness orb to #80f7d5 or #f6ac8d and exposes its remembrance marker |
| All endings | PASS | Balanced, Unbound, and Sealed endings reached under three input combinations |
| Mobile static fallback | PASS | 390 × 844 browser viewport, atlas and gallery usable, no sideways body overflow |
| Keyboard modal handling | PASS | Panel focus and Escape; story remains accessible after choice |
| Local source rebuild | PASS | `python3 src/build.py` deterministic, no runtime dependencies |
| Genuine Three.js requirement (revision 2 baseline) | NOT MET THEN | The packaged baseline used a custom WebGL renderer; revision 3 evidence below supersedes this row |
| Exact original 3D models | NOT MET | Procedural approximations; source meshes not recoverable from original 2D video |
| Live GPU rendering | UNVERIFIED | Headless Chromium test host prohibits WebGL contexts; 3D visuals unobserved |
| Native device performance | UNVERIFIED | No on-device frame timing, thermals, GPU memory or sustained play test |
| Real WebGL context restoration | UNVERIFIED | Synthetic loss and failed-restoration fallback tested; successful hardware restore not observed |
| Browser-restart progress persistence | UNVERIFIED | Test environment's about:blank origin denies localStorage |

## Revision 3 evidence

| Requirement | State | Evidence |
|---|---|---|
| Genuine Three.js | PASS | Vendored official `three@0.186.1`; runtime identifies `Three.js r186` |
| Standalone `file://` | PASS | Supplied movement harness loaded the actual file URL, advanced player state twice and emitted no error artifact |
| Live 3D canvas | PASS (software WebGL) | 606 calls, 33,664 triangles, 8 geometries, 11 textures; non-empty 1320×820 canvas |
| Live realm transitions | PASS (software WebGL) | Six chapters rendered; geometry count held at 8 and textures remained between 2 and 11 |
| Frame timing | PASS (host measurement) | 89 samples: 16.67 ms mean, 16.70 ms p95, 16.80 ms max; not physical-device proof |
| Overlay union under 20% | PASS | Walking/prompt states measured at 4.73–18.62% across the four required resolutions |
| All witness and ending routes | PASS | Browser suite covered strict ordering, 18 decisions, balanced/unbound/sealed endings and immutable recall |
| Context recovery | PASS (test host) | Synthetic loss entered fallback and restoration recreated Three.js r186 |
| Runtime network isolation | PASS | Browser suite recorded zero requests from embedded artifact |
| GitHub Pages publication | PASS | Workflow run `40480556718` succeeded for release commit `67059dc`; HTTP 200 artifact matched committed SHA-256 `580a1410b381088897c21111a4ed1549d7176167f105718ac0d90d01c3fd0e3c` |
| Public browser render | PASS (observed scope) | Public title screen and Vespera/Malach Vex Three.js realm rendered; Enter Vespera interaction succeeded |
| Physical hardware acceptance | UNVERIFIED | No desktop hardware-GPU profiling or physical touch/thermal run |

## Revision 4 evidence (Reference Fidelity & Exploration Polish)

| Requirement | State | Evidence |
|---|---|---|
| Default First-Person View | PASS | `APP.view='first'` defaults to unobstructed first-person camera; player avatar mesh hidden; toggleable via V key or HUD button |
| Overlay Union under 20% | PASS | 1920x1080: 5.17% (walk), 6.37% (prompt); 1440x900: 10.19% (walk/prompt); 390x844: 17.12% (walk/prompt); 360x800: 19.57% (walk/prompt) |
| HUD Compass Formatting | PASS | Replaced broad `.compass span` rule with `.compass>span:first-child`, eliminating 7px box constraint and text rotation glitch |
| Realm Crumb Metadata | PASS | Dynamic domain & chapter title strings populated across all 6 realms |
| Frame Timing | PASS (host measurement) | 89 samples: 16.67 ms mean, 16.70 ms p50, 16.70 ms p95, 16.80 ms max (steady 60 FPS equivalent) |
| Resource Bounds Across 6 Realms | PASS | Calls 637–869, triangles 32,944–53,944, geometries 8, textures 2–9; disposed on transition |
| All 18 Testimonies & 3 Endings | PASS | Verified in headless Chrome: balanced, unbound, and sealed paths reached with persistent geometry tinting |

## Revision 5 evidence (Procedural Soundscape & Kinematic Atmosphere Uplift)

| Requirement | State | Evidence |
|---|---|---|
| Procedural Audio Soundscape | PASS | Zero-dependency, offline Web Audio engine (`SOUND`) with 6 distinct realm drone chords, crossfading, footstep locomotion audio, bronze witness chimes, harmonic verdict chords, and gate sweeps |
| Kinematic First-Person Head-Bob | PASS | Grounded vertical and lateral camera sway synced with walking/sprint velocity; disabled when reduced motion is preferred |
| Titan Organic Micro-Animations | PASS | Double systolic/diastolic heartbeat for Seraphine's forbidden heart, scale breathing for Malach's mask, Thaum-IX chest waveform resonance, and Azrath electric quantum jitter |
| Frame Timing & 60 FPS Stability | PASS (host measurement) | 89 samples: 16.67 ms mean, 16.70 ms p50, 16.70 ms p95, 16.80 ms max (steady 60 FPS equivalent) |
| Overlay Union under 20% | PASS | 1920x1080: 5.17% (walk), 6.37% (prompt); 1440x900: 10.19% (walk/prompt); 390x844: 17.12% (walk/prompt); 360x800: 19.57% (walk/prompt) |
| Resource Bounds Across 6 Realms | PASS | Calls 638–870, triangles 32,952–53,944, geometries 8, textures 2–9; strictly bounded |
| All 18 Testimonies & 3 Endings | PASS | Verified in headless Chrome: balanced, unbound, and sealed paths reached with persistent geometry tinting |

## Revision 6 evidence (AAA Visual & Atmospheric Overhaul)

| Requirement | State | Evidence |
|---|---|---|
| PBR Material Physical Properties | PASS | Assigned surface-specific physical roughness and metalness across all 16 material types in `src/engine.js`; obsidian `r:0.16, m:0.45`, forged steel `r:0.38, m:0.76`, gold/bronze `m:0.84–0.90`, bone `r:0.82`, crystals `r:0.18–0.22` |
| Dynamic Per-Realm Lighting & Fog | PASS | Three.js directional key light, rim light, ambient sky/ground light, and fog distances tuned dynamically per realm in `GLWorld.render` (Cathedral, Basilica, Eclipse, Bells, City, Void) |
| Living Environmental Animation | PASS | Animated flickering flame braziers along the Gothic nave aisle, active memory beacon acceleration and scale pulsation, and swirling 3D organic vortex motion for ambient ember motes |
| Cinematic Camera Trauma Shake | PASS | Added `CAMERA.shake` & `CAMERA.kick` on verdicts and gate passage, smoothly damping in `renderGame` |
| Glassmorphic HUD & Responsive Limits | PASS | Dark frosted glass (`backdrop-filter: blur(16px)`), luminous hairline borders, glowing hover states; overlay strictly < 20% across all viewports (1920x1080: 5.46% walk / 6.60% prompt; 1440x900: 10.55% walk / 10.55% prompt; 390x844: 16.18% walk / 16.18% prompt; 360x800: 18.49% walk / 18.49% prompt) |
| Frame Timing & 60 FPS Stability | PASS (host measurement) | 89 samples: 16.67 ms mean, 16.70 ms p50, 16.70 ms p95, 16.80 ms max (steady 60 FPS equivalent) |
| Resource Bounds Across 6 Realms | PASS | Calls 637–869, triangles 32,924–53,944, geometries 8, textures 2–9; strictly bounded |
| All 18 Testimonies & 3 Endings | PASS | Verified in headless Chrome: balanced, unbound, and sealed paths reached with persistent geometry tinting |

## Quality debt

- **QD-01 / Repaid:** Official Three.js r186 is integrated and exercised under software WebGL.
- **QD-02 / High:** Titan meshes are procedural visual references, not exact model reconstructions. Repayment trigger: approve reference models, model sheets or multiple orthographic views, then sculpt/rig/verify likeness.
- **QD-03 / High:** Physical hardware-GPU, touch and frame-rate proof remains missing. Repayment trigger: perform the full route on representative devices, collect frame-time and observe each source mask.
- **PD-01 / Medium:** Scene graphs have ~1,100–1,600 nodes; high draw-call potential. Avoid claims of real-world performance. Repayment trigger: GPU profiling and instancing/batching if draw calls or long sessions breach chosen targets.
- **QD-04 / Low:** Browser-restart persistence not evidenced; verify on an actual file URL or stable local origin.

## Web authorship review

Static authoring audit: **PASS_WITH_REVIEW**. The single canon line “I fixed that” was narrowly allowlisted as in-universe dialogue. `Codex` is the name of the in-world character archive, not a model credit. Additional “Gpt/Ai” substring hits occur inside embedded JPEG base64 content and are not user-facing text. Atmospheric gradients are intentional for dark-fantasy legibility. No unresolved production-commentary blockers remain.

## Scope and delivery

Three.js is pinned and embedded; there are no runtime external resources. The original commit and film-derived source assets are preserved. **Quality verdict:** VERIFIED for the tested offline software-WebGL, narrative and GitHub Pages publication scope; PARTIAL for physical hardware, exact 3D likeness and human acceptance.
