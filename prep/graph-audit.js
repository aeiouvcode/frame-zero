// FRAME ZERO scene-graph integrity audit (logic-first cycle Sep 27 4:30 AM)
// Non-vacuous: asserted reachability/terminal sets. Run: node prep/graph-audit.js
const fs = require('fs');
const src = fs.readFileSync('/tmp/fz.js', 'utf8');

// 1. Extract S.add({ ... }); blocks via balanced-brace scan
const adds = [];
let i = -1;
while ((i = src.indexOf('S.add({', i + 1)) !== -1) {
  let d = 0, j = i + 6; // at '{'
  for (; j < src.length; j++) {
    const c = src[j];
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) break; }
  }
  adds.push(src.slice(i + 6, j + 1));
}

// 2. Eval each literal with stubs (deferred arrow bodies never execute)
const stubProxy = new Proxy(function(){}, { get: () => stubProxy, apply: () => '', call: () => '' });
const scenes = [];
for (const lit of adds) {
  try {
    const s = eval('(function(CH,LP_TITLE,CHAPTER_TITLES,A,B,S,U,E,INK,PAPER,RED,G1,G2,G3,FZ,FRAG_TITLES,lpRecovered){ return ' + lit + '; })')(
      'CH', 'LOST PAGES', {6:'LOST PAGES'}, stubProxy, stubProxy, stubProxy, stubProxy, stubProxy, '', '', '#a4161a', '', '', '', {engine:{Save:{data:{fragments:{},endings:{}}},Engine:{}}, ui:{}}, {}, () => 0);
    scenes.push(s);
  } catch (e) { console.log('EVAL-FAIL', lit.slice(0, 80), e.message); process.exit(1); }
}

let pass = 0, fail = 0;
const T = (n, c, x) => { if (c) { pass++; console.log('PASS', n); } else { fail++; console.log('FAIL', n, x || ''); } };

const byId = new Map(scenes.map(s => [s.id, s]));
T('A1 scene count', scenes.length >= 55, 'got ' + scenes.length);
T('A2 unique ids', byId.size === scenes.length, 'dup: ' + (scenes.length - byId.size));

// C1: next targets resolve (probe function-next across every ending)
const resolveNext = s => {
  if (!s.next) return [];
  if (typeof s.next === 'string') return [s.next];
  return ['erase', 'unfinished', 'publish'].map(e => s.next({ save: { ending: e } }));
};
const badNext = [];
for (const s of scenes) for (const t of resolveNext(s)) if (!byId.has(t)) badNext.push(s.id + '->' + t);
T('A3 all next resolve (incl. dynamic)', badNext.length === 0, badNext.join(','));

// C2: literal goto targets in bundle resolve (exclude dynamic/template)
const gotos = [...src.matchAll(/goto\('([a-z0-9_]+)'(?!\s*\+)/g)].map(m => m[1]);
const badGoto = [...new Set(gotos.filter(g => !byId.has(g)))];
T('A4 all literal goto targets resolve', badGoto.length === 0, badGoto.join(','));

// C3: reachability from chapter starts via next-chains + hub pattern + gotos
const first = {};
for (const s of scenes) if (!(s.ch in first)) first[s.ch] = s.id;
const reachable = new Set();
const queue = Object.values(first);
// hub choices: lp_hub -> lp_v1..v7 (dynamic opts); model explicitly
const edges = s => {
  const out = [];
  out.push(...resolveNext(s));
  if (s.id === 'lp_hub') out.push(...['lp_v1','lp_v2','lp_v3','lp_v4','lp_v5','lp_v6','lp_v7']);
  // literal gotos inside this scene's source
  const lit = adds[scenes.indexOf(s)];
  for (const m of lit.matchAll(/goto\('([a-z0-9_]+)'/g)) out.push(m[1]);
  // showChoice opts with literal ids that are scene ids
  for (const m of lit.matchAll(/id:\s*'([a-z0-9_]+)'/g)) if (byId.has(m[1])) out.push(m[1]);
  return out;
};
while (queue.length) {
  const id = queue.pop();
  if (reachable.has(id) || !byId.has(id)) continue;
  reachable.add(id);
  queue.push(...edges(byId.get(id)));
}
const orphans = scenes.filter(s => !reachable.has(s.id)).map(s => s.id);
T('A5 no orphan scenes', orphans.length === 0, orphans.join(','));

// C4: terminals (next null) are designed only
const terminals = scenes.filter(s => !s.next).map(s => s.id);
console.log('  terminals:', terminals.join(', '));
const designedTerminal = id => {
  const lit = adds[scenes.indexOf(byId.get(id))];
  return /showEndCard|showChoice|lp_coda|END|PAGE NOT FOUND/.test(lit);
};
const badTerm = terminals.filter(id => !designedTerminal(id));
T('A6 every terminal is designed (end card / choice loop / coda)', badTerm.length === 0, badTerm.join(','));

// C5: no next-cycles
let cyclic = [];
for (const s of scenes) {
  const seen = new Set(); let cur = s;
  while (cur && cur.next) {
    if (seen.has(cur.id)) { cyclic.push(s.id); break; }
    seen.add(cur.id); cur = byId.get(cur.next);
  }
}
T('A7 no next-cycles', cyclic.length === 0, cyclic.join(','));

// C6: lp fragments return to hub
const fragBack = ['lp_v1','lp_v2','lp_v3','lp_v4','lp_v5','lp_v6','lp_v7'].filter(id => byId.get(id).next !== 'lp_hub');
T('A8 all fragments return to hub', fragBack.length === 0, fragBack.join(','));

// C7: chapter scene counts asserted
const counts = {};
for (const s of scenes) counts[s.ch] = (counts[s.ch] || 0) + 1;
const designed = {1:11, 2:10, 3:9, 4:6, 5:10, 6:9};
T('A9 chapter counts match designed graph', JSON.stringify(counts) === JSON.stringify(designed), JSON.stringify(counts));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
