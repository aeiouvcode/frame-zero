// FRAME ZERO Save-module logic tests (owner 18:36 rule: non-vacuous, asserted values).
// Run: node prep/save-tests.js  (expects /tmp/fz.js = extracted bundle script)
const fs = require('fs');
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
const loadSaveSrc = src.slice(src.indexOf('function loadSave()'), src.indexOf('function wipeSave'));
const storeSaveSrc = src.slice(src.indexOf('function storeSave'), src.indexOf('function wipeSave'));
const saveBlock = src.slice(src.indexOf('const Save = {'), src.indexOf('/* ============ SETTINGS'));
const saveLiteral = saveBlock.slice(saveBlock.indexOf('{'), saveBlock.lastIndexOf('}') + 1);
let store = {}, throwsOnSet = false;
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { if (throwsOnSet) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; } store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
const SAVE_KEY = 'framezero.save.v1';
let warnings = [];
console.warn = (...a) => warnings.push(a.join(' '));
eval(loadSaveSrc); eval(storeSaveSrc);
const U = { loadSave, storeSave, bus: { emit(){} } };
const Save = eval('(' + saveLiteral + ')');
let pass = 0, fail = 0;
function T(name, cond, extra) { if (cond) { pass++; console.log('PASS', name); } else { fail++; console.log('FAIL', name, extra || ''); } }
store = {}; Save.load();
T('T1 fresh defaults', Save.data.unlockedCh === 1 && Save.data.ch === 1 && Save.data.sceneIdx === 0 && typeof Save.data.fragments === 'object' && typeof Save.data.endings === 'object' && !('finished' in Save.data));
store = { [SAVE_KEY]: '{broken json,,' }; warnings = [];
Save.load();
T('T2 corrupt quarantined', typeof store[SAVE_KEY + '.corrupt'] === 'string' && !(SAVE_KEY in store) && Save.data.unlockedCh === 1 && warnings.some(w => w.includes('quarantined')));
store = { [SAVE_KEY]: JSON.stringify({ v: 1, unlockedCh: 9, ch: 99, sceneIdx: -4, clues: { 'clock-213': 123 }, ending: 'erase' }) };
Save.load();
T('T3 schema merge+clamp', Save.data.unlockedCh === 5 && Save.data.ch === 1 && Save.data.sceneIdx === 0 && Save.data.clues['clock-213'] === 123 && Save.data.ending === 'erase');
store = { [SAVE_KEY]: JSON.stringify([1,2,3]) };
Save.load();
T('T4 array save rejected', Save.data.unlockedCh === 1 && typeof Save.data.clues === 'object');
store = {}; Save.load(); throwsOnSet = true; warnings = [];
let threw = false;
try { Save.save({ ch: 2 }); } catch (e) { threw = true; }
T('T5 quota write loud-not-thrown', !threw && warnings.some(w => w.includes('save write failed')));
throwsOnSet = false;
store = {}; Save.load();
Save.data.fragments.v3 = Date.now(); Save.save(); Save.load();
T('T6 fragment persists', !!Save.data.fragments.v3 && Object.keys(Save.data.fragments).length === 1);
store = {}; Save.load();
Save.data.endings = { erase: 111 }; Save.save(); Save.load();
T('T7 endings persist', Save.data.endings.erase === 111);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
