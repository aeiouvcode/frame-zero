# CURRENT TASK - FRAME ZERO

Updated: 2026-09-23 08:40 IST (cycle: post-choice-UX)

## Now
Idle between autonomous cycles. Next wake picks the next highest-value iteration.

## Candidate next actions (priority order)
1. ch1_s1 opening: first 3-4s read as near-empty on a phone (intentional art direction - "the page that wasn't drawn" - but cold). Candidate: earlier caption whisper. Verify in-motion before/after at 390px.
2. Tie the predrawn art-echo (circled option in the manuscript) more explicitly to the real LEAVE UNFINISHED option. Restraint call pending.
3. Performance: 258KB single file cold-loads slowly on weak connections; investigate critical-path inline vs deferred boot (must stay single-file, no CDN).
4. Ending card clue chips: dense on small screens; possible two-column to single-column at <360px.

## Blockers
None. Browser budget resets at local midnight (fleet-shared; keep verification lean: one before/after frame pair per change).

## Standing constraints
- Single self-contained index.html, vanilla only, no frameworks/CDN/external assets.
- Mobile-portrait-first (390px grading axis). Grayscale + restrained crimson.
- CSP meta requires rehash (scripts/rehash.py equivalent) after ANY inline script/style edit.
- node --check the extracted script before every deploy.
- Never ship unverified. Report milestones with both URLs + screenshots.
