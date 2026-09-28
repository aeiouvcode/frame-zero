# LOST PAGES - mechanics skeleton (state machine first, logic-first rule)

## State
Save.data.fragments = {}  // {v1: timestampRead, ..., v7: timestampRead}
Save.data.bonusSeen = bool  // hub entered at least once (drives title-screen badge)
Unlock predicate: Object.keys(Save.data.endings||{}).length > 0

## Flow
chapter select -> BONUS card (locked: "FINISH AN ENDING" / unlocked: "LOST PAGES - n/7 RECOVERED")
-> hub scene (fragment archive: 7 slots, read=lit, unread=dim; tap slot -> fragment scene)
-> fragment scene (3-5 beats: one art panel + 2-3 narr/say + auto-return to hub)
-> all 7 read -> seventh-panel coda beat (one-time, flag Save.data.codaSeen)

## Scene registration
S.add({ id:'lp_hub', ch:6, chapterTitle:'LOST PAGES', next:null (hub loops) })
S.add({ id:'lp_v1'..'lp_v7', ch:6, each ends with fn: goto('lp_hub') })
CHAPTER_TITLES[6] = 'LOST PAGES' (guarded from main select by endings predicate)

## Art (reuse builders)
hub: B.archiveRoom variant (7 frame outlines) | v1-v7: B.cctv/B.manuscriptPage/B.clock213/B.textPanel mixes, grayscale, one crimson accent each (victim motif)
Audio: existing beds, fade-in ramps; heartbeat only in v7.

## Edge cases to test (non-vacuous)
1. Old save (no fragments key) -> hub renders 0/7, no crash (A3 merge).
2. Read v3, quit mid-scene, resume -> fragments.v3 persisted, hub shows 1/7.
3. wiped endings but fragments present -> impossible via UI; if hand-crafted, hub re-locks gracefully.
4. Rapid tap on slot during hub transition -> playToken invalidates (existing mechanism).
5. Corrupted save blob -> quarantined, fresh start, no boot crash (A1 fix).
