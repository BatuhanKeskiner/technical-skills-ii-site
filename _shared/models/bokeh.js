/* ============================================================
   Out of focus, up close — week 3, page 34.

   ONE THING: an out-of-focus point is a picture of the opening
   itself. Bokeh is not a quality a lens has; it is the shape of
   its hole, thrown onto the film.

   The left is what the lens is doing — six blades at the chosen
   stop — and the right is a night street through it. Wide open
   the highlights are round because the barrel is the opening;
   stopped down they take the blades' corners. One hand, and it
   is the same hand as the two pages before.
   ============================================================ */

const BK_LADDER = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const BK_BLADES = 6;

function modelBokeh(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { i: 2 };
  stepper(controls, {
    label: 'Aperture', ladder: BK_LADDER, value: BK_LADDER[state.i],
    format: (v) => fStop(v),
    onChange: (v, i) => { state.i = i; view.render(); },
  });
  const view = canvas(stage, draw);

  /* the opening, drawn as a path at radius r: round wide open, and taking the
     blades' corners as it closes — the same geometry as the iris model */
  function opening(ctx, cx, cy, r, round) {
    ctx.beginPath();
    if (round > 0.92) { ctx.arc(cx, cy, r, 0, Math.PI * 2); return; }
    const rc = r / Math.cos(Math.PI / BK_BLADES);
    for (let k = 0; k <= BK_BLADES; k += 1) {
      const a = (k / BK_BLADES) * Math.PI * 2 - Math.PI / 2 + Math.PI / BK_BLADES;
      const rr = rc * (1 - round) + r * round;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const N = BK_LADDER[state.i];
    /* wide open the barrel is the opening, so the shape is round; by f/5.6 the
       blades are well in and it is a hexagon */
    const round = Math.max(0, 1 - state.i / 3);
    const pad = 30, gap = 40;
    const lw = Math.min(200, (w - pad * 2 - gap) * 0.34);
    const cx = pad + lw / 2, cy = h / 2 - 6;
    const R = Math.min(lw / 2, (h - pad * 2 - 30) / 2);
    const r = R * Math.max(0.12, (BK_LADDER[0] / N) * 0.9);

    /* the lens, from the front */
    ctx.save();
    ctx.fillStyle = p.rule2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = p.fg;
    opening(ctx, cx, cy, r, round);
    ctx.fill();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    label(ctx, fStop(N), cx, cy + R + 24, p.signal, 13, 'center');
    label(ctx, 'THE OPENING', cx, cy - R - 10, p.muted, 9, 'center');

    /* the picture: lights at night, out of focus, each one a copy of that
       opening — brighter as it narrows, because the same light is spread over
       a smaller disc */
    const px = pad + lw + gap, pw = w - px - pad, ph = Math.min(h - pad * 2, pw * 0.62);
    const py = (h - ph) / 2 - 6;
    ctx.save();
    ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
    ctx.fillStyle = p.inset; ctx.fillRect(px, py, pw, ph);
    const lights = [[0.18, 0.3, 1], [0.34, 0.58, 0.8], [0.52, 0.24, 0.9],
                    [0.63, 0.66, 0.7], [0.78, 0.38, 1], [0.88, 0.7, 0.6],
                    [0.26, 0.8, 0.5], [0.7, 0.86, 0.45]];
    const size = (r / R) * ph * 0.3 + 6;
    lights.forEach((L, i) => {
      const x = px + pw * L[0], y = py + ph * L[1];
      ctx.save();
      ctx.globalAlpha = 0.25 + 0.65 * L[2] * (1 - (r / R) * 0.5);
      ctx.fillStyle = i % 3 === 0 ? p.marker : (i % 3 === 1 ? p.fg : p.cinema);
      opening(ctx, x, y, size * (0.7 + L[2] * 0.5), round);
      ctx.fill();
      ctx.restore();
    });
    /* one thing in focus, so the blur has something to be out of focus against */
    ctx.save();
    ctx.strokeStyle = p.fg; ctx.lineWidth = 2;
    ctx.strokeRect(px + pw * 0.08, py + ph * 0.52, pw * 0.16, ph * 0.4);
    ctx.restore();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(px) + 0.5, Math.round(py) + 0.5, Math.round(pw), Math.round(ph));
    ctx.restore();
    label(ctx, 'LIGHTS BEHIND THE SUBJECT', px, py - 10, p.muted, 9, 'left');
    label(ctx, round > 0.6 ? 'ROUND — THE BARREL IS THE OPENING'
                           : 'SIX-SIDED — THE BLADES ARE THE OPENING',
          px + pw, py + ph + 16, p.signal, 9, 'right');
  }

  return { render: view.render };
}

window.modelBokeh = modelBokeh;
