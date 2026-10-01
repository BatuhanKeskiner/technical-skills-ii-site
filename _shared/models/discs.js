/* ============================================================
   Pinhole diameter — week 3.

   ONE THING: a hole does not focus. Every point of the subject
   arrives as a disc as wide as the hole, and the picture is the
   sum of the overlapping discs.

   BACK TO THE FIRST DRAWING, on his word, 13-09-2026: the round
   view of the film at ten times, with the two discs falling on
   the same place and adding up. The square version that replaced
   it is kept at _notes/_old-versions/discs.js.square-version.

   Two points are drawn rather than one, because the lesson is
   what happens when their discs meet: wide open they overlap
   into one smear, and closing the hole separates them.
   ============================================================ */

function modelDiscs(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* ONE DRAWING, TWO HANDS. His word, 16-09-2026: the distance page is not a
     second instrument, it is this one with the film moving instead of the hole
     changing - "hole diameter'ın mesafeli varyasyonu". The page says which hand
     it wants and everything else is identical, so the two pages read as the
     same picture seen twice. */
  const far = fig.getAttribute('data-hand') === 'distance';
  const state = { hole: far ? 0.7 : 0.6, dist: 0.35 };
  /* named, not measured: a model shows a relation (13-09-2026) */
  const fHand = slider(controls, far ? {
    label: 'Distance from the hole to the film', min: 0, max: 1, step: 0.01,
    value: state.dist, format: () => '',
  } : {
    label: 'Size of the hole', min: 0.1, max: 2, step: 0.02, value: state.hole,
    format: () => '',
  });
  const view = canvas(stage, draw);
  fHand.addEventListener('input', () => {
    if (far) state.dist = +fHand.value; else state.hole = +fHand.value;
    view.render();
  });

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const padL = 40, padR = 40, padT = 34, padB = 40;
    /* HIS KEYNOTE OF 14-09-2026, slide 12: the close-up bigger and centred
       in its own half, and the landing on the film drawn the way the close-up
       draws it.
       AND THE SPACE RULE, 16-09: the section was measured from the left margin
       and the close-up given whatever was left, so the two points sat on the
       very edge of the stage, the rays crossed a wide empty middle and the
       circle grew to fill a third of the panel by itself. Section and close-up
       are sized against each other now and placed as ONE block, centred: what
       is over is margin on both sides. */
    const midY = padT + (h - padT - padB) / 2;
    const inner = w - padL - padR;
    const tall = h - padT - padB;
    const glass = Math.min(tall * 0.84, inner * 0.28);   /* the close-up circle */
    const gap = Math.min(70, inner * 0.05);
    /* CLOSER AND BIGGER, his note of 16-09 on this page: the two points were
       moved together but drawn smaller, and the run-in to the hole was longer
       than before, so the left half of the stage stood empty and the subject
       read as two pinpricks. The section is shorter now, the points stand in
       from the edge, and they are drawn at a size that carries to the back of
       the room. */
    const secW = Math.min(inner - glass - gap, tall * 1.7);
    const x0 = padL + Math.max(0, (inner - (secW + gap + glass)) / 2);
    const sx = x0 + secW * 0.06;                    /* the subject */
    const hx = x0 + secW * 0.58;                    /* the hole */
    /* the film stands at the end of the section - or, on the distance page,
       travels back from the hole with the hand. Room for its whole travel is
       kept either way, so nothing else moves (C9, S18). */
    const fx = far ? hx + (x0 + secW - hx) * (0.22 + state.dist * 0.78)
                   : x0 + secW;
    /* BIGGER, and he has now said it twice: "Make these objects closer and
       bigger." Moved together but drawn smaller than before is not what was
       asked; these read from the back of the room. */
    const dot = Math.max(10, tall * 0.036);         /* the points themselves */
    /* HIS SECOND ROUND, 16-09-2026, slide 13: "Make these objects closer and
       bigger so this illustration would make more sense visually." Two points
       far apart read as two separate drawings; close together they are one
       subject whose discs can meet, which is what the page is about. */
    const spread = (h - padT - padB) * 0.17;

    const pts = [
      { y: midY - spread, col: p.marker },
      { y: midY + spread * 0.55, col: p.digital },
    ];
    const mm = 26;                                  /* pixels per millimetre in the section */
    const half = Math.max(1, (state.hole * mm) / 2);

    pts.forEach((q) => {
      /* the two edge rays: from the point, through the rim of the hole, on to
         the film. Where they land is the disc that point makes. */
      const land = (edge) => q.y + (edge - q.y) * ((fx - sx) / (hx - sx));
      const top = land(midY - half), bot = land(midY + half);
      ctx.save();
      ctx.fillStyle = q.col;
      ctx.globalAlpha = 0.16;
      ctx.beginPath();
      ctx.moveTo(sx, q.y);
      ctx.lineTo(hx, midY - half);
      ctx.lineTo(fx, top);
      ctx.lineTo(fx, bot);
      ctx.lineTo(hx, midY + half);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      /* the ray through the middle of the hole, so the point and its landing
         are visibly joined even when the hole is a pinprick */
      line(ctx, sx, q.y, hx, midY, q.col);
      line(ctx, hx, midY, fx, (top + bot) / 2, q.col);
      /* where it lands: a soft disc as wide as the hole, drawn like the close-up */
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const rr = Math.max(3, (bot - top) / 2);
      const gg = ctx.createRadialGradient(fx, (top + bot) / 2, 0, fx, (top + bot) / 2, rr);
      gg.addColorStop(0, q.col);
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(fx, (top + bot) / 2, rr, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = q.col;
      ctx.beginPath(); ctx.arc(sx, q.y, dot, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      q.top = top; q.bot = bot;
    });

    /* the wall with the hole in it */
    line(ctx, hx, padT, hx, midY - half, p.fg);
    line(ctx, hx, midY + half, hx, h - padB, p.fg);
    label(ctx, 'THE HOLE', hx, h - padB + 16, p.muted, 9, 'center');

    /* the film */
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(Math.round(fx) + 0.5, padT);
    ctx.lineTo(Math.round(fx) + 0.5, h - padB);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'THE FILM', fx, h - padB + 16, p.muted, 9, 'center');
    label(ctx, 'TWO POINTS OF THE SUBJECT', x0, padT - 12, p.muted, 9, 'left');

    /* THE FILM, CLOSE UP. The discs are the hole's own width, so at the scale
       of the section they are a line thick; this is where the overlap can be
       seen, and the overlap is the whole lesson. */
    const gx = fx + gap + glass / 2, gy = midY, gr = glass / 2;
    ctx.save();
    ctx.fillStyle = p.inset;
    ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.stroke();
    ctx.clip();
    /* the close-up shows the disc that actually LANDS, which is the hole
       widened by how far the film stands behind it - so it grows on the
       distance page as well as on the hole page */
    const MAG = gr / 15;
    const landDia = state.hole * mm * ((fx - sx) / (hx - sx));
    const dr = (landDia * MAG) / 2;
    pts.forEach((q) => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const cy = gy + ((q.top + q.bot) / 2 - midY) * (gr / 200);
      const g = ctx.createRadialGradient(gx, cy, 0, gx, cy, Math.max(2, dr));
      g.addColorStop(0, q.col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(gx, cy, Math.max(2, dr), 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    ctx.restore();
    /* no words under the close-up: his note of 14-09 */
  }

  return { render: view.render };
}

window.modelDiscs = modelDiscs;
