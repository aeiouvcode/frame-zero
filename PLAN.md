# PLAN - FRAME ZERO (ranked; synced with fleet-doc v3 section)

1. Pages push of staged gen-20 payload (index.html 254d51ea + five harnesses + spine)
   gap: live Pages is gen 18, File is gen 20
   move: WAITING on owner go-live yes (gate; parent holds the staged payload). On yes: bridge-tree multi-file commit, md5 verify, report.
   pass-test: live md5 == 254d51ea, boot at 390px clean

2. Interaction-gate audit (next audit class, logic-first)
   gap: scenes that REQUIRE an interaction before advance are unasserted; a stuck gate soft-locks progression
   move: enumerate panels/scenes setting required-interaction flags (tapped cells, hotzones, fragment picks); assert each gate's interactive element exists in that panel and its handler flips the flag. Non-vacuous: asserted gate set, not a scan.
   pass-test: node harness exit 0 with asserted gate list; any unwired gate = FAIL + fix

3. Perf audit REMAINDER: per-scene pinned element counts (currently budget ceilings only). Also: choice-path coverage - run each choice scene once per option, assert every route completes.
   pass-test: pinned counts fail loudly on any scene growth

4. Manga surface vocabulary pass (design move, deferred)
   gap: dialogue bubbles, chapter-end cards would deepen the manga read
   move: design at 390px, critic screenshots, ship only at >=8
   pass-test: critic score >=8 at 390px

Done: LOST PAGES ch6 (gen 18 live), save hardening (gen 18), coda re-read + fail-loud audio (gen 19/20), audit harnesses save/graph/beat/registry (7+9+7+7), art-audit 25/25, playthrough 68, choice-path 73, perf-pins 59, hotzone 112, save-migration 373, audio-graph 35 (Sep 30 10:38 PM cycle: 345 nodes, 447 param events, zero leaks). gen 22-24 live on Pages (c767f141, owner batch go-live).
