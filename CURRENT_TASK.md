# CURRENT TASK - FRAME ZERO

Updated: 2026-09-23 22:52 IST (cycle: review + close-out, no app change)

## This cycle (no-ship, honest grading)
- Reeled ch3_s8 (Yuna's margin note rendered in-scene), ch5_coda -> end card: PASS at 390px.
- Boot probe: domComplete 1192ms through the cloud pipe - healthy, no perf work needed.
- DECIDED + CLOSED: predrawn art-echo tie-in is complete as shipped (circled option in manuscript + "already drawn" tag on the real option); more would over-explain. Not carrying it further.
- DECIDED + CLOSED: caption/toast collision is impossible - clueToast() renders through the single #fz-caption-line element by design. No fix needed.

## Candidate next actions (priority order)
1. Remaining unreeled scenes in motion: ch2_s5+ (Ren crossing the gutter), ch5_s1-s5 (infection escalation), ch3_s9.
2. If all continue to pass: deep-craft pass - panel entrance timing choreography, camera ease audit per scene, audio mix levels (procedural Web Audio balance).
3. Structural candidates (weigh carefully): split-bundle cold-load (violates single-file constraint - likely reject), PWA manifest for add-to-homescreen (small JSON + meta, still self-contained).

## Verified-good surfaces (do not rework)
- Title, ch1_s1 open, ch2 CCTV, ch3 street/sisters/margin-note, ch4 seven-Mikas, ch5 choice + infected UI + coda end card, pause veil, settings, chapters, clues, clue toast, captions, short-viewport overlays, chapter-label fit.

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP rehash after ANY inline script/style edit. node --check before deploy.
- Never ship unverified. Update state files every cycle (user ruling Sep 23).
