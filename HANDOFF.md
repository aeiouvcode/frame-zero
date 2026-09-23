# HANDOFF - FRAME ZERO

Updated: 2026-09-23 08:40 IST

## What this is
Five-chapter interactive animated manga. Single self-contained index.html (vanilla HTML/CSS/JS + inline SVG + Canvas + Web Audio; no frameworks/CDN/external assets). Procedural manga art, grayscale + restrained crimson, mobile-portrait-first, LocalStorage saves, ?debug=1. 46 scenes across 5 chapters, 3 endings, 15 clues.

## Surfaces
1. GitHub Pages (canonical): https://aeiouvcode.github.io/frame-zero/ - repo aeiouvcode/frame-zero, main branch, index.html at root
2. Instinct File (PRIVATE, primary since Sep 21): https://files.instinct.com/file-01M326A1R2C7SMTDWWGT4R4V3B - ported via scripts/port_to_file.py (index.html -> src/fz.css + fz-runtime.js + App.tsx); localStorage blocked in the hosted iframe

## How a cycle runs
1. curl the live index.html from raw.githubusercontent (workspace wipes; live file is the ONLY durable source - never deploy a stale local copy)
2. Check api.github.com/repos/aeiouvcode/frame-zero/commits for foreign commits; rebase onto newest live
3. Critique at 390px (phone first): spacing, type hierarchy, restraint, accent discipline, no boxes-in-boxes; pick highest-value fix; self-critique hard before shipping
4. Security pass every cycle (5 checks, see CHECKPOINT.md); grade PASS/PARTIAL/FAIL honestly
5. node --check extracted script; rehash CSP; deploy via PAT bridge; md5-verify live
6. File: checkout source, port, build, preview-boot-verify, publish with current generation from `tools file read`
7. Screenshot-verify at 390px with cache-buster ?v=N; report milestone with both URLs + in-motion frames + honest residuals

## Failed approaches / do-not-repeat
- DO NOT "fix" blank panels seen in cloud-browser screenshots without root-causing: the cloud browser throttles requestAnimationFrame to ~1Hz even visible+focused, so CSS entrance animations lag setInterval-driven beats. Artifact, not app bug. In QA: document.getAnimations().forEach(a=>a.finish()) before capturing entrance-dependent frames.
- Old vault entry 'GitHub aeiouvcode repo push token' is DELETED (401); use 'GitHub push token - aeiouvcode'.
- execute-js multi-statement scripts need explicit return; string concat on a 345K-char join returns null silently - verify staging by length.
- github.io can stall mid-download to the cloud browser: navigate wait-until=none, poll htmlLen; re-navigate with fresh cache-buster on stall.
- SkipAll does not skip tap gates (Engine.waitTap parks) - expected; parked scenes show TAP TO CONTINUE.
- Suspected visual defects: root-cause in the DOM before patching (two prior "bugs" were intentional design or QA artifacts).

## Authority
Standing instruction from the user (Sep 20 WhatsApp, confirmed Sep 21 3:32 PM via main agent): continue improving and deploying autonomously; report finished milestones, not plans. Sep 21 user steer: "the only thing you miss out on is the design" - design is the primary grading axis.
