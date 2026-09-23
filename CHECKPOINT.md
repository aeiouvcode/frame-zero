# CHECKPOINT - FRAME ZERO

Updated: 2026-09-23 10:30 IST

## Live state
- GitHub Pages: https://aeiouvcode.github.io/frame-zero/
  - live md5: 3e9c56f3e9beaffb0140ba25622a7404 (chapter-label fit, this cycle's commit)
  - history: e9685e9a state files, 8b04a219 choice UX (note: 8b04a219 carries a stale "security" message - cosmetic), b45cb3ba sanitizeSvg
- Instinct File (PRIVATE): https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B
  - generation 6 at last republish; this cycle's republish bumps it
  - known caveat: hosted iframe blocks localStorage - saves do not persist in the File version

## Verification status of live build
- Chapter-label before/after at 390px (this cycle); prior: 46-scene sweep 0 errors, sanitizer self-test PASS, choice overlay verified
- Full reel this cycle: title, ch1_s1 opening, clues, ch2 CCTV scene, infected UI, pause veil - all PASS at 390px

## Security posture (last full pass Sep 23 10:26)
- No secrets in repo/history: PASS
- No unexpected outbound calls (0 fetch/XHR/WebSocket/sendBeacon; connect-src 'none'): PASS
- Dependency-free, no third-party scripts: PASS
- Injection sinks: PASS - all 16 innerHTML sites audited: sanitizeSvg-guarded, escapeHtml'd, static-authored, or clear-to-empty
- Phoning home: PASS

## Deploy machinery (rebuilt if workspace wiped)
- Deploy: PAT bridge page (data-URL) -> Contents API; vault entry 'GitHub push token - aeiouvcode' (rotated Sep 22; old entry deleted)
- Multi-file single commit: Git Data API tree bridge (GET ref -> GET commit -> POST blobs -> POST tree -> POST commit -> PATCH ref)
- Rehash: base64 sha256 of the single inline script + style blocks into CSP meta
- File port: scripts/port_to_file.py lives in the File source (checkout file-01M326A1R2C7SMTDWWGT4R4V3B)
- Repo is shared ground: check commit log for foreign commits before pushing; never revert others
- PARAMETERIZE the bridge commit message per deploy (8b04a219 shipped with a stale message)
