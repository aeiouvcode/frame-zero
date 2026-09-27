# STATE - FRAME ZERO
Updated: Sep 27, 4:36 AM IST (staged; live repo still carries the pre-spine files)

## Live
- Pages: https://aeiouvcode.github.io/frame-zero/ @ commit 699d8b40, md5 3b418ee1a2faba8befde310ec3062d2b (unchanged - go-live gate, no owner yes yet)
- Instinct File (PRIVATE): file-01M326A1R2C7SMTDWWGT4R4V3B, GENERATION 18, boot-verified (hub polish + LOST PAGES) (design pass: title footer stack, settings perf-grid, ERASE SAVE crimson)
- Instinct File (PRIVATE): file-01M326A1R2C7SMTDWWGT4R4V3B, generation 16, boot-verified

## Staged (NOT pushed - go-live gate)
- index.html md5 1c24bebd1c6ee37e49b26478cdadd563 (INCLUDES the 9e38a2cd LOST PAGES work + hub polish): LOST PAGES bonus chapter (ch6: lp_hub + lp_v1..v7 + lp_coda, fragment state in Save.data.fragments, BONUS chapter card gated on any ending) + Save hardening (E1 fail-loud loadSave/storeSave w/ corrupt quarantine to framezero.save.v1.corrupt; E2 schema merge+clamps unlockedCh 1..5 / ch 1..6; E3 boot route clamp; byChapter 1..6 + chapterSceneCount guard) + earlier writing-audit em-dash fixes. node --check OK, 7/7 logic tests, boot-verified in File preview (revision filerevision-01M3FGZHBN5SQBR0FF3KJAJCCG)
- Doc spine created this run (STATE/MISTAKES/PLAN/FEATURE-MAP); legacy CURRENT_TASK/CHECKPOINT/HANDOFF superseded, kept for history

## Gated
- ALL public go-lives hold for the owner's explicit yes via parent (owner WhatsApp Sep 26 17:26: "before going live you will need my permission"). Supersedes Sep 21 autonomous-deploy authority. PRIVATE File publishes remain in scope.

## Next steps (ranked - see PLAN.md)
1. DONE: File gen 18 live (PRIVATE). Pages push still gated on owner yes (staged payload now md5 1c24bebd)
2. Push staged payload on owner go-live yes
3. Manga surface vocabulary pass (dialogue bubbles, chapter-end cards)

## Operating rules (owner, via parent; all verified on his WhatsApp)
1. BROWSER-MINIMAL (18:28): browser only when strictly necessary - CLI/local/API first. (Deploy rail needs browser for vault fill; critic captures are necessary use.)
2. 20-MIN RULE (final 18:29 + LOOP-STUCK addendum 18:31): 20 min on the same problem WITHOUT SOLVING (or catching yourself re-running the same failing approach = the stuck signal) -> stop, log attempts in MISTAKES.md, ESCALATE to the owner via parent (what tried, what's blocking, ask for his advice/plan), take the next PLAN.md move while awaiting his steer. Never silently abandon.
3. CODE QUALITY (18:36): no broad catch-alls - catch specific failure modes, else fail LOUD; silent failure = defect logged in MISTAKES.md. Verification must be non-vacuous (digest/string assertions: node --check + live md5 + live grep for the changed string). Review/critic passes read failure paths (console errors, blank captures) before approving - no vibe-LGTM.
4. LOGIC-FIRST (19:46, verbatim "improve the logic on our projects"): prefer moves deepening mechanics/state/correctness over looks; rank PLAN.md accordingly.
