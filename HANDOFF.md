# HANDOFF - FRAME ZERO

## What this is
Five-chapter interactive animated manga. Single self-contained index.html:
vanilla HTML/CSS/JS + inline SVG + Canvas + Web Audio. No frameworks, CDN, or
external assets. Grayscale + restrained crimson. Mobile-portrait-first.
LocalStorage saves. ?debug=1 for QA hooks (FZ.engine.Engine.goto/skipAll).

## Deploy (GitHub Pages, repo aeiouvcode/frame-zero, branch main)
1. Edit index.html. Extract the single inline <script> and `node --check` it.
2. `python3 rehash.py index.html` (rewrites CSP sha256 for inline script+style).
3. Tree bridge: load bridge-tree.html in cloud browser tab, fill vault login
   (kind=login, key=password, field n1 = GitHub push token 'GitHub push token -
   aeiouvcode'), stage payload as <=46K JSON-string chunks via execute-js,
   JSON.parse in page; Git Data API: GET ref -> GET commit -> POST blobs ->
   POST tree -> POST commit -> PATCH ref. One commit, PARAMETERIZED message.
4. Verify: `curl -s https://aeiouvcode.github.io/frame-zero/ | md5sum` matches local.
5. QA in cloud browser with cache-buster (?v=N) - profile caches Pages aggressively.
6. Update CURRENT_TASK.md / CHECKPOINT.md / HANDOFF.md in the same commit.

## Instinct File republish
`tools file checkout --file-id file-01M326A1R2C7SMTDWWGT4R4V3B --path /home/sandbox/fz-file`
then `python3 scripts/port_to_file.py index.html /home/sandbox/fz-file` (2 args),
build, preview boot-verify at 390px visually (app iframe is a dynamic ES module),
publish with current generation from `tools file read`.

## Security posture (check every cycle)
0 fetch/XHR/WebSocket/sendBeacon; 0 external src/href; CSP sha256-only inline;
sanitizeSvg on all innerHTML SVG sinks; no secrets in repo/history; no telemetry.

## Gotchas
- whiteout = persistent on/off overlay; flash-white/flash-red = timed flash (ms).
  A beat that wants a timed white flash must use flash-white (ch3_s9 bug 2026-09-24).
- corrupt v>=0.8 -> infect(2) (possessed chrome). Authored, not a bug.
- Other agents commit to this repo; check commit log, never revert others' work.
