/* Information design library — core: grid and type scale, text, page frame, process flow, tree, anatomy.
   Plain JS, no dependencies. Every renderer is (data, ctx) -> SVG markup, drawn in GRID PX against
   the area it is given (ctx.W x ctx.H). Positions come from the column grid (ctx.G), sizes from the
   type scale (IDL.G.Z), row pitches from IDL.G.PITCH, rules from IDL.G.RULE — nowhere else.
   Content hangs from the top of the area; left-over height stays at the bottom. */
(function () {
const IDL = window.IDL = window.IDL || {};
const R = IDL.R = IDL.R || {};
const FONT = IDL.FONT = {
  g: "'Instrument Sans','Archivo','Helvetica Neue',sans-serif",
  t: "'Archivo','Helvetica Neue',sans-serif",
  m: "'JetBrains Mono',ui-monospace,Menlo,monospace",
  s: "'Instrument Serif',Georgia,serif"
};
IDL.theme = g => g === 'dark'
  ? { bg: '#0B0C0C', ink: '#F7F5F0', mute: '#A5A8A4', rule: '#3A3D3C', signal: '#FF3B00', field: '#161817', mark: '#E4FF3A' }
  : { bg: '#F7F5F0', ink: '#0B0C0C', mute: '#5C605E', rule: '#D6D4CE', signal: '#C42D00', field: '#EFEEE8', mark: '#E4FF3A' };
IDL.SIZES = { '1440': [1440, 900], '1920': [1920, 1080] };

/* ================= THE GRID AND THE SCALE — the one source of truth =================
   Units are drawn in GRID PX. The text column of a 1440 × 900 slide is 604 grid px wide:
   12 columns × 32 + 11 gutters × 20. One grid px = 1296 / 604 ≈ 2.146 slide px at 1440 × 900
   (the review page shows a 1440 slide at 0.467, so one grid px ≈ one screen px there).
   At 1920 × 1080 the grid px scales with the slide HEIGHT (× 1.2), so the vertical layout is
   identical and the 12 columns widen to fill the 16:9 column (32 → 38.2 px, gutter stays 20). */
const G = IDL.G = {
  REF: 604,                                   /* text column at 1440 × 900, grid px */
  COLS: 12, GUT: 20,                          /* column count and gutter */
  BASE: 8,                                    /* vertical base unit */
  PITCH: [32, 40, 48, 56, 64, 80],            /* the only row pitches */
  /* type scale: nothing is set outside it, and no item is larger than the title */
  Z: { label: 12, note: 14, body: 16, item: 20, title: 30, display: 48, key: 96 },   /* round 3: key capped at 96 = 2 × display */
  LH: { label: 16, note: 20, body: 24, item: 24, title: 40, display: 56 },
  RULE: { hair: 1, ink: 1.5 },                /* 1 hairline for structure, 1.5 ink for heads and feet */
  CAP: { g: 0.72, t: 0.686, m: 0.73 },        /* measured cap height / size: Instrument Sans, Archivo, JetBrains Mono */
  HEAD: { title: 48, rule: 64, deck: 88, anchor: 40, bottom: 24, top: 32 }, /* heading block, baselines from the frame top */
  LIFT: 6,                                    /* a label sits 6 above its line */
  CLEAR: 8,                                   /* arrowheads and labels stay 8 clear of what they meet */
  PLOT: 104,                                  /* one panel height for signal plots (15A, 15E); SITE.PLOT on the lecture page */
  INDENT: 52,                                 /* outline indent: 8 + 36 stub + 8 (02A) */
  /* ROUND 2 — the unit as it lives on the lecture page (measured from the site at 1440 × 900:
     _shared/lecture.css + 05-camera-ii). On the page, 1 unit px = 1 page px: the type scale above is a
     CONSTANT of the site (label 12 … key 128 px), never scaled with width. Only the column width changes.
     The body (16) = the site's .line.desc; the item (20) sits below the page lede (23.4). */
  SITE: {
    /* shared: the unit's own constants on the page (type does not scale with the page) */
    side: 264,                                            /* sidebar 0–264, 2 px ink border */
    gap: 48,                                              /* ONE fixed gap: lede baseline to the unit's top (good-01 ≈ 46) */
    pair: 48,                                             /* gap between two units stacked on one page */
    PLOT: 160,                                            /* signal plot height on the page column */
    /* per screen, measured from the live site (05-camera-ii, headless Chrome, computed styles) */
    '1440': { W: 1440, H: 900, bar: 854, x: 322, w: 1061, gut: 28.8,           /* content column 322–1383; gutter 2vw */
      title: { z: 59.4, base: 126.4, ls: -0.045 }, rule: { y: 150, w: 2 },     /* .pg-title h3 Archivo 400; 2 px ink border */
      lede: { z: 23.4, base: 193, lh: 30.42, ls: -0.015 }, bottom: 831 },     /* .step .line Archivo 400 / 1.3; foot of .pg-rows */
    '1920': { W: 1920, H: 1080, bar: 1034, x: 341, w: 1502, gut: 38.4,          /* content column 341–1843 (padding 4vw); gutter 2vw */
      title: { z: 71.28, base: 149.2, ls: -0.045 }, rule: { y: 178, w: 2 },
      lede: { z: 28.08, base: 228.7, lh: 36.5, ls: -0.015 }, bottom: 1006 }
  },
  /* COLOUR RULE: the signal marks the one thing that makes the unit's sentence true — one meaning per unit.
     The one documented exception is 16A/C/D, where development = signal across the three units (one class). */
};
G.cap = (z, f) => z * G.CAP[f || 'g'];
G.snap = v => Math.ceil(v / G.BASE - 1e-6) * G.BASE;
/* largest allowed pitch <= prefer at which n rows fit in `room`; the smallest pitch if none does */
G.pitch = (n, room, prefer) => { const ok = G.PITCH.filter(p => p <= (prefer || 80) && n * p <= room + 0.5); return ok.length ? ok[ok.length - 1] : G.PITCH[0]; };
/* the column grid for a column W grid px wide */
IDL.cols = (W, gut) => {
  gut = gut || G.GUT;
  const col = (W - (G.COLS - 1) * gut) / G.COLS, x = i => i * (col + gut), span = n => n * col + (n - 1) * gut;
  /* n equal parts: whole columns when 12 divides by n (2-up, 3-up, 4-up), else equal shares with the same gutter */
  const up = (n, from, of) => { from = from || 0; of = of || G.COLS; const s = of / n;
    if (Number.isInteger(s)) return { n, w: span(s), x: i => x(from + i * s) };
    const w = (span(of) - (n - 1) * gut) / n; return { n, w, x: i => x(from) + i * (w + gut) }; };
  const line = v => { for (let i = 0; i <= G.COLS; i++) if (x(i) >= v - 0.5) return x(i); return W; }; /* next column start at or after v */
  const end = v => { for (let i = 1; i <= G.COLS; i++) if (x(i) - gut >= v - 0.5) return x(i) - gut; return W; }; /* next column end at or after v */
  return { W, col, gut, x, span, up, line, end };
};

const LS = 0.08;
const cv = document.createElement('canvas').getContext('2d');
const r = IDL.r = n => Math.round(n * 10) / 10;
const esc = IDL.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
IDL.mw = (s, z) => { s = String(s); return s.length * z * 0.6 + Math.max(0, s.length - 1) * z * LS; };
IDL.gw = (s, z, w = 500, f = 'g') => { cv.font = w + ' ' + z + 'px ' + FONT[f]; return cv.measureText(String(s)).width; };
IDL.wrap = (s, maxW, z, f = 't', w = 400) => {
  const out = []; let line = '';
  String(s).split(/\s+/).forEach(word => {
    const t = line ? line + ' ' + word : word;
    if (line && IDL.gw(t, z, w, f) > maxW) { out.push(line); line = word; } else line = t;
  });
  if (line) out.push(line);
  return out;
};
/* same number of lines as a greedy wrap, but as even as possible: no one-word last line */
IDL.wrapBalanced = (s, maxW, z, f = 't', w = 400) => {
  const n = IDL.wrap(s, maxW, z, f, w).length; if (n < 2) return IDL.wrap(s, maxW, z, f, w);
  let lo = maxW / n, hi = maxW;
  for (let i = 0; i < 20; i++) { const mid = (lo + hi) / 2; if (IDL.wrap(s, mid, z, f, w).length > n) lo = mid; else hi = mid; }
  return IDL.wrap(s, hi, z, f, w);
};
/* widow control (round 2, replaces balancing for decks and body): a greedy wrap, then, if the last
   line is one word, the lines are re-wrapped a little narrower until it carries two — never more lines */
IDL.wrapPretty = (s, maxW, z, f = 't', w = 400) => {
  let out = IDL.wrap(s, maxW, z, f, w); const n = out.length;
  if (n < 2 || out[n - 1].split(' ').length > 1) return out;
  for (let mw = maxW - 4; mw > maxW * 0.6; mw -= 4) { const t = IDL.wrap(s, mw, z, f, w); if (t.length > n) break; if (t[t.length - 1].split(' ').length > 1) return t; }
  return out;
};
/* lines where the words from index `from` on are set in colour `hc` (a signal phrase inside a line of copy) */
IDL.linesMark = (x, y, arr, o, lh, from, hc) => { let k = 0;
  return arr.map((l, i) => { const ws = l.split(' '), a = ws.filter((_, j) => k + j < from).join(' '), b = ws.filter((_, j) => k + j >= from).join(' '); k += ws.length;
    if (!b) return tx(x, y + i * lh, a, o); if (!a) return tx(x, y + i * lh, b, Object.assign({}, o, { c: hc }));
    return tx(x, y + i * lh, a + ' ', o).replace('</text>', '<tspan fill="' + hc + '">' + esc(b) + '</tspan></text>'); }).join(''); };
/* text: o = {z, f:'g'|'t'|'m', w, a, c, mid, tab, up, ls} */
/* 30-09-2026: labels are set in capitals, but a term whose case carries meaning keeps it - a word with a
   capital after a small letter (sRGB, kB, iPad) is left as written; "SRGB" and "KB" are different things */
IDL.caps = s => String(s).split(/(\s+)/).map(w => /[a-z][A-Z]|_[A-Za-z]|\.[a-z]{2,4}\b|[a-z]\.[A-Z]/.test(w) ? w : w.toUpperCase()).join('');
/* file names and codes are written as they are typed too: 20260929_Cezanne_Paul_BK_0125, 2445_01.tif (30-09 review) */
const tx = IDL.tx = (x, y, s, o) => {
  const f = o.f || 'g', mono = f === 'm';
  let st = 'font-family:' + FONT[f] + ';font-size:' + r(o.z) + 'px;font-weight:' + (o.w || (mono ? 400 : 500));
  if (mono && o.ls !== 0) st += ';letter-spacing:' + LS + 'em';
  if (o.ls && !mono) st += ';letter-spacing:' + o.ls + 'em';
  if (f === 's') st += ';font-style:italic';
  if (o.tab) st += ';font-variant-numeric:tabular-nums';
  return '<text x="' + r(x) + '" y="' + r(y) + '" text-anchor="' + (o.a || 'start') + '"' + (o.mid ? ' dominant-baseline="central"' : '') +
    ' fill="' + o.c + '" style="' + st + '">' + esc(mono && o.up !== false ? IDL.caps(s) : s) + '</text>';
};
IDL.lines = (x, y, arr, o, lh) => arr.map((l, i) => tx(x, y + i * lh, l, o)).join('');
/* the mono label: 12 px, upper case, tracked, muted. Baseline at y. */
const label = IDL.label = (x, y, s, c, o) => tx(x, y, s, Object.assign({ f: 'm', z: G.Z.label, c: c.T.mute }, o || {}));
IDL.labelW = s => IDL.mw(s, G.Z.label);
const ln = IDL.ln = (x1, y1, x2, y2, c, w, dash) => '<line x1="' + r(x1) + '" y1="' + r(y1) + '" x2="' + r(x2) + '" y2="' + r(y2) + '" stroke="' + c + '" stroke-width="' + r(w) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
const pa = IDL.pa = (d, c, w) => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + r(w) + '" stroke-linejoin="miter"/>';
/* arrowhead, tip at (x,y), pointing right; length 6 strokes, width 4.4 strokes */
const arrow = IDL.arrow = (x, y, c, sw) => '<path d="M' + r(x - sw * 6) + ',' + r(y - sw * 2.2) + 'L' + r(x) + ',' + r(y) + 'L' + r(x - sw * 6) + ',' + r(y + sw * 2.2) + 'Z" fill="' + c + '"/>';
const clamp = IDL.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* 30-09-2026: three helpers Design defined inside its alternatives (07-alt01-04.js), moved here so
   idl-alts.js can use them: a rectangle, a circle, and the largest size <= z0 (down to 12, in 0.5
   steps) at which every string fits maxW. Nothing drawn before this date uses them. */
IDL.rect = (x, y, w, h, fill, stroke, sw) => '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h) + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + r(sw) + '"' : '') + '/>';
IDL.dot = (x, y, rr, fill, stroke, sw) => '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + r(rr) + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + r(sw) + '"' : '') + '/>';
IDL.fitZ = (strs, z0, maxW, f = 'g', w = 500) => { let z = z0; while (z > 12 && Math.max(...strs.map(s => f === 'm' ? IDL.mw(s, z) : IDL.gw(s, z, w, f))) > maxW) z -= 0.5; return z; };

/* ctx: one page's drawing context, in grid px.
   W, H: the component area. G: its column grid. The legacy sizes (u, P, S, Q, B, sw, hair) are the
   old slide-px roles converted to grid px, kept only so the variants not in the selection still draw. */
IDL.ctx = (W, H, k, T, step, q, gut) => {
  q = q || 1; const s = k / q;
  return { W, H, k, T, q, step: step == null ? Infinity : step, G: IDL.cols(W, gut),
    u: 8 * s, P: 48 * s, S: 32 * s, Q: 27 * s, B: 30 * s, sw: 2.5 * s, hair: Math.max(1, k) / q };
};
/* segmenting: items beyond the current step keep their place but are not drawn */
IDL.vis = (i, c, m) => i <= c.step ? m : '<g opacity="0">' + m + '</g>';

const unitOf = (spec, opt, c) => {
  const fn = opt.render || (opt.variant === 'B' && IDL.RB && IDL.RB[spec.kind]) || R[spec.kind];
  try { return fn(spec.data, c); } catch (e) { console.error(spec.kind, e); return ''; }
};

/* ---------- the unit on the LECTURE PAGE (rounds 2–3, the default) ----------
   A mock of the real page at 1440 × 900 or 1920 × 1080 (G.SITE[size], measured from the site): sidebar,
   page title, 2 px rule, lede, page bar. The unit has no title, deck or outline of its own; it hangs from
   the lede's last baseline + SITE.gap (top-anchored, always) and takes its natural height.
   opt.units = [{ spec, opt, from, cols }] puts several units on one page (the pairs for Batu):
   stacked when opt.stack === 'v' (SITE.pair apart), side by side on their own columns otherwise. */
/* round 4: the page factor s = page lede / 23.4 (1.0 at 1440, 1.2 at 1920: the site's own title and lede factor).
   The unit is drawn at s: every type size, the 8 base, pitches, gaps, the icon box and the ink stroke grow by s;
   the 1 px hairline stays 1 (non-scaling). The column grid stays the page's own column. */
IDL.site = size => { const P = Object.assign({}, G.SITE, G.SITE[size === '1920' ? '1920' : '1440']); P.s = P.lede.z / 23.4; P.gap = G.SITE.gap * P.s; P.pair = G.SITE.pair * P.s; return P; };
IDL.hairFix = m => m.replace(/stroke-width="1"/g, 'stroke-width="1" vector-effect="non-scaling-stroke"');
IDL.sitePage = (spec, opt) => {
  const P = IDL.site(opt.size), T = IDL.theme(opt.ground), pg = IDL.cols(P.w, P.gut), paper = opt.ground === 'dark' ? '#101312' : '#FFFFFF';
  const lede = spec.sentence ? IDL.wrapPretty(spec.sentence, P.w, P.lede.z, 't', 400) : [];
  const y0 = (lede.length ? P.lede.base + (lede.length - 1) * P.lede.lh : P.rule.y) + P.gap, room = P.bottom - y0;
  const units = opt.units || [{ spec, opt, from: 0, cols: 12 }];
  let s = '<rect x="0" y="0" width="' + (P.side - 2) + '" height="4000" fill="' + paper + '"/>' + ln(P.side - 1, 0, P.side - 1, 4000, T.ink, 2);
  s += tx(P.x, P.title.base, spec.title || '', { f: 't', w: 400, z: P.title.z, c: T.ink, ls: P.title.ls });
  s += ln(P.x, P.rule.y, P.x + P.w, P.rule.y, T.ink, P.rule.w);
  s += lede.map((l, i) => tx(P.x, P.lede.base + i * P.lede.lh, l, { f: 't', w: 400, z: P.lede.z, c: T.ink, ls: P.lede.ls })).join('');
  if (opt.grid) for (let i = 0; i < G.COLS; i++) s += '<rect x="' + r(P.x + pg.x(i)) + '" y="0" width="' + r(pg.col) + '" height="' + P.H + '" fill="rgba(255,59,0,.06)"/>';
  units.forEach(u => {
    const uo = Object.assign({}, opt, u.opt || {}), from = u.from || 0, n = u.cols || 12, W = pg.span(n), x = P.x + pg.x(from), k = P.s;
    const c = IDL.ctx(W / k, 4000, 1, T, (u.spec || spec).step, 1, P.gut / k); c.site = true; c.iconBox = uo.iconBox; c.room = room / k; c.pageTitle = spec.title; c.flags = uo.flags || {};
    s += '<g class="idl-comp" data-x="' + r(x) + '" data-s="' + k + '" transform="translate(' + r(x) + ',' + r(y0) + ') scale(' + k + ')">' + (k !== 1 ? IDL.hairFix(unitOf(u.spec || spec, uo, c)) : unitOf(u.spec || spec, uo, c)) + '</g>';
  });
  s += '<g class="idl-bar"><rect x="' + P.side + '" y="' + P.bar + '" width="' + (P.W - P.side) + '" height="' + (P.H - P.bar) + '" fill="' + paper + '"/>' + ln(P.side, P.bar + 1, P.W, P.bar + 1, T.ink, 2) + '</g>';
  return '<div class="idl-page" data-site="1" data-size="' + (opt.size === '1920' ? '1920' : '1440') + '" data-y0="' + y0 + '" data-stack="' + (opt.stack || '') + '" style="position:relative;width:' + P.W + 'px;height:' + P.H + 'px;background:' + T.bg + ';color:' + T.ink + ';overflow:hidden">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + P.W + '" height="' + P.H + '" viewBox="0 0 ' + P.W + ' ' + P.H + '" style="position:absolute;left:0;top:0;overflow:visible">' + s + '</svg></div>';
};
/* after the page is in the document: stack paired units, measure, and flag a page whose units run past
   the content area (the page is extended, the foot line drawn, the overrun printed). Returns the page height. */
IDL.settle = el => {
  const pg = el.querySelector('.idl-page'), svg = pg && pg.querySelector('svg'), gs = svg ? [...svg.querySelectorAll('.idl-comp')] : []; if (!gs.length) return 0;
  const P = IDL.site(pg.dataset.size), y0 = +pg.dataset.y0, room = P.bottom - y0;
  let y = 0, h = 0;
  gs.forEach(g => { const b = g.getBBox(), k = +g.dataset.s || 1, bh = (b.y + b.height) * k;   /* the bbox is in the unit's own (unscaled) units */
    if (pg.dataset.stack === 'v') { g.setAttribute('transform', 'translate(' + g.dataset.x + ',' + r(y0 + y) + ') scale(' + k + ')'); h = y + bh; y = G.snap(h + P.pair); }
    else h = Math.max(h, bh); });
  let H = P.H; const info = { h: Math.round(h), room: Math.round(room), fill: Math.round(h / room * 100), over: 0 };
  if (h > room + 0.5) {
    const over = h - room, bar = svg.querySelector('.idl-bar'); H = Math.ceil(P.H + over); info.over = Math.round(over);
    bar.setAttribute('transform', 'translate(0,' + r(over) + ')');
    const msg = 'Content area of a ' + P.H + ' px page ends here; the unit runs ' + Math.round(over) + ' px over', mw = IDL.labelW(msg);
    svg.insertAdjacentHTML('beforeend', ln(P.side, P.bottom, P.W, P.bottom, '#C42D00', 1, '6 4') + '<rect x="' + r(P.W - 24 - mw) + '" y="' + (P.bottom + 4) + '" width="' + r(mw + 16) + '" height="20" fill="#F7F5F0"/>' + tx(P.W - 16, P.bottom + 18, msg, { f: 'm', z: 12, c: '#C42D00', a: 'end' }));
  }
  svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + P.W + ' ' + H); pg.style.height = H + 'px'; pg.dataset.info = JSON.stringify(info);
  return H;
};

/* ---------- page frame (round 1): title, rule, deck, component area on a 16:10 slide ----------
   opt.site: the lecture page above (round 2 default). opt.head === false drops the title and deck.
   opt.fit: the frame height follows the content instead of the 16:10 slide. */
IDL.page = (spec, opt) => {
  if (opt.site) return IDL.sitePage(spec, opt);
  const [PW, PH] = IDL.SIZES[opt.size || '1440'], k = PH / 900, T = IDL.theme(opt.ground);
  const q = k * 1296 / G.REF, mx = 72 * k / q, FW = PW / q, FH = PH / q, W = FW - 2 * mx, Hd = G.HEAD;
  const head = opt.head !== false;
  const deck = head && spec.sentence ? IDL.wrapPretty(spec.sentence, W, G.Z.body, 't', 400) : [];
  const y0 = !head ? Hd.top : deck.length ? Hd.deck + (deck.length - 1) * G.LH.body + Hd.anchor : Hd.rule + Hd.anchor;
  const H = opt.fit ? 4000 : FH - y0 - Hd.bottom;
  const c = IDL.ctx(W, H, k, T, spec.step, q); c.iconBox = opt.iconBox;
  const svg = unitOf(spec, opt, c);
  let s = '';
  if (head) {
    s += tx(mx, Hd.title, spec.title || '', { z: G.Z.title, c: T.ink, ls: -0.01 });
    s += ln(mx, Hd.rule, mx + W, Hd.rule, T.ink, G.RULE.hair);
    s += deck.map((l, i) => tx(mx, Hd.deck + i * G.LH.body, l, { f: 't', w: 400, z: G.Z.body, c: T.ink })).join('');
  }
  if (opt.grid) s += IDL.gridOverlay(mx, W, FH, y0, c);
  s += '<g class="idl-comp" transform="translate(' + r(mx) + ',' + r(y0) + ')">' + svg + '</g>';
  return '<div class="idl-page" data-q="' + q + '" data-y0="' + y0 + '" style="position:relative;width:' + PW + 'px;height:' + PH + 'px;background:' + T.bg + ';color:' + T.ink + ';overflow:hidden">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + PW + '" height="' + PH + '" viewBox="0 0 ' + r(FW) + ' ' + r(FH) + '" style="position:absolute;left:0;top:0;overflow:visible">' + s + '</svg></div>';
};
/* after the page is in the document: make its height follow the content (opt.fit). Returns the new height in slide px. */
IDL.fitPage = el => {
  const pg = el.querySelector('.idl-page'), svg = pg && pg.querySelector('svg'), g = svg && svg.querySelector('.idl-comp'); if (!g) return 0;
  const q = +pg.dataset.q, y0 = +pg.dataset.y0, b = g.getBBox(), FH = Math.ceil(y0 + b.y + b.height + G.HEAD.bottom), PH = Math.round(FH * q);
  const vb = svg.getAttribute('viewBox').split(' '); vb[3] = FH; svg.setAttribute('viewBox', vb.join(' ')); svg.setAttribute('height', PH); pg.style.height = PH + 'px';
  return PH;
};
/* the grid, drawn: 12 columns, the 8 px base, the anchor line */
IDL.gridOverlay = (mx, W, FH, y0, c) => {
  const cg = c.G; let s = '';
  for (let i = 0; i < G.COLS; i++) s += '<rect x="' + r(mx + cg.x(i)) + '" y="0" width="' + r(cg.col) + '" height="' + r(FH) + '" fill="rgba(255,59,0,.07)"/>';
  for (let y = y0; y < FH; y += G.BASE) s += ln(mx, y, mx + W, y, 'rgba(255,59,0,.12)', 0.5);
  return s + ln(0, y0, mx * 2 + W, y0, 'rgba(255,59,0,.6)', 0.5);
};

const columnsOf = IDL.columnsOf = stages => {
  const n = Math.max(...stages.map(s => s.col)) + 1;
  return Array.from({ length: n }, (_, i) => stages.filter(s => s.col === i));
};

/* Lucide line icons, 24-unit grid. Used only where the icon names the device. */
IDL.ICONS = {
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18M17 7.5h4M17 16.5h4"/>',
  laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  drives: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  card: '<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 6v3M11 6v3M14 6v3"/>',
  /* 30-09-2026, his note ("tarayıcı için de bir ikona ihtiyacın var"): drawn on the same 24 grid and stroke as the set -
     a flatbed with its lid raised and the scan light; an enlarger - column, head, lens and the light falling on the easel */
  scanner: '<rect x="2" y="13" width="20" height="7" rx="2"/><path d="M3 13 19 6.5"/><path d="M6 16.5h12"/>',
  enlarger: '<path d="M3 21h18M18 21V3M15 6.5h3"/><rect x="5" y="4" width="10" height="5" rx="1"/><path d="M8.5 9v2h3V9"/><path d="M8.5 11 6 18h8l-2.5-7"/>'
};
/* an icon: box = the size of the name it labels, stroke = the connectors' stroke */
IDL.icon = (name, x, y, box, col) => { const sc = box / 24;
  return '<g transform="translate(' + r(x) + ',' + r(y) + ') scale(' + r(sc * 1000) / 1000 + ')" fill="none" stroke="' + col + '" stroke-width="' + r(G.RULE.ink / sc * 100) / 100 + '" stroke-linecap="round" stroke-linejoin="round">' + (IDL.ICONS[name] || '') + '</g>'; };

/* ---------- PROCESS FLOW ----------
   Stage columns on equal centres of the 12-column grid (4 stages: 3-column centres).
   Icon box = name size (20), 8 above the name. Tags: one column of 48 × 24 chips on a 32 pitch.
   Link labels 6 above their line and 8 clear of any vertical or arrowhead. */
R.flow = (d, c) => {
  const { W, T } = c, Z = G.Z, st = d.stages, cols = columnsOf(st), n = cols.length, sw = G.RULE.ink, CL = G.CLEAR;
  /* 01-10-2026, his word on Digital Workflow: "Formatları ayrı, işlem ve işleri ayrı olarak göster".
     A stage may carry `formats` as well as `tags`: the formats are the boxed chips, and the tags
     (tools, roles) are then set as plain words under them, so the two never read as one list. */
  const fmtsOf = s => s.formats || [], anyFmt = st.some(s => fmtsOf(s).length);
  const icons = d.icons !== false && st.some(s => s.icon), tagsOn = d.tags !== false, boxed = d.chipStyle !== 'text' && !anyFmt;
  const nz = Z.item, IS = c.iconBox || 32, capN = G.cap(nz), lz = Z.label;
  const tagsOf = s => tagsOn && s.tags ? s.tags : [];
  const chipW = Math.max(48, G.snap(Math.max(0, ...st.flatMap(s => (anyFmt ? fmtsOf(s) : tagsOf(s)).map(t => IDL.mw(t, lz)))) + 16)), chipH = 24, chipP = 32, lineP = 16;
  const nameTop = icons ? IS + 8 : 0;
  const tagsH = s => { const k = tagsOf(s).length; return !k ? 0 : boxed ? k * chipP - (chipP - chipH) : (k - 1) * lineP + G.cap(lz, 'm'); };
  const fmtH = s => { const k = fmtsOf(s).length; return k ? 14 + k * chipP - (chipP - chipH) : 0; };
  const bh = s => nameTop + capN + fmtH(s) + (tagsOf(s).length ? (boxed ? 14 : 16) + tagsH(s) : 6);
  const lead = icons ? IS / 2 : capN / 2;
  const grp = c.G.up(n), X = i => grp.x(i) + grp.w / 2;
  /* stacked stages share one stack pitch, so rows line up across columns */
  const SP = G.snap(Math.max(0, ...cols.filter(col => col.length > 1).flatMap(col => col.map(bh))) + 24);
  const off = col => col.map((_, i) => (i - (col.length - 1) / 2) * SP);
  const ay = Math.max(...cols.map(col => lead - off(col)[0]));
  const A = {}; let body = '';
  const nameW = s => IDL.gw(s.name, nz);
  cols.forEach((col, ci) => {
    const cx = X(ci), offs = off(col), hwCol = Math.max(...col.map(s => Math.max(nameW(s) / 2, icons ? IS / 2 : 0, fmtsOf(s).length ? chipW / 2 : 0, tagsOf(s).length ? (boxed ? chipW : Math.max(...tagsOf(s).map(t => IDL.mw(t, lz)))) / 2 : 0)));
    col.forEach((s, i) => {
      const top = ay + offs[i] - lead, colr = s.key ? T.signal : T.ink, mark = body;
      const half = icons ? IS / 2 : nameW(s) / 2;
      A[s.id] = { inX: cx - half - CL, outX: cx + half + CL, y: top + lead, bodyIn: cx - hwCol, bodyOut: cx + hwCol };
      if (icons) body += IDL.icon(s.icon, cx - IS / 2, top, IS, colr);
      const by = top + nameTop + capN;
      body += tx(cx, by, s.name, { z: nz, c: colr, a: 'middle' });
      let y = by;
      const chip = (t, colr) => '<rect x="' + r(cx - chipW / 2 + 0.5) + '" y="' + r(y + 0.5) + '" width="' + r(chipW - 1) + '" height="' + r(chipH - 1) + '" fill="none" stroke="' + colr + '" stroke-width="' + G.RULE.hair + '"/>' +
        tx(cx, y + chipH / 2 + G.cap(lz, 'm') / 2, t, { f: 'm', z: lz, c: T.ink, a: 'middle' });
      if (fmtsOf(s).length) { y += 14; fmtsOf(s).forEach(t => { body += chip(t, T.ink); y += chipP; }); y -= chipP - chipH; }
      y += boxed ? 14 : 16;
      tagsOf(s).forEach(t => {
        if (boxed) { body += '<rect x="' + r(cx - chipW / 2 + 0.5) + '" y="' + r(y + 0.5) + '" width="' + r(chipW - 1) + '" height="' + r(chipH - 1) + '" fill="none" stroke="' + T.mute + '" stroke-width="' + G.RULE.hair + '"/>' +
            tx(cx, y + chipH / 2 + G.cap(lz, 'm') / 2, t, { f: 'm', z: lz, c: T.ink, a: 'middle' }); y += chipP; }
        else { body += tx(cx, y + G.cap(lz, 'm'), t, { f: 'm', z: lz, c: anyFmt ? T.mute : T.ink, a: 'middle' }); y += lineP; }
      });
      body = mark + IDL.vis(ci, c, body.slice(mark.length));
    });
  });
  return IDL.route(st, d.links, A, c) + body;
};
/* links between adjacent columns: merge, split or direct. A[id] = { inX, outX, y, bodyIn?, bodyOut? }.
   Labels (mono 12, mute) sit 6 above their line and at least 8 clear of any vertical and of the arrowhead. */
IDL.route = (st, links, A, c) => {
  const { T } = c, sw = G.RULE.ink, CL = G.CLEAR, n = Math.max(...st.map(s => s.col)) + 1;
  const colOf = id => st.find(s => s.id === id).col, bIn = a => a.bodyIn != null ? a.bodyIn : a.inX, bOut = a => a.bodyOut != null ? a.bodyOut : a.outX;
  const lab = (x0, x1, y, s) => s ? label((x0 + x1) / 2, y - G.LIFT, s, c, { a: 'middle' }) : '';
  let out = '';
  for (let ci = 0; ci < n - 1; ci++) {
    const L = links.filter(l => colOf(l.from) === ci); if (!L.length) continue;
    const before = out, src = [...new Set(L.map(l => l.from))], tgt = [...new Set(L.map(l => l.to))];
    const same = L.every(l => l.label === L[0].label), lw = IDL.labelW(L[0].label || '');
    if (src.length > 1 && tgt.length === 1 && same) {
      const t = A[tgt[0]], b = t.inX, bodyOut = Math.max(...src.map(s => bOut(A[s])));
      const jx = Math.max(bodyOut + 2 * CL, b - lw - 4 * CL);
      src.forEach(s => out += pa('M' + r(A[s].outX) + ',' + r(A[s].y) + 'H' + r(jx) + 'V' + r(t.y), T.ink, sw));
      out += pa('M' + r(jx) + ',' + r(t.y) + 'H' + r(b - sw), T.ink, sw) + arrow(b, t.y, T.ink, sw) + lab(jx, b, t.y, L[0].label);
    } else if (src.length === 1 && tgt.length > 1 && same) {
      const s = A[src[0]], a = s.outX, bodyIn = Math.min(...tgt.map(t => bIn(A[t])));
      const jx = Math.min(bodyIn - 2 * CL, a + lw + 4 * CL);
      out += pa('M' + r(a) + ',' + r(s.y) + 'H' + r(jx), T.ink, sw) + lab(a, jx, s.y, L[0].label);
      tgt.forEach(t => out += pa('M' + r(jx) + ',' + r(s.y) + 'V' + r(A[t].y) + 'H' + r(A[t].inX - sw), T.ink, sw) + arrow(A[t].inX, A[t].y, T.ink, sw));
    } else {
      L.forEach(l => {
        const p = A[l.from], q = A[l.to], a = p.outX, b = q.inX, mx = (a + b) / 2, flat = Math.abs(p.y - q.y) < 1;
        out += pa(flat ? 'M' + r(a) + ',' + r(p.y) + 'H' + r(b - sw) : 'M' + r(a) + ',' + r(p.y) + 'H' + r(mx) + 'V' + r(q.y) + 'H' + r(b - sw), T.ink, sw) +
          arrow(b, q.y, T.ink, sw) + (flat ? lab(a, b, q.y, l.label) : lab(mx, b, q.y, l.label));
      });
    }
    out = before + IDL.vis(ci + 1, c, out.slice(before.length));
  }
  return out;
};

/* ---------- TREE ----------
   Horizontal (default): an indented outline. One node per row on one pitch (40 when it fits),
   a fixed two-column indent per level, connectors dropping from under each parent.
   Vertical ('v'): node-link, kept from the first version. */
R.tree = (d, c) => {
  const { W, H, T } = c, nodes = [];
  (function walk(n, dep, par) { const o = { name: n.name, dep, par, kids: [] }; nodes.push(o); if (par) par.kids.push(o); (n.children || []).forEach(ch => walk(ch, dep + 1, o)); })(d.root, 0, null);
  let cur = nodes[0]; if (d.path && cur.name === d.path[0]) { cur.hl = 1; d.path.slice(1).forEach(p => { cur = cur && cur.kids.find(k => k.name === p); if (cur) cur.hl = 1; }); }
  const col = o => o.hl ? T.signal : T.ink, sw = G.RULE.ink;
  if (d.orient === 'v') return treeV(d, c, nodes, col);
  /* round 2: each parent on its own row; indent 52 (8 + 36 stub + 8); folder names are literal strings: mono 16 as typed, the root bold */
  const z = G.Z.item, cap = G.cap(z, 'm'), p = G.pitch(nodes.length, H - cap, 48), X = dep => dep * G.INDENT;
  let ink = '', red = '', txt = '';
  nodes.forEach((o, i) => { o.y = cap + i * p; o.x = X(o.dep); });
  nodes.forEach(o => {
    txt += IDL.vis(o.dep, c, tx(o.x, o.y, o.name, { f: 'm', z, w: o.par ? 400 : 700, c: col(o), up: false, ls: 0 }));
    if (!o.par) return;
    const px = o.par.x + G.CLEAR, py = o.par.y + G.CLEAR, cy = o.y - cap / 2;
    const m = pa('M' + r(px) + ',' + r(py) + 'V' + r(cy) + 'H' + r(o.x - G.CLEAR), o.hl && o.par.hl ? T.signal : T.ink, sw);
    if (o.hl && o.par.hl) red += IDL.vis(o.dep, c, m); else ink += IDL.vis(o.dep, c, m);
  });
  return ink + red + txt;
};
const treeV = (d, c, nodes, col) => {
  const { W, H, T } = c, sw = G.RULE.ink, leaves = nodes.filter(o => !o.kids.length), D = Math.max(...nodes.map(o => o.dep));
  const place = o => { if (!o.kids.length) return; o.kids.forEach(place); o.pos = (o.kids[0].pos + o.kids[o.kids.length - 1].pos) / 2; };
  const z = G.Z.item, cap = G.cap(z), slot = W / leaves.length, rowG = 80;
  leaves.forEach((o, i) => o.pos = (i + 0.5) * slot); place(nodes[0]);
  const Y = dep => cap + dep * rowG;
  let out = '', txt = '';
  nodes.forEach(o => {
    txt += IDL.vis(o.dep, c, tx(o.pos, Y(o.dep), o.name, { z, c: col(o), a: 'middle' }));
    if (!o.kids.length) return;
    const y0 = Y(o.dep) + 8, y1 = Y(o.dep + 1) - cap - 8, ym = (y0 + y1) / 2;
    let q = ln(o.pos, y0, o.pos, ym, T.ink, sw) + ln(Math.min(o.pos, o.kids[0].pos), ym, Math.max(o.pos, o.kids[o.kids.length - 1].pos), ym, T.ink, sw);
    o.kids.forEach(k => { q += ln(k.pos, ym, k.pos, y1, T.ink, sw); if (o.hl && k.hl) q += pa('M' + r(o.pos) + ',' + r(y0) + 'V' + r(ym) + 'H' + r(k.pos) + 'V' + r(y1), T.signal, sw); });
    out += IDL.vis(o.dep + 1, c, q);
  });
  return out + txt;
};

/* ---------- ANATOMY OF A STRING ----------
   The string (a literal file name: mono) hangs from the top of the area, flush left.
   Every callout is left-anchored to its bracket; one that would run into its neighbour drops to a
   second tier 40 lower, placed so that no leader crosses a label. */
R.anat = (d, c) => {
  const { W, T } = c, Z = G.Z, sw = G.RULE.ink, text = d.parts.map(p => p.t).join(''), n = text.length;
  const z = n * 0.6 * Z.title <= W ? Z.title : Z.item, cw = z * 0.6, base = G.cap(z, 'm');
  let i0 = 0; const parts = d.parts.map(p => { const o = Object.assign({}, p, { x: i0 * cw, w: p.t.length * cw }); i0 += p.t.length; return o; });
  const lz = Z.item, nz = Z.label, by = base + 10, tier0 = by + 24, TIER = 40;
  const named = parts.filter(p => !p.sep).map(p => Object.assign(p, { lw: Math.max(IDL.gw(p.label, lz), IDL.labelW(p.note || '')) }));
  /* right to left: lowest tier that neither collides with a placed label nor covers a deeper leader */
  const placed = [];
  for (let i = named.length - 1; i >= 0; i--) {
    const p = named[i]; let t = 0;
    const bad = t => placed.some(o => (o.tier === t && p.x + p.lw + 16 > o.x) || (o.tier > t && o.x + 4 >= p.x && o.x + 4 <= p.x + p.lw + 8));
    while (bad(t)) t++;
    p.tier = t; placed.push(p);
  }
  let out = '';
  parts.forEach(p => out += tx(p.x, base, p.t, { f: 'm', z, c: p.sep ? T.mute : (p.key ? T.signal : T.ink), up: false, w: 400, ls: 0 }));
  named.forEach((p, i) => {
    const colr = p.key ? T.signal : T.ink, top = tier0 + p.tier * TIER, m0 = out;
    out += pa('M' + r(p.x + 4) + ',' + r(by - 8) + 'V' + r(by) + 'H' + r(p.x + p.w - 4) + 'V' + r(by - 8), colr, sw);
    out += ln(p.x + 4, by, p.x + 4, top - 8, colr, G.RULE.hair);
    out += tx(p.x, top + G.cap(lz), p.label, { z: lz, c: colr });
    if (p.note) out += label(p.x, top + G.cap(lz) + 20, p.note, c);
    out = m0 + IDL.vis(i, c, out.slice(m0.length));
  });
  return out;
};
})();
