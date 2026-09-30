// FRAME ZERO hotzone functional audit (Sep 29 10:34 PM cycle)
// Geometry is already pinned (playthrough). This drives every hotzone's onTap/onHold with a
// synthetic event and asserts the handler produces >=1 observable effect: audio, classList op,
// setArt, clue, toast, caption, fx, particles, goto. Effect vocabulary catalogued from source:
// FZ.audio.sfx/amb.*, panel el classList, c.setArt, c.clue + clueToast, FZ.ui.caption, c.fx.*.
// Handlers with closure guards (mk-tap tapped-set, clock taps counter) are first-activation only.
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
const scenes = []; const sceneIds = new Set();
const FZ = {};
eval(extractModule('util'));
eval(extractModule('art'));
eval(extractModule('bg'));
const fnProxy = new Proxy({}, { get: () => () => {} });
const saveData = { v: 1, unlockedCh: 6, ch: 1, sceneIdx: 0, clues: {}, endings: {}, fragments: {}, settings: {}, ending: null, startedAt: 0 };
let REC = { fx: [] }; // active effect recorder

function makeUniversal(panelId) {
  // callable proxy: any method chain works; classList ops are recorded
  const cls = {
    add: (...a) => REC.fx.push(`cls+ ${panelId} ${a.join(',')}`),
    remove: (...a) => REC.fx.push(`cls- ${panelId} ${a.join(',')}`),
    toggle: (...a) => REC.fx.push(`cls~ ${panelId} ${a.join(',')}`),
    contains: () => false,
  };
  const handler = {
    get(t, k) {
      if (k === 'classList') return cls;
      if (k === 'style') return {};
      if (k === 'offsetWidth' || k === 'offsetHeight') return 100;
      if (k === 'innerHTML' || k === 'textContent' || k === 'value') return '';
      if (k === 'dataset') return {};
      if (k === Symbol.toPrimitive) return () => 0;
      return prox;
    },
    set() { return true; },
    apply() { return prox; },
  };
  const prox = new Proxy(function () {}, handler);
  return prox;
}
FZ.ui = {
  caption: t => REC.fx.push('caption ' + String(t).slice(0, 24)),
  showNextHint() {}, clueToast: id => REC.fx.push('clueToast ' + id),
  setProgress() {}, setChapterLabel() {}, closeOverlays() {}, showEndCard: () => REC.fx.push('endCard'),
  showChoice: (prompt, options) => Promise.resolve(options[options.length - 1].id),
};
FZ.engine = {
  Save: { data: saveData, save() {}, addClue: id => { saveData.clues[id] = true; REC.fx.push('addClue ' + id); return true; }, hasClue: id => !!saveData.clues[id] },
  Engine: { goto: id => REC.fx.push('goto ' + id), wait: () => Promise.resolve(), skipAll: false },
  FX: new Proxy({}, { get: (t, k) => () => REC.fx.push('fx ' + String(k)) }),
  Perf: { heavyFilters: false, tier: 'high' },
};
const audioRec = kind => new Proxy({}, { get: (t, k) => () => REC.fx.push(`audio ${kind}.${String(k)}`) });
FZ.audio = new Proxy({ sfx: audioRec('sfx'), amb: audioRec('amb') }, { get: (t, k) => (k in t ? t[k] : () => REC.fx.push('audio ' + String(k))) });
FZ.story = {
  add(scene) { scenes.push(scene); sceneIds.add(scene.id); },
  sceneAt(ch, idx) { const a = scenes.filter(s => s.ch === ch); return a.length ? a[Math.min(idx, a.length - 1)].id : null; },
  chapterSceneCount(ch) { return scenes.filter(s => s.ch === ch).length; },
};
global.document = {
  getElementById: () => makeUniversal('doc'),
  createElement: () => makeUniversal('new'),
  createElementNS: () => makeUniversal('ns'),
  querySelector: () => makeUniversal('q'),
  querySelectorAll: () => [],
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
  const panelStub = id => ({ el: makeUniversal(id), setArt(s) { if (typeof s === 'string') rec.fx.push('panel.setArt ' + id); } });
  return {
    scene, data: {},
    addPanel: o => panelStub(o.id),
    panel: id => panelStub(id),
    show() {}, hide() {},
    setArt: (p, s) => { if (typeof s === 'string') rec.fx.push('setArt ' + p); },
    transform() {},
    say() {}, narr() {}, clearDialogue() {},
    cam() { return Promise.resolve(); }, camSnap() {},
    sfx: n => rec.fx.push('sfx ' + n), amb: n => rec.fx.push('amb ' + n),
    particles: m => rec.fx.push('particles ' + m),
    fx: new Proxy({}, { get: (t, k) => () => rec.fx.push('ctx.fx ' + String(k)) }),
    hotzone: o => rec.hotzones.push(o),
    clue: id => { rec.fx.push('clue ' + id); return true; }, hasClue: () => false,
    wait: () => Promise.resolve(), tap: () => Promise.resolve(),
    audio: FZ.audio, save: saveData,
    page: { classList: { toggle() {}, add() {}, remove() {} }, style: {} },
    ui: FZ.ui,
  };
}

// ---- run every scene, collect hotzones, drive their handlers ----
let totalHz = 0, totalActivations = 0, totalEffects = 0;
const ev = { clientX: 400, clientY: 700, preventDefault() {}, stopPropagation() {} };
for (const scene of scenes) {
  const rec = { fx: [], hotzones: [] };
  const ctx = makeCtx(scene, rec);
  REC = rec;
  const errs = [];
  try { if (scene.enter) await scene.enter(ctx); } catch (e) { errs.push('enter: ' + e.message); }
  for (const b of scene.beats || []) {
    if (typeof b === 'function') { try { await b(ctx); } catch (e) { errs.push('beat: ' + e.message); } }
  }
  for (const h of rec.hotzones) {
    totalHz++;
    for (const kind of ['onTap', 'onHold']) {
      const handler = h[kind];
      if (typeof handler !== 'function') continue;
      totalActivations++;
      const before = rec.fx.length;
      try {
        await handler(ev);
        await new Promise(r => setTimeout(r, 0)); // flush microtasks/immediate timeouts
      } catch (e) {
        T(`H1 ${scene.id}/${h.id} ${kind} runs without throwing`, false, e.message);
        continue;
      }
      T(`H1 ${scene.id}/${h.id} ${kind} runs without throwing`, true);
      const effects = rec.fx.length - before;
      totalEffects += effects;
      T(`H2 ${scene.id}/${h.id} ${kind} produces >=1 observable effect`, effects >= 1, '0 effects');
    }
  }
  T('H0 ' + scene.id + ' setup clean', errs.length === 0, errs[0] || '');
}
// non-vacuity
T('H3 coverage: >=26 hotzones driven', totalHz >= 26, 'hotzones: ' + totalHz);
T('H3 coverage: >=27 handler activations', totalActivations >= 27, 'activations: ' + totalActivations);
T('H3 coverage: >=30 observable effects recorded', totalEffects >= 30, 'effects: ' + totalEffects);
console.log('hotzones:', totalHz, '| activations:', totalActivations, '| effects:', totalEffects);
console.log(`\n${pass} passed, ${fail} failed (${scenes.length} scenes)`);
process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
