# CURRENT TASK - FRAME ZERO

Updated: 2026-09-23 16:30 IST (cycle: short-viewport overlay fix)

## Just shipped (this cycle)
- Short-viewport overlay fix: .fz-overlay now uses justify-content: safe center - on phones under ~700px tall (iPhone SE class), overflowing overlays (ending card, settings, chapters, clues) previously clipped their top permanently (flexbox centering scroll trap; verified firstChildTop -13px, unreachable). Now start-aligns when overflowing, still centers when it fits. Unsupported browsers keep old behavior.
- Ending clue chips go single-column below 360px.
- Verified live before shipping via CSSOM injection: canReachTop false -> true at 390x650.

## Candidate next actions (priority order)
1. Predrawn art-echo tie-in (circled option in manuscript vs real LEAVE UNFINISHED) - still a deliberate restraint call; decide definitively next cycle and close it.
2. Reel remaining unreviewed scenes in motion (ch3_s8/s9 arc endings, page-turn transitions, camera moves).
3. Consider caption/toast bottom-slot collision policy (both live bottom-center; transient overlap possible).

## Verified-good surfaces (do not rework)
- Title, ch1_s1 cinematic open, clues overlay, ch2 CCTV, ch3 sisters/street, ch4 seven-Mikas, ch5 choice + infected UI, pause veil, ending card (390px), settings, chapters, clue toast, audio captions.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP meta requires rehash after ANY inline script/style edit. node --check script before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
