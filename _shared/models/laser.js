/* ============================================================
   The rings on the wall — week 3, page 43.

   ONE THING: the diffraction that stops a hole being made ever
   smaller is the same diffraction that lets you measure it. A
   laser through the hole throws rings on the wall, and the first
   dark ring gives the width back:

       d = 1.22 · λ · L / r

   THE TWO THINGS IN THE STUDENT'S HANDS ARE THE TWO THINGS THEY
   CAN MEASURE (his word, 20-09-2026: "mesafeyi ve ölçülen
   uzunluğun verilip deliğin boyunun tespit edilmesi daha
   mantıklı"). So the hands are the distance to the wall and the
   ring measured ACROSS with a ruler — his own sentence names the
   diameter, and a ruler laid across the ring is what anybody
   actually does — so the sum here is d = 2.44 · λ · L / D, the
   same formula with the radius written as half the diameter.
   The hole is what the drawing answers with, which is the way
   round it happens in the corridor, where nobody knows the hole
   yet.
   A short corridor still tells on itself: the ring goes too
   small to read, and the answer with it.

   Numbers checked in _notes/PINHOLE-RESEARCH.md §1.
   ============================================================ */

const LZ_LAMBDA = 0.00065;             /* a red pointer, in millimetres */

function modelLaser(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { wall: 10, ring: 53 };
  const fWall = slider(controls, {
    label: 'How far the wall is', min: 1, max: 15, step: 0.5, value: state.wall,
    unit: ' m', decimals: 1,
  });
  const fRing = slider(controls, {
    label: 'What the ruler says · across the first dark ring',
    min: 2, max: 240, step: 1, value: state.ring, unit: ' mm',
  });
  const view = canvas(stage, draw);
  [fWall, fRing].forEach((i) => i.addEventListener('input', () => {
    state.wall = +fWall.value;
    state.ring = +fRing.value;
    view.render();
  }));

  /* the ring measured across, in millimetres, and its radius */
  const across = () => state.ring;
  const ring = () => state.ring / 2;
  /* and the hole it gives back: d = 2.44 · λ · L / D */
  const hole = () => (2.44 * LZ_LAMBDA * state.wall * 1000) / state.ring;

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
    /* THE ANSWER IS ON THE HOLE, because the hole is the thing being found.
       A model carries no readout row, so the number stands on the drawing. */
    label(ctx, 'YOUR HOLE', hx, midY + 60, p.muted, 9, 'center');
    const d = hole();
    label(ctx, d < 0.01 ? '—' : (d < 1 ? d.toFixed(2) : d.toFixed(1)) + ' mm',
          hx, midY + 92, p.signal, 26, 'center');
    label(ctx, 'd = 2.44 · λ · L ÷ D', hx, midY + 112, p.muted, 9, 'center');

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
    const WIDEST = 120;                       /* half the widest the ruler hand goes */
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
    label(ctx, across() < 8 ? across().toFixed(0) + ' MM ACROSS — TOO SMALL TO READ, WALK FURTHER BACK'
                            : across().toFixed(0) + ' MM ACROSS THE FIRST DARK RING',
          cx, ry - 12, across() < 8 ? p.signal : p.fg, 10, 'center');
    label(ctx, 'THE WALL, ' + state.wall.toFixed(1) + ' M AWAY', wx, pad - 12, p.muted, 9, 'left');
  }

  return { render: view.render };
}

window.modelLaser = modelLaser;
