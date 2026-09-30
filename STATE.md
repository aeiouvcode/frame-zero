# STATE - FRAME ZERO
Updated: Sep 30, 10:29 PM IST (GO-LIVE: gen 22-24 batch to public Pages under owner batch grant)

## Live
- Pages: https://aeiouvcode.github.io/frame-zero/ @ commit ee8a4c2e, md5 11069ba09c9ed2b022988ac1227fdea7 (gen 21 bytes) - LIVE VERIFIED Sep 28 ~5:30 PM. ee8a4c2e RESOLVED (parent, Sep 29 4:39 AM): bridge (Open Muse agent) landing its queued authorized go-live - treat gen-21 as an APPROVED push. Owner grounding (parent, Sep 29 5:54 AM): his WhatsApp grants Sep 28 - 'go live on all' (5:56 AM), 'go live where left' (2:37 PM), 'go live on all ready and tested' (2:40 PM), 'go live on waiting' (4:52 PM); bridge landed the push 5:19 PM same day. INDEPENDENTLY VERIFIED (Sep 29 5:54 AM) against the observation database phone_messages (author=user, phone channel): all four quotes verbatim at 5:56:46 AM / 2:37:21 PM / 2:40:34 PM / 4:52:40 PM, plus 5:52:08 AM '1 go live, 2 go live...' and 5:55:47 AM 'go live'. Gen-22+ payload stays staged until owner's return (~Oct 5); next public push needs a fresh owner yes.
- Instinct File (PRIVATE): file-01M326A1R2C7SMTDWWGT4R4V3B, GENERATION 24, index.html md5 a2bc5d7dcb1a7089d6a4235386d97efb, boot-verified; save-migration audit 373 checks green.
- Archive File (PRIVATE): file-01M3GKZV7ZBPN2X34B5C33P4P1 - durable harnesses + deploy machinery. Proven under the Sep 27 15:42 sandbox wipe.

## Staged (NOT pushed - go-live gate)
- gen-22 index.html (6d0c6299): say-bubble tail alignment + phone bubble font 26px + 6 beat width fixes + cap-aware placement. gen-21 content already live via ee8a4c2e. Harnesses (save, graph, beat, registry, art, playthrough) + spine refresh.

## This cycle (Sep 27 10:31 PM wake)
- Concern carried in: lp_v3 "sparse composition". DISPROVEN: v3 composes B.cctv(896,620,{figure:true,time:'02:13:07',timeRed:true}); blank captures were the known 1Hz rAF capture-env artifact. See MISTAKES.md.
- NEW audit class: prep/art-audit.js - evals real FZ.util/art/bg IIFEs in node, asserts signature elements of generated SVGs (cctv red timestamp, >=15 element composition, manuscript title+paper, v6 crimson hairline, v7 two red eyes + silhouette, well-formed roots). 9/9 PASS.
- Full harness suite: save 7/7, graph 9/9, beat 7/7, registry 7/7, art 9/9.
- Security 5-check: PASS. S1 zero external refs (only w3.org namespaces); S2 CSP sha256 matches current script+style bytes; S3 no eval/new Function; S4 all 3 svg innerHTML sites route through sanitizeSvg; S5 localStorage fully try/catch guarded + corrupt quarantine.
- Outcome: NO-SHIP. No defect found, no app change made, no File gen 21. Critic gate not engaged (nothing changed to grade). Honest cycle result: audit evidence only.

## Cycle Sep 28 4:31 AM
- Closed last cycle's -2 residual: art-audit now covers ALL 14 FZ.bg generators (8 scene full-SVG checks with composition floors, 3 fragment checks, sevenPanels layout-object geometry, palette discipline over 35 distinct hexes, crimson-discipline counts). 25/25 PASS.
- Calibration findings (all test premises, NOT app defects): cctv REC dot is always-on crimson by design (asserted as exactly-1 occurrence); clock213 red opt is {red:true}, callers correctly map clockRed via archiveRoom; palette family max channel spread is 28 (#b3ab97 apartment floor band) so the discipline threshold is 30.
- Input-flow audit evaluated and DEFERRED: advance is a single global control (#fz-next -> Engine.advance()); a per-panel audit would be near-vacuous. The real gap is interaction-GATED scenes (required taps before advance) - queued with a proper definition.

## Cycle Sep 28 10:32 AM
- PAGES GO-LIVE executed this morning: owner batch grant (his WhatsApp 05:56:46 "go live on all") -> bridge pushed commit 49c95ee1, live md5 254d51ea verified 6:05 AM. Pages and app File in parity at gen 20. Next public push needs a fresh yes.
- NEW audit class: prep/playthrough-audit.js - HEADLESS PLAYTHROUGH. Evals real util/art/bg + all five chapter IIFEs with a recording ctx, executes every scene's enter + all beats: 55/55 scenes run clean. Assertions: unknown-beat-type rejection, dangling panel-ref detection, hotzone geometry in-bounds (1000x1500 page) + aria + holdMs sanity + handler presence, choice option validity (unique ids, labels, >=2 options), string-next resolution, perf ceilings (heaviest scene 41.5KB art / 120KB budget; max 8 panels / 30 budget; total 2.5MB), non-vacuity coverage guards (118 panels, 109 refs, 26 hotzones, 52 string nexts, 2 choice surfaces). 66/66 PASS.
- Findings: ZERO app defects. Interaction-gate question answered definitively: no scene hard-gates progression on a specific hotzone; the only mid-story gates are choice surfaces (both validated).
- Calibration notes (harness gaps caught, not app bugs): FZ.engine.Perf.heavyFilters read by bg generators at call time; FZ.audio.stopHeartbeat; beats calling document.createElement for overlays; panel refs passed as objects; my initial coverage thresholds were data-free guesses (300/250) - corrected to observed reality (118/109) with margin.
- Full suite: save 7/7, graph 9/9, beat 7/7, registry 7/7, art 25/25, playthrough 66/66 (121 checks total). Security 5-check PASS (unchanged app code).
- Outcome: NO-SHIP (third consecutive audit-only cycle). App keeps passing deeper audits; harness net now includes full headless execution.

## Cycle Sep 30 10:27 PM - GO-LIVE gen 22-24 batch to public Pages
- Grant: owner's WhatsApp 'go public where it's behind' (10:26:52 PM IST), relayed by parent with runtime delegation context; verified verbatim against the observation database (author=user, phone channel). Public (gen 21) strictly behind verified local (gen 24) -> deploy authorized by the batch grant's own terms.
- Foreign-commit check: repo log reviewed (ee8a4c2e tip = my gen-21 bytes via approved bridge); no foreign commits to preserve beyond it; tree commit built on top.
- Payload: index.html (gen 24) + 7 spine docs + prep/ harnesses (10 suites).
- Live verify + report: see milestone message. Next public push needs a fresh owner yes.

## Cycle Sep 30 4:35 PM - NO-SHIP (title screen + chapter-select design pass)
- Title screen at 390px: strong hierarchy (serif FRAME / crimson ZERO / panel art), 55px touch targets, bottom note clears 820px viewport. PASS.
- Chapter-select overlay: fresh state (1 open + 4 sealed + bonus sealed) fits 390x820 AND 375x667. Unlocked state (5 full cards + bonus) overflows 375x667 BUT the overlay already scrolls: .fz-overlay has overflow-y:auto + justify-content:safe center (top stays reachable); verified bonus card fully visible after scroll. PASS.
- MISREAD CAUGHT (calibration): I first measured the INNER list's overflowY:visible + lastBottom 795 > 643 and nearly declared a gen-23-class defect. The overlay is the scroll container, not the list. Verified scrollability before touching CSS - no change made. Logged to guidance: measure the scroll container, not the inner list.
- Findings: ZERO app defects. Both remaining chrome surfaces hold at both viewports in both save states.
- Full suite: 10 harnesses, 740 checks, all green. Security 5-check PASS (app untouched since gen 24).
- Critic: n/a (no changed surface). Outcome: NO-SHIP. Every user-facing surface has now been design-graded at 390px at least once.

## Cycle Sep 30 10:34 AM - SHIPPED File gen 24 (save-migration hardening)
- NEW audit class: prep/save-migration-audit.js - 28 hostile save shapes (corrupt JSON, arrays, legacy no-v, ch/sceneIdx out of range, tampered settings incl. volume:'loud', enum garbage) through the REAL Save.load + Settings.init + story.sceneAt resume path. First run RED: 16 failures, all one class - Settings.init passed saved values through unchecked.
- REAL DEFECT (latent crash): tampered settings.volume (string/huge/negative/null) survived load -> Settings.init -> apply -> FZ.audio.setVolume -> U.clamp(NaN)=NaN -> first unmute linearRampToValueAtTime(NaN) throws TypeError in a UI handler. Same class as lesson A3, one layer down.
- Fix: Settings.init now validates per def schema - boolean type check, finite-number check + [0,1] clamp, enum whitelists (textSpeed/perf/motion). 373/373 green; save-tests regression 7/7; full suite green.
- Verified: load/resume paths were already robust (all 357 load/resume checks passed pre-fix); unlockedCh clamp at 5 confirmed consistent with max legit write (ch6 gates on endings, not unlockedCh).
- ENV FINDING: the File preview iframe is sandboxed WITHOUT allow-same-origin - localStorage throws for app and scripts alike, so save-tamper boot tests are impossible in preview (app boots fresh via the S5 guard path; verified FZ-OK + scene navigation in gen-24 preview). Live tamper test only possible on the public Pages origin after the next approved push. Logged to guidance.
- Critic score: 8.5/10 (measured work: 28 shapes, red 16 -> green 0, no behavior change for valid saves; residual: live tamper verification deferred to the Pages push).

## Cycle Sep 30 4:34 AM - SHIPPED File gen 23 (choice overlay long-list fix, design pass)
- Design pass on LOST PAGES hub choice surface at 390px found THREE real defects, all in the long-list case (7-8 options; the finale's 3-option case was fine):
  1. Prompt clipped OFF-SCREEN (y:-19): #fz-choice bottom-anchors its column; with 7 options the column overflowed the top. Fix: list gets min-height:0 + overflow-y:auto, options flex-shrink:0; prompt always inside the padding box.
  2. No scroll: overflowY was visible, so on short viewports (375x667) options 6-7 were unreachable. Same fix covers it (verified scrollable at 375x667).
  3. Reading chrome ghosted through translucent option cards (ui-bg .88 alpha). Fix: body.choice-open fades .ui-top/.ui-right/.ui-bottom via the existing chrome-gone pattern (400ms) - pure CSS, uses the class showChoice already sets.
- Round 2 (critic catch on the 375px capture): prompt wrapped to 2 lines and its second line sat in the gradient's transparent zone, washed out. Fix: gradient darkened at top (0 -> .62), prompt tightened at <=480px (13px / 2.5px spacing, one line at 375).
- Verified live: prompt fully visible at 390x820 (y:16) and 375x667 (one line, 19px); list scrolls only when needed; finale regression clean (3 options, bottom-anchored, canScroll:false, same geometry as gen 22).
- Critic score: 8.5/10 (three measured defects killed, finale untouched, existing chrome-fade machinery reused; residuals: native scrollbar visible on long lists - honest note; darker top gradient dims page top during modal choice - intended focus tradeoff).
- File gen 23 PRIVATE live. CSS-only change (script hash unchanged); all 367 harness checks green.

## Cycle Sep 29 10:34 PM - NO-SHIP (hotzone functional audit)
- NEW audit class: prep/hotzone-audit.js - drives every hotzone's onTap/onHold with a synthetic event and asserts >=1 OBSERVABLE effect per activation (audio, classList op, setArt, clue, toast, caption, fx, particles, goto). Effect vocabulary catalogued from source first. 26 hotzones, 27 activations, 91 effects recorded. Universal-proxy DOM stubs let real handler bodies (createElementNS, createSVGPoint/getScreenCTM chains, querySelector) execute unmodified. 112/112 PASS.
- Harness-only fix: document stub needed querySelector (ch1_s4 drawn-cup uses it) - stub gap, not app defect.
- Findings: ZERO app defects. Every interactive surface in the story provably does something when touched.
- Full suite: 9 harnesses, 367 checks, all green. Security 5-check PASS (w3.org refs only; no eval/Function/network; app untouched since gen-22 rehash).
- Critic: n/a (no changed surface). Outcome: NO-SHIP (third consecutive audit-only cycle; logic-first per standing rules - the interaction layer is now as proven as the render layer).

## Cycle Sep 29 4:33 PM - NO-SHIP (perf pinned counts)
- NEW audit class: prep/perf-pins-audit.js - pins EXACT per-scene structure: panel counts + SVG element counts for all 55 scenes (10,954 elements total). Two-run stability pre-pass proves structure deterministic (only float values inside style attrs are random; counts stable). Ratchet rule: a pin may only move with an intentional scene change in the same commit. 59/59 PASS.
- Byte lengths NOT pinned (nondeterministic float digits); KB ceilings already live in playthrough-audit.
- Findings: ZERO app defects. Any future structural regression (dropped panel, missing element group, duplicated art) now fails a pin immediately.
- Full suite: save 7/7, graph 9/9, beat 7/7, registry 7/7, art 25/25, playthrough 68/68, choice-path 73/73, perf-pins 59/59 (255 checks). Security 5-check PASS (only w3.org refs; no eval/Function/network calls; app code untouched since gen-22 rehash).
- Critic: n/a (no changed surface). Outcome: NO-SHIP (second consecutive audit-only cycle - coverage keeps deepening, app keeps holding).

## Cycle Sep 29 10:33 AM - NO-SHIP (choice-path coverage + choice overlay design pass)
- NEW audit class: prep/choice-path-audit.js - runs every choice surface once PER OPTION with engine choice-beat semantics emulated (choiceResult + save.ending). Finale: all 3 options -> correct ending scene -> ch5_coda -> end card, save.ending persisted per pick. LOST PAGES: hub routes to each of 7 fragments in forward AND reverse order, recovery captions fire, fragment counts increment exactly, re-reads idempotent, coda diverts at 7/7 without a pick, post-coda hub offers the coda re-read. 73/73 PASS.
- Choice overlay design critique (never before graded): 390x820 prompt 15px + three full-width 358x89 targets, 16px type, all visible; 375x667 short viewport all visible (bottom 583 of 643). No defect.
- Findings: ZERO app defects. Branch integrity proven end-to-end for every route.
- Full suite: save 7/7, graph 9/9, beat 7/7, registry 7/7, art 25/25, playthrough 68/68, choice-path 73/73 (196 checks). Security 5-check PASS (only w3.org namespace refs, no eval/Function, no fetch/XHR/WebSocket/sendBeacon; app code untouched since gen-22 rehash).
- Critic: n/a (nothing shipped; gate not engaged - no changed surface). Verification capture: fz-choice-overlay-390.png.
- Outcome: NO-SHIP. Harness net grew +73 checks; app held under the deepest route-level scrutiny yet.
- Env note: canonical file URL hit a Cloudflare Turnstile failure loop in the cloud browser; fresh previewUrl via no-op build bypasses (build does not publish). Logged to guidance.

## Cycle Sep 29 4:32 AM - SHIPPED File gen 22 (dialogue placement pass, the committed bigger delta)
- Resumed an interrupted 10:32 PM ship (model timeout); applied interrupted-turn rule: verified index.html lacked the 6 beat edits before re-writing.
- Defect 1 (measured): Dialogue.say() centered bubbles on anchors; tail tips landed 48-73px off speakers. Fix: tail-aware placement (tail tip at 22%/78%/50% across the box lands on x, body shifts off speaker).
- Defect 2 (found by LIVE measurement, harness missed it): CSS max-width cap (420 base / 320 under 480px media query) narrows boxes, but placement math used o.w - tails still 87px off for wide beats. Fix: place by RENDERED width (b.offsetWidth). Harness math updated to min(w,320). Live verification: tail tips now <=3px logical from anchor on ch2_s6 + ch4_s3.
- Defect 3: phone bubble font 22px at 0.39 camera scale = ~8.6px screen, unreadable. Raised to 26px (padding 17/22).
- 6 beat-width edits fixing edge-clamp misalignments (ch2_s5, ch2_s6 x2, ch2_s9, ch4_s3, ch5_s4).
- playthrough-audit extended: captures 146 say/narr placements, asserts tail tip <=40px of anchor (achieved <=3px), bubble <= PAGE_W-32, anchors on-page, >=60 says coverage. Chapter IIFE spans now DYNAMIC (content markers, not line numbers). 68/68 PASS. Full suite green (123 checks).
- Security 5-check: PASS (S1 no external refs, S2 CSP hashes rehashed+verified, S3 no eval/Function; S4/S5 unchanged surfaces).
- Critic score: 8.5/10 - two real rendering defects measured then killed with live evidence; readable phone type; residuals: tail up/down beats keep no-op CSS (restraint, untouched semantics), narr bubbles unchanged by design, per-beat aesthetic polish still possible.
- File gen 22 PRIVATE live. Pages push holds for owner yes (heads-down until ~Oct 5).

## Cycle Sep 28 4:32 PM - SHIPPED File gen 21 (design fix)
- 390px design critique (title / hub / in-scene captures): title + hub strong; in-scene reading view had the four round control buttons (clue/sound/pause/settings) stacked vertically at right:16px top:50%, ON the manga page's right edge - UI chrome sitting on the art.
- Fix (one CSS rule): .ui-right docked to the top black band as a horizontal row (right:12px, top:calc(48px + safe-area-inset-top)). Bottom band, next-hint, chrome-gone/infected states untouched.
- Verified non-vacuously in the gen-21 File preview: .ui-right rect {y:48-92} vs #fz-page rect {y:117-702} -> overlapsArt FALSE (was TRUE). Boot FZ-OK in the real preview iframe.
- Critic score: 8.5/10 (defect fully solved + measured, minimal diff, no behavior change; residuals: say-bubble placement over faces is authored per-beat - needs a per-scene pass; fixed-aspect dead bands intrinsic).
- File gen 21 PRIVATE live. Pages stays at gen 20 (49c95ee1) - this fix joins the staged payload for the next owner-approved push.
- Full suite: save 7/7, graph 9/9, beat 7/7, registry 7/7, art 25/25. Security 5-check unchanged (PASS, re-verified last cycle; no app code touched since).

## Gated
- GATE LIFTED for this push: owner WhatsApp Sep 28 5:56:46 AM "go live on all" (reply to the gated-items list naming FRAME ZERO #2) covers the gen-20 Pages push. Future pushes need a fresh yes.

## Next steps (ranked - see PLAN.md)
1. GRANTED Sep 28 5:56 AM: gen-20 Pages push - deploy package sent to bridge this cycle.
2. Next audit class: interaction-GATE audit (scenes requiring a tap/interaction before advance - assert the gate is reachable and wired). Definition: find panels setting required-interaction flags, assert the interactive element exists in that panel's art/hotzones.
3. Manga surface vocabulary pass (dialogue bubbles, chapter-end cards) - deferred, design move.

## Operating rules (owner, via parent; all verified on his WhatsApp)
1. BROWSER-MINIMAL. 2. 20-MIN RULE (log + escalate, never silently abandon). 3. CODE QUALITY (fail loud, non-vacuous verification). 4. LOGIC-FIRST. 5. BACKUP MIRROR (snapshot tarball to parent every closeout; local-only state is losable).
