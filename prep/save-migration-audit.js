// FRAME ZERO save-migration hardening audit (Sep 30 10:34 AM cycle)
// Synthesizes legacy/corrupt/tampered save shapes through the REAL Save.load + Settings.init
// + story.sceneAt resume path. Asserts: load never throws, resume always lands on a
// registered scene, and Settings values are always valid (volume finite [0,1] - a tampered
// string volume used to reach the Web Audio ramp as NaN and throw on first unmute).
const fs = require('fs');
(async () => {
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
let pass = 0, fail = 0; const fails = [];
const T = (n, c, x) => { if (c) pass++; else { fail++; fails.push(n + ' ' + (x || '')); console.log('FAIL', n, x || ''); } };

// ---- real util (loadSave/storeSave against stub localStorage) ----
let store = {};
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
let warnings = [];
console.warn = (...a) => warnings.push(a.join(' '));
const utilSrc = src.slice(src.indexOf('FZ.util = (function'), src.indexOf('\n})();', src.indexOf('FZ.util = (function')) + 7);
const SAVE_KEY = 'framezero.save.v1';
const bus = { emit() {} };
const navigatorStub = {};
global.navigator = { maxTouchPoints: 0 };
global.window = { matchMedia: () => ({ matches: false }) };
global.document = { body: { classList: { toggle() {} } }, getElementById: () => null, querySelectorAll: () => [] };
let FZ = {};
eval(utilSrc.replace('window.FZ.util', 'FZ.util'));
const U = FZ.util;
T('M0 real util module loaded', !!U && typeof U.clamp === 'function' && typeof U.loadSave === 'function');

// ---- real Save block ----
const saveBlock = src.slice(src.indexOf('const Save = {'), src.indexOf('/* ============ SETTINGS'));
const Save = eval('(' + saveBlock.slice(saveBlock.indexOf('{'), saveBlock.lastIndexOf('}') + 1) + ')');

// ---- real Settings block with recording audio ----
const audioCalls = [];
FZ.audio = { setMuted: m => audioCalls.push(['setMuted', m]), setVolume: v => audioCalls.push(['setVolume', v]) };
const Perf = { setMode() {}, get heavyFilters() { return true; } };
const settingsBlock = src.slice(src.indexOf('const Settings = {'), src.indexOf('/* ============ PERFORMANCE'));
const Settings = eval('(' + settingsBlock.slice(settingsBlock.indexOf('{'), settingsBlock.lastIndexOf('}') + 1) + ')');

// ---- real story module + real chapters (for the resume path) ----
const storySrc = src.slice(src.indexOf('FZ.story = (function'), src.indexOf('\n})();', src.indexOf('FZ.story = (function')) + 7);
eval(storySrc);
T('M0 real story module loaded', !!FZ.story && typeof FZ.story.sceneAt === 'function');
FZ.art = {}; FZ.bg = {}; // chapters only need the refs at eval time
eval(src.slice(src.indexOf('FZ.art = (function'), src.indexOf('\n})();', src.indexOf('FZ.art = (function')) + 7));
eval(src.slice(src.indexOf('FZ.bg = (function'), src.indexOf('\n})();', src.indexOf('FZ.bg = (function')) + 7));
FZ.ui = new Proxy({}, { get: () => () => {} });
const fnProxy = new Proxy({}, { get: () => () => {} });
FZ.engine = { Save, Settings, FX: fnProxy, Perf: { heavyFilters: true, tier: 'high' }, Engine: { register() {}, goto() {}, wait: () => Promise.resolve(), skipAll: false } };
FZ.audio = Object.assign(FZ.audio, { sfx: fnProxy, amb: fnProxy });
let scan = src.indexOf('FZ.ui = (function');
scan = src.indexOf('\n})();', scan) + 7;
while (true) {
  const start = src.indexOf('\n(function () {', scan);
  if (start < 0) break;
  const end = src.indexOf('\n})();', start);
  if (end < 0) break;
  const code = src.slice(start + 1, end + 7);
  scan = end + 7;
  if (code.includes('S.add({')) eval(code);
}
T('M0 chapters registered into real story', FZ.story.chapterSceneCount(1) === 11 && FZ.story.chapterSceneCount(6) === 9,
  'ch1:' + FZ.story.chapterSceneCount(1) + ' ch6:' + FZ.story.chapterSceneCount(6));

// ---- helpers ----
function loadShape(shape) {
  store = shape == null ? {} : { [SAVE_KEY]: typeof shape === 'string' ? shape : JSON.stringify(shape) };
  let threw = null;
  try { Save.load(); } catch (e) { threw = e; }
  return threw;
}
const VALID = {
  sound: v => typeof v === 'boolean',
  volume: v => typeof v === 'number' && isFinite(v) && v >= 0 && v <= 1,
  textSpeed: v => ['slow', 'normal', 'fast'].includes(v),
  perf: v => ['auto', 'low', 'high', 'cinematic'].includes(v),
  motion: v => ['full', 'reduced'].includes(v),
  captions: v => typeof v === 'boolean',
};
function checkSettings(tag) {
  audioCalls.length = 0;
  let threw = null;
  try { Settings.init(Save.data.settings); } catch (e) { threw = e; }
  T(`M2 [${tag}] Settings.init does not throw`, !threw, threw && threw.message);
  if (threw) return;
  for (const k in VALID) T(`M2 [${tag}] settings.${k} valid`, VALID[k](Settings.values[k]), JSON.stringify(Settings.values[k]));
  const volCalls = audioCalls.filter(c => c[0] === 'setVolume');
  T(`M2 [${tag}] setVolume received finite [0,1]`, volCalls.length >= 1 && volCalls.every(c => typeof c[1] === 'number' && isFinite(c[1]) && c[1] >= 0 && c[1] <= 1), JSON.stringify(volCalls));
}
function checkResume(tag) {
  const d = Save.data;
  T(`M3 [${tag}] ch in 1..6`, Number.isInteger(d.ch) && d.ch >= 1 && d.ch <= 6, String(d.ch));
  T(`M3 [${tag}] sceneIdx >= 0 integer`, Number.isInteger(d.sceneIdx) && d.sceneIdx >= 0, String(d.sceneIdx));
  const target = FZ.story.sceneAt(d.ch, d.sceneIdx) || 'ch1_s1';
  const counts = [1,2,3,4,5,6].map(c => FZ.story.chapterSceneCount(c));
  const registered = counts.reduce((a, n, i) => a + n, 0);
  let found = false;
  for (let c = 1; c <= 6; c++) for (let i = 0; i < FZ.story.chapterSceneCount(c); i++) if (FZ.story.sceneAt(c, i) === target) found = true;
  T(`M3 [${tag}] resume target is a registered scene (${target})`, found, 'registered total: ' + registered);
}

// ---- M1: load robustness across hostile shapes ----
const SHAPES = [
  ['fresh', null],
  ['corrupt-json', '{broken,,'],
  ['array', [1, 2, 3]],
  ['number', 42],
  ['legacy-no-v', { ch: 3, sceneIdx: 2, clues: { 'clock-213': 111 } }],
  ['v0', { v: 0, ch: 2, sceneIdx: 1 }],
  ['ch-too-big', { v: 1, ch: 99, sceneIdx: 0 }],
  ['ch-negative', { v: 1, ch: -3, sceneIdx: 0 }],
  ['ch-string', { v: 1, ch: 'six', sceneIdx: 0 }],
  ['sceneIdx-huge', { v: 1, ch: 2, sceneIdx: 999 }],
  ['sceneIdx-ch6-huge', { v: 1, ch: 6, sceneIdx: 99 }],
  ['unlockedCh-huge', { v: 1, unlockedCh: 9999 }],
  ['unlockedCh-negative', { v: 1, unlockedCh: -50 }],
  ['ending-garbage', { v: 1, ending: 'hack_the_planet' }],
  ['clues-array', { v: 1, clues: ['a', 'b'] }],
  ['fragments-number', { v: 1, fragments: 7 }],
  ['settings-string', { v: 1, settings: 'dark' }],
  ['volume-string', { v: 1, settings: { volume: 'loud' } }],
  ['volume-huge', { v: 1, settings: { volume: 1e308 } }],
  ['volume-negative', { v: 1, settings: { volume: -99 } }],
  ['volume-null', { v: 1, settings: { volume: null } }],
  ['sound-string', { v: 1, settings: { sound: 'yes' } }],
  ['motion-number', { v: 1, settings: { motion: 123 } }],
  ['textSpeed-garbage', { v: 1, settings: { textSpeed: 'ludicrous' } }],
  ['perf-garbage', { v: 1, settings: { perf: 'ultra' } }],
  ['captions-number', { v: 1, settings: { captions: 0 } }],
  ['proto-ending', { v: 1, ending: '__proto__' }],
  ['startedAt-string', { v: 1, startedAt: 'yesterday' }],
];
for (const [tag, shape] of SHAPES) {
  const threw = loadShape(shape);
  T(`M1 [${tag}] Save.load does not throw`, !threw, threw && threw.message);
  if (threw) continue;
  T(`M1 [${tag}] data shape sane`, Save.data && typeof Save.data.clues === 'object' && !Array.isArray(Save.data.clues)
    && typeof Save.data.endings === 'object' && typeof Save.data.fragments === 'object' && typeof Save.data.settings === 'object');
  checkSettings(tag);
  checkResume(tag);
}
// targeted value assertions
loadShape('volume-string'.includes('x') ? null : { v: 1, settings: { volume: 'loud' } }); Settings.init(Save.data.settings);
T('M4 tampered string volume falls back to default 0.8', Settings.values.volume === 0.8, String(Settings.values.volume));
loadShape({ v: 1, settings: { volume: 1e308 } }); Settings.init(Save.data.settings);
T('M4 huge volume clamped into [0,1]', Settings.values.volume >= 0 && Settings.values.volume <= 1, String(Settings.values.volume));
loadShape({ v: 1, settings: { volume: -99 } }); Settings.init(Save.data.settings);
T('M4 negative volume clamped/fallback valid', Settings.values.volume >= 0 && Settings.values.volume <= 1, String(Settings.values.volume));
loadShape({ v: 1, unlockedCh: 9999 });
T('M4 unlockedCh clamped to 5 (max legit write)', Save.data.unlockedCh === 5, String(Save.data.unlockedCh));
loadShape({ v: 1, ch: 99, sceneIdx: 0 });
T('M4 invalid ch falls back to 1', Save.data.ch === 1, String(Save.data.ch));
loadShape({ v: 1, ch: 2, sceneIdx: 999 });
T('M4 resume clamps sceneIdx into chapter bounds', FZ.story.sceneAt(Save.data.ch, Save.data.sceneIdx) === 'ch2_s10', FZ.story.sceneAt(Save.data.ch, Save.data.sceneIdx));
console.log(`\n${pass} passed, ${fail} failed (${SHAPES.length} hostile shapes)`);
process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
