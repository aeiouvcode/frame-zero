# CHECKPOINT - FRAME ZERO

Updated: 2026-09-23 08:40 IST

## Live state
- GitHub Pages: https://aeiouvcode.github.io/frame-zero/
  - live md5: 970e19cf1c00956cd5274772f2567788 (commit 8b04a219, "choice UX" cycle)
  - history: b45cb3ba security sanitizeSvg (Sep 23 01:11), 87551209 settings 2x2 grid (Sep 22)
- Instinct File (PRIVATE): https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B
  - generation 6, revision filerevision-01M35NKABR6Y8R7DFM0WA5XYFK
  - known caveat: hosted iframe blocks localStorage - saves do not persist in the File version (session play fine)

## Verification status of live build
- 46-scene error sweep on live: 0 errors (after security patch; CSS-only change since)
- Sanitizer self-test PASS (script/onclick/anchor/js-href stripped, #fragment refs kept)
- Choice overlay before/after verified at 390px (bleed-through fixed, predrawn tag visible)

## Security posture (last full pass Sep 23 04:31)
- No secrets in repo/history: PASS
- No unexpected outbound calls (connect-src 'none'): PASS
- Dependency-free, no third-party scripts: PASS
- Injection sinks: PASS - FZ.util.sanitizeSvg guards addPanel/setArt/hotzone art; typewriter textContent-only
- Phoning home: PASS

## Deploy machinery (rebuilt if workspace wiped)
- Deploy: PAT bridge page (data-URL) -> Contents API; vault entry 'GitHub push token - aeiouvcode' (rotated Sep 22; old entry deleted, do not use)
- Rehash: base64 sha256 of the single inline script + style blocks into CSP meta
- File port: scripts/port_to_file.py lives in the File source (checkout file-01M326A1R2C7SMTDWWGT4R4V3B)
- Repo is shared ground: check commit log for foreign commits before pushing; never revert others' commits
