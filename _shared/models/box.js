/* ============================================================
   The box — week 3, page 6.

   ONE THING: the room and the camera are the same object at two
   sizes. Here it is from outside: four walls, one hole in the
   front, a sheet at the back — and the two hands are the only
   two measurements a box of this kind has.

   Drawn in axonometric rather than in section, because the page
   before it is the section: seeing it as an object is what makes
   "shrink the room" a sentence about a thing you could hold.
   ============================================================ */

/* x runs across the front wall, z recedes to the upper right, so the box is
   seen from in front and a little to the left - the wall with the hole faces
   the room and the paper is visible on the far wall. */
const BOX_ISO = { x: [1, 0], y: [0, -1], z: [0.5, -0.42] };

function modelBox(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { hole: 0.5, depth: 120 };

  /* NO MEASUREMENTS ON A MODEL (13-09-2026). The two hands are named by what
     they are, and the numbers live in the Pinhole Calculator. */
  const fHole = slider(controls, {
    label: 'Size of the hole', min: 0.2, max: 3, step: 0.05, value: state.hole,
    format: () => '',
  });
  const fDepth = slider(controls, {
    label: 'Distance to the film', min: 40, max: 240, step: 2, value: state.depth,
    format: () => '',
  });

  const view = canvas(stage, draw);
  [fHole, fDepth].forEach((i) => i.addEventListener('input', () => {
    state.hole = +fHole.value;
    state.depth = +fDepth.value;
    view.render();
  }));

  function draw(ctx, w, h) { drawBox(ctx, p, w, h, state.hole, state.depth); }

  return { render: view.render };
}

/* THE DRAWING ITSELF, shared with the still version below and with the
   distance model (holelight.js): one box, drawn the same way everywhere. */
function drawBox(ctx, p, w, h, hole, depth, still) {
  {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const state = { hole: hole, depth: depth };

    /* one scale for every depth the slider can reach, so the box grows
       and the drawing does not jump */
    const unit = Math.min((w - 120) / (120 + 240 * 0.5),
                          (h - 110) / (90 + 240 * 0.42));
    const W = 120 * unit, H = 90 * unit, D = state.depth * unit;
    /* the origin is the near-bottom-left corner, and the drawing is centred on
       the widest and tallest the sliders can make it */
    const ox = (w - (W + D * 0.5)) / 2, oy = (h - 24 + H + D * 0.42) / 2;

    /* the eight corners: front face (z=0) and back face (z=D) */
    const P = (x, y, z) => [ox + x * BOX_ISO.x[0] + z * BOX_ISO.z[0],
                            oy + x * BOX_ISO.x[1] + y * BOX_ISO.y[1] + z * BOX_ISO.z[1]];
    const f1 = P(0, 0, 0), f2 = P(W, 0, 0), f3 = P(W, H, 0), f4 = P(0, H, 0);
    const b1 = P(0, 0, D), b2 = P(W, 0, D), b3 = P(W, H, D), b4 = P(0, H, D);

    const face = (a, b, c, d, fill) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]);
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      ctx.strokeStyle = p.rule2; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    };

    /* THE BOX IS DRAWN AS A CUT-AWAY, near wall first in the eye and last on
       the canvas: the back wall carries the paper, the floor and the left wall
       give it depth, and the wall with the hole is a plane you can see through,
       because the whole point is what is behind it. */
    face(b1, b2, b3, b4, p.inset);
    face(f1, b1, b4, f4, p.wash);
    face(f4, b4, b3, f3, p.wash);

    /* the sheet on the back wall */
    const m = 0.12;
    const s1 = P(W * m, H * m, D), s2 = P(W * (1 - m), H * m, D),
          s3 = P(W * (1 - m), H * (1 - m), D), s4 = P(W * m, H * (1 - m), D);
    ctx.save();
    ctx.fillStyle = p.marker;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(s1[0], s1[1]); ctx.lineTo(s2[0], s2[1]);
    ctx.lineTo(s3[0], s3[1]); ctx.lineTo(s4[0], s4[1]);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    const pTop = Math.min(s1[1], s2[1], s3[1], s4[1]);
    /* Keynote 16-09, slide 6: on the still box, "Photosensitive Material instead" */
    label(ctx, still ? 'PHOTOSENSITIVE MATERIAL' : 'THE FILM', (s1[0] + s3[0]) / 2, pTop - 8, p.marker, 9, 'center');

    /* the front wall, drawn last so it reads as the near face. Translucent
       rather than solid: solid, it hid the paper and the box read as a flat L. */
    ctx.save();
    ctx.globalAlpha = 0.72;
    face(f1, f2, f3, f4, p.stage);
    ctx.restore();
    face(f1, f2, f3, f4, null);
    const c = P(W / 2, H / 2, 0);
    const r = Math.max(1.2, (state.hole * unit) / 2);
    ctx.save();
    ctx.fillStyle = p.signal;
    ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, Math.PI * 2); ctx.fill();
    /* at a third of a millimetre the hole is smaller than a drawn dot, so it
       is also ringed — the ring says where to look, the dot is the true size */
    ctx.strokeStyle = p.signal; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(c[0], c[1], Math.max(r + 6, 9), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    label(ctx, 'THE HOLE', c[0], c[1] + Math.max(r + 6, 9) + 15, p.signal, 9, 'center');

    /* the depth, measured along the box's own bottom edge and offset clear of
         it: drawn along the top edge it ran across the paper */
    /* ...and "Remove this" twice: the still box has no depth line and no name */
    if (still) return;
    const d1 = P(W, 0, 0), d2 = P(W, 0, D);
    line(ctx, d1[0] + 12, d1[1] + 10, d2[0] + 12, d2[1] + 10, p.muted);
    label(ctx, 'TO THE FILM', (d1[0] + d2[0]) / 2 + 18,
          (d1[1] + d2[1]) / 2 + 24, p.muted, 9, 'left');
    label(ctx, 'A LIGHT-TIGHT BOX', f1[0], f1[1] + 20, p.muted, 9, 'left');
  }
}

window.modelBox = modelBox;

/* ============================================================
   THE BOX, STILL — his Keynote of 14-09-2026, slide 6: "Drawing
   version of this. Pin is smaller." The same drawing with no
   hands, beside the three things that make a camera.
   ============================================================ */
function modelBoxStill(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const view = canvas(stage, (ctx, w, h) => drawBox(ctx, p, w, h, 0.25, 120, true));
  return { render: view.render };
}
window.modelBoxStill = modelBoxStill;
