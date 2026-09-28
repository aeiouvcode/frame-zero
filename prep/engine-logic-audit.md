# ENGINE LOGIC AUDIT (Sep 26, 10:30 PM run - browser-free, logic-first)
Source: live bundle 3b418ee1 (js lines cited).

## Defects found (measured, code-cited)
- A1 SILENT FAILURE: U.loadSave (l.87-93) catches ALL errors identically (JSON.parse SyntaxError on corrupted save + SecurityError private mode) -> returns null -> silent progress reset. Violates owner's 18:36 fail-LOUD rule. FIX: distinguish SyntaxError (quarantine blob to SAVE_KEY+'.corrupt', console.warn, fresh start) vs SecurityError (in-memory play + one-time "progress won't persist" caption).
- A2 SILENT FAILURE: U.storeSave (l.94-96) swallows QuotaExceededError -> progress loss invisible. FIX: specific catch + debug log + caption on first failure.
- A3 NO SCHEMA VALIDATION: Save.load (l.1133-39) uses stored object as-is; old/tampered save missing `clues`/`endings` -> TypeError in addClue/showEndCard. FIX: merge over defaults with per-key type checks; clamp unlockedCh to 1..CHAPTER_COUNT.
- A4 DEAD STATE: data.finished initialized false, never set anywhere (grep: no writer). FIX: drop it; "any ending seen" = Object.keys(d.endings||{}).length > 0 (robust, already-maintained structure at l.2139).
- A5 INCONSISTENT WRITE PATH: boot listener (l.3815-17) mutates d.unlockedCh + calls U.storeSave directly, bypassing Save.save (no validation, re-entrant bus risk). FIX: route through Save.save({unlockedCh}); guard d.ch <= CHAPTER_COUNT so a future bonus chapter can't leak unlockedCh=6 into the main chapter select.

## Verified sound (no action)
- playToken + sceneAbort correctly invalidate stale scene async on transitions (l.1608-39).
- skipAll (60ms pulse) consistently fast-forwards waits, typewriter, cam (l.1248/1356/1585).
- Ending accumulation via d.endings{} is replay-safe (l.2139-41).
- unlockedCh Math.max writers (ch2-5) are monotonic.

## LOST PAGES design inputs from this audit
- Register bonus as ch:6 scenes; GATE ENTRY by endings-seen>0, NOT by unlockedCh (keeps main select clean; A5 guard makes this safe).
- Fragment read-state: Save.data.fragments = {v1: ts,...} - extends the same defaults-merge fix (A3) so old saves gain the key cleanly.
