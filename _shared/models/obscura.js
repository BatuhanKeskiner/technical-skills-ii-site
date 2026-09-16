/* ============================================================
   Camera obscura — a MODEL, the fourth kind (Batu, 13-09-2026).

   ONE THING: the wall sees the flame the other way up, and it
   does it because every ray has to go through one hole.

   HIS KEYNOTE OF 14-09-2026, slide 5: the subject is a candle
   with a flame; the hand is the distance from the wall to the
   hole, not the length of the subject; close in the image is
   small and bright, further back it is big and faint; it is a
   wall, not a room, and nothing is enclosed — this is Ibn
   al-Haytham's experiment, a lamp, a hole and a wall.

   Drawn to fit a square window.

   HIS KEYNOTE OF 16-09-2026, slide 5: "Position the candle so the
   fire is at the level of the hole. The white part is not visible,
   only show the flame part."

   AND HIS WORD THE SAME EVENING: "hala burada mumu goremiyorum" —
   so that line was a FAULT REPORTED, not an instruction taken: the
   white part of the candle was not visible and it should have been.

   PUT TOGETHER, HIS THREE NOTES SAY ONE THING, and it is the physics
   of the page: "I dont want to see the candle's white wax in the
   image on the wall. but only on the candle itself. and as you can
   think of candles wax itself wouldnt move up and down but only the
   fire." The wax is an object, not a light. It stands on the left,
   white and still; the hole passes only what the flame sends, so the
   wall carries the flame alone, upside down. And the flicker belongs
   to the fire: the wick stays where it is and the tip moves.

   "parlaklığı da mesafeye bağlı olarak artıp azalmıyor." The picture
   was the same brightness at every distance. The same light is spread
   over an image m times bigger in each direction, so what lands on any
   patch of wall falls as 1/m² — close in it is small and bright, far
   out it is big and faint, which is the sentence the page is about.
   ============================================================ */

function modelObscura(fig) {
  const p = palette(fig);

  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  /* ONE HAND, NO MEASUREMENTS: how far the wall stands behind the hole */
  const state = { d: 0.5 };
  const fD = slider(controls, {
    label: 'Distance from the hole to the wall', min: 0.15, max: 1, step: 0.01,
    value: state.d, format: () => '',
  });

  const view = canvas(stage, draw);
  fD.addEventListener('input', () => { state.d = +fD.value; view.render(); });

  /* the flame flickers a little, so the room can see it is a flame */
  let raf = 0;
  const t0 = performance.now();
  (function tick() {
    if (!fig.isConnected) return;
    view.render();
    raf = requestAnimationFrame(tick);
  })();

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = Math.max(24, w * 0.05);
    /* the hole stands a third of the way in; the candle to its left, the wall
       to its right at the distance the hand gives */
    const hx = pad + (w - pad * 2) * 0.36;
    const cx = pad + 18;                          /* the candle */
    const wallMax = w - pad - 6;
    const wx = hx + (wallMax - hx) * state.d;     /* the wall */
    const midY = h * 0.5;
    const t = (performance.now() - t0) / 1000;
    const flick = 1 + Math.sin(t * 9) * 0.05 + Math.sin(t * 23) * 0.03;

    /* The wick is a fixed point - it is the top of a candle, and a candle does
       not grow and shrink. So the base of the flame and the whole of the wax
       are set without the flicker in them, and only the tip of the flame
       moves. The fire sits level with the hole, as he asked on slide 5. */
    const flameH = h * 0.16;
    const flameBase = midY + flameH * 0.45;             /* the wick, still */
    const flameTop = flameBase - flameH * flick;        /* only the tip moves */
    const waxBase = flameBase + h * 0.19;               /* the white part */
    const waxW = 11;

    const flame = (x, top, base, wdt, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createLinearGradient(x, base, x, top);
      g.addColorStop(0, p.signal);
      g.addColorStop(0.55, p.marker);
      g.addColorStop(1, 'rgba(255,255,255,0.9)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.bezierCurveTo(x + wdt, top + (base - top) * 0.45, x + wdt * 0.9, base, x, base);
      ctx.bezierCurveTo(x - wdt * 0.9, base, x - wdt, top + (base - top) * 0.45, x, top);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    };
    /* the candle itself: the wax, and the black wick the flame stands on. Two
       tones, because a white column on a black stage reads as a strip of paper
       until one side of it is in shadow. */
    const wax = (x, top, base, wdt, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createLinearGradient(x - wdt, 0, x + wdt, 0);
      g.addColorStop(0, 'rgba(232,226,212,0.55)');
      g.addColorStop(0.42, 'rgba(255,252,244,1)');
      g.addColorStop(1, 'rgba(176,168,150,0.75)');
      ctx.fillStyle = g;
      ctx.fillRect(x - wdt, top, wdt * 2, base - top);
      ctx.fillStyle = 'rgba(120,112,96,' + (0.9 * alpha).toFixed(2) + ')';
      ctx.fillRect(x - wdt, top, wdt * 2, Math.max(1, wdt * 0.22));
      ctx.restore();
    };
    wax(cx, flameBase - 1, waxBase, waxW, 1);
    flame(cx, flameTop, flameBase, 13, 1);

    /* the hole: a thin wall with a gap in it, nothing enclosed */
    line(ctx, hx, pad, hx, midY - 4, p.fg);
    line(ctx, hx, midY + 4, hx, h - pad, p.fg);

    /* the wall, where the picture lands */
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.round(wx) + 0.5, pad);
    ctx.lineTo(Math.round(wx) + 0.5, h - pad);
    ctx.stroke();
    ctx.restore();

    /* the rays: through the one hole, so up goes down. The image is the
       flame scaled by wall distance over candle distance, and its light is
       spread over that much more area — brighter close in, fainter far out */
    const m = (wx - hx) / (hx - cx);
    const iTop = midY + (midY - flameTop) * m;      /* the flame's tip, low */
    const iBase = midY + (midY - flameBase) * m;    /* its foot, high */
    const ray = (yFrom, yTo, col, dash) => {
      line(ctx, cx, yFrom, hx, midY, col, dash);
      line(ctx, hx, midY, wx, yTo, col, dash);
    };
    ray(flameTop, iTop, p.signal);
    ray(flameBase, iBase, p.muted, [3, 4]);

    /* the picture on the wall: the candle and its flame, the other way up,
       drawn a few pixels in from the wall so it reads as on it */
    /* THE LIGHT FALLS AS THE PICTURE GROWS. The image is m times bigger in
       each direction, so the same flame's light is spread over m² as much
       wall: what any patch of it receives is 1/m². Divided by 3 so the
       nearest wall is the bright end of the scale, and floored so the white
       at the tip of the flame is still white at the far end - the thing that
       says which way up the picture is must not go out. */
    const lum = Math.max(0.3, Math.min(1, (1 / (m * m)) / 3));
    const px = wx - 7;
    /* the flame image is soft: the hole has a width, so every point lands
       as a small disc, and the further the wall the larger the disc */
    ctx.save();
    ctx.filter = 'blur(' + (1 + state.d * 3).toFixed(1) + 'px)';
    /* HIS SECOND ROUND, slide 3: "We do see the candle's white wax on the left
       but not on the right." The picture on the wall was drawn faint, so the
       white at the tip of the flame - the hottest part, and the thing that says
       which way up it is - disappeared. It is drawn at full strength and dimmed
       by the blur and the glow instead. */
    /* the flame and nothing else: the wax gives off no light, so it sends
       nothing through the hole and has no picture on the wall */
    flame(px, iTop, iBase, Math.max(4, 13 * m), lum);
    ctx.restore();
    /* and what it throws on the wall around it */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glowR = Math.max(10, (iTop - iBase) * 0.9);
    const g = ctx.createRadialGradient(px, (iTop + iBase) / 2, 0, px, (iTop + iBase) / 2, glowR);
    g.addColorStop(0, 'rgba(255,200,80,' + (lum * 0.35).toFixed(2) + ')');
    g.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(px - glowR, (iTop + iBase) / 2 - glowR, glowR * 2, glowR * 2);
    ctx.restore();

    /* under the wax, not across it: with the candle drawn, the old place for
       this word was the middle of the white column */
    label(ctx, 'THE CANDLE', cx, waxBase + 16, p.muted, 9, 'center');
    label(ctx, 'THE HOLE', hx, h - pad + 16, p.muted, 9, 'center');
    label(ctx, 'THE WALL', wx, pad - 10, p.muted, 9, 'center');
    label(ctx, 'UPSIDE DOWN', wx - 12, iTop + 16, p.marker, 9, 'right');
  }

  return { render: view.render };
}

window.modelObscura = modelObscura;
