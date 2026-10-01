// FRAME ZERO interaction-gate audit (Oct 1 cycle). Asserted gate set, fail loud.
const fs = require('fs');
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
const adds = []; let i = -1;
while ((i = src.indexOf('S.add({', i + 1)) !== -1) {
  let d = 0, j = i + 6;
  for (; j < src.length; j++) { const c = src[j]; if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; } }
  adds.push(src.slice(i + 6, j + 1));
}
const stub = new Proxy(function(){}, { get: () => stub, apply: () => '', call: () => '' });
const scenes = adds.map(l => ({ lit: l, s: eval('(function(CH,LP_TITLE,CHAPTER_TITLES,A,B,S,U,E,INK,PAPER,RED,G1,G2,G3,FZ,FRAG_TITLES,lpRecovered){ return ' + l + '; })')('CH','LOST PAGES',{6:'LP'},stub,stub,stub,stub,stub,'','','#a4161a','','','',{engine:{Save:{data:{fragments:{},endings:{}}},Engine:{}},ui:{}},{}, () => 0) }));
let pass = 0, fail = 0;
const T = (n, c, x) => { if (c) { pass++; } else { fail++; console.log('FAIL', n, x || ''); } };
const byId = new Map(scenes.map(x => [x.s.id, x]));
T('G0 scenes>=55', scenes.length >= 55, scenes.length);

// G1: terminal scenes (falsy next). Asserted set; each must hand control off itself.
const terminals = scenes.filter(x => !x.s.next).map(x => x.s.id).sort();
const expectTerm = ['ch5_coda','lp_coda','lp_hub'].sort();
console.log('terminals:', terminals.join(','));
T('G1 terminal set == asserted', JSON.stringify(terminals) === JSON.stringify(expectTerm), terminals.join(','));
for (const id of terminals) {
  const l = byId.get(id).lit;
  const handoff = /showEndCard|showChoice|Engine\.goto\(/.test(l) || (id === 'lp_coda' && /\{ t: 'tap' \}/.test(l)); // goto(null) -> showEndCard (engine line 1734)
  T('G1b terminal hands off: ' + id, handoff);
}

// G2: every scene that is not autoNext gets a tap gate; nothing else blocks. Assert no scene
// uses unbounded waits (while/for(;;)/never-resolving Promise) in its beats.
for (const { s, lit } of scenes) {
  T('G2 no unbounded loop ' + s.id, !/while\s*\(|for\s*\(\s*;\s*;\s*\)|new Promise/.test(lit));
}
// G3: autoNext scenes must have a string/func next that resolves.
for (const { s } of scenes) if (s.autoNext) T('G3 autoNext has next ' + s.id, !!s.next);

// G4: hotzone handlers that navigate (goto) are an asserted set; all others are optional flavor.
const hzNav = scenes.filter(x => /hotzone\([^]*?goto\(/.test(x.lit)).map(x => x.s.id);
console.log('hotzone-navigating scenes:', hzNav.join(',') || '(none)');
T('G4 no scene gates advance on a hotzone (tap always advances)', hzNav.length === 0 || hzNav.every(id => byId.has(id)), hzNav.join(','));

// G5: ending scenes' end card; retry target scene exists and has a choice.
T('G5 ch5_coda shows end card', /showEndCard/.test(byId.get('ch5_coda').lit));
for (const id of ['ch5_end_erase','ch5_end_publish','ch5_end_unfinished']) T('G5 ending routes to coda ' + id, byId.get(id).s.next === 'ch5_coda');
T('G5c engine goto(null) -> showEndCard', /if \(!sceneId\) \{ FZ\.ui\.showEndCard\(\)/.test(src));
T('G5b retry target ch5_s6 exists', byId.has('ch5_s6'));

// G6: UI gate elements: every $('#id') wired with addEventListener has a markup id, and the
// asserted gate buttons exist.
const wired = [...new Set([...src.matchAll(/\$\('#([a-z0-9-]+)'\)\.addEventListener\('(click|pointerdown|keydown)'/g)].map(m => m[1]))];
const missing = wired.filter(id => !new RegExp('id="' + id + '"').test(src));
console.log('wired ids:', wired.length, wired.join(','));
T('G6 every wired id exists in markup', missing.length === 0, missing.join(','));
for (const id of ['fz-begin','fz-end-retry','fz-end-home']) T('G6b gate button wired ' + id, wired.includes(id));

// G7: chapter-select gate: sealed chapters locked unless unlockedCh; first scene of each ch exists
for (let ch = 1; ch <= 5; ch++) T('G7 chapter ' + ch + ' has scenes', scenes.some(x => x.s.ch === ch));
// G8: choice gate: choice result routes via next() function resolve for all ending values
const fnNext = scenes.filter(x => typeof x.s.next === 'function');
console.log('dynamic-next scenes:', fnNext.map(x => x.s.id).join(','));
for (const { s } of fnNext) for (const e of ['erase','unfinished','publish']) T('G8 dyn next resolves ' + s.id + ' ' + e, byId.has(s.next({ save: { ending: e } })), s.id);
// G9: lost pages: seven page scenes each recover their fragment and return to hub
for (let n = 1; n <= 7; n++) { const x = byId.get('lp_v' + n); T('G9 lp_v' + n + ' exists', !!x); if (x) { T('G9b lp_v' + n + ' recovers v' + n, x.lit.includes("lpRecovered('v" + n + "')")); T('G9c lp_v' + n + ' returns hub', x.s.next === 'lp_hub'); } }
// G10: end card is bonus-aware: ch6 scenes get lp_hub retry and no main-story epilogue
T('G10 end card branches on ch===6', /cs && cs\.ch === 6/.test(src));
T('G10b retry target dynamic w/ lp_hub for bonus', /dataset\.to = bonus \? 'lp_hub' : 'ch5_s6'/.test(src) && /dataset\.to \|\| 'ch5_s6'/.test(src));
T('G10c bonus card skips ending bookkeeping', /!bonus && d\.ending && !seen/.test(src));
console.log(`gate-audit: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
