/* ============================================================
   A3.1 · Focal length and perspective
   Fixed position: the focal length crops, nothing else.
   Fixed framing: the subject stays the same size, so you walk —
   and the background changes size behind it.
   ============================================================ */

const FRAME_W = 36;            /* mm, sensor width */
const SUBJECT_H = 0.62;        /* m, head-and-shoulders */

function mountFocal(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const state = { focal: 50, mode: 1, dist: 2.4, bg: 8 };
  const view = canvas(stage, draw);

  const fFocal = slider(controls, { label: 'Focal length', min: 20, max: 200, step: 1, value: state.focal, unit: ' mm', cls: 'span1' });
  const fDist = slider(controls, { label: 'Camera distance', min: 0.8, max: 14, step: 0.1, value: state.dist, unit: ' m', decimals: 1 });
  const fBg = slider(controls, { label: 'Background distance', min: 3, max: 40, step: 0.5, value: state.bg, unit: ' m', decimals: 1 });

  states(controls, {
    label: 'Mode', cls: 'span1', items: ['Fixed position', 'Fixed framing'],
    onChange: (i) => { state.mode = i; sync(); },
  });
  const group = controls.querySelector('.states');

  legend(stage, [
    { c: p.marker, label: 'Subject', val: '0.62 m' },
    { c: p.digital, label: 'Background posts', val: '2 m' },
    { c: p.muted, label: 'Frame edge', kind: 'dash' },
  ]);

  const out = readout(fig, [
    { id: 'aov', key: 'Angle of view' },
    { id: 'dist', key: 'Distance', cls: 'hi' },
    { id: 'subj', key: 'Subject height' },
    { id: 'ratio', key: 'Background / subject', bar: true },
  ], 'four');

  fsButton(stage, fig);

  [fFocal, fDist, fBg].forEach((i) => i.addEventListener('input', () => {
    state.focal = +fFocal.value;
    state.bg = +fBg.value;
    if (state.mode === 0) state.dist = +fDist.value;
    sync();
  }));

  /* In fixed framing the distance is derived, so the slider follows. */
  function sync() {
    if (state.mode === 1) {
      /* keep the subject at 70% of frame height */
      const target = 0.70;
      const frameH = FRAME_W / 1.5;
      state.dist = (state.focal * SUBJECT_H) / (frameH * target);
      fDist.value = Math.max(+fDist.min, Math.min(+fDist.max, state.dist)).toFixed(1);
      fDist._sync();
      fDist.disabled = true;
      fDist.closest('.ctl').style.opacity = 0.5;
    } else {
      fDist.disabled = false;
      fDist.closest('.ctl').style.opacity = 1;
      state.dist = +fDist.value;
    }
    compute();
    view.render();
  }

  function aov() {
    return 2 * Math.atan(FRAME_W / (2 * state.focal)) * 180 / Math.PI;
  }

  /* projected height on the sensor, mm, for a real height at a distance */
  function proj(realM, distM) {
    return (state.focal * realM) / Math.max(0.2, distM);
  }

  function compute() {
    const frameH = FRAME_W / 1.5;
    const sh = proj(SUBJECT_H, state.dist) / frameH;
    const bh = proj(2.0, state.bg) / frameH;
    out.aov.innerHTML = aov().toFixed(0) + '<span class="u">deg</span>';
    out.dist.innerHTML = state.dist.toFixed(1) + '<span class="u">m</span>';
    out.subj.innerHTML = (sh * 100).toFixed(0) + '<span class="u">% frame</span>';
    const ratio = bh / Math.max(0.001, sh);
    out.ratio.innerHTML = ratio.toFixed(2) + '<span class="u">×</span>';
    if (out.ratio._bar) {
      out.ratio._bar.style.setProperty('--pct', Math.min(100, ratio * 45) + '%');
      out.ratio._bar.style.setProperty('--c', p.digital);
    }
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const split = Math.min(h * 0.58, h - 118);
    drawView(ctx, w, split);
    line(ctx, 0, split, w, split, p.rule);
    drawPlan(ctx, w, split, h - split);
  }

  function drawView(ctx, w, h) {
    const pad = 24;
    const fw = Math.min(w - pad * 2, (h - pad * 2) * 1.5);
    const fh = fw / 1.5;
    const x0 = (w - fw) / 2;
    const y0 = (h - fh) / 2;
    const frameHmm = FRAME_W / 1.5;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, fw, fh);
    ctx.clip();
    ctx.fillStyle = p.inset;
    ctx.fillRect(x0, y0, fw, fh);

    const ground = y0 + fh * 0.86;

    /* background posts, 2 m tall, receding */
    for (let k = 0; k < 7; k++) {
      const d = state.bg + k * (state.bg * 0.35);
      const ph = (proj(2.0, d) / frameHmm) * fh;
      const spread = (proj(3.4, d) / frameHmm) * fh;
      const cx = x0 + fw / 2 + (k - 3) * spread * 0.5;
      ctx.strokeStyle = k === 0 ? p.digital : 'rgba(63,199,214,0.35)';
      ctx.lineWidth = k === 0 ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(cx, ground);
      ctx.lineTo(cx, ground - ph);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, ground - ph, 2.4, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* subject */
    const sh = (proj(SUBJECT_H, state.dist) / frameHmm) * fh;
    const sw = sh * 0.52;
    const cx = x0 + fw / 2;
    ctx.strokeStyle = p.marker;
    ctx.lineWidth = 1.6;
    ctx.fillStyle = p.inset;
    ctx.beginPath();
    ctx.rect(cx - sw / 2, ground - sh * 0.72, sw, sh * 0.72);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, ground - sh * 0.72 - sh * 0.19, sh * 0.19, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    line(ctx, x0, ground, x0 + fw, ground, p.rule2);
    ctx.restore();

    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x0) + 0.5, Math.round(y0) + 0.5, Math.round(fw), Math.round(fh));
    label(ctx, state.focal + ' MM · ' + aov().toFixed(0) + '°', x0, y0 - 8, p.fg, 9);
    label(ctx, state.mode === 1 ? 'FIXED FRAMING' : 'FIXED POSITION', x0 + fw, y0 - 8, p.marker, 9, 'right');
  }

  function drawPlan(ctx, w, top, h) {
    const padL = 46, padR = 46;
    const axisY = top + h * 0.62;
    const maxM = Math.max(state.bg * 1.15, state.dist + 4);
    const x = (m) => padL + (Math.min(m, maxM) / maxM) * (w - padL - padR);

    line(ctx, padL, axisY, w - padR, axisY, p.rule2);
    const step = maxM > 24 ? 5 : maxM > 12 ? 2 : 1;
    for (let m = 0; m <= maxM; m += step) {
      const tx = x(m);
      line(ctx, tx, axisY, tx, axisY + 5, p.rule2);
      label(ctx, m + '', tx, axisY + 16, p.muted, 9, 'center');
    }

    /* the cone of view */
    const half = (aov() / 2) * Math.PI / 180;
    const reach = w - padR - padL;
    const spread = Math.tan(half) * reach * 0.42;
    ctx.save();
    ctx.fillStyle = p.wash;
    ctx.beginPath();
    ctx.moveTo(padL, axisY);
    ctx.lineTo(w - padR, axisY - spread);
    ctx.lineTo(w - padR, axisY + spread);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    line(ctx, padL, axisY, w - padR, axisY - spread, p.muted, [3, 3]);
    line(ctx, padL, axisY, w - padR, axisY + spread, p.muted, [3, 3]);

    /* subject and background planes */
    const sx = x(state.dist);
    line(ctx, sx, axisY - h * 0.34, sx, axisY + h * 0.2, p.marker);
    label(ctx, 'SUBJECT', sx, axisY - h * 0.34 - 6, p.marker, 9, 'center');
    const bx = x(state.bg);
    line(ctx, bx, axisY - h * 0.3, bx, axisY + h * 0.16, p.digital, [4, 3]);
    label(ctx, 'BACKGROUND', bx, axisY + h * 0.16 + 12, p.digital, 9, 'center');

    /* camera */
    ctx.save();
    ctx.strokeStyle = p.fg;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(padL - 24, axisY - 10, 18, 20);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'PLAN VIEW', padL - 24, top + 18, p.muted, 9);
  }

  [...group.children][1].click();
  sync();
  return { render: view.render };
}

window.mountFocal = mountFocal;
