# CURRENT TASK - FRAME ZERO

Updated: 2026-09-24 16:33 IST (cycle: readability pacing fix, shipped)

## This cycle (shipped)
- Real-time pacing audit (first ever - all prior reels used skipAll): instrumented the
  beat data in node. 31 of 121 dialogue lines across 24 scenes cleared faster than a
  reader can finish them (exposure = typewriter chars*20ms + authored wait vs reading
  floor chars*66ms). Worst: ch5_s3's 105-char confession with a 1.8s window (~3s short).
  Median shortfall ~1.3s.
- Fix (one central change, no per-scene edits): Engine.wait() now extends its dwell when
  dialogue is visible - max(authored wait, min(chars * K, 4500ms)), K = 46/30/40 for
  normal/slow/fast textSpeed. Short punchy lines and structural pauses (no dialogue) are
  untouched. Reduced-motion path unchanged.
- Verified with real-playback stopwatch (skipAll OFF): ch5_s3 10.3s -> ~15.6s
  (sim predicted 15.6), ch1_s10 (staccato scene) unchanged ~5.5s. Model validated
  against the old build first (10.34s measured vs 10.1s simulated).

## Candidate next actions (priority order)
1. Camera ease audit per scene (inOut/out choices, zoom levels at 390px crop).
2. Procedural audio mix pass (Web Audio levels, heartbeat/drone balance).
3. say->say chains with zero wait between them (1 known: ch2_s4) - residual from this
   cycle, low severity since the old bubble stays visible while the next types.
4. PWA manifest for add-to-homescreen (small JSON + meta, still self-contained).

## Verified-good surfaces (do not rework)
- Title, all 35 scenes + endings + coda (static 390px reel), readability pacing,
  pause veil, settings, chapters, clues, clue toast, captions, short-viewport overlays.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP rehash after ANY inline script/style edit. node --check before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
