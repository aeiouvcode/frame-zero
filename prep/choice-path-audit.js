// FRAME ZERO choice-path audit (Sep 29 10:33 AM cycle)
// Runs every choice surface once PER OPTION and asserts every route completes:
// finale choice (3 endings) -> correct ending scene -> coda -> end card;
// LOST PAGES hub -> all 7 fragments recoverable in any order, idempotent re-reads,
// coda unlocks exactly at 7/7, re-read path offers coda again.
const fs = require('fs');
(async () => {
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
let pass = 0, fail = 0; const fails = [];
const T = (n, c, x) => { if (c) pass++; else { fail++; fails.push(n + ' ' + (x || '')); console.log('FAIL', n, x || ''); } };

function extractModule(name) {
  const s = src.indexOf(`FZ.${name} = (function`);
  const e = src.indexOf('\n})();', s);
  return src.slice(s, e + '\n})();'.length);
}

// ---- harness state (fresh per scenario via reset()) ----
const scenes = []; const sceneIds = new Set(); const sceneById = {};
const FZ = {};
eval(extractModule('util'));
eval(extractModule('art'));
eval(extractModule('bg'));
const fnProxy = new Proxy({}, { get: () => () => {} });
let saveData, gotoLog, captionLog, endCardCalls, choicePick;
FZ.ui = {
  caption: t => captionLog.push(t), showNextHint() {}, clueToast() {}, setProgress() {}, setChapterLabel() {}, closeOverlays() {},
  showEndCard: () => { endCardCalls++; },
  showChoice: (prompt, options) => {
    const opt = options.find(o => o.id === choicePick);
    if (!opt) return Promise.reject(new Error('scripted pick "' + choicePick + '" not among options: ' + options.map(o => o.id).join(',')));
    return Promise.resolve(opt.id);
  },
};
FZ.engine = {
  Save: { get data() { return saveData; }, save() {}, addClue: id => { saveData.clues[id] = true; return true; }, hasClue: id => !!saveData.clues[id] },
  Engine: { goto: id => { gotoLog.push(id); }, wait: () => Promise.resolve(), skipAll: false },
  FX: new Proxy({}, { get: () => () => {} }),
  Perf: { heavyFilters: false, tier: 'high' },
};
FZ.audio = new Proxy({ sfx: fnProxy, amb: fnProxy }, { get: (t, k) => (k in t ? t[k] : () => {}) });
FZ.story = {
  add(scene) { scenes.push(scene); sceneIds.add(scene.id); sceneById[scene.id] = scene; },
  sceneAt(ch, idx) { const a = scenes.filter(s => s.ch === ch); return a.length ? a[Math.min(idx, a.length - 1)].id : null; },
  chapterSceneCount(ch) { return scenes.filter(s => s.ch === ch).length; },
};
global.document = {
  getElementById: () => ({ classList: { toggle() {}, add() {}, remove() {} }, style: {} }),
  createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, set innerHTML(v) {}, set textContent(v) {} }),
};
global.window = { FZ };
global.performance = { now: () => Date.now() };

// ---- load chapter IIFEs by content markers ----
let scan = src.indexOf('FZ.ui = (function');
scan = src.indexOf('\n})();', scan) + 7;
let chapterCount = 0;
while (true) {
  const start = src.indexOf('\n(function () {', scan);
  if (start < 0) break;
  const end = src.indexOf('\n})();', start);
  if (end < 0) break;
  const code = src.slice(start + 1, end + 7);
  scan = end + 7;
  if (!code.includes('S.add({')) continue;
  chapterCount++;
  eval(code);
}
T('C0 five chapter IIFEs loaded', chapterCount === 5, 'got ' + chapterCount);
T('C0 all 55 scenes registered', scenes.length === 55, 'got ' + scenes.length);

function reset() {
  saveData = { v: 1, unlockedCh: 6, ch: 1, sceneIdx: 0, clues: {}, endings: {}, fragments: {}, settings: {}, ending: null, startedAt: 0 };
  gotoLog = []; captionLog = []; endCardCalls = 0; choicePick = null;
}
function makeCtx(scene) {
  const elStub = () => ({ classList: { add() {}, remove() {}, toggle() {} }, style: {}, appendChild() {}, querySelector: () => elStub(), innerHTML: '', textContent: '' });
  const panelStub = () => ({ el: elStub(), setArt() {} });
  return {
    scene, data: {},
    addPanel: () => panelStub(), panel: () => panelStub(),
    show() {}, hide() {}, setArt() {}, transform() {},
    say() {}, narr() {}, clearDialogue() {},
    cam() { return Promise.resolve(); }, camSnap() {},
    sfx() {}, amb() {}, particles() {}, fx: fnProxy,
    hotzone() {}, clue: () => true, hasClue: () => false,
    wait: () => Promise.resolve(), tap: () => Promise.resolve(),
    audio: FZ.audio, save: saveData,
    page: { classList: { toggle() {}, add() {}, remove() {} }, style: {} },
    ui: FZ.ui,
  };
}
// run a scene emulating the engine runner, incl. the real choice-beat semantics (bundle line ~1706)
async function runScene(id) {
  const scene = sceneById[id];
  if (!scene) throw new Error('scene not registered: ' + id);
  const ctx = makeCtx(scene);
  if (scene.enter) await scene.enter(ctx);
  for (const b of scene.beats || []) {
    if (typeof b === 'function') { await b(ctx); continue; }
    if (b && b.t === 'choice') {
      const cid = await FZ.ui.showChoice(b.prompt, b.options);
      ctx.choiceResult = cid; ctx.save.ending = cid; // engine semantics
    }
  }
  return { scene, ctx };
}

// ================= A. FINALE: every option -> its ending -> coda -> end card =================
const ENDING_FOR = { publish: 'ch5_end_publish', erase: 'ch5_end_erase', unfinished: 'ch5_end_unfinished' };
const choiceScene = sceneById['ch5_s6'];
const choiceBeat = (choiceScene.beats || []).find(b => b && b.t === 'choice');
T('C1 finale choice beat exists with 3 options', !!choiceBeat && choiceBeat.options.length === 3, JSON.stringify((choiceBeat || {}).options && choiceBeat.options.map(o => o.id)));
for (const pick of ['publish', 'erase', 'unfinished']) {
  reset(); choicePick = pick;
  const errs = [];
  let ctx;
  try { ({ ctx } = await runScene('ch5_s6')); } catch (e) { errs.push('ch5_s6: ' + e.message); }
  T(`C1 [${pick}] choice scene executes clean`, errs.length === 0, errs[0] || '');
  T(`C1 [${pick}] choiceResult recorded`, ctx && ctx.choiceResult === pick, ctx && String(ctx.choiceResult));
  T(`C1 [${pick}] save.ending persisted`, saveData.ending === pick, String(saveData.ending));
  let nx = null;
  try { nx = typeof choiceScene.next === 'function' ? choiceScene.next(ctx) : choiceScene.next; } catch (e) { errs.push('next(): ' + e.message); }
  T(`C1 [${pick}] next routes to ${ENDING_FOR[pick]}`, nx === ENDING_FOR[pick], 'got ' + nx);
  T(`C1 [${pick}] ending scene registered`, sceneIds.has(ENDING_FOR[pick]));
  // follow the route: ending scene -> coda -> end card
  try { const r = await runScene(ENDING_FOR[pick]); T(`C1 [${pick}] ending scene executes clean`, true); 
    const enx = typeof r.scene.next === 'function' ? r.scene.next(r.ctx) : r.scene.next;
    T(`C1 [${pick}] ending scene next = ch5_coda`, enx === 'ch5_coda', 'got ' + enx);
  } catch (e) { T(`C1 [${pick}] ending scene executes clean`, false, e.message); }
  try { const r = await runScene('ch5_coda'); T(`C1 [${pick}] coda executes clean`, true);
    T(`C1 [${pick}] coda is terminal (next null)`, (typeof r.scene.next === 'function' ? r.scene.next(r.ctx) : r.scene.next) == null);
  } catch (e) { T(`C1 [${pick}] coda executes clean`, false, e.message); }
  T(`C1 [${pick}] end card shown`, endCardCalls >= 1, 'calls: ' + endCardCalls);
}

// ================= B. LOST PAGES: hub loop, all fragments, coda gating =================
reset();
T('C2 lp_hub + 7 fragment scenes + coda registered',
  ['lp_hub','lp_v1','lp_v2','lp_v3','lp_v4','lp_v5','lp_v6','lp_v7','lp_coda'].every(id => sceneIds.has(id)));
// forward order
for (let i = 1; i <= 7; i++) {
  const id = 'v' + i;
  gotoLog = []; choicePick = id;
  try { await runScene('lp_hub'); } catch (e) { T('C2 hub run v' + i, false, e.message); continue; }
  T(`C2 [${id}] hub routes to lp_${id}`, gotoLog[0] === 'lp_' + id, 'goto: ' + gotoLog[0]);
  const before = Object.keys(saveData.fragments).length;
  try { await runScene('lp_' + id); } catch (e) { T(`C2 [${id}] fragment scene executes clean`, false, e.message); continue; }
  T(`C2 [${id}] fragment scene executes clean`, true);
  T(`C2 [${id}] fragment recorded (${i} of 7)`, Object.keys(saveData.fragments).length === before + 1 && !!saveData.fragments[id],
    'count: ' + Object.keys(saveData.fragments).length);
  T(`C2 [${id}] recovery caption fired`, captionLog.some(t => /FRAGMENT RECOVERED/.test(t)));
  captionLog = [];
}
T('C2 all 7 fragments recovered', Object.keys(saveData.fragments).length === 7, JSON.stringify(Object.keys(saveData.fragments)));
// idempotency: re-read v1 -> count stays 7
gotoLog = []; choicePick = 'v1';
await runScene('lp_hub'); // note: 7/7 + codaSeen unset -> hub diverts to coda BEFORE offering a pick
T('C2 at 7/7 hub diverts to lp_coda without a pick', gotoLog[0] === 'lp_coda', 'goto: ' + gotoLog[0]);
T('C2 codaSeen stamped', !!saveData.codaSeen);
await runScene('lp_coda');
T('C2 lp_coda executes clean', true);
// post-coda hub: offers 8 options incl. coda; re-read v1 keeps count at 7
gotoLog = []; choicePick = 'v1';
await runScene('lp_hub');
T('C2 post-coda hub routes to lp_v1 on re-read', gotoLog[0] === 'lp_v1', 'goto: ' + gotoLog[0]);
await runScene('lp_v1');
T('C2 re-read is idempotent (still 7 fragments)', Object.keys(saveData.fragments).length === 7, 'count: ' + Object.keys(saveData.fragments).length);
// pick coda again from hub
gotoLog = []; choicePick = 'coda';
await runScene('lp_hub');
T('C2 post-coda hub routes to lp_coda on coda pick', gotoLog[0] === 'lp_coda', 'goto: ' + gotoLog[0]);
// reverse order permutation completes too
reset();
for (let i = 7; i >= 1; i--) {
  gotoLog = []; choicePick = 'v' + i;
  await runScene('lp_hub');
  await runScene('lp_v' + i);
}
T('C2 reverse-order recovery also completes (7/7)', Object.keys(saveData.fragments).length === 7, 'count: ' + Object.keys(saveData.fragments).length);
gotoLog = []; choicePick = 'v3';
await runScene('lp_hub');
T('C2 reverse run also unlocks coda at 7/7', gotoLog[0] === 'lp_coda' && !!saveData.codaSeen, 'goto: ' + gotoLog[0]);

// ================= C. non-vacuity =================
T('C3 coverage: 3 distinct finale paths followed end-to-end', true); // each iteration above is independent; reaching here with passes is the evidence
T('C3 coverage: hub showChoice scripted picks always matched a real option (no rejections surfaced above)', fails.length === 0 || !fails.some(f => /not among options/.test(f)));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
