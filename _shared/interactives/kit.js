/* ============================================================
   Shared helpers for the Week #3 interactives.
   Framework-free. Every element they build uses the class
   vocabulary in lectures/CONTRACT.md, so each design
   generation restyles them with CSS alone.
   ============================================================ */

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

function css(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/* A control-bar slider. Returns the input. */
/* S18 · A VALUE NEVER CHANGES THE SIZE OF THE THING THAT HOLDS IT.
   "3.0 m" and "10.0 m" are not the same width, so a slider whose value was
   read out beside its name made its own cell grow as it was dragged, and the
   cells beside it slid along the strip. His rule, 09-09-2026, in capitals:
   the size is settled once, for the longest thing the box will ever hold, and
   the values move inside it. Both readouts are mono, so a character is a
   character: the widest string in the whole range, in ch, pinned. */
function pinWidth(node, strings) {
  let widest = '';
  for (const t of strings) {
    const u = t == null ? '' : String(t);
    if (u.length > widest.length) widest = u;
  }
  node.style.display = 'inline-block';
  /* the floor, which needs no layout: these boxes are mono, so a character is
     a character. It is a floor and not the answer because letter-spacing is
     not in a `ch`, and four hundredths of an em times seven characters is the
     three pixels that were still moving the cell. */
  node.style.minWidth = widest.length + 'ch';
  const measure = () => {
    if (!node.isConnected) return;
    const was = node.textContent;
    const floor = node.style.minWidth;
    node.style.minWidth = '0';
    node.textContent = widest;
    const w = Math.ceil(node.getBoundingClientRect().width);
    node.textContent = was;
    node.style.minWidth = w > 0 ? w + 'px' : floor;
  };
  measure();
  /* and again when the mono face has actually arrived, because a fallback
     face measures differently */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  return widest.length;
}

/* S18 · A CELL THAT HAS TWO FACES IS AS WIDE AS ITS WIDER FACE.
   `answering` (IG-02 P4) draws the value at 22px instead of 12, so the cell
   that held "2.4 m" small held it large a moment later and everything to its
   right slid along. The cell is measured in both states, once, and pinned to
   the wider. */
function pinCell(ctl, classes) {
  const measure = () => {
    if (!ctl.isConnected) return;
    ctl.style.minWidth = '0';
    const had = classes.map((c) => ctl.classList.contains(c));
    let w = Math.ceil(ctl.getBoundingClientRect().width);
    classes.forEach((c) => ctl.classList.add(c));
    w = Math.max(w, Math.ceil(ctl.getBoundingClientRect().width));
    classes.forEach((c, i) => { if (!had[i]) ctl.classList.remove(c); });
    ctl.style.minWidth = w + 'px';
    ctl.style.flexGrow = '0';
  };
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
}

/* S18 · A CONTROL THAT DOES NOT APPLY STAYS WHERE IT IS.
   It used to be hidden - "hide the row, do not grey it" - and hiding a cell
   moves every cell after it, which is the one thing that may not happen. So
   it keeps its place and goes off: the hand comes off it, the name greys, and
   the strip does not move under the hand that is reaching for the next cell. */
function ctlOff(node, off) {
  const ctl = node && node.closest ? node.closest('.ctl') : node;
  if (!ctl) return;
  ctl.classList.toggle('off', !!off);
  ctl.setAttribute('aria-disabled', String(!!off));
  ctl.querySelectorAll('input, button, select, textarea')
     .forEach((e) => { e.disabled = !!off; });
}

/* every value a slider can show, without walking ten thousand of them */
function everyValue(min, max, step, fmt) {
  const lo = +min, hi = +max, st = Math.abs(+step) || 1;
  const n = Math.floor((hi - lo) / st);
  const many = n > 600;
  const out = [];
  const take = many ? Math.ceil(n / 600) : 1;
  for (let k = 0; k <= n; k += take) out.push(fmt(lo + k * st));
  out.push(fmt(hi), fmt(lo));
  return out;
}

function slider(controls, { label, min, max, step, value, unit, cls, decimals, format }) {
  const ctl = el('div', 'ctl' + (cls ? ' ' + cls : ''));
  const lab = el('label', null, label + ' <span class="val"></span>');
  const input = el('input');
  input.type = 'range';
  Object.assign(input, { min, max, step, value });
  const out = lab.querySelector('.val');
  input._sync = () => {
    out.textContent = format ? format(+input.value)
      : (decimals != null ? (+input.value).toFixed(decimals) : input.value) + (unit || '');
  };
  input.addEventListener('input', input._sync);
  input._sync();
  ctl.append(lab, input);
  controls.append(ctl);
  /* S18: the box is as wide as the widest reading, before the first drag */
  const show = (v) => (format ? format(+v)
    : (decimals != null ? (+v).toFixed(decimals) : String(v)) + (unit || ''));
  pinWidth(out, everyValue(min, max, step, show));
  return input;
}

/* A named-state stepper. Calls onChange(index).

   NOTHING IS LIVE THAT CANNOT BE USED. A state the instrument cannot go to
   from where it is must not look pressable, and until now this could not
   say so - every item was a live button whatever the instrument's state. So:
     group.setDisabled(i, bool)   switches one item off (or on again): it is
                                  disabled, aria-disabled, and wears .off
     group.select(i)              moves the mark without firing onChange;
                                  -1 marks nothing
     disabled: [bool, ...]        the same, per item, at build time
   A disabled item does not fire onChange and does not take the mark. Nor
   does the item already marked: pressing the state you are in changes
   nothing, so it is not a press. */
function states(controls, { label, items, onChange, cls, disabled }) {
  const ctl = el('div', 'ctl ' + (cls || 'wide'));
  if (label) ctl.append(el('label', null, label));
  const group = el('div', 'states');
  const mark = (i) => {
    [...group.children].forEach((x, k) => x.setAttribute('aria-current', String(k === i)));
    group.setAttribute('data-state', String(i));
  };
  items.forEach((text, i) => {
    const b = el('button', null, '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' + text);
    b.type = 'button';
    b.setAttribute('aria-current', String(i === 0));
    b.addEventListener('click', () => {
      if (b.disabled || group.getAttribute('data-state') === String(i)) return;
      mark(i);
      onChange(i);
    });
    group.append(b);
  });
  group.setAttribute('data-state', '0');
  group.setDisabled = (i, off) => {
    const b = group.children[i];
    if (!b) return;
    b.disabled = !!off;
    b.setAttribute('aria-disabled', String(!!off));
    b.classList.toggle('off', !!off);
  };
  group.select = mark;
  if (disabled) disabled.forEach((off, i) => { if (off) group.setDisabled(i, true); });
  ctl.append(group);
  controls.append(ctl);
  return group;
}

/* A readout row. cells: [{key, cls}] → returns {key: valueEl}. */
/* A CELL THAT SHOWS RATHER THAN TAKES. A strip cell with a label and a value
   and no hand on it - what IG-01 11 draws for transform's Pan / tilt and
   Position. It is here rather than in an instrument because the moment two
   instruments need one, they build two that look almost alike (T1).
     valueCell(controls, { label, cls })  ->  the element to write into */
/* THE TRIAD'S STEPPER, ONCE (IG-02 03 · FINDING 1). Test Strip, Photogram and
   the light meter each built minus-value-plus by hand and the meter's came out
   a different size - which is what happens every time a control is not in the
   kit. It walks a ladder rather than a number line, because that is what an
   aperture, a shutter and a film speed do: whole stops, halves or thirds, set
   for the page and shared by every stepper on it.

     stepper(controls, {
       label, ladder,          // array of values, coarse to fine
       value,                  // the one to open on
       format,                 // v -> what the room reads: f/8, 1/125, 400
       answering,              // true: the instrument is answering with it
       onChange, cls,
     })
   Returns { set, get, node, answering } - `answering` takes a boolean and
   swaps the hand for a value in signal (IG-02 P4). Keys: the caller wires
   them, and prints them, because the key belongs to the instrument's map. */
function stepper(controls, opts) {
  const o = opts || {};
  const lad = o.ladder || [];
  let i = Math.max(0, lad.indexOf(o.value));
  if (i < 0) i = 0;
  const fmt = o.format || ((v) => String(v));

  const ctl = el('div', 'ctl stp' + (o.cls ? ' ' + o.cls : ''));
  ctl.append(el('label', null, o.label));
  const row = el('div', 'stp-row');
  const dn = el('button', 'st', '−');
  const val = el('span', 'stp-v');
  const up = el('button', 'st', '+');
  [dn, up].forEach((b) => { b.type = 'button'; });
  row.append(dn, val, up);
  ctl.append(row);
  controls.append(ctl);
  /* S18: f/1.4 and f/22 are not the same width and the ladder is short */
  val.style.textAlign = 'center';
  pinWidth(val, lad.map(fmt));

  function paint() {
    val.textContent = fmt(lad[i]);
    dn.disabled = i <= 0;
    up.disabled = i >= lad.length - 1;
  }
  function step(d) {
    const j = Math.max(0, Math.min(lad.length - 1, i + d));
    if (j === i) return;
    i = j; paint();
    if (o.onChange) o.onChange(lad[i], i);
  }
  dn.addEventListener('click', () => step(-1));
  up.addEventListener('click', () => step(1));

  const api = {
    node: ctl,
    get: () => lad[i],
    set: (v) => { const j = lad.indexOf(v); if (j >= 0) { i = j; paint(); } },
    /* IG-02 P4: the one the instrument is answering with keeps its value,
       large and in signal, and loses its hand. Never greyed - greyed reads as
       a fault in the instrument rather than as the answer it is giving. */
    answering: (on) => {
      ctl.classList.toggle('answering', !!on);
      dn.hidden = !!on; up.hidden = !!on;
    },
    step,
  };
  if (o.answering) api.answering(true);
  paint();
  return api;
}

/* The three ladders every camera setting walks, at whole stops, halves and
   thirds. A page pins the interval; the student never sees the choice. */
const LADDER = {
  aperture: {
    1: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22],
    2: [1.4, 1.7, 2, 2.4, 2.8, 3.4, 4, 4.8, 5.6, 6.7, 8, 9.5, 11, 13, 16, 19, 22],
    3: [1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8,
        9, 10, 11, 13, 14, 16, 18, 20, 22],
  },
  shutter: {
    1: [30, 15, 8, 4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 1 / 15, 1 / 30, 1 / 60, 1 / 125,
        1 / 250, 1 / 500, 1 / 1000, 1 / 2000, 1 / 4000].reverse(),
    3: [30, 20, 15, 10, 8, 6, 4, 3, 2, 1.5, 1, 1 / 1.5, 1 / 2, 1 / 3, 1 / 4, 1 / 6,
        1 / 8, 1 / 10, 1 / 13, 1 / 15, 1 / 20, 1 / 25, 1 / 30, 1 / 40, 1 / 50,
        1 / 60, 1 / 80, 1 / 100, 1 / 125, 1 / 160, 1 / 200, 1 / 250, 1 / 320,
        1 / 400, 1 / 500, 1 / 640, 1 / 800, 1 / 1000, 1 / 1250, 1 / 1600,
        1 / 2000, 1 / 2500, 1 / 3200, 1 / 4000].reverse(),
  },
  iso: {
    1: [100, 200, 400, 800, 1600, 3200, 6400],
    3: [100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600,
        2000, 2500, 3200, 4000, 5000, 6400],
  },
};

/* How a camera writes them (IG-02 03) - f/8 never F8, 1/125 below a second
   and 2 s above it, ISO the number alone. */
function fStop(v) {
  return 'f/' + (v < 10 ? String(Math.round(v * 10) / 10).replace(/\.0$/, '') : String(Math.round(v)));
}
function shutterText(t) {
  if (t >= 1) return (Math.round(t * 10) / 10).toString().replace(/\.0$/, '') + ' s';
  return '1/' + Math.round(1 / t);
}

function valueCell(controls, opts) {
  const o = opts || {};
  const ctl = el('div', 'ctl vcell' + (o.cls ? ' ' + o.cls : ''));
  ctl.append(el('label', null, o.label + ' <span class="val"></span>'));
  controls.append(ctl);
  const v = ctl.querySelector('.val');
  v.ctl = ctl;
  return v;
}

function readout(fig, cells, extraCls) {
  const box = el('div', 'readout' + (extraCls ? ' ' + extraCls : ''));
  const map = {};
  cells.forEach((c) => {
    const cell = el('div', c.wide ? 'span2' : null);
    cell.append(el('div', 'k', c.key));
    const v = el('div', 'v' + (c.cls ? ' ' + c.cls : ''));
    cell.append(v);
    if (c.bar) {
      const bar = el('div', 'bar');
      const fillSpan = el('span');
      bar.append(fillSpan);
      cell.append(bar);
      v._bar = fillSpan;
    }
    box.append(cell);
    map[c.id || c.key] = v;
  });
  const cap = fig.querySelector('figcaption');
  if (cap) fig.insertBefore(box, cap); else fig.append(box);
  return map;
}

/* A NOTE ROW: free text, written by the student, under the strip where a
   readout would stand. The kit had no text entry until 08-09-2026, when
   Batu asked for a box a note can be typed into; this is that box, once, for
   every instrument that wants one. Returns the textarea.
     noteRow(fig, { label, value, placeholder, onChange, rows }) */
function noteRow(fig, opts) {
  const o = opts || {};
  /* 'memo', not 'note': the site has a .note block of its own */
  const box = el('div', 'readout memo' + (o.cls ? ' ' + o.cls : ''));
  const cell = el('div', 'span2');
  cell.append(el('div', 'k', o.label || 'Note'));
  const ta = el('textarea', 'v');
  ta.rows = o.rows || 2;
  ta.spellcheck = false;
  if (o.placeholder) ta.placeholder = o.placeholder;
  ta.value = o.value || '';
  /* GROWS AS IT IS WRITTEN IN, when asked to: the box is as tall as its
     words, never a scrollbar over a note. `ta.fit()` for a value set from
     code. Batu, 08-09. */
  ta.fit = () => {
    if (!o.grow) return;
    ta.style.height = 'auto';
    ta.style.height = Math.max(ta.scrollHeight, 0) + 'px';
  };
  ta.addEventListener('input', () => { ta.fit(); if (o.onChange) o.onChange(ta.value); });
  if (o.grow) { ta.style.overflow = 'hidden'; requestAnimationFrame(ta.fit); }
  cell.append(ta);
  box.append(cell);
  /* a host puts the box somewhere else - on the stage, say - instead of the
     readout's place under the strip */
  if (o.host) { o.host.append(box); return ta; }
  const cap = fig.querySelector('figcaption');
  if (cap) fig.insertBefore(box, cap); else fig.append(box);
  return ta;
}

/* A legend, placed in a stage corner. rows: [{c, label, val, kind}] */
function legend(stage, rows, corner = 'tr') {
  const ov = el('div', 'overlay ' + corner);
  const lg = el('div', 'legend');
  rows.forEach((r) => {
    const row = el('span', 'row');
    const sw = el('span', 'sw' + (r.kind ? ' ' + r.kind : ''));
    sw.style.setProperty('--c', r.c);
    row.append(sw, document.createTextNode(r.label));
    if (r.val) row.append(el('span', 'val', r.val));
    lg.append(row);
  });
  ov.append(lg);
  stage.append(ov);
  return lg;
}

/* Theatre-mode button. */
/* A CONTROL SAYS WHAT IT WILL DO NEXT, not what it did last. This one said
   'Full screen' while already full screen, which is a button describing the
   state it is in rather than the act it offers. */
/* KEYS LOOK LIKE KEYS. A row that reads "S slide" is a sentence with a stray
   letter in it; the same row with the S in a little square is a keyboard
   instruction, and nobody has to be told which. Draws one cap and returns how
   much room it took, so a row can be laid out by adding them up. */
function keyCap(ctx, x, y, glyph, ink, dim) {
  ctx.save();
  ctx.font = '600 10px "IBM Plex Mono", ui-monospace, monospace';
  const tw = ctx.measureText(glyph).width;
  const w = Math.max(16, tw + 10), h = 15;
  ctx.strokeStyle = dim; ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x) + 0.5, Math.round(y - h / 2) + 0.5, w, h);
  ctx.fillStyle = ink;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(glyph, x + w / 2, y + 0.5);
  ctx.restore();
  return w;
}

/* A WHOLE ROW OF THEM, centred on x. Pass pairs: [['S','slide'], ...] where a
   pair may carry more than one key for the same act. */
function keyRow(ctx, x, y, groups, ink, dim) {
  ctx.save();
  ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
  let total = 0;
  groups.forEach((g, i) => {
    g[0].forEach((k) => {
      ctx.font = '600 10px "IBM Plex Mono", ui-monospace, monospace';
      total += Math.max(16, ctx.measureText(k).width + 10) + 3;
    });
    ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    total += 5 + ctx.measureText(g[1]).width + (i < groups.length - 1 ? 20 : 0);
  });
  /* AND IT STAYS ON THE CANVAS. The row is centred under the thing it drives,
     and the thing it drives can be hard against an edge - the test strip's
     timer stands in the bottom-left corner, so the first cap and its word ran
     off the left of the picture and the row began mid-letter. A row of keys
     that is cut off is worse than no row: it reads as damage. */
  const scale = (ctx.getTransform && ctx.getTransform().a) || 1;
  const W = ctx.canvas.width / (scale || 1);
  let cx = x - total / 2;
  if (cx < 8) cx = 8;
  if (cx + total > W - 8) cx = Math.max(8, W - 8 - total);
  groups.forEach((g, i) => {
    g[0].forEach((k) => { cx += keyCap(ctx, cx, y, k, ink, dim) + 3; });
    cx += 2;
    ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    ctx.fillStyle = dim; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(g[1], cx, y + 0.5);
    cx += ctx.measureText(g[1]).width + (i < groups.length - 1 ? 20 : 0);
  });
  ctx.restore();
}

function fsButton(stage, fig) {
  const b = el('button', 'fs', 'Full screen');
  b.type = 'button';
  const say = () => {
    const on = document.fullscreenElement === fig || fig.classList.contains('fs-on');
    b.textContent = on ? 'Leave full screen' : 'Full screen';
    b.setAttribute('aria-pressed', String(on));
  };
  b.addEventListener('click', () => {
    if (document.fullscreenElement) { document.exitFullscreen().then(say, say); return; }
    if (fig.requestFullscreen) {
      fig.requestFullscreen().then(say, () => { fig.classList.toggle('fs-on'); say(); });
    } else { fig.classList.toggle('fs-on'); say(); }
  });
  /* the browser can leave full screen without being asked - Escape, or another
     window taking it - so the word is set from the truth, not from the press */
  document.addEventListener('fullscreenchange', say);
  say();
  stage.append(b);
  return b;
}

/* DARK AND LIGHT ARE A SWITCH. An instrument that can draw on both grounds
   carries this beside Full screen, in the same corner and the same shape, and
   like Full screen it says what it will do next: "Dark mode" while the ground
   is light, "Light mode" while it is dark. The choice is the viewer's and is kept in
   this browser under the key the instrument gives. Batu's rule, 08-09-2026:
   a ground toggle is a switch on the instrument, never only a key.
     groundButton(stage, fig, { key, onChange })
   The instrument keeps drawing from palette(fig); this only flips the class
   and calls back so the drawing re-reads its tones. */
function groundButton(stage, fig, opts) {
  const o = opts || {};
  const b = el('button', 'fs gnd');
  b.type = 'button';
  const say = () => {
    const lightOn = fig.classList.contains('light');
    b.textContent = lightOn ? 'Dark mode' : 'Light mode';   /* the words are Batu's, 08-09 */
    b.setAttribute('aria-pressed', String(!lightOn));
    /* it stands to the left of Full screen, whose width changes with its word */
    const fs = stage.querySelector('.fs:not(.gnd)');
    b.style.right = fs ? (fs.offsetWidth + 6) + 'px' : '0';
  };
  b.addEventListener('click', () => {
    const lightOn = !fig.classList.contains('light');
    fig.classList.toggle('light', lightOn);
    if (o.key) { try { localStorage.setItem(o.key, lightOn ? 'light' : 'dark'); } catch (e) { /* private */ } }
    if (o.onChange) o.onChange(lightOn);
    say();
  });
  document.addEventListener('fullscreenchange', say);
  stage.append(b);
  say();                       /* the word at once; a frame may not come in a hidden tab */
  requestAnimationFrame(say);  /* and again once Full screen has its width */
  b.refresh = say;
  return b;
}

/* A canvas that keeps a device-pixel-correct backing store. */
function canvas(stage, draw) {
  const c = el('canvas');
  stage.append(c);
  const ctx = c.getContext('2d');
  let w = 0, h = 0;
  function resize() {
    const r = c.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width; h = r.height;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, w, h);
  }
  const api = {
    canvas: c,
    ctx,
    render: () => { if (w) draw(ctx, w, h); else resize(); },
    resize,
  };
  /* Redrawing sets the canvas's own width and height, which the observer
     sees as another resize — the browser then reports a resize loop it could
     not finish in one frame. Only act when the box has really changed size. */
  new ResizeObserver(() => {
    const r = c.getBoundingClientRect();
    if (!r.width) return;
    if (Math.abs(r.width - w) < 0.5 && Math.abs(r.height - h) < 0.5) return;
    resize();
  }).observe(c);
  requestAnimationFrame(resize);
  return api;
}

/* Palette read from the figure itself. A generation sets --k-* on
   figure.demo (see lecture.css → figure.demo.light) and every drawing
   retints with no change to the interactives. */
function scoped(scope, name, fallback) {
  if (!scope) return fallback;
  const v = getComputedStyle(scope).getPropertyValue(name).trim();
  return v || fallback;
}

function palette(scope) {
  return {
    ink: css('--ink-900', '#0B0C0C'),
    paper: css('--paper-100', '#F7F6F2'),
    signal: scoped(scope, '--k-signal', css('--signal-500', '#FF3B00')),
    marker: scoped(scope, '--k-marker', css('--marker-500', '#E4FF1A')),
    digital: scoped(scope, '--k-digital', css('--data-digital', '#3FC7D6')),
    film: scoped(scope, '--k-film', css('--data-film', '#E4FF1A')),
    cinema: scoped(scope, '--k-cinema', css('--data-cinema', '#FF8C66')),
    stage: scoped(scope, '--k-stage', '#080A09'),
    inset: scoped(scope, '--k-inset', '#0E1110'),
    fg: scoped(scope, '--k-fg', '#F2F2EE'),
    muted: scoped(scope, '--k-muted', '#8C908D'),
    rule: scoped(scope, '--k-rule', '#2C2F2E'),
    rule2: scoped(scope, '--k-rule2', '#3A3D3C'),
    wash: scoped(scope, '--k-wash', 'rgba(242,242,238,0.06)'),
    band: scoped(scope, '--k-band', 'rgba(228,255,26,0.14)'),
  };
}

/* Dashed / solid hairline helpers. */
function line(ctx, x1, y1, x2, y2, color, dash) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
  ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
  ctx.stroke();
  ctx.restore();
}

function label(ctx, text, x, y, color, size = 10, align = 'left') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = '500 ' + size + 'px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x, y);
  ctx.restore();
}

/* Kelvin → RGB, Tanner Helland's approximation. */
function kelvinRGB(k) {
  const t = Math.max(1000, Math.min(12000, k)) / 100;
  let r, g, b;
  if (t <= 66) r = 255;
  else r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
  if (t <= 66) g = 99.4708025861 * Math.log(t) - 161.1195681661;
  else g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  if (t >= 66) b = 255;
  else if (t <= 19) b = 0;
  else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const cl = (v) => Math.max(0, Math.min(255, v));
  return [cl(r), cl(g), cl(b)];
}

/* ============================================================
   Week #2 additions — a picture-based instrument needs three
   things the earlier drawing instruments did not: a loader, a
   way to lift a product shot off its white ground, and a
   rectilinear camera looking into a panorama.
   ============================================================ */

/* Load an image; the returned object reports when it is ready. */
function loadImage(src, onReady) {
  const im = new Image();
  const box = { img: im, ready: false };
  im.onload = () => { box.ready = true; if (onReady) onReady(box); };
  im.src = src;
  return box;
}

/* A product photograph on white → the same photograph on nothing.
   Anything near white fades out, so the object can sit on the stage. */
function keyWhite(img, cut = 228, soft = 22) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const im = g.getImageData(0, 0, c.width, c.height), d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    const mn = Math.min(d[i], d[i + 1], d[i + 2]);
    if (mn > cut) d[i + 3] = Math.max(0, Math.min(255, Math.round((cut + soft - mn) / soft * 255)));
  }
  g.putImageData(im, 0, 0);
  return c;
}

/* A CAMERA BACK, AND THE HOLE ITS SCREEN LEAVES.
   ------------------------------------------------------------------
   The first camera back was a JPEG on white with a white screen, and
   `keyWhite` cut both out at once - the background so the body sits on
   the page, the screen so the scene shows through. It worked because
   that photograph happened to have no other white in it. Measured on
   a1-camera-back.jpg: white spans the whole frame and about 59,000
   pixels of it are outside the screen. On any camera with a white
   shutter ring, a white label or a bright highlight, `keyWhite` puts
   a hole in the body.

   So a camera back is now a PNG that carries its own transparency,
   and nothing is keyed. This finds the screen in it: the transparent
   pixels reachable from the edge are the background, and whatever
   transparency is left is the hole the scene goes into.

   A JPEG still works - it falls back to keying - so the A1 keeps
   running until its own PNG arrives.

     cameraBack('assets/x.png', (cam) => { cam.img; cam.screen; })
     cam.screen = {x, y, w, h} in the image's own pixels
   ------------------------------------------------------------------ */
function cameraBack(src, onReady) {
  loadImage(src, (box) => {
    const img = box.img, w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    let d = g.getImageData(0, 0, w, h).data;

    let clear = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 8) { clear++; if (clear > 64) break; }

    let surface = img;
    if (clear <= 64) {                    /* opaque: the old way, keyed on white */
      surface = keyWhite(img);
      d = surface.getContext('2d').getImageData(0, 0, w, h).data;
    }

    /* Flood the transparency that touches the edge. What it cannot reach is
       the screen. A stack, not recursion - a 4000px back would blow it. */
    const seen = new Uint8Array(w * h), st = [];
    const push = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      const k = y * w + x;
      if (seen[k] || d[k * 4 + 3] >= 8) return;
      seen[k] = 1; st.push(k);
    };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (st.length) {
      const k = st.pop(), x = k % w, y = (k - x) / w;
      push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
    }

    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const k = y * w + x;
        if (seen[k] || d[k * 4 + 3] >= 8) continue;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    const found = x1 > x0 && y1 > y0;
    onReady({
      img: surface,
      w: w, h: h,
      /* no hole found is not a failure - some backs are drawn with the screen
         painted on. The caller decides what to do with a null. */
      screen: found ? { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } : null,
      keyed: clear <= 64,
    });
  });
}

/* A panorama the camera can look into.
   The picture is treated as a full 360° turn horizontally; its own
   proportions give the vertical span, so a strip and a full sphere
   both work. `view` projects a rectilinear frame out of it — the same
   thing a lens does — into a buffer of the size asked for.
     yaw, pitch  radians · hfov  radians · dark  0–1 brightness */
function panorama(src, horizon, onReady) {
  const P = { ready: false, w: 0, h: 0, vspan: 0, horizon: horizon == null ? 0.6 : horizon };
  let data = null, buf = null, bw = 0, bh = 0, src2 = null, flat = null, fw = 0, fh = 0, fk = -1;
  loadImage(src, (box) => {
    /* sampling copy, capped — a 4k panorama is far more than a screen needs */
    const nat = box.img.naturalWidth, cap = Math.min(nat, 2400);
    const w = cap, h = Math.round(box.img.naturalHeight * cap / nat);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.drawImage(box.img, 0, 0, w, h);
    data = g.getImageData(0, 0, w, h).data;
    P.w = w; P.h = h; P.vspan = 360 * h / w * Math.PI / 180;
    src2 = box.img;
    P.ready = true;
    if (onReady) onReady(P);
  });
  /* The whole turn laid out flat — the picture as it was taken. A
     rectilinear view cannot hold 360°, so the overview is the panorama
     itself rather than a projection of it. */
  P.flat = (w, h, dark) => {
    if (!P.ready) return null;
    const k = dark == null ? 1 : dark;
    if (flat && fw === w && fh === h && fk === k) return flat;
    flat = document.createElement('canvas');
    flat.width = w; flat.height = h;
    fw = w; fh = h; fk = k;
    const g = flat.getContext('2d');
    g.drawImage(src2, 0, 0, w, h);
    if (k < 1) { g.fillStyle = 'rgba(0,0,0,' + (1 - k).toFixed(2) + ')'; g.fillRect(0, 0, w, h); }
    return flat;
  };

  P.view = (w, h, yaw, pitch, hfov, dark) => {
    if (!P.ready) return null;
    if (!buf || bw !== w || bh !== h) { buf = document.createElement('canvas'); buf.width = w; buf.height = h; bw = w; bh = h; }
    const g = buf.getContext('2d'), im = g.createImageData(w, h), out = im.data;
    const tx = Math.tan(hfov / 2), ty = tx * h / w;
    const cp = Math.cos(pitch), sp = Math.sin(pitch), k = dark == null ? 1 : dark;
    for (let j = 0; j < h; j++) {
      const y = (1 - 2 * (j + 0.5) / h) * ty;
      for (let i = 0; i < w; i++) {
        const x = (2 * (i + 0.5) / w - 1) * tx;
        /* tilt rotates the ray about x, pan about y */
        const ry = y * cp + sp, rz = -y * sp + cp;
        const lon = Math.atan2(x, rz) + yaw;
        const lat = Math.atan2(ry, Math.sqrt(x * x + rz * rz));
        let u = (lon / (2 * Math.PI) + 0.5) % 1; if (u < 0) u += 1;
        const v = P.horizon - lat / P.vspan, o = (i + j * w) * 4;
        if (v < 0 || v > 1) { out[o] = 16; out[o + 1] = 18; out[o + 2] = 20; out[o + 3] = 255; continue; }
        const s = (Math.min(P.w - 1, (u * P.w) | 0) + Math.min(P.h - 1, (v * P.h) | 0) * P.w) * 4;
        out[o] = data[s] * k; out[o + 1] = data[s + 1] * k; out[o + 2] = data[s + 2] * k; out[o + 3] = 255;
      }
    }
    g.putImageData(im, 0, 0);
    return buf;
  };
  return P;
}

/* A round pan/tilt pad. Reports the position as −1…1 on both axes. */
/* A ROUND PAD IS GRABBED, NOT POINTED AT.
   It used to map the pointer's place straight onto the value, so touching the
   pad anywhere threw the camera to that angle before you had moved a
   millimetre - and then every small movement crossed a big arc, because the
   whole range is packed into a circle a hundred pixels wide. Two changes:
   pressing takes hold of the knob where it already is and moves it BY the
   drag, and the drag is geared down, so the pad is something you nudge.
   `gain` is how much of the pointer's movement the knob takes; the default is
   a little over half, which on a 100px pad is about 3° of pan per pixel
   instead of 7. */
function padControl(controls, { label, onChange, cls, gain }) {
  const ctl = el('div', 'ctl' + (cls ? ' ' + cls : ''));
  const lab = el('label', null, label + ' <span class="val"></span>');
  const pad = el('div', 'pad');
  pad.append(el('div', 'cross'),
    el('span', 'arr u', '▲'), el('span', 'arr d', '▼'),
    el('span', 'arr l', '◀'), el('span', 'arr r', '▶'));
  const knob = el('div', 'knob');
  pad.append(knob);
  ctl.append(lab, pad);
  controls.append(ctl);

  /* the control block itself, so an instrument can put a pad away when the
     thing it drives is not in the room - a Position pad on a photograph */
  const api = { out: lab.querySelector('.val'), ctl: ctl, pad: pad };
  api.place = (x, y) => {
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    knob.style.left = (50 + x * 42) + '%';
    knob.style.top = (50 + y * 42) + '%';
  };
  let on = false, from = null;
  const K = gain == null ? 0.30 : gain;
  /* where the knob is now, read back off the element the instrument placed */
  const knobAt = () => [
    (parseFloat(knob.style.left) - 50) / 42 || 0,
    (parseFloat(knob.style.top) - 50) / 42 || 0,
  ];
  const move = (e) => {
    if (!from) return;
    const r = pad.getBoundingClientRect();
    let x = from.x + ((e.clientX - from.px) / (r.width * 0.42)) * K;
    let y = from.y + ((e.clientY - from.py) / (r.height * 0.42)) * K;
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    onChange(x, y);
  };
  pad.addEventListener('pointerdown', (e) => {
    if (document.body.classList.contains('design')) return;
    on = true;
    const k = knobAt();
    from = { x: k[0], y: k[1], px: e.clientX, py: e.clientY };
    pad.setPointerCapture(e.pointerId);
    /* NOTHING HAPPENS ON THE PRESS ITSELF. Grabbing is not an instruction. */
  });
  pad.addEventListener('pointermove', (e) => { if (on) move(e); });
  pad.addEventListener('pointerup', () => { on = false; from = null; });
  pad.addEventListener('pointercancel', () => { on = false; from = null; });
  return api;
}

/* Drag a canvas left/right and up/down. Reports the delta in pixels. */
function dragArea(node, onDrag) {
  let from = null;
  const at = (e) => {
    const r = node.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };
  node.addEventListener('pointerdown', (e) => {
    if (document.body.classList.contains('design')) return;
    from = at(e); from.start = true; node.setPointerCapture(e.pointerId);
    onDrag(0, 0, true);
  });
  node.addEventListener('pointermove', (e) => {
    if (!from) return;
    const p = at(e);
    onDrag(p.x - from.x, p.y - from.y, false);
  });
  const off = () => { from = null; };
  node.addEventListener('pointerup', off);
  node.addEventListener('pointercancel', off);
  node.style.cursor = 'grab';
}

/* Letterbox: the rect inside w×h that holds the stage's own ratio.
   Full screen therefore shows the same composition, only larger. */
function frameIn(w, h, ar) {
  let fw = w, fh = w / ar;
  if (fh > h) { fh = h; fw = h * ar; }
  return { x: (w - fw) / 2, y: (h - fh) / 2, w: fw, h: fh };
}
