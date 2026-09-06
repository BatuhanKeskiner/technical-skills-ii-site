/* ============================================================
   FORMAT, AT TRUE SIZE
   ------------------------------------------------------------
   Every textbook prints 35mm, medium format and 4x5 at the same
   size on the page and then explains in words that they are not
   the same size. This does the opposite: it says nothing, and
   draws them at their real proportions to each other. A 4x5
   sheet is THIRTEEN TIMES the area of a 35mm frame, and no
   sentence carries that as well as putting one on top of the
   other.

   Then it answers the question that follows. If format matters,
   what does it change? Not the picture - the ENLARGEMENT. A
   print with a 30cm long edge asks 35mm to grow 8.3 times and a
   4x5 sheet to grow 2.5, so a grain of the same size on the film
   comes out three and a third times bigger on the print from the
   small camera. That number is the whole argument for format,
   and it is one division.

   THE FILM IS BATU'S OWN. Three rebates drawn with the image
   area cut out of them, so a photograph goes BEHIND the frame
   and the sprockets and the edge printing sit over it. The holes
   were measured off the alpha channel rather than guessed, and
   each frame is scaled so its hole lands exactly on the true
   millimetres - which is what makes the comparison honest rather
   than decorative.
   ============================================================ */

/* THE REAL IMAGE AREAS, in millimetres. Not the film's outside
   edge - the picture. 35mm is 24x36, a 645 back gives 41.5x56,
   and a 4x5 holder masks the sheet down to about 95x120. */
const FMT = [
  {
    id: '35', name: '35 mm', sub: 'the small camera',
    w: 36, h: 24,
    art: 'film-35.png',  aw: 900, ah: 822,
    hole: { x: 29, y: 122, w: 842, h: 578 },
  },
  {
    id: '645', name: '6 × 4.5', sub: 'medium format',
    w: 41.5, h: 56,
    art: 'film-645.png', aw: 900, ah: 649,
    hole: { x: 227, y: 32, w: 447, h: 592 },
  },
  {
    id: '45', name: '4 × 5', sub: 'sheet film',
    w: 95, h: 120,
    art: 'film-45.png',  aw: 753, ah: 900,
    hole: { x: 30, y: 30, w: 693, h: 840 },
  },
];

function mountFormats(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Format, at true size'),
              el('span', 'ts-sub', '35 mm · 6 × 4.5 · 4 × 5'));
  fig.prepend(head);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const state = { print: 30, mode: 'stack' };

  const view = canvas(stage, draw);
  const art = {};
  FMT.forEach((f) => {
    const i = new Image();
    i.onload = () => { art[f.id] = i; view.render(); };
    i.src = '../_shared/interactives/art/' + f.art;
  });
  const scene = new Image();
  scene.onload = () => view.render();
  scene.src = '../_shared/interactives/art/format-scene.jpg';

  /* ---- controls ----------------------------------------------------
     The readout is built FIRST. states() calls its handler while it is being
     set up, and that handler refreshes the readout - so a readout made after
     the controls is a readout that does not exist yet when it is first
     written to. */
  const out = readout(fig, [
    { key: 'Enlargement', wide: true },
    { key: 'And so', cls: 'hi', wide: true },
  ]);

  const prR = slider(controls, {
    label: 'Print, long edge', min: 10, max: 120, step: 1,
    value: state.print, unit: ' cm', cls: 'span2',
    onInput: () => {},
  });
  prR.addEventListener('input', () => { state.print = +prR.value; refresh(); });

  states(controls, {
    label: 'Laid out',
    items: ['One on another', 'Side by side'],
    cls: 'span1',
    onChange: (i) => { state.mode = i === 0 ? 'stack' : 'row'; refresh(); },
  });

  /* ---- the sums ----------------------------------------------------- */
  /* An enlargement is the print's long edge over the negative's. Grain does
     not care which camera it came from; it cares how much it was grown. */
  function factor(f) { return (state.print * 10) / Math.max(f.w, f.h); }

  function refresh() {
    out['Enlargement'].textContent = FMT.map((f) =>
      f.name + ' ×' + factor(f).toFixed(1)).join('   ·   ');
    const small = factor(FMT[0]), big = factor(FMT[2]);
    const area = (FMT[2].w * FMT[2].h) / (FMT[0].w * FMT[0].h);
    out['And so'].textContent =
      'a 4 × 5 sheet is ' + area.toFixed(1) + ' times the area of a 35 mm frame, '
      + 'and at this print size the grain from 35 mm comes out '
      + (small / big).toFixed(1) + ' times bigger on the paper';
    view.render();
  }

  /* ---- drawing ------------------------------------------------------- */

  function drawOne(ctx, f, x, y, mmk) {
    /* mmk: pixels per millimetre. The FRAME is scaled so its cut-out lands
       exactly on the true millimetres — that is the whole trick, and it is
       why the comparison is a measurement rather than a picture. */
    const im = art[f.id];
    const iw = f.w * mmk, ih = f.h * mmk;          /* the image area, true */
    if (!im) {
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.strokeRect(x, y, iw, ih);
      return;
    }
    const k = iw / f.hole.w;                        /* art px -> screen px */
    const fx = x - f.hole.x * k, fy = y - f.hole.y * k;

    /* the photograph goes BEHIND, cropped to this format's own shape */
    if (scene.complete && scene.naturalWidth) {
      const sa = scene.naturalWidth / scene.naturalHeight, ta = f.w / f.h;
      let sw = scene.naturalWidth, sh = scene.naturalHeight;
      if (sa > ta) sw = sh * ta; else sh = sw / ta;
      ctx.save();
      ctx.beginPath(); ctx.rect(x, y, iw, ih); ctx.clip();
      ctx.drawImage(scene, (scene.naturalWidth - sw) / 2,
                    (scene.naturalHeight - sh) / 2, sw, sh, x, y, iw, ih);
      ctx.restore();
    }
    ctx.drawImage(im, fx, fy, f.aw * k, f.ah * k);

    /* ITS NAME GOES IN ITS OWN CORNER. Stacked from a shared corner, the three
       formats agree about where they start and disagree about where they end -
       so the end is the only place a label belongs to one of them alone. On a
       small plate, because in this mode two of the three corners land on the
       big sheet's photograph. */
    const nx = x + iw - 8, ny = y + ih - 10;
    ctx.save();
    ctx.font = '600 13px "Instrument Sans", system-ui, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    const tw = Math.max(ctx.measureText(f.name).width,
                        ctx.measureText(f.w + ' × ' + f.h + ' mm').width);
    ctx.fillStyle = 'rgba(8,10,9,0.74)';
    ctx.fillRect(nx - tw - 9, ny - 26, tw + 15, 42);
    ctx.fillStyle = '#F2F2F0';
    ctx.fillText(f.name, nx, ny);
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(242,242,240,0.62)';
    ctx.fillText(f.w + ' × ' + f.h + ' mm', nx, ny + 14);
    ctx.restore();
  }

  /* THE ART IS BIGGER THAN THE PICTURE. A rebate has sprocket rows and edge
     printing outside the image area — the 35mm frame's artwork is 42% taller
     than its own hole. Fitting to the holes put the sheet's rebate off the
     bottom of the stage, so the fit is done against the FULL frame in
     millimetres, worked back through each frame's own scale. */
  function artMM(f) {
    const per = f.hole.w / f.w;                 /* art px per mm */
    return { w: f.aw / per, h: f.ah / per,
             ox: f.hole.x / per, oy: f.hole.y / per };
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0E1110'; ctx.fillRect(0, 0, w, h);

    const pad = 30;
    const A = FMT.map(artMM);

    if (state.mode === 'stack') {
      /* ONE ON ANOTHER, sharing the corner their pictures start at. Nothing
         argues the difference better than the small one lying inside the big
         one. The extent is the union of all three frames measured from that
         shared corner, so the smallest frame's sprockets are inside it too. */
      let l = 0, t = 0, r = 0, b = 0;
      FMT.forEach((f, i) => {
        l = Math.max(l, A[i].ox); t = Math.max(t, A[i].oy);
        r = Math.max(r, A[i].w - A[i].ox); b = Math.max(b, A[i].h - A[i].oy);
      });
      const mmk = Math.min((w - pad * 2) / (l + r), (h - pad * 2.4) / (t + b));
      const x = (w - (l + r) * mmk) / 2 + l * mmk;
      const y = (h - (t + b) * mmk) / 2 + t * mmk;
      for (let i = FMT.length - 1; i >= 0; i--) drawOne(ctx, FMT[i], x, y, mmk);
    } else {
      const total = A.reduce((s2, a) => s2 + a.w, 0);
      const gaps = pad * (FMT.length - 1);
      const tallest = Math.max.apply(null, A.map((a) => a.h));
      const mmk = Math.min((w - pad * 2 - gaps) / total, (h - pad * 2.4) / tallest);
      let x = (w - (total * mmk + gaps)) / 2;
      const mid = h / 2;
      FMT.forEach((f, i) => {
        drawOne(ctx, f, x + A[i].ox * mmk,
                mid - A[i].h * mmk / 2 + A[i].oy * mmk, mmk);
        x += A[i].w * mmk + pad;
      });
    }
  }

  fsButton(stage, fig);
  refresh();
}
