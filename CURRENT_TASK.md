# CURRENT TASK - FRAME ZERO

Updated: 2026-09-25 04:31 IST (cycle: reduced-motion readability fix, shipped)

## This cycle (shipped)
- Accessibility defect: in reduced-motion mode, Engine.wait clamped every wait to 120ms
  and the reading-floor dwell (shipped last-but-one cycle) explicitly skipped reduced
  mode. Result: ch5_s3 - three confessional lines, ~290 chars total - played in 404ms.
  Motion reduction is about animation, not reading speed; the mode made every line
  unreadable.
- Fix: the dwell floor now applies in ALL motion modes. In reduced mode the typewriter
  is instant (no type time consumed), so the full reading time comes from the wait:
  k = 66ms/char (vs 46 normal), cap 4500ms. Structural waits with no dialogue stay
  clamped at 120ms; camera/particle/shake reductions untouched.
- Verified by stopwatch on live: ch5_s3 reduced mode 404ms -> ~14s (three lines at the
  4.5s cap). Normal mode unchanged.

## Candidate next actions (priority order)
1. Procedural audio mix pass (Web Audio levels) - only unaudited craft axis left.
2. PWA manifest for add-to-homescreen (small JSON + meta, still self-contained; needs
   CSP manifest-src adjustment).
3. Camera ease audit (inOut/out choices).

## Verified-good surfaces (do not rework)
- Title, all 35 scenes + endings + coda (static reel + camera visibility model +
  real-playback pacing in normal AND reduced motion), pause veil, settings, chapters,
  clues, clue toast, captions, short-viewport overlays.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP rehash after ANY inline script/style edit. node --check before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
