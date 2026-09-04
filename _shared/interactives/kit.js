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
  return input;
}

/* A named-state stepper. Calls onChange(index). */
function states(controls, { label, items, onChange, cls }) {
  const ctl = el('div', 'ctl ' + (cls || 'wide'));
  if (label) ctl.append(el('label', null, label));
  const group = el('div', 'states');
  items.forEach((text, i) => {
    const b = el('button', null, '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' + text);
    b.type = 'button';
    b.setAttribute('aria-current', String(i === 0));
    b.addEventListener('click', () => {
      [...group.children].forEach((x, k) => x.setAttribute('aria-current', String(k === i)));
      group.setAttribute('data-state', i);
      onChange(i);
    });
    group.append(b);
  });
  group.setAttribute('data-state', '0');
  ctl.append(group);
  controls.append(ctl);
  return group;
}

/* A readout row. cells: [{key, cls}] → returns {key: valueEl}. */
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
function fsButton(stage, fig) {
  const b = el('button', 'fs', 'Full screen');
  b.type = 'button';
  b.addEventListener('click', () => {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (fig.requestFullscreen) fig.requestFullscreen().catch(() => fig.classList.toggle('fs-on'));
    else fig.classList.toggle('fs-on');
  });
  stage.append(b);
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
function padControl(controls, { label, onChange, cls }) {
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

  const api = { out: lab.querySelector('.val') };
  api.place = (x, y) => {
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    knob.style.left = (50 + x * 42) + '%';
    knob.style.top = (50 + y * 42) + '%';
  };
  let on = false;
  const set = (e) => {
    const r = pad.getBoundingClientRect();
    let x = ((e.clientX - r.left) / r.width - 0.5) / 0.42;
    let y = ((e.clientY - r.top) / r.height - 0.5) / 0.42;
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    onChange(x, y);
  };
  pad.addEventListener('pointerdown', (e) => {
    if (document.body.classList.contains('design')) return;
    on = true; pad.setPointerCapture(e.pointerId); set(e);
  });
  pad.addEventListener('pointermove', (e) => { if (on) set(e); });
  pad.addEventListener('pointerup', () => { on = false; });
  pad.addEventListener('pointercancel', () => { on = false; });
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
