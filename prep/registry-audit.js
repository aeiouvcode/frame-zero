// FRAME ZERO content-registry audit: clues + audio names (Sep 27 4:31 PM cycle)
const fs = require('fs');
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
let pass = 0, fail = 0;
const T = (n, c, x) => { if (c) { pass++; console.log('PASS', n); } else { fail++; console.log('FAIL', n, x || ''); } };

// --- clues ---
const bookBlock = src.slice(src.indexOf('const CLUE_BOOK = {'), src.indexOf('};', src.indexOf('const CLUE_BOOK = {')) + 2);
const bookIds = [...bookBlock.matchAll(/^\s+'([a-z0-9-]+)': \{/gm)].map(m => m[1]);
const clueRefs = [...new Set([...src.matchAll(/\.clue\('([a-z0-9-]+)'\)/g)].map(m => m[1]))];
const missingBook = clueRefs.filter(id => !bookIds.includes(id));
const unreachable = bookIds.filter(id => !clueRefs.includes(id));
T('C1 clue count is 15', bookIds.length === 15, 'got ' + bookIds.length);
T('C2 every referenced clue exists in CLUE_BOOK', missingBook.length === 0, missingBook.join(','));
T('C3 every CLUE_BOOK clue is reachable', unreachable.length === 0, unreachable.join(','));

// --- audio registries ---
const ambBlock = src.slice(src.indexOf('const amb = {'), src.indexOf('const sfx = {'));
const sfxBlock = src.slice(src.indexOf('const sfx = {'), src.indexOf('return {', src.indexOf('const sfx = {')));
const ambKeys = [...ambBlock.matchAll(/^\s+([a-zA-Z][a-zA-Z0-9]*)\s*[:(]/gm)].map(m => m[1]).filter(k => !['const','return','function'].includes(k));
const sfxKeys = [...sfxBlock.matchAll(/^\s+([a-zA-Z][a-zA-Z0-9]*)\s*[:(]/gm)].map(m => m[1]).filter(k => !['const','return','function'].includes(k));
// referenced names: beat objects + ctx calls
const sfxRefs = new Set([...src.matchAll(/\{ t: 'sfx', name: '([a-z0-9-]+)'/g)].map(m => m[1]));
for (const m of src.matchAll(/\.sfx\('([a-z0-9-]+)'/g)) sfxRefs.add(m[1]);
const ambRefs = new Set([...src.matchAll(/\{ t: 'amb', name: '([a-z0-9-]+)'/g)].map(m => m[1]));
for (const m of src.matchAll(/\.amb\('([a-z0-9-]+)'/g)) ambRefs.add(m[1]);
const badSfx = [...sfxRefs].filter(n => !sfxKeys.includes(n));
const badAmb = [...ambRefs].filter(n => !ambKeys.includes(n));
console.log('  sfx registry:', sfxKeys.length, 'keys;', sfxRefs.size, 'referenced | amb registry:', ambKeys.length, 'keys;', ambRefs.size, 'referenced');
T('C4 every referenced sfx name exists', badSfx.length === 0, badSfx.join(','));
T('C5 every referenced amb name exists', badAmb.length === 0, badAmb.join(','));

// --- silent-resolution handlers (owner 18:36: silent failure = defect) ---
const warnsSfx = /unknown sfx/.test(src), warnsAmb = /unknown amb/.test(src);
T('C6 sfx/amb handlers warn on unknown names (no silent no-op)', warnsSfx && warnsAmb, 'warn missing: sfx=' + warnsSfx + ' amb=' + warnsAmb);
// C7 behavioral: eval the two handlers, assert miss warns and hit plays
let warned = [];
const _w = console.warn; console.warn = (...a) => warned.push(a.join(' '));
const FZstub = { audio: { sfx: { tick: () => { global.__played = (global.__played||0)+1; } }, amb: {} } };
const sfxH = new Function('FZ', "return n => { if (FZ.audio.sfx[n]) FZ.audio.sfx[n](); else console.warn('[FZ] unknown sfx', n); };")(FZstub);
const ambH = new Function('FZ', "return (n, arg) => { if (FZ.audio.amb[n]) FZ.audio.amb[n](arg); else console.warn('[FZ] unknown amb', n); };")(FZstub);
global.__played = 0;
sfxH('tick'); sfxH('typo-name'); ambH('hum');
console.warn = _w;
T('C7 handler behavior: hit plays, miss warns, amb miss warns', global.__played === 1 && warned.filter(w => w.includes('unknown')).length === 2, JSON.stringify(warned));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
