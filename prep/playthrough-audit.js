// FRAME ZERO headless playthrough audit (Sep 28 10:32 AM cycle)
// Executes every scene's enter + beats with a recording ctx: catches runtime beat errors,
// invalid beat types, off-page hotzones, dangling panel refs, malformed choices.
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
const PAGE_W = 1000, PAGE_H = 1500;
const KNOWN_BEATS = new Set(['cam','camSnap','show','hide','say','narr','clearDlg','sfx','amb','anim','art','choice','clue','corrupt','fn','fx','particles','ptransform','tap','title','ui','unanim','wait']);

// ---- harness state ----
const scenes = []; const sceneIds = new Set();
const FZ = {};
eval(extractModule('util'));
eval(extractModule('art'));
eval(extractModule('bg'));
const U = FZ.util;
const saveData = { v: 1, unlockedCh: 6, ch: 1, sceneIdx: 0, clues: {}, endings: {}, fragments: {}, settings: {}, ending: null, startedAt: 0 };
let gotoLog = [];
const fnProxy = new Proxy({}, { get: () => () => {} });
FZ.ui = { caption() {}, showNextHint() {}, clueToast() {}, setProgress() {}, setChapterLabel() {}, closeOverlays() {}, showEndCard() {},
  showChoice: (prompt, options) => { choiceCalls.push({ prompt, options }); return Promise.resolve(options[options.length - 1].id); } };
FZ.engine = {
  Save: { data: saveData, save() {}, addClue: id => { saveData.clues[id] = true; return true; }, hasClue: id => !!saveData.clues[id] },
  Engine: { goto: id => { gotoLog.push(id); }, wait: () => Promise.resolve(), skipAll: false },
  FX: new Proxy({}, { get: () => () => {} }),
  Perf: { heavyFilters: false, tier: 'high' },
};
FZ.audio = new Proxy({ sfx: fnProxy, amb: fnProxy }, { get: (t, k) => (k in t ? t[k] : () => {}) });
FZ.story = {
  add(scene) { scenes.push(scene); sceneIds.add(scene.id); },
  sceneAt(ch, idx) { const a = scenes.filter(s => s.ch === ch); return a.length ? a[Math.min(idx, a.length - 1)].id : null; },
  chapterSceneCount(ch) { return scenes.filter(s => s.ch === ch).length; },
};
let choiceCalls = [];
global.document = {
  getElementById: () => ({ classList: { toggle() {}, add() {}, remove() {} }, style: {} }),
  createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, set innerHTML(v) {}, set textContent(v) {} }),
};
global.window = { FZ };
global.performance = { now: () => Date.now() };

// ---- load chapter IIFEs (they register into fake FZ.story) ----
// chapter IIFEs: top-level (function () { ... })(); blocks AFTER the FZ.story module (line numbers shift as the bundle edits)
const lines = src.split('\n');
const storyEnd = src.indexOf('FZ.ui = (function'); // chapters begin after story+ui modules
const chapterSpans = [];
let scan = src.indexOf('FZ.ui = (function');
scan = src.indexOf('\n})();', scan) + 7; // end of ui module
while (true) {
  const start = src.indexOf('\n(function () {', scan);
  if (start < 0) break;
  const end = src.indexOf('\n})();', start);
  if (end < 0) break;
  chapterSpans.push([start + 1, end + 7]);
  scan = end + 7;
}
// the LAST top-level IIFE is the boot module, not a chapter - chapters are those that call S.add
let chapterCount = 0;
for (const [a, b] of chapterSpans) {
  const code = src.slice(a, b);
  if (!code.includes('S.add({')) continue;
  chapterCount++;
  try { eval(code); } catch (e) { T('chapter IIFE @' + a + ' evals clean', false, e.message); }
}
T('P0 five chapter IIFEs loaded', chapterCount === 5, 'got ' + chapterCount);
T('P0 all 55 scenes registered', scenes.length === 55, 'got ' + scenes.length);

// ---- recording ctx ----
function makeCtx(scene, rec) {
  const elStub = () => ({ classList: { add() {}, remove() {}, toggle() {} }, style: {}, appendChild() {}, querySelector: () => elStub(), innerHTML: '', textContent: '' });
  const panelStub = () => ({ el: elStub(), setArt() {} });
  const refId = v => { if (typeof v === 'string') rec.refs.add(v); };
  return {
    scene, data: {},
    addPanel: o => { rec.panels.add(o.id); if (o.art && typeof o.art === 'string') rec.artLens.push(o.art.length); return panelStub(); },
    panel: id => { refId(id); return panelStub(); },
    show: p => refId(p), hide: p => refId(p),
    setArt: (p, s) => { refId(p); if (typeof s === 'string') rec.artLens.push(s.length); },
    transform: p => refId(p),
    say: o => { if (o && typeof o.x === 'number') rec.says.push({ who: o.who || '', x: o.x, y: o.y, w: o.w || 340, tail: o.tail || '' }); },
    narr: (t, x, y, w) => { if (typeof x === 'number') rec.says.push({ who: 'NARR', x, y, w: w || 460, tail: '' }); },
    clearDialogue() {},
    cam() { return Promise.resolve(); }, camSnap() {},
    sfx: n => { rec.sfx.add(n); }, amb: (n) => { rec.amb.add(n); },
    particles() {}, fx: fnProxy,
    hotzone: o => rec.hotzones.push(o),
    clue: id => { rec.clues.add(id); return true; }, hasClue: () => false,
    wait: () => Promise.resolve(), tap: () => Promise.resolve(),
    audio: FZ.audio, save: saveData,
    page: { classList: { toggle() {}, add() {}, remove() {} }, style: {} },
    ui: FZ.ui,
  };
}

// ---- run every scene ----
const badScenes = [];
const stats = { panels: 0, refs: 0, hotzones: 0, choiceBeats: 0, stringNexts: 0 };
const perf = [];
for (const scene of scenes) {
  const rec = { panels: new Set(), refs: new Set(), hotzones: [], clues: new Set(), sfx: new Set(), amb: new Set(), artLens: [], says: [] };
  const ctx = makeCtx(scene, rec);
  const errs = [];
  try { if (scene.enter) await scene.enter(ctx); } catch (e) { errs.push('enter: ' + e.message); }
  const beats = scene.beats || [];
  const badBeatTypes = beats.filter(b => b && typeof b === 'object' && b.t && !KNOWN_BEATS.has(b.t)).map(b => b.t);
  if (badBeatTypes.length) errs.push('unknown beat types: ' + badBeatTypes.join(','));
  for (let bi = 0; bi < beats.length; bi++) {
    const b = beats[bi];
    try {
      if (typeof b === 'function') await b(ctx);
      else if (b && b.t === 'choice') {
        stats.choiceBeats++;
        T(scene.id + ' choice beat has >=2 options with unique ids + labels',
          Array.isArray(b.options) && b.options.length >= 2 && new Set(b.options.map(o => o.id)).size === b.options.length && b.options.every(o => o.id && o.label),
          JSON.stringify((b.options || []).map(o => o.id)));
      } else if (b && b.t === 'show') rec.refs.add(b.panel);
      else if (b && b.t === 'say') rec.says.push({ who: b.who || '', x: b.x, y: b.y, w: b.w || 340, tail: b.tail || '' });
      else if (b && b.t === 'narr' && typeof b.x === 'number') rec.says.push({ who: 'NARR', x: b.x, y: b.y, w: b.w || 460, tail: '' });
      else if (b && (b.t === 'hide' || b.t === 'art' || b.t === 'ptransform' || b.t === 'anim' || b.t === 'unanim')) rec.refs.add(b.panel);
    } catch (e) { errs.push('beat ' + bi + ': ' + e.message); }
  }
  // panel-ref integrity: refs must be panels added in this scene
  const dangling = [...rec.refs].filter(r => !rec.panels.has(r));
  if (dangling.length) errs.push('dangling panel refs: ' + dangling.join(','));
  // hotzone geometry + aria + holdMs
  for (const h of rec.hotzones) {
    const inB = h.x >= 0 && h.y >= 0 && h.x + h.w <= PAGE_W && h.y + h.h <= PAGE_H && h.w > 0 && h.h > 0;
    if (!inB) errs.push(`hotzone ${h.id} out of bounds: x=${h.x} y=${h.y} w=${h.w} h=${h.h}`);
    if (!h.aria || !String(h.aria).trim()) errs.push('hotzone ' + h.id + ' missing aria');
    if (h.holdMs && (h.holdMs < 200 || h.holdMs > 3000)) errs.push('hotzone ' + h.id + ' holdMs=' + h.holdMs);
    if (!h.onTap && !h.onHold) errs.push('hotzone ' + h.id + ' has no handler');
  }
  // next resolution
  if (scene.next != null) {
    let nx = scene.next;
    try { if (typeof nx === 'function') nx = nx(ctx); } catch (e) { errs.push('next(): ' + e.message); nx = null; }
    if (typeof nx === 'string') { stats.stringNexts++; if (!sceneIds.has(nx)) errs.push('next -> unregistered scene: ' + nx); }
  }
  stats.panels += rec.panels.size; stats.refs += rec.refs.size; stats.hotzones += rec.hotzones.length; stats.says = (stats.says || 0) + rec.says.length;
  for (const sy of rec.says) {
    const bw = Math.min(sy.w, 320), tailX = sy.tail === 'left' ? 0.22 : sy.tail === 'right' ? 0.78 : 0.5; // 320 = phone max-width cap
    const left = Math.max(16, Math.min(sy.x - bw * tailX, PAGE_W - bw - 16));
    const tip = left + bw * tailX;
    if (Math.abs(tip - sy.x) > 40) errs.push(`say (${sy.who}) tail tip lands ${Math.round(Math.abs(tip - sy.x))}px off anchor (clamp)`);
    if (bw > PAGE_W - 32) errs.push(`say (${sy.who}) bubble wider than page: ${bw}`);
    if (sy.x < 0 || sy.x > PAGE_W || sy.y < 0 || sy.y > PAGE_H) errs.push(`say (${sy.who}) anchor off page: ${sy.x},${sy.y}`);
  }
  perf.push({ id: scene.id, panels: rec.panels.size, artBytes: rec.artLens.reduce((a, b) => a + b, 0) });
  if (errs.length) { badScenes.push(scene.id); for (const e of errs) console.log('  [' + scene.id + ']', e); }
  T('P1 ' + scene.id + ' executes clean', errs.length === 0, errs[0] || '');
}
// showChoice calls from function beats
for (const cc of choiceCalls) {
  T('showChoice "' + String(cc.prompt).slice(0, 30) + '" options valid',
    Array.isArray(cc.options) && cc.options.length >= 2 && new Set(cc.options.map(o => o.id)).size === cc.options.length && cc.options.every(o => o.id && o.label),
    JSON.stringify((cc.options || []).map(o => o.id)));
}
// P2: perf ceilings (ratchet: ~20% headroom over observed Sep 28; tighten when scenes shrink)
const heaviest = perf.slice().sort((a, b) => b.artBytes - a.artBytes)[0];
const mostPanels = perf.slice().sort((a, b) => b.panels - a.panels)[0];
T('P2 heaviest scene art under 120KB budget (' + heaviest.id + ')', heaviest.artBytes <= 120000, heaviest.artBytes + ' bytes');
T('P2 max panel count under 30 (' + mostPanels.id + ')', mostPanels.panels <= 30, mostPanels.panels + ' panels');
T('P2 total generated art under 2.5MB across playthrough', perf.reduce((a, p) => a + p.artBytes, 0) <= 2500000, perf.reduce((a, p) => a + p.artBytes, 0) + ' bytes');
// P3: non-vacuity guards - the audit must actually have exercised the surfaces it claims
T('P3 coverage: >=100 panels added across playthrough', stats.panels >= 100, 'panels: ' + stats.panels);
T('P3 coverage: >=90 panel refs validated', stats.refs >= 90, 'refs: ' + stats.refs);
T('P3 coverage: >=18 hotzones geometry-checked', stats.hotzones >= 18, 'hotzones: ' + stats.hotzones);
T('P3 coverage: >=2 choice surfaces validated (beats + showChoice)', stats.choiceBeats + choiceCalls.length >= 2, 'beats: ' + stats.choiceBeats + ', calls: ' + choiceCalls.length);
T('P3 coverage: >=40 string nexts resolved', stats.stringNexts >= 40, 'nexts: ' + stats.stringNexts);
T('P3 coverage: >=60 say/narr placements validated', (stats.says || 0) >= 60, 'says: ' + (stats.says || 0));
console.log('coverage:', JSON.stringify(stats), '| heaviest:', heaviest.id, heaviest.artBytes, 'bytes | most panels:', mostPanels.id, mostPanels.panels);
console.log(`\n${pass} passed, ${fail} failed (${scenes.length} scenes, ${choiceCalls.length} showChoice calls)`);
process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
