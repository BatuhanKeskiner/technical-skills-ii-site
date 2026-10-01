/* Week 5 visuals: analog/digital signal, and negative strips. Same page frame, grid and scale as the library. */
(function () {
const IDL = window.IDL, R = IDL.R, G = IDL.G, Z = G.Z, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis, label = IDL.label;
const HAIR = G.RULE.hair, INK = G.RULE.ink;

/* ---------- SIGNAL: analog → sampling → quantisation, one identical curve ----------
   3-up (188 / 20). Every panel: a head label, one plot height (G.PLOT), a baseline rule, name 20, line 16/24. */
R.signal = (d, c) => {
  const { T } = c, n = d.samples || 12, L = d.levels || 8, C = c.G.up(3);
  const f = d.curve || (t => 0.5 + 0.3 * Math.sin(2 * Math.PI * (t * 1.3 + 0.07)) + 0.12 * Math.sin(2 * Math.PI * (t * 3.1 + 0.18)));
  const heads = ['Continuous', n + ' samples', L + ' levels'], capL = G.cap(Z.label, 'm');
  const top = 24, ph = c.site ? G.SITE.PLOT : G.PLOT, nameB = top + ph + 24 + G.cap(Z.item), lineB = nameB + 24;
  const q = v => Math.round(v * (L - 1)) / (L - 1);
  let out = '';
  d.panels.forEach((p, i) => {
    const x0 = C.x(i), X = t => x0 + t * C.w, Y = v => top + ph - v * ph;
    const curve = col => pa('M' + Array.from({ length: 121 }, (_, s) => r(X(s / 120)) + ',' + r(Y(f(s / 120)))).join('L'), col, INK);
    const ts = Array.from({ length: n }, (_, s) => (s + 0.5) / n);
    let g = label(x0, capL, heads[i], c); /* round 3: heads flush left over their panels */
    if (i === 2) for (let l = 0; l < L; l++) g += ln(x0, Y(l / (L - 1)), x0 + C.w, Y(l / (L - 1)), T.rule, HAIR);
    g += ln(x0, top + ph, x0 + C.w, top + ph, T.ink, HAIR);
    if (i === 0) g += curve(T.ink);
    if (i === 1) {
      g += curve(T.rule);
      ts.forEach(t => g += ln(X(t), top + ph, X(t), Y(f(t)), T.mute, HAIR) + '<circle cx="' + r(X(t)) + '" cy="' + r(Y(f(t))) + '" r="3" fill="' + T.ink + '"/>');
    }
    if (i === 2) {
      /* 30-09-2026, his word: quantisation is shown as the digital signal it produces - one bar per sample at
         its nearest level - with the analog curve drawn over the bars, so the gap between them is what was lost */
      const bw = C.w / n, gap = Math.max(2, bw * 0.18);
      ts.forEach(t => { const y = Y(q(f(t))); g += '<rect x="' + r(X(t) - bw / 2 + gap / 2) + '" y="' + r(y) + '" width="' + r(bw - gap) + '" height="' + r(top + ph - y) + '" fill="' + T.signal + '"/>'; });
      g += curve(T.ink);
    }
    g += tx(x0, nameB, p.name, { z: Z.item, c: T.ink });
    g += IDL.lines(x0, lineB, IDL.wrapPretty(p.line, C.w, Z.body), { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
    out += vis(i, c, g);
  });
  return out;
};

const hex = v => { const n = Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'); return '#' + n + n + n; };
const SCENE = { sky: 0.88, sun: 0.98, block: 0.52, window: 0.08, ground: 0.26 };
const scene = (x, y, w, h, tone) =>
  '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h * 0.6) + '" fill="' + hex(tone(SCENE.sky)) + '"/>' +
  '<circle cx="' + r(x + w * 0.78) + '" cy="' + r(y + h * 0.22) + '" r="' + r(h * 0.1) + '" fill="' + hex(tone(SCENE.sun)) + '"/>' +
  '<rect x="' + r(x) + '" y="' + r(y + h * 0.6) + '" width="' + r(w) + '" height="' + r(h * 0.4) + '" fill="' + hex(tone(SCENE.ground)) + '"/>' +
  '<rect x="' + r(x + w * 0.16) + '" y="' + r(y + h * 0.3) + '" width="' + r(w * 0.36) + '" height="' + r(h * 0.46) + '" fill="' + hex(tone(SCENE.block)) + '"/>' +
  '<rect x="' + r(x + w * 0.27) + '" y="' + r(y + h * 0.5) + '" width="' + r(w * 0.12) + '" height="' + r(h * 0.26) + '" fill="' + hex(tone(SCENE.window)) + '"/>';
const cl = v => Math.max(0.03, Math.min(0.97, v));
const DENSITY = { /* scene value -> negative density, 0 clear .. 1 opaque */
  normal: v => cl(0.12 + v * 0.72), under: v => cl(v * 0.72 - 0.22), over: v => cl(0.4 + v * 0.72),
  underdev: v => cl(0.14 + v * 0.34), overdev: v => cl(-0.12 + v * 1.25)
};
const EDGE = { normal: 1, under: 1, over: 1, underdev: 0.28, overdev: 1.6 };


/* ---------- NEGATIVES: exposure changes the frames; development also changes the edge numbers ----------
   Rows on one pitch (56 when it fits) with hairlines between them; one 24 gap between columns,
   left-over width to the right. Name and note stack when the pitch allows, else share a baseline. */
R.negs = (d, c) => {
  const { W, H, T } = c, rows = d.rows, n = rows.length, capL = G.cap(Z.label, 'm'), capN = G.cap(Z.body);
  /* round 3, on the page: names and notes in columns 1-3, the strip in 4-7, the print in 8-9, edge numbers in 10-12,
     rows about 96 (as much as the page allows, on the 8 base); the unit ends on the column edge */
  const cg = c.G, site = !!c.site, top = 24;
  const p = site ? Math.max(48, Math.min(96, Math.floor((c.room - top) / n / G.BASE) * G.BASE)) : G.pitch(n, H - top, 56);
  /* round 4: images sit 8 clear of the row hairlines; on the page the strip fills columns 4-7 exactly (the film runs on and is cut at the column line) */
  const clr = site ? 8 : 4, stacked = p >= 48, sh = p - 2 * clr, unit = sh / 39, fw = 36 * unit, fg = 2 * unit, pw = Math.min(sh * 1.5, site ? cg.span(2) : Infinity);
  const nameW = Math.max(...rows.map(o => IDL.gw(o.name, Z.body, 600))), noteW = Math.max(...rows.map(o => IDL.gw(o.line, Z.note, 400, 't')));
  const labW = stacked ? Math.max(nameW, noteW) : nameW + 12 + noteW;
  /* three frames of strip when the width allows, else two (the first version's own rule) */
  const edgeW = Math.max(IDL.labelW('Edge numbers'), ...rows.map(o => IDL.gw(o.edge, Z.body)));
  /* round 4 polish: the film is cut on an inter-frame bar: the largest whole number of frames that fits columns 4-7, left-aligned */
  /* 30-09-2026, his note: one frame per example (d.frames), an inverted positive beside it (d.invert), and real
     scans in place of the drawn scene (row.src, the negative; row.pos, its positive - else the scan inverted) */
  let frames = site ? Math.floor(((d.invert ? cg.span(2) : cg.span(4)) - fg) / (fw + fg)) : labW + 24 + 3 * fw + 4 * fg + 24 + pw + 24 + edgeW <= W ? 3 : 2;
  if (d.frames) frames = Math.max(1, Math.min(frames, d.frames));
  const sw_ = frames * fw + (frames + 1) * fg, cid = 'nc' + Math.random().toString(36).slice(2, 8), sx = site ? cg.x(3) : labW + 24, px = site ? cg.x(7) : sx + sw_ + 24, ex = site ? cg.x(9) : px + pw + 24, TW = site ? W : Math.min(W, ex + edgeW);
  const orange = '#E8E6E0'; /* v2: edge numbers neutral grey-white on the black strip; they strengthen with development, never with exposure */
  const ix = site ? cg.x(5) : px, iw = Math.min(sh * 1.5, site ? cg.span(2) : pw);
  const fid = cid + 'inv';
  let out = '<filter id="' + fid + '"><feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"/></filter>';
  out += label(sx, capL, 'Negative', c) + label(px, capL, d.edgeZoom ? 'Edge, enlarged' : 'Print', c) + label(ex, capL, 'Edge numbers', c);
  if (d.invert) out += label(ix, capL, 'Inverted', c);
  const photo = (src, x, y, w, h, inv) => '<image href="' + src + '" x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h) + '" preserveAspectRatio="xMidYMid slice"' + (inv ? ' filter="url(#' + fid + ')"' : '') + '/>';
  rows.forEach((o, i) => {
    const y = top + i * p + clr, D = DENSITY[o.kind], e = EDGE[o.kind], dev = o.kind.endsWith('dev');
    const nb = stacked ? y + capN : y + sh / 2 + capN / 2;
    let g = i ? ln(0, top + i * p, TW, top + i * p, T.rule, HAIR) : '';
    g += tx(0, nb, o.name, { f: 'g', w: 600, z: Z.body, c: T.ink }) + (stacked ? tx(0, nb + 18, o.line, { f: 't', w: 400, z: Z.note, c: T.ink }) : tx(nameW + 12, nb, o.line, { f: 't', w: 400, z: Z.note, c: T.ink }));
    g += '<clipPath id="' + cid + i + '"><rect x="' + r(sx) + '" y="' + r(y) + '" width="' + r(sw_) + '" height="' + r(sh) + '"/></clipPath><g clip-path="url(#' + cid + i + ')">';
    g += '<rect x="' + r(sx) + '" y="' + r(y) + '" width="' + r(sw_) + '" height="' + r(sh) + '" fill="#0B0C0C"/>';
    const holes = Math.floor(sw_ / (4.75 * unit));
    for (let h = 0; h < holes; h++) {
      const hx = sx + (h + 0.5) * 4.75 * unit - 1 * unit;
      g += '<rect x="' + r(hx) + '" y="' + r(y + 1.4 * unit) + '" width="' + r(2 * unit) + '" height="' + r(2.8 * unit) + '" rx="' + r(0.5 * unit) + '" fill="' + T.bg + '"/>' +
           '<rect x="' + r(hx) + '" y="' + r(y + sh - 3.4 * unit) + '" width="' + r(2 * unit) + '" height="' + r(2.8 * unit) + '" rx="' + r(0.5 * unit) + '" fill="' + T.bg + '"/>';
    }
    for (let f = 0; f < frames; f++) {
      const fx = sx + fg + f * (fw + fg);
      g += o.src ? photo(o.src, fx, y + 5.5 * unit, fw, 24 * unit) : scene(fx, y + 5.5 * unit, fw, 24 * unit, v => 1 - D(v));
      const ez = 6 * unit, op = Math.min(1, e), wt = e > 1 ? 700 : 400;
      g += '<text x="' + r(fx + 1 * unit) + '" y="' + r(y + 5.5 * unit + 24 * unit + 5.6 * unit) + '" fill="' + orange + '" opacity="' + op + '" style="font-family:' + IDL.FONT.m + ';font-size:' + r(ez) + 'px;font-weight:' + wt + (e > 1 ? ';paint-order:stroke;stroke:' + orange + ';stroke-width:' + r(ez * 0.06) : '') + '">' + (11 + f) + (f % 2 ? '' : 'A') + '</text>';
    }
    g += '</g>';
    if (d.edgeZoom) {
      const ez = sh * 0.62, e2 = EDGE[o.kind];
      g += '<rect x="' + r(px) + '" y="' + r(y) + '" width="' + r(pw) + '" height="' + r(sh) + '" fill="#0B0C0C"/>' +
        '<text x="' + r(px + pw / 2) + '" y="' + r(y + sh / 2 + ez * 0.36) + '" text-anchor="middle" fill="' + orange + '" opacity="' + Math.min(1, e2) + '" style="font-family:' + IDL.FONT.m + ';font-size:' + r(ez) + 'px;font-weight:' + (e2 > 1 ? 700 : 400) + '">12A</text>';
    } else g += scene(px, y, pw, sh, v => D(v) * 1.08); /* print: denser negative passes less light, so the paper stays lighter */
    if (d.invert) g += o.pos ? photo(o.pos, ix, y, iw, sh) : o.src ? photo(o.src, ix, y, iw, sh, true) : scene(ix, y, iw, sh, v => D(v) * 1.08);
    g += tx(ex, nb, o.edge, { f: 't', w: 400, z: Z.body, c: dev ? T.signal : T.ink });
    out += vis(i, c, g);
  });
  return out;
};

})();
