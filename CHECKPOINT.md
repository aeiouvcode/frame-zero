# CHECKPOINT - FRAME ZERO

Updated: 2026-09-23 16:30 IST

## Live state
- GitHub Pages: https://aeiouvcode.github.io/frame-zero/
  - live md5: 536468e4d6b1e84fec8c219f8e294f3c (short-viewport overlay fix, this cycle's commit)
  - history: 95c419c4 chapter-label fit, e9685e9a state files, 8b04a219 choice UX, b45cb3ba sanitizeSvg
- Instinct File (PRIVATE): https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B
  - generation 7 at last republish; this cycle's republish bumps it
  - known caveat: hosted iframe blocks localStorage - saves do not persist in the File version

## Verification status
- Short-viewport fix verified live via CSSOM injection at 390x650: canReachTop false -> true, safe center supported
- Full reels across cycles: all major surfaces PASS at 390px (see CURRENT_TASK.md verified list)
- Prior: 46-scene sweep 0 errors; sanitizer self-test PASS

## Security posture (last pass Sep 23 16:26)
- No secrets in repo/history: PASS
- No unexpected outbound calls (0 fetch/XHR/WebSocket/sendBeacon; connect-src 'none'): PASS
- Dependency-free, no third-party scripts: PASS
- Injection sinks: PASS (16 innerHTML sites audited Sep 23 10:26; CSS-only changes since)
- Phoning home: PASS

## Deploy machinery (rebuilt if workspace wiped)
- Deploy: PAT bridge page (data-URL) -> Contents API; vault entry 'GitHub push token - aeiouvcode'
- Multi-file single commit: Git Data API tree bridge (GET ref -> GET commit -> POST blobs -> POST tree -> POST commit -> PATCH ref); stage large payloads as 46K JSON-string chunks, JSON.parse in page
- Rehash: base64 sha256 of the single inline script + style blocks into CSP meta
- File port: scripts/port_to_file.py lives in the File source (checkout file-01M326A1R2C7SMTDWWGT4R4V3B)
- Repo is shared ground: check commit log first; never revert others; PARAMETERIZE commit messages per deploy
