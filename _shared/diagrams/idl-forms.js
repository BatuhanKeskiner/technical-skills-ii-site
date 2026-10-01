/* Forms added in v2 — each a reusable pattern filled from data; week 5 content is sample data only.
   Timeline with parallel rows · anatomy with callouts · paired images at one scale with a 100 % detail ·
   outlines superposed to scale · a curve on two labelled axes · a timed procedure · linked scales.
   Drawn in grid px on the page column: positions from ctx.G, sizes from G.Z, pitches from G.PITCH,
   rules from G.RULE. Top-anchored at y = 0. The signal marks one thing per unit (the datum flagged key). */
(function () {
const IDL = window.IDL, R = IDL.R, G = IDL.G, Z = G.Z, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis, label = IDL.label;
const HAIR = G.RULE.hair, INK = G.RULE.ink, CL = G.CLEAR, cap = G.cap;
const rect = (x, y, w, h, fill, st, sw, extra) => '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h) + '" fill="' + (fill || 'none') + '"' + (st ? ' stroke="' + st + '" stroke-width="' + sw + '"' : '') + (extra || '') + '/>';
const dot = (x, y, rr, fill) => '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + r(rr) + '" fill="' + fill + '"/>';
const maxW = (arr, f) => Math.max(0, ...arr.map(f));
/* an image, or — until the scan is supplied — a placeholder that names what goes there (never a drawn picture) */
const image = (x, y, w, h, im, c, id) => im && im.src
  ? '<image href="' + IDL.esc(im.src) + '" x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h) + '" preserveAspectRatio="xMidYMid slice"' + (im.clip ? ' clip-path="url(#' + id + ')"' : '') + '/>'
  : rect(x, y, w, h, c.T.field) + label(x + 8, y + 8 + cap(Z.label, 'm'), (im && im.alt) || 'Image', c);

/* ---------- TIMELINE WITH PARALLEL ROWS ----------
   { weeks: [label…] 3–8, rows: [{ place, cells: [text…], key? }] 2–4 }
   Places down, time across; a cell per row per period. An invariant (e.g. "one copy always away") reads as a row
   that is never empty. The key row's cells take the signal. */
R.rota = (d, c) => {
  const { T } = c, cg = c.G, n = d.weeks.length, rows = d.rows, capI = cap(Z.item), capB = cap(Z.body, 't');
  const lw = cg.line(maxW(rows, o => IDL.gw(o.place, Z.item)) + cg.gut), cw = (c.W - lw) / n, p = 56, head = 24;
  let out = d.weeks.map((w, j) => label(lw + j * cw, cap(Z.label, 'm'), w, c)).join('') + ln(0, head, c.W, head, T.ink, INK);
  rows.forEach((o, i) => {
    const y = head + i * p, base = y + p / 2 + capB / 2, col = o.key ? T.signal : T.ink;
    let q = (i ? ln(0, y, c.W, y, T.rule, HAIR) : '') + tx(0, y + p / 2 + capI / 2, o.place, { z: Z.item, c: T.ink });
    o.cells.forEach((s, j) => { if (s) q += tx(lw + j * cw, base, s, { f: 't', w: 400, z: Z.body, c: col }); });
    out += vis(i, c, q);
  });
  return out + ln(0, head + rows.length * p, c.W, head + rows.length * p, T.ink, INK);
};

/* ---------- ANATOMY WITH CALLOUTS ----------
   { image: { src?, alt, aspect }, parts: [{ name, note?, x, y (0–1 on the image), key? }] 2–8 }
   The object in columns 1–7; callouts in columns 9–12, in the order of their points top to bottom; leaders
   run level, then turn once to the point. Labels on the thing, never a key. */
R.callouts = (d, c) => {
  /* 30-09-2026: an upright picture (his negative, aspect 0.92) drew taller than the page and ran over the title;
     the picture now keeps to the room the page gives it, and the callouts move in beside it */
  const { T } = c, cg = c.G, a_ = d.image.aspect || 1.5, lim = Math.max(240, (c.room || 600) - 8);
  let iw = cg.span(7), ih = iw / a_;
  if (ih > lim) { ih = lim; iw = ih * a_; }
  const lx = Math.min(cg.x(8), cg.line(iw + 64)), capI = cap(Z.item);
  const parts = d.parts.map((p, i) => Object.assign({ i }, p)).sort((a, b) => a.y - b.y), n = parts.length;
  const p = Math.max(56, G.snap(Math.min(80, ih / n)) ), top = Math.max(0, (ih - p * (n - 1)) / 2);
  let out = image(0, 0, iw, ih, d.image, c);
  parts.forEach((o, k) => {
    const px = o.x * iw, py = o.y * ih, ly = top + k * p, col = o.key ? T.signal : T.ink, bend = iw + 16;
    let q = dot(px, py, 4, col) + pa('M' + r(px) + ',' + r(py) + 'L' + r(bend) + ',' + r(ly) + 'H' + r(lx - CL), col, HAIR);
    q += tx(lx, ly + capI / 2, o.name, { z: Z.item, c: col }) + (o.note ? label(lx, ly + capI / 2 + 20, o.note, c) : '');
    out += vis(k, c, q);
  });
  return out;
};

/* ---------- PAIRED IMAGES AT ONE SCALE, WITH A 100 % DETAIL ----------
   { pair: [{ label, src?, alt }, { label, src?, alt, key? }], aspect, detail: { x, y, w (0–1 of the image) } }
   Two frames on the 2-up grid at the same size; under each, the same crop at 100 %, joined to its box.
   Only what differs may change between the two. */
R.pairImg = (d, c) => {
  /* the frames and their details share the height the page leaves: frames 3/5, details 2/5; both keep the images' aspect */
  const { T } = c, C = c.G.up(2), dt = d.detail, capI = cap(Z.item), avail = (c.room || 560) - 40 - 32 - 40, a = d.aspect || 1.5;
  const fh = Math.min(C.w / a, avail * 0.6), fw = fh * a, dh = Math.min(fw * 0.5, avail - fh);
  let out = '';
  d.pair.forEach((im, i) => {
    const x = C.x(i), col = im.key ? T.signal : T.ink, bx = x + dt.x * fw, by = 40 + dt.y * fh, bw = dt.w * fw, bh = bw * dh / fw, dy = 40 + fh + 32;
    let q = tx(x, capI, im.label, { z: Z.item, c: col }) + image(x, 40, fw, fh, im, c) + rect(bx, by, bw, bh, 'none', col, INK);
    q += pa('M' + r(bx) + ',' + r(by + bh) + 'L' + r(x) + ',' + r(dy) + 'M' + r(bx + bw) + ',' + r(by + bh) + 'L' + r(x + fw) + ',' + r(dy), col, HAIR);
    q += image(x, dy, fw, dh, Object.assign({}, im, { alt: (im.alt || 'Image') + ' — 100 % detail' }), c) + rect(x, dy, fw, dh, 'none', col, INK) + label(x, dy + dh + 16 + cap(Z.label, 'm'), '100 %', c);
    out += vis(i, c, q);
  });
  return out;
};

/* ---------- OUTLINES SUPERPOSED TO SCALE ----------
   { unit, shapes: [{ name, w, h, key? }] 2–6 }
   All outlines share one corner and one scale, largest behind; each named inside its own top-right corner.
   Size is read by area, so nothing is drawn that is not to scale. */
R.outlines = (d, c) => {
  const { T } = c, sh = [...d.shapes].sort((a, b) => b.w * b.h - a.w * a.h), capL = cap(Z.label, 'm');
  const k = Math.min(c.G.span(9) / maxW(sh, o => o.w), ((c.room || 560) - 48) / maxW(sh, o => o.h)), H = maxW(sh, o => o.h) * k, BW = maxW(sh, o => o.w) * k;
  let out = '';
  sh.forEach((o, i) => {
    const w = o.w * k, h = o.h * k, col = o.key ? T.signal : T.ink, y = H - h;
    out += vis(i, c, rect(0, y, w, h, 'none', col, o.key ? INK * 1.5 : INK) + tx(w - 8, y + 8 + cap(Z.body, 't'), o.name, { f: 't', w: 400, z: Z.body, c: col, a: 'end' }) +
      label(w - 8, y + 8 + cap(Z.body, 't') + 20, o.w + ' × ' + o.h + ' ' + d.unit, c, { a: 'end', up: false }));
  });
  return out + label(0, H + 16 + capL, 'All to one scale', c);
};

/* ---------- A CURVE ON TWO LABELLED AXES ----------
   { x: { label, min, max, ticks, log? }, y: { label, min, max, ticks }, series: [{ name, pts: [[x, y]…], key? }] 1–4 }
   Axes named in words at their ends; each series named at its right end (direct labels, no legend). */
R.curve = (d, c) => {
  const { T } = c, cg = c.G, capL = cap(Z.label, 'm'), x0 = cg.x(1), ph = 320, top = 24, sl = maxW(d.series, s => IDL.gw(s.name, Z.body, 400, 't')), x1 = Math.min(cg.x(9) + cg.col, c.W - 16 - sl);
  const lg = d.x.log, X = v => x0 + (x1 - x0) * (lg ? Math.log(v / d.x.min) / Math.log(d.x.max / d.x.min) : (v - d.x.min) / (d.x.max - d.x.min));
  const Y = v => top + ph - ph * (v - d.y.min) / (d.y.max - d.y.min);
  let out = label(0, capL, d.y.label, c) + ln(x0, top, x0, top + ph, T.ink, INK) + ln(x0, top + ph, x1, top + ph, T.ink, INK);
  d.y.ticks.forEach(t => out += ln(x0, Y(t), x1, Y(t), T.rule, HAIR) + label(x0 - 12, Y(t) + capL / 2, String(t), c, { a: 'end' }));
  d.x.ticks.forEach(t => out += ln(X(t), top + ph, X(t), top + ph + 6, T.ink, HAIR) + label(X(t), top + ph + 6 + 12 + capL, String(t), c, { a: 'middle' }));
  out += label(x1, top + ph + 6 + 12 + capL + 24, d.x.label, c, { a: 'end' });
  const ends = [];
  d.series.forEach((s, i) => {
    const col = s.key ? T.signal : T.ink, pts = s.pts.map(p => [X(p[0]), Y(p[1])]), e = pts[pts.length - 1];
    let ly = e[1]; while (ends.some(v => Math.abs(v - ly) < 20)) ly += 20; ends.push(ly);
    out += vis(i, c, pa('M' + pts.map(p => r(p[0]) + ',' + r(p[1])).join('L'), col, s.key ? INK * 1.5 : INK) + tx(x1 + 16, ly + cap(Z.body, 't') / 2, s.name, { f: 't', w: 400, z: Z.body, c: col }));
  });
  return out;
};

/* ---------- A TIMED PROCEDURE ----------
   { unit, steps: [{ t, dur, set?, line?, key? }] 3–7 }
   One row per step, numbered; the time bar is to scale on one axis, the running clock at its end;
   the setting (a temperature, a speed) in the step's own row. */
R.timed = (d, c) => {
  const { T } = c, cg = c.G, st = d.steps, total = st.reduce((a, s) => a + s.dur, 0), capI = cap(Z.item), capB = cap(Z.body, 't');
  const nx = 0, bx0 = cg.x(3), bx1 = cg.x(8) - cg.gut - 32, sx = cg.x(8), p = 56, head = 24, X = t => bx0 + (bx1 - bx0) * t / total;
  let out = label(bx0, cap(Z.label, 'm'), 'Time, ' + d.unit, c) + label(sx, cap(Z.label, 'm'), 'Setting', c) + ln(0, head, c.W, head, T.ink, INK), t = 0;
  st.forEach((s, i) => {
    const y = head + i * p, cy = y + p / 2, col = s.key ? T.signal : T.ink;
    let q = (i ? ln(0, y, c.W, y, T.rule, HAIR) : '') + tx(nx, cy + capI / 2, (i + 1) + '  ' + s.t, { z: Z.item, c: T.ink });
    q += rect(X(t), cy - 6, Math.max(2, X(t + s.dur) - X(t)), 12, col) + label(X(t + s.dur) + 8, cy + cap(Z.label, 'm') / 2, String(t + s.dur), c, { up: false });
    if (s.set) q += tx(sx, cy + capB / 2, s.set, { f: 't', w: 400, z: Z.body, c: T.ink });
    out += vis(i, c, q); t += s.dur;
  });
  return out + ln(0, head + st.length * p, c.W, head + st.length * p, T.ink, INK);
};

/* ---------- LINKED SCALES ----------
   { scales: [{ label, stops: [text…] }] 2–4, key? (stop index) }
   Parallel scales whose stops line up: one position, one equivalent on every scale. Hairlines join each stop
   across the scales; the key stop is joined in signal. */
R.linked = (d, c) => {
  const { T } = c, cg = c.G, n = d.scales[0].stops.length, half = maxW(d.scales.flatMap(s => s.stops), v => IDL.gw(v, Z.item)) / 2 + 8, x0 = cg.x(3) + half, x1 = c.W - half, X = j => x0 + (x1 - x0) * j / (n - 1), p = 64, capL = cap(Z.label, 'm'), capI = cap(Z.item);
  const k = d.key, y = i => i * p + 32;
  let out = '';
  for (let j = 0; j < n; j++) out += vis(j, c, ln(X(j), y(0) - 12, X(j), y(d.scales.length - 1) + 12, j === k ? T.signal : T.rule, j === k ? INK : HAIR));
  d.scales.forEach((s, i) => {
    out += label(0, y(i) + capL / 2, s.label, c) + ln(x0, y(i), x1, y(i), T.ink, INK);
    s.stops.forEach((v, j) => { const w = IDL.gw(v, Z.item) + 16; out += vis(j, c, rect(X(j) - w / 2, y(i) - capI / 2 - 8, w, capI + 16, T.bg) + tx(X(j), y(i) + capI / 2, v, { z: Z.item, c: j === k ? T.signal : T.ink, a: 'middle', tab: 1 })); });
  });
  return out;
};

/* ---------- sample data: week 5 ---------- */
})();
