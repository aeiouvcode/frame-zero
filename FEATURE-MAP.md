# FEATURE MAP - FRAME ZERO (all code lives in the single index.html)

| Feature | Where | Verification |
|---|---|---|
| Title screen + footer stack | title block (DOM) | live-verified Sep 26 10:34 AM (md5 3b418ee1) |
| Settings (perf grid, ERASE SAVE crimson) | settings overlay | live-verified Sep 26 10:34 AM |
| Chapter select (locks, unlockedCh) | chapter list UI | screenshot-verified |
| Scene engine (panels, beats, camera) | S.add scenes ch1-5 | ch1 animated moves verified; ch2-5 cut-only by design |
| Dialogue system (say/narr, thought/shout styles) | beats + dlg renderer | verified in-scene; em-dash fix staged 5623c6c6 |
| Audio (beds fade-in, sfx, heartbeat, mute) | FZ.audio | verified Sep 26 12:27 AM milestone |
| Film grain overlay | grain canvas (source-over) | verified Sep 26 |
| Clue system + CLUE FOUND caption | clue defs + caption() | spot-verified |
| Three endings + ENDING x OF 3 SEEN | ending router + end screen | spot-verified |
| Save system (LocalStorage) | FZ.engine.Save | replay-verified |
| Reduced-motion mode | dwell floors + motion gates | fixed 0fee976b, verified |
| ?debug=1 | boot flags | present |
| 44px touch targets @390px | CSS base + media queries | verified Sep 26 4:35 AM |
| Instinct File build (PRIVATE) | file-01M326A1R2C7SMTDWWGT4R4V3B | gen 16 boot-verified |
| LOST PAGES bonus chapter | PLANNED (PLAN.md #1) | not built |

## LOST PAGES (bonus chapter 6) - added Sep 27
- BONUS chapter card in chapter select: gated on >=1 ending; shows "n/7 RECOVERED" (ui openChapters)
- lp_hub: fragment hub, choice list PAGE 01-07 with still-lost/RECOVERED states, counter "WHICH PAGE DO YOU RECOVER? n/7"
- lp_v1..lp_v7: seven fragment scenes (each ~5-7 beats, custom manuscript/red-line art on v6/v7)
- lp_coda: unlocks after all 7 fragments read, ends on end card
- State: Save.data.fragments {v1..v7: timestamp}; endings map drives BONUS unlock
- Save hardening: corrupt save quarantines to framezero.save.v1.corrupt (console.warn, fresh start); schema merge + clamps (unlockedCh 1..5, ch 1..6, endings/fragments keys); quota/SecurityError -> loud warn, in-memory play

- Hub polish (Sep 27 4:30 AM): recovered fragment rows show FRAG_TITLES in crimson (--red) via .choice-opt.recovered; 'PAGE 0i' label unadorned; prep/graph-audit.js guards the full scene graph.
- Fail-loud audio (Sep 27 4:31 PM): ctx.sfx/ctx.amb console.warn on unknown names (owner 18:36 no-silent-failure rule); prep/registry-audit.js guards clue + audio registries.
- Art-structure audit (Sep 28 4:31 AM): prep/art-audit.js 25/25 - all 14 FZ.bg generators asserted (composition floors, well-formed roots, sevenPanels layout geometry), palette discipline (35 hexes, near-achromatic-or-crimson, spread<=30), crimson discipline (cctv REC dot exactly-1 always, timestamp adds exactly-1, clock213 ring only with {red:true}).
