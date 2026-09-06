/* ============================================================
   THE DARKROOM TIMER
   ------------------------------------------------------------
   Batu's own Kaiser, photographed twice - under the safelight
   and under the room light - and made into an instrument. It
   was built inside the test strip, where it was measured, and
   it is here because the photogram needs the same clock and
   two copies of a measurement is one measurement that will
   eventually be wrong.

   Everything below was found by looking at the photograph, not
   by judging from a grid. The three live buttons were up to
   twelve pixels off, and their RADII were further off than
   their centres: the start button was treated as r42 when it
   is r51, so the outer fifth of it - which is most of what a
   pointer lands on - did nothing at all.

   There is a fourth button at 155,501, the lamp switch. It is
   named so nobody has to wonder, and it is not made live.
   ============================================================ */

const DT = {
  w: 579, h: 806,
  screen: { x: 178, y: 196, w: 232, h: 89 },
  down:  { x: 222, y: 367, r: 48 },
  up:    { x: 364, y: 367, r: 49 },
  start: { x: 430, y: 501, r: 51 },
  lamp:  { x: 155, y: 501, r: 51 },
};

/* THE TWO FRAMES. Loaded once per instrument; the callback fires as each
   arrives, because a timer that waits for both is a timer that is missing for
   as long as the slower one takes. */
function dtArt(onload) {
  const art = {};
  ['dark', 'light'].forEach((k) => {
    const i = new Image();
    i.onload = () => { art[k] = i; if (onload) onload(k); };
    i.src = '../_shared/interactives/art/timer-' + k + '.png';
  });
  return art;
}

/* WHICH BUTTON, in the timer's own coordinates. `box` is what dtDraw wrote:
   where the picture was put and how much it was scaled by. */
function dtHit(box, px, py) {
  if (!box) return null;
  const x = (px - box.x) / box.k, y = (py - box.y) / box.k;
  for (const k of ['down', 'up', 'start']) {
    const b = DT[k];
    if ((x - b.x) ** 2 + (y - b.y) ** 2 < b.r * b.r) return k;
  }
  return null;
}

/* o: { secs, hot, dead:{down,up,start}, glow } */
function dtDraw(ctx, img, x, y, w, h, o) {
  const k = w / DT.w;
  const box = { x: x, y: y, k: k };
  if (!img) return box;
  ctx.drawImage(img, x, y, w, h);

  /* THE THREE THAT WORK, RINGED. A photograph of a timer has seven things on
     it that look like buttons and three of them do anything; nothing on the
     picture says which. A pale ring is drawn round the live ones at all times -
     pale rather than red, so it reads under the safelight and under the room
     light - and brightens under the pointer. */
  ctx.save();
  ['down', 'up', 'start'].forEach((n) => {
    const b = DT[n], on = o.hot === n, dead = !!(o.dead && o.dead[n]);
    /* CLEAR OF THE BUTTON, and drawn twice. The centres were right all along -
       crosshairs at these coordinates land dead on all four - but the ring sat
       five artwork pixels outside the rim, which at the size this is drawn is
       under two screen pixels. So it lay along the button's own edge, and any
       asymmetry in how that edge is lit read as the ring being out of place.
       It stands well clear now, and a dark stroke goes under the pale one so
       it holds its own against whatever it crosses. */
    const cx = x + b.x * k, cy = y + b.y * k, rr = (b.r + 15) * k;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = (on && !dead ? 2.6 : 1.6) + 2.2;
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = dead ? 'rgba(255,226,214,0.14)'
                   : on ? 'rgba(255,238,230,0.95)' : 'rgba(255,226,214,0.42)';
    ctx.lineWidth = on && !dead ? 2.6 : 1.6;
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
  });
  ctx.restore();

  const s = DT.screen;
  const sx = x + s.x * k, sy = y + s.y * k, sw = s.w * k, sh = s.h * k;
  ctx.save();
  ctx.font = Math.round(sh * 0.82) + 'px "Seven Segment", monospace';
  ctx.textBaseline = 'middle';
  /* No ghosted segments: an unlit segment on a red LED in a dark room is
     black, not faintly red. */
  ctx.fillStyle = '#FF6A22';
  if (o.glow) {
    /* an LED in a dark room throws a little light of its own */
    ctx.shadowColor = 'rgba(255,110,40,0.9)';
    ctx.shadowBlur = sh * 0.24;
  }

  /* A SEVEN-SEGMENT DISPLAY DOES NOT MOVE. Every digit on the real thing sits
     in its own soldered cell of exactly one width, so counting 10.0 down to
     9.9 changes what a cell shows and never where it is. Set as a string it
     jiggled instead, because the 1 of a seven-segment typeface is a single
     narrow bar and every glyph after it slid along.

     AND THE POINT IS NOT A CHARACTER. Giving it a cell of its own still left
     it at the mercy of the font: the period's own box is wide and the dot sits
     wherever the typeface put it inside that box, so it drifted and it
     collided with the digit beside it. On the timer the point is a separate
     lamp in the corner of a digit's cell. So the digits are laid out here
     without it, each centred in a fixed cell filled from the right, and the
     point is DRAWN - one dot, one place, for good. */
  const digits = Math.max(0, o.secs).toFixed(1).replace('.', '');
  const cell = sh * 0.44, gap = sh * 0.15;
  const R = sx + sw - sh * 0.16, midY = sy + sh * 0.54;
  ctx.textAlign = 'center';
  let cx = R;
  for (let i = digits.length - 1; i >= 0; i--) {
    cx -= cell;
    ctx.fillText(digits[i], cx + cell / 2, midY);
    if (i === digits.length - 1) cx -= gap;      /* the point's own gutter */
  }
  ctx.beginPath();
  ctx.arc(R - cell - gap / 2, midY + sh * 0.29, sh * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return box;
}
