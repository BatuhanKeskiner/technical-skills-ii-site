/* ============================================================
   A3 · Fovea
   A picture the way the eye actually delivers it: sharp over the
   couple of degrees you are fixating, falling away to vague and
   almost colourless at the edge. The sharp patch is the pointer -
   it follows the mouse, because that is what an eye does; it does
   not wait to be told where to go. Click and it leaves a mark, and
   the marks joined up are a scan path, drawn by the room rather
   than by Yarbus.
   ============================================================ */

const X_STAGE_AR = 1012 / 600;

/* THE PICTURES ARE HIS OWN, AND THEY ARE PAINTINGS. The plate was one
   photograph of a film set; on his word, 08-09-2026, it is a set of artworks
   he can move between - "bu görsel yerine de 3-4 ayrı sanat eseri görseli
   ekle, değiştirebilelim görüntüleri de". All three are already in week 2,
   already credited in ASSETS.md, and all three are public domain. Repin
   first: it is the painting Yarbus put in front of his readers, and the
   lecture's Yarbus page is three pages away. */
/* ONE PLATE, AND IT IS THE ROOM. There were four - Repin, Raphael,
   Botticelli and a film set - and his round of 09-09-2026 took the three
   paintings out: "remove repin, raphael, boticelli. leave only the the room."
   A painting is built to be looked at in an order, so what the eye does on one
   is partly the painter's doing; on a set that nobody arranged for a viewer,
   the habit itself is what shows - the eye goes to the faces, and it goes
   there first. The three files stay in assets/ for the pages that use them. */
/* AND A PAGE MAY PIN A DIFFERENT ONE. His note of 09-09-2026: "add fovea's
   interactive with a pepin image after the 15th slide. same interactive but
   pepin image." The room stays the default, so page 13 is untouched and still
   has no picker; a page that says `pin: { plate: 'repin' }` gets the painting
   instead. Either way the page offers exactly one picture, so the picker
   never comes back - a control with one option is furniture. */
const X_PLATES = [
  { id: 'room', name: 'A room', file: 'a3-film-set.jpg',
    credit: 'A FILM SET, WITH ITS CREW' },
  { id: 'repin', name: 'Repin', file: 'a6-repin.jpg',
    credit: 'ILYA REPIN, UNEXPECTED VISITORS, 1884' },
];
const X_DIR = '../02-composition-format/assets/';

function mountFovea(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  /* A NAME ON THE INSTRUMENT. In full screen the page's own heading is gone
     and there is nothing on screen saying what this is. IG-01 02: the head is
     the name and a three-noun eyebrow. Added to every instrument 08-09-2026 -
     five of eleven had one, and on a wall the other six were anonymous. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Fovea'),
              el('span', 'ts-sub', 'fixation · sharp field · scan path'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* the fixation is kept in picture coordinates (0–1), so it stays
     put when the stage is resized or thrown full screen */
  /* THE PAGE CHOOSES THE PICTURE, AND IT CHOOSES ONE. Unpinned, the room. */
  const wanted = fig.dataset.plate || 'room';
  const PLATES = X_PLATES.filter((q) => q.id === wanted);
  if (!PLATES.length) PLATES.push(X_PLATES[0]);

  const state = { x: 0.5, y: 0.5, deg: 4, path: [], pi: 0 };

  let plate = null;

  /* The stage takes whatever shape the page gives it, and the drawing
     fills it. Full screen is the one exception: it keeps the shape the
     stage had, so the composition on the wall is the composition on the
     laptop rather than a different picture. */
  let stageAr = X_STAGE_AR;
  const onScreen = () => document.fullscreenElement === fig || fig.classList.contains('fs-on');
  function frame(w, h) {
    if (!onScreen()) { stageAr = w / h; return { x: 0, y: 0, w, h }; }
    return frameIn(w, h, stageAr);
  }

  /* one picture at a time, and the layers built for it are thrown away with
     it - they are that picture blurred, and no other */
  function usePlate(i) {
    state.pi = i;
    plate = null; L = null;
    loadImage(X_DIR + PLATES[i].file, (bx) => {
      plate = bx.img; L = null; view.render();
    });
    view.render();
  }

  const view = canvas(stage, draw);

  /* NO PICTURE PICKER. There is one picture, and a control with one option is
     not a control - it is a button that cannot be pressed. His note of
     09-09-2026: "Because there is no other picture, you need to delete these
     scene selection." It comes back on its own if a second plate is ever
     added. */
  if (PLATES.length > 1) {
    states(controls, {
      label: 'Picture', cls: 'piccell',
      items: PLATES.map((q) => q.name),
      onChange: (i) => { state.path = []; refresh(); usePlate(i); },
    });
  }

  const fDeg = slider(controls, {
    label: 'Sharp field', min: 1, max: 20, step: 1, value: state.deg, unit: '°',
    cls: 'degcell',
  });
  fDeg.addEventListener('input', () => { state.deg = +fDeg.value; view.render(); });

  /* CLEAR IS AN ACTION WEARING A STATE'S CLOTHES - it was one of two 'Scan
     path' states, Keep and Clear. Pressing Clear emptied the path and then
     stayed lit, so the control asserted a Clear mode the instrument does not
     have, and pressing it again did nothing at all. It is one button now, and
     it is dead while there is no path to clear. */
  const scan = el('div', 'ctl');   /* span1 is not a class the stylesheet has */
  scan.append(el('label', null, 'Scan path'));
  const scanRow = el('div', 'states');
  const bClear = el('button', 'st', 'Clear path');
  bClear.type = 'button';
  scanRow.append(bClear);
  scan.append(scanRow);
  controls.append(scan);
  bClear.addEventListener('click', () => { state.path = []; refresh(); view.render(); });

  function refresh() {
    const dead = !state.path.length;
    bClear.disabled = dead;
    bClear.setAttribute('aria-disabled', String(dead));
    bClear.classList.toggle('off', dead);
  }

  /* IG-01 07. Fixations was removed: the trail on the picture IS the count,
     drawn, so it failed G2 - and nobody acts on the number, which is G3 as
     well. The share of the frame stays and passes all three: it is derived
     from the sharp field, nothing in the picture states it as a proportion,
     and it is the thing the page is for - two degrees is almost nothing. */
  const out = readout(fig, [
    { id: 'share', key: 'Sharp share of the frame', cls: 'hi', wide: true },
  ], 'one');

  fsButton(stage, fig);

  /* THE SHARP PATCH IS THE POINTER. It used to sit still until it was clicked
     and then travel to the click, which is a fair drawing of a saccade and a
     poor drawing of looking: you cannot sweep it across a face, and the room
     never sees the thing the instrument is for, which is that the vague part
     is vague WHILE you are moving. On his word, 08-09-2026: "bu görüş
     tıklandığında değişmesin direkt mouse'u takip etsin." The mouse is now
     the eye. The system cursor is hidden, so the yellow ring is the only
     pointer on the stage, and a click leaves a mark on the scan path without
     moving anything. */
  function look(e) {
    if (document.body.classList.contains('design')) return null;
    const r = view.canvas.getBoundingClientRect();
    const P = plateRect(r.width, r.height);
    const x = ((e.clientX - r.left) - P.x) / P.w;
    const y = ((e.clientY - r.top) - P.y) / P.h;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    state.x = x; state.y = y;
    view.render();
    return { x, y };
  }
  view.canvas.addEventListener('pointermove', look);
  /* a click marks where the eye was, the way an eye tracker records a
     fixation - it is the only thing left for a click to mean */
  view.canvas.addEventListener('click', (e) => {
    if (!look(e)) return;
    state.path.push({ x: state.x, y: state.y });
    if (state.path.length > 24) state.path.shift();
    refresh();
    view.render();
  });
  view.canvas.style.cursor = 'none';

  /* the picture's own rectangle inside the stage */
  function plateRect(w, h) {
    const F = frame(w, h);
    const ar = plate ? plate.naturalWidth / plate.naturalHeight : 1.5;
    const R = frameIn(F.w, F.h, ar);
    return { x: F.x + R.x, y: F.y + R.y, w: R.w, h: R.h, F };
  }

  /* The eye sees about 200 degrees across and the sharp patch is `deg` of
     it. Drawn to that scale on a wall four degrees is a dot nobody in the
     back row can read, so the patch is opened up: the proportion the readout
     states is still the proportion of the frame that is drawn sharp, it is
     just drawn large enough to see what is inside it. */
  function radius(P) { return Math.max(14, P.w * (state.deg / 200) * 4.0); }

  function sync(P) {
    const r = radius(P);
    const share = Math.min(100, (Math.PI * r * r) / (P.w * P.h) * 100);
    out.share.innerHTML = share.toFixed(1) + '<span class="u">%</span>';
  }

  /* THREE ZONES, TWO STEPS DOWN. Sharp and full colour where the eye is
     fixating; one step out, softened and a little drained; beyond that,
     softer again and nearly colourless. Cones thin out fast away from the
     fovea and colour goes with them, so the periphery is not only vague,
     it is grey. The blurs are far lighter than a single hard step needed to
     be: with two of them the falloff carries the idea, and the picture stays
     a picture rather than a fog. Divisors of the picture width, so the
     softening is the same on a laptop and on a six-metre wall. */
  /* Four layers of the same picture, each a little softer and a little greyer
     than the one inside it, and each faded in through a wide ring so that no
     edge between two of them can be found. `in` and `out` are multiples of
     the sharp radius: solid out to `in`, gone by `out`. The divisors are of
     the picture's width, so the softening is the same on a laptop and on a
     six-metre wall. Nothing here is a cliff and nothing is a hard edge; the
     eye's own falloff is not one either. */
  const Z_SHARP = { in: 0.88, out: 1.30 };
  const Z_RINGS = [
    { in: 1.60, out: 2.60, div: 330, sat: 0.90 },
    { in: 3.00, out: 4.40, div: 200, sat: 0.76 },
  ];
  const Z_BASE = { div: 130, sat: 0.54 };

  let L = null;   /* the layers, rebuilt only when the picture changes size */
  function layers(w, h) {
    if (L && L.w === w && L.h === h) return L;
    /* THE SOFT LAYERS ARE THE SAME PICTURE, NOT A LARGER ONE.
       They used to be drawn twelve per cent oversize, which is the quick way
       to stop a blur sampling the transparent nothing outside the canvas and
       fading the border. It also moves every part of the picture away from
       the centre, by more the further out it is - so the sharp disc and the
       soft field underneath it no longer lined up, and the picture appeared
       to shift as the eye moved. Batu caught it and asked whether it was lens
       breathing. It was not: it was this.
       The border is protected the honest way now. The picture goes into a
       larger buffer at 1:1 with a margin round it, the margin is filled by
       stretching the picture's own outermost row and column outwards, the
       whole buffer is blurred, and the middle is cut back out. Every layer is
       then the same picture at the same size in the same place. */
    const soft = (div, sat) => {
      const blurPx = Math.max(2, Math.round(w / div));
      const m = Math.ceil(blurPx * 3) + 2;      /* room for the kernel to reach */
      const nw = plate.naturalWidth, nh = plate.naturalHeight;
      const ext = document.createElement('canvas');
      ext.width = w + m * 2; ext.height = h + m * 2;
      const e = ext.getContext('2d');
      e.drawImage(plate, 0, 0, nw, nh, m, m, w, h);                 /* 1:1 */
      e.drawImage(plate, 0, 0, 1, nh, 0, m, m, h);                  /* left */
      e.drawImage(plate, nw - 1, 0, 1, nh, m + w, m, m, h);         /* right */
      e.drawImage(plate, 0, 0, nw, 1, m, 0, w, m);                  /* top */
      e.drawImage(plate, 0, nh - 1, nw, 1, m, m + h, w, m);         /* bottom */
      e.drawImage(plate, 0, 0, 1, 1, 0, 0, m, m);                   /* corners */
      e.drawImage(plate, nw - 1, 0, 1, 1, m + w, 0, m, m);
      e.drawImage(plate, 0, nh - 1, 1, 1, 0, m + h, m, m);
      e.drawImage(plate, nw - 1, nh - 1, 1, 1, m + w, m + h, m, m);

      const big = document.createElement('canvas');
      big.width = ext.width; big.height = ext.height;
      const bg = big.getContext('2d');
      try { bg.filter = 'blur(' + blurPx + 'px) saturate(' + sat + ')'; }
      catch (er) { /* older engines */ }
      bg.drawImage(ext, 0, 0);

      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(big, m, m, w, h, 0, 0, w, h);
      return c;
    };
    const sharp = document.createElement('canvas');
    sharp.width = w; sharp.height = h;
    sharp.getContext('2d').drawImage(plate, 0, 0, w, h);
    const scratch = document.createElement('canvas');
    scratch.width = w; scratch.height = h;
    L = { w, h, sharp, scratch,
          base: soft(Z_BASE.div, Z_BASE.sat),
          rings: Z_RINGS.map((z) => soft(z.div, z.sat)) };
    return L;
  }

  /* one layer laid over the one beneath it and faded out through a ring, so
     a step reads as a step rather than as a cut edge */
  function disc(ctx, img, P, cx, cy, rIn, rOut) {
    const K = layers(Math.max(1, Math.round(P.w)), Math.max(1, Math.round(P.h)));
    const g = K.scratch.getContext('2d');
    const k = K.w / P.w;
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, K.w, K.h);
    g.drawImage(img, 0, 0, K.w, K.h);
    g.globalCompositeOperation = 'destination-in';
    const gr = g.createRadialGradient((cx - P.x) * k, (cy - P.y) * k, Math.max(0, rIn * k),
                                      (cx - P.x) * k, (cy - P.y) * k, Math.max(1, rOut * k));
    gr.addColorStop(0, 'rgba(0,0,0,1)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, K.w, K.h);
    g.globalCompositeOperation = 'source-over';
    ctx.drawImage(K.scratch, P.x, P.y, P.w, P.h);
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const P = plateRect(w, h);

    if (!plate) {
      label(ctx, 'LOADING THE PICTURE…', P.F.x + 16, P.F.y + 26, p.muted, 10);
      return;
    }

    const cx = P.x + state.x * P.w, cy = P.y + state.y * P.h, r = radius(P);
    const K = layers(Math.max(1, Math.round(P.w)), Math.max(1, Math.round(P.h)));

    /* the far field first, then each ring over the one outside it, then the
       fovea last: sharp, full colour, and no border — the eye has none */
    ctx.drawImage(K.base, P.x, P.y, P.w, P.h);
    for (let i = Z_RINGS.length - 1; i >= 0; i--) {
      disc(ctx, K.rings[i], P, cx, cy, r * Z_RINGS[i].in, r * Z_RINGS[i].out);
    }
    disc(ctx, K.sharp, P, cx, cy, r * Z_SHARP.in, r * Z_SHARP.out);

    /* the scan path */
    if (state.path.length) {
      ctx.save();
      /* thicker on his word of 09-09-2026 - "make the path thicker so it can
         be seen" - and it is seen from six metres, not from a laptop */
      ctx.strokeStyle = p.signal;
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      state.path.forEach((q, i) => {
        const qx = P.x + q.x * P.w, qy = P.y + q.y * P.h;
        i ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy);
      });
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      state.path.forEach((q, i) => {
        ctx.globalAlpha = 0.25 + 0.65 * (i + 1) / state.path.length;
        ctx.strokeStyle = p.signal;
        ctx.beginPath();
        ctx.arc(P.x + q.x * P.w, P.y + q.y * P.h, 5, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }

    /* the fixation ring */
    ctx.strokeStyle = p.marker;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    /* and the angle keeps its own dark edge, for the same reason */
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    label(ctx, state.deg + '°', cx + r + 8, cy + 4, p.marker, 9);
    label(ctx, state.deg + '°', cx + r + 8, cy + 4, p.marker, 9);
    ctx.restore();

    /* THE GHOST RING IS GONE with the click that needed it: it showed where
       the next fixation would land, and the fixation now lands wherever the
       mouse is, so it drew a second ring on top of the first. */

    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(P.F.x) + 0.5, Math.round(P.F.y) + 0.5, Math.round(P.F.w) - 1, Math.round(P.F.h) - 1);

    /* A SCRIM UNDER THE WRITING. The credit and the hint used to be laid
       straight onto the picture, which worked over Repin's dark floor and
       vanished over Botticelli's sky. A picture the room can choose cannot be
       relied on for contrast, so the words get their own ground: a short
       gradient off the bottom edge, dark enough to read against and light
       enough that the painting still runs underneath it. */
    const sh = 36;
    const gsc = ctx.createLinearGradient(0, P.y + P.h - sh, 0, P.y + P.h);
    gsc.addColorStop(0, 'rgba(0,0,0,0)');
    gsc.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = gsc;
    ctx.fillRect(P.x, P.y + P.h - sh, P.w, sh);

    /* the picture says what it is, in the corner, because the site credits
       every artwork where it is shown - and the other corner says what a
       click is for, now that a click no longer moves anything */
    label(ctx, PLATES[state.pi].credit, P.x + 14, P.y + P.h - 13, 'rgba(255,255,255,0.78)', 9);
    label(ctx, 'CLICK TO MARK A FIXATION',
          P.x + P.w - 14 - 138, P.y + P.h - 13, 'rgba(255,255,255,0.55)', 9);
    sync(P);
  }

  refresh();
  usePlate(0);
  return { render: view.render };
}

window.mountFovea = mountFovea;
