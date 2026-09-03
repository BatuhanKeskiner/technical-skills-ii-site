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
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const state = { stop: 2, focal: 85, dist: 3.0, mode: 0 };

  const view = canvas(stage, draw);

  const fStop = slider(controls, {
    label: 'Aperture', min: 0, max: STOPS.length - 1, step: 1, value: state.stop,
    format: (v) => 'f/' + STOPS[v],
  });
  const fFocal = slider(controls, { label: 'Focal length', min: 24, max: 200, step: 1, value: state.focal, unit: ' mm' });
  const fDist = slider(controls, { label: 'Subject distance', min: 0.6, max: 12, step: 0.1, value: state.dist, unit: ' m', decimals: 1 });

  states(controls, {
    label: 'View', cls: 'span1', items: ['Frame', 'Plan', 'Both'],
    onChange: (i) => { state.mode = i; view.render(); },
  });
  const stateGroup = controls.querySelector('.states');

  legend(stage, [
    { c: p.marker, label: 'In focus', kind: 'line' },
    { c: p.signal, label: 'Depth limits', kind: 'dash' },
    { c: p.muted, label: 'Subject plane' },
  ]);

  const out = readout(fig, [
    { id: 'near', key: 'Near limit' },
    { id: 'far', key: 'Far limit' },
    { id: 'depth', key: 'Total depth', cls: 'hi' },
    { id: 'hyper', key: 'Hyperfocal' },
  ], 'four');

  fsButton(stage, fig);

  [fStop, fFocal, fDist].forEach((i) => i.addEventListener('input', () => {
    state.stop = +fStop.value;
    state.focal = +fFocal.value;
    state.dist = +fDist.value;
    compute();
    view.render();
  }));

  /* ---- optics ---- */
  function limits() {
    const N = STOPS[state.stop];
    const f = state.focal;                 /* mm */
    const s = state.dist * 1000;           /* mm */
    const H = (f * f) / (N * COC) + f;     /* hyperfocal, mm */
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
    const { H, near, far } = limits();
    out.near.textContent = fmt(near);
    out.far.textContent = fmt(far);
    out.depth.innerHTML = isFinite(far)
      ? ((far - near) / 1000).toFixed(2) + '<span class="u">m</span>'
      : '∞';
    out.hyper.textContent = fmt(H);
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
      label(ctx, 'H', hx, axisY - h * 0.2 - 6, p.muted, 9, 'center');
    }

    label(ctx, 'PLAN VIEW', padL - 26, top + 20, p.muted, 9);
  }

  [...stateGroup.children][2].click();
  compute();
  return { render: view.render };
}

window.mountDof = mountDof;
