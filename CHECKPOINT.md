# CHECKPOINT - FRAME ZERO

Last updated: 2026-09-24 10:33 IST

## Live state
- GitHub Pages: https://aeiouvcode.github.io/frame-zero/ (main, index.html at root)
- Live md5 after this deploy: see latest commit message (verify with curl -s ... | md5sum)
- Instinct File: PRIVATE, https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B
  (republished this cycle; generation from `tools file read`)

## Completed milestones
- Full five-chapter playable manga with saves, choices, clues, endings.
- Infection/possession UI arc (ch3_s9 corrupt 0.8 -> infect(2) is AUTHORED).
- Art-echo tie-in (manuscript circled option), chapter-label fit, short-viewport
  safe-center, choice-UX contrast, sanitizeSvg innerHTML hardening, state files.
- 2026-09-24: ch3_s9 whiteout-stuck bug fixed (whiteout->flash-white, line 3761).
- 2026-09-24: full 35-scene reel completed; ch2_s10 caption collision + ch5_s4 camera
  miss fixed (clearDlg beat, mirror-panel cam beat).

## Failed approaches / artifacts (do not repeat)
- Cloud browser throttles rAF to ~1Hz: CSS entrance anims lag beats. Force
  document.getAnimations().forEach(a=>a.finish()) before QA screenshots. Two past
  "bugs" were this artifact; root-cause in DOM before patching.
- Scene-hopping in QA leaks global FX/chrome state between scenes (infected chrome,
  white overlays). Always clean-reload before judging a frame.
- execute-js big string returns come back null; use lengths/counts, chunk payloads
  <=46K for the tree bridge.
- Workspace is wiped between runs: re-download live index.html; rebuild
  rehash.py / bridge-tree.html from HANDOFF.md recipes.

## Next actions
See CURRENT_TASK.md candidate list.
