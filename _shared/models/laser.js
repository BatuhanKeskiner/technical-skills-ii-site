/* ============================================================
   The rings on the wall — week 3, page 43.

   ONE THING: the diffraction that stops a hole being made ever
   smaller is the same diffraction that lets you measure it. A
   laser through the hole throws rings on the wall, and the first
   dark ring gives the width back:

       d = 1.22 · λ · L / r

   The pattern is drawn from that formula at the two lengths in
   the student's hands, so the ring on the drawing is the ring
   they will measure in the corridor — including the part where a
   short corridor makes the rings too small to read with a ruler.

   Numbers checked in _notes/PINHOLE-RESEARCH.md §1.
   ============================================================ */

const LZ_LAMBDA = 0.00065;             /* a red pointer, in millimetres */

function modelLaser(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { hole: 0.3, wall: 10 };
  const fHole = slider(controls, {
    label: 'The hole', min: 0.1, max: 0.8, step: 0.01, value: state.hole,
    unit: ' mm', decimals: 2,
  });
  const fWall = slider(controls, {
    label: 'How far the wall is', min: 1, max: 15, step: 0.5, value: state.wall,
    unit: ' m', decimals: 1,
  });
  const view = canvas(stage, draw);
  [fHole, fWall].forEach((i) => i.addEventListener('input', () => {
    state.hole = +fHole.value;
    state.wall = +fWall.value;
    view.render();
  }));

  /* the first dark ring, in millimetres on the wall */
  const ring = () => (1.22 * LZ_LAMBDA * state.wall * 1000) / state.hole;

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 30;
    const wallX = w * 0.52;
    const midY = (h - 30) / 2;

    /* the pointer, the hole, and the beam between them */
    const px = pad + 10;
    ctx.save();
    ctx.fillStyle = p.rule2;
    ctx.fillRect(px, midY - 7, 54, 14);
    ctx.restore();
    label(ctx, 'RED LASER', px, midY - 14, p.muted, 9, 'left');
    const hx = wallX - (w * 0.52 - px - 54) * 0.45;
    line(ctx, px + 54, midY, hx, midY, p.signal);
    ctx.save();
    ctx.strokeStyle = p.fg; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx, midY - 46); ctx.lineTo(hx, midY - 3);
    ctx.moveTo(hx, midY + 3); ctx.lineTo(hx, midY + 46);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'YOUR HOLE', hx, midY + 60, p.muted, 9, 'center');

    /* the cone of the first ring, drawn at its true half-angle */
    const theta = Math.atan((ring() / 1000) / state.wall);
    const span = wallX - hx;
    const rPx = Math.tan(theta) * span;
    line(ctx, hx, midY, wallX, midY - rPx, p.signal, [4, 4]);
    line(ctx, hx, midY, wallX, midY + rPx, p.signal, [4, 4]);

    /* the wall, and the pattern on it — drawn at the scale the ring's own
       radius sets, so a distant wall really does give a bigger ring */
    const wx = wallX + 10, ww = w - wx - pad;
    const cy = midY, cx = wx + ww / 2;
    /* millimetres on the wall to pixels, fixed: the widest ring the two
       sliders can make is a tenth of a millimetre at fifteen metres, and it is
       what the panel is sized against. Everything smaller is smaller here too,
       which is the point of the page. */
    const WIDEST = (1.22 * LZ_LAMBDA * 15 * 1000) / 0.1;
    const perMM = Math.min(ww / 2, (h - 96) / 2) * 0.94 / WIDEST;
    ctx.save();
    ctx.beginPath(); ctx.rect(wx, pad, ww, h - pad - 46); ctx.clip();
    ctx.fillStyle = p.inset; ctx.fillRect(wx, pad, ww, h - pad - 46);
    const R1 = Math.max(3, ring() * perMM);
    /* the bright middle and the rings outside it, falling away */
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R1);
    g.addColorStop(0, p.signal);
    g.addColorStop(0.75, p.signal);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R1, 0, Math.PI * 2); ctx.fill();
    [1.63, 2.23, 2.68].forEach((k, i) => {
      ctx.save();
      ctx.globalAlpha = 0.5 / (i + 1.6);
      ctx.strokeStyle = p.signal;
      ctx.lineWidth = Math.max(1.5, R1 * 0.18);
      ctx.beginPath(); ctx.arc(cx, cy, R1 * k, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    /* the first dark ring, which is the thing being measured */
    ctx.save();
    ctx.strokeStyle = p.fg; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(cx, cy, R1, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    ctx.restore();

    /* the ruler across it, because that is how the number is got */
    const ry = h - 40;
    line(ctx, cx - R1, ry, cx + R1, ry, p.fg);
    line(ctx, cx - R1, ry - 5, cx - R1, ry + 5, p.fg);
    line(ctx, cx + R1, ry - 5, cx + R1, ry + 5, p.fg);
    /* HIS QUESTION, 16-09-2026, slide 41: "Is this information and calculation
       true?" The arithmetic is right and the words were not. 1.22 λ L / d is the
       RADIUS of the first dark ring, not its width: a 0.30 mm hole at 10 m with a
       red pointer gives 26 mm from the middle of the spot to the first dark ring,
       and 53 mm across it. The measurement the page asks for is the radius,
       because that is what the sum takes back: d = 1.22 λ L / r. */
    label(ctx, ring() < 4 ? 'TOO SMALL TO MEASURE — WALK FURTHER BACK'
                          : ring().toFixed(0) + ' MM FROM THE MIDDLE TO THE FIRST DARK RING',
          cx, ry - 12, ring() < 4 ? p.signal : p.fg, 10, 'center');
    label(ctx, 'THE WALL, ' + state.wall.toFixed(1) + ' M AWAY', wx, pad - 12, p.muted, 9, 'left');
  }

  return { render: view.render };
}

window.modelLaser = modelLaser;
