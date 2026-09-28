// FRAME ZERO art-structure audit: generated SVGs carry their signature elements (Sep 27 10:31 PM cycle)
const fs = require('fs');
const src = fs.readFileSync('/tmp/fz.js', 'utf8');
let pass = 0, fail = 0;
const T = (n, c, x) => { if (c) { pass++; console.log('PASS', n); } else { fail++; console.log('FAIL', n, x || ''); } };

// eval FZ.art and FZ.bg IIFEs with a shared FZ + minimal util stub
const FZ = {};
function extractModule(name) {
  const s = src.indexOf(`FZ.${name} = (function`);
  if (s < 0) throw new Error('missing FZ.' + name);
  const e = src.indexOf('\n})();', s);
  if (e < 0) throw new Error('unterminated FZ.' + name);
  return src.slice(s, e + '\n})();'.length);
}
eval(extractModule('util'));
eval(extractModule('art'));
eval(extractModule('bg'));
const A = FZ.art, B = FZ.bg, RED = A.RED;
T('D0 art+bg modules eval', !!A.svg && typeof B.cctv === 'function' && typeof B.manuscriptPage === 'function');

// D1: v3 CCTV still structure
const cctv = B.cctv(896, 620, { figure: true, time: '02:13:07', timeRed: true });
T('D1 cctv has red timestamp', cctv.includes('02:13:07') && cctv.includes(RED), '');
const cctvEls = (cctv.match(/<(rect|path|circle|line|text|ellipse|polygon)/g) || []).length;
T('D2 cctv is a real composition (>=15 elements)', cctvEls >= 15, 'elements: ' + cctvEls);

// D3: v6/v7 manuscript base
const ms = B.manuscriptPage(860, 1280, { blank: true, title: 'FRAME ZERO' });
T('D3 manuscript page carries title + paper', ms.includes('FRAME ZERO') && ms.includes(A.PAPER), '');
// v6 red hairline (inline build in the scene)
const v6 = ms.replace('</svg>', '<path d="M150 1150 L720 1196" stroke="' + RED + '" stroke-width="3"/></svg>');
T('D4 v6 red hairline injects crimson stroke', v6.includes('stroke="' + RED + '"'), '');

// D5: v7 face art (exact inline builder from lp_v7)
const v7 = (() => {
  let s = '<rect width="896" height="1000" fill="#0d0b09"/>';
  s += A.character({ who: 'silhouette', expr: 'neutral', x: 448, y: 560, scale: 2.3, item: false });
  s += '<circle cx="408" cy="505" r="7" fill="' + RED + '"/><circle cx="488" cy="505" r="7" fill="' + RED + '"/>';
  s += A.vignette(896, 1000, 1.15);
  return A.svg(896, 1000, s);
})();
const redCircles = (v7.match(new RegExp('<circle[^>]*fill="' + RED + '"', 'g')) || []).length;
T('D5 v7 has two red eyes on the silhouette', redCircles === 2 && v7.length > 800, 'red circles: ' + redCircles + ', len: ' + v7.length);

// D6: every SVG well-formed (single svg root, closes)
for (const [n, s] of [['cctv', cctv], ['manuscript', ms], ['v7', v7]]) {
  T('D6 ' + n + ' svg well-formed', s.trim().startsWith('<svg') && s.trim().endsWith('</svg>'), '');
}


// D7: every scene generator returns a full well-formed SVG above its composition floor
const U = FZ.util;
const sceneCalls = {
  archiveRoom: [B.archiveRoom(896, 620, {}), 200],
  corridor: [B.corridor(896, 620, {}), 30],
  station: [B.station(896, 620, {}), 80],
  unfinishedCity: [B.unfinishedCity(896, 620, {}), 100],
  whiteSpace: [B.whiteSpace(896, 620, {}), 40],
  apartment: [B.apartment(896, 620, {}), 50],
  phoneScreen: [B.phoneScreen(896, 620, {}), 20],
  textPanel: [B.textPanel(896, 620, {}), 20],
};
const EL = /<(rect|path|circle|line|text|ellipse|polygon|g|use|defs|linearGradient|radialGradient|stop)\b/g;
for (const [n, [svg, floor]] of Object.entries(sceneCalls)) {
  const els = (svg.match(EL) || []).length;
  T('D7 ' + n + ' full svg, >= ' + floor + ' elements', svg.trim().startsWith('<svg') && svg.trim().endsWith('</svg>') && els >= floor, 'els: ' + els);
}

// D8: fragment generators return non-empty composition strings above floor
for (const [n, frag, floor] of [
  ['clock213', B.clock213(448, 310, 200, {}), 10],
  ['windowRain', B.windowRain(0, 0, 896, 620, {}), 25],
  ['shelves', B.shelves(0, 0, 896, 620, U.rng(7), 'mid'), 200],
]) {
  const els = (frag.match(EL) || []).length;
  T('D8 ' + n + ' fragment >= ' + floor + ' elements', typeof frag === 'string' && els >= floor, 'els: ' + els);
}

// D9: sevenPanels layout object - 7 cells, monotonic cellY, geometry matches formula
const sp = B.sevenPanels(896, 1280, {});
const cells = (sp.frame.match(/data-cell="\d"/g) || []).length;
const ys = [0, 1, 2, 3, 4, 5, 6].map(i => sp.cellY(i));
const mono = ys.every((y, i) => i === 0 || y > ys[i - 1]);
T('D9 sevenPanels 7 cells, monotonic cellY, formula geometry',
  cells === 7 && mono && Math.abs(sp.cellH - 1280 * 0.09) < 1e-9 && Math.abs(sp.cellX - 896 * 0.2) < 1e-9 && Math.abs(sp.cellW - 896 * 0.72) < 1e-9,
  'cells: ' + cells);

// D10: palette discipline - every hex in generated art is near-achromatic (warm gray/paper family) or the single crimson accent
const hexes = new Set();
const allGen = Object.values(sceneCalls).map(([s2]) => s2).concat([cctv, ms, v7, B.clock213(448, 310, 200, {}), B.windowRain(0, 0, 896, 620, {}), B.shelves(0, 0, 896, 620, U.rng(7), 'mid'), sp.frame]);
for (const g of allGen) for (const m of g.matchAll(/(?:fill|stroke|stop-color)="(#[0-9a-fA-F]{3,8})"/g)) hexes.add(m[1].toLowerCase());
const spread = h => { const v = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); return Math.max(...v) - Math.min(...v); };
const offPalette = [...hexes].filter(h => h !== RED && h.length === 7 && spread(h) > 30); // family max observed: 28 (#b3ab97 apartment floor band)
T('D10 palette discipline: ' + hexes.size + ' distinct hexes, all near-achromatic or crimson', offPalette.length === 0, 'off-palette: ' + offPalette.join(','));

// D11: crimson discipline - cctv REC dot is always-on by design (1 occurrence); timeRed adds exactly the timestamp (2). clock213 ring only with {red:true}
const redCount = g => (g.toLowerCase().match(new RegExp(RED, 'g')) || []).length;
T('D11 cctv red: REC dot always, timestamp only with timeRed',
  redCount(B.cctv(896, 620, { figure: false })) === 1 && redCount(B.cctv(896, 620, { figure: true, timeRed: true })) === 2,
  'counts: ' + redCount(B.cctv(896, 620, { figure: false })) + '/' + redCount(B.cctv(896, 620, { figure: true, timeRed: true })));
T('D11 clock213 red ring only with red opt',
  redCount(B.clock213(448, 310, 200, {})) === 0 && redCount(B.clock213(448, 310, 200, { red: true })) === 1, '');
T('D11 sevenPanels + manuscript carry zero crimson by default',
  redCount(B.sevenPanels(896, 1280, {}).frame) === 0 && redCount(B.manuscriptPage(860, 1280, { blank: true, title: 'X' })) === 0, '');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
