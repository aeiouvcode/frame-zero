# CURRENT TASK - FRAME ZERO

Updated: 2026-09-24 22:36 IST (cycle: camera-framing audit + 3 fixes, shipped)

## This cycle (shipped)
- New static audit: camera visibility model (390x844, base scale 0.39, visible window
  500/z x 1082/z page units) run over all 46 scenes, executing constructor beats with a
  recording ctx. Found 3 scenes where dialogue played outside the camera's visible
  window (invisible text - the reel's skipAll grading missed these because it grades
  end-states, and ch5_s6's choice overlay hid the gap):
  1. ch3_s8: margin-note zoom (660,420,z1.5) left the narr + both Mika lines below the
     visible window. Fix: pull-back cam (500,850,z1) before the narr.
  2. ch5_s6: thesis line "THE PAGE KNOWS WHAT YOU WILL DO" at y1470 invisible behind the
     predrawn-hand zoom (620,380,z1.35). Fix: same pull-back before the narr.
  3. ch1_s11: Mika's "someone is behind me" bubble half-cropped left during the
     silhouette zoom (635,680,z1.5). Fix: ease to (520,820,z1.25) before the say.
  All three confirmed broken visually first, then re-audited clean post-patch.
- ch2_s4 "zero-gap chain" residual from last cycle re-analyzed: FALSE POSITIVE - the
  narr gets ~3.1s of exposure via intermediate show/cam beats (analyzer only counted
  wait beats). No fix needed; residual closed.
- Accepted marginal (not fixed): ch1_s3 (5px clip, bubble readable), ch5_s4 (13px
  sliver, from the intentional mirror framing).
- Security 5-check: PASS.

## Candidate next actions (priority order)
1. Procedural audio mix pass (Web Audio levels, heartbeat/drone balance) - only
   remaining unaudited craft axis.
2. PWA manifest for add-to-homescreen (small JSON + meta, still self-contained).
3. Camera ease audit (inOut/out choices) - the positions are now clean, easings unjudged.

## Verified-good surfaces (do not rework)
- Title, all 35 scenes + endings + coda (static reel + camera visibility model +
  real-playback pacing), pause veil, settings, chapters, clues, clue toast, captions,
  short-viewport overlays.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP rehash after ANY inline script/style edit. node --check before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
