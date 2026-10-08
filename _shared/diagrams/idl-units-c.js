/* Information design library — classification and procedure: table, ladder, options, steps.
   Drawn in grid px; positions from ctx.G, sizes from IDL.G.Z, pitches from IDL.G.PITCH, rules from IDL.G.RULE. */
(function () {
const IDL = window.IDL, R = IDL.R, G = IDL.G, Z = G.Z, tx = IDL.tx, ln = IDL.ln, r = IDL.r, vis = IDL.vis, label = IDL.label;
const isNum = v => /^[\d.,]+$/.test(String(v).trim());
const HAIR = G.RULE.hair, INK = G.RULE.ink;

/* a unit repeated in every cell of a column moves into its head: "24 TB" -> head "Up to (TB)", cell "24" */
IDL.unitsToHead = (head, vals) => {
  const m = vals.map(v => String(v).match(/^([\d.,]+)\s+([A-Za-z%/]+)$/));
  if (!m.every(x => x) || !m.every(x => x[2] === m[0][2])) return { head, unit: null, vals };
  return { head, unit: m[0][2], vals: m.map(x => x[1]) };
};
/* a head label; the unit in brackets keeps its own case (MB/s, ppi) */
IDL.headLabel = (x, y, h, c, o) => {
  o = o || {}; const s = IDL.caps(h.head) + (h.unit ? ' (' + h.unit + ')' : '');
  return label(x, y, s, c, Object.assign({ up: false }, o));
};
IDL.headW = h => IDL.labelW(String(h.head) + (h.unit ? ' (' + h.unit + ')' : ''));
/* a range column aligns on its separator ("12–14", "8 or 16", "8") */
const splitRange = v => { const m = String(v).match(/^(\d[\d.,]*)(–|\s+or\s+)?(.*)$/); return m ? [m[1], (m[2] || ''), m[3] || ''] : [String(v), '', '']; };
const isRange = vals => vals.some(v => /\d(–|\s+or\s+)\d/.test(v)) && vals.every(v => /^\d/.test(String(v)));

/* ---------- TABLE: rules at head and foot only, both the full column width ----------
   Round 2: every column starts on a grid column line (content + 24 at least), so the spare width falls
   between columns in grid steps and the table has one right edge. Text flush left, numbers right-aligned.
   The marked column carries a tint; the signal sits on the cells that make the sentence true (mark.value). */
R.table = (d, c) => {
  const { W, H, T } = c, rows = d.rows, n = rows.length, dots = d.dots || 0, z = Z.body, gap = c.G.gut, capB = G.cap(z, 't'), cg = c.G;
  const cols = d.cols.map((h, j) => dots ? { head: h, unit: null, vals: rows.map(o => o.v[j]) } : IDL.unitsToHead(h, rows.map(o => o.v[j])));
  const kind = cols.map(col => dots ? 'dots' : col.vals.every(isNum) ? 'num' : 'text');
  const vw = (v, w) => IDL.gw(v, z, w || 400, 't');
  const nameW = Math.max(IDL.labelW(d.head || ''), ...rows.map(o => vw(o.name, 600)));
  const cw = cols.map((col, j) => Math.max(IDL.headW(col), kind[j] === 'dots' ? dots * 14 : Math.max(...col.vals.map(v => vw(v)))));
  /* round 3: packed (default): each column = content + one gutter, snapped up to the next grid line, so the table is
     as wide as its content; d.spread (10A): the spare width is shared between the columns, each start snapped to a grid line */
  const xs = [0]; cw.forEach((w, j) => xs.push(cg.line(xs[j] + (j ? cw[j - 1] : nameW) + gap)));
  /* round 4: ONE table policy - every table is as wide as its content (each column = content + one gutter, snapped up to a grid
     line) and its rules end on the column line after the content; a right-aligned last column ends exactly on the rule end */
  const m = cw.length, TW = Math.min(W, cg.end(xs[m] + cw[m - 1])); if (kind[m - 1] === 'num') cw[m - 1] = TW - xs[m];
  const headH = 24, p = G.pitch(n, H - headH, 40), foot = headH + n * p;
  const mc = d.mark && d.mark.col != null ? d.mark.col : -1, mr = d.mark && d.mark.row != null ? d.mark.row : -1, mv = d.mark && d.mark.value;
  let out = '';
  /* 30-09: the tint says "this column, of several"; a table with one value column has nothing to choose between, so it
     carries no tint and the signal on mark.value marks the answer alone (week 6 review, C p11) */
  if (mc >= 0 && cols.length > 1) out += '<rect x="' + r(xs[mc + 1] - 12) + '" y="' + r(-8) + '" width="' + r(xs[mc + 1] + cw[mc] + 12 - (xs[mc + 1] - 12)) + '" height="' + r(foot + 8) + '" fill="' + T.field + '"/>';
  if (d.head) out += label(0, G.cap(Z.label, 'm'), d.head, c);
  cols.forEach((col, j) => {
    const num = kind[j] === 'num', X = num ? xs[j + 1] + cw[j] : xs[j + 1];
    out += IDL.headLabel(X, G.cap(Z.label, 'm'), col, c, { a: num ? 'end' : 'start' });
  });
  out += ln(0, headH, TW, headH, T.ink, INK);
  rows.forEach((o, i) => {
    const y = headH + i * p + p / 2 + capB / 2, hot = i === mr;
    let q = tx(0, y, o.name, { f: 't', w: 600, z, c: hot ? T.signal : T.ink });
    cols.forEach((col, j) => {
      const v = col.vals[i], x = xs[j + 1], colr = j === mc && mv != null && v === mv ? T.signal : T.ink;
      if (kind[j] === 'dots') { const rr = 4; for (let t = 0; t < dots; t++) q += '<circle cx="' + r(x + rr + t * 14) + '" cy="' + r(y - capB / 2) + '" r="' + rr + '" fill="' + (t < v ? T.ink : 'none') + '" stroke="' + (t < v ? T.ink : T.mute) + '" stroke-width="' + HAIR + '"/>'; }
      else if (kind[j] === 'num') q += tx(x + cw[j], y, v, { f: 't', w: 400, z, c: colr, a: 'end', tab: 1 });
      else q += tx(x, y, v, { f: 't', w: 400, z, c: colr });
    });
    if (d.rowRules && i) q = ln(0, headH + i * p, TW, headH + i * p, T.rule, HAIR) + q;
    out += vis(i, c, q);
  });
  return out + ln(0, foot, TW, foot, T.ink, INK);
};

/* ---------- LADDER: one axis across orders of magnitude; dots (default) or bars ----------
   Unit label on top, rows on one pitch, axis as the foot. Values in grotesk tabular figures,
   16 after the end of their mark. The last tick label ends at its tick. */
R.ladder = (d, c) => {
  const { W, H, T } = c, it = d.items, n = it.length, log = d._log != null ? d._log : d.scale !== 'linear', bars = d.scale === 'linear' || d.scale === 'linear-bars';
  const nz = Z.body, vz = Z.body, capN = G.cap(nz), capL = G.cap(Z.label, 'm');
  const nameW = Math.max(...it.map(o => IDL.gw(o.name, nz, 600))), valW = Math.max(...it.map(o => IDL.gw(o.label, vz, 400, 't')));
  /* round 2: the scale runs from the first to the last tick; the axis ends one column past the last tick, and every tick label is centred on its tick */
  const lo = d.ticks[0].v, hi = d.ticks[d.ticks.length - 1].v, top0 = Math.max(hi, ...it.map(o => o.boost || o.v));
  const x0 = c.G.line(nameW + 24), x1 = W - valW - 16 - c.G.col - 8, ax1 = x1 + c.G.col;
  const P = v => x0 + (x1 - x0) * (log ? (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) : (v - lo) / (hi - lo));
  const top = d.unit ? 24 : 0, axisH = 32, p = G.pitch(n, H - top - axisH, 40), ay = top + n * p;
  let out = '';
  if (d.unit) out += label(x0, capL, d.unit, c);
  d.ticks.forEach((t, i) => {
    const last = i === d.ticks.length - 1;
    out += ln(P(t.v), top, P(t.v), ay, T.rule, HAIR) + ln(P(t.v), ay, P(t.v), ay + 8, T.ink, HAIR);
    out += label(P(t.v), ay + 8 + 4 + capL, t.label, c, { a: 'middle', up: false });
  });
  out += ln(x0, ay, ax1, ay, T.ink, INK);
  it.forEach((o, i) => {
    const cy = top + i * p + p / 2, col = o.key ? T.signal : T.ink;
    let q = tx(0, cy + capN / 2, o.name, { z: nz, w: 600, c: col }), end;
    if (!bars) { q += ln(x0, cy, P(o.v), cy, T.rule, HAIR) + '<circle cx="' + r(P(o.v)) + '" cy="' + r(cy) + '" r="4" fill="' + col + '"/>'; end = P(o.v) + 4; }
    else { q += '<rect x="' + r(x0) + '" y="' + r(cy - 4) + '" width="' + r(P(o.v) - x0) + '" height="8" fill="' + col + '"/>'; end = P(o.v); }
    if (o.boost) { q += ln(P(o.v) + 4, cy, P(o.boost) - 4, cy, col, HAIR, '3 3') + '<circle cx="' + r(P(o.boost)) + '" cy="' + r(cy) + '" r="4" fill="none" stroke="' + col + '" stroke-width="' + HAIR + '"/>'; end = P(o.boost) + 4; }
    q += tx(end + 16, cy + G.cap(vz, 't') / 2, o.label, { f: 't', w: 400, z: vz, c: col, tab: 1 });
    out += vis(i, c, q);
  });
  return out;
};

/* legacy helpers, kept for the variants that are not in the selection */
const columns = (n, c, gapU) => { const gap = gapU * c.u; return { gap, w: (c.W - gap * (n - 1)) / n, x: i => i * ((c.W - gap * (n - 1)) / n + gap) }; };
const grow = (f, H, max = 1.6) => { let g = max; while (g > 1 && f(g) > H) g -= 0.05; return g; };

/* ---------- PARALLEL OPTIONS: n equal columns of the grid; name, rule below it, role, line; top-anchored ---------- */
R.options = (d, c) => {
  const { T } = c, it = d.items, C = c.G.up(it.length), capI = G.cap(Z.item), capL = G.cap(Z.label, 'm');
  let out = '';
  it.forEach((o, i) => {
    const x = C.x(i), col = o.key ? T.signal : T.ink, lines = IDL.wrapPretty(o.line, C.w, Z.body);
    let q = tx(x, capI, o.name, { z: Z.item, c: col });
    q += ln(x, 24, x + C.w, 24, col, INK);
    q += label(x, 24 + 16 + capL, o.role, c);
    /* v2: a warning is ink with a typographic mark — a short rule, mono NOTE, then the warning; never the signal */
    const ly = 24 + 16 + capL + 24;
    q += IDL.lines(x, ly, lines, { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
    if (o.warn) { const ny = ly + (lines.length - 1) * G.LH.body + 16; q += ln(x, ny, x + 24, ny, T.ink, INK) + label(x, ny + 8 + capL, 'Note', c, { c: T.ink }) + IDL.lines(x, ny + 8 + capL + 24, IDL.wrapPretty(o.warn, C.w, Z.body), { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body); }
    out += vis(i, c, q);
  });
  return out;
};

/* ---------- NUMBERED PROCEDURE ----------
   Horizontal: n equal columns (4-up 136 / 20). Numeral 48, rule below it, name 20, line 14/20.
   A warning step carries signal on its numeral and rule only; its words stay ink. */
R.steps = (d, c) => {
  const { W, H, T } = c, st = d.steps, n = st.length;
  let out = '';
  if (d.orient === 'v') {
    /* 01-10-2026: the lines start clear of the longest name (in a narrow column "Contact sheet" ran into its line) */
    const p = G.pitch(n, H, 64), capI = G.cap(Z.item), nameX = c.G.x(1);
    const lineX = Math.max(c.G.x(4), nameX + Math.max(...st.map((q) => IDL.gw(q.t, Z.item))) + 16);
    st.forEach((s, i) => {
      const y = capI + i * p, col = T.ink, nw = s.warn ? IDL.labelW('Note') + 8 : 0;
      let q = tx(0, y, String(i + 1), { z: Z.item, c: col, tab: 1 }) + tx(nameX, y, s.t, { z: Z.item, c: T.ink });
      if (s.warn) q += label(lineX, y, 'Note', c, { c: T.ink });
      q += IDL.lines(lineX + nw, y, IDL.wrap(s.warn || s.line, W - lineX - nw, Z.body).slice(0, Math.max(2, Math.floor((p - 12) / G.LH.body))), { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
      if (i) q = ln(0, y - capI - (p - capI) / 2 + 4, W, y - capI - (p - capI) / 2 + 4, T.rule, HAIR) + q;
      out += vis(i, c, q);
    });
    return out;
  }
  /* 01-10-2026: a name wider than its column wraps (SD Card Cycle, "Convert and Rename" ran into "Check");
     every step's lines start on the same baseline, under the tallest name */
  const C = c.G.up(n), fz = Z.display, capF = G.cap(fz), ruleY = G.snap(capF + 8), nameB = ruleY + 16 + G.cap(Z.item);
  const names = st.map((s) => IDL.wrap(s.t, C.w, Z.item, 'g', 500)), nameL = Math.max(1, ...names.map((l) => l.length));
  const nameLH = Math.round(Z.item * 1.2), lineB = nameB + (nameL - 1) * nameLH + 24;
  st.forEach((s, i) => {
    const x = C.x(i), col = T.ink;
    let q = tx(x, capF, String(i + 1), { z: fz, c: col, tab: 1 });
    q += ln(x, ruleY, x + C.w, ruleY, col, INK);
    names[i].forEach((t, k) => { q += tx(x, nameB + k * nameLH, t, { z: Z.item, c: T.ink }); });
    if (s.warn) q += label(x, lineB, 'Note', c, { c: T.ink });
    q += IDL.lines(x, lineB + (s.warn ? 24 : 0), IDL.wrapPretty(s.warn || s.line, C.w, Z.body), { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
    /* 08-10-2026, his note on SD Card Cycle: "adımlar arasında oklar olmalı". `arrows: true` draws one
       arrow in the gutter between a step's rule and the next one's, on the rule's line */
    if (d.arrows && i < n - 1) {
      const a0 = x + C.w + 6, a1 = C.x(i + 1) - 6;
      if (a1 - a0 > 8) q += ln(a0, ruleY, a1, ruleY, col, INK) + '<path d="M' + r(a1 - 7) + ' ' + r(ruleY - 4.5) + 'L' + r(a1) + ' ' + r(ruleY) + 'L' + r(a1 - 7) + ' ' + r(ruleY + 4.5) + '" fill="none" stroke="' + col + '" stroke-width="' + INK + '"/>';
    }
    out += vis(i, c, q);
  });
  return out;
};
IDL.columns = columns; IDL.grow = grow;
})();
