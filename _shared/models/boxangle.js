/* ============================================================
   How much of the room fits — week 3, focal length.

   ONE THING: the angle of view is not a property of a lens. It
   is two lengths — how wide the film is, and how far it is from
   the hole — and in a box you can change the second one with a
   pair of scissors.

   His round of 13-09, 23:55: "film boyutunu biraz küçült.
   Objeleri karede görebilelim. Sonucu da the room olarak değil
   sağda bir görüntü olarak ver kare şekilde." So: the room is a
   square scene on the left with things in it, the picture the
   camera takes is a SQUARE PICTURE on the right — the piece of
   the room the cone reaches, blown up to the film — and the
   section beneath is at true proportion with a small film.
   ============================================================ */

function modelBoxAngle(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* KEYNOTE 16-09, slide 26: "Also add another slider to make film smaller."
     The second length of the angle of view is a hand now too. */
  /* "Objeleri karede görebilelim" - his round of 16-09-2026, 22:04, again.
     At 50 mm the cone took 30% of the room and the picture was one ball; a
     shorter box opens the view to about half the room, so the ball, the box
     and the cone are all in the frame when the page opens. */
  const state = { depth: 28, film: 36 };
  const fDepth = slider(controls, {
    label: 'Distance to the film', min: 18, max: 150, step: 1, value: state.depth,
    format: () => '',
  });
  const fFilm = slider(controls, {
    label: 'Size of the film', min: 8, max: 36, step: 1, value: state.film,
    format: () => '',
  });
  const view = canvas(stage, draw);
  fDepth.addEventListener('input', () => { state.depth = +fDepth.value; view.render(); });
  fFilm.addEventListener('input', () => { state.film = +fFilm.value; view.render(); });

  const ROOM = 100 * Math.PI / 180;  /* the room square spans 100 degrees */

  /* the room, drawn once into its own square so the picture on the right can
     be the same drawing under a crop rather than a second one */
  const off = document.createElement('canvas');
  function room(S) {
    off.width = S; off.height = S;
    const c = off.getContext('2d');
    c.fillStyle = p.inset; c.fillRect(0, 0, S, S);
    const horizon = S * 0.6;
    const sq = S / 12;
    for (let i = 0; i < 12; i += 1) {
      for (let j = 0; horizon + j * sq * 0.5 < S; j += 1) {
        if ((i + j) % 2) continue;
        c.fillStyle = p.wash;
        c.fillRect(i * sq, horizon + j * sq * 0.5, sq, sq * 0.5);
      }
    }
    c.strokeStyle = p.rule2; c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, horizon); c.lineTo(S, horizon); c.stroke();
    /* the things in the room: a ball in the middle, a box, a cone; and a
       window high up, so the edges of the room are things too */
    c.fillStyle = p.marker;
    c.beginPath(); c.arc(S * 0.5, horizon - S * 0.07, S * 0.07, 0, Math.PI * 2); c.fill();
    c.fillStyle = p.digital;
    c.fillRect(S * 0.28, horizon - S * 0.14, S * 0.1, S * 0.14);
    c.fillStyle = p.cinema;
    c.beginPath();
    c.moveTo(S * 0.66, horizon); c.lineTo(S * 0.7, horizon - S * 0.2); c.lineTo(S * 0.74, horizon); c.closePath(); c.fill();
    c.strokeStyle = p.rule2; c.lineWidth = 2;
    c.strokeRect(S * 0.12, S * 0.14, S * 0.16, S * 0.22);
    c.strokeRect(S * 0.72, S * 0.14, S * 0.16, S * 0.22);
    c.fillStyle = p.film;
    c.beginPath(); c.arc(S * 0.5, S * 0.22, S * 0.05, 0, Math.PI * 2); c.fill();
    return off;
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 28;
    const FILM = state.film;
    const aov = 2 * Math.atan((FILM / 2) / state.depth);
    const share = Math.min(1, Math.tan(aov / 2) / Math.tan(ROOM / 2));

    /* two squares on the top row, the section beneath them */
    const secH = Math.max(120, h * 0.36);
    const S = Math.min(h - pad * 2 - secH - 30, (w - pad * 2) / 2 - 60);
    const top = pad + 12;
    const gap = Math.min(160, (w - pad * 2 - S * 2) / 2);
    const lx = w / 2 - gap / 2 - S;
    const rx = w / 2 + gap / 2;

    /* THE ROOM */
    const src = room(Math.round(S * 2));
    ctx.drawImage(src, lx, top, S, S);
    const cw = S * share;
    ctx.save();
    ctx.strokeStyle = p.signal; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.strokeRect(Math.round(lx + (S - cw) / 2) + 0.5, Math.round(top + (S - cw) / 2) + 0.5, Math.round(cw), Math.round(cw));
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(lx) + 0.5, Math.round(top) + 0.5, Math.round(S), Math.round(S));
    ctx.restore();
    label(ctx, 'THE ROOM', lx, top - 10, p.muted, 9, 'left');

    /* WHAT THE CAMERA TAKES: the piece inside the cone, filling the film */
    const sw = src.width * share;
    ctx.save();
    ctx.beginPath(); ctx.rect(rx, top, S, S); ctx.clip();
    ctx.drawImage(src, (src.width - sw) / 2, (src.height - sw) / 2, sw, sw, rx, top, S, S);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = p.signal; ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(rx) + 0.5, Math.round(top) + 0.5, Math.round(S), Math.round(S));
    ctx.restore();
    label(ctx, 'WHAT THE CAMERA TAKES', rx, top - 10, p.signal, 9, 'left');
    /* the arrow between them */
    const ay = top + S / 2;
    line(ctx, lx + S + 14, ay, rx - 14, ay, p.muted, [3, 3]);

    /* the section: the hole, the film behind it, the cone between them */
    const secTop = top + S + 34;
    /* one scale for every film the hand allows, so the section does not jump */
    const unit = Math.min((w - pad * 2) * 0.4 / 150, (secH - 36) / 36 / 1.2);
    const hx = pad + (w - pad * 2) * 0.5;
    const midY = secTop + secH / 2;
    const px = hx + state.depth * unit;
    const half = (FILM * unit) / 2;
    /* HIS SECOND ROUND, 16-09-2026, slide 28: "Don't change the size of the box,
       only film." The box is the camera you are holding and it does not grow
       when a smaller film goes into it; the film is the thing that changes.
       So the body is drawn at the widest film the hand allows, and the film
       itself is the short line at the back. */
    const boxHalf = (36 * unit) / 2;

    ctx.save();
    ctx.fillStyle = p.inset;
    ctx.fillRect(hx, midY - boxHalf, px - hx, boxHalf * 2);
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(hx) + 0.5, Math.round(midY - boxHalf) + 0.5, Math.round(px - hx), Math.round(boxHalf * 2));
    ctx.restore();
    /* the film across the back of it */
    ctx.save();
    ctx.strokeStyle = p.film || p.signal; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.round(px) + 0.5, Math.round(midY - half));
    ctx.lineTo(Math.round(px) + 0.5, Math.round(midY + half));
    ctx.stroke();
    ctx.restore();
    line(ctx, hx, midY, px, midY - half, p.fg);
    line(ctx, hx, midY, px, midY + half, p.fg);
    ctx.save();
    ctx.strokeStyle = p.marker; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(Math.round(px) + 0.5, midY - half);
    ctx.lineTo(Math.round(px) + 0.5, midY + half);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'THE FILM', px + 8, midY + 4, p.marker, 9, 'left');

    /* the cone, carried on into the room */
    /* the cone stays inside the section: as far as the room's edge, or as far
       as the section's height allows at this angle, whichever comes first */
    const reach = Math.min(hx - pad - 10, (secH / 2 - 12) / Math.tan(aov / 2));
    const k = Math.tan(aov / 2) * reach;
    line(ctx, hx, midY, hx - reach, midY - k, p.signal, [4, 4]);
    line(ctx, hx, midY, hx - reach, midY + k, p.signal, [4, 4]);
    ctx.save();
    ctx.fillStyle = p.signal;
    ctx.beginPath(); ctx.arc(hx, midY, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    label(ctx, 'THE HOLE', hx, midY + Math.max(half, k * 0.5) + 22, p.signal, 9, 'center');
    label(ctx, 'WHAT THE CONE REACHES', hx - reach, midY + k + 14, p.muted, 9, 'left');
  }

  return { render: view.render };
}

window.modelBoxAngle = modelBoxAngle;
