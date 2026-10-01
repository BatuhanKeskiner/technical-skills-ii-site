/* ============================================================
   B · Compression and Resize         (the page's title, 30-09-2026)
   ------------------------------------------------------------
   One photograph resized to the pixel size the second slider
   sets, saved as a JPEG at the quality the first slider sets,
   and the size of that file. Save again opens the saved file and
   saves it once more, up to ten saves, so the loss can be read
   save by save.

   HIS BRIEF, week 5, page s-b13c, 30-09-2026: "One photograph
   saved as JPEG at the quality a slider sets, with the real file
   size. Save Again re-compresses it ten times to show the loss
   accumulating." And later the same day: "Quality haricinde
   resize parametresi de ekle lütfen."

   RESIZE ONLY MAKES IT SMALLER. The ladder is the full 1500 x 1000
   and three halvings of it, because an export dialog is used to
   make a file smaller and a picture enlarged past its pixels only
   invents them. Each halving is drawn from the one above it, so
   every size is a clean average of its 2 x 2 blocks whatever the
   browser's own filter is. The picture is then shown at ONE
   display size whatever the file's size: a smaller file is
   enlarged to the same place on the screen and reads softer,
   which is the lesson - pixel dimensions and quality together
   decide both the file size and the look. The detail keeps
   showing the same spot of the photograph, so a smaller file's
   pixels are drawn larger there (800, 1600, 3200 %).

   THE FILE IS REAL. The browser's own JPEG encoder writes it
   (canvas.toDataURL, see encode() for why not toBlob), the readout
   is the byte length of that file, and the picture on the stage is
   that file decoded again - the loss on screen is the loss in the
   file. A different encoder
   (Lightroom, Photoshop, a phone) writes different sizes for the
   same number; the lecture's point survives the difference.

   WHY SAVE AGAIN CROPS ONE PIXEL. Measured in Chromium, 30-09-2026,
   on this photograph at 1500 x 1000: re-saving the decoded file at
   the SAME quality with nothing changed is almost exactly
   reversible - at quality 60 ten saves moved the pixels by 0.02 of
   a level on average, and the file by 35 bytes. The quantisation
   lands where it landed the first time. Loss accumulates when the
   picture is EDITED between saves, which is what the page's own
   line says ("opened, edited and saved again"). The smallest edit
   that does it is a crop: one pixel off the top and the left moves
   every 8 x 8 block onto new pixels, and each save then quantises a
   picture it has not seen before. With it, quality 60 falls from
   35.7 dB to 31.0 dB over ten saves - worse than one save at 20.
   The key row says so ("crop 1 px, save again"), so nobody is told
   a plain re-save costs what an edited one does.

   The photograph is his: 20220423-BK0051, from his Lightroom
   export in _sources/assets, converted from Adobe RGB to sRGB and
   stored as a lossless PNG at 1500 x 1000, so the first save is
   the first loss.
   ============================================================ */

/* the ladder the lecture can talk about, lowest first as a slider runs */
const CP_Q = [10, 20, 40, 60, 80, 90, 100];
/* the resize ladder, smallest first as a slider runs: each step is half the
   one above it (sized() depends on that), the last is the photograph itself */
const CP_SIZE = [0.125, 0.25, 0.5, 1];
const CP_W = 1500, CP_H = 1000;
const cpDims = (s) => [Math.round(CP_W * s), Math.round(CP_H * s)];
const CP_SAVES = 10;
const CP_ART = '../_shared/interactives/art/compression-bk0051.png';
/* WHERE THE BLOCKING SHOWS FIRST: the lamp's glow on the plaster beside the
   door, with the house number and the door's edge in it - a flat tone, a
   gradient and a hard edge in one square. A fraction of the photograph. */
const CP_LOOK = [0.533, 0.44];
/* the detail is enlarged four times, nearest-neighbour, so an 8 x 8 block of
   the full-size file is 32 px on the screen and can be seen from the back of
   the room; a resized file is enlarged further to cover the same spot */
const CP_ZOOM = 4;

function mountCompression(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Compression and Resize'),
              el('span', 'ts-sub', 'quality · pixel size · saving again'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = {
    qi: CP_Q.indexOf(60),
    si: CP_SIZE.length - 1,   /* full size until the student asks for less */
    saves: 0,        /* 0 until the photograph has arrived and been saved once */
    bytes: 0,
    shown: null,     /* the decoded file: what is on the stage and what is saved next */
    w: CP_W, h: CP_H,           /* the file as it stands, crops and all */
    bw: CP_W, bh: CP_H, bs: 1,  /* the file at its first save, and its share of the photograph */
    master: null,    /* the lossless photograph, drawn once */
    sized: [],       /* the lossless photograph at each rung of CP_SIZE, made when first asked for */
    err: false,
    job: 0,
  };
  let chain = Promise.resolve();

  const view = canvas(stage, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('role', 'application');
  cv.setAttribute('aria-label',
    'Compression and Resize. Minus and plus set the JPEG quality, less-than '
    + 'and greater-than set the pixel size, Enter saves the file again, R '
    + 'starts over from one save.');

  /* ---- the strip ------------------------------------------------------
     Three cells. The quality is a ladder of seven numbers the lecture names;
     his brief asks for a slider, and the slider walks the ladder. The size is
     the same kind of control over its own ladder, in the order an export
     dialog asks for them (quality, then image sizing), and it says the pixel
     dimensions rather than a percentage, because a portal or a client asks
     for pixels. */
  const fQ = slider(controls, {
    label: 'Quality', min: 0, max: CP_Q.length - 1, step: 1, value: state.qi,
    cls: 'one', format: (i) => String(CP_Q[i]),
  });
  fQ.addEventListener('input', () => {
    if (+fQ.value === state.qi) return;
    state.qi = +fQ.value;
    firstSave();
  });
  const fS = slider(controls, {
    label: 'Resize', min: 0, max: CP_SIZE.length - 1, step: 1, value: state.si,
    cls: 'one', format: (i) => cpDims(CP_SIZE[i]).join(' × ') + ' px',
  });
  fS.addEventListener('input', () => {
    if (+fS.value === state.si) return;
    state.si = +fS.value;
    firstSave();
  });

  /* SAVE AGAIN AND START OVER ARE TWO PRESSES and each is dead when it has
     nothing to act on: Save again after the tenth save, Start over while
     there is only the one. The count sits in the cell's own label, where a
     slider keeps its value. */
  const act = el('div', 'ctl one');
  const actLab = el('label', null, 'Saves <span class="val"></span>');
  const count = actLab.querySelector('.val');
  const row = el('div', 'states');
  const bAgain = el('button', 'st', 'Save again');
  const bStart = el('button', 'st', 'Start over');
  [bAgain, bStart].forEach((b) => { b.type = 'button'; row.append(b); });
  act.append(actLab, row);
  controls.append(act);
  pinWidth(count, [CP_SAVES + ' of ' + CP_SAVES]);
  bAgain.addEventListener('click', () => saveAgain());
  bStart.addEventListener('click', () => startOver());

  /* THE THREE GATES (O1 O2 O3), ANSWERED - two cells.
     File size: nobody sets it, the encoder answers with it; nothing in the
     picture states it; and it is the number a student acts on when a portal,
     an email or a client sets a limit.
     Of the uncompressed file: the same pixels stored without compression take
     width x height x 3 bytes. Nothing draws that either, and it is what makes
     the file size mean something - how much of the photograph's data this
     quality kept, which is what compression is. It is counted at the size
     Resize has set, so the cell carries both halves of the lesson: the
     second number is what the pixel dimensions cost, the first is the share
     of it the quality kept. */
  const out = readout(fig, [
    { id: 'size', key: 'File size', cls: 'hi' },
    { id: 'share', key: 'Of the uncompressed file' },
  ]);

  fsButton(stage, fig);

  /* ---- the keys, printed on the stage under the detail ---------------- */
  fig.addEventListener('keydown', (e) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(TEXTAREA|SELECT)$/.test(t.tagName))) return;
    /* a focused button presses itself on Enter; do not press it twice */
    if ((e.key === 'Enter' || e.key === ' ') && t && t.closest && t.closest('button')) return;
    let took = true;
    if (e.key === '-' || e.key === '_') stepQ(-1);
    else if (e.key === '+' || e.key === '=') stepQ(1);
    /* the size: < smaller, > larger, taken unshifted as well (, and .) */
    else if (e.key === '<' || e.key === ',') stepS(-1);
    else if (e.key === '>' || e.key === '.') stepS(1);
    else if (e.key === 'Enter') saveAgain();
    else if (e.key === 'r' || e.key === 'R') startOver();
    else took = false;
    if (took) { e.preventDefault(); e.stopPropagation(); }
  });

  function stepQ(d) {
    const i = Math.max(0, Math.min(CP_Q.length - 1, state.qi + d));
    if (i === state.qi || state.err) return;
    state.qi = i;
    fQ.value = String(i); fQ._sync();
    firstSave();
  }
  function stepS(d) {
    const i = Math.max(0, Math.min(CP_SIZE.length - 1, state.si + d));
    if (i === state.si || state.err) return;
    state.si = i;
    fS.value = String(i); fS._sync();
    firstSave();
  }

  /* ---- the file ------------------------------------------------------- */
  /* THE ENCODER IS ASKED SYNCHRONOUSLY. canvas.toBlob and convertToBlob both
     wait for the browser to be idle before they encode, and Chrome holds idle
     time back for a second after a key or a click - so every save answered a
     second late (measured 30-09-2026: 1010 ms against 40 ms for the same
     encode). toDataURL runs the same JPEG encoder at once, 10-60 ms here, and
     the file's size is the decoded length of its base64. Same encoder, same
     bytes: q60 wrote 117,939 bytes through both. */
  function encode(c, q) {
    const url = c.toDataURL('image/jpeg', q / 100);   /* throws on a tainted canvas */
    const b64 = url.slice(url.indexOf(',') + 1);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: 'image/jpeg' });
  }
  const decode = (b) => {
    if (window.createImageBitmap) return createImageBitmap(b);
    return new Promise((ok, no) => {
      const u = URL.createObjectURL(b), i = new Image();
      i.onload = () => { URL.revokeObjectURL(u); ok(i); };
      i.onerror = no; i.src = u;
    });
  };
  /* a canvas the page reads back from, so it is kept in memory */
  const surface = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return [c, c.getContext('2d', { willReadFrequently: true })];
  };
  /* THE PHOTOGRAPH AT RUNG i, before any encoder has touched it. Each rung is
     drawn from the rung above, which is exactly twice its size, so every pixel
     is the average of a 2 x 2 block; a one-step reduction by eight reads too
     few pixels in some browsers and adds aliasing that is not the file's.
     Made once and kept. */
  function sized(i) {
    if (state.sized[i]) return state.sized[i];
    if (i >= CP_SIZE.length - 1) return (state.sized[i] = state.master);
    const big = sized(i + 1);
    const [w, h] = cpDims(CP_SIZE[i]);
    const [c, g] = surface(w, h);
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';
    g.drawImage(big, 0, 0, w, h);
    return (state.sized[i] = c);
  }

  /* ONE SAVE AT A TIME, in the order they were asked for. A first save (the
     slider, Start over) supersedes whatever is still waiting; a save again
     takes the file as it stands when its turn comes, so ten quick presses
     make ten saves and not ten copies of the second. */
  function enqueue(first) {
    const job = first ? ++state.job : state.job;
    chain = chain.then(async () => {
      if (job !== state.job) return;
      let src, trim, saves;
      const si = state.si;
      if (first) { src = sized(si); trim = 0; saves = 1; }
      else {
        if (!state.shown || state.saves < 1 || state.saves >= CP_SAVES) return;
        /* the edit between two saves: one pixel off the top and the left */
        src = state.shown; trim = 1; saves = state.saves + 1;
      }
      const w = (src.width || src.naturalWidth) - trim;
      const h = (src.height || src.naturalHeight) - trim;
      const [c, g] = surface(w, h);
      g.drawImage(src, -trim, -trim);
      try {
        const blob = encode(c, CP_Q[state.qi]);
        const pic = await decode(blob);
        if (job !== state.job) return;
        state.shown = pic; state.w = w; state.h = h;
        state.bytes = blob.size; state.saves = saves;
        if (first) { state.bw = w; state.bh = h; state.bs = CP_SIZE[si]; }
      } catch (e) {
        /* a page opened straight off the disk taints the canvas and the
           browser will not write a file from it */
        state.err = true;
      }
      sync();
    }).catch((e) => { console.error('compression: a save failed', e); });
  }

  function firstSave() {
    if (!state.master || state.err) return;
    enqueue(true);
  }
  function saveAgain() {
    if (!state.shown || state.err || state.saves < 1 || state.saves >= CP_SAVES) return;
    enqueue(false);
  }
  function startOver() {
    if (state.err || state.saves <= 1) return;
    firstSave();
  }

  /* the lossless photograph, copied once into a canvas the encoder reads */
  loadImage(CP_ART, (box) => {
    const im = box.img;
    const [c, g] = surface(im.naturalWidth, im.naturalHeight);
    g.drawImage(im, 0, 0);
    state.master = c;
    state.w = c.width; state.h = c.height;
    firstSave();
    view.render();
  });

  const off = (b, dead) => {
    b.disabled = dead;
    b.classList.toggle('off', dead);
    b.setAttribute('aria-disabled', String(dead));
  };

  /* a file's size as a photographer reads it: MB from a million bytes, whole
     KB above ten, one decimal below. Measured in Chromium, 30-09-2026: at
     188 x 125 the file is 1.4 KB at quality 10 and 3.6 KB at 60, which whole
     KB would round to 1 and 4. Full size runs 26 KB (q10) to 1.6 MB (q100). */
  const bytesText = (n) => (n >= 1e6
    ? (n / 1e6).toFixed(1) + '<span class="u">MB</span>'
    : (n >= 1e4 ? String(Math.round(n / 1e3)) : (n / 1e3).toFixed(1))
      + '<span class="u">KB</span>');

  function sync() {
    count.textContent = state.saves + ' of ' + CP_SAVES;
    off(bAgain, state.err || state.saves < 1 || state.saves >= CP_SAVES);
    off(bStart, state.err || state.saves <= 1);
    ctlOff(fQ, state.err);
    ctlOff(fS, state.err);
    if (state.saves && !state.err) {
      const raw = state.w * state.h * 3;
      out.size.innerHTML = bytesText(state.bytes);
      out.share.innerHTML = (100 * state.bytes / raw).toFixed(1)
        + '<span class="u">%</span> of ' + bytesText(raw);
    } else {
      out.size.textContent = '—';
      out.share.textContent = '—';
    }
    view.render();
  }

  /* ---- the drawing ----------------------------------------------------
     The photograph and the detail stand side by side at one height, and the
     pair is centred in whatever the stage is. The photograph is as tall as
     the stage allows while the detail keeps at least 0.8 of that height in
     width; the detail then takes the rest of the row, up to 2.4 times its
     height, so a wide short stage is filled by the detail rather than left
     empty at both ends (S6, S24). */
  const KEYS = [[['−', '+'], 'quality'], [['<', '>'], 'resize'],
                [['⏎'], 'crop 1 px, save again'], [['R'], 'start over']];
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
    const pic = state.shown || state.master;
    const r = CP_W / CP_H;
    const m = 24, gap = 24, top = 26;
    const aw = w - 2 * m - gap;
    const kw = keysWidth(ctx);
    /* the keys stand under the detail, level with the credit, when they fit
       there; otherwise they take a line of their own under both */
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

    if (!pic) {
      label(ctx, 'THE PHOTOGRAPH IS ON ITS WAY', x0, y0 + ph / 2, p.muted, 9);
      return;
    }
    const cw = pic.width || pic.naturalWidth, chh = pic.height || pic.naturalHeight;

    /* the photograph: the decoded file, whole, at one display size whatever
       its pixel size - a smaller file is enlarged into the same place and
       reads softer, which is what Resize is there to show */
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(pic, x0, y0, pw, ph);
    ctx.restore();

    /* the same spot in the photograph whatever has been cropped from it and
       whatever size it was saved at: the file's own pixels are counted from
       its first save (bw, bh), and the detail's zoom grows as the file
       shrinks, so the detail always covers the same area of the scene */
    const bw = state.shown ? state.bw : CP_W, bh = state.shown ? state.bh : CP_H;
    const zoom = CP_ZOOM / (state.shown ? state.bs : 1);
    const cut = state.shown ? bw - cw : 0;
    const rw = Math.ceil(dw / zoom), rh = Math.ceil(dh / zoom);
    const sx = Math.max(0, Math.min(cw - rw, CP_LOOK[0] * bw - cut - rw / 2));
    const sy = Math.max(0, Math.min(chh - rh, CP_LOOK[1] * bh - cut - rh / 2));
    const kx = pw / cw, ky = ph / chh;

    /* the detail, every pixel of the file a square */
    ctx.save();
    ctx.beginPath(); ctx.rect(dx, y0, dw, dh); ctx.clip();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(pic, Math.round(sx), Math.round(sy), rw, rh,
                  dx, y0, rw * zoom, rh * zoom);
    ctx.restore();

    /* ONE ORANGE THING: the area the detail shows, marked in both places */
    ctx.save();
    ctx.strokeStyle = p.signal; ctx.lineWidth = 1.5;
    ctx.strokeRect(x0 + Math.round(sx) * kx, y0 + Math.round(sy) * ky, rw * kx, rh * ky);
    ctx.strokeRect(dx + 0.75, y0 + 0.75, dw - 1.5, dh - 1.5);
    ctx.restore();

    label(ctx, 'JPEG · ' + cw + ' × ' + chh + ' PX', x0, y0 - 10, p.muted, 9);
    label(ctx, 'DETAIL · ' + Math.round(zoom * 100) + ' %', dx, y0 - 10, p.muted, 9);
    /* the credit belongs to the photograph: under it, on its right edge */
    label(ctx, 'PHOTO: BATUHAN KESKINER', x0 + pw, y0 + ph + 18, p.muted, 9, 'right');

    /* EVERY KEY THAT DOES SOMETHING, in a cap. Save again says what it does
       to the file - the crop - where the key is, so the loss is not read as
       what a plain re-save costs. */
    if (state.err) {
      label(ctx, 'THE BROWSER WRITES THE FILE ONLY WHEN THE PAGE IS SERVED',
            dx, y0 + ph + 18, p.signal, 9);
    } else if (foot === 30) {
      keyRow(ctx, dx + dw / 2, y0 + ph + 15, KEYS, p.fg, p.muted);
    } else {
      keyRow(ctx, x0 + (pw + gap + dw) / 2, y0 + ph + 40, KEYS, p.fg, p.muted);
    }
  }

  sync();
  return { render: view.render };
}

window.mountCompression = mountCompression;
