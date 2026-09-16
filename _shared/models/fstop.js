/* ============================================================
   One stop at a time — week 3.

   ONE THING: each step of the aperture halves the light, and the
   numbers look arbitrary only until you see that they are widths
   and the light is an area.

   HIS KEYNOTE OF 14-09-2026, slide 22: "Instead of showing all
   just show one stop below and above. Make that animated so we
   see the growth." So three openings: the one before, this one,
   the one after — and when the stop changes, the middle one
   grows or shrinks to its new size rather than jumping.
   ============================================================ */

const FS_LADDER = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

function modelFstop(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { i: 3, from: 3, t0: 0 };       /* f/4 */
  stepper(controls, {
    label: 'Aperture', ladder: FS_LADDER, value: FS_LADDER[state.i],
    format: (v) => fStop(v),
    onChange: (v, i) => { state.from = state.i; state.i = i; state.t0 = performance.now(); animate(); },
  });
  const view = canvas(stage, draw);

  const F = 50;                                  /* a 50 mm lens */
  const wide = F / FS_LADDER[0];                 /* the widest opening */
  const width = (i) => F / FS_LADDER[i] / wide;  /* as a share of the widest */

  let raf = 0;
  function animate() {
    cancelAnimationFrame(raf);
    const step = () => {
      view.render();
      if (performance.now() - state.t0 < 520) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  const ease = (k) => 1 - Math.pow(1 - k, 3);

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 34;
    const k = ease(Math.min(1, (performance.now() - state.t0) / 520));
    /* the three columns: before, this, after. Each opening drawn at its true
       width against the widest; the middle one is on its way from the stop
       it just left. */
    const cols = [state.i - 1, state.i, state.i + 1];
    const cw = (w - pad * 2) / 3;
    const R = Math.min(cw / 2 - 20, (h - pad * 2 - 90) / 2);
    const cy = pad + R + 10;

    cols.forEach((idx, c) => {
      const cx = pad + cw * c + cw / 2;
      if (idx < 0 || idx >= FS_LADDER.length) {
        label(ctx, c === 0 ? 'WIDE OPEN' : 'NO SMALLER ON THIS LENS', cx, cy + 4, p.muted, 9, 'center');
        return;
      }
      let share = width(idx);
      if (c === 1) share = width(state.from) + (width(state.i) - width(state.from)) * k;
      const r = Math.max(1.5, R * share);
      const here = c === 1;
      ctx.save();
      ctx.fillStyle = here ? p.fg : p.rule2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      /* the widest opening as a ring behind each, so the three read against
         one scale */
      ctx.save();
      ctx.strokeStyle = p.rule2; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      label(ctx, fStop(FS_LADDER[idx]), cx, cy + R + 26, here ? p.signal : p.muted, here ? 14 : 11, 'center');
      /* the light each one lets in, as a bar: the area, which halves a step */
      const light = Math.pow(share, 2);
      const bw = cw - 40;
      ctx.save();
      ctx.fillStyle = here ? p.signal : p.rule2;
      ctx.fillRect(cx - bw / 2, cy + R + 40, Math.max(1.5, bw * light), 8);
      ctx.restore();
    });
    label(ctx, 'ONE STOP WIDER', pad + cw / 2, pad - 10, p.muted, 9, 'center');
    label(ctx, 'THIS STOP', pad + cw * 1.5, pad - 10, p.muted, 9, 'center');
    label(ctx, 'ONE STOP NARROWER', pad + cw * 2.5, pad - 10, p.muted, 9, 'center');
    label(ctx, 'THE LIGHT EACH ONE LETS IN', w / 2, cy + R + 62, p.muted, 9, 'center');
  }

  return { render: view.render };
}

window.modelFstop = modelFstop;
