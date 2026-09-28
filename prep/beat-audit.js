// FRAME ZERO beat-handler coverage + coda-gate logic tests (Sep 27 10:30 cycle)
const fs = require('fs');
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
const adds = [];
let i = -1;
while ((i = src.indexOf('S.add({', i + 1)) !== -1) {
  let d = 0, j = i + 6;
  for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}') { d--; if (!d) break; } }
  adds.push(src.slice(i + 6, j + 1));
}
const stubProxy = new Proxy(function(){}, { get: () => stubProxy, apply: () => '', call: () => '' });
// controllable FZ stub (the lp_hub arrow closes over this reference)
const captured = { gotos: [], saves: 0, choices: 0 };
const FZ = {
  engine: {
    Save: { data: { fragments: {}, endings: {} }, save: () => { captured.saves++; } },
    Engine: { goto: id => { captured.gotos.push(id); } }
  },
  ui: { showChoice: async () => { captured.choices++; return 'v7'; } }
};
const scenes = [];
for (const lit of adds) {
  const s = eval('(function(CH,LP_TITLE,CHAPTER_TITLES,A,B,S,U,E,INK,PAPER,RED,G1,G2,G3,FZ,FRAG_TITLES,lpRecovered){ return ' + lit + '; })')(
    'CH', 'LOST PAGES', {6:'LOST PAGES'}, stubProxy, stubProxy, stubProxy, stubProxy, stubProxy, '', '', '#a4161a', '', '', '', FZ, {}, () => 0);
  scenes.push(s);
}
let pass = 0, fail = 0;
const T = (n, c, x) => { if (c) { pass++; console.log('PASS', n); } else { fail++; console.log('FAIL', n, x || ''); } };

// B1: every object-beat type is engine-handled
const HANDLED = new Set(['cam','camSnap','show','hide','say','narr','clearDlg','sfx','amb','particles','wait','tap','anim','unanim','art','ptransform','fx','clue','fn','title','choice','corrupt','ui']);
const used = new Map(); let fnBeats = 0;
for (const s of scenes) for (const b of s.beats) {
  if (typeof b === 'function') { fnBeats++; continue; }
  used.set(b.t, (used.get(b.t) || 0) + 1);
}
const unhandled = [...used.keys()].filter(t => !HANDLED.has(t));
T('B1 every beat type handled', unhandled.length === 0, unhandled.join(','));
console.log('  types:', [...used.entries()].map(([t,n]) => t + ':' + n).join(' '), '| fn beats:', fnBeats);

// B2: field shapes for structural beats
const bad = [];
for (const s of scenes) for (const b of s.beats) {
  if (typeof b === 'function') continue;
  if (b.t === 'show' && typeof b.panel !== 'string') bad.push(s.id + ' show missing panel');
  if (b.t === 'sfx' && typeof b.name !== 'string') bad.push(s.id + ' sfx missing name');
  if (b.t === 'wait' && typeof b.ms !== 'number') bad.push(s.id + ' wait missing ms');
  if ((b.t === 'narr' || b.t === 'say') && typeof b.text !== 'string') bad.push(s.id + ' ' + b.t + ' missing text');
}
T('B2 beat field shapes valid', bad.length === 0, bad.slice(0,3).join(';'));

// B3: show/hide panel refs resolve to addPanel ids (static scan)
const added = new Set([...src.matchAll(/addPanel\(\{ id: '([a-z0-9_]+)'/g)].map(m => m[1]));
// computed ids: addPanel({ id: 'mk' + i, ...}) inside the ch4 7-version loop -> mk0..mk6
if (/addPanel\(\{ id: 'mk' \+ i/.test(src)) for (let k = 0; k <= 6; k++) added.add('mk' + k);
const refs = new Set([...src.matchAll(/\{ t: '(?:show|hide|anim)', panel: '([a-z0-9_]+)'/g)].map(m => m[1]));
const missing = [...refs].filter(r => !added.has(r));
T('B3 all show/hide panel refs have addPanel', missing.length === 0, missing.join(','));

// B4-B6: coda gate (real lp_hub fn beat, controlled stubs)
const hub = scenes.find(s => s.id === 'lp_hub');
const gate = hub.beats.filter(b => typeof b === 'function').pop(); // the coda gate is lp_hub's LAST fn beat
(async () => {
  captured.gotos = []; captured.saves = 0; captured.choices = 0;
  FZ.engine.Save.data = { fragments: {v1:1,v2:1,v3:1,v4:1,v5:1,v6:1}, endings: {erase:1} };
  await gate(stubProxy);
  T('B4 six fragments -> choice loop, no coda', captured.choices === 1 && captured.gotos[0] === 'lp_v7' && !FZ.engine.Save.data.codaSeen, JSON.stringify(captured));

  captured.gotos = []; captured.saves = 0; captured.choices = 0;
  FZ.engine.Save.data = { fragments: {v1:1,v2:1,v3:1,v4:1,v5:1,v6:1,v7:1}, endings: {erase:1} };
  await gate(stubProxy);
  T('B5 seven fragments -> coda once, saved', captured.choices === 0 && captured.gotos[0] === 'lp_coda' && !!FZ.engine.Save.data.codaSeen && captured.saves === 1, JSON.stringify(captured));

  captured.gotos = []; captured.saves = 0; captured.choices = 0;
  FZ.engine.Save.data = { fragments: {v1:1,v2:1,v3:1,v4:1,v5:1,v6:1,v7:1}, endings: {erase:1}, codaSeen: 123 };
  await gate(stubProxy);
  T('B6 coda seen -> back to choice loop', captured.choices === 1 && captured.gotos[0] === 'lp_v7', JSON.stringify(captured));

  captured.gotos = []; captured.saves = 0; captured.choices = 0;
  let offered = null;
  FZ.ui.showChoice = async (p, opts) => { captured.choices++; offered = opts; return 'coda'; };
  FZ.engine.Save.data = { fragments: {v1:1,v2:1,v3:1,v4:1,v5:1,v6:1,v7:1}, endings: {erase:1}, codaSeen: 123 };
  await gate(stubProxy);
  T('B7 coda replay option offered and routes', offered && offered.length === 8 && offered[7].id === 'coda' && captured.gotos[0] === 'lp_coda', JSON.stringify({n: offered && offered.length, goto: captured.gotos[0]}));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
