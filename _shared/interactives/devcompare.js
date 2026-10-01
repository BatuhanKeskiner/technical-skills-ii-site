/* ============================================================
   A · Exposure and Development   (working name, provisional)
   ------------------------------------------------------------
   One photograph - Alisa - exposed three ways and developed
   three ways: nine negatives and the nine prints made from them.
   Any two of the nine are laid one over the other with a curtain
   between them, the Scanner Comparison's curtain: the left one to
   the left of it, the right one to the right. Drag it and the same
   edge of the same frame passes from one treatment to the other.

   His words, 30-09-2026: "Bu scanner comparison'in aynisini bu
   9'lu grid ve negatifleriyle birlikte Alisanin fotografi icin de
   yap ... tum kombinasyonlara yan yana bakabilelim."

   THE PICTURES LINE UP BEFORE THEY ARRIVE. make-devchart.py makes
   all eighteen from one print, so the nine negatives are one shape
   (the frame with its film edge, stood upright) and the nine prints
   another (the picture only). Within one view both sides are the
   same shape and a pixel is the same point of the frame on both,
   so the curtain is a straight line and not a seam.

   THE HANDS. Each side is chosen beside that side of the picture,
   as the scanners are: two short lists, Exposure and Development,
   under / correct / over each - the two axes of the chart, so the
   nine combinations are the two lists crossed. Negative or print
   is a view, so it is in the view bar with Full screen.

   A page can pin:
     data-left   data-right   '<exposure>-<development>'
                              ('correct-correct', 'under-correct')
     data-view   'print' to open on the prints (default negatives)
     data-base   the folder the files are in    ('assets/devchart/')
   A file is <base>devchart-<exposure>-<development>-<neg|pos>.jpg.

   Keys (printed under the picture): <- -> move the curtain, shift
   ten times as far; V negative / print. The arrows belong to the
   curtain only while the picture holds the keys - after it has
   been pressed, or in full screen - so the deck still turns its
   page on -> the rest of the time.
   ============================================================ */

/* the three steps of each axis, in the order of the ladder: README */
const DC_LEVELS = [
  { id: 'under', name: 'Under' },
  { id: 'correct', name: 'Correct' },
  { id: 'over', name: 'Over' },
];
const DC_EXPOSED = { under: 'Under-exposed', over: 'Over-exposed' };
const DC_DEVELOPED = { under: 'Under-developed', over: 'Over-developed' };

/* the plain name of a combination, exposure first: "Correct",
   "Under-exposed", "Over-developed", "Under-exposed · over-developed" */
function dcName(e, d) {
  if (e === 'correct' && d === 'correct') return 'Correct';
  if (d === 'correct') return DC_EXPOSED[e];
  if (e === 'correct') return DC_DEVELOPED[d];
  return DC_EXPOSED[e] + ' · ' + DC_DEVELOPED[d].toLowerCase();
}

function mountDevCompare(fig) {
  const p = palette(fig);
  /* it wears the Scanner Comparison's classes: one look for the curtain */
  fig.classList.add('sc', 'dc');
  const d = fig.dataset;
  const base = d.base || 'assets/devchart/';
  const ids = DC_LEVELS.map((l) => l.id);
  const COMBOS = [];
  ids.forEach((e) => ids.forEach((dv) => COMBOS.push(e + '-' + dv)));

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Exposure and Development'),
              el('span', 'ts-sub', 'one photograph · nine ways · side by side'));
  fig.prepend(head);

  /* THE HANDS BESIDE THE SIDES THEY CHOOSE - the Scanner Comparison's
     stage: a list for the left of the curtain in the left field, one for
     the right in the right field, each pinned to its edge (U11). */
  const stage = el('div', 'stage wide sc-stage');
  head.after(stage);
  const row = el('div', 'sc-row');
  const benchL = el('div', 'sc-bench l');
  const pic = el('div', 'sc-pic');
  const benchR = el('div', 'sc-bench r');
  row.append(benchL, pic, benchR);
  stage.append(row);

  const parse = (s, fallback) => {
    const m = /^(under|correct|over)-(under|correct|over)$/.exec(s || '');
    return m ? { e: m[1], d: m[2] } : fallback;
  };
  const state = {
    left: parse(d.left, { e: 'correct', d: 'correct' }),
    right: parse(d.right, { e: 'under', d: 'correct' }),
    view: d.view === 'print' ? 'print' : 'neg',
    pos: 0.5,
  };
  const same = (a, b) => a.e === b.e && a.d === b.d;
  if (same(state.left, state.right)) {
    state.right = same(state.left, { e: 'under', d: 'correct' })
      ? { e: 'correct', d: 'correct' } : { e: 'under', d: 'correct' };
  }
  const key = (s) => s.e + '-' + s.d;

  /* ---- the pictures. Nothing is fetched until the instrument is first
     drawn, which is when its page is shown: a week that carries it does not
     download eighteen pictures on opening. Then the two on screen; once they
     have come, the other seven of this view; once those have, the other
     view's nine, so a press on a list or on V answers at once. ---- */
  const cache = {};
  const file = (c, v) => {
    const src = base + 'devchart-' + c + '-' + (v === 'print' ? 'pos' : 'neg') + '.jpg';
    return window.TS2_ASSET ? window.TS2_ASSET(src) : src;
  };
  const img = (c, v) => {
    const k = c + '/' + v;
    if (!cache[k]) cache[k] = loadImage(file(c, v), () => view.render());
    return cache[k];
  };
  const loadOn = (now) => {
    COMBOS.forEach((c) => img(c, now));
    if (COMBOS.every((c) => img(c, now).ready)) COMBOS.forEach((c) => img(c, now === 'neg' ? 'print' : 'neg'));
  };
  /* THE CURTAIN MOVES WITH THE HAND. The files are 2400 px tall and the
     picture is drawn at a sixth of that; scaling both of them again on every
     move of the curtain is what makes a drag lag. Each is scaled once to the
     size it is shown at and drawn from that until the size changes. */
  const scaled = (box, pw, ph) => {
    const k = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(pw * k)), H = Math.max(1, Math.round(ph * k));
    if (box.small && box.small.width === W && box.small.height === H) return box.small;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';
    g.drawImage(box.img, 0, 0, W, H);
    box.small = c;
    return c;
  };

  /* ---- the view bar: negative or print, and full screen ---- */
  const bar = el('div', 'viewbar');
  stage.append(bar);
  const bView = el('button', 'vw');
  bView.type = 'button';
  bar.append(bView);
  const bFs = fsButton(bar, fig);
  /* C15: a word that changes does not move the bar */
  pinWidth(bView, ['Negative', 'Print']);
  pinWidth(bFs, ['Leave full screen', 'Full screen']);
  const flip = () => { state.view = state.view === 'neg' ? 'print' : 'neg'; sync(); };
  bView.addEventListener('click', flip);

  const view = canvas(pic, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('aria-label', 'One photograph exposed and developed two ways, with a curtain between them');

  /* ---- the two lists on each side: exposure, then development ---- */
  function list(box, title, side, axis) {
    const grp = el('div', 'dc-grp');
    grp.append(el('div', 'sc-h', title));
    const chips = el('div', 'chips sc-list');
    const items = {};
    DC_LEVELS.forEach((lv) => {
      const b = el('button', 'chip', lv.name);
      b.type = 'button';
      b.addEventListener('click', () => {
        if (b.disabled) return;
        state[side][axis] = lv.id;
        sync();
      });
      chips.append(b);
      items[lv.id] = b;
    });
    grp.append(chips);
    box.append(grp);
    return items;
  }
  /* both lists one width, the widest name's, so the two read as one column */
  function bench(box, title, side) {
    box.append(el('div', 'sc-h dc-side', title));
    const lists = el('div', 'dc-lists');
    box.append(lists);
    return { e: list(lists, 'Exposure', side, 'e'), d: list(lists, 'Development', side, 'd') };
  }
  const leftItems = bench(benchL, 'Left', 'left');
  const rightItems = bench(benchR, 'Right', 'right');

  /* NOTHING IS LIVE THAT CANNOT BE USED. The step that would make this side
     the same combination as the other side is off, because a picture
     compared with itself shows nothing. Off, not hidden: the names keep their
     places (S18). */
  const paint = (items, mine, other) => {
    ['e', 'd'].forEach((axis) => {
      Object.keys(items[axis]).forEach((id) => {
        const b = items[axis][id];
        const would = Object.assign({}, mine, { [axis]: id });
        const off = id !== mine[axis] && same(would, other);
        b.setAttribute('aria-pressed', String(id === mine[axis]));
        b.disabled = off;
        b.classList.toggle('off', off);
      });
    });
  };

  function sync() {
    paint(leftItems, state.left, state.right);
    paint(rightItems, state.right, state.left);
    /* the button says what it will do next (C12) */
    bView.textContent = state.view === 'neg' ? 'Print' : 'Negative';
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
     the picture holds the keys, so a presenter's -> still turns the page. ---- */
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
      flip();
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
  /* THE NAME OF EACH SIDE, OVER ITS SIDE, AND OFF THE PICTURE. The negative
     carries its own film edge - the base and the edge signing are what show
     the development - so nothing is laid over the frame. The left name stands
     above the picture's left edge and the right name above its right edge,
     on the stage. A name of two parts takes two lines, exposure over
     development, and the room for two lines is kept whatever is chosen, so a
     choice never moves the picture (S18). */
  function nameSize(h) { return Math.round(Math.max(11, Math.min(17, h / 58))); }
  function nameLines(s) { return dcName(s.e, s.d).split(' · ').map((t) => t.toUpperCase()); }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const v = state.view;
    const A = img(key(state.left), v), B = img(key(state.right), v);
    if (!A.ready || !B.ready) {
      label(ctx, v === 'neg' ? 'LOADING THE NEGATIVES' : 'LOADING THE PRINTS', w / 2, h / 2, p.muted, 10, 'center');
      return;
    }
    loadOn(v);
    /* THE PICTURE TAKES THE ROOM. Portrait pictures on a wide stage: fitted
       to the height, centred, the stage colour either side; the two names
       above it and one row of keys under it. It starts below the view bar,
       top right, if it would otherwise reach under it. */
    const iw = A.img.naturalWidth, ih = A.img.naturalHeight;
    let size = nameSize(h);
    const lh = Math.round(size * 1.3);
    const room = 12 + lh * 2 + 8;
    const foot = 34, side = 16;
    const cr = cv.getBoundingClientRect(), br = bar.getBoundingClientRect();
    const barLeft = br.left - cr.left - 10, barH = br.bottom - cr.top + 8;
    const fit = (top) => {
      const k = Math.min((w - side * 2) / iw, (h - top - foot) / ih);
      const pw = Math.round(iw * k), ph = Math.round(ih * k);
      return { x: Math.round((w - pw) / 2), y: Math.round(top + (h - top - foot - ph) / 2), w: pw, h: ph };
    };
    let r = fit(room);
    if (r.x + r.w > barLeft && r.y - room + 12 < barH) r = fit(barH + room - 12);
    rect = r;
    const x = r.x, y = r.y, pw = r.w, ph = r.h;
    const cx = Math.round(x + pw * state.pos);

    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, cx - x, ph); ctx.clip();
    ctx.drawImage(scaled(A, pw, ph), x, y, pw, ph);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(cx, y, x + pw - cx, ph); ctx.clip();
    ctx.drawImage(scaled(B, pw, ph), x, y, pw, ph);
    ctx.restore();

    /* the names: each no wider than half the picture less a gap, both the
       same size so the two read as one kind of thing */
    const Ln = nameLines(state.left), Rn = nameLines(state.right);
    const widest = (sz) => {
      ctx.font = '500 ' + sz + 'px "JetBrains Mono", ui-monospace, monospace';
      return Math.max(...Ln.concat(Rn).map((t) => ctx.measureText(t).width));
    };
    while (size > 9 && widest(size) > pw / 2 - 10) size--;
    const base0 = y - 8;
    Ln.slice().reverse().forEach((t, i) => label(ctx, t, x, base0 - i * lh, p.fg, size, 'left'));
    Rn.slice().reverse().forEach((t, i) => label(ctx, t, x + pw, base0 - i * lh, p.fg, size, 'right'));

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
    const keys = [[['←', '→'], 'move the curtain'], [['⇧'], '× 10'],
                  [['V'], v === 'neg' ? 'print' : 'negative']];
    keyRow(ctx, x + pw / 2, y + ph + 19, keys, p.fg, p.muted);
  }

  document.addEventListener('fullscreenchange', () => view.render());
  sync();
  return { render: view.render };
}

window.mountDevCompare = mountDevCompare;
