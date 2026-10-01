/* ============================================================
   A · Scanner Comparison
   ------------------------------------------------------------
   One frame, scanned on two scanners, laid one over the
   other with a curtain between them: the left scan to the left
   of the curtain, the right scan to the right. Drag the curtain
   and the same edge of the same frame passes from one scanner to
   the other, so what changes is the scanner and nothing else.

   His words, 30-09-2026: "şimdi özellikle bu kıyaslamalar için
   bir perde interaction'ı yapalım ... bu sağa sola kaydırarak
   farkı gördüğümüz şey."

   THE PICTURES ARE ALIGNED BEFORE THEY ARRIVE. The lab's scans
   are not the same crop of the frame; make-scancompare.py matches
   every scan of a set to one reference, warps it onto it and cuts
   all of them to the area they share, so a pixel here is the
   same point of the negative in every file of the set. That is
   what lets the curtain be a straight line and not a seam.

   THE HANDS. The scanner on each side is picked from a list of
   names beside that side of the picture; the film - which frame
   is being looked at - is the one cell of the strip; full frame
   or detail is a view, so it is in the view bar with Full screen.

   GENERIC. The sets live in SC_SETS below: which scanners each
   frame went through and whether a detail crop exists; a file is
   <base><set>-<scanner>[-detail].jpg. A page can pin:
     data-set    the set it opens on             ('35-c41')
     data-sets   the sets it offers, comma list  (all of them)
     data-left   data-right   the scanners it opens on
     data-view   'detail' to open on the detail crop
     data-base   the folder the files are in     ('assets/scancompare/')

   Keys (printed under the picture): ← → move the curtain, shift
   ten times as far; V full frame / detail. The arrows belong to
   the curtain only while the picture holds the keys - after it
   has been pressed, or in full screen - so the deck still turns
   its page on → the rest of the time; Escape hands them back.
   ============================================================ */

/* the scanners, as The Black and White Box names and describes them */
const SC_SCANNERS = [
  { id: 'frontier', name: 'Frontier', model: 'Fujifilm Frontier SP3000', kind: 'lab scanner' },
  { id: 'noritsu', name: 'Noritsu', model: 'Noritsu HS-1800', kind: 'lab scanner' },
  { id: 's1r', name: 'S1R', model: 'Panasonic S1R', kind: 'camera scan' },
  { id: 'tango', name: 'Tango', model: 'Heidelberg Tango', kind: 'drum scanner' },
  { id: 'imacon', name: 'Imacon', model: 'Hasselblad Flextight X5', kind: 'virtual drum scanner' },
  { id: 'v800', name: 'V800', model: 'Epson V800', kind: 'flatbed scanner' },
];

/* one frame per set; the scanners the lab put it through, and the pair it
   opens on. 4x5 has no Frontier and no Noritsu: neither takes sheet film. */
const SC_SETS = [
  { id: '35-c41', name: '35 mm C-41', detail: true,
    has: ['frontier', 'noritsu', 's1r', 'tango', 'imacon', 'v800'], pair: ['frontier', 'noritsu'] },
  { id: '120-e6', name: '120 E-6', detail: true,
    has: ['frontier', 'noritsu', 's1r', 'tango', 'imacon', 'v800'], pair: ['frontier', 'noritsu'] },
  { id: '4x5-c41', name: '4×5 C-41', detail: true,
    has: ['s1r', 'tango', 'imacon', 'v800'], pair: ['tango', 'v800'] },
];

function mountScanCompare(fig) {
  const p = palette(fig);
  fig.classList.add('sc');
  const d = fig.dataset;
  const base = d.base || 'assets/scancompare/';
  const offered = d.sets ? d.sets.split(',').map((s) => s.trim()) : null;
  const sets = SC_SETS.filter((s) => !offered || offered.includes(s.id));
  const scanner = (id) => SC_SCANNERS.find((s) => s.id === id);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Scanner Comparison'),
              el('span', 'ts-sub', 'one frame · two scans · side by side'));
  fig.prepend(head);

  /* THE HANDS BESIDE THE SIDES THEY CHOOSE. The scans are square and the
     stage is wide, so a square picture centred in it leaves two fields of
     stage either side. The scanner for the left of the curtain is chosen from
     a list in the left field, the scanner for the right from the right one:
     each list sits beside the half of the picture it sets (U11), pinned to
     its edge and as wide as a name. The strip keeps the one choice that
     changes both sides at once, the film. */
  const stage = el('div', 'stage wide sc-stage');
  head.after(stage);
  const row = el('div', 'sc-row');
  const benchL = el('div', 'sc-bench l');
  const pic = el('div', 'sc-pic');
  const benchR = el('div', 'sc-bench r');
  row.append(benchL, pic, benchR);
  stage.append(row);

  const first = sets.find((s) => s.id === d.set) || sets[0];
  const state = {
    set: first.id,
    left: first.has.includes(d.left) ? d.left : first.pair[0],
    right: first.has.includes(d.right) ? d.right : first.pair[1],
    detail: d.view === 'detail' && first.detail,
    pos: 0.5,
  };
  if (state.right === state.left) state.right = first.has.find((s) => s !== state.left);
  const set = () => sets.find((s) => s.id === state.set);

  /* ---- the pictures. Nothing is fetched until the instrument is first
     drawn, which is when its page is shown: a week that carries it does not
     download thirty-two scans on opening. Then the set on screen, and the
     other sets once it has come, so a press on Film answers at once. ---- */
  const cache = {};
  const file = (sid, scid, detail) => {
    const src = base + sid + '-' + scid + (detail ? '-detail' : '') + '.jpg';
    return window.TS2_ASSET ? window.TS2_ASSET(src) : src;
  };
  const img = (sid, scid, detail) => {
    const k = sid + '/' + scid + '/' + (detail ? 'd' : 'f');
    if (!cache[k]) cache[k] = loadImage(file(sid, scid, detail), () => view.render());
    return cache[k];
  };
  const loadSet = (s) => s.has.forEach((id) => { img(s.id, id, false); if (s.detail) img(s.id, id, true); });
  let rest = false;
  const loadRest = (now) => {
    if (rest || !now.has.every((id) => img(now.id, id, false).ready)) return;
    rest = true;
    sets.forEach((s) => loadSet(s));
  };

  /* ---- the view bar: detail, and full screen ---- */
  const bar = el('div', 'viewbar');
  stage.append(bar);
  const bView = el('button', 'vw');
  bView.type = 'button';
  bar.append(bView);
  const bFs = fsButton(bar, fig);
  /* C15: a word that changes does not move the bar */
  pinWidth(bView, ['Full frame', 'Detail']);
  pinWidth(bFs, ['Leave full screen', 'Full screen']);
  bView.addEventListener('click', () => { state.detail = !state.detail; sync(); });

  const view = canvas(pic, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('aria-label', 'Two scans of one negative with a curtain between them');

  /* ---- the two lists: which scanner on each side ---- */
  function bench(box, title, onPick) {
    box.append(el('div', 'sc-h', title));
    /* the house chips, stood on end: a name each, as wide as the name. What
       kind of scanner it is stands on the picture, beside its scan. */
    const list = el('div', 'chips sc-list');
    const items = {};
    SC_SCANNERS.forEach((sc) => {
      const b = el('button', 'chip', sc.name);
      b.type = 'button';
      b.addEventListener('click', () => { if (!b.disabled) onPick(sc.id); });
      list.append(b);
      items[sc.id] = b;
    });
    box.append(list);
    return items;
  }
  const leftItems = bench(benchL, 'Left', (id) => { state.left = id; sync(); });
  const rightItems = bench(benchR, 'Right', (id) => { state.right = id; sync(); });

  /* ---- the strip: which negative. One negative is not a choice, and a
     strip with nothing in it is not drawn (S13). ---- */
  let setChips = null;
  if (sets.length > 1) {
    const controls = el('div', 'controls');
    fig.insertBefore(controls, fig.querySelector('figcaption'));
    const ctl = el('div', 'ctl sc-cell');
    ctl.append(el('label', null, 'Film'));
    const chips = el('div', 'chips');
    setChips = {};
    sets.forEach((st) => {
      const c = el('button', 'chip', st.name);
      c.type = 'button';
      c.addEventListener('click', () => pickSet(st.id));
      chips.append(c);
      setChips[st.id] = c;
    });
    ctl.append(chips);
    controls.append(ctl);
  }
  function pickSet(id) {
    const s = sets.find((x) => x.id === id);
    if (!s || id === state.set) return;
    state.set = id;
    if (!s.has.includes(state.left)) state.left = s.pair[0];
    if (!s.has.includes(state.right) || state.right === state.left) {
      state.right = s.has.includes(s.pair[1]) && s.pair[1] !== state.left
        ? s.pair[1] : s.has.find((x) => x !== state.left);
    }
    if (!s.detail) state.detail = false;
    loadSet(s);
    sync();
  }

  /* NOTHING IS LIVE THAT CANNOT BE USED. A scanner the negative never went
     through is off on both sides; the scanner already on one side is off on
     the other, because a scan compared with itself shows nothing. Off, not
     hidden: the names keep their places (S18). */
  const paint = (items, pressed, other) => {
    Object.keys(items).forEach((id) => {
      const b = items[id], off = !set().has.includes(id) || id === other;
      b.setAttribute('aria-pressed', String(id === pressed));
      b.disabled = off;
      b.classList.toggle('off', off);
    });
  };

  function sync() {
    if (setChips) Object.keys(setChips).forEach((id) => setChips[id].setAttribute('aria-pressed', String(id === state.set)));
    paint(leftItems, state.left, state.right);
    paint(rightItems, state.right, state.left);
    /* the button says what it will do next (C12) */
    bView.textContent = state.detail ? 'Full frame' : 'Detail';
    bView.disabled = !set().detail;
    bView.classList.toggle('off', !set().detail);
    view.render();
  }

  /* ---- the curtain, by hand ---- */
  let rect = null;                 /* where the picture was last drawn */
  let dragging = false;
  const toPos = (e) => {
    if (!rect) return;
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left;
    state.pos = Math.max(0, Math.min(1, (x - rect.x) / rect.w));
    view.render();
  };
  cv.addEventListener('pointerdown', (e) => {
    if (document.body.classList.contains('design')) return;
    dragging = true;
    cv.setPointerCapture(e.pointerId);
    cv.focus({ preventScroll: true });
    toPos(e);
  });
  cv.addEventListener('pointermove', (e) => { if (dragging) toPos(e); });
  const up = () => { dragging = false; };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('focus', () => view.render());
  cv.addEventListener('blur', () => view.render());

  /* ---- and by key. K4: taken before the deck's own paging, but only while
     the picture holds the keys, so a presenter's → still turns the page. ---- */
  const inFs = () => document.fullscreenElement === fig || fig.classList.contains('fs-on');
  const holds = () => inFs() || document.activeElement === cv;
  const shown = () => {
    if (!fig.isConnected || !fig.getClientRects().length) return false;
    const step = fig.closest('.step');
    return inFs() || !step || step.classList.contains('active');
  };
  const onKey = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (!shown()) return;
    if (e.key === 'v' || e.key === 'V') {
      if (set().detail) { state.detail = !state.detail; sync(); }
      e.preventDefault(); e.stopImmediatePropagation();
      return;
    }
    if (!holds()) return;
    const k = e.shiftKey ? 0.1 : 0.01;
    if (e.key === 'ArrowLeft') state.pos = Math.max(0, state.pos - k);
    else if (e.key === 'ArrowRight') state.pos = Math.min(1, state.pos + k);
    else return;
    e.preventDefault(); e.stopImmediatePropagation();
    view.render();
  };
  window.addEventListener('keydown', onKey, true);

  /* ---- the drawing ---- */
  /* THE NAME OF EACH SIDE, ON ITS SIDE. The model and what kind of scanner
     it is, in a plate at the picture's top corner, cut by the curtain like
     the scan under it. A plate wider than two fifths of the picture would
     meet the other side's at the curtain, so a small picture carries the
     short name and the kind, and a smaller one the short name alone - both
     sides the same way, so the two plates are one kind of thing. */
  const MONO = '"JetBrains Mono", ui-monospace, monospace';
  function tagSizes() {
    const big = Math.round(Math.max(11, Math.min(17, rect.w / 46)));
    const small = big < 14 ? 9 : 10;
    return { big, small, padX: Math.round(big * 0.7), padY: Math.round(big * 0.55), gap: Math.round(big * 0.4) };
  }
  function tagWords(sc, mode) {
    return [(mode === 0 ? sc.model : sc.name).toUpperCase(), mode < 2 ? sc.kind.toUpperCase() : ''];
  }
  function tagMode(ctx, scs) {
    const z = tagSizes();
    const width = (t, sz) => { ctx.font = '500 ' + sz + 'px ' + MONO; return t ? ctx.measureText(t).width : 0; };
    for (let mode = 0; mode < 2; mode++) {
      const fits = scs.every((sc) => {
        const [n, k] = tagWords(sc, mode);
        return Math.max(width(n, z.big), width(k, z.small)) + z.padX * 2 <= rect.w * 0.4;
      });
      if (fits) return mode;
    }
    return 2;
  }
  function tag(ctx, sc, mode, x, y, right) {
    const z = tagSizes();
    const [n, k] = tagWords(sc, mode);
    ctx.save();
    ctx.font = '500 ' + z.big + 'px ' + MONO;
    const w1 = ctx.measureText(n).width;
    ctx.font = '500 ' + z.small + 'px ' + MONO;
    const w2 = k ? ctx.measureText(k).width : 0;
    const bw = Math.max(w1, w2) + z.padX * 2;
    const bh = z.big + (k ? z.small + z.gap : 0) + z.padY * 2;
    const bx = right ? x - bw : x;
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = p.stage;
    ctx.fillRect(bx, y, bw, bh);
    ctx.restore();
    const tx = right ? bx + bw - z.padX : bx + z.padX, al = right ? 'right' : 'left';
    label(ctx, n, tx, y + z.padY + z.big * 0.8, p.fg, z.big, al);
    if (k) label(ctx, k, tx, y + z.padY + z.big + z.gap + z.small * 0.8, p.muted, z.small, al);
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const s = set();
    const A = img(s.id, state.left, state.detail), B = img(s.id, state.right, state.detail);
    loadSet(s);
    loadRest(s);
    if (!A.ready || !B.ready) {
      label(ctx, 'LOADING THE SCANS', w / 2, h / 2, p.muted, 10, 'center');
      return;
    }
    /* THE PICTURE TAKES THE ROOM. Square scans on a wide stage: fitted to the
       height, centred, the stage colour either side, one row of keys under
       it. It rises to the top of the stage unless it would reach under the
       view bar, top right; then it starts below the bar. */
    const iw = A.img.naturalWidth, ih = A.img.naturalHeight;
    const foot = 34, side = 16;
    const cr = cv.getBoundingClientRect(), br = bar.getBoundingClientRect();
    const barLeft = br.left - cr.left - 10, barH = br.bottom - cr.top + 8;
    const fit = (top) => {
      const k = Math.min((w - side * 2) / iw, (h - top - foot) / ih);
      const pw = Math.round(iw * k), ph = Math.round(ih * k);
      return { x: Math.round((w - pw) / 2), y: Math.round(top + (h - top - foot - ph) / 2), w: pw, h: ph };
    };
    let r = fit(12);
    if (r.x + r.w > barLeft && r.y < barH) r = fit(barH);
    rect = r;
    const x = r.x, y = r.y, pw = r.w, ph = r.h;
    const cx = Math.round(x + pw * state.pos);
    const mode = tagMode(ctx, [scanner(state.left), scanner(state.right)]);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, cx - x, ph); ctx.clip();
    ctx.drawImage(A.img, x, y, pw, ph);
    tag(ctx, scanner(state.left), mode, x, y, false);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(cx, y, x + pw - cx, ph); ctx.clip();
    ctx.drawImage(B.img, x, y, pw, ph);
    tag(ctx, scanner(state.right), mode, x + pw, y, true);
    ctx.restore();
    ctx.restore();

    /* the curtain: the one thing here the hand moves, so it is the signal.
       Its grip fills with the signal while the picture holds the arrow keys,
       and stands empty while the deck has them (U1). */
    const lit = holds();
    ctx.fillStyle = p.signal;
    ctx.fillRect(cx - 1, y, 2, ph);
    const g = 30, gy = Math.round(y + ph / 2 - g / 2);
    ctx.fillStyle = lit ? p.signal : p.stage;
    ctx.fillRect(cx - g / 2, gy, g, g);
    ctx.strokeStyle = p.signal; ctx.lineWidth = 2;
    ctx.strokeRect(cx - g / 2 + 1, gy + 1, g - 2, g - 2);
    ctx.fillStyle = lit ? p.stage : p.fg;
    const m = gy + g / 2;
    ctx.beginPath(); ctx.moveTo(cx - 3, m - 5); ctx.lineTo(cx - 9, m); ctx.lineTo(cx - 3, m + 5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 3, m - 5); ctx.lineTo(cx + 9, m); ctx.lineTo(cx + 3, m + 5); ctx.fill();

    /* the keys, in one row under the thing they drive (K2) */
    const keys = [[['\u2190', '\u2192'], 'move the curtain'], [['\u21e7'], '\u00d7 10']];
    if (s.detail) keys.push([['V'], state.detail ? 'full frame' : 'detail']);
    keyRow(ctx, x + pw / 2, y + ph + 19, keys, p.fg, p.muted);
  }

  document.addEventListener('fullscreenchange', () => view.render());
  sync();
  return { render: view.render };
}

window.mountScanCompare = mountScanCompare;
