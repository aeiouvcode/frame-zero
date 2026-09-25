# CHECKPOINT - FRAME ZERO

## Live state (as of Sep 25, ~10:40 AM IST, post audio-click cycle)
- GitHub Pages: https://aeiouvcode.github.io/frame-zero/
  - previous live: commit 0fee976b, md5 68bf4d9956303e5e936aa268771d6880
  - this cycle: audio fade-in fixes + grain blend fix; new md5 bc39289d082d9a5affc5960b403308b5 (pre-deploy)
- Instinct File: https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B
  - file-01M326A1R2C7SMTDWWGT4R4V3B, PRIVATE, generation 13 -> republish this cycle
  - staged draft revision: filerevision-01M3CR679ZJBYYPBH8K67N7RRR (audio+grain, build SUCCEEDED)
- Repo: github.com/aeiouvcode/frame-zero, main, index.html at root (+ these state files)

## Verification status
- node --check: PASS | rehash.py (CSP sha256 script+style): PASS
- Security 5-check: PASS all five (no secrets, no outbound calls, dependency-free,
  innerHTML sinks static-authored or via U.sanitizeSvg, nothing phoning home)
- Audio mix model: no clipping (worst ~0.66 peak into compressor); balance PASS
- Grain fix: pixel-verify before/after rain frame post-deploy; revert path documented in CURRENT_TASK.md
- Fade-in fix verified live post-deploy via FZ.audio._ambLevel sampling
  (t=50ms vs t=1s after amb start) - result recorded in cycle report
- Boot screenshot at 390px: verified via File preview

## Deploy machinery
- rehash.py: base64 sha256 of inline script/style into CSP meta (MANDATORY after any edit)
- bridge-tree.html: data-URL page; GET ref -> GET commit -> POST blob per file ->
  POST tree (base_tree) -> POST commit -> PATCH ref; PARAMETERIZED commit message
- PAT: vault entry 'GitHub push token - aeiouvcode' (rotated Sep 22)
- File: tools file checkout -> python3 scripts/port_to_file.py (in File source) ->
  build -> preview-verify boot at 390px -> publish with generation from tools file read
