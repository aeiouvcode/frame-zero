# CHECKPOINT - FRAME ZERO
Updated: Sep 28, 5:58 AM IST

## Live
- Pages: https://aeiouvcode.github.io/frame-zero/ - this commit's index.html md5 254d51ead41cb85014591c9b37762447 (gen 20).
- App File (PRIVATE): https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B generation 20, same md5, boot-verified.
- Archive File (PRIVATE): https://files.instinct.com/file-01M3GKZV7ZBPN2X34B5C33P4P1 generation 4 - harnesses + deploy machinery + app snapshot + spine; single-checkout recovery point.

## Verification status
- Harnesses: save 7/7, graph 9/9, beat 7/7, registry 7/7, art 25/25 (all non-vacuous, asserted values).
- Security 5-check (every cycle): PASS - no secrets, no outbound calls, dependency-free, sanitizeSvg on all dynamic innerHTML, nothing phoning home. CSP sha256 matches inline script+style bytes.
- Boot: verified in File preview iframe at 390px before each File publish.

## Deploy machinery
- Edit /tmp/fz.js (extracted bundle) -> re-embed -> python3 rehash.py index.html (CSP sha256, mandatory) -> port_to_file.py for the File (serves src/fz-runtime.js, NOT index.html) -> bridge-tree.html (Git Data API multi-file, vault PAT 'GitHub push token - aeiouvcode', PARAMETERIZED commit message) -> curl md5 verify.
- Workspace is losable (wiped Sep 27 15:42, recovered in minutes). Durable homes: this repo, the two Files, parent-held tarballs.
