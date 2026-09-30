# CHECKPOINT - FRAME ZERO
Updated: Sep 30, 10:29 PM IST

## Live
- Pages: https://aeiouvcode.github.io/frame-zero/ - this commit's index.html md5 a2bc5d7dcb1a7089d6a4235386d97efb (gen 24). Pushed under the owner's batch grant "go public where it's behind" (his WhatsApp, Sep 30 10:26:52 PM IST). Post-push md5 verify: see STATE.md.
- App File (PRIVATE): https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B generation 24, same md5, boot-verified in preview iframe.
- Archive File (PRIVATE): https://files.instinct.com/file-01M3GKZV7ZBPN2X34B5C33P4P1 generation 13 - harnesses + deploy machinery + app snapshot + spine; single-checkout recovery point.

## Verification status
- Harnesses: 10 suites, 740 checks, all green (save, graph, beat, registry, art, playthrough, choice-path, perf-pins, hotzone, save-migration).
- Security 5-check (every cycle): PASS - no secrets, no outbound calls, dependency-free, sanitizeSvg on all dynamic innerHTML, nothing phoning home. CSP sha256 matches inline script+style bytes.
- Boot: verified in File preview iframe at 390px before each File publish.

## Deploy machinery
- Edit /tmp/fz.js (extracted bundle) -> re-embed -> python3 rehash.py index.html (CSP sha256, mandatory) -> port_to_file.py for the File (serves src/fz-runtime.js, NOT index.html) -> bridge-tree.html (Git Data API multi-file, vault PAT 'GitHub push token - aeiouvcode', PARAMETERIZED commit message) -> curl md5 verify.
- Workspace is losable (wiped Sep 27 15:42, recovered in minutes). Durable homes: this repo, the two Files, parent-held tarballs.
