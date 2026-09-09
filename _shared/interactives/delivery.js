/* ============================================================
   A · Cropping & Delivery
   ------------------------------------------------------------
   You shoot the shape the camera is. Somebody asks for another
   shape. The frame you shot is drawn — the real studio, through
   a real lens, at that sensor's size — and the delivered ratio
   is cut out of it as large as it will go, with what falls
   outside hatched away.

   BATU'S OWN MODULE, PORTED (Fig. 5 of the 26-08 Cowork page).
   The version written here on 08-09 was mine: an empty
   rectangle with diagonal lines over it. Cropping is about what
   you lose IN THE PICTURE, and a picture is what mine did not
   have.

   Everything the arithmetic needs is his: the source sensors
   with their real millimetres, the delivery ratios with what
   asks for them, a megapixel count so the loss can be said in
   pixels as well as in area, and the crop's position — because
   where you put the crop is the other half of the decision.
   ============================================================ */

const DV_SRC = [
  { id: 'ff', label: 'Full Frame 2:3', sub: 'Sony A7 IV', w: 36, h: 24 },
  { id: '43', label: 'Micro Four Thirds 3:4', sub: 'OM System OM-1', w: 17.3, h: 13 },
  { id: '67', label: 'Medium Format 6×7', sub: 'Mamiya 7', w: 69, h: 56 },
  { id: '66', label: 'Medium Format 6×6', sub: 'Hasselblad 500C/M', w: 56, h: 56 },
];
/* THE DELIVERY SHAPE KEEPS ITS OWN ORIENTATION, and that is the whole cost: a
   portrait post is portrait however the camera was held. Where a shape goes
   either way — a square, a print — it follows the camera, and `port: null`
   says so. The first entry is the default, because states() marks the first. */
const DV_DST = [
  { id: '54', label: '4:5', r: 1.25, port: true, sub: 'Instagram portrait' },
  { id: '1', label: '1:1', r: 1, port: null, sub: 'square post' },
  { id: '43', label: '3:4', r: 4 / 3, port: null, sub: '' },
  { id: 'a', label: '1:√2', r: Math.SQRT2, port: null, sub: 'A-paper' },
  { id: '32', label: '2:3', r: 1.5, port: null, sub: '' },
  { id: '169', label: '9:16', r: 16 / 9, port: true, sub: 'story · reel' },
  { id: '239', label: '1:2.39', r: 2.39, port: false, sub: 'scope' },
];

function mountDelivery(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Cropping & Delivery'),
              el('span', 'ts-sub', 'shot · delivered · what it costs'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = {
    src: fig.dataset.src || 'ff', dst: fig.dataset.dst || DV_DST[0].id,
    srcPort: false, mp: 24, pos: 50,   /* centred, and not a control */
  };
  const S = () => DV_SRC.find((x) => x.id === state.src) || DV_SRC[0];
  const D = () => DV_DST.find((x) => x.id === state.dst) || DV_DST[0];
  /* the asked-for shape's orientation: its own where it has one, otherwise
     the camera's */
  const dstPort = () => (D().port === null || D().port === undefined)
    ? state.srcPort : D().port;

  const view = canvas(stage, draw);

  /* FOUR CELLS, WHICH IS THE CEILING, AND EVERY ONE MOVES THE PICTURE. */
  states(controls, {
    label: 'Shot on', cls: 'one', items: DV_SRC.map((x) => x.label.split(' ').slice(-1)[0]),
    onChange: (i) => { state.src = DV_SRC[i].id; view.render(); },
  });
  states(controls, {
    label: 'Held', cls: 'one', items: ['Landscape', 'Portrait'],
    onChange: (i) => { state.srcPort = i === 1; view.render(); },
  });
  states(controls, {
    label: 'Asked for', cls: 'one', items: DV_DST.map((x) => x.label),
    onChange: (i) => { state.dst = DV_DST[i].id; view.render(); },
  });
  /* WHERE THE CROP SITS IS GONE, on his note of 09-09-2026. The crop is
     centred, which is what a delivery ratio does by default and all this page
     is about; moving it is a decision for an editor, not a lesson in what a
     ratio costs. */

  /* THE THREE GATES (O1 O2 O3), ANSWERED — two cells.
     What is kept: nobody sets it, the hatching shows the loss but states no
     share, and the share is what a client argument is about. What is left in
     pixels: the same loss said the way a delivery spec is written, and the
     number that decides whether the crop is possible at all. */
  const out = readout(fig, [
    { id: 'kept', key: 'Kept', cls: 'hi' },
    { id: 'px', key: 'Pixels left' },
  ]);

  fsButton(stage, fig);

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const s = S(), d = D();
    const sw = state.srcPort ? s.h : s.w, sh = state.srcPort ? s.w : s.h;
    const rD = dstPort() ? 1 / d.r : d.r;
    let cw, ch;
    if (rD >= sw / sh) { cw = sw; ch = sw / rD; } else { ch = sh; cw = sh * rD; }
    const freeX = sw - cw, freeY = sh - ch, pos = state.pos / 100;
    const ox = -freeX / 2 + freeX * pos, oy = -freeY / 2 + freeY * pos;
    const kept = (cw * ch) / (sw * sh);
    /* THE SAME FRAMING ON EVERY SOURCE: the focal length follows the format's
       diagonal, so changing the camera changes the size of the negative and
       not the picture on it - which is the only fair comparison. */
    const f = 32 * Math.hypot(s.w, s.h) / Math.hypot(36, 24);

    const pad = 22, foot = 26;
    const [ix, iy, iw, ih] = fitBox(pad, pad, w - pad * 2, h - pad * 2 - foot, sw, sh);
    renderScene(ctx, ix, iy, iw, ih, f, sw, sh);
    const kx = iw / sw, ky = ih / sh;
    const cx0 = ix + iw / 2 + ox * kx - cw / 2 * kx;
    const cy0 = iy + ih / 2 + oy * ky - ch / 2 * ky;
    hatch(ctx, ix, iy, iw, ih, [cx0, cy0, cw * kx, ch * ky]);
    ctx.strokeStyle = p.signal; ctx.lineWidth = 2.5;
    ctx.strokeRect(cx0, cy0, cw * kx, ch * ky);
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(ix + 0.5, iy + 0.5, iw - 1, ih - 1);
    label(ctx, d.label + (dstPort() ? ' portrait' : ' landscape')
          + (d.sub ? ' · ' + d.sub : ''), cx0 + 8, cy0 + 18, p.signal, 11);
    label(ctx, ('SHOT ' + s.label + ' · ' + s.sub + ' · '
                + (state.srcPort ? 'PORTRAIT' : 'LANDSCAPE')).toUpperCase(),
          ix, iy - 8, p.muted, 9);

    /* AND WHAT TURNING THE CAMERA WOULD HAVE SAVED — free before the shutter,
       impossible after it, and the reason the instrument exists. */
    const sw2 = state.srcPort ? s.w : s.h, sh2 = state.srcPort ? s.h : s.w;
    let cw2, ch2;
    if (rD >= sw2 / sh2) { cw2 = sw2; ch2 = sw2 / rD; } else { ch2 = sh2; cw2 = sh2 * rD; }
    const kept2 = (cw2 * ch2) / (sw2 * sh2);
    label(ctx, kept2 > kept + 0.01
      ? 'HELD THE OTHER WAY IT WOULD KEEP ' + Math.round(kept2 * 100) + '%'
      : 'THE HATCHED PART IS THROWN AWAY',
      w / 2, h - 12, p.muted, 9, 'center');

    const px = state.mp * 1e6;
    out.kept.innerHTML = Math.round(kept * 100) + '<span class="u">%</span> of the frame';
    out.px.innerHTML = (px * kept / 1e6).toFixed(1) + '<span class="u">MP</span> of '
      + state.mp;
  }

  view.render();
  return { render: view.render };
}

window.mountDelivery = mountDelivery;
