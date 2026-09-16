/* ============================================================
   The blades — week 3.

   ONE THING: the aperture in a lens is a ring of blades, and the
   hole they leave closes from the whole barrel down to a small
   many-sided opening.

   HIS KEYNOTE OF 14-09-2026, slide 18: "I want this motion and
   slider exactly. Watch the video." The film: a dark ring on a
   light ground, six blades drawn as thin curved outlines, the
   opening round when wide, turning and tightening to a small
   hexagon as the slider moves right.

   How it is drawn: the opening is a six-sided shape whose sides
   bow outward when it is wide (so it reads round) and flatten
   as it closes, and it turns as it closes. Each side belongs to
   one blade; that blade's edge carries on past the corner and
   curves out to its pivot on the ring. Those six curves are the
   blades.
   ============================================================ */

const IR_LADDER = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const IR_BLADES = 6;

function modelIris(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* a slider: what this shows is a movement (his note of 13-09-2026) */
  const state = { t: 0 };
  const fOpen = slider(controls, {
    label: 'Aperture', min: 0, max: 1, step: 0.005, value: state.t,
    format: (v) => fStop(IR_LADDER[0] * Math.pow(2, v * (IR_LADDER.length - 1) / 2)),
  });
  const view = canvas(stage, draw);
  fOpen.addEventListener('input', () => { state.t = +fOpen.value; view.render(); });

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const N = IR_LADDER[0] * Math.pow(2, state.t * (IR_LADDER.length - 1) / 2);
    const R = Math.min((h - 70) / 2, (w - 60) / 2, 230);
    const cx = w / 2, cy = (h - 26) / 2;
    const inner = R * 0.8;
    /* the opening's radius follows the f-number, so f/2.8 is half f/1.4 */
    const o = IR_LADDER[0] / N;                  /* 1 wide open .. 0.06 shut */
    const r = inner * Math.max(0.035, o);
    const rot = (1 - o) * 1.05;                  /* it turns as it closes */
    const phi = (k) => (k / IR_BLADES) * Math.PI * 2 - Math.PI / 2 + rot;
    const V = (k) => [cx + Math.cos(phi(k)) * r, cy + Math.sin(phi(k)) * r];

    /* THE METAL IS THE COLOUR OF THE GROUND, AND THE HOLE IS THE DARK PART.
       His round of 16-09-2026, on this page: "Get rid of this black line" ·
       "Make the same colour of the background." The blades were drawn as one
       black disc with the opening cut out of it, so the instrument read as a
       black hole in the page and the thing the page is about - the opening -
       was the same colour as the paper. It is the other way round now, which
       is also how an iris photographs: the blades take the ground, a faint
       edge says where the barrel ends, and the opening is dark. */
    const half = Math.PI / IR_BLADES;
    const bow = r * Math.cos(half) + o * o * (2 * r - 2 * r * Math.cos(half));
    /* AND IT IS BACK THE WAY IT WAS. Drawing the blades in the ground and the
       opening dark answered his "make the same colour of the background" to the
       letter and made a worse picture: "Iris'in siyah olması da mantıklı değil,
       önceki hali daha doğruydu" (16-09-2026). The hole is where the light goes
       through, so the hole is the bright part and the metal is dark. His word
       stands over my reading of the earlier note. */
    const v0 = V(0);
    ctx.save();
    ctx.fillStyle = p.fg;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.moveTo(v0[0], v0[1]);
    for (let k = 0; k < IR_BLADES; k += 1) {
      const a = phi(k) + half, v1 = V(k + 1);
      ctx.quadraticCurveTo(cx + Math.cos(a) * bow, cy + Math.sin(a) * bow, v1[0], v1[1]);
    }
    ctx.closePath();
    ctx.fill('evenodd');
    ctx.restore();

    /* the six blade edges: from each corner, carrying on the line of the side
       that ends there, and curving out to a pivot on the ring */
    ctx.save();
    /* only on the metal: the ring with the opening cut out, so no edge is
       ever drawn across the hole the light comes through */
    ctx.beginPath();
    ctx.arc(cx, cy, R - 1, 0, Math.PI * 2);
    ctx.moveTo(v0[0], v0[1]);
    for (let k = 0; k < IR_BLADES; k += 1) {
      const a = phi(k) + half, v1 = V(k + 1);
      ctx.quadraticCurveTo(cx + Math.cos(a) * bow, cy + Math.sin(a) * bow, v1[0], v1[1]);
    }
    ctx.closePath();
    ctx.clip('evenodd');
    ctx.strokeStyle = p.muted; ctx.lineWidth = 1.1; ctx.globalAlpha = 0.75;
    for (let k = 0; k < IR_BLADES; k += 1) {
      const a = V(k), b = V(k + 1);
      let tx = a[0] - b[0], ty = a[1] - b[1];
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const endA = phi(k) - 1.25 - (1 - o) * 0.35;
      const ex = cx + Math.cos(endA) * R * 0.9, ey = cy + Math.sin(endA) * R * 0.9;
      const L = (R - r) * 0.55;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(a[0] + tx * L, a[1] + ty * L, ex, ey);
      ctx.stroke();
    }
    /* the inside edge of the ring, faint, so the blades read as sitting in it */
    ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    /* the pivots */
    for (let k = 0; k < IR_BLADES; k += 1) {
      const endA = phi(k) - 1.25 - (1 - o) * 0.35;
      ctx.save();
      ctx.strokeStyle = p.muted; ctx.lineWidth = 1; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(cx + Math.cos(endA) * R * 0.9, cy + Math.sin(endA) * R * 0.9, 3, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    label(ctx, fStop(N), cx, cy + R + 22, p.signal, 14, 'center');
  }

  return { render: view.render };
}

window.modelIris = modelIris;
