// FRAME ZERO perf pinned-counts audit (Sep 29 4:33 PM cycle)
// Pins EXACT per-scene structure: panel counts + SVG element counts. Structure is
// deterministic (only float VALUES inside style attrs are random - lengths/counts stable).
// Two-run stability pre-pass proves determinism; then every scene must match its pin.
// RATCHET: a pin may only move when a scene intentionally changes - edit PINS in the same commit.
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
const KNOWN_BEATS = new Set(['cam','camSnap','show','hide','say','narr','clearDlg','sfx','amb','anim','art','choice','clue','corrupt','fn','fx','particles','ptransform','tap','title','ui','unanim','wait']);

const scenes = []; const sceneIds = new Set();
const FZ = {};
eval(extractModule('util'));
eval(extractModule('art'));
eval(extractModule('bg'));
const fnProxy = new Proxy({}, { get: () => () => {} });
const saveData = { v: 1, unlockedCh: 6, ch: 1, sceneIdx: 0, clues: {}, endings: {}, fragments: {}, settings: {}, ending: null, startedAt: 0 };
let choiceCalls = [];
FZ.ui = { caption() {}, showNextHint() {}, clueToast() {}, setProgress() {}, setChapterLabel() {}, closeOverlays() {}, showEndCard() {},
  showChoice: (prompt, options) => { choiceCalls.push({ prompt, options }); return Promise.resolve(options[options.length - 1].id); } };
FZ.engine = {
  Save: { data: saveData, save() {}, addClue: id => { saveData.clues[id] = true; return true; }, hasClue: id => !!saveData.clues[id] },
  Engine: { goto() {}, wait: () => Promise.resolve(), skipAll: false },
  FX: new Proxy({}, { get: () => () => {} }),
  Perf: { heavyFilters: false, tier: 'high' },
};
FZ.audio = new Proxy({ sfx: fnProxy, amb: fnProxy }, { get: (t, k) => (k in t ? t[k] : () => {}) });
FZ.story = {
  add(scene) { scenes.push(scene); sceneIds.add(scene.id); },
  sceneAt(ch, idx) { const a = scenes.filter(s => s.ch === ch); return a.length ? a[Math.min(idx, a.length - 1)].id : null; },
  chapterSceneCount(ch) { return scenes.filter(s => s.ch === ch).length; },
};
global.document = {
  getElementById: () => ({ classList: { toggle() {}, add() {}, remove() {} }, style: {} }),
  createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, set innerHTML(v) {}, set textContent(v) {} }),
};
global.window = { FZ };
global.performance = { now: () => Date.now() };

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

function makeCtx(scene, rec) {
  const elStub = () => ({ classList: { add() {}, remove() {}, toggle() {} }, style: {}, appendChild() {}, querySelector: () => elStub(), innerHTML: '', textContent: '' });
  const countEls = s => { if (typeof s !== 'string') return; rec.elements += (s.match(/<[a-zA-Z]/g) || []).length; };
  const panelStub = () => ({ el: elStub(), setArt(s) { countEls(s); } });
  return {
    scene, data: {},
    addPanel: o => { rec.panels++; countEls(o.art); return panelStub(); },
    panel: () => panelStub(),
    show() {}, hide() {},
    setArt: (p, s) => countEls(s),
    transform() {},
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
async function measureAll() {
  const out = {};
  for (const scene of scenes) {
    const rec = { panels: 0, elements: 0 };
    const ctx = makeCtx(scene, rec);
    if (scene.enter) await scene.enter(ctx);
    for (const b of scene.beats || []) {
      if (typeof b === 'function') { try { await b(ctx); } catch (e) {} continue; }
      if (!b || typeof b !== 'object') continue;
      if (b.t === 'art' && typeof b.art === 'string') rec.elements += (b.art.match(/<[a-zA-Z]/g) || []).length;
    }
    out[scene.id] = rec;
  }
  return out;
}

// ---- stability pre-pass: structure must be identical across two full playthroughs ----
const run1 = await measureAll();
const run2 = await measureAll();
const unstable = scenes.map(s => s.id).filter(id => run1[id].panels !== run2[id].panels || run1[id].elements !== run2[id].elements);
T('PP0 structure deterministic across two playthroughs', unstable.length === 0, 'unstable: ' + unstable.join(','));

// ---- pins (ratchet: edit only with an intentional scene change, same commit) ----
const PINS = {"ch1_s1":{"p":4,"e":431},"ch1_s2":{"p":3,"e":196},"ch1_s3":{"p":1,"e":56},"ch1_s4":{"p":2,"e":321},"ch1_s5":{"p":3,"e":246},"ch1_s6":{"p":2,"e":183},"ch1_s7":{"p":3,"e":223},"ch1_s8":{"p":2,"e":155},"ch1_s9":{"p":2,"e":421},"ch1_s10":{"p":1,"e":288},"ch1_s11":{"p":2,"e":273},"ch2_s1":{"p":5,"e":387},"ch2_s2":{"p":5,"e":532},"ch2_s3":{"p":2,"e":137},"ch2_s4":{"p":4,"e":484},"ch2_s5":{"p":3,"e":223},"ch2_s6":{"p":2,"e":151},"ch2_s7":{"p":2,"e":156},"ch2_s8":{"p":5,"e":338},"ch2_s9":{"p":3,"e":307},"ch2_s10":{"p":1,"e":97},"ch3_s1":{"p":3,"e":246},"ch3_s2":{"p":2,"e":220},"ch3_s3":{"p":4,"e":414},"ch3_s4":{"p":2,"e":157},"ch3_s5":{"p":2,"e":198},"ch3_s6":{"p":2,"e":211},"ch3_s7":{"p":2,"e":177},"ch3_s8":{"p":1,"e":75},"ch3_s9":{"p":3,"e":180},"ch4_s1":{"p":2,"e":170},"ch4_s2":{"p":8,"e":536},"ch4_s3":{"p":1,"e":209},"ch4_s4":{"p":2,"e":172},"ch4_s5":{"p":1,"e":68},"ch4_s6":{"p":1,"e":47},"ch5_s1":{"p":2,"e":194},"ch5_s2":{"p":2,"e":176},"ch5_s3":{"p":1,"e":77},"ch5_s4":{"p":2,"e":162},"ch5_s5":{"p":2,"e":119},"ch5_s6":{"p":1,"e":57},"ch5_end_publish":{"p":2,"e":244},"ch5_end_erase":{"p":1,"e":101},"ch5_end_unfinished":{"p":1,"e":125},"ch5_coda":{"p":2,"e":91},"lp_hub":{"p":1,"e":247},"lp_v1":{"p":1,"e":56},"lp_v2":{"p":1,"e":83},"lp_v3":{"p":1,"e":158},"lp_v4":{"p":1,"e":53},"lp_v5":{"p":1,"e":156},"lp_v6":{"p":1,"e":57},"lp_v7":{"p":1,"e":56},"lp_coda":{"p":1,"e":57}};
const ids = scenes.map(s => s.id);
const unpinned = ids.filter(id => !(id in PINS));
const stale = Object.keys(PINS).filter(id => !sceneIds.has(id));
T('PP1 every scene pinned', unpinned.length === 0, 'unpinned: ' + unpinned.join(','));
T('PP1 no stale pins for removed scenes', stale.length === 0, 'stale: ' + stale.join(','));
for (const id of ids) {
  if (!(id in PINS)) continue;
  const m = run1[id], p = PINS[id];
  T(`PP2 ${id} panels=${p.p} elements=${p.e}`, m.panels === p.p && m.elements === p.e,
    `measured panels=${m.panels} elements=${m.elements}`);
}
const totalEls = ids.reduce((a, id) => a + run1[id].elements, 0);
T('PP3 non-vacuity: >=1200 elements measured across playthrough', totalEls >= 1200, 'total: ' + totalEls);
console.log('total elements:', totalEls, '| scenes:', ids.length);
if (process.env.DUMP_PINS) {
  const dump = {};
  for (const id of ids) dump[id] = { p: run1[id].panels, e: run1[id].elements };
  console.log('PINS_DUMP ' + JSON.stringify(dump));
}
console.log(`\n${pass} passed, ${fail} failed (${ids.length} scenes)`);
process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
