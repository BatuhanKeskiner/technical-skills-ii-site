/* ============================================================
   B · Bit Depth                        (the name is provisional)
   ------------------------------------------------------------
   One photograph with a sky, stored at 16, 8, 4, 2 or 1 bit per
   channel, and a hard curve applied to the file at that depth.

   HIS BRIEF, week 5, page s-b15, 30-09-2026: "One real photograph
   with a sky. A switch: 16 · 8 · 4 · 2 · 1 bit, and a second
   switch for a hard curve."

   THE ORDER IS THE LESSON. The page says the difference between 8
   and 16 bit does not show on a screen, because the screen itself
   shows 8 bits, and that it shows in editing. So the file is
   rounded FIRST, to the depth the switch sets, and the curve is
   applied AFTER, to those rounded values - the way an edit is
   applied to a file of that depth. Without the curve, 16 and 8 bit
   draw the same pixels. With it, 8 bit opens into bands and 16 bit
   does not.

   WHERE THE 16 BITS COME FROM. The photograph is his Mısır
   (01-introduction/assets/keskiner-06-misir.jpg), and the only copy
   of it in the folder is an 8-bit JPEG, 2000 x 1334. A 16-bit copy
   made by padding those values would carry the JPEG's own 256 steps
   into the sky and band exactly as the 8-bit one does - the
   opposite of the page. So the 16-bit file is rebuilt in the page,
   from the JPEG, the way the tones stood before the 8-bit export:
     1. averaged down to 1500 x 1000 in floating point, so every
        value is the mean of 1.8 photographed pixels;
     2. a guided filter (He, Sun & Tang, 2010; radius 6, epsilon two
        levels) averages the export's grain out of the smooth parts
        - the sky - and leaves every edge stronger than two levels as
        it was. Grain of under one level is how an 8-bit export hides
        its steps; averaging it recovers the tone between them;
     3. stored as 16-bit integers, 0 to 65,535.
   That array is the 16-bit file. 8, 4, 2 and 1 bit are that file
   rounded to 256, 16, 4 and 2 levels per channel with no dither, as
   a plain conversion does. The stage shows the result at 8 bits,
   because the screen is 8 bits. A 16-bit export from his raw file
   would replace steps 1-2; the raw is not in the folder.
   ============================================================ */

const BD_ART = '../_shared/interactives/art/bitdepth-misir.jpg';
const BD_W = 1500, BD_H = 1000;
/* the switch, in the order his brief writes it */
const BD_DEPTHS = [16, 8, 4, 2, 1];
/* THE HARD CURVE, as a curves dialog takes it: four points, and the
   stretch between the middle two is where the sky's tones are. At its
   steepest it spreads one input level over ten output levels. */
const BD_CURVE = [[0, 0], [0.44, 0.10], [0.555, 0.92], [1, 1]];
/* WHERE THE BANDS SHOW FIRST: the clear sky right of the contrail, above
   the trees - the smoothest gradient in the frame. A fraction of the
   photograph. */
const BD_LOOK = [0.92, 0.20];
/* four times, nearest-neighbour, as Compression enlarges its detail: one
   pixel of the file is a 4 px square and a band is several of them */
const BD_ZOOM = 4;
/* the sky the readout counts: right of the corn, above the trees, fixed in
   the photograph so the number does not change with the size of the screen */
const BD_SKY = [0.56, 0.02, 0.99, 0.36];

/* A curves dialog's curve: a smooth line through its points that never
   turns back on itself (a monotone cubic, Fritsch & Carlson), so a lighter
   input is never made darker than a darker one. */
function bdCurve(pts) {
  const n = pts.length;
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const h = [], d = [];
  for (let i = 0; i < n - 1; i++) {
    h.push(xs[i + 1] - xs[i]);
    d.push((ys[i + 1] - ys[i]) / h[i]);
  }
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  const end = (h0, h1, d0, d1) => {
    const s = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1);
    return Math.sign(s) !== Math.sign(d0) ? 0 : s;
  };
  if (n > 2) {
    m[0] = end(h[0], h[1], d[0], d[1]);
    m[n - 1] = end(h[n - 2], h[n - 3], d[n - 2], d[n - 3]);
  } else { m[0] = d[0]; m[1] = d[0]; }
  return (x) => {
    const v = Math.max(0, Math.min(1, x));
    let i = 0;
    while (i < n - 2 && v > xs[i + 1]) i++;
    const t = (v - xs[i]) / h[i], t2 = t * t, t3 = t2 * t;
    const y = (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i]
            + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1];
    return Math.max(0, Math.min(1, y));
  };
}

/* which source pixels fall in each target pixel, and by how much */
function bdSpans(sn, dn) {
  const k = sn / dn, spans = [];
  for (let j = 0; j < dn; j++) {
    const a = j * k, b = (j + 1) * k, idx = [], wt = [];
    for (let i = Math.floor(a); i < Math.min(sn, Math.ceil(b)); i++) {
      const w = Math.min(i + 1, b) - Math.max(i, a);
      if (w > 1e-9) { idx.push(i); wt.push(w / k); }
    }
    spans.push([idx, wt]);
  }
  return spans;
}

/* RGBA bytes -> RGB floats 0..1 at dw x dh, every value an area mean */
function bdAverage(rgba, sw, sh, dw, dh) {
  const sx = bdSpans(sw, dw), sy = bdSpans(sh, dh);
  const row = new Float32Array(dw * sh * 3);
  for (let y = 0; y < sh; y++) {
    for (let j = 0; j < dw; j++) {
      const idx = sx[j][0], wt = sx[j][1];
      let r = 0, g = 0, b = 0;
      for (let t = 0; t < idx.length; t++) {
        const o = (y * sw + idx[t]) * 4, w = wt[t];
        r += rgba[o] * w; g += rgba[o + 1] * w; b += rgba[o + 2] * w;
      }
      const q = (y * dw + j) * 3;
      row[q] = r / 255; row[q + 1] = g / 255; row[q + 2] = b / 255;
    }
  }
  const out = new Float32Array(dw * dh * 3);
  for (let i = 0; i < dh; i++) {
    const idx = sy[i][0], wt = sy[i][1];
    for (let j = 0; j < dw; j++) {
      let r = 0, g = 0, b = 0;
      for (let t = 0; t < idx.length; t++) {
        const o = (idx[t] * dw + j) * 3, w = wt[t];
        r += row[o] * w; g += row[o + 1] * w; b += row[o + 2] * w;
      }
      const q = (i * dw + j) * 3;
      out[q] = r; out[q + 1] = g; out[q + 2] = b;
    }
  }
  return out;
}

/* the mean over a (2r+1) square, edges held, written into `out` */
function bdBox(src, w, h, r, out) {
  const k = 2 * r + 1;
  const tmp = new Float64Array(w * h);
  const line = new Float64Array(Math.max(w, h) + 2 * r + 1);
  for (let y = 0; y < h; y++) {
    let acc = 0;
    line[0] = 0;
    for (let i = 0; i < w + 2 * r; i++) {
      acc += src[y * w + Math.min(w - 1, Math.max(0, i - r))];
      line[i + 1] = acc;
    }
    for (let x = 0; x < w; x++) tmp[y * w + x] = (line[x + k] - line[x]) / k;
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    line[0] = 0;
    for (let i = 0; i < h + 2 * r; i++) {
      acc += tmp[Math.min(h - 1, Math.max(0, i - r)) * w + x];
      line[i + 1] = acc;
    }
    for (let y = 0; y < h; y++) out[y * w + x] = (line[y + k] - line[y]) / k;
  }
  return out;
}

/* THE GUIDED FILTER, the picture guiding itself: where a patch varies by
   less than epsilon it is replaced by its mean, where it varies by more it
   is kept. One channel at a time. */
function bdGuided(plane, w, h, r, eps) {
  const n = w * h;
  const sq = new Float32Array(n);
  for (let i = 0; i < n; i++) sq[i] = plane[i] * plane[i];
  const m = bdBox(plane, w, h, r, new Float32Array(n));
  const m2 = bdBox(sq, w, h, r, new Float32Array(n));
  const a = sq, b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = Math.max(0, m2[i] - m[i] * m[i]);
    a[i] = v / (v + eps);
    b[i] = m[i] - a[i] * m[i];
  }
  const ma = bdBox(a, w, h, r, m), mb = bdBox(b, w, h, r, m2);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = ma[i] * plane[i] + mb[i];
  return out;
}

function mountBitDepth(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Bit Depth'),
              el('span', 'ts-sub', 'tones per channel · hard curve · banding'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = {
    di: 0,            /* index into BD_DEPTHS: opens on 16 bit */
    curve: false,
    ready: false,     /* the 16-bit file has been built */
    err: false,       /* the browser would not hand over the pixels */
    img: null,
    tones: 0,
  };
  const N = BD_W * BD_H;
  let master = null;                       /* the 16-bit file, RGB */
  const buf = document.createElement('canvas');
  buf.width = BD_W; buf.height = BD_H;
  const bctx = buf.getContext('2d');
  let frame = null;
  const luts = {};
  const curveFn = bdCurve(BD_CURVE);

  const view = canvas(stage, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label',
    'Bit depth. Minus and plus change the bits per channel; H puts the hard '
    + 'curve on and takes it off.');
  cv.addEventListener('pointerdown', () => cv.focus({ preventScroll: true }));

  /* ---- the strip ------------------------------------------------------
     His two switches and nothing else. Chips, because the lecture jumps
     between them - 16 to 8 and back - rather than walking a ladder; the
     chips carry no 01 02 03, which read as a second bit depth. */
  const depthRow = states(controls, {
    label: 'Bit depth', cls: 'one', numbered: false,
    items: BD_DEPTHS.map(String),
    onChange: (i) => { state.di = i; sync(); },
  });
  const curveRow = states(controls, {
    label: 'Curve', cls: 'one', numbered: false,
    items: ['None', 'Hard'],
    onChange: (i) => { state.curve = i === 1; sync(); },
  });

  /* THE THREE GATES (O1 O2 O3), ANSWERED - two cells.
     Tones per channel: the chip says 8, not 256, so nobody has set
     this number; the picture cannot state it; and it is the number the
     page's argument turns on - 256 steps against 65,536.
     Tones in the sky, on screen: counted from the pixels on the stage, in
     the clear sky right of the corn. Nothing draws it, and it is the reason
     the bands appear: with the curve on, 16 bit fills the stretched sky with
     some 230 tones and 8 bit has under 50 to spread across it. */
  const out = readout(fig, [
    { id: 'depth', key: 'Tones per channel' },
    { id: 'sky', key: 'Tones in the sky, on screen', cls: 'hi' },
  ]);

  /* ---- the keys, printed on the stage under the detail ----------------- */
  fig.addEventListener('keydown', (e) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(TEXTAREA|SELECT|INPUT)$/.test(t.tagName))) return;
    let took = true;
    if (e.key === '-' || e.key === '_') stepDepth(1);          /* fewer bits */
    else if (e.key === '+' || e.key === '=') stepDepth(-1);    /* more bits */
    else if (e.key === 'h' || e.key === 'H') setCurve(!state.curve);
    else took = false;
    if (took) { e.preventDefault(); e.stopPropagation(); }
  });

  function stepDepth(d) {
    const i = Math.max(0, Math.min(BD_DEPTHS.length - 1, state.di + d));
    if (i === state.di || state.err) return;
    state.di = i;
    sync();
  }
  function setCurve(on) {
    if (state.err || on === state.curve) return;
    state.curve = on;
    sync();
  }

  /* ---- the file ------------------------------------------------------- */
  loadImage(BD_ART, (box) => {
    state.img = box.img;
    try {
      const sw = box.img.naturalWidth, sh = box.img.naturalHeight;
      const c = document.createElement('canvas');
      c.width = sw; c.height = sh;
      const g = c.getContext('2d');
      g.drawImage(box.img, 0, 0);
      const avg = bdAverage(g.getImageData(0, 0, sw, sh).data, sw, sh, BD_W, BD_H);
      master = new Uint16Array(N * 3);
      const plane = new Float32Array(N);
      for (let ch = 0; ch < 3; ch++) {
        for (let i = 0; i < N; i++) plane[i] = avg[i * 3 + ch];
        const q = bdGuided(plane, BD_W, BD_H, 6, (2 / 255) * (2 / 255));
        for (let i = 0; i < N; i++) {
          master[i * 3 + ch] = Math.round(Math.max(0, Math.min(1, q[i])) * 65535);
        }
      }
      frame = bctx.createImageData(BD_W, BD_H);
      for (let i = 3; i < frame.data.length; i += 4) frame.data[i] = 255;
      state.ready = true;
    } catch (e) {
      /* a page opened straight off the disk taints the canvas, and the
         browser will not give the pixels back to be rounded */
      state.err = true;
    }
    sync();
  });

  /* 16-bit value -> the 8-bit value on screen, for one switch setting */
  function lut() {
    const bits = BD_DEPTHS[state.di], key = bits + (state.curve ? 'c' : '');
    if (luts[key]) return luts[key];
    const L = Math.pow(2, bits) - 1, t = new Uint8Array(65536);
    for (let c = 0; c < 65536; c++) {
      let v = c / 65535;
      if (bits < 16) v = Math.round(v * L) / L;   /* the file at this depth */
      if (state.curve) v = curveFn(v);            /* the edit, after */
      t[c] = Math.round(v * 255);                 /* the screen */
    }
    luts[key] = t;
    return t;
  }

  function develop() {
    const t = lut(), d = frame.data;
    for (let i = 0, j = 0, o = 0; i < N; i++, j += 3, o += 4) {
      d[o] = t[master[j]]; d[o + 1] = t[master[j + 1]]; d[o + 2] = t[master[j + 2]];
    }
    bctx.putImageData(frame, 0, 0);
    /* the tones each channel uses in the sky; the readout gives the most */
    const x0 = Math.round(BD_SKY[0] * BD_W), x1 = Math.round(BD_SKY[2] * BD_W);
    const y0 = Math.round(BD_SKY[1] * BD_H), y1 = Math.round(BD_SKY[3] * BD_H);
    const seen = [new Uint8Array(256), new Uint8Array(256), new Uint8Array(256)];
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const o = (y * BD_W + x) * 4;
        seen[0][d[o]] = 1; seen[1][d[o + 1]] = 1; seen[2][d[o + 2]] = 1;
      }
    }
    state.tones = Math.max(...seen.map((s) => s.reduce((a, v) => a + v, 0)));
  }

  function sync() {
    depthRow.select(state.di);
    curveRow.select(state.curve ? 1 : 0);
    ctlOff(depthRow, state.err);
    ctlOff(curveRow, state.err);
    out.depth.textContent = Math.pow(2, BD_DEPTHS[state.di]).toLocaleString('en-GB');
    if (state.ready) {
      develop();
      out.sky.textContent = String(state.tones);
    } else {
      out.sky.textContent = '—';
    }
    view.render();
  }

  /* ---- the drawing ----------------------------------------------------
     Compression's arrangement, so the two pages of the week keep one
     proportion (S23): the photograph and the detail side by side at one
     height, the pair centred in whatever the stage is; the detail at least
     0.8 of that height wide and at most 2.4. No names above the panels
     (S26) - the detail says what it is inside its own corner. */
  const KEYS = [[['−', '+'], 'bit depth'], [['H'], 'curve']];
  /* how wide keyRow will draw KEYS, by keyRow's own arithmetic */
  function keysWidth(ctx) {
    ctx.save();
    let t = 0;
    KEYS.forEach((g, i) => {
      ctx.font = '600 10px "IBM Plex Mono", ui-monospace, monospace';
      g[0].forEach((k) => { t += Math.max(16, ctx.measureText(k).width + 10) + 3; });
      ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
      t += 5 + ctx.measureText(g[1]).width + (i < KEYS.length - 1 ? 20 : 0);
    });
    ctx.restore();
    return t;
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const r = BD_W / BD_H;
    const m = 24, gap = 24, top = 24;
    const aw = w - 2 * m - gap;
    const kw = keysWidth(ctx);
    const fit = (foot) => {
      const ah = h - top - foot;
      const ph = Math.max(40, Math.min(ah, aw / (r + 0.8)));
      return { ph, pw: ph * r, dw: Math.min(ph * 2.4, aw - ph * r), foot };
    };
    let L = fit(30);
    if (kw > L.dw) L = fit(54);
    const { ph, pw, dw, foot } = L;
    const dh = ph;
    const x0 = Math.round((w - (pw + gap + dw)) / 2);
    const y0 = Math.round((h - (top + ph + foot)) / 2 + top);
    const dx = x0 + pw + gap;

    const pic = state.ready ? buf : state.img;
    if (!pic) {
      label(ctx, 'THE PHOTOGRAPH IS ON ITS WAY', x0, y0 + ph / 2, p.muted, 9);
      return;
    }
    const PW = pic.width || pic.naturalWidth, PH = pic.height || pic.naturalHeight;

    /* the photograph, whole */
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(pic, x0, y0, pw, ph);
    ctx.restore();
    /* its edge, in a hairline: the curve takes the grass to black and the
       photograph's foot would otherwise run into the stage */
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(x0 - 0.5, y0 - 0.5, pw + 1, ph + 1);
    ctx.restore();

    /* the detail: the file's own pixels, four times, every one a square */
    const rw = Math.ceil(dw / BD_ZOOM), rh = Math.ceil(dh / BD_ZOOM);
    const sx = Math.round(Math.max(0, Math.min(PW - rw, BD_LOOK[0] * PW - rw / 2)));
    const sy = Math.round(Math.max(0, Math.min(PH - rh, BD_LOOK[1] * PH - rh / 2)));
    ctx.save();
    ctx.beginPath(); ctx.rect(dx, y0, dw, dh); ctx.clip();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(pic, sx, sy, rw, rh, dx, y0, rw * BD_ZOOM, rh * BD_ZOOM);
    ctx.restore();

    /* ONE ORANGE THING: the area the detail shows, marked in both places */
    const kx = pw / PW, ky = ph / PH;
    ctx.save();
    ctx.strokeStyle = p.signal; ctx.lineWidth = 1.5;
    ctx.strokeRect(x0 + sx * kx, y0 + sy * ky, rw * kx, rh * ky);
    ctx.strokeRect(dx + 0.75, y0 + 0.75, dw - 1.5, dh - 1.5);
    ctx.restore();

    /* the detail's name, inside it, on the stage's own ground */
    ctx.save();
    ctx.font = '500 9px "JetBrains Mono", ui-monospace, monospace';
    const tag = 'DETAIL · ' + BD_ZOOM * 100 + ' %';
    const tw = ctx.measureText(tag).width;
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = p.stage;
    ctx.fillRect(dx + 1.5, y0 + 1.5, tw + 18, 22);
    ctx.restore();
    label(ctx, tag, dx + 10, y0 + 16, p.fg, 9);

    /* the credit belongs to the photograph: under it, on its right edge */
    label(ctx, 'PHOTO: BATUHAN KESKINER', x0 + pw, y0 + ph + 18, p.muted, 9, 'right');

    if (state.err) {
      label(ctx, 'THE BROWSER HANDS OVER THE PIXELS ONLY WHEN THE PAGE IS SERVED',
            dx, y0 + ph + 18, p.signal, 9);
    } else if (foot === 30) {
      keyRow(ctx, dx + dw / 2, y0 + ph + 15, KEYS, p.fg, p.muted);
    } else {
      keyRow(ctx, x0 + (pw + gap + dw) / 2, y0 + ph + 40, KEYS, p.fg, p.muted);
    }
  }

  sync();
  return {
    render: view.render,
    /* a bench and a test drive it the way the keys do (X4) */
    state: () => ({ bits: BD_DEPTHS[state.di], curve: state.curve,
                    ready: state.ready, tones: state.tones }),
    set: (bits, curve) => {
      const i = BD_DEPTHS.indexOf(bits);
      if (i >= 0) state.di = i;
      if (curve != null) state.curve = !!curve;
      sync();
    },
  };
}

window.mountBitDepth = mountBitDepth;
