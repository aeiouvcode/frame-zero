# CURRENT TASK - FRAME ZERO

Updated: 2026-09-24 04:33 IST (cycle: ch3_s9 whiteout bug fix, shipped)

## This cycle (shipped)
- Reel found REAL bug: ch3_s9 (Erased City finale) - page painted pure white from the
  "REALITY RESET" slam until chapter end. Root cause: beat used
  `{ t:'fx', name:'whiteout', ms:900 }`; the engine maps whiteout to a PERSISTENT
  overlay (FX.whiteout(on!==false)) and silently ignores ms. The white layer never
  cleared, hiding the morning/nail panels for every player.
- Fix: beat changed to `flash-white` (FX.flash auto-clears after ms). One-word patch,
  line 3761. node --check PASS, CSP rehashed.
- Verified fixed at 390px on live: morning + fingernail panels now visible under a
  900ms white flash. Infected+possessed chrome at ch3_s9 confirmed AUTHORED
  (corrupt v:0.8 -> infect(2)), not a bug.
- Security 5-check: PASS (0 fetch/XHR/WebSocket/sendBeacon, 0 external src/href,
  CSP rehashed, no secrets, no new sinks).

## Candidate next actions (priority order)
1. Remaining unreeled scenes in motion: ch2_s5+ (Ren crossing the gutter), ch5_s1-s2/s4-s5.
2. Sweep for sibling misuse: audit every fx beat name vs dispatcher semantics
   (whiteout=on/off persistent, flash-white/flash-red=timed) - one-off grep audit.
3. Deep-craft pass: panel entrance timing choreography, camera ease audit, audio mix.

## Verified-good surfaces (do not rework)
- Title, ch1_s1 open, ch2 CCTV, ch3 street/sisters/margin-note/reset, ch4 seven-Mikas,
  ch5 choice + infected UI + coda end card, pause veil, settings, chapters, clues,
  clue toast, captions, short-viewport overlays, chapter-label fit.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP rehash after ANY inline script/style edit. node --check before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
