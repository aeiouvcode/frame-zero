# CHECKPOINT - FRAME ZERO

## Live state (as of Sep 25, ~10:40 AM IST, post audio-click cycle)
- GitHub Pages: https://aeiouvcode.github.io/frame-zero/
  - previous live: commit 9bde0c75, md5 6f8d2919ffa6c7edbc400d7e733c3d85 (touch+hygiene, Sep 26 04:35)
  - this cycle: design pass title+settings (footer stack, perf grid full-width, erase-save danger); md5 3b418ee1a2faba8befde310ec3062d2b (perf-grid fixup included)
- Instinct File: https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B
  - file-01M326A1R2C7SMTDWWGT4R4V3B, PRIVATE, generation 13 -> republish this cycle
  - draft rebuilt this cycle (touch+hygiene); publish with generation from tools file read
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
