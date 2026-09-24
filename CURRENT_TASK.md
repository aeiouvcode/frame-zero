# CURRENT TASK - FRAME ZERO

Updated: 2026-09-24 10:33 IST (cycle: full-reel completion + two beat-level fixes, shipped)

## This cycle (shipped)
- Reeled the remaining unverified scenes at 390px: ch2_s5-s10, ch5_s1/s2/s4/s5. All PASS
  except two beat-level defects, both fixed and shipped in one commit:
  1. ch2_s10: "END OF CHAPTER 02" narr bar landed on top of Ren's whisper bubble in the
     final tap state (no clearDlg between say and blackout). Added clearDlg before blackout.
  2. ch5_s4: the mirror-panel exchange ("That's my face" / "I was you") played while the
     camera stayed locked on the face zoom (last cam beat never re-targeted), cramming both
     bubbles at the viewport bottom over TAP TO CONTINUE. Added a cam beat to the mirror
     panel center (500,1250,z1.2) before the exchange.
- fx-beat semantics audit (sibling-misuse sweep from last cycle): PASS - all 14 fx beats
  match dispatcher semantics (whiteout=persistent on/off, flash-*=timed, blackout on/off pairs).
- Security 5-check: PASS (0 fetch/XHR/WebSocket/sendBeacon, 0 external src/href, CSP
  rehashed, no secrets, no injection sinks).
- Confirmed authored (not bugs): infect(1) chrome from ch2_s10 corrupt 0.55 onward;
  empty contacts slot in ch2_s7; occluded caption in ch5_s2 (figure-in-front layering).

## Reel status
- ALL 35 scenes + 3 endings + coda now reeled at 390px at least once. PASS everywhere
  post-fix. The full story is verified end-to-end.

## Candidate next actions (priority order)
1. Deep-craft pass: panel entrance timing choreography, camera ease audit per scene,
   procedural audio mix levels (Web Audio balance).
2. Structural candidates (weigh carefully): PWA manifest for add-to-homescreen
   (small JSON + meta, still self-contained). Split-bundle cold-load: likely reject
   (violates single-file constraint).
3. Playthrough-timing audit: real-time (non-skipAll) pacing of waits per scene.

## Verified-good surfaces (do not rework)
- Title, all ch1-ch5 scenes, endings, coda, pause veil, settings, chapters, clues,
  clue toast, captions, short-viewport overlays, chapter-label fit.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP rehash after ANY inline script/style edit. node --check before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
