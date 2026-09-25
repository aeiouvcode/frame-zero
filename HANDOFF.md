# HANDOFF - FRAME ZERO

## Project
Five-chapter interactive animated manga. Single self-contained index.html:
vanilla HTML/CSS/JS + inline SVG + Canvas + Web Audio. No frameworks/CDN/external
assets. Grayscale + restrained crimson. Mobile-portrait-first 390px. LocalStorage
saves. ?debug=1.

## Cycle recipe (each 360-min wake)
1. Re-download live index.html from Pages (workspace may be wiped; live is durable source)
2. Check commits for foreign work - NEVER revert others; parent onto newest live
3. Pick highest-value iteration (design 390px first, craft, perf, honest gaps)
4. Self-critique hard; fix before reporting; honest PASS/PARTIAL/FAIL residuals
5. node --check extracted <script>; python3 rehash.py index.html
6. Security 5-check (secrets, outbound, deps, injection sinks, phoning home)
7. Update CURRENT_TASK.md + CHECKPOINT.md + HANDOFF.md
8. Deploy via bridge-tree.html (vault PAT), md5-verify, screenshot QA at 390px
   (cache-buster ?v=N; force document.getAnimations().forEach(a=>a.finish())
   before entrance-dependent captures - cloud browser throttles rAF to ~1Hz)
9. File republish (checkout -> port_to_file.py -> build -> preview boot-verify -> publish)
10. Report milestone to parent: both URLs, before/after evidence, honest residuals

## Failed approaches / gotchas (accumulated)
- Do NOT ship a stale recycled bridge commit message (8b04a219 did) - parameterize.
- Do NOT 'fix' the rAF-throttle blank-entrance artifact in app code - it's the browser.
- Do NOT trust static reel reviews for timing/framing/motion-mode defects: each audit
  CLASS found defects the previous missed (pacing -> framing -> reduced-motion -> audio).
  Prefer a new measurable audit model per cycle over re-running an old one.
- Reduced-motion: reading-floor dwell must apply in ALL modes (fixed 0fee976b).
- Engine.wait dwell floor: chars x k ms (46 normal / 66 reduced), cap 4.5s.
- Timing verification: stopwatch via tapResolve polling is cheaper than screenshot loops.
- Audio: beds must fade IN (exp ramp) not start at full gain - step transients click.
  Mute/volume ramps need cancelScheduledValues + setValueAtTime anchoring.
- Perf: full-screen mix-blend-mode layers above animating canvases force per-frame
  blend recomputes - source-over + opacity compensation is the fix (grain, Sep 25).
  Perf audit model: particle caps, panels/scene, filter usage, backdrop-filter,
  infinite animations, rAF loops. Perf.heavyFilters getter is dead code (known).
- Camera audit model: simulate state across scenes from camSnap/cam beats; 11 animated
  moves total, ALL in ch1 - ch2-5 are cut-only by design. Speed outliers (2.6 plunge,
  0.2 push) were intentional. Don't add moves to late chapters: restraint.
