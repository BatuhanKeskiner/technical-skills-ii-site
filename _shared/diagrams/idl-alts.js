/* Design's alternative drawings C, D and E for the 16 week-5 topics — IDL.ALT[0..15], 48 drawings.
   Ported 30-09-2026 from `from claude design/v2/information-design-v2/js/07-alt01-04.js`, 08-alt05-08.js,
   09-alt09-12.js and 10-alt13-16.js, unchanged except that the three helpers the first file defined
   (rect, dot, fitZ) now live in idl-core.js, and one fault is mended where it was drawn (16E: a leader
   ran through two labels; marked "port" in place). Their content is written inside the code: they are week 5's
   drawings, not reusable forms. The topic data the renders read (d) is Design's own, from 04-content.js,
   at the foot of this file as IDL.ALT_DATA.

   A page uses one through the form `alt`:
     { type: 'diagram', form: 'alt', data: { topic: 0-15, key: 'C' | 'D' | 'E' } }
   The table of all 48, with the week 5 step each fits: _notes/DESIGN-ALTERNATIVES.md. */
/* ---- from 07-alt01-04.js ---- */
/* Alternatives C, D, E — pages 01–04. Each is a different method of delivery, not a restyle. */
(function () {
const IDL = window.IDL, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis;
const ALT = IDL.ALT = IDL.ALT || {};
const rect = IDL.rect, dot = IDL.dot, fitZ = IDL.fitZ; /* in idl-core.js since the port */

/* ================= 01 File formats ================= */
ALT[0] = [
{ key: 'C', name: 'Format lifelines', method: 'Swimlane ledger (Tufte, small multiples of presence)', why: 'Shows how long each format lives: TIFF runs from scan to print, RAW ends at import, JPEG only appears at the end.',
  render(d, c) {
    const { W, H, T, u, sw } = c, cols = IDL.columnsOf(d.stages), F = ['RAW', 'TIFF', 'DNG', 'PSD', 'JPEG', 'PDF'];
    const lw = IDL.mw('JPEG', c.S) + 6 * u, cw = (W - lw) / cols.length, cx = i => lw + (i + 0.5) * cw;
    const hz = fitZ(cols.map(col => col.map(s => s.name).join(' · ')), c.P * 0.8, cw - 2 * u), headH = hz + 2 * u + c.Q + 4 * u;
    const rowH = (H - headH) / F.length;
    let out = '';
    cols.forEach((col, i) => {
      const key = col.some(s => s.key);
      out += vis(i, c, tx(cx(i), hz * 0.8, col.map(s => s.name).join(' · '), { z: hz, c: key ? T.signal : T.ink, a: 'middle' }));
      if (i < cols.length - 1) { const l = d.links.find(l => col.some(s => s.id === l.from)); out += vis(i + 1, c, tx(lw + (i + 1) * cw, hz + 2 * u + c.Q * 0.8, '→ ' + l.label, { f: 'm', z: c.Q, c: T.mute, a: 'middle' })); }
    });
    out += ln(0, headH - 2 * u, W, headH - 2 * u, T.ink, sw);
    F.forEach((f, j) => {
      const y = headH + (j + 0.5) * rowH, has = cols.map(col => col.some(s => (s.tags || []).includes(f)));
      out += tx(0, y + c.S * 0.36, f, { f: 'm', z: c.S, c: T.ink }) + ln(lw, y, W, y, T.rule, c.hair);
      has.forEach((h, i) => { if (h && has[i + 1]) out += vis(i + 1, c, ln(cx(i), y, cx(i + 1), y, T.ink, sw * 2)); });
      has.forEach((h, i) => { if (h) out += vis(i, c, dot(cx(i), y, u * 1.2, T.ink)); });
    });
    return out;
  } },
{ key: 'D', name: 'Follow one file', method: 'Worked example: one concrete instance through every stage', why: 'The name stays the same; only the extension changes. Students watch one of their own files, not a category.',
  render(d, c) {
    const { W, H, T, u, sw } = c;
    const S = [{ n: 'Camera', stem: 'IMG_0125', ext: '.CR3' }, { n: 'Edit', stem: '', ext: '.DNG' }, { n: 'Store', stem: '', ext: '.PSD', key: 1 }, { n: 'Screen', ext: '.JPG', out: 1 }, { n: 'Print', ext: '.TIF', out: 1 }];
    const acts = ['Import', 'Save', 'Export'], C = IDL.columns(4, c, 6), ez = Math.min(c.P * 2.2, C.w / (4 * 0.62)), stem = '20261001_Cezanne_Paul_BK_0125';
    const stemZ = fitZ([stem], c.S * 1.2, C.x(2) + C.w - C.x(1), 'm');
    const top = (H - (c.Q + 2 * u + stemZ + 4 * u + c.P + 2 * u + ez * 2 + 4 * u)) / 2, yN = top + c.Q + 2 * u + stemZ + 4 * u + c.P * 0.8, yE = yN + c.P * 0.2 + 2 * u + ez * 0.8;
    let out = tx(C.x(0), top + c.Q * 0.8, 'File name', { f: 'm', z: c.Q, c: T.mute });
    out += vis(0, c, tx(C.x(0), top + c.Q + 2 * u + stemZ * 0.8, 'IMG_0125', { f: 'm', z: stemZ, c: T.ink, up: false, ls: 0 }));
    out += vis(1, c, tx(C.x(1), top + c.Q + 2 * u + stemZ * 0.8, stem, { f: 'm', z: stemZ, c: T.ink, up: false, ls: 0 }) + ln(C.x(1), top + c.Q + 2 * u + stemZ + u, C.x(3) + C.w, top + c.Q + 2 * u + stemZ + u, T.ink, sw) + tx(C.x(3) + C.w, top + c.Q * 0.8, 'Stays the same from here', { f: 'm', z: c.Q, c: T.mute, a: 'end' }));
    [0, 1, 2].forEach(i => {
      const s = S[i], x = C.x(i);
      out += vis(i, c, tx(x, yN, s.n, { z: c.P, c: s.key ? T.signal : T.ink }) + tx(x, yE, s.ext, { f: 'm', z: ez, c: s.key ? T.signal : T.ink, up: false, ls: 0 }));
      const ax = x + IDL.gw(s.n, c.P) + 3 * u, bx = C.x(i + 1) - 2 * u, ay = yN - c.P * 0.33;
      out += vis(i + 1, c, ln(ax, ay, bx - sw, ay, T.ink, sw) + IDL.arrow(bx, ay, T.ink, sw) + tx((ax + bx) / 2, ay - 1.25 * u, acts[i], { f: 'm', z: c.S * 0.85, c: T.ink, a: 'middle' }));
    });
    const x3 = C.x(3), ez2 = ez * 0.62;
    out += vis(3, c, tx(x3, yN, 'Screen', { z: c.P, c: T.ink }) + tx(x3 + IDL.gw('Screen ', c.P), yN, '.JPG', { f: 'm', z: c.S * 1.1, c: T.ink, up: false, ls: 0 }) +
      tx(x3, yN + 3 * u + c.P, 'Print', { z: c.P, c: T.ink }) + tx(x3 + IDL.gw('Screen ', c.P), yN + 3 * u + c.P, '.TIF', { f: 'm', z: c.S * 1.1, c: T.ink, up: false, ls: 0 }) +
      IDL.lines(x3, yN + 6 * u + c.P * 2, IDL.wrap('Two copies made from the master', C.w, c.Q), { f: 't', w: 400, z: c.Q, c: T.ink }, c.Q * 1.35));
    return out;
  } },
{ key: 'E', name: 'System boundary', method: 'Block diagram with a drawn boundary (input–process–output)', why: 'Separates what happens on devices from what happens on the computer: the box is the computer, so a box is justified.',
  render(d, c) {
    const { W, H, T, u, sw } = c, bx0 = W * 0.27, bx1 = W * 0.73, nz = c.P, A = {};
    const regionX = { 0: W * 0.1, 1: bx0 + (bx1 - bx0) * 0.27, 2: bx0 + (bx1 - bx0) * 0.73, 3: W * 0.9 };
    const cols = IDL.columnsOf(d.stages), blockH = s => nz + (s.tags || []).length * (c.Q * 1.3) + 2 * u, pitch = Math.max(...cols.filter(col => col.length > 1).flatMap(col => col.map(blockH))) + 4 * u;
    let body = '';
    cols.forEach((col, ci) => col.forEach((s, i) => {
      const x = regionX[ci], y = H / 2 + (i - (col.length - 1) / 2) * pitch, hw = Math.max(IDL.gw(s.name, nz), ...(s.tags || []).map(t => IDL.mw(t, c.Q))) / 2;
      A[s.id] = { inX: x - hw - 2 * u, outX: x + hw + 2 * u, y, col: ci };
      body += vis(ci, c, tx(x, y + nz * 0.36, s.name, { z: nz, c: s.key ? T.signal : T.ink, a: 'middle' }) + (s.tags || []).map((t, k) => tx(x, y + nz * 0.5 + 2 * u + c.Q * 0.8 + k * c.Q * 1.3, t, { f: 'm', z: c.Q, c: T.mute, a: 'middle' })).join(''));
    }));
    const ins = Object.values(A), L0 = Math.min(...ins.filter(a => a.col === 1).map(a => a.inX)) - 1.5 * u, R0 = Math.max(...ins.filter(a => a.col === 2).map(a => a.outX)) + u;
    const bt = H / 2 - pitch - 4 * u - c.Q, bb = H / 2 + pitch;
    let box = rect(L0, Math.max(0, bt), R0 - L0, Math.min(H, bb) - Math.max(0, bt), 'none', T.ink, sw) + tx(L0 + 3 * u, Math.max(0, bt) + 3 * u + c.Q * 0.8, 'On the computer', { f: 'm', z: c.Q, c: T.ink });
    box += tx(regionX[0], Math.max(0, bt) + 3 * u + c.Q * 0.8, 'Devices in', { f: 'm', z: c.Q, c: T.mute, a: 'middle' }) + tx(regionX[3], Math.max(0, bt) + 3 * u + c.Q * 0.8, 'Out', { f: 'm', z: c.Q, c: T.mute, a: 'middle' });
    return box + IDL.route(d.stages, d.links, A, c, c.S * 0.85) + body;
  } }
];

/* ================= 02 Folder structure ================= */
const walk = (root, path) => {
  const nodes = []; (function w(n, dep, par) { const o = { name: n.name, dep, par, kids: [] }; nodes.push(o); if (par) par.kids.push(o); (n.children || []).forEach(ch => w(ch, dep + 1, o)); })(root, 0, null);
  let cur = nodes[0]; if (path && cur.name === path[0]) { cur.hl = 1; path.slice(1).forEach(p => { cur = cur && cur.kids.find(k => k.name === p); if (cur) cur.hl = 1; }); }
  return nodes;
};
const LEVEL = ['Root', 'Year', 'Project', 'Shoot'];
ALT[1] = [
{ key: 'C', name: 'Nested folders', method: 'Containment diagram (enclosure shows hierarchy)', why: 'A folder is a container, so drawing each folder inside its parent shows the relation literally.',
  render(d, c) {
    const { W, H, T, u, sw } = c, nodes = walk(d.root, d.path), z = c.P * 0.75, hh = z * 1.2 + 2 * u, pad = 2 * u;
    const nat = o => o.nat = o.kids.length ? Math.max(IDL.gw(o.name, z) + 4 * u, o.kids.reduce((a, k) => a + nat(k), 0) + pad * (o.kids.length + 1)) : IDL.gw(o.name, z) + 4 * u;
    nat(nodes[0]);
    const D = Math.max(...nodes.map(o => o.dep));
    let out = '';
    const lay = (o, x, y, w, h) => {
      const col = o.hl ? T.signal : (o.dep ? T.ink : T.ink);
      out += vis(o.dep, c, rect(x, y, w, h, 'none', o.hl ? T.signal : T.ink, o.hl ? sw : c.hair * 1.5) + tx(x + 2 * u, y + 2 * u + z * 0.8, o.name, { z, c: col }));
      if (!o.kids.length) return;
      const inner = w - pad * (o.kids.length + 1), sum = o.kids.reduce((a, k) => a + k.nat, 0);
      let kx = x + pad;
      o.kids.forEach(k => { const kw = k.nat + (inner - sum) * (k.nat / sum); lay(k, kx, y + hh, kw, h - hh - pad); kx += kw + pad; });
    };
    const top = Math.max(0, (H - (hh * (D + 1) + c.P * 2)) / 2);
    lay(nodes[0], 0, 0, W, H);
    return out;
  } },
{ key: 'D', name: 'Column browser', method: 'Miller columns — the view students use in Finder', why: 'Matches what they will see on screen: pick one folder per column, left to right.',
  render(d, c) {
    const { W, H, T, u, sw } = c, nodes = walk(d.root, d.path), D = Math.max(...nodes.map(o => o.dep)), C = IDL.columns(D + 1, c, 0);
    const lists = [[nodes[0]]]; for (let dep = 1; dep <= D; dep++) { const sel = lists[dep - 1].find(o => o.hl); lists.push(sel ? sel.kids : []); }
    const z = fitZ(nodes.map(o => o.name), c.P * 1.1, C.w - 8 * u), top = c.Q + 4 * u, rowH = Math.min((H - top) / 3, z * 2.6);
    let out = '';
    lists.forEach((list, i) => {
      const x = C.x(i);
      let q = tx(x + 2 * u, c.Q * 0.8, LEVEL[i] || '', { f: 'm', z: c.Q, c: T.mute }) + (i ? ln(x, top - 2 * u, x, H, T.rule, c.hair) : '');
      list.forEach((o, j) => {
        const y = top + j * rowH, cy = y + rowH / 2;
        q += tx(x + 2 * u, cy + z * 0.36, o.name, { z, c: o.hl ? T.signal : T.ink });
        if (o.hl && i < D) q += pa('M' + r(x + C.w - 4 * u) + ',' + r(cy - u) + 'L' + r(x + C.w - 3 * u) + ',' + r(cy) + 'L' + r(x + C.w - 4 * u) + ',' + r(cy + u), T.signal, sw);
        if (o.hl) q += ln(x + 2 * u, cy + z * 0.6, x + C.w - 6 * u, cy + z * 0.6, T.signal, sw);
      });
      out += vis(i, c, q);
    });
    return ln(0, top - 2 * u, W, top - 2 * u, T.ink, sw) + out;
  } },
{ key: 'E', name: 'Rule per level', method: 'Schema table: the pattern at each level, with one example', why: 'Teaches how to make any folder, not just these: each level has one naming rule.',
  render(d, c) {
    const { W, H, T, u, sw } = c;
    const rows = [['Root', 'One per drive', 'Photography'], ['Year', 'YYYY', '2026'], ['Project', 'What it is for', 'TS2 Assignments'], ['Shoot', 'YYYYMMDD_Subject', '20261001_Portrait']];
    const hz = c.Q, headH = hz + 3 * u, rowH = (H - headH) / rows.length, z = Math.min(c.P, rowH * 0.45);
    const w0 = IDL.mw('Project', c.S) + 8 * u, w1 = IDL.mw('YYYYMMDD_Subject', c.S) + 8 * u, x2 = w0 + w1;
    let out = tx(0, hz * 0.8, 'Level', { f: 'm', z: hz, c: T.mute }) + tx(w0, hz * 0.8, 'Rule', { f: 'm', z: hz, c: T.mute }) + tx(x2, hz * 0.8, 'Example', { f: 'm', z: hz, c: T.mute }) + ln(0, headH, W, headH, T.ink, sw);
    rows.forEach((rw, i) => {
      const cy = headH + (i + 0.5) * rowH, ex = x2 + i * 5 * u;
      let q = tx(0, cy + c.S * 0.36, rw[0], { f: 'm', z: c.S, c: T.ink }) + tx(w0, cy + c.S * 0.36, rw[1], { f: 'm', z: c.S, c: T.ink, up: rw[1] === rw[1].toUpperCase() });
      q += tx(ex, cy + z * 0.36, rw[2], { z, c: i === rows.length - 1 ? T.signal : T.ink });
      if (i) q += pa('M' + r(ex - 5 * u + 2 * u) + ',' + r(cy - rowH + z * 0.6 + u) + 'V' + r(cy) + 'H' + r(ex - u), T.ink, sw);
      out += vis(i, c, q);
    });
    return out;
  } }
];

/* ================= 03 File naming ================= */
ALT[2] = [
{ key: 'C', name: 'Built part by part', method: 'Cumulative construction — one part added per line', why: 'Each line adds one part, so the name is learnt in the order it is written; it also steps naturally.',
  render(d, c) {
    const { W, H, T, u } = c, parts = d.parts, steps = []; let acc = '';
    parts.forEach((p, i) => { if (p.sep) return; const before = acc; acc = parts.slice(0, i + 1).map(q => q.t).join(''); steps.push({ before, add: acc.slice(before.length), p }); });
    const n = steps.length, rowH = H / n, full = acc.length, labW = Math.max(...steps.map(s => IDL.gw('+ ' + s.p.label, c.P * 0.8))) + 6 * u;
    const z = Math.min((W - labW) / (full * 0.6), rowH * 0.6), cw = z * 0.6;
    let out = '';
    steps.forEach((s, i) => {
      const cy = (i + 0.5) * rowH, col = s.p.key ? T.signal : T.ink;
      let q = tx(0, cy + c.P * 0.3, '+ ' + s.p.label, { z: c.P * 0.8, c: col }) + tx(0, cy + c.P * 0.3 + u + c.Q, s.p.note || '', { f: 'm', z: c.Q, c: T.mute });
      q += tx(labW, cy + z * 0.36, s.before, { f: 'm', z, c: T.mute, up: false, ls: 0, w: 400 }) + tx(labW + s.before.length * cw, cy + z * 0.36, s.add, { f: 'm', z, c: col, up: false, ls: 0, w: 400 });
      if (i) q = ln(0, i * rowH, W, i * rowH, T.rule, c.hair) + q;
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'D', name: 'Pattern over example', method: 'Transposed table: parts as columns, pattern / example / reason as rows', why: 'Shows the template and one filled-in instance aligned, so students can write their own.',
  render(d, c) {
    const { W, H, T, u, sw } = c, P = d.parts.filter(p => !p.sep), pat = { Date: 'YYYYMMDD', Subject: 'Last_First', Initials: 'II', Sequence: '0000' }, why = { Date: 'Sorts by time', Subject: 'Who is in it', Initials: 'Who made it', Sequence: 'Order in the day' };
    const rows = [['Part', p => p.label, 'g'], ['Pattern', p => pat[p.label] || '', 'm'], ['Example', p => p.t, 'm'], ['Why', p => why[p.label] || p.note, 't']];
    const lw = IDL.mw('Pattern', c.Q) + 6 * u, sepW = IDL.mw('_', c.S * 1.4) + 2 * u;
    let z = c.S * 1.4; const need = zz => P.map(p => Math.max(IDL.mw(p.t, zz), IDL.mw(pat[p.label] || '', zz), IDL.gw(p.label, c.P * 0.8), IDL.gw(why[p.label] || '', c.B, 400, 't')));
    let ws = need(z); while (ws.reduce((a, b) => a + b, 0) + sepW * (P.length - 1) + lw > W && z > c.Q) { z -= 0.5; ws = need(z); }
    const extra = (W - lw - ws.reduce((a, b) => a + b, 0) - sepW * (P.length - 1)) / P.length, xs = []; let x = lw;
    ws.forEach(w => { xs.push(x); x += w + extra + sepW; });
    const rowH = H / rows.length;
    let out = '';
    rows.forEach(([lab, get, f], i) => {
      const cy = (i + 0.5) * rowH;
      out += tx(0, cy + c.Q * 0.36, lab, { f: 'm', z: c.Q, c: T.mute }) + (i ? ln(0, i * rowH, W, i * rowH, i === 1 ? T.ink : T.rule, i === 1 ? sw : c.hair) : '');
      P.forEach((p, j) => {
        const v = get(p), col = p.key && i === 2 ? T.signal : T.ink;
        out += vis(j, c, f === 'g' ? tx(xs[j], cy + c.P * 0.28, v, { z: c.P * 0.8, c: T.ink }) : f === 'm' ? tx(xs[j], cy + z * 0.36, v, { f: 'm', z, c: col, up: false, ls: 0, w: 400 }) : tx(xs[j], cy + c.B * 0.36, v, { f: 't', w: 400, z: c.B, c: T.ink }));
        if (j < P.length - 1 && (i === 1 || i === 2)) out += tx(xs[j] + ws[j] + extra + sepW / 2, cy + z * 0.36, '_', { f: 'm', z, c: T.mute, a: 'middle', ls: 0 });
      });
    });
    return out;
  } },
{ key: 'E', name: 'Write this, not that', method: 'Contrasting cases: each rule with a right and a wrong example', why: 'Non-examples teach the boundary of a rule; the wrong forms are the ones students actually use.',
  render(d, c) {
    const { W, H, T, u, sw } = c;
    const rows = [['Date first, year-month-day', '20261001', '01-10-2026'], ['Underscores, never spaces', 'Cezanne_Paul', 'Cezanne Paul'], ['No accents or symbols', 'Cezanne', 'Cézanne'], ['Four-digit sequence', '0125', '125']];
    const hz = c.Q, headH = hz + 3 * u, rowH = (H - headH) / rows.length, rw = W * 0.42, x1 = rw + 4 * u, x2 = x1 + (W - x1) / 2;
    let out = tx(0, hz * 0.8, 'Rule', { f: 'm', z: hz, c: T.mute }) + tx(x1, hz * 0.8, 'Write', { f: 'm', z: hz, c: T.mute }) + tx(x2, hz * 0.8, 'Not', { f: 'm', z: hz, c: T.mute }) + ln(0, headH, W, headH, T.ink, sw);
    rows.forEach((row, i) => {
      const cy = headH + (i + 0.5) * rowH, z = c.S * 1.3, lines = IDL.wrap(row[0], rw, c.P * 0.75, 'g', 500).slice(0, 2), lh = c.P * 0.9;
      let q = IDL.lines(0, cy - (lines.length - 1) * lh / 2 + c.P * 0.27, lines, { z: c.P * 0.75, c: T.ink }, lh);
      q += tx(x1, cy + z * 0.36, row[1], { f: 'm', z, c: T.ink, up: false, ls: 0, w: 400 });
      const nw = IDL.mw(row[2], z) * 0.97;
      q += tx(x2, cy + z * 0.36, row[2], { f: 'm', z, c: T.mute, up: false, ls: 0, w: 400 }) + ln(x2 - u, cy, x2 + nw + u, cy, T.signal, sw);
      if (i) q = ln(0, headH + i * rowH, W, headH + i * rowH, T.rule, c.hair) + q;
      out += vis(i, c, q);
    });
    return out;
  } }
];

/* ================= 04 File naming — sorting ================= */
const dayOf = s => parseInt(s, 10);
ALT[3] = [
{ key: 'C', name: 'Order on a time line', method: 'Path along a time axis — list order drawn as a route through the dates', why: 'A scattered order becomes a zigzag; a date-first order becomes a straight run to the right.',
  render(d, c) {
    const { W, H, T, u, sw } = c, lw = Math.max(IDL.gw(d.before.label, c.P * 0.8), IDL.gw(d.after.label, c.P * 0.8)) + 6 * u;
    const x0 = lw + 3 * u, x1 = W - 3 * u, X = day => x0 + (x1 - x0) * (day - 1) / 14, axH = c.Q + 3 * u, tr = (H - axH - 4 * u) / 2;
    let out = ln(x0, H - axH, x1, H - axH, T.ink, sw);
    [1, 5, 10, 15].forEach(dd => out += ln(X(dd), H - axH, X(dd), H - axH + u, T.ink, c.hair) + tx(X(dd), H - axH + u + c.Q, dd + ' Oct', { f: 'm', z: c.Q, c: T.mute, a: dd === 15 ? 'end' : 'middle', up: false }));
    [d.before, d.after].forEach((p, i) => {
      const y0 = i * (tr + 2 * u), cy = y0 + tr / 2, pts = p.rows.map((rw, j) => [X(dayOf(rw[1])), y0 + tr * (0.2 + 0.6 * j / (p.rows.length - 1))]);
      let q = tx(0, cy + c.P * 0.28, p.label, { z: c.P * 0.8, c: T.ink }) + tx(0, cy + c.P * 0.28 + u + c.Q, 'Sorted by name', { f: 'm', z: c.Q, c: T.mute });
      q += ln(x0, y0 + tr, x1, y0 + tr, T.rule, c.hair);
      q += pa('M' + pts.map(p => r(p[0]) + ',' + r(p[1])).join('L'), i ? T.ink : T.signal, sw);
      pts.forEach((pt, j) => q += dot(pt[0], pt[1], u * 2.2, T.bg, i ? T.ink : T.signal, sw) + tx(pt[0], pt[1] + c.Q * 0.36, String(j + 1), { f: 'm', z: c.Q, c: T.ink, a: 'middle' }));
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'D', name: 'Contact sheet order', method: 'Sequence of frames: position in the row is position in the folder', why: 'Reads like a contact sheet: the dates on the tiles either run in order or they do not. Legible from the back.',
  render(d, c) {
    const { W, H, T, u, sw } = c, n = d.before.rows.length, lw = Math.max(IDL.gw(d.before.label, c.P * 0.8), IDL.gw(d.after.label, c.P * 0.8)) + 6 * u;
    const gap = 3 * u, tw = Math.min((W - lw - gap * (n - 1)) / n, (H - 6 * u - 2 * c.Q) / 2 * 1.2), th = Math.min(tw / 1.2, (H - 6 * u) / 2 - c.Q - 2 * u);
    let out = '';
    [d.before, d.after].forEach((p, i) => {
      const y = i * (th + c.Q + 2 * u + 6 * u);
      let q = tx(0, y + c.Q + 2 * u + th / 2 + c.P * 0.28, p.label, { z: c.P * 0.8, c: T.ink });
      p.rows.forEach((rw, j) => {
        const x = lw + j * (tw + gap), dd = rw[1].split(' ');
        q += tx(x, y + c.Q * 0.8, String(j + 1), { f: 'm', z: c.Q, c: T.mute });
        q += rect(x, y + c.Q + 2 * u, tw, th, 'none', T.ink, sw) + tx(x + tw / 2, y + c.Q + 2 * u + th * 0.62, dd[0], { z: th * 0.5, c: T.ink, a: 'middle', tab: 1 }) + tx(x + tw / 2, y + c.Q + 2 * u + th * 0.62 + c.Q * 1.3, dd[1], { f: 'm', z: c.Q, c: T.mute, a: 'middle' });
      });
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'Why it works', method: 'Mechanism: the character the computer compares, marked in each list', why: 'Explains the cause, not only the effect: sorting compares the first character that differs.',
  render(d, c) {
    const { W, H, T, u, sw } = c, blocks = [[d.before, 0, 1, 'Sorted on the first letter: D · f · I · p — not the date'], [d.after, 6, 2, 'Sorted on the day: 01 · 03 · 08 · 15']];
    const n = d.after.rows.length, bh = (H - 6 * u) / 2, rowH = (bh - c.S - 3 * u) / n;
    const z = Math.min(rowH * 0.62, W / (Math.max(...d.after.rows.map(x => x[0].length)) * 0.6)), cw = z * 0.6;
    let out = '';
    blocks.forEach(([p, ci, cn, note], i) => {
      const y0 = i * (bh + 6 * u);
      let q = rect(ci * cw - u / 2, y0, cn * cw + u, n * rowH, T.field) + ln(ci * cw - u / 2, y0, ci * cw + cn * cw + u / 2, y0, T.signal, sw);
      p.rows.forEach((rw, j) => q += tx(0, y0 + (j + 0.62) * rowH, rw[0], { f: 'm', z, c: T.ink, up: false, ls: 0, w: 400 }));
      q += tx(0, y0 + n * rowH + 3 * u + c.S * 0.8, note, { f: 't', w: 400, z: c.S, c: T.ink });
      out += vis(i, c, q);
    });
    return out;
  } }
];
})();

/* ---- from 08-alt05-08.js ---- */
/* Alternatives C, D, E — pages 05–08. */
(function () {
const IDL = window.IDL, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis, rect = IDL.rect, dot = IDL.dot, fitZ = IDL.fitZ, ALT = IDL.ALT;
const num = s => parseFloat(String(s).replace(/,/g, ''));
const logX = (lo, hi, a, b) => v => a + (b - a) * (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo));
const box = (x, y, s, T, sw, on) => rect(x, y, s, s, 'none', T.ink, sw) + (on ? pa('M' + r(x + s * 0.2) + ',' + r(y + s * 0.52) + 'L' + r(x + s * 0.42) + ',' + r(y + s * 0.74) + 'L' + r(x + s * 0.82) + ',' + r(y + s * 0.28), T.ink, sw * 1.2) : '');

/* ================= 05 Storage ================= */
ALT[4] = [
{ key: 'C', name: 'Speed against capacity', method: 'Scatter plot on two log axes, labelled directly', why: 'Position shows the trade-off at a glance: fast media are small, large media are slow. Moving parts marked by shape, named on the point.',
  render(d, c) {
    const { W, H, T, u, sw } = c, yl = IDL.mw('100 TB', c.Q) + 3 * u, xb = c.Q + 4 * u;
    const X = logX(30, 4000, yl, W - 20 * u), Y = v => H - xb - (H - xb - 2 * u) * (Math.log(v) - Math.log(0.5)) / (Math.log(200) - Math.log(0.5));
    let out = '';
    [100, 1000].forEach(v => out += ln(X(v), 2 * u, X(v), H - xb, T.rule, c.hair) + tx(X(v), H - xb + u + c.Q, (v >= 1000 ? '1,000' : v) + ' MB/s', { f: 'm', z: c.Q, c: T.mute, a: 'middle', up: false }));
    [1, 10, 100].forEach(v => out += ln(yl, Y(v), W, Y(v), T.rule, c.hair) + tx(yl - 2 * u, Y(v) + c.Q * 0.36, v + ' TB', { f: 'm', z: c.Q, c: T.mute, a: 'end', up: false }));
    out += ln(yl, H - xb, W, H - xb, T.ink, sw) + ln(yl, 2 * u, yl, H - xb, T.ink, sw);
    out += tx(W, H - xb - 2 * u, 'Faster →', { f: 'm', z: c.Q, c: T.ink, a: 'end' }) + tx(yl + 2 * u, 2 * u + c.Q * 0.8, '↑ Larger', { f: 'm', z: c.Q, c: T.ink });
    const boxes = d.rows.map(o => { const x = X(num(o.v[1])), y = Y(num(o.v[0])); return [x - u * 2, x + u * 2, y]; });
    d.rows.forEach((o, i) => {
      const x = X(num(o.v[1])), y = Y(num(o.v[0])), moving = o.v[2] === 'Yes', z = c.P * 0.8;
      const lw = Math.max(IDL.gw(o.name, z), moving ? IDL.mw('Moving parts', c.Q) : 0);
      const hit = (x0, x1, yy) => boxes.some(b => x0 < b[1] && x1 > b[0] && Math.abs(b[2] - yy) < z * 1.6) || x1 > W || x0 < yl;
      let lx = x + 3 * u, a = 'start', ly = y;
      if (hit(lx, lx + lw, ly)) { lx = x - 3 * u; a = 'end'; if (hit(lx - lw, lx, ly)) { lx = x; a = 'middle'; ly = y - z * 1.3 - u; } }
      boxes.push(a === 'start' ? [lx, lx + lw, ly] : a === 'end' ? [lx - lw, lx, ly] : [lx - lw / 2, lx + lw / 2, ly]);
      let q = moving ? dot(x, y, u * 1.4, T.bg, T.ink, sw) : dot(x, y, u * 1.4, T.ink);
      q += tx(lx, ly + z * 0.3, o.name, { z, c: T.ink, a }) + (moving ? tx(lx, ly + z * 0.3 + u + c.Q * 0.9, 'Moving parts', { f: 'm', z: c.Q, c: T.ink, a }) : '');
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'D', name: 'Choose by use', method: 'Decision chain: yes/no questions in order, each ending in a medium', why: 'Students arrive with a task, not a spec sheet. The questions do the comparison for them.',
  render(d, c) {
    const { W, H, T, u, sw } = c;
    const Q = [['Is it still in the camera?', 'SD card', '300 MB/s · no moving parts'], ['Are you working on it now?', 'SSD', '2,000 MB/s · no moving parts'], ['Keeping it for years?', 'HDD or NAS', 'Most TB for the money'], ['Must it survive a fire?', 'Cloud', 'A copy somewhere else']];
    const n = Q.length, rowH = H / n, qz = c.P * 0.8, qw = Math.max(...Q.map(q => IDL.gw(q[0], qz))), ax = 6 * u + qw + 4 * u, bx = ax + IDL.mw('Yes', c.S) + 12 * u;
    let out = '';
    Q.forEach((q, i) => {
      const cy = (i + 0.5) * rowH;
      let g = dot(2 * u, cy, u, T.ink) + tx(6 * u, cy + qz * 0.36, q[0], { z: qz, c: T.ink });
      g += ln(ax, cy, bx - 2 * u - c.sw, cy, T.ink, sw) + IDL.arrow(bx - 2 * u, cy, T.ink, sw) + tx((ax + bx - 2 * u) / 2, cy - 1.25 * u, 'Yes', { f: 'm', z: c.S * 0.85, c: T.ink, a: 'middle' });
      g += tx(bx, cy + c.P * 0.1, q[1], { z: c.P, c: T.ink }) + tx(bx, cy + c.P * 0.1 + u + c.Q, q[2], { f: 'm', z: c.Q, c: T.mute });
      if (i < n - 1) g += ln(2 * u, cy + u * 2, 2 * u, cy + rowH - u * 2 - c.sw, T.ink, sw) + '<g transform="translate(' + r(2 * u) + ',' + r(cy + rowH - u * 2) + ') rotate(90)">' + IDL.arrow(0, 0, T.ink, sw) + '</g>' + tx(4 * u, cy + rowH / 2 + c.S * 0.3, 'No', { f: 'm', z: c.S * 0.85, c: T.mute });
      out += vis(i, c, g);
    });
    return out;
  } },
{ key: 'E', name: 'Two rankings', method: 'Slope chart: ranked by speed on the left, by capacity on the right', why: 'Crossing lines make the trade-off physical: what is fastest is near the bottom for size.',
  render(d, c) {
    const { W, H, T, u, sw } = c, n = d.rows.length, z = c.P * 0.75, head = c.Q + 4 * u, rowH = (H - head) / n;
    const bySpeed = [...d.rows].sort((a, b) => num(b.v[1]) - num(a.v[1])), byCap = [...d.rows].sort((a, b) => num(b.v[0]) - num(a.v[0]));
    const lw = Math.max(...d.rows.map(o => IDL.gw(o.name, z) + IDL.mw('2,000 MB/s', c.Q) + 4 * u)) + 4 * u, x0 = lw, x1 = W - lw, Y = i => head + (i + 0.5) * rowH;
    let out = tx(0, c.Q * 0.8, 'Fastest first', { f: 'm', z: c.Q, c: T.mute }) + tx(W, c.Q * 0.8, 'Largest first', { f: 'm', z: c.Q, c: T.mute, a: 'end' });
    d.rows.forEach((o, k) => {
      const i = bySpeed.indexOf(o), j = byCap.indexOf(o), col = o.name === 'SSD' ? T.signal : T.ink;
      let q = tx(0, Y(i) + z * 0.36, o.name, { z, c: col }) + tx(x0 - 2 * u, Y(i) + c.Q * 0.36, o.v[1], { f: 'm', z: c.Q, c: T.mute, a: 'end', up: false });
      q += tx(W, Y(j) + z * 0.36, o.name, { z, c: col, a: 'end' }) + tx(x1 + 2 * u, Y(j) + c.Q * 0.36, o.v[0], { f: 'm', z: c.Q, c: T.mute, up: false });
      q += ln(x0, Y(i), x1, Y(j), col, sw) + dot(x0, Y(i), u * 0.9, col) + dot(x1, Y(j), u * 0.9, col);
      out += vis(k, c, q);
    });
    return out;
  } }
];

/* ================= 06 Cables ================= */
ALT[5] = [
{ key: 'C', name: 'Time to copy a card', method: 'Translate the value into a consequence students feel: minutes', why: 'The card is the slowest link: above 5 Gb/s every cable takes the same four minutes. The slowest link sets the speed.',
  /* 06C: heads CABLE · SPEED · result; figures right-aligned with their unit in its own column 4 after them; one pitch */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, H, T } = c, bits = 64 * 8 * 1000, it = d.items, n = it.length;
    const split = s => s >= 60 ? [String(Math.round(s / 60)), 'min'] : [String(Math.round(s)), 's'];
    const CARD = d.card || 2400; /* a UHS-II card reads at about 300 MB/s = 2,400 Mb/s: no cable copies faster than the card */
    const capL = G.cap(Z.label, 'm'), headH = 24, rz = c.site ? Z.title : Z.item, p = G.pitch(n, H - headH - 8, rz > 20 ? 48 : 40), capF = G.cap(rz);
    /* round 3: as wide as its content; each column = content + one gutter, snapped up to a grid line */
    const gut = c.G.gut, head = 'Copying a full 64 GB UHS-II card', nameW = Math.max(...it.map(o => IDL.gw(o.name, Z.body, 600))), spX = c.G.line(nameW + gut);
    const spW = Math.max(IDL.labelW('Speed'), ...it.map(o => IDL.gw(o.label, Z.note, 400, 't'))), rX = c.G.line(spX + spW + gut);
    const unitW = Math.max(IDL.gw('min', Z.note, 400, 't'), IDL.gw('s', Z.note, 400, 't')), figW = Math.max(...it.map(o => IDL.gw(split(bits / Math.min(o.v, CARD))[0], rz)));
    const W_ = Math.min(W, c.G.end(rX + Math.max(IDL.labelW(head), figW + 4 + unitW))), rR = W_, figR = rR - unitW - 4; /* round 4: the result column ends on the rule end */
    let out = label(0, capL, 'Cable', c) + label(spX, capL, 'Speed', c) + label(rR, capL, head, c, { a: 'end' }) + ln(0, headH, W_, headH, T.ink, G.RULE.ink);
    it.forEach((o, i) => {
      const y = headH + i * p + p / 2 + capF / 2, t = split(bits / Math.min(o.v, CARD)), col = o.v > CARD ? T.signal : T.ink; /* signal: the rows the card, not the cable, limits */
      let q = tx(0, y, o.name, { z: Z.body, w: 600, c: col }) + tx(spX, y, o.label, { f: 't', w: 400, z: Z.note, c: T.mute });
      q += tx(figR, y, t[0], { z: rz, c: col, a: 'end', tab: 1 }) + tx(figR + 4, y, t[1], { f: 't', w: 400, z: Z.note, c: col });
      if (i) q = ln(0, headH + i * p, W_, headH + i * p, T.rule, G.RULE.hair) + q;
      out += vis(i, c, q);
    });
    return out + ln(0, headH + n * p, W_, headH + n * p, T.ink, G.RULE.ink);
  } },
{ key: 'D', name: 'Counted in USB 2.0s', method: 'Isotype: one mark per USB 2.0 of speed — a count to be felt, not read', why: 'One Thunderbolt 5 is 167 USB 2.0 cables. The length of the row carries it before the number does.',
  render(d, c) {
    const { W, H, T, u } = c, it = d.items, n = it.length, base = it[0].v, z = c.P * 0.7, vw = IDL.mw('× 167', c.S) + 4 * u;
    const nw = Math.max(...it.map(o => IDL.gw(o.name, z))) + 4 * u, aw = W - nw - vw, maxN = Math.round(Math.max(...it.map(o => o.v)) / base);
    const perRow = Math.ceil(maxN / 2), s = Math.min(aw / perRow * 0.72, u * 1.6), pitch = aw / perRow, rowH = H / n;
    let out = '';
    it.forEach((o, i) => {
      const cnt = Math.round(o.v / base), cy = (i + 0.5) * rowH, col = o.key ? T.signal : T.ink, rows = cnt > perRow ? 2 : 1;
      let q = tx(0, cy + z * 0.36, o.name, { z, c: col });
      for (let k = 0; k < cnt; k++) { const rr = Math.floor(k / perRow), cc = k % perRow; q += rect(nw + cc * pitch, cy - (rows * s + (rows - 1) * s * 0.5) / 2 + rr * s * 1.5, s, s, col); }
      q += tx(W, cy + c.S * 0.36, '× ' + cnt, { f: 'm', z: c.S, c: col, a: 'end' });
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'The slowest link', method: 'Cause chain: every part of a copy, and the one that sets the speed', why: 'Moves the lesson from “which cable is fast” to “why is my copy slow”: the slowest link decides.',
  render(d, c) {
    const { W, H, T, u, sw } = c, C = IDL.columns(5, c, 4);
    const L = [['Card', 'SD card', 300], ['Reader', 'USB 3.2 Gen 1', 625], ['Cable', 'USB 2.0', 60, 1], ['Port', 'Thunderbolt 4', 5000], ['Drive', 'SSD', 2000]];
    const X = logX(30, 6000, 0, 1), z = fitZ(L.map(l => l[1]), c.P * 0.8, C.w - 2 * u), barH = H * 0.34, top = (H - (c.Q + 2 * u + z + 2 * u + c.S + 4 * u + barH + 4 * u + c.S)) / 2;
    let out = '';
    L.forEach((l, i) => {
      const x = C.x(i), col = l[3] ? T.signal : T.ink, by = top + c.Q + 2 * u + z + 2 * u + c.S + 4 * u, bh = barH * X(l[2]);
      let q = tx(x, top + c.Q * 0.8, l[0], { f: 'm', z: c.Q, c: T.mute }) + tx(x, top + c.Q + 2 * u + z * 0.8, l[1], { z, c: col }) + tx(x, top + c.Q + 2 * u + z + 2 * u + c.S * 0.8, l[2].toLocaleString('en-GB') + ' MB/s', { f: 'm', z: c.S, c: col, up: false });
      q += rect(x, by + barH - bh, C.w * 0.5, bh, col) + ln(x, by + barH, x + C.w, by + barH, T.ink, c.hair);
      if (i < L.length - 1) q += IDL.arrow(C.x(i + 1) - 1.5 * u, top + c.Q + 2 * u + z * 0.5, T.ink, sw);
      out += vis(i, c, q);
    });
    const ry = top + c.Q + 2 * u + z + 2 * u + c.S + 4 * u + barH * (1 - X(60));
    out += vis(4, c, ln(0, ry, W, ry, T.signal, c.hair * 1.5, '6 6') + tx(W, top + c.Q + 2 * u + z + 2 * u + c.S + 4 * u + barH + 4 * u + c.S * 0.8, 'The copy runs at 60 MB/s — set by the cable', { f: 't', w: 400, z: c.S, c: T.signal, a: 'end' }));
    return out;
  } }
];

/* ================= 07 SD card routine ================= */
ALT[6] = [
{ key: 'C', name: 'Checklist', method: 'Job aid: tick boxes, with a gate before the irreversible step', why: 'Used at the desk, not just watched in class. The gate makes the rule physical: no format until three ticks.',
  /* 07C: rows on a 56 pitch; box, label 20 and description 16 share the first baseline; the gate adds 40 */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, T } = c, st = d.steps, capI = G.cap(Z.item), bs = 16, lx = bs + 16;
    const dx = c.G.line(lx + Math.max(...st.map(s => IDL.gw(s.t, Z.item))) + 24), gate = 'Only when 1–3 are ticked';
    let out = '', b = capI;
    st.forEach((s, i) => {
      if (s.warn) { const gy = b - 56 + 44, lw = IDL.labelW(gate); out += vis(i, c, label(0, gy + G.cap(Z.label, 'm') / 2, gate, c, { c: T.signal }) + ln(lw + 8, gy, W, gy, T.signal, G.RULE.ink)); b += 40; }
      const lines = IDL.wrap(s.warn || s.line, W - dx, Z.body).slice(0, 2);
      let q = box(0, b - capI / 2 - bs / 2, bs, T, G.RULE.ink, false) + tx(lx, b, s.t, { z: Z.item, c: T.ink });
      q += IDL.lines(dx, b, lines, { f: 't', w: 400, z: Z.body, c: T.ink }, G.LH.body);
      out += vis(i, c, q); b += 56;
    });
    return out;
  } },
{ key: 'D', name: 'Where the files are', method: 'State table: after each step, which devices hold the files', why: 'Shows why the order matters: formatting is safe only once two other copies exist.',
  render(d, c) {
    const { W, H, T, u, sw } = c, st = d.steps, S = ['Card', 'Working drive', 'Backup drive'];
    const has = [[1, 0, 0], [1, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], heads = ['Start'].concat(st.map((s, i) => (i + 1) + ' ' + s.t));
    const lw = Math.max(...S.map(s => IDL.gw(s, c.P * 0.75))) + 6 * u, cw = (W - lw) / heads.length, head = c.Q + 4 * u, rowH = (H - head - c.S * 2 - 4 * u) / S.length, sq = Math.min(rowH * 0.5, cw * 0.4);
    let out = ln(0, head, W, head, T.ink, sw);
    S.forEach((s, j) => out += tx(0, head + (j + 0.5) * rowH + c.P * 0.27, s, { z: c.P * 0.75, c: T.ink }) + (j ? ln(0, head + j * rowH, W, head + j * rowH, T.rule, c.hair) : ''));
    out += tx(0, head + S.length * rowH + 4 * u + c.S * 0.8, 'Copies', { f: 'm', z: c.S, c: T.mute });
    heads.forEach((h, i) => {
      const cx = lw + (i + 0.5) * cw, last = i === heads.length - 1;
      let q = tx(cx, c.Q * 0.8, h, { f: 'm', z: c.Q, c: last ? T.signal : T.mute, a: 'middle' });
      S.forEach((_, j) => { const cy = head + (j + 0.5) * rowH; q += has[i][j] ? rect(cx - sq / 2, cy - sq / 2, sq, sq, last ? T.signal : T.ink) : rect(cx - sq / 2, cy - sq / 2, sq, sq, 'none', T.rule, c.hair * 1.5); });
      q += tx(cx, head + S.length * rowH + 4 * u + c.S * 0.8, String(has[i].reduce((a, b) => a + b, 0)), { f: 'm', z: c.S * 1.2, c: last ? T.signal : T.ink, a: 'middle' });
      out += vis(i - 1 < 0 ? 0 : i - 1, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'Flow with a check', method: 'Flowchart with one decision and its loop back', why: 'The routine is not a straight line: if a frame is missing you go back. The loop shows it.',
  render(d, c) {
    const { W, H, T, u, sw } = c, z = c.P, cy = H * 0.42, dS = Math.min(c.P * 4.6, H * 0.5);
    const N = [['Import', 0.07], ['Check', 0.27], ['?', 0.5], ['Back up', 0.72], ['Format', 0.92, 1]];
    const X = f => f * W, A = N.map(n => ({ x: X(n[1]), hw: n[0] === '?' ? dS / 2 : IDL.gw(n[0], z) / 2 }));
    let out = '';
    N.forEach((n, i) => {
      let q = '';
      if (n[0] === '?') q += '<g transform="translate(' + r(A[i].x) + ',' + r(cy) + ') rotate(45)">' + rect(-dS / 2.83, -dS / 2.83, dS / 1.414, dS / 1.414, 'none', T.ink, sw) + '</g>' + tx(A[i].x, cy - c.Q * 0.2, 'All frames', { f: 't', w: 400, z: c.Q, c: T.ink, a: 'middle' }) + tx(A[i].x, cy + c.Q * 1.1, 'there?', { f: 't', w: 400, z: c.Q, c: T.ink, a: 'middle' });
      else q += tx(A[i].x, cy + z * 0.36, n[0], { z, c: n[2] ? T.signal : T.ink, a: 'middle' });
      if (i) { const a = A[i - 1].x + A[i - 1].hw + 2 * u, b = A[i].x - A[i].hw - 2 * u; q += ln(a, cy, b - sw, cy, T.ink, sw) + IDL.arrow(b, cy, T.ink, sw) + (i === 3 ? tx((a + b) / 2, cy - 1.25 * u, 'Yes', { f: 'm', z: c.S * 0.85, c: T.ink, a: 'middle' }) : ''); }
      out += vis(i, c, q);
    });
    const ly = cy + dS / 2 + 6 * u;
    out += vis(2, c, pa('M' + r(A[2].x) + ',' + r(cy + dS / 2) + 'V' + r(ly) + 'H' + r(A[0].x) + 'V' + r(cy + z * 0.6 + 2 * u + sw * 3), T.ink, sw) + '<g transform="translate(' + r(A[0].x) + ',' + r(cy + z * 0.6 + 2 * u) + ') rotate(-90)">' + IDL.arrow(0, 0, T.ink, sw) + '</g>' + tx((A[0].x + A[2].x) / 2, ly - 1.25 * u, 'No — import again', { f: 'm', z: c.S * 0.85, c: T.ink, a: 'middle' }));
    out += vis(4, c, tx(A[4].x, cy + z + 3 * u, 'Only after', { f: 't', w: 400, z: c.Q, c: T.signal, a: 'middle' }) + tx(A[4].x, cy + z + 3 * u + c.Q * 1.3, 'the backup', { f: 't', w: 400, z: c.Q, c: T.signal, a: 'middle' }));
    return out;
  } }
];

/* ================= 08 Backup 3-2-1 ================= */
ALT[7] = [
{ key: 'C', name: 'One setup, drawn', method: 'Worked example in space: a real set of copies in two places', why: 'The rule becomes an arrangement students can copy: what sits at home, what sits away.',
  render(d, c) {
    const { W, H, T, u, sw } = c, split = W * 0.64, z = c.P;
    const items = [[W * 0.16, 'Laptop', 'Original · SSD'], [W * 0.46, 'Backup drive', 'Copy 2 · HDD'], [split + (W - split) / 2, 'Cloud', 'Copy 3 · off site', 1]];
    const cy = H * 0.3, br = (x0, x1, y, lab, col, i) => vis(i, c, pa('M' + r(x0) + ',' + r(y - u) + 'V' + r(y) + 'H' + r(x1) + 'V' + r(y - u), col, sw) + tx((x0 + x1) / 2, y + 2 * u + c.S * 0.8, lab, { f: 'm', z: c.S, c: col, a: 'middle' }));
    let out = tx(0, c.Q * 0.8, 'At home', { f: 'm', z: c.Q, c: T.mute }) + tx(split + 4 * u, c.Q * 0.8, 'Somewhere else', { f: 'm', z: c.Q, c: T.mute }) + ln(split, 0, split, H - c.S * 3, T.ink, sw);
    items.forEach((it, i) => out += vis(i, c, tx(it[0], cy, it[1], { z, c: it[3] ? T.signal : T.ink, a: 'middle' }) + tx(it[0], cy + u * 2 + c.Q, it[2], { f: 'm', z: c.Q, c: T.ink, a: 'middle' })));
    const w0 = IDL.gw('Backup drive', z) / 2, xa = items[0][0] - w0, xb = items[1][0] + w0, xc = items[2][0] - w0, xd = items[2][0] + w0;
    out += br(xa, xd, H * 0.56, '3 copies', T.ink, 0) + br(xa, xb, H * 0.82, '2 kinds of media', T.ink, 1) + br(xc, xd, H * 0.82, '1 off site', T.signal, 2);
    return out;
  } },
{ key: 'D', name: 'What each setup survives', method: 'Consequence matrix: events against setups', why: 'Argues for the rule by its outcomes: only 3-2-1 survives all three things that actually happen.',
  render(d, c) {
    const { W, H, T, u, sw } = c, ev = ['Drive fails', 'Laptop stolen', 'Fire at home'], set = ['1 copy', '2 at home', '3-2-1'];
    const res = [[0, 1, 1], [0, 0, 1], [0, 0, 1]], lw = Math.max(...ev.map(e => IDL.gw(e, c.P * 0.8))) + 6 * u, cw = (W - lw) / set.length, head = c.Q + 4 * u, rowH = (H - head) / ev.length;
    let out = ln(0, head, W, head, T.ink, sw);
    set.forEach((s, j) => out += tx(lw + j * cw, c.Q * 0.8, s, { f: 'm', z: c.Q, c: j === 2 ? T.signal : T.mute }));
    ev.forEach((e, i) => {
      const cy = head + (i + 0.5) * rowH;
      let q = tx(0, cy + c.P * 0.28, e, { z: c.P * 0.8, c: T.ink }) + (i ? ln(0, head + i * rowH, W, head + i * rowH, T.rule, c.hair) : '');
      res[i].forEach((ok, j) => q += tx(lw + j * cw, cy + c.P * 0.3, ok ? 'Safe' : 'Lost', { z: c.P * 0.85, c: ok ? (j === 2 ? T.signal : T.ink) : T.mute, w: ok ? 500 : 400 }));
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'Check your own', method: 'Self-audit checklist — the rule turned into questions about the student’s own files', why: 'Moves from knowing the rule to applying it tonight.',
  render(d, c) {
    const { W, H, T, u, sw } = c, Q = [['3', 'Do your photographs exist three times?'], ['2', 'Are they on two different kinds of storage?'], ['1', 'Is one copy away from where you live?'], ['', 'Did you check it this month?']];
    const rowH = H / Q.length, bs = Math.min(c.P, rowH * 0.45), fz = Math.min(c.P * 1.6, rowH * 0.7), fw = IDL.gw('3', fz) + 6 * u;
    let out = '';
    Q.forEach((q, i) => {
      const cy = (i + 0.5) * rowH;
      let g = box(0, cy - bs / 2, bs, T, sw, false) + tx(bs + 4 * u, cy + fz * 0.36, q[0], { z: fz, c: i === 2 ? T.signal : T.ink, tab: 1 }) + tx(bs + 4 * u + fw, cy + c.P * 0.3, q[1], { z: c.P * 0.8, c: T.ink });
      if (i) g = ln(0, i * rowH, W, i * rowH, T.rule, c.hair) + g;
      out += vis(i, c, g);
    });
    return out;
  } }
];
})();

/* ---- from 09-alt09-12.js ---- */
/* Alternatives C, D, E — pages 09–12. */
(function () {
const IDL = window.IDL, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis, rect = IDL.rect, dot = IDL.dot, fitZ = IDL.fitZ, ALT = IDL.ALT;
const vArrow = (x, y, T, sw, up) => '<g transform="translate(' + r(x) + ',' + r(y) + ') rotate(' + (up ? -90 : 90) + ')">' + IDL.arrow(0, 0, T.ink, sw) + '</g>';

/* ================= 09 Backup rotation ================= */
ALT[8] = [
{ key: 'C', name: 'Calendar', method: 'Timeline with two lanes: where each drive is, week by week', why: 'Time on the horizontal makes the alternation visible, and shows that one lane is always away.',
  render(d, c) {
    const { W, H, T, u, sw } = c, weeks = 6, lanes = ['Drive A', 'Drive B'], lw = Math.max(...lanes.map(l => IDL.gw(l, c.P))) + 6 * u, cw = (W - lw) / weeks;
    const head = c.Q + 4 * u, laneH = Math.min((H - head - c.S * 2 - 6 * u) / 2, c.P * 2.4), gap = 3 * u, top = (H - (head + laneH * 2 + gap + 6 * u + c.S)) / 2;
    let out = '';
    for (let w = 0; w < weeks; w++) out += vis(w, c, tx(lw + w * cw, top + c.Q * 0.8, 'Week ' + (w + 1), { f: 'm', z: c.Q, c: T.mute }));
    lanes.forEach((l, j) => {
      const y = top + head + j * (laneH + gap);
      out += tx(0, y + laneH / 2 + c.P * 0.36, l, { z: c.P, c: T.ink });
      for (let w = 0; w < weeks; w++) {
        const away = (w + j) % 2 === 1, x = lw + w * cw;
        out += vis(w, c, (away ? rect(x + u / 2, y, cw - u, laneH, T.ink) : rect(x + u / 2, y, cw - u, laneH, 'none', T.ink, c.hair * 1.5)) + tx(x + 2 * u, y + laneH / 2 + c.Q * 0.36, away ? 'Away' : 'Home', { f: 'm', z: c.Q, c: away ? T.bg : T.ink }));
      }
    });
    out += vis(1, c, tx(W, top + head + laneH * 2 + gap + 6 * u + c.S * 0.8, 'Every week, one drive is away', { f: 't', w: 400, z: c.S, c: T.signal, a: 'end' }));
    return out;
  } },
{ key: 'D', name: 'The swap', method: 'Exchange diagram: two places, two drives crossing', why: 'Reduces the routine to one action students perform: take one drive out, bring the other home.',
  render(d, c) {
    const { W, H, T, u, sw } = c, xL = W * 0.2, xR = W * 0.8, yT = H * 0.3, yB = H * 0.7, z = c.P * 1.1;
    let out = tx(xL, c.Q * 0.8, 'Home', { f: 'm', z: c.Q, c: T.mute, a: 'middle' }) + tx(xR, c.Q * 0.8, 'Away', { f: 'm', z: c.Q, c: T.mute, a: 'middle' }) + ln(W / 2, c.Q + 2 * u, W / 2, H, T.rule, c.hair);
    out += vis(0, c, tx(xL, yT + z * 0.36, 'Drive A', { z, c: T.ink, a: 'middle' }) + tx(xL, yT + z * 0.36 + u + c.Q * 1.1, 'Just backed up', { f: 'm', z: c.Q, c: T.mute, a: 'middle' }));
    out += vis(0, c, tx(xR, yB + z * 0.36, 'Drive B', { z, c: T.ink, a: 'middle' }) + tx(xR, yB + z * 0.36 + u + c.Q * 1.1, 'Last week’s copy', { f: 'm', z: c.Q, c: T.mute, a: 'middle' }));
    const a0 = xL + Math.max(IDL.gw('Drive A', z), IDL.mw('Just backed up', c.Q)) / 2 + 3 * u, a1 = xR - Math.max(IDL.gw('Drive B', z), IDL.mw('Last week’s copy', c.Q)) / 2 - 3 * u;
    out += vis(1, c, pa('M' + r(a0) + ',' + r(yT) + 'C' + r(W / 2) + ',' + r(yT) + ' ' + r(W / 2) + ',' + r(yB - 8 * u) + ' ' + r(a1) + ',' + r(yB - 8 * u), T.ink, sw) + IDL.arrow(a1, yB - 8 * u, T.ink, sw) + tx(W / 2 + 2 * u, (yT + yB) / 2 - 6 * u, 'Take out', { f: 'm', z: c.S * 0.85, c: T.ink }));
    out += vis(2, c, pa('M' + r(a1) + ',' + r(yB) + 'C' + r(W / 2) + ',' + r(yB) + ' ' + r(W / 2) + ',' + r(yT + 8 * u) + ' ' + r(a0 + sw * 6) + ',' + r(yT + 8 * u), T.ink, sw) + '<g transform="translate(' + r(a0) + ',' + r(yT + 8 * u) + ') rotate(180)">' + IDL.arrow(0, 0, T.ink, sw) + '</g>' + tx(W / 2 - 2 * u, (yT + yB) / 2 + 8 * u, 'Bring home', { f: 'm', z: c.S * 0.85, c: T.ink, a: 'end' }));
    out += vis(2, c, tx(W / 2, H - c.S * 0.4, 'Once a week — so one copy is always away', { f: 't', w: 400, z: c.S, c: T.signal, a: 'middle' }));
    return out;
  } },
{ key: 'E', name: 'What it buys you', method: 'Key numbers: the three facts the rotation guarantees', why: 'States the payoff in numbers students can hold: at worst, a week of work lost.',
  render(d, c) {
    return IDL.R.keys({ items: [{ fig: '2', label: 'Drives', line: 'Labelled A and B.' }, { fig: '1', label: 'Always away', line: 'Never both at home.' }, { fig: '7', label: 'Days, at most', line: 'The most work a fire can take.', key: 1 }] }, c);
  } }
];

/* ================= 10 File formats compared ================= */
ALT[9] = [
{ key: 'C', name: 'Choose by task', method: 'Lookup by purpose: the job on the left, the format on the right', why: 'Students ask “what do I save this as?”, not “what is PSB’s compression?”. Four answers cover the course.',
  /* 10C: task 20 · format 30 (grotesk) · note 16, all on one baseline; notes start at one x (format column + widest format + 16); no leaders */
  render(d, c) {
    const G = IDL.G, Z = G.Z, { W, H, T } = c, Q = [['Straight from the camera', 'RAW', 'or DNG to archive it'], ['Editing, with layers', 'PSD', 'PSB above 2 GB'], ['Sending to print', 'TIFF', 'flattened, 8 bit — or JPEG, as the lab asks'], ['Screen, web, email', 'JPEG', 'lossy — the only one here', 1]];
    const n = Q.length, capF = G.cap(Z.title), p = G.pitch(n, H, 64);
    const fx = c.G.line(Math.max(...Q.map(q => IDL.gw(q[0], Z.item))) + 24), nx = fx + Math.max(...Q.map(q => IDL.gw(q[1], Z.title))) + 16;
    const TW = Math.min(W, c.G.end(nx + Math.max(...Q.map(q => IDL.gw(q[2], Z.body, 400, 't'))))); /* round 3: the rules end on the column line after the content */
    let out = '';
    Q.forEach((q, i) => {
      const b = capF + i * p, col = q[3] ? T.signal : T.ink;
      let g = tx(0, b, q[0], { z: Z.item, c: T.ink }) + tx(fx, b, q[1], { z: Z.title, c: col }) + tx(nx, b, q[2], { f: 't', w: 400, z: Z.body, c: T.ink });
      if (i) g = ln(0, b - capF - (p - capF) / 2, TW, b - capF - (p - capF) / 2, T.rule, G.RULE.hair) + g;
      out += vis(i, c, g);
    });
    return out;
  } },
{ key: 'D', name: 'Three families', method: 'Classification: formats grouped by what they are', why: 'Seven names become three kinds. The claim — only two throw data away — is one group.',
  render(d, c) {
    const { W, H, T, u, sw } = c, G = [['Raw data', 'Not yet an image', [['RAW', 'From the camera'], ['DNG', 'Open, for the archive']]], ['Image, lossless', 'Nothing thrown away', [['TIFF', 'Print master'], ['PSD', 'Layers'], ['PSB', 'Layers, over 2 GB']]], ['Image, lossy', 'Data thrown away', [['JPEG', 'Screen'], ['HEIC', 'Phone']], 1]];
    const C = IDL.columns(3, c, 6), fz = Math.min(c.P * 1.2, (H - c.P * 2 - 10 * u) / 3 / 1.8);
    let out = '';
    G.forEach((g, i) => {
      const x = C.x(i), col = g[3] ? T.signal : T.ink;
      let q = ln(x, 0, x + C.w, 0, col, sw) + tx(x, 3 * u + c.P * 0.8, g[0], { z: c.P, c: col }) + tx(x, 3 * u + c.P + 2 * u + c.Q * 0.8, g[1], { f: 'm', z: c.Q, c: T.mute });
      let y = 3 * u + c.P + 2 * u + c.Q + 6 * u;
      g[2].forEach(m => { q += tx(x, y + fz * 0.8, m[0], { f: 'm', z: fz, c: T.ink, ls: 0 }) + tx(x, y + fz + u + c.Q * 0.8, m[1], { f: 't', w: 400, z: c.Q, c: T.ink }); y += fz + u + c.Q + 4 * u; });
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'Placed on two properties', method: 'Positional matrix (Bertin): compression down, layers across', why: 'Every format has an address. Empty cells matter too: nothing lossy keeps layers.',
  render(d, c) {
    const { W, H, T, u, sw } = c, rows = ['None', 'Lossless', 'Lossy'], cols = ['No layers', 'Optional', 'Layers'];
    const cell = { 'None|No layers': ['RAW'], 'Lossless|No layers': ['DNG'], 'Lossless|Optional': ['TIFF'], 'Lossless|Layers': ['PSD', 'PSB'], 'Lossy|No layers': ['JPEG', 'HEIC'] };
    const lw = IDL.mw('Lossless', c.S) + 6 * u, head = c.Q + 4 * u, cw = (W - lw) / 3, rh = (H - head) / 3, fz = Math.min(c.P * 1.2, rh * 0.36, cw / (9 * 0.6));
    let out = ln(lw, head, W, head, T.ink, sw) + tx(0, c.Q, 'Compression', { f: 'm', z: c.Q, c: T.mute });
    cols.forEach((h, j) => out += tx(lw + j * cw + 2 * u, c.Q, h, { f: 'm', z: c.Q, c: T.mute }) + (j ? ln(lw + j * cw, head, lw + j * cw, H, T.rule, c.hair) : ''));
    rows.forEach((rw, i) => {
      const y = head + i * rh, lossy = rw === 'Lossy';
      let q = tx(0, y + rh / 2 + c.S * 0.36, rw, { f: 'm', z: c.S, c: lossy ? T.signal : T.ink }) + (i ? ln(0, y, W, y, T.rule, c.hair) : '');
      cols.forEach((h, j) => (cell[rw + '|' + h] || []).forEach((f, k, arr) => q += tx(lw + j * cw + 2 * u, y + rh / 2 + (k - (arr.length - 1) / 2) * fz * 1.2 + fz * 0.36, f, { f: 'm', z: fz, c: lossy ? T.signal : T.ink, ls: 0 })));
      out += vis(i, c, q);
    });
    return out;
  } }
];

/* ================= 11 Bit depth ================= */
const grey = (v) => { const n = Math.round(v * 255).toString(16).padStart(2, '0'); return '#' + n + n + n; };
ALT[10] = [
{ key: 'C', name: 'The tones themselves', method: 'Direct depiction: each bit depth drawn as its own grey ramp', why: 'Photographers see banding before they understand numbers. At 8 bit the steps disappear.',
  /* 11C: rows on a 48 pitch; ramps 24 high from a column line; values grotesk 16, right-aligned, 16 after the ramps; the note at the foot.
     Round 4, for the P2 pair (Batu chooses): flags.head adds a head row (TONES + head rule) so its rows share 11D's baselines;
     flags.powers folds 11D's powers into this table (label, ramp, 2ⁿ = value) under 11D's own head. */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, H, T } = c, fl = c.flags || {}, R = [[1, 2], [2, 4], [4, 16], [8, 256], [16, 65536]], n = R.length, capN = G.cap(Z.body), capT = G.cap(Z.body, 't');
    const headed = fl.head || fl.powers, headH = headed ? 24 : 0, ez = Z.label;
    const lw = c.G.line(Math.max(...R.map(([b]) => IDL.gw(b + ' bit', Z.body, 600))) + 24), vw = Math.max(...R.map(([, t]) => IDL.gw(t.toLocaleString('en-GB'), Z.body, 400, 't')));
    const eqW = IDL.gw('=', Z.body, 400), eqX = W - vw - 12 - eqW, powW = Math.max(...R.map(([b]) => IDL.gw('2', Z.body) + 1 + IDL.gw(String(b), ez))), powR = eqX - 12;
    const rw = (fl.powers ? powR - powW - 24 : W - vw - 16) - lw, bh = 24, p = G.pitch(n, H - 40, 48);
    /* with a head row the label baseline is 11D's: head + row middle + half the item cap */
    const cyOf = i => headed ? headH + i * p + p / 2 + G.cap(Z.item) / 2 - capN / 2 : bh / 2 + i * p;
    let out = '';
    if (headed) out += label(fl.powers ? W : 0, G.cap(Z.label, 'm'), fl.powers ? 'Tones = 2 to the power of the bits' : 'Tones', c, { a: fl.powers ? 'end' : 'start' }) + ln(0, headH, W, headH, T.ink, G.RULE.ink);
    R.forEach(([b, t], i) => {
      const cy = cyOf(i), steps = Math.min(t, 256), sw_ = rw / steps, col = b === 8 ? T.signal : T.ink;
      let q = tx(0, cy + capN / 2, b + ' bit', { z: Z.body, w: 600, c: col });
      /* 11C: at 8 and 16 bit the ramp is one continuous gradient — per-step rectangles leave seams that read as banding */
      if (steps >= 256) { const gid = 'ramp' + b + '_' + i; q += '<defs><linearGradient id="' + gid + '"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect x="' + r(lw) + '" y="' + r(cy - bh / 2) + '" width="' + r(rw) + '" height="' + r(bh) + '" fill="url(#' + gid + ')"/>'; }
      else for (let s = 0; s < steps; s++) q += '<rect x="' + r(lw + s * sw_) + '" y="' + r(cy - bh / 2) + '" width="' + r(sw_ + (s < steps - 1 ? 0.6 : 0)) + '" height="' + r(bh) + '" fill="' + grey(steps === 1 ? 0 : s / (steps - 1)) + '" shape-rendering="crispEdges"/>';
      q += '<rect x="' + r(lw) + '" y="' + r(cy - bh / 2) + '" width="' + r(rw) + '" height="' + r(bh) + '" fill="none" stroke="' + T.mute + '" stroke-width="' + G.RULE.hair + '"/>';
      if (fl.powers) { const expW = IDL.gw(String(b), ez);
        q += tx(powR - expW - 1, cy + capN / 2, '2', { z: Z.body, c: col, a: 'end' }) + tx(powR - expW, cy + capN / 2 - 7, String(b), { z: ez, c: col }) + tx(eqX, cy + capN / 2, '=', { z: Z.body, c: T.mute, w: 400 }); }
      q += tx(W, cy + capT / 2, t.toLocaleString('en-GB'), { f: 't', w: 400, z: Z.body, c: col, a: 'end', tab: 1 });
      if (headed && i) q = ln(0, headH + i * p, W, headH + i * p, T.rule, G.RULE.hair) + q;
      out += vis(i, c, q);
    });
    const foot = headed ? headH + n * p : (n - 1) * p + bh;
    if (headed) out += ln(0, foot, W, foot, T.ink, G.RULE.ink);
    out += vis(n - 1, c, tx(0, foot + 24 + G.cap(Z.note, 't'), 'Looks the same as 8 bit — the extra tones are room for editing', { f: 't', w: 400, z: Z.note, c: T.ink }));
    return out;
  } },
{ key: 'D', name: 'Two to the power', method: 'Formula applied row by row: tones = 2 to the power of the bits', why: 'Gives the rule behind the numbers, so any bit depth can be worked out, not remembered.',
  /* 11D: the formula is the column head; "2⁸ = 256" is one cluster inside 3 columns, aligned on "="; spare width to the right */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, H, T } = c, R = [[1, 2], [2, 4], [4, 16], [8, 256], [16, 65536]], n = R.length, z = Z.item, ez = Z.label;
    const capI = G.cap(z), headH = 24, p = G.pitch(n, H - headH, 48), head = 'Tones = 2 to the power of the bits';
    const x0 = c.G.line(Math.max(...R.map(([b]) => IDL.gw(b + ' bit', z))) + 24);
    const resW = Math.max(...R.map(([, t]) => IDL.gw(t.toLocaleString('en-GB'), z))), eqW = IDL.gw('=', z, 400);
    /* round 2: powers right-aligned in their column, "=" 12 after, the value column ending on the next column line (>= 12 clear of "=");
       the table and its rules end on a column line */
    const powR = x0 + Math.max(...R.map(([b]) => IDL.gw('2', z) + 1 + IDL.gw(String(b), ez))), eqX = powR + 12, x1 = c.G.end(eqX + eqW + 12 + resW);
    /* round 3: the table ends on the value column (x1); the head label sits flush left on its own line and may run wider */
    const TW = x1;
    let out = label(0, G.cap(Z.label, 'm'), head, c) + ln(0, headH, TW, headH, T.ink, G.RULE.ink);
    R.forEach(([b, t], i) => {
      const y = headH + i * p + p / 2 + capI / 2, col = b === 8 ? T.signal : T.ink, expW = IDL.gw(String(b), ez);
      let q = tx(0, y, b + ' bit', { z, c: col });
      q += tx(powR - expW - 1, y, '2', { z, c: col, a: 'end' }) + tx(powR - expW, y - 9, String(b), { z: ez, c: col });
      q += tx(eqX, y, '=', { z, c: T.mute, w: 400 }) + tx(x1, y, t.toLocaleString('en-GB'), { z, c: col, a: 'end', tab: 1 });
      if (i) q = ln(0, headH + i * p, TW, headH + i * p, T.rule, G.RULE.hair) + q;
      out += vis(i, c, q);
    });
    return out + ln(0, headH + n * p, TW, headH + n * p, T.ink, G.RULE.ink);
  } },
{ key: 'E', name: 'One pixel, in bits', method: 'Anatomy of a value: eight switches and what they add up to', why: 'Shows what a bit is before counting them: eight on/off cells store one tone out of 256.',
  render(d, c) {
    const { W, H, T, u, sw } = c, v = 180, bits = v.toString(2).padStart(8, '0').split(''), places = [128, 64, 32, 16, 8, 4, 2, 1];
    const gap = 2 * u, cs = Math.min((W - gap * 7) / 8, H * 0.3), x0 = (W - (cs * 8 + gap * 7)) / 2, top = (H - (c.Q + 2 * u + cs + 4 * u + c.S + 6 * u + c.P)) / 2, y = top + c.Q + 2 * u;
    let out = '';
    bits.forEach((b, i) => {
      const x = x0 + i * (cs + gap), on = b === '1';
      out += vis(0, c, tx(x + cs / 2, top + c.Q * 0.8, String(places[i]), { f: 'm', z: c.Q, c: T.mute, a: 'middle' }) + (on ? rect(x, y, cs, cs, T.ink) : rect(x, y, cs, cs, 'none', T.ink, sw)) + tx(x + cs / 2, y + cs / 2 + cs * 0.18, b, { f: 'm', z: cs * 0.5, c: on ? T.bg : T.ink, a: 'middle', ls: 0 }));
    });
    const on = places.filter((_, i) => bits[i] === '1');
    out += vis(1, c, tx(W / 2, y + cs + 4 * u + c.S * 0.8, on.join(' + ') + ' = ' + v, { f: 'm', z: c.S, c: T.ink, a: 'middle' }));
    out += vis(2, c, tx(W / 2, y + cs + 4 * u + c.S + 6 * u + c.P * 0.8, 'Tone ' + v + ' of 256', { z: c.P, c: T.signal, a: 'middle' }));
    return out;
  } }
];

/* ================= 12 Organisational tools ================= */
ALT[11] = [
{ key: 'C', name: 'Where each tool fits', method: 'Tools placed on the project’s process', why: 'Shows when to reach for each tool; Dropbox runs underneath everything.',
  render(d, c) {
    const { W, H, T, u, sw } = c, st = ['Plan', 'Shoot', 'Sort', 'Hand in'], C = IDL.columns(4, c, 4), z = c.P;
    const yS = H * 0.18, yT = H * 0.52, yD = H * 0.82;
    let out = '';
    st.forEach((s, i) => { const x = C.x(i); out += vis(i, c, tx(x, yS, s, { z, c: T.ink }) + ln(x, yS + 2 * u, x + C.w, yS + 2 * u, T.ink, sw) + (i < 3 ? IDL.arrow(C.x(i + 1) - u, yS - z * 0.35, T.ink, sw) : '')); });
    const tool = (i, name, role) => vis(i, c, ln(C.x(i) + 2 * u, yS + 3 * u, C.x(i) + 2 * u, yT - c.P - u, T.rule, c.hair) + tx(C.x(i), yT, name, { z: c.P * 0.9, c: T.ink }) + tx(C.x(i), yT + u + c.Q, role, { f: 'm', z: c.Q, c: T.mute }));
    out += tool(0, 'Miro', 'Moodboard, shoot plan') + tool(2, 'Claude', 'Rename, sort, write');
    out += vis(3, c, ln(0, yD - c.P, W, yD - c.P, T.ink, c.hair) + tx(0, yD, 'Dropbox', { z: c.P * 0.9, c: T.ink }) + tx(IDL.gw('Dropbox', c.P * 0.9) + 4 * u, yD, 'keeps the same folder on every device, the whole time', { f: 't', w: 400, z: c.B, c: T.ink }));
    return out;
  } },
{ key: 'D', name: 'I need to…', method: 'Task lookup: the student’s sentence, then the tool', why: 'Starts from the need in the student’s own words; the warning sits on the one tool that can delete work.',
  /* 12D: need and tool share the first baseline; USE starts on column 9; the warning (14, signal) hangs 20 under its tool.
     Round 2: each row is its content + 16 above and 16 below, rounded up to 8 (no fixed pitch); a need that fits stays on one line */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, T } = c, Q = [['…have the same files at home and at school', 'Dropbox', 'Sync is not a backup', 1], ['…plan a shoot with references', 'Miro'], ['…sort, rename and write up a project', 'Claude']];
    const ux = c.G.x(8), z = Z.item, capI = G.cap(z), headH = 24, desc = 5;
    let out = label(0, G.cap(Z.label, 'm'), 'I need to', c) + label(ux, G.cap(Z.label, 'm'), 'Use', c) + ln(0, headH, W, headH, T.ink, G.RULE.ink), y = headH;
    Q.forEach((q, i) => {
      const lines = IDL.wrapPretty(q[0], ux - 24, z, 'g', 500), warn = q[2] ? IDL.wrapPretty(q[2], W - ux, Z.note) : [];
      const h = G.snap(16 + Math.max(capI + (lines.length - 1) * G.LH.item + desc, capI + (warn.length ? 20 * warn.length : 0) + desc) + 16), b = y + 16 + capI;
      let g = IDL.lines(0, b, lines, { z, c: T.ink }, G.LH.item) + tx(ux, b, q[1], { z, c: T.ink });
      if (warn.length) g += IDL.lines(ux, b + 20, warn, { f: 't', w: 400, z: Z.note, c: T.signal }, G.LH.note);
      if (i) g = ln(0, y, W, y, T.rule, G.RULE.hair) + g;
      out += vis(i, c, g); y += h;
    });
    return out;
  } },
{ key: 'E', name: 'What each can do', method: 'Capability matrix: tasks down, tools across', why: 'Shows the overlaps honestly — two tools can share — and that each has one job only it does well.',
  render(d, c) {
    const { W, H, T, u, sw } = c, tools = ['Dropbox', 'Miro', 'Claude'], tasks = [['Sync a folder', [1, 0, 0]], ['Share with a tutor', [1, 1, 0]], ['Moodboard', [0, 1, 0]], ['Shoot plan', [0, 1, 1]], ['Rename a batch', [0, 0, 1]], ['Write a statement', [0, 0, 1]]];
    const lw = Math.max(...tasks.map(t => IDL.gw(t[0], c.B * 1.1, 400, 't'))) + 8 * u, cw = (W - lw) / tools.length, head = c.P + 3 * u, rowH = (H - head) / tasks.length;
    let out = ln(0, head, W, head, T.ink, sw);
    tools.forEach((t, j) => out += tx(lw + (j + 0.5) * cw, c.P * 0.8, t, { z: c.P * 0.9, c: T.ink, a: 'middle' }));
    tasks.forEach((t, i) => {
      const cy = head + (i + 0.5) * rowH;
      let q = tx(0, cy + c.B * 0.36, t[0], { f: 't', w: 400, z: c.B * 1.1, c: T.ink }) + (i ? ln(0, head + i * rowH, W, head + i * rowH, T.rule, c.hair) : '');
      t[1].forEach((v, j) => { if (v) q += dot(lw + (j + 0.5) * cw, cy, u * 1.3, T.ink); });
      out += vis(i, c, q);
    });
    return out;
  } }
];
})();

/* ---- from 10-alt13-16.js ---- */
/* Alternatives C, D, E — pages 13–16. */
(function () {
const IDL = window.IDL, tx = IDL.tx, ln = IDL.ln, pa = IDL.pa, r = IDL.r, vis = IDL.vis, rect = IDL.rect, dot = IDL.dot, fitZ = IDL.fitZ, ALT = IDL.ALT;
const S_ = (id, name, col, tags, key) => ({ id, name, col, tags, key: !!key });

/* ================= 13 RAW ================= */
ALT[12] = [
{ key: 'C', name: 'RAW as an ingredient', method: 'Process with a merge: data plus settings, rendered into an image', why: 'Defines RAW by what happens to it: it only becomes a picture when a converter combines it with your settings.',
  render(d, c) {
    return IDL.R.flow({ icons: false, chipStyle: 'text', stages: [S_('raw', 'Sensor data', 0, ['.CR3', '.NEF', '.ARW']), S_('xmp', 'Your settings', 0, ['.XMP']), S_('conv', 'Converter', 1, ['Lightroom', 'Capture One']), S_('img', 'Image', 2, ['TIFF', 'JPEG'], 1)],
      links: [{ from: 'raw', to: 'conv', label: 'Open' }, { from: 'xmp', to: 'conv', label: 'Open' }, { from: 'conv', to: 'img', label: 'Export' }] }, c);
  } },
{ key: 'D', name: 'RAW beside JPEG', method: 'Juxtaposition of two, attributes down the middle (butterfly)', why: 'A term is easiest to hold against its nearest non-example. Same rows, only the answers differ.',
  render(d, c) {
    const { W, H, T, u, sw } = c, rows = [['Processed', 'Not yet', 'In the camera'], ['Bit depth', '12–14 bit', '8 bit'], ['White balance', 'Set it later', 'Fixed'], ['Can be seen', 'Needs a converter', 'Anywhere']];
    const mid = W / 2, head = c.P * 1.2 + 4 * u, rowH = (H - head) / rows.length, z = c.P * 0.85, mw = IDL.mw('White balance', c.Q) / 2 + 6 * u;
    let out = tx(mid - mw, c.P * 1.0, 'RAW', { f: 'm', z: c.P * 1.2, c: T.signal, a: 'end', ls: 0 }) + tx(mid + mw, c.P * 1.0, 'JPEG', { f: 'm', z: c.P * 1.2, c: T.ink, ls: 0 }) + ln(0, head - 2 * u, W, head - 2 * u, T.ink, sw);
    rows.forEach((rw, i) => {
      const cy = head + (i + 0.5) * rowH;
      let q = tx(mid, cy + c.Q * 0.36, rw[0], { f: 'm', z: c.Q, c: T.mute, a: 'middle' }) + tx(mid - mw, cy + z * 0.36, rw[1], { z, c: T.ink, a: 'end' }) + tx(mid + mw, cy + z * 0.36, rw[2], { z, c: T.ink });
      if (i) q = ln(0, head + i * rowH - 2 * u, W, head + i * rowH - 2 * u, T.rule, c.hair) + q;
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'Inside a raw file', method: 'Anatomy of a container: the parts a raw file holds', why: 'Makes “not yet a picture” concrete: most of the file is sensor data; the picture on the camera screen is only a small preview.',
  /* 13E: container 7 columns, sidecar 4 columns (column 9 on), tops aligned; 12 insets on every side; siblings at one size */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, H, T } = c, cg = c.G, bw = cg.span(7), sx = cg.x(8), sW = cg.span(4), ins = 12, top = 24, capN = G.cap(Z.body);
    const P = [['Sensor data', 'One 12–14 bit value per pixel', 0.62, 1], ['Metadata', 'Camera, lens, exposure — EXIF', 0.2], ['Preview', 'A JPEG, usually full size, for the camera screen', 0.18]];
    const avail = Math.min(G.snap(H - top) - 8, 240);
    let out = label(0, G.cap(Z.label, 'm'), 'One .CR3 file', c) + rect(0, top, bw, avail, 'none', T.ink, G.RULE.ink), y = top;
    P.forEach((p, i) => {
      const h = avail * p[2], b = y + ins + capN, nw = IDL.gw(p[0], Z.body, 600);
      let q = (i ? ln(0, y, bw, y, T.ink, G.RULE.hair) : '') + tx(ins, b, p[0], { z: Z.body, w: 600, c: p[3] ? T.signal : T.ink }) + tx(ins + nw + 12, b, p[1], { f: 't', w: 400, z: Z.note, c: T.ink });
      out += vis(i, c, q); y += h;
    });
    const sh = G.snap(ins + G.cap(Z.item, 'm') + 20 + 4 + ins);
    out += vis(3, c, '<rect x="' + r(sx) + '" y="' + r(top) + '" width="' + r(sW) + '" height="' + r(sh) + '" fill="none" stroke="' + T.ink + '" stroke-width="' + G.RULE.ink + '" stroke-dasharray="6 4"/>' +
      tx(sx + ins, top + ins + G.cap(Z.item, 'm'), '.XMP', { f: 'm', z: Z.item, c: T.ink, ls: 0 }) + tx(sx + ins, top + ins + G.cap(Z.item, 'm') + 20, 'Your edits, beside it', { f: 't', w: 400, z: Z.note, c: T.ink }));
    return out;
  } }
];

/* ================= 14 Print size ================= */
ALT[13] = [
{ key: 'C', name: 'Lookup table', method: 'Worked examples: one file at four resolutions', why: 'Several answers to one question show the relation (half the ppi, twice the size) and serve as a reference at the printer.',
  /* 14C: the first column starts at 0; "ppi" in the head; columns on an equal pitch to the full width; one row pitch */
  render(d, c) {
    const G = IDL.G, Z = G.Z, { W, H, T } = c, px = 6000, R = [150, 200, 240, 300], n = R.length, z = Z.item, capI = G.cap(z), headH = 24;
    const heads = [{ head: 'Resolution', unit: 'ppi' }, { head: 'Inches' }, { head: 'Centimetres' }];
    /* round 3: as wide as its content; each column = content + one gutter, snapped up to a grid line; heads over their figures */
    const vals = v => { const inch = px / v; return [String(v), String(Math.round(inch * 10) / 10), (Math.round(inch * 25.4) / 10).toFixed(1)]; };
    const cw = heads.map((h, j) => Math.max(IDL.headW(h), ...R.map(v => IDL.gw(vals(v)[j], z)))), xs = [cw[0]];
    for (let j = 1; j < 3; j++) xs.push(c.G.line(xs[j - 1] + c.G.gut) + cw[j]);
    const TW = Math.min(W, c.G.end(xs[2])); xs[2] = TW; /* round 4: the last (numeric) column ends on the rule end */
    const p = G.pitch(n, H - headH - 40, 48);
    let out = heads.map((h, j) => IDL.headLabel(xs[j], G.cap(Z.label, 'm'), h, c, { a: 'end' })).join('') + ln(0, headH, TW, headH, T.ink, G.RULE.ink);
    R.forEach((v, i) => {
      const y = headH + i * p + p / 2 + capI / 2, inch = px / v, col = v === 300 ? T.signal : T.ink;
      let q = [String(v), String(Math.round(inch * 10) / 10), (Math.round(inch * 25.4) / 10).toFixed(1)].map((s, j) => tx(xs[j], y, s, { z, c: col, a: 'end', tab: 1 })).join('');
      if (i) q = ln(0, headH + i * p, TW, headH + i * p, T.rule, G.RULE.hair) + q;
      out += vis(i, c, q);
    });
    out += ln(0, headH + n * p, TW, headH + n * p, T.ink, G.RULE.ink);
    out += tx(0, headH + n * p + 24 + G.cap(Z.note, 't'), 'A file 6,000 px along its long side. 300 ppi is the usual standard for photographic prints.', { f: 't', w: 400, z: Z.note, c: T.ink });
    return out;
  } },
{ key: 'D', name: 'Drawn to scale', method: 'Scale drawing with a familiar reference (A3)', why: 'Size is spatial: seeing the same file at 300 and 150 ppi against a sheet of A3 beats any number.',
  render(d, c) {
    const { W, H, T, u, sw } = c, big = [40, 26.7], small = [20, 13.3], a3 = [16.5, 11.7], lab = 6 * u;
    const s = Math.min((W - 30 * u) / big[0], (H - lab - c.Q * 2) / big[1]), x0 = 0, yb = H - c.Q - 2 * u;
    const R = (w, h, stroke, dash, fill) => '<rect x="' + r(x0) + '" y="' + r(yb - h * s) + '" width="' + r(w * s) + '" height="' + r(h * s) + '" fill="' + (fill || 'none') + '" stroke="' + stroke + '" stroke-width="' + r(sw) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
    let out = vis(0, c, R(big[0], big[1], T.ink) + tx(x0 + big[0] * s - 2 * u, yb - big[1] * s + 3 * u + c.S * 0.8, '150 ppi · 40 × 26.7 in', { f: 'm', z: c.S, c: T.ink, a: 'end' }));
    out += vis(1, c, R(small[0], small[1], T.signal, null, T.bg) + tx(x0 + 2 * u, yb - small[1] * s - 2 * u, '300 ppi · 20 × 13.3 in', { f: 'm', z: c.S, c: T.signal }));
    out += vis(2, c, R(a3[0], a3[1], T.mute, '8 6') + tx(x0 + 2 * u, yb - a3[1] * s + 3 * u + c.Q * 0.8, 'A3 sheet', { f: 'm', z: c.Q, c: T.mute }));
    out += tx(x0, H - c.Q * 0.3, 'The same 6,000 × 4,000 px file, drawn to scale', { f: 'm', z: c.Q, c: T.mute });
    return out;
  } },
{ key: 'E', name: 'Formula triangle', method: 'Triangle mnemonic: cover the term you want, read the other two', why: 'One picture gives all three questions students ask at the printer: how big, how many pixels, what resolution.',
  render(d, c) {
    const { W, H, T, u, sw } = c, th = Math.min(H * 0.9, W * 0.42), tw = th * 1.15, x0 = 0, y0 = (H - th) / 2, apex = [x0 + tw / 2, y0], bl = [x0, y0 + th], br = [x0 + tw, y0 + th], my = y0 + th * 0.58, z = Math.min(c.P, tw / 9);
    let out = pa('M' + r(apex[0]) + ',' + r(apex[1]) + 'L' + r(br[0]) + ',' + r(br[1]) + 'L' + r(bl[0]) + ',' + r(bl[1]) + 'Z', T.ink, sw) + ln(x0 + tw * 0.21, my, x0 + tw * 0.79, my, T.ink, sw) + ln(x0 + tw / 2, my, x0 + tw / 2, y0 + th, T.ink, sw);
    out += tx(x0 + tw / 2, y0 + th * 0.42, 'Pixels', { z, c: T.ink, a: 'middle' }) + tx(x0 + tw * 0.3, y0 + th * 0.84, 'Size', { z, c: T.signal, a: 'middle' }) + tx(x0 + tw * 0.7, y0 + th * 0.84, 'ppi', { z, c: T.ink, a: 'middle' });
    const X = x0 + tw + 10 * u, rows = [['Size', '=', 'pixels ÷ ppi', 1], ['Pixels', '=', 'size × ppi'], ['ppi', '=', 'pixels ÷ size']], rh = H / 3, rz = Math.min(c.P, (W - X) / 16);
    rows.forEach((rw, i) => { const cy = (i + 0.5) * rh; out += vis(i, c, tx(X, cy + rz * 0.36, rw[0], { z: rz, c: rw[3] ? T.signal : T.ink }) + tx(X + IDL.gw('Pixels', rz) + 4 * u, cy + rz * 0.36, rw[1] + '  ' + rw[2], { z: rz, c: T.ink, w: 400 }) + (i ? ln(X, i * rh, W, i * rh, T.rule, c.hair) : '')); });
    return out;
  } }
];

/* ================= 15 Analog and digital ================= */
const F = t => 0.5 + 0.3 * Math.sin(2 * Math.PI * (t * 1.3 + 0.07)) + 0.12 * Math.sin(2 * Math.PI * (t * 3.1 + 0.18));
const curve = (X, Y, a, b, T, w) => pa('M' + Array.from({ length: 121 }, (_, s) => { const t = a + (b - a) * s / 120; return r(X(t)) + ',' + r(Y(F(t))); }).join('L'), T, w);
ALT[14] = [
{ key: 'C', name: 'Overview and enlargement', method: 'Detail view: the whole signal, and one stretch enlarged', why: 'From the back of the room the curve and the steps look alike; the enlargement shows where they part.',
  render(d, c) {
    const { W, H, T, u, sw } = c, lw = W * 0.5, rx = lw + 8 * u, rw = W - rx, ph = H - c.P * 1.1 - 2 * u - c.B * 1.4 * 2 - 6 * u, t0 = 0.28, t1 = 0.6, n = 24, L = 8;
    const X = t => t * lw, Y = v => ph - v * ph, q = v => Math.round(v * (L - 1)) / (L - 1);
    let out = vis(0, c, curve(X, Y, 0, 1, T.ink, sw));
    const wy0 = Y(Math.max(...Array.from({ length: 21 }, (_, i) => F(t0 + (t1 - t0) * i / 20)))) - 2 * u, wy1 = Y(Math.min(...Array.from({ length: 21 }, (_, i) => F(t0 + (t1 - t0) * i / 20)))) + 2 * u;
    out += vis(1, c, rect(X(t0), wy0, X(t1) - X(t0), wy1 - wy0, 'none', T.signal, sw) + ln(X(t1), wy0, rx, 0, T.rule, c.hair) + ln(X(t1), wy1, rx, ph, T.rule, c.hair));
    const vLo = (ph - wy1) / ph, vHi = (ph - wy0) / ph, EX = t => rx + (t - t0) / (t1 - t0) * rw, EY = v => ph - (v - vLo) / (vHi - vLo) * ph;
    let g = rect(rx, 0, rw, ph, 'none', T.signal, sw);
    for (let l = 0; l < L; l++) { const v = l / (L - 1); if (v >= vLo && v <= vHi) g += ln(rx, EY(v), W, EY(v), T.rule, c.hair); }
    g += curve(EX, EY, t0, t1, T.ink, sw);
    const ts = Array.from({ length: n }, (_, s) => (s + 0.5) / n).filter(t => t >= t0 && t <= t1);
    ts.forEach(t => g += ln(EX(t), EY(F(t)), EX(t), EY(q(F(t))), T.signal, c.hair * 1.5) + dot(EX(t), EY(q(F(t))), u, T.signal) + dot(EX(t), EY(F(t)), u * 0.7, T.ink));
    out += vis(2, c, g);
    const y = ph + 6 * u + c.P * 0.8;
    out += vis(0, c, tx(0, y, 'The signal', { z: c.P, c: T.ink }) + tx(0, y + c.P * 0.3 + 2 * u + c.B * 0.8, 'Continuous, as film records it.', { f: 't', w: 400, z: c.B, c: T.ink }));
    out += vis(2, c, tx(rx, y, 'Enlarged', { z: c.P, c: T.signal }) + IDL.lines(rx, y + c.P * 0.3 + 2 * u + c.B * 0.8, IDL.wrap('Each measured point is moved to the nearest level.', rw, c.B), { f: 't', w: 400, z: c.B, c: T.ink }, c.B * 1.4));
    return out;
  } },
{ key: 'D', name: 'What the file stores', method: 'Data as numbers: the samples written out as the values a file holds', why: 'Makes “digital” literal: under the picture there is only a row of whole numbers.',
  render(d, c) {
    const { W, H, T, u, sw } = c, n = 12, L = 8, q = v => Math.round(v * (L - 1)), ph = H * 0.42, X = t => t * W, Y = v => ph - v * ph;
    let out = vis(0, c, curve(X, Y, 0, 1, T.rule, sw));
    const ts = Array.from({ length: n }, (_, s) => (s + 0.5) / n), cw = W / n;
    ts.forEach((t, i) => out += vis(0, c, ln(X(t), Y(F(t)), X(t), ph + 4 * u, T.rule, c.hair) + dot(X(t), Y(F(t)), u * 0.8, T.ink)));
    const yb = ph + 6 * u, bh = Math.min(c.P * 2.2, H - yb - c.Q * 2 - 8 * u);
    out += vis(1, c, ln(0, yb, W, yb, T.ink, sw) + ln(0, yb + bh, W, yb + bh, T.ink, sw) + ts.map((t, i) => (i ? ln(i * cw, yb, i * cw, yb + bh, T.rule, c.hair) : '') + tx(X(t), yb + bh / 2 + bh * 0.22, String(q(F(t))), { f: 'm', z: bh * 0.6, c: T.signal, a: 'middle', ls: 0 })).join(''));
    out += vis(1, c, tx(0, yb + bh + 3 * u + c.Q * 0.8, '12 samples, each a whole number from 0 to 7 — 3 bit', { f: 'm', z: c.Q, c: T.mute }));
    return out;
  } },
{ key: 'E', name: 'Fewer and more levels', method: 'Small multiples: the same samples at 2, 4, 8 and 16 levels', why: 'Varies only the bit depth, so the effect of levels is the only thing that changes (smallest effective difference).',
  /* 15E: 4-up (136 / 20); every panel the same plot height, stroke, guides and baseline rule — only the levels change */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { T } = c, Ls = [2, 4, 8, 16], C = c.G.up(4), n = 12, ph = c.site ? G.SITE.PLOT : G.PLOT, INK = G.RULE.ink, HAIR = G.RULE.hair;
    const nameB = ph + 24 + G.cap(Z.item);
    let out = '';
    Ls.forEach((L, i) => {
      const x0 = C.x(i), X = t => x0 + t * C.w, Y = v => ph - v * ph, q = v => Math.round(v * (L - 1)) / (L - 1), ts = Array.from({ length: n }, (_, s) => (s + 0.5) / n), col = L === 8 ? T.signal : T.ink;
      let g = '';
      for (let l = 0; l < L; l++) g += ln(x0, Y(l / (L - 1)), x0 + C.w, Y(l / (L - 1)), T.rule, HAIR);
      g += ln(x0, ph, x0 + C.w, ph, T.ink, HAIR);
      g += curve(X, Y, 0, 1, T.rule, INK);
      let dd = 'M' + r(X(0)) + ',' + r(Y(q(F(ts[0]))));
      ts.forEach((t, s) => dd += 'V' + r(Y(q(F(t)))) + 'H' + r(X((s + 1) / n)));
      g += pa(dd, col, INK);
      g += tx(x0, nameB, L + ' levels', { z: Z.item, c: col }) + label(x0, nameB + 20, Math.log2(L) + ' bit', c);
      out += vis(i, c, g);
    });
    return out;
  } }
];

/* ================= 16 Exposure and development ================= */
const hex = v => { const n = Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'); return '#' + n + n + n; };
const frame = (x, y, w, h, dens) => { const t = v => hex(1 - dens(v));
  return rect(x, y, w, h, '#0B0C0C') + rect(x + w * 0.05, y + h * 0.18, w * 0.9, h * 0.66, t(0.88)) + rect(x + w * 0.05, y + h * 0.57, w * 0.9, h * 0.27, t(0.26)) + rect(x + w * 0.2, y + h * 0.36, w * 0.3, h * 0.36, t(0.52)) + rect(x + w * 0.28, y + h * 0.5, w * 0.1, h * 0.22, t(0.08)) + dot(x + w * 0.76, y + h * 0.3, h * 0.07, t(0.98)); };
const cl = v => Math.max(0.03, Math.min(0.97, v));
ALT[15] = [
{ key: 'C', name: 'Diagnose it', method: 'Identification key: two questions, in order, each with labelled answers', why: 'Turns the lesson into the procedure students use at the light box: edge numbers first, then the frames.',
  /* 16C, round 2: flush left. Each connector leaves its question 8 clear of the "?", the trunk 8 further on.
     Leaves on one 48 pitch; stubs = the group's longest label + 16 + arrowhead. One group label per bracket
     (DEVELOPMENT beside the pair, EXPOSURE beside the triple) in place of per-leaf sub-labels;
     the one remaining sub-label (LOOK FIRST) sits 4 below its name. */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { H, T } = c, z = Z.item, capI = G.cap(z), capL = G.cap(Z.label, 'm'), sw = G.RULE.ink, CL = G.CLEAR, AH = sw * 6, p = G.pitch(7, H - 24, 48), desc = 4;
    const top = G.snap(G.LIFT + capL - capI / 2), b = row => top + capI + row * p, m = row => b(row) - capI / 2;
    const q1 = 'Edge numbers?', q2 = 'Frames?', A1 = [['None', 'Fixer before developer', 0, 1], ['Faint', 'Underdeveloped', 1], ['Bright', 'Overdeveloped', 2], ['Normal', '', 4]], A2 = [['None', 'Camera or shutter fault', 3], ['Thin', 'Underexposed', 4], ['Dense', 'Overexposed', 5], ['Full range', 'Normal', 6]];
    const stub = A => Math.max(...A.map(a => IDL.labelW(a[0]))) + 2 * CL + AH;
    const s1 = IDL.gw(q1, z) + CL, j1 = s1 + CL, tip1 = j1 + stub(A1), a1 = tip1 + CL;
    const s2 = a1 + IDL.gw(q2, z) + CL, j2 = s2 + CL, tip2 = j2 + stub(A2), a2 = tip2 + CL;
    const branch = (s, j, tip, row0, a) => pa('M' + r(s) + ',' + r(m(row0)) + 'H' + r(j) + 'V' + r(m(a[2])) + 'H' + r(tip - sw), T.ink, sw) + IDL.arrow(tip, m(a[2]), T.ink, sw) + label((j + tip - AH) / 2, m(a[2]) - G.LIFT, a[0], c, { a: 'middle' });
    const group = (x, rows, lab) => { const bx = x + 16, y0 = m(rows[0]) - capI / 2, y1 = m(rows[rows.length - 1]) + capI / 2;
      return pa('M' + r(bx - 6) + ',' + r(y0) + 'H' + r(bx) + 'V' + r(y1) + 'H' + r(bx - 6), T.mute, G.RULE.hair) + label(bx + 8, (y0 + y1) / 2 + capL / 2, lab, c); };
    const w1 = Math.max(...A1.filter(a => a[1]).map(a => IDL.gw(a[1], z))), w2 = Math.max(...A2.map(a => IDL.gw(a[1], z)));
    let s0 = tx(0, b(4), q1, { z, c: T.ink }) + label(0, b(4) + desc + 4 + capL, 'Look first', c);
    A1.forEach(a => s0 += branch(s1, j1, tip1, 4, a) + (a[1] ? tx(a1, b(a[2]), a[1], { z, c: a[3] ? T.ink : T.signal }) : ''));
    s0 += group(a1 + w1, [0, 2], 'Processing');
    let s_ = tx(a1, b(4), q2, { z, c: T.ink });
    A2.forEach(a => s_ += branch(s2, j2, tip2, 4, a) + tx(a2, b(a[2]), a[1], { z, c: T.ink }));
    s_ += group(a2 + w2, [3, 6], 'Camera');
    return vis(0, c, s0) + vis(1, c, s_);
  } },
{ key: 'D', name: 'Two independent factors', method: 'Factorial grid: exposure down, development across, every combination drawn', why: 'Separates the two causes: moving down changes only the frame; moving across also changes the edge number.',
  /* 16D, round 3: row labels in columns 1-3, tiles three columns wide in 4-6, 7-9 and 10-12 (3 : 2), a 16 row gap and a
     one-line head (axis labels on the column heads' baseline). The tile size comes from the space available, so the unit
     fits the page; when the height caps the tiles they are centred in their columns. Edge print <= 8 % of the frame height. */
  render(d, c) {
    const G = IDL.G, Z = G.Z, label = IDL.label, { W, H, T } = c, ex = [['Under', -0.28], ['Normal', 0], ['Over', 0.3]], dv = [['Under', 0.36, 0.3], ['Normal', 0.72, 1], ['Over', 1.2, 1.7]];
    const cg = c.G, capL = G.cap(Z.label, 'm'), head = 24, gap = 16, room = c.room || H, cw = cg.span(3);
    const th = Math.min(cw / 1.5, (room - head - 2 * gap) / 3), tw = th * 1.5, X = j => cg.x(3 + 3 * j) + (cw - tw) / 2;
    let out = label(0, capL, 'Exposure ↓', c) + label(cg.x(3) - cg.gut, capL, 'Development →', c, { a: 'end' });
    dv.forEach((dd, j) => out += label(X(j), capL, dd[0], c, { c: j === 1 ? T.ink : T.signal }));
    ex.forEach((ee, i) => {
      const y = head + i * (th + gap);
      let q = label(0, y + capL, ee[0], c, { c: T.ink });
      dv.forEach((dd, j) => {
        const x = X(j), dens = v => cl(0.1 + ee[1] + (v - 0.5) * dd[1] + 0.36), ez = th * 0.08;
        q += frame(x, y, tw, th, dens) + '<text x="' + r(x + tw * 0.04) + '" y="' + r(y + th * 0.04 + ez) + '" fill="#E8E6E0" opacity="' + Math.min(1, dd[2]) + '" style="font-family:' + IDL.FONT.m + ';font-size:' + r(ez) + 'px;font-weight:' + (dd[2] > 1 ? 700 : 400) + '">12A</text>';
      });
      out += vis(i, c, q);
    });
    return out;
  } },
{ key: 'E', name: 'The characteristic curve', method: 'Technical graph: density against log exposure, one curve per development', why: 'The textbook model (Langford): exposure moves the frame along a curve; development changes the curve itself — and the edge numbers sit at one fixed exposure on it.',
  render(d, c) {
    const { W, H, T, u, sw } = c, yl = IDL.mw('Density', c.Q) + 3 * u, xb = c.Q + 4 * u, pw = W - yl - 2 * u, ph = H - xb - 2 * u;
    const X = e => yl + e * pw, Y = D => ph + 2 * u - D * ph, curveD = (e, g) => { const s = 1 / (1 + Math.exp(-(e - 0.5) * 9 * g)); return 0.08 + 0.85 * s; };
    let out = ln(yl, ph + 2 * u, yl + pw, ph + 2 * u, T.ink, sw) + ln(yl, 2 * u, yl, ph + 2 * u, T.ink, sw) + tx(yl + pw, H - c.Q * 0.2, 'Exposure (log) →', { f: 'm', z: c.Q, c: T.mute, a: 'end' }) + tx(0, 2 * u + c.Q * 0.8, 'Density', { f: 'm', z: c.Q, c: T.mute });
    const G = [['Over', 1.5, T.signal], ['Normal', 1, T.ink], ['Under', 0.55, T.signal]], eEdge = 0.66;
    G.forEach((g, i) => {
      const pts = Array.from({ length: 81 }, (_, s) => { const e = s / 80; return [X(e), Y(curveD(e, g[1]))]; });
      /* port, 30-09-2026: the leaders stood at 0.70 / 0.72 / 0.74 with the labels starting at 0.74, so the last
         leader ran through the first letters of the two labels above it. Reversed (the top label's leader
         rightmost, so no leader crosses another's horizontal) and the labels set 2u clear of them. */
      const le = 0.74 - i * 0.02, lx = X(0.74) + 2 * u, ly = Y(0.44) + i * (c.Q + 3 * u), px = X(le), py = Y(curveD(le, g[1]));
      out += vis(i, c, pa('M' + pts.map(p => r(p[0]) + ',' + r(p[1])).join('L'), g[2], sw) + pa('M' + r(px) + ',' + r(py) + 'V' + r(ly - c.Q * 0.35) + 'H' + r(lx - u), g[2], c.hair * 1.5) + tx(lx, ly, g[0] + ' developed', { f: 'm', z: c.Q, c: g[2] }) + dot(X(eEdge), Y(curveD(eEdge, g[1])), u, g[2]));
    });
    out += vis(1, c, ln(X(eEdge), 2 * u, X(eEdge), ph + 2 * u, T.ink, c.hair * 1.5, '6 6') + tx(X(eEdge) - 2 * u, 2 * u + c.Q * 0.8, 'Edge numbers — fixed exposure', { f: 'm', z: c.Q, c: T.ink, a: 'end' }));
    const eL = 0.14, eR = 0.36, yA = ph * 0.62;
    out += vis(2, c, ln(X(eR), yA, X(eL) + sw * 6, yA, T.ink, sw) + '<g transform="translate(' + r(X(eL)) + ',' + r(yA) + ') rotate(180)">' + IDL.arrow(0, 0, T.ink, sw) + '</g>' + tx((X(eL) + X(eR)) / 2, yA - 1.25 * u, 'Underexposed', { f: 'm', z: c.Q, c: T.ink, a: 'middle' }) + tx((X(eL) + X(eR)) / 2, yA + u + c.Q, 'same curve, lower down', { f: 't', w: 400, z: c.Q, c: T.ink, a: 'middle' }));
    return out;
  } }
];
})();

/* ---- the topics, the data the renders read, and the form ---- */
(function () {
const IDL = window.IDL, R = IDL.R, G = IDL.G;
/* Design's 04-content.js and 05-week5.js: the 16 topics in ALT order */
IDL.ALT_TOPICS = ['File formats', 'Folder structure', 'File naming', 'File naming — sorting', 'Storage', 'Cables',
  'SD card routine', 'Backup 3-2-1', 'Backup rotation', 'File formats compared', 'Bit depth', 'Organisational tools',
  'Raw files', 'Print size', 'Analog and digital', 'Exposure and development'];
const S = (id, name, col, tags, icon, key) => ({ id, name, col, tags, icon, key: !!key });
const L = (from, to, label) => ({ from, to, label });
const route = {
  stages: [S('cam', 'Camera', 0, ['RAW'], 'camera'), S('scan', 'Scan', 0, ['TIFF'], 'film'), S('edit', 'Edit', 1, ['RAW', 'PSD'], 'laptop'),
    S('store', 'Store', 2, ['DNG', 'TIFF'], 'drives', 1), S('screen', 'Screen', 3, ['JPEG'], 'monitor'), S('print', 'Print', 3, ['TIFF', 'PDF'], 'printer')],
  links: [L('cam', 'edit', 'Import'), L('scan', 'edit', 'Import'), L('edit', 'store', 'Save'), L('store', 'screen', 'Export'), L('store', 'print', 'Export')]
};
const folders = { root: { name: 'Photography', children: [{ name: '2025' }, { name: '2026', children: [{ name: 'Portraits' }, { name: 'TS2 Assignments', children: [{ name: '20261001_Cezanne_Paul' }, { name: '20261008_Still' }] }] }, { name: '2027' }] },
  path: ['Photography', '2026', 'TS2 Assignments', '20261001_Cezanne_Paul'] };
const filename = { parts: [
  { t: '20261001', label: 'Date', note: 'YYYYMMDD', key: 1 }, { t: '_', sep: 1 }, { t: 'Cezanne_Paul', label: 'Subject', note: 'LAST_FIRST' },
  { t: '_', sep: 1 }, { t: 'BK', label: 'Initials', note: 'PHOTOGRAPHER' }, { t: '_', sep: 1 }, { t: '0125', label: 'Sequence', note: 'FOUR DIGITS' }] };
const storage = { head: 'Medium', cols: ['Up to, TB', 'Speed, MB/s', '€ per TB', 'Moving parts', 'Use'], mark: { col: 2, value: '15' }, rows: [
  { name: 'HDD', v: ['24', '250', '15', 'Yes', 'Archive'] }, { name: 'SSD', v: ['8', '2,000', '70', 'No', 'Working files'] },
  { name: 'SD card', v: ['1', '300', '100', 'No', 'In the camera'] }, { name: 'USB stick', v: ['1', '400', '80', 'No', 'Handing over'] },
  { name: 'NAS', v: ['96', '110', '20', 'Yes', 'Shared archive'] }, { name: 'Cloud', v: ['5', '50', '60 a year', '—', 'Off-site copy'] }] };
const cables = { scale: 'log', unit: 'Transfer speed', range: [100, 150000], ticks: [{ v: 100, label: '100 Mb/s' }, { v: 1000, label: '1 Gb/s' }, { v: 10000, label: '10 Gb/s' }, { v: 100000, label: '100 Gb/s' }], items: [
  { name: 'USB 2.0', v: 480, label: '480 Mb/s', key: 1 }, { name: 'USB 3.2 Gen 1', v: 5000, label: '5 Gb/s' }, { name: 'USB 3.2 Gen 2', v: 10000, label: '10 Gb/s' },
  { name: 'USB4', v: 40000, label: '40 Gb/s' }, { name: 'Thunderbolt 4', v: 40000, label: '40 Gb/s' }, { name: 'Thunderbolt 5', v: 80000, boost: 120000, label: '80 (120) Gb/s' }] };
const sd = { steps: [
  { t: 'Import', line: 'Copy every file from the card to the working drive.' }, { t: 'Check', line: 'Open the folder and confirm every frame is there.' },
  { t: 'Back up', line: 'Copy the folder to a second drive.' }, { t: 'Format', warn: 'In the camera, not on the computer.' }] };
const naming = { cols: ['File name', 'Shot on'],
  before: { label: 'As shot', rows: [['DSC_0012.NEF', '15 Oct'], ['final_FINAL2.tif', '01 Oct'], ['IMG_4032.CR3', '08 Oct'], ['portrait new.jpg', '03 Oct']] },
  after: { label: 'Renamed', rows: [['20261001_Cezanne_Paul_BK_0001.tif', '01 Oct'], ['20261003_Portrait_BK_0001.jpg', '03 Oct'], ['20261008_Still_BK_0001.CR3', '08 Oct'], ['20261015_Street_BK_0001.NEF', '15 Oct']] } };
/* the first seven topics hand their drawings data; the other nine carry theirs inside the render */
IDL.ALT_DATA = [route, folders, filename, naming, storage, cables, sd];

/* ---------- ALT: one of Design's alternatives, by topic and key ----------
   { topic: 0-15, key: 'C' | 'D' | 'E' }
   The older alternatives size themselves from the legacy roles (u, P, S, Q, B, sw), set for Design's 16:10
   slide frame, where one grid px is 1296 / 604 slide px: P = 48 slide px = 22.4 grid px. On the lecture
   page one grid px is one page px, so they are given the grid-px values: P 22.4 (item), Q 12.6 (label),
   S 14.9 and B 14 (note), u 3.7 - the site's own type scale, rules at the site's 1.5 and 1. The drawings
   Design refined for the page (06C, 07C, 10C, 11C, 11D, 12D, 13E, 14C, 15E, 16C, 16D) read G.Z and ignore
   these.
   Height: most of them share out the height they are given, and on a page seated in the middle the room
   the mount measures is not known (it falls back to 640, taller than a 1440 page leaves). So the frame is
   the height Design drew them in - 0.44 of the width (its slide frame: 267 of 604 grid px) - or the room,
   whichever is less, and never more than 460 grid px: a grid px scales with the page HEIGHT (1.0 at 900,
   1.2 at 1080), so 460 is the same share of the page at 1440 x 900 and 1920 x 1080, where 0.44 of the
   wider 16:9 column alone ran the page past its foot. A drawing that centres itself in that frame is
   lifted to its own top, so the page, not the frame, decides the space above it. */
const LEG = G.REF / 1296, ASPECT = 0.44, ROOM = 460;
const lift = m => {
  if (typeof document === 'undefined' || !document.body) return m;
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('style', 'position:absolute;left:-99999px;top:0;width:10px;height:10px;visibility:hidden');
  s.innerHTML = '<g>' + m + '</g>'; document.body.appendChild(s);
  let y = 0; try { y = s.firstChild.getBBox().y; } catch (e) { y = 0; }
  s.remove();
  return y > 1 ? '<g transform="translate(0,' + IDL.r(-y) + ')">' + m + '</g>' : m;
};
R.alt = (d, c) => {
  const set = IDL.ALT[d.topic], a = set && set.find(o => o.key === String(d.key).toUpperCase());
  if (!a) throw new Error('alt: no drawing for topic ' + d.topic + ' key ' + d.key);
  const H = Math.min(c.H, c.room || c.H, c.W * ASPECT, ROOM);
  const cc = Object.assign({}, c, { H, room: H, u: 8 * LEG, P: 48 * LEG, S: 32 * LEG, Q: 27 * LEG, B: 30 * LEG, sw: G.RULE.ink, hair: G.RULE.hair });
  return lift(a.render(IDL.ALT_DATA[d.topic] || {}, cc));
};
})();
