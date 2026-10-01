/* Treatment B — the same data and rules, a second visual answer for every component.
   A leans on columns, icons and outlined tags; B is typographic, row-based and uses explicit difference. */
(function () {
const IDL = window.IDL, R = IDL.R, RB = IDL.RB = {}, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis;

/* Flow: typographic nodes, tags as a line of text under the name */
RB.flow = (d, c) => R.flow(Object.assign({}, d, { icons: false, chipStyle: 'text' }), c);

/* Hierarchy: indented outline, one node per row, depth spread across the width */
RB.tree = (d, c) => {
  const { W, H, T, u, sw } = c, rows = [];
  (function walk(n, dep, par) { const o = { name: n.name, dep, par }; rows.push(o); (n.children || []).forEach(ch => walk(ch, dep + 1, o)); })(d.root, 0, null);
  let cur = rows[0]; if (d.path && cur.name === d.path[0]) { cur.hl = 1; d.path.slice(1).forEach(p => { cur = rows.find(o => o.par === cur && o.name === p); if (cur) cur.hl = 1; }); }
  const D = Math.max(...rows.map(o => o.dep)), pitch = H / rows.length, z = Math.max(c.S, Math.min(c.P, pitch * 0.62));
  const widest = Math.max(...rows.map(o => IDL.gw(o.name, z) + o.dep)), ind = Math.min((W - widest) / Math.max(1, D), 30 * u);
  let out = '', txt = '';
  rows.forEach((o, i) => {
    o.y = (i + 0.5) * pitch; o.x = o.dep * ind;
    txt += vis(o.dep, c, tx(o.x, o.y + z * 0.36, o.name, { z, c: o.hl ? T.signal : T.ink }));
    if (o.par) {
      const px = o.par.x + 2 * u, py = o.par.y + z * 0.6 + u, col = o.hl && o.par.hl ? T.signal : T.ink;
      out += vis(o.dep, c, pa('M' + r(px) + ',' + r(py) + 'V' + r(o.y) + 'H' + r(o.x - u), col, sw));
    }
  });
  return out + txt;
};

/* Anatomy: callouts alternate below and above the string, so none has to stagger */
RB.anat = (d, c) => {
  const { W, H, T, u, k, sw } = c, text = d.parts.map(p => p.t).join(''), n = text.length;
  const lz = c.P * 0.8, nz = c.Q, rowH = lz * 1.1 + u + nz * 1.2;
  const z = Math.min(W / (n * 0.6), (H - 2 * (rowH + 6 * u)) * 0.9, 168 * k), cw = z * 0.6, x0 = (W - n * cw) / 2;
  const base = H / 2 + z * 0.3;
  let i0 = 0, j = 0, out = '';
  d.parts.forEach(p => {
    const x = x0 + i0 * cw, w = p.t.length * cw; i0 += p.t.length;
    out += tx(x, base, p.t, { f: 'm', z, c: p.sep ? T.mute : (p.key ? T.signal : T.ink), up: false, w: 400, ls: 0 });
    if (p.sep) return;
    const up = j % 2 === 1, col = p.key ? T.signal : T.ink;
    const by = up ? base - z * 0.8 - 2 * u : base + z * 0.25 + 2 * u, dir = up ? 1 : -1;
    let q = pa('M' + r(x + u / 2) + ',' + r(by + dir * u) + 'V' + r(by) + 'H' + r(x + w - u / 2) + 'V' + r(by + dir * u), col, sw);
    const ly = up ? by - 3 * u - rowH : by + 3 * u;
    const cw_ = Math.max(IDL.gw(p.label, lz), IDL.mw(p.note || '', nz)), flip = x + 2 * u + cw_ > W, lx = flip ? x + w - 2 * u : x + 2 * u, anc = flip ? 'end' : 'start', leadX = flip ? x + w - u / 2 : x + u / 2;
    q += ln(leadX, by, leadX, up ? ly + rowH : ly, col, sw * 0.5);
    q += tx(lx, ly + lz * 0.8, p.label, { z: lz, c: col, a: anc }) + (p.note ? tx(lx, ly + lz * 1.1 + u + nz * 0.8, p.note, { f: 'm', z: nz, c: T.mute, a: anc }) : '');
    out += vis(j, c, q); j++;
  });
  return out;
};

/* Table: row hairlines; the marked column carried by a field band; dots become bars */
RB.table = (d, c) => {
  const { T } = c;
  if (d.dots) {
    const { W, H, u, sw } = c, n = d.rows.length, m = d.cols.length, z = c.B * 1.2, hz = c.Q;
    const nameW = Math.max(...d.rows.map(o => IDL.gw(o.name, z))) + 6 * u, cw = (W - nameW - (m - 1) * 6 * u) / m;
    const headH = hz + 3 * u, rowH = Math.min((H - headH) / n, z * 2.8), top = (H - headH - rowH * n) / 2;
    let out = tx(0, top + hz, d.head || '', { f: 'm', z: hz, c: T.mute });
    d.cols.forEach((h, j) => out += tx(nameW + j * (cw + 6 * u), top + hz, h, { f: 'm', z: hz, c: T.mute }));
    out += ln(0, top + headH, W, top + headH, T.ink, sw);
    d.rows.forEach((o, i) => {
      const cy = top + headH + (i + 0.5) * rowH, hot = d.mark && d.mark.row === i;
      let q = tx(0, cy + z * 0.36, o.name, { z, c: hot ? T.signal : T.ink });
      o.v.forEach((v, j) => { const x = nameW + j * (cw + 6 * u); q += '<rect x="' + r(x) + '" y="' + r(cy - u) + '" width="' + r(cw) + '" height="' + r(2 * u) + '" fill="' + T.field + '"/><rect x="' + r(x) + '" y="' + r(cy - u) + '" width="' + r(cw * v / d.dots) + '" height="' + r(2 * u) + '" fill="' + (hot ? T.signal : T.ink) + '"/>'; });
      if (i) q = ln(0, top + headH + i * rowH, W, top + headH + i * rowH, T.rule, c.hair) + q;
      out += vis(i, c, q);
    });
    return out + ln(0, top + headH + n * rowH, W, top + headH + n * rowH, T.ink, sw);
  }
  return R.table(Object.assign({}, d, { band: true, rowRules: true }), c);
};

/* Ladder: bars from the axis origin, value printed at the end of each bar */
/* 06B: bars from an arbitrary origin on a log axis misstate ratios; dots on the log scale read true (USB 2.0 = 1/167 of TB5) */
RB.ladder = (d, c) => R.ladder(Object.assign({}, d, { scale: 'log' }), c);

/* Options: stacked rows — name, role, line — separated by hairlines */
RB.options = (d, c) => {
  const { W, H, T, u, sw } = c, it = d.items, n = it.length, rowH = H / n;
  const z = Math.min(c.P * 1.2, rowH * 0.42), nameW = Math.max(...it.map(o => IDL.gw(o.name, z))) + 6 * u, roleW = Math.max(...it.map(o => IDL.mw(o.role, c.S))) + 6 * u;
  let out = '';
  it.forEach((o, i) => {
    const cy = (i + 0.5) * rowH, col = o.key ? T.signal : T.ink, lines = IDL.wrap(o.line, W - nameW - roleW, c.B).slice(0, 2), lh = c.B * 1.35;
    let q = (i ? ln(0, i * rowH, W, i * rowH, T.rule, c.hair) : '') + tx(0, cy + z * 0.36, o.name, { z, c: col }) + tx(nameW, cy + c.S * 0.36, o.role, { f: 'm', z: c.S, c: T.mute });
    q += IDL.lines(nameW + roleW, cy - (lines.length - 1) * lh / 2 + c.B * 0.36, lines, { f: 't', w: 400, z: c.B, c: T.ink }, lh);
    out += vis(i, c, q);
  });
  return ln(0, 0, W, 0, T.ink, sw) + out + ln(0, H, W, H, T.ink, sw);
};

/* Steps: the other orientation */
RB.steps = (d, c) => R.steps(Object.assign({}, d, { orient: d.orient === 'v' ? 'h' : 'v' }), c);

/* Key numbers: summary list — figure left, meaning right, one row each */
RB.keys = (d, c) => {
  const { W, H, T, u, sw } = c, it = d.items, n = it.length, rowH = H / n;
  const fz = Math.min(rowH * 0.8, 220 * c.k), fw = Math.max(...it.map(o => IDL.gw(o.fig, fz))) + 8 * u;
  let out = '';
  it.forEach((o, i) => {
    const y = i * rowH, cy = y + rowH / 2, col = o.key ? T.signal : T.ink;
    let q = (i ? ln(0, y, W, y, T.rule, c.hair) : '') + tx(0, cy + fz * 0.36, o.fig, { z: fz, c: col, tab: 1 });
    q += tx(fw, cy - u, o.label, { z: c.P, c: T.ink }) + tx(fw, cy + 2 * u + c.B * 0.8, o.line, { f: 't', w: 400, z: c.B, c: T.ink });
    out += vis(i, c, q);
  });
  return out;
};

/* Formula: set as a fraction when it is a division */
RB.formula = (d, c) => {
  const t = d.terms;
  if (!(t.length === 5 && t[3].t === '÷')) return R.formula(d, c);
  const { W, H, T, u, sw } = c, eqW0 = 8 * u, colGap = 12 * u;
  const frac = (n, d, zz) => Math.max(IDL.gw(n, zz), IDL.gw(d, zz)) + 4 * u;
  const part = (a, n, dd, zz) => IDL.gw(a, zz) + IDL.gw('=', zz) + eqW0 + frac(n, dd, zz);
  const e = d.example, wAt = zz => part(t[0].t, t[2].t, t[4].t, zz) + (e ? colGap + part(e[0], e[2], e[4], zz * 0.7) : 0);
  let z = Math.min(c.P * 1.8, H / 5); while (z > c.P && wAt(z) > W) z -= c.k;
  const ez = z * 0.7, eqW = IDL.gw('=', z) + eqW0, blockW = part(t[0].t, t[2].t, t[4].t, z), x0 = (W - wAt(z)) / 2, cy = H / 2;
  const one = (x, a, eq, num, den, zz, lab) => {
    const lw2 = frac(num.t, den.t, zz), eqW = IDL.gw('=', zz) + eqW0;
    return tx(x, cy + zz * 0.36, a.t, { z: zz, c: a.key ? T.signal : T.ink }) + tx(x + IDL.gw(a.t, zz) + eqW / 2, cy + zz * 0.36, '=', { z: zz, c: T.mute, a: 'middle', w: 400 }) +
      tx(x + IDL.gw(a.t, zz) + eqW + lw2 / 2, cy - 2 * u, num.t, { z: zz, c: T.ink, a: 'middle' }) + ln(x + IDL.gw(a.t, zz) + eqW, cy, x + IDL.gw(a.t, zz) + eqW + lw2, cy, T.ink, sw) +
      tx(x + IDL.gw(a.t, zz) + eqW + lw2 / 2, cy + 2 * u + zz * 0.72, den.t, { z: zz, c: T.ink, a: 'middle' }) + (lab ? tx(x, cy - zz - 3 * u, lab, { f: 'm', z: c.Q, c: T.mute }) : '');
  };
  let out = vis(0, c, one(x0, t[0], t[1], t[2], t[4], z));
  if (d.example) {
    const e = d.example, X = x0 + blockW + colGap;
    out += vis(1, c, ln(X - colGap / 2, cy - z, X - colGap / 2, cy + z, T.rule, c.hair) + one(X, { t: e[0], key: t[0].key }, null, { t: e[2] }, { t: e[4] }, ez, d.exampleLabel || 'Worked example'));
  }
  if (d.note) out += tx(x0, cy + z * 1.6 + 4 * u, d.note, { f: 't', w: 400, z: c.S, c: T.ink });
  return out;
};

/* Before / after: explicit difference — each file joined to where it lands */
RB.pair = (d, c) => {
  const { W, H, T, u, sw } = c, b = d.before.rows, a = d.after.rows, n = Math.max(b.length, a.length);
  const lz = c.P, headH = lz + 3 * u, rowH = Math.min((H - headH) / n, c.S * 2.6), top = (H - headH - rowH * n) / 2;
  const fz = Math.min(c.S, (W * 0.5) / (Math.max(...a.map(x => x[0].length)) * 0.6)), bw = Math.max(...b.map(x => x[0].length)) * c.S * 0.6;
  const ax = W - Math.max(...a.map(x => x[0].length)) * fz * 0.6, bx1 = bw + 2 * u;
  let out = tx(0, top + lz * 0.8, d.before.label, { z: lz, c: T.ink }) + tx(ax, top + lz * 0.8, d.after.label, { z: lz, c: T.ink });
  out += ln(0, top + headH, bw, top + headH, T.ink, sw) + ln(ax, top + headH, W, top + headH, T.ink, sw);
  const Y = i => top + headH + (i + 0.5) * rowH;
  b.forEach((rw, i) => out += tx(0, Y(i) + c.S * 0.36, rw[0], { f: 'm', z: c.S, c: T.ink, up: false, ls: 0 }));
  a.forEach((rw, i) => out += tx(ax, Y(i) + fz * 0.36, rw[0], { f: 'm', z: fz, c: T.ink, up: false, ls: 0 }));
  b.forEach((rw, i) => { const j = a.findIndex(x => x[1] === rw[1]); if (j < 0) return; const x0 = bx1, x1 = ax - 2 * u, mx = (x0 + x1) / 2;
    out += vis(1, c, pa('M' + r(x0) + ',' + r(Y(i)) + 'C' + r(mx) + ',' + r(Y(i)) + ' ' + r(mx) + ',' + r(Y(j)) + ' ' + r(x1 - sw) + ',' + r(Y(j)), T.ink, c.hair * 1.5) + IDL.arrow(x1, Y(j), T.ink, c.hair * 1.5)); });
  return out;
};

/* Cycle: a circle, numbered stages */
RB.cycle = (d, c) => { const w = Math.min(c.W, c.H * 1.7); return '<g transform="translate(' + r((c.W - w) / 2) + ',0)">' + R.cycle(Object.assign({}, d, { items: d.items.map((o, i) => Object.assign({}, o, { name: (i + 1) + '  ' + o.name })) }), Object.assign({}, c, { W: w })) + '</g>'; };

/* Frayer: the term in its own column, the four parts in a 2 × 2 grid beside it */
/* Frayer (13B): the term in a 3-column column (136), the four parts in a 2 × 2 grid beside it.
   The term is grotesk 48, its cap top level with the quadrant labels'. No serif. */
RB.frayer = (d, c) => {
  const G = IDL.G, Z = G.Z, label = IDL.label, { W, H, T } = c, cg = c.G;
  /* round 3: term in columns 1-4, quadrants in 5-8 and 9-12; when the term is the page title, the term cell goes and the quadrants take 1-6 and 7-12 */
  const drop = !!c.pageTitle && c.pageTitle === d.term, tw = drop ? 0 : cg.span(4), gx = drop ? 0 : cg.x(4), qw = drop ? cg.span(6) : cg.span(4), qx = i => drop ? cg.x(6 * (i % 2)) : cg.x(4 + 4 * (i % 2));
  const capL = G.cap(Z.label, 'm'), labTop = 12, lh = G.LH.body;
  const Q = [['Definition', d.definition], ['Features', d.features], ['Examples', d.examples], ['Non-examples', d.nonExamples]];
  const linesOf = body => Array.isArray(body) ? body.slice(0, 4).flatMap(s => IDL.wrapPretty(s, qw, Z.body)) : IDL.wrapPretty(body, qw, Z.body);
  const bodyTop = labTop + capL + lh, rowH = i => bodyTop + (linesOf(Q[i][1]).length - 1) * lh + 6;
  const y1 = G.snap(Math.max(rowH(0), rowH(1)) + 16), bottom = y1 + Math.max(rowH(2), rowH(3));
  let out = drop ? '' : tx(0, labTop + G.cap(Z.display), d.term, { z: Z.display, c: T.ink }) + ln(tw + cg.gut / 2, 0, tw + cg.gut / 2, bottom, T.rule, G.RULE.hair);
  Q.forEach(([lab, body], i) => {
    const x = qx(i), y = i < 2 ? 0 : y1;
    let q = ln(x, y, x + qw, y, T.ink, G.RULE.ink) + label(x, y + labTop + capL, lab, c);
    q += IDL.lines(x, y + bodyTop, linesOf(body), { f: 't', w: 400, z: Z.body, c: T.ink }, lh);
    out += vis(i, c, q);
  });
  return out;
};

RB.signal = (d, c) => {
  const { W, H, T, u, sw } = c, n = d.samples || 12, L = d.levels || 8, C = IDL.columns(3, c, 6);
  const f = t => 0.5 + 0.3 * Math.sin(2 * Math.PI * (t * 1.3 + 0.07)) + 0.12 * Math.sin(2 * Math.PI * (t * 3.1 + 0.18));
  const textH = c.P * 1.1 + 2 * u + 3 * c.B * 1.4, ph = H - textH - 6 * u, pw = W - 30 * u, X = t => t * pw, Y = v => ph - v * ph, q = v => Math.round(v * (L - 1)) / (L - 1);
  const ts = Array.from({ length: n }, (_, s) => (s + 0.5) / n);
  let out = '';
  for (let l = 0; l < L; l++) out += vis(2, c, ln(0, Y(l / (L - 1)), pw, Y(l / (L - 1)), T.rule, c.hair));
  out += vis(0, c, pa('M' + Array.from({ length: 121 }, (_, s) => r(X(s / 120)) + ',' + r(Y(f(s / 120)))).join('L'), T.ink, sw));
  out += vis(1, c, ts.map(t => '<circle cx="' + r(X(t)) + '" cy="' + r(Y(f(t))) + '" r="' + r(u * 0.8) + '" fill="' + T.ink + '"/>').join(''));
  let dd = 'M0,' + r(Y(q(f(ts[0])))); ts.forEach((t, s) => dd += 'V' + r(Y(q(f(t)))) + 'H' + r(X((s + 1) / n)));
  out += vis(2, c, pa(dd, T.signal, sw));
  /* labels stacked at the right end, one line each, the first level with the curve's end */
  const y0 = Math.min(Y(f(1)), ph - 3 * (c.S + 2 * u)), lab = (k, s, col) => vis(k, c, tx(pw + 3 * u, y0 + k * (c.S + 2 * u) + c.S * 0.36, s, { f: 'm', z: c.S, c: col }));
  out += lab(0, 'Analog', T.ink) + lab(1, n + ' samples', T.ink) + lab(2, L + ' levels', T.signal);
  d.panels.forEach((p, i) => { const x = C.x(i), y = ph + 6 * u + c.P * 0.8;
    out += vis(i, c, tx(x, y, p.name, { z: c.P, c: i === 2 ? T.signal : T.ink }) + IDL.lines(x, y + c.P * 0.3 + 2 * u + c.B * 0.8, IDL.wrap(p.line, C.w, c.B).slice(0, 3), { f: 't', w: 400, z: c.B, c: T.ink }, c.B * 1.4)); });
  return out;
};

/* Negatives: the print replaced by an enlargement of the edge number — the thing to find */
RB.negs = (d, c) => R.negs(Object.assign({}, d, { edgeZoom: true }), c);
})();
