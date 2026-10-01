/* Information design library — principle, fact, concept: key numbers, formula, pair, cycle, Frayer.
   Drawn in grid px; positions from ctx.G, sizes from IDL.G.Z, pitches from IDL.G.PITCH, rules from IDL.G.RULE. */
(function () {
const IDL = window.IDL, R = IDL.R, G = IDL.G, Z = G.Z, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis, label = IDL.label;
const HAIR = G.RULE.hair, INK = G.RULE.ink, CL = G.CLEAR;

/* ---------- KEY NUMBERS: n equal columns (3-up 188 / 20); figure 128, rule below it, label 20, line 16/24 ---------- */
R.keys = (d, c) => {
  const { T } = c, it = d.items, C = c.G.up(it.length);
  /* 30-09-2026, his note: the unit sits up beside the figure ("Gb/s yukarıda rakamın yanında"), so the label under
     the rule can say what the figure is (Transfer speed, HDD); o.unit is optional */
  const uw = o => o.unit ? 6 + IDL.gw(o.unit, Z.item, 500) : 0;
  const fz = it.every(o => IDL.gw(o.fig, Z.key, 500) + uw(o) <= C.w) ? Z.key : Z.display, capF = G.cap(fz), ruleY = G.snap(capF + 16), capI = G.cap(Z.item);
  let out = '';
  it.forEach((o, i) => {
    const x = C.x(i), col = o.key ? T.signal : T.ink;
    let q = tx(x - fz * 0.05, capF, o.fig, { z: fz, c: col, tab: 1 });
    /* the unit runs on from the figure in the same line of text, so it sits where the figure really ends */
    if (o.unit) q = q.replace(/<\/text>$/, '<tspan dx="' + r(6) + '" style="font-size:' + r(Z.item) + 'px">' + String(o.unit).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</tspan></text>');
    q += ln(x, ruleY, x + C.w, ruleY, T.ink, INK);
    q += tx(x, ruleY + 16 + capI, o.label, { z: Z.item, c: T.ink });
    q += IDL.lines(x, ruleY + 16 + capI + 24, IDL.wrapPretty(o.line, C.w, Z.body), { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
    out += vis(i, c, q);
  });
  return out;
};

/* ---------- FORMULA: named terms on equal shares of columns 3–12, operators midway, a worked example beneath ----------
   Round 2: "WORKED EXAMPLE" is a row label in columns 1–2 on the example's baseline, so the row carries one axis.
   Terms 30 (never above the title), example 20; hangs from the top. */
R.formula = (d, c) => {
  /* round 3: one cluster from column 3 (column 1 when there is no example row); every operator 15 from its terms, at the terms' size, in mute */
  const { W, T } = c, t = d.terms, ez = Z.item, x0 = d.example ? c.G.x(2) : 0, OP = 15;
  const wAt = z => t.reduce((a, o) => a + IDL.gw(o.t, z, o.op ? 400 : 500), 0) + OP * (t.length - 1);
  const z = x0 + wAt(Z.title) <= W ? Z.title : Z.item, cx = []; let xx = x0;
  t.forEach((o, i) => { const w = IDL.gw(o.t, z, o.op ? 400 : 500); cx[i] = xx + w / 2; xx += w + OP; });
  const RW = Math.min(W, c.G.end(xx - OP));
  const yb = G.cap(z), yu = yb + 24, ry = G.snap(yu + 16), ye = ry + 24 + G.cap(ez), yn = ye + 32;
  let out = '';
  t.forEach((o, i) => {
    const colr = o.op ? T.mute : (o.key ? T.signal : T.ink);
    let q = tx(cx[i], yb, o.t, { z, c: colr, a: 'middle', w: o.op ? 400 : 500 });
    if (o.u) q += label(cx[i], yu, o.u, c, { a: 'middle' });
    if (d.example && d.example[i] != null) q += tx(cx[i], ye, d.example[i], { z: ez, c: o.op ? T.mute : T.ink, a: 'middle', w: 500, tab: !o.op }); /* round 4 polish: example-row operators exactly as the values (20, 500), in mute */
    out += vis(i, c, q);
  });
  if (d.example) out += ln(0, ry, RW, ry, T.rule, HAIR) + label(0, ye, d.exampleLabel || 'Worked example', c);
  if (d.note) { const ki = Math.max(0, t.findIndex(o => o.key)); out += tx(cx[ki], yn, d.note, { f: 't', w: 400, z: Z.body, c: T.ink, a: 'middle' }); }
  return out;
};

/* ---------- BEFORE / AFTER: two identical frames on the 2-up grid (292 / 20 / 292) ----------
   Label 20, column head, 1.5 head rule, rows on a 48 pitch: file name (mono 14, a literal string) and its date 18 below. */
R.pair = (d, c) => {
  const { H, T } = c, C = c.G.up(2), n = Math.max(d.before.rows.length, d.after.rows.length);
  const headH = 48, p = G.pitch(n, H - headH - 8, 56) /* round 4: 56, so each date groups with its own name */, capI = G.cap(Z.item);
  const longest = Math.max(...[d.before, d.after].flatMap(s => s.rows.map(rw => String(rw[0]).length)));
  const fz = [Z.body, Z.note, Z.label].find(z => longest * 0.6 * z <= C.w) || Z.label, capF = G.cap(fz, 'm');
  let out = '';
  [d.before, d.after].forEach((s, i) => {
    const x = C.x(i);
    let q = tx(x, capI, s.label, { z: Z.item, c: T.ink }) + label(x, capI + 20, d.cols.join(' · '), c);
    q += ln(x, headH, x + C.w, headH, T.ink, INK);
    s.rows.forEach((rw, j) => {
      const y = headH + 8 + capF + j * p;
      /* C3: in the renamed files the 8-character date prefix is signal, echoing 03A */
      let name = tx(x, y, rw[0], { f: 'm', z: fz, c: T.ink, up: false, ls: 0 });
      if (s === d.after && /^\d{8}/.test(rw[0])) name = name.replace('>' + IDL.esc(rw[0]) + '<', '><tspan fill="' + T.signal + '">' + rw[0].slice(0, 8) + '</tspan>' + IDL.esc(rw[0].slice(8)) + '<');
      q += name + tx(x, y + (fz > Z.note ? 20 : 18), rw[1], { f: 't', w: 400, z: Z.note, c: T.mute });
    });
    q += ln(x, headH + n * p, x + C.w, headH + n * p, T.ink, INK);
    out += vis(i, c, q);
  });
  return out;
};

/* ---------- CYCLE: stages on an ellipse, arrowheads 8 from every stage ----------
   Round 2: the side stages sit on the centres of columns 2 and 11 and the loop is 2 : 1 (never wider);
   the centre label moves to the head; stage notes in ink, link verbs mute. */
R.cycle = (d, c) => {
  const { W, H, T } = c, it = d.items, n = it.length, sw = INK, z = Z.item, capI = G.cap(z), cg = c.G;
  const box = it.map(o => ({ w: Math.max(IDL.gw(o.name, z), o.note ? IDL.labelW(o.note) : 0), h: capI + (o.note ? 20 + 3 : 5) }));
  const mh = Math.max(...box.map(b => b.h)), top = d.centre ? 24 : 0;
  /* round 3: the loop, stages included, is capped at 8 columns (columns 3 to 10); 2 : 1 */
  const mw = Math.max(...box.map(b => b.w)), xl = cg.x(2) + mw / 2, xr = cg.x(10) - cg.gut - mw / 2, rx = (xr - xl) / 2, ry = Math.min(rx / 2, Math.max(40, (H - top - mh) / 2));
  const cx = (xl + xr) / 2, cy = top + mh / 2 + ry;
  const th = i => -Math.PI / 2 + i * 2 * Math.PI / n, P = a => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  const B = it.map((o, i) => { const [x, y] = P(th(i)); return { x0: x - box[i].w / 2, x1: x + box[i].w / 2, y0: y - box[i].h / 2, y1: y + box[i].h / 2, tx: x }; });
  const inside = (p, b) => p[0] > b.x0 - CL && p[0] < b.x1 + CL && p[1] > b.y0 - CL && p[1] < b.y1 + CL;
  const exit = (a, dir, b) => { let lo = 0, hi = Math.PI * 2 / n * 0.5; for (let s = 0; s < 30; s++) { const m = (lo + hi) / 2; if (inside(P(a + dir * m), b)) lo = m; else hi = m; } return a + dir * hi; };
  let out = d.centre ? label(xl - mw / 2, G.cap(Z.label, 'm'), d.centre, c) : ''; /* round 4: on the loop's left edge */
  it.forEach((o, i) => {
    const b = B[i], col = o.key ? T.signal : T.ink, j = (i + 1) % n;
    let q = tx(b.tx, b.y0 + capI, o.name, { z, c: col, a: 'middle' });
    if (o.note) q += label(b.tx, b.y0 + capI + 20, o.note, c, { a: 'middle', c: T.ink });
    const a0 = exit(th(i), 1, b), a1 = exit(th(i + 1), -1, B[j]), pts = [];
    for (let s = 0; s <= 48; s++) pts.push(P(a0 + (a1 - a0) * s / 48));
    const [ex, ey] = pts[48], [px, py] = pts[47], ang = Math.atan2(ey - py, ex - px) * 180 / Math.PI;
    q += pa('M' + pts.slice(0, 47).map(p => r(p[0]) + ',' + r(p[1])).join('L'), T.ink, sw);
    q += '<g transform="translate(' + r(ex) + ',' + r(ey) + ') rotate(' + r(ang) + ')">' + IDL.arrow(0, 0, T.ink, sw) + '</g>';
    if (o.link) {
      const am = (a0 + a1) / 2, [mx, my] = P(am), ox = Math.cos(am), oy = Math.sin(am);
      q += label(mx + ox * 12, my + oy * 12 + G.cap(Z.label, 'm') / 2, o.link, c, { a: Math.abs(ox) < 0.3 ? 'middle' : ox > 0 ? 'start' : 'end' });
    }
    out += vis(i, c, q);
  });
  return out;
};

/* ---------- FRAYER MODEL (A): a term by definition, features, examples, non-examples; quadrants on the 2-up grid ---------- */
R.frayer = (d, c) => {
  const { W, H, T } = c, C = c.G.up(2), capL = G.cap(Z.label, 'm');
  const Q = [['Definition', d.definition], ['Features', d.features], ['Examples', d.examples], ['Non-examples', d.nonExamples]];
  let out = tx(0, G.cap(Z.display), d.term, { z: Z.display, c: T.ink });
  const top = G.snap(G.cap(Z.display) + 24), rowH = G.snap((H - top) / 2);
  Q.forEach(([lab, body], i) => {
    const x = C.x(i % 2), y = top + (i < 2 ? 0 : rowH);
    let q = ln(x, y, x + C.w, y, T.ink, INK) + label(x, y + 16 + capL, lab, c), yy = y + 16 + capL + 24;
    const lines = Array.isArray(body) ? body.slice(0, 4) : IDL.wrap(body, C.w, Z.body).slice(0, 3);
    q += IDL.lines(x, yy, lines, { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
    out += vis(i, c, q);
  });
  return out;
};
})();
