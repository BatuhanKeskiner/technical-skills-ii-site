/* ============================================================
   A2.1 · Aperture and depth of field
   Top panel: the frame, with three subjects rendered at their
   true defocus. Bottom panel: the plan view, with the zone of
   acceptable sharpness drawn against the scale.
   ============================================================ */

const COC = 0.03;              /* circle of confusion, mm, 35 mm frame */
const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

function mountDof(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  /* A NAME ON THE INSTRUMENT. In full screen the page's own heading is gone
     and there is nothing on screen saying what this is. IG-01 02: the head is
     the name and a three-noun eyebrow. Added to every instrument 08-09-2026 -
     five of eleven had one, and on a wall the other six were anonymous. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Depth of Field'),
              el('span', 'ts-sub', 'aperture · distance · focal length'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  /* THE FORMAT IS THE FOURTH VARIABLE, and the one the old page left out.
     Fig. 6 of last year's brief: "plan view; hold framing / hold lens". To
     frame the same picture a larger format needs a longer lens, and a longer
     lens at the same f-number gives a shallower zone - the whole "medium
     format look" is that sentence. Hold the lens instead and the format only
     crops; the depth does not move.

     WHICH ONE IS HELD IS THE PAGE'S DECISION, not the student's (IG-01 06,
     rule 01): a page about the look holds the framing, a page about cropping
     holds the lens. `data-hold` pins it, `data-view` pins Frame / Plan / Both,
     and pinning both keeps the strip at four cells. */
  /* AND WHICH ONE IS HELD IS THE LESSON, SO IT IS A HAND AGAIN. It was pinned
     by the page; his note of 09-09-2026 sent me back to the Cowork module this
     instrument was ported from (Fig. 6, format-aspect-ratio), where the two
     modes are a pair of chips INSIDE the lens cell - because they are about
     the lens, and because the strip has four cells and no fifth. Comparing
     the two is the whole argument: hold the framing and the format changes
     the lens, and the depth with it; hold the lens and the depth does not move
     at all, because the format only crops. `data-hold` still says where it
     starts. */
  const VIEWS = ['frame', 'plan', 'both'];
  const state = {
    stop: 2, focal: 85, dist: 3.0,
    mode: Math.max(0, VIEWS.indexOf(fig.dataset.view || 'both')),
    fmt: 'ff',
    hold: fig.dataset.hold === 'lens' ? 'lens' : 'framing',
  };
  /* the formats a photograph is actually made on, with the diagonal that sets
     both the crop factor and what a normal lens is */
  const DFMT = [
    { id: 'mft',  name: 'MFT',         w: 17.3, h: 13 },
    { id: 'apsc', name: 'APS-C',       w: 23.6, h: 15.7 },
    { id: 'ff',   name: 'Full frame',  w: 36,   h: 24 },
    { id: 'gfx',  name: 'MF digital',  w: 43.8, h: 32.9 },
    { id: '67',   name: '6×7',         w: 70,   h: 56 },
    { id: '45',   name: '4×5',         w: 127,  h: 102 },
  ];
  const dfmt = () => DFMT.find((f) => f.id === state.fmt) || DFMT[2];
  const dDiag = (f) => Math.sqrt(f.w * f.w + f.h * f.h);
  const FF_DIAG = 43.27;
  const crop = () => FF_DIAG / dDiag(dfmt());
  /* THE CIRCLE OF CONFUSION DEPENDS ON WHICH THING IS BEING HELD, and this is
     the part my version had wrong. Holding the FRAMING, every format is
     enlarged to the same print, so the acceptable blur is the format's own
     diagonal over 1500 — a bigger negative is enlarged less and forgives
     more. Holding the LENS, the blur is judged on the sensor itself, so one
     fixed full-frame figure applies to all of them — and that is exactly what
     makes the format drop out of the equation and become a crop and nothing
     else. His own module, ported (Fig. 6 of the 26-08 page). */
  const FF_DIAG_MM = Math.hypot(36, 24);
  const coc = () => (state.hold === 'framing' ? dDiag(dfmt()) : FF_DIAG_MM) / 1500;

  /* Holding the framing means the lens IS the format: one metre of scene at
     the subject, on every format, is f = width × distance / field. Not a
     ratio nudge — the equation. */
  const FIELD_MM = 1000;
  const lensForFraming = (f) => (f || dfmt()).w * (state.dist * 1000) / FIELD_MM;

  const view = canvas(stage, draw);

  const fStop = slider(controls, {
    label: 'Aperture', min: 0, max: STOPS.length - 1, step: 1, value: state.stop,
    format: (v) => 'f/' + STOPS[v],
  });
  const fFocal = slider(controls, { label: 'Focal length', min: 24, max: 200, step: 1, value: state.focal, unit: ' mm' });
  const fDist = slider(controls, { label: 'Subject distance', min: 0.6, max: 12, step: 0.1, value: state.dist, unit: ' m', decimals: 1 });

  const fFormat = stepper(controls, {
    label: 'Format', ladder: DFMT.map((f) => f.id), value: state.fmt,
    format: (id) => (DFMT.find((f) => f.id === id) || DFMT[2]).name,
    onChange: (id) => {
      state.fmt = id;
      /* HOLDING THE FRAMING MEANS THE LENS ANSWERS. Change the format and the
         focal length moves with it, so the subject stays the same size in the
         frame - which is the only way two formats can be compared at all. */
      if (state.hold === 'framing') syncFraming();
      compute(); view.render();
    },
  });
  function syncFraming() {
    const f = Math.round(lensForFraming());
    state.focal = Math.max(+fFocal.min, Math.min(+fFocal.max, f));
    fFocal.value = String(state.focal); fFocal._sync();
  }

  /* THE TWO MODES, IN THE LENS CELL, where his own module put them. The cell
     keeps its size in both states (S18): the slider is always drawn, and
     holding the framing takes the hand off it rather than removing it - the
     number is then the format's answer, not a broken control (IG-02 P4). */
  const lensCell = fFocal.closest('.ctl');
  const holdRow = el('div', 'states');
  const bFrame = el('button', 'st', 'Hold framing');
  const bLens = el('button', 'st', 'Hold lens');
  [bFrame, bLens].forEach((b) => { b.type = 'button'; holdRow.append(b); });
  lensCell.append(holdRow);
  function setHold(which) {
    state.hold = which;
    bFrame.setAttribute('aria-current', String(which === 'framing'));
    bLens.setAttribute('aria-current', String(which === 'lens'));
    lensCell.classList.toggle('answering', which === 'framing');
    fFocal.disabled = which === 'framing';
    if (which === 'framing') syncFraming();
    compute(); view.render();
  }
  bFrame.addEventListener('click', () => setHold('framing'));
  bLens.addEventListener('click', () => setHold('lens'));

  legend(stage, [
    { c: p.marker, label: 'In focus', kind: 'line' },
    { c: p.signal, label: 'Depth limits', kind: 'dash' },
    { c: p.muted, label: 'Subject plane' },
  ]);

  /* THE THREE GATES (O1 O2 O3), ANSWERED — four cells went to two.
     Near limit and Far limit are DRAWN: the two dashed lines in the picture
     are those limits, and the legend names them. A number for each is a
     caption on a mark the picture already makes, so G2 removes both.
     Total depth stays: nobody sets it, nothing in the picture states the
     distance BETWEEN the two lines as a quantity, and it is the thing a
     photographer acts on — whether the whole face is in.
     Hyperfocal stays: it is derived, it is nowhere in the drawing, and it is
     acted on directly — focus there and everything past half of it is sharp. */
  const out = readout(fig, [
    { id: 'depth', key: 'Total depth', cls: 'hi' },
    /* THE NUMBER THAT MAKES TWO FORMATS COMPARABLE, and the one nobody is
       taught: multiply the f-number by the crop factor and you have the
       full-frame aperture that blurs the same. f/2.8 on APS-C is f/4.3 on full
       frame; f/4 on 6×7 is f/2. Nobody sets it, nothing in the drawing states
       it, and it is what a student acts on when choosing a body. */
    { id: 'equiv', key: 'Blurs like, on full frame' },
  ]);

  fsButton(stage, fig);

  [fStop, fFocal, fDist].forEach((i) => i.addEventListener('input', () => {
    state.stop = +fStop.value;
    state.focal = +fFocal.value;
    state.dist = +fDist.value;
    if (state.hold === 'framing') syncFraming();
    compute();
    view.render();
  }));

  /* ---- optics ---- */
  function limits() {
    const N = STOPS[state.stop];
    const f = state.focal;                 /* mm */
    const s = state.dist * 1000;           /* mm */
    const H = (f * f) / (N * coc()) + f;   /* hyperfocal, mm — the format's own circle of confusion */
    const near = (s * (H - f)) / (H + s - 2 * f);
    const farDen = H - s;
    const far = farDen <= 0 ? Infinity : (s * (H - f)) / farDen;
    return { N, f, s, H, near, far };
  }

  function fmt(mm) {
    if (!isFinite(mm)) return '∞';
    return mm >= 1000 ? (mm / 1000).toFixed(2) + ' m' : Math.round(mm) + ' mm';
  }

  function compute() {
    const { near, far } = limits();
    out.depth.innerHTML = isFinite(far)
      ? ((far - near) / 1000).toFixed(2) + '<span class="u">m</span>'
      : '∞';
    const eq = STOPS[state.stop] * crop();
    out.equiv.textContent = state.fmt === 'ff'
      ? 'f/' + STOPS[state.stop] + ' — it is full frame'
      : 'f/' + (eq < 10 ? eq.toFixed(1) : Math.round(eq))
        + '  (×' + crop().toFixed(2) + ')';
  }

  /* ---- drawing ---- */
  const SUBJECTS = [
    { rel: -1.6, w: 0.30, h: 0.42, tag: 'Fore' },
    { rel: 0, w: 0.42, h: 0.62, tag: 'Subject' },
    { rel: 3.2, w: 0.22, h: 0.34, tag: 'Back' },
  ];

  function blurFor(objDistM) {
    const { N, f, s } = limits();
    const o = Math.max(300, objDistM * 1000);
    /* defocus blur diameter on the sensor, mm */
    const b = Math.abs((f * f * (o - s)) / (N * o * (s - f)));
    return Math.min(26, (b / COC) * 1.5);
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const both = state.mode === 2;
    const frameH = state.mode === 0 ? h : both ? h * 0.62 : 0;
    const planTop = state.mode === 1 ? 0 : frameH;
    const planH = state.mode === 0 ? 0 : h - planTop;

    if (frameH > 0) drawFrame(ctx, w, frameH);
    if (planH > 0) {
      if (both) line(ctx, 0, planTop, w, planTop, p.rule);
      drawPlan(ctx, w, planTop, planH);
    }
  }

  function drawFrame(ctx, w, h) {
    const pad = 26;
    const fw = Math.min(w - pad * 2, (h - pad * 2) * 1.5);
    const fh = fw / 1.5;
    const x0 = (w - fw) / 2;
    const y0 = (h - fh) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, fw, fh);
    ctx.clip();
    ctx.fillStyle = p.inset;
    ctx.fillRect(x0, y0, fw, fh);

    /* ground line */
    const horizon = y0 + fh * 0.74;
    line(ctx, x0, horizon, x0 + fw, horizon, p.rule2);

    /* back to front, so nearer objects overlap */
    const order = [2, 0, 1];
    order.forEach((i) => {
      const s = SUBJECTS[i];
      const d = Math.max(0.4, state.dist + s.rel);
      const scale = state.dist / d;
      const bw = fw * s.w * scale;
      const bh = fh * s.h * scale;
      const cx = x0 + fw * (0.5 + (i - 1) * 0.26 * (0.6 + scale * 0.4));
      const by = horizon;
      const blur = blurFor(d);

      ctx.save();
      ctx.filter = blur > 0.4 ? 'blur(' + blur.toFixed(1) + 'px)' : 'none';
      ctx.strokeStyle = i === 1 ? p.marker : p.fg;
      ctx.lineWidth = i === 1 ? 1.6 : 1.2;
      ctx.fillStyle = p.inset;
      ctx.beginPath();
      ctx.rect(cx - bw / 2, by - bh, bw, bh);
      ctx.fill();
      ctx.stroke();
      /* a head, so the thing reads as a subject */
      ctx.beginPath();
      ctx.arc(cx, by - bh - bw * 0.26, bw * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      if (blur <= 0.4 || i === 1) {
        label(ctx, s.tag.toUpperCase() + ' · ' + d.toFixed(1) + ' M',
          cx, by + 16, i === 1 ? p.marker : p.muted, 9, 'center');
      }
    });
    ctx.restore();

    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x0) + 0.5, Math.round(y0) + 0.5, Math.round(fw), Math.round(fh));
    label(ctx, 'FRAME · 3:2', x0, y0 - 8, p.muted, 9);
  }

  function drawPlan(ctx, w, top, h) {
    const { near, far, H } = limits();
    const padL = 54, padR = 54;
    const axisY = top + h * 0.58;
    const maxM = Math.max(state.dist * 2.4, 6);
    const x = (m) => padL + (Math.min(m, maxM) / maxM) * (w - padL - padR);

    /* scale */
    line(ctx, padL, axisY, w - padR, axisY, p.rule2);
    for (let m = 0; m <= maxM; m += maxM > 12 ? 2 : 1) {
      const tx = x(m);
      line(ctx, tx, axisY, tx, axisY + 5, p.rule2);
      label(ctx, m + '', tx, axisY + 17, p.muted, 9, 'center');
    }
    label(ctx, 'DISTANCE · METRES', w - padR, axisY + 32, p.muted, 9, 'right');

    /* depth band */
    const nx = x(near / 1000);
    const fx = isFinite(far) ? x(far / 1000) : w - padR;
    ctx.save();
    ctx.fillStyle = p.band;
    ctx.fillRect(nx, axisY - h * 0.34, Math.max(1, fx - nx), h * 0.34);
    ctx.restore();
    line(ctx, nx, axisY - h * 0.34, nx, axisY, p.signal, [3, 3]);
    line(ctx, fx, axisY - h * 0.34, fx, axisY, p.signal, [3, 3]);

    /* subject plane */
    const sx = x(state.dist);
    line(ctx, sx, axisY - h * 0.44, sx, axisY, p.marker);
    label(ctx, 'SUBJECT', sx, axisY - h * 0.44 - 7, p.marker, 9, 'center');

    /* camera */
    ctx.save();
    ctx.strokeStyle = p.fg;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(padL - 26, axisY - 11, 20, 22);
    ctx.moveTo(padL - 6, axisY - 6);
    ctx.lineTo(padL + 2, axisY);
    ctx.lineTo(padL - 6, axisY + 6);
    ctx.stroke();
    ctx.restore();

    /* hyperfocal marker, when it is on the scale */
    const hm = H / 1000;
    if (hm <= maxM) {
      const hx = x(hm);
      line(ctx, hx, axisY - h * 0.2, hx, axisY, p.muted, [2, 4]);
      label(ctx, 'HYPERFOCAL ' + fmt(hm * 1000), hx, axisY - h * 0.2 - 6,
            p.muted, 9, 'center');
    }

    label(ctx, 'PLAN VIEW · ' + dfmt().name.toUpperCase() + ' · '
          + state.focal + ' MM'
          + (state.hold === 'framing' ? ' · LENS HELD TO THE FRAME'
                                      : ' · LENS HELD, FORMAT ONLY CROPS'),
          padL - 26, top + 20, p.muted, 9);
  }

  /* the hyperfocal is a distance and the plan draws distances, so it is
     labelled H on the axis (G2) rather than repeated in a readout cell */
  setHold(state.hold);
  compute();
  return { render: view.render };
}

window.mountDof = mountDof;
