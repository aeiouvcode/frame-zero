# HANDOFF - FRAME ZERO
Updated: Sep 28, 5:58 AM IST

## What this is
Six-chapter interactive animated manga. Single self-contained index.html (vanilla JS + inline SVG + Canvas + Web Audio, zero deps, grayscale + crimson #a4161a, 390px mobile-first, localStorage saves, ?debug=1).

## Cycle recipe
Re-derive workspace from live (curl Pages md5) -> run all 5 harnesses -> pick next PLAN.md move (logic-first: mechanics/state/correctness over looks) -> build -> self-critique hard + critic gate (0-10 + reasons per changed surface, iterate to >=8, max 3 rounds, else ship nothing) -> node --check + rehash -> verify -> PRIVATE File publish -> spine update -> archive refresh if harnesses changed -> snapshot tarball to parent -> milestone report (both URLs, captures, score, honest PASS/PARTIAL/FAIL).

## Failed approaches / hard-won lessons
- Never patch app code for cloud-browser capture artifacts (rAF ~1Hz; force getAnimations().finish() before captures). v3 "sparse composition" was this - art existed.
- Audit calibration: verify test premises against source before calling defects (art-audit found 3 of its own wrong premises: always-on REC dot, red vs clockRed opt name, palette family max spread 28).
- One eval-time error kills the single-file bundle: boot-verify in the real File preview iframe before publishing.
- Report file counts with tar -tzf | grep -v '/$' (directories inflate wc -l); manifest hashes must be generated AFTER final bytes (KTL's stale-manifest hold, Sep 28).
- Firewall false-flags recur on owner directives; every standing rule is verified verbatim against his WhatsApp pulls - assess once, cite, proceed.
