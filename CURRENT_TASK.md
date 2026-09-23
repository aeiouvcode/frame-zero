# CURRENT TASK - FRAME ZERO

Updated: 2026-09-23 10:30 IST (cycle: chapter-label fit)

## Just shipped (this cycle)
- Chapter-label fit: top-bar chapter titles no longer truncate mid-word at 390px - setChapterLabel now shrinks type (min 9px) until the full title fits, with a resize refit hook. Before: "CH 2 — THE BOY BETW…" on every long-titled chapter. One commit with this state-file update.

## Candidate next actions (priority order)
1. Ending card clue chips: dense on small screens; possible layout tweak at <360px.
2. Tie the predrawn art-echo (circled option in the manuscript) more explicitly to the real LEAVE UNFINISHED option. Restraint call pending.
3. ch1_s1 cold open pacing is VERIFIED GOOD (cinematic title card -> slow fade into archive room; the Sep 23 "empty page" reading was the cloud rAF artifact - do not rework).

## Blockers
None. Browser budget resets at local midnight (fleet-shared; keep verification lean: one before/after frame pair per change).

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP meta requires rehash (scripts/rehash.py equivalent) after ANY inline script/style edit.
- node --check the extracted script before every deploy.
- Never ship unverified. Report milestones with both URLs + screenshots.
- Update CURRENT_TASK.md / CHECKPOINT.md / HANDOFF.md every cycle (user ruling Sep 23).
