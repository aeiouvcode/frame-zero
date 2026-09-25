# CURRENT_TASK - FRAME ZERO

## Current task (cycle: Sep 26, 4:29 AM IST)
Touch-target audit + hygiene batch. DEPLOYED (commit pending this file's commit).

### What happened this cycle
- Touch-target audit (new measurable class): enumerated every interactive element's
  CSS size at 390px. .fz-btn 46px PASS, hotzones page-unit-sized PASS. TWO DEFECTS:
  (1) the max-width:480px media query shrank .fz-icon-btn to 40px - sound/clue/pause/
  settings buttons rendered BELOW the 44px floor on every phone. Raised to 44px.
  (2) settings .seg .fz-btn min-height 36px. Raised to 44px.
- Hygiene: wired the dead Perf.heavyFilters getter into manuscriptPage (low-tier
  devices now skip the feTurbulence displacement on the manuscript prop); deleted
  unused SVG filter defs fz-rough-hard and fz-grain (zero url() refs, ~440 bytes).
- PWA manifest: ASSESSED, deferred honestly. Data-URL manifests parse in current
  Chrome (crbug 349617666 fixed) but installability also wants 192/512 icons -
  PNG data-URLs bloat the bundle, SVG icon support partial, Safari ignores
  manifests entirely (apple-touch-icon needs a real hosted file, impossible under
  the single-file constraint). Marginal value for a one-sitting manga. Revisit
  only if the project ever allows hosted assets.

### What happened this cycle
- Static audio-mix audit (can't hear Web Audio; built a measurable model instead):
  bus gains (amb .55 / sfx .9 / master .8), per-SFX envelope peaks, worst-case
  simultaneous sums -> peak ~0.66 linear into the -18dBFS/8:1 compressor. No
  clipping risk. Mix balance PASS.
- Defect 1 (fixed): every ambient bed (rain, hum, rainHum, drone x3, windTunnel,
  voidSpace) started at FULL GAIN instantly - a step transient = audible click/thump
  at each bed start. Added fadeIn() helper (exp ramp, 700ms default); all beds now
  ramp from 0. SFX were already enveloped - untouched.
- Defect 2 (fixed): setMuted/setVolume scheduled linearRamps without
  cancelScheduledValues+setValueAtTime - rapid toggles stacked ramps onto stale
  start points. Now cancels and anchors at current value (same pattern stopAmb used).
- Defect 3 (fixed): musBus created but never referenced (no music exists). Dead code
  removed; header comment corrected to "amb / sfx -> master".
- QA hook: read-only getter FZ.audio._ambLevel (sum of amb bed gains) for live
  stopwatch-style verification of the fade-in.

## Perf audit (Sep 25 10:28 PM cycle): one fix shipped in this deploy.
Model: particle caps (low 30/high 90/cine 140, canvas 2D - cheap), SVG weight
(max 5 panels/scene, 103 total - trivial), feTurbulence only on manuscript prop
(rasterized once, unused defs fz-rough-hard/fz-grain cost nothing), backdrop-filter
only on small/transient elements (tier-low strips the rest). DEFECT FOUND + FIXED:
#fz-grain was a full-screen mix-blend-mode:multiply layer ABOVE the particle
canvas - every particle frame (all rain/dust scenes) forced a full-screen blend
recompute. Converted to source-over, opacity .16->.26 to compensate mottling.
Residual dead code noted: Perf.heavyFilters getter never referenced (left as-is).
Pixel-verify grain look post-deploy (before/after rain frame); revert = restore
mix-blend-mode + .16 if the mottling reads wrong.

## Camera ease audit (Sep 25 4:28 PM cycle): COMPLETE - PASS, no code change.
Model: simulated camera state across all 46 scenes; 11 animated moves exist
(all ch1), everything else is hard cuts (manga-native language - restraint wins).
Easings all out/inOut (no linear); duration-vs-distance speeds 0.2-2.6, median
0.86; outliers are intentional (opening plunge 2.6; slow push-ins 0.2-0.34).
Ch2-5 use zero animated moves - judged correct, adding motion would over-animate.

## Next actions (priority order)
1. Re-audit classes on rotation: timing, framing, reduced-motion, audio, perf,
   touch targets.
2. Design pass candidate: title screen / settings typography at 390px (user's
   primary axis - no measurable model yet, judgment-driven).
3. PWA manifest: deferred with reasons (see above).

## Standing rules
- User steer (Sep 21): design is the primary grading axis at 390px phone-first.
- Security 5-check + rigorous self-critique every cycle (user directives).
- Lean verification: one before/after pair per change; batch into one deploy.
- State files updated every cycle, committed with the deploy (user ruling Sep 23).
