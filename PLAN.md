# PLAN - FRAME ZERO (ranked; synced with fleet-doc v3 section)

1. LOST PAGES bonus chapter (STEP-CHANGE, owner directive Sep 26 5:25 PM)
   gap: content depth (-0.5) + design distinctiveness
   move: seven-victim archive fragments, non-linear found-page structure, unlocks after any ending, BONUS in chapter select, reuses art/audio engine, 4-6 scenes
   pass-test: critic score >=8 at 390px (max 3 rounds), unlock flow verified, node --check + live md5
   FOLDED IN (engine-logic audit Sep 26 10:30 PM): Save hardening A1-A5 (corrupt-save quarantine, quota-error visibility, schema merge+clamp, dead `finished` flag removal, bus-write path unification) - same module, same commit. Edge-case tests 1-5 from prep/lost-pages-design.md must pass with asserted values.
2. Manga surface vocabulary
   gap: -1 design (dialogue bubbles/chapter-end screens generic - owner's Sep 21 complaint)
   move: real bubble tails + shout variants, designed chapter-end cards, screentone discipline
   pass-test: critic >=8 on 390px before/after pairs
3. Clue codex (case files)
   gap: -0.5 retention extras
   move: per-victim case-file screen reviewing found clues
   pass-test: all states render at 390px (empty/partial/full), critic >=8
4. Shareable ending card
   gap: -0.5 distribution
   move: canvas-rendered "case closed" card with ending + stats, exportable
   pass-test: export renders at 390px, no external assets
5. Staged writing-audit fixes (DONE, pending go-live gate)
   gap: dialogue dash inconsistency (2 occurrences ch5)
   move: em-dash normalization - staged md5 5623c6c6
   pass-test: live grep 'Ren\u2014it says' after push

## Working rules (owner Sep 26): browser-minimal (CLI/API/local first); 20-min LOOP-STUCK rule -> log MISTAKES.md, escalate via parent, take next move; logic-first ranking (19:46): LOST PAGES (#1) must carry real mechanics, not just scenes - fragment-collection state machine (order, persistence, replay), unlock-logic edge cases, save coherence. An engine-logic audit (save/load, ending flags, clue state, rapid-tap/interrupted beats, corrupted LocalStorage) outranks surface passes.

## Done Sep 27 (midnight cycle)
- LOST PAGES bonus chapter + Save hardening: shipped to File gen 17 (PRIVATE). Pages push staged (prep/deploy-payload.md), awaiting owner go-live.
## Done Sep 27 (4:30 AM cycle)
- Scene-graph integrity audit (prep/graph-audit.js): 9/9 - all next/goto targets resolve, no orphans/cycles, designed terminals only, counts pinned {1:11,2:10,3:9,4:6,5:10,6:9}.
- Hub recovered-state polish: fragment titles in crimson on recovered rows (class flag + CSS), label noise dropped. Shipped File gen 18.
## Next (ranked, logic-first)
1. Push staged payload (md5 1c24bebd, includes LOST PAGES + hub polish + spine) on owner yes; verify live md5.
2. v3/v7 art-composition pixel review at real frame rate (captures env-throttled; DOM-verified only).
3. Manga surface vocabulary pass (dialogue bubbles, chapter-end cards).
