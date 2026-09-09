/* ============================================================
   Why 1.414 — the A series, proved rather than stated
   ------------------------------------------------------------
   His brief of 09-09-2026, seven beats, in his order:

     1  A4 has an odd ratio. It is not 2:3.
     2  It is 1.414. Why?
     3  Because halving it — or doubling it — gives the next
        format, and that format is the same shape.
     4  For that to happen the ratio cannot be free. There is
        exactly one that works.
     5  That one is a square root, and a square root is a
        length you can draw: the diagonal of a square.
     6  The arithmetic that says so, in four lines.
     7  Which is why A4 is 210 x 297 and why it is a standard.

   A4 IS THE ONE RECTANGLE WHOSE HALF IS ITSELF, and that
   sentence is the whole instrument. `aseries` next door folds
   the sheet and lets the room watch the shape survive; this one
   answers the question that follows — why THAT number — and it
   answers it with a compass rather than with a claim.

   The stage carries the drawing and the numbers on the drawing.
   The strip carries one control, because there is one thing to
   do: go on to the next step, or back. The readout says what the
   step settles, once, in words that are not on the stage (W15).
   ============================================================ */

/* A4 AND ITS FAMILY, IN THE MILLIMETRES THEY ARE ACTUALLY CUT.
   Nothing here is rounded for the drawing: 210 x 297 is a real sheet and the
   whole argument is that the real sheet is 1.414, not that a drawing can be
   made to look like it. */
const R2_A = [
  { n: 'A0', w: 841, h: 1189 }, { n: 'A1', w: 594, h: 841 },
  { n: 'A2', w: 420, h: 594 }, { n: 'A3', w: 297, h: 420 },
  { n: 'A4', w: 210, h: 297 }, { n: 'A5', w: 148, h: 210 },
  { n: 'A6', w: 105, h: 148 },
];
const R2_SQRT2 = Math.SQRT2;

/* THE SEVEN STEPS ARE THE INSTRUMENT'S ONLY STATE. `name` is what the stepper
   reads; `says` is the readout line, which is a different sentence from the
   name and from anything drawn - that is W15, and it is why the name is short
   and the line is not a repeat of it. */
const R2_STEPS = [
  { name: 'Not 2 : 3', says: 'close to the shape of a 35mm frame, and not it' },
  { name: '1.414', says: 'the long side over the short side, on a real sheet' },
  { name: 'Halve it', says: 'the half is the same shape as the whole' },
  { name: 'One ratio', says: 'only one rectangle can do that' },
  { name: 'Draw it', says: 'the diagonal of the square is the long side' },
  { name: 'x² = 2', says: 'so the ratio is the square root of two' },
  { name: 'The series', says: 'A0 is one square metre; A4 is four folds down' },
];

function mountRoot2(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Why 1.414'),
              el('span', 'ts-sub', 'square · diagonal · the A series'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { i: 0 };
  const view = canvas(stage, draw);

  /* ONE CONTROL, AND IT WALKS NAMES. C21: the arrows say the step is being
     changed, not increased - there is no more of step 5 than of step 4. */
  const step = stepper(controls, {
    label: 'Step', cls: 'one', arrows: true,
    ladder: R2_STEPS.map((s, i) => i),
    value: 0,
    format: (i) => (i + 1) + ' · ' + R2_STEPS[i].name,
    onChange: (i) => { state.i = i; sync(); },
  });

  /* TWO CELLS. The number under examination, which changes from step to step
     and is the thing being argued about; and what the step settles. Neither
     is written on the stage. */
  const out = readout(fig, [
    { id: 'num', key: 'The number', cls: 'hi' },
    { id: 'says', key: 'What this settles' },
  ]);

  fsButton(stage, fig);

  function sync() {
    const s = R2_STEPS[state.i];
    out.says.textContent = s.says;
    /* W4: the seven lines under `says` are Claude's words, not his. They
       stay orange with a tick under them until he has ticked each one. */
    pending(out.says, 'root2/says/' + state.i);
    out.num.innerHTML = [
      '3 ÷ 2 = 1.500',
      '297 ÷ 210 = 1.414',
      '210 ÷ 148 = 1.414',
      'x = 2 ÷ x',
      '√2 = 1.41421356',
      'x = √2',
      'A0 = 1 m²',
    ][state.i];
    view.render();
  }

  /* ---------- drawing ---------------------------------------------------
     One helper does all the sheets: a rectangle in millimetres, placed by its
     centre, at the scale the step chose. Everything else is arithmetic. */
  function rect(ctx, cx, cy, w, h, k, stroke, width, dash, fill) {
    const x = cx - w * k / 2, y = cy - h * k / 2;
    if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w * k, h * k); }
    ctx.save();
    ctx.strokeStyle = stroke; ctx.lineWidth = width || 1.5;
    if (dash) ctx.setLineDash(dash);
    ctx.strokeRect(x, y, w * k, h * k);
    ctx.restore();
    return { x: x, y: y, w: w * k, h: h * k };
  }

  /* a dimension line with its number, the way a drawing is dimensioned */
  function dim(ctx, x1, y1, x2, y2, text, colour) {
    line(ctx, x1, y1, x2, y2, colour, null);
    const t = 4;
    if (Math.abs(y2 - y1) < 1) {
      line(ctx, x1, y1 - t, x1, y1 + t, colour, null);
      line(ctx, x2, y2 - t, x2, y2 + t, colour, null);
      label(ctx, text, (x1 + x2) / 2, y1 - 7, colour, 11, 'center');
    } else {
      line(ctx, x1 - t, y1, x1 + t, y1, colour, null);
      line(ctx, x2 - t, y2, x2 + t, y2, colour, null);
      ctx.save();
      ctx.translate(x1 - 8, (y1 + y2) / 2);
      ctx.rotate(-Math.PI / 2);
      label(ctx, text, 0, 0, colour, 11, 'center');
      ctx.restore();
    }
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const pad = 26, foot = 30;
    const cx = w / 2, cy = (h - foot) / 2 + 4;
    /* THE SHEET IS THE SAME SIZE ON EVERY STEP. The argument runs across the
       seven, so the A4 cannot grow and shrink underneath it - S18 is about
       controls, but a drawing that resizes when you press next is the same
       broken promise. One scale, and it is the tallest sheet any step draws
       (A4 itself, 297 mm) against the height the stage actually has: the
       drawing takes the room it is given rather than a fraction of it. */
    const A = R2_A[4];
    const k = Math.min((w - pad * 2) / 700, (h - pad * 2 - foot) / A.h);
    const sw = A.w * k, sh = A.h * k;

    const S = state.i;

    /* ---- 1 · NOT 2:3 ------------------------------------------------- */
    if (S === 0) {
      /* THE TWO SHEETS SHARE A HEIGHT, so the only difference left to look at
         is the one being talked about. At the same height A4 is the WIDER of
         the two - 210 against 198 - and the twelve millimetres are drawn on
         the A4 rather than described, because twelve millimetres described is
         a number and twelve millimetres drawn is a shape. */
      const hh = sh;
      const a4w = hh / R2_SQRT2, tw = hh * 2 / 3, gap = 74;
      const total = a4w + gap + tw;
      const x0 = cx - total / 2;
      const r1 = rect(ctx, x0 + a4w / 2, cy, a4w, hh, 1, p.marker, 2, null, p.inset);
      const r2 = rect(ctx, x0 + a4w + gap + tw / 2, cy, tw, hh, 1, p.rule2, 1.5,
                      [5, 4], p.inset);
      /* the twelve millimetres, on the sheet that has them */
      ctx.save();
      ctx.fillStyle = p.signal; ctx.globalAlpha = 0.55;
      ctx.fillRect(r1.x + r1.w - (a4w - tw), r1.y, a4w - tw, r1.h);
      ctx.restore();
      line(ctx, r1.x + r1.w - (a4w - tw), r1.y, r1.x + r1.w - (a4w - tw),
           r1.y + r1.h, p.signal, null);

      label(ctx, 'A4', r1.x + 10, r1.y + 24, p.marker, 14);
      label(ctx, '210 × 297 mm', r1.x + 10, r1.y + 42, p.muted, 11);
      label(ctx, '1.414', r1.x + r1.w / 2, r1.y + r1.h + 24, p.marker, 16, 'center');
      label(ctx, 'A 2 : 3 SHEET', r2.x + 10, r2.y + 24, p.fg, 14);
      label(ctx, '198 × 297 mm', r2.x + 10, r2.y + 42, p.muted, 11);
      label(ctx, '1.500', r2.x + r2.w / 2, r2.y + r2.h + 24, p.fg, 16, 'center');
      label(ctx, '12 mm', r1.x + r1.w + 10, cy, p.signal, 12);
      label(ctx, 'AT THE SAME HEIGHT, A4 IS THE WIDER SHEET — BY TWELVE MILLIMETRES',
            w / 2, h - 12, p.muted, 9, 'center');
    }

    /* ---- 2 · 1.414 --------------------------------------------------- */
    if (S === 1) {
      const r = rect(ctx, cx, cy, A.w, A.h, k, p.marker, 2, null, p.inset);
      dim(ctx, r.x, r.y + r.h + 22, r.x + r.w, r.y + r.h + 22, '210 mm', p.fg);
      dim(ctx, r.x - 16, r.y, r.x - 16, r.y + r.h, '297 mm', p.fg);
      label(ctx, '297', cx, cy - 10, p.marker, 26, 'center');
      line(ctx, cx - 46, cy, cx + 46, cy, p.marker, null);
      label(ctx, '210', cx, cy + 26, p.marker, 26, 'center');
      label(ctx, '= 1.4142…', cx + 92, cy + 8, p.signal, 15);
      label(ctx, 'NOT A ROUND NUMBER, AND NOT AN ACCIDENT',
            w / 2, h - 12, p.muted, 9, 'center');
    }

    /* ---- 3 · HALVE IT ------------------------------------------------ */
    if (S === 2) {
      const B = R2_A[5];
      const gap = 78;
      const total = A.w * k + gap + B.w * k;
      const x0 = cx - total / 2;
      const whole = rect(ctx, x0 + A.w * k / 2, cy, A.w, A.h, k, p.marker, 2, null, p.inset);
      line(ctx, whole.x, whole.y + whole.h / 2, whole.x + whole.w, whole.y + whole.h / 2,
           p.signal, [6, 4]);
      label(ctx, 'FOLD', whole.x + 10, whole.y + whole.h / 2 - 8, p.signal, 10);
      label(ctx, 'A4  210 × 297', whole.x + 10, whole.y + 24, p.marker, 12);
      label(ctx, '1.414', whole.x + whole.w / 2, whole.y + whole.h + 24, p.marker, 16, 'center');
      /* the half, turned, at the same scale - so it really is half the area */
      const half = rect(ctx, x0 + A.w * k + gap + B.w * k / 2, cy, B.w, B.h, k,
                        p.marker, 2, null, p.inset);
      label(ctx, 'A5  148 × 210', half.x + 10, half.y + 24, p.marker, 12);
      label(ctx, '1.414', half.x + half.w / 2, half.y + half.h + 24, p.marker, 16, 'center');
      label(ctx, '→', x0 + A.w * k + gap / 2, cy + 8, p.fg, 26, 'center');
      label(ctx, 'HALF THE AREA. THE SAME SHAPE.',
            w / 2, h - 12, p.muted, 9, 'center');
    }

    /* ---- 4 · ONE RATIO ----------------------------------------------- */
    if (S === 3) {
      /* the same two rectangles as step 3, but unnamed and lettered: this is
         the condition, not the paper. Short side 1, long side x. */
      const u = sh / R2_SQRT2;                       /* one unit, on screen */
      const aw = u, ah = u * R2_SQRT2;
      const bw = ah / 2, bh = u;
      const gap = 96;
      const total = aw + gap + bw;
      const x0 = cx - total / 2;
      const a = rect(ctx, x0 + aw / 2, cy, aw, ah, 1, p.marker, 2, null, p.inset);
      dim(ctx, a.x, a.y + a.h + 22, a.x + a.w, a.y + a.h + 22, '1', p.fg);
      dim(ctx, a.x - 18, a.y, a.x - 18, a.y + a.h, 'x', p.fg);
      const b = rect(ctx, x0 + aw + gap + bw / 2, cy, bw, bh, 1,
                     p.marker, 2, null, p.inset);
      dim(ctx, b.x, b.y + b.h + 22, b.x + b.w, b.y + b.h + 22, 'x / 2', p.fg);
      dim(ctx, b.x - 18, b.y, b.x - 18, b.y + b.h, '1', p.fg);
      label(ctx, 'the sheet', a.x + a.w / 2, a.y - 14, p.muted, 11, 'center');
      label(ctx, 'the half', b.x + b.w / 2, b.y - 14, p.muted, 11, 'center');
      label(ctx, 'SAME SHAPE?', x0 + aw + gap / 2, cy + 8, p.signal, 11, 'center');
      label(ctx, 'ONLY IF  x ÷ 1  =  1 ÷ (x ÷ 2)',
            w / 2, h - 12, p.signal, 10, 'center');
    }

    /* ---- 5 · DRAW IT ------------------------------------------------- */
    if (S === 4) {
      /* THE CONSTRUCTION, WHICH IS OLDER THAN THE STANDARD. A square on the
         short side; its diagonal is that side times root two; swing the
         diagonal up to the vertical and you have the long side. No number is
         needed to do it - a compass is enough - and that is the point. */
      const side = sw;
      const d = side * R2_SQRT2;                      /* = sh, to the pixel */
      const x0 = cx - side / 2 - 60, yb = cy + sh / 2;
      /* the square */
      ctx.save();
      ctx.strokeStyle = p.fg; ctx.lineWidth = 2;
      ctx.strokeRect(x0, yb - side, side, side);
      ctx.fillStyle = p.wash; ctx.fillRect(x0, yb - side, side, side);
      ctx.restore();
      /* its diagonal */
      ctx.save();
      ctx.strokeStyle = p.signal; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x0 + side, yb - side); ctx.stroke();
      ctx.restore();
      /* swung up to the vertical */
      ctx.save();
      ctx.strokeStyle = p.signal; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(x0, yb, d, -Math.PI / 4, -Math.PI / 2, true);
      ctx.stroke(); ctx.restore();
      /* the sheet the swing gives */
      ctx.save();
      ctx.strokeStyle = p.marker; ctx.lineWidth = 2.5;
      ctx.strokeRect(x0, yb - d, side, d);
      ctx.restore();

      label(ctx, 'THE SQUARE', x0 + 10, yb - 14, p.fg, 11);
      label(ctx, 'ON THE SHORT SIDE', x0 + 10, yb - 1, p.muted, 9);
      label(ctx, '210', x0 + side / 2, yb + 20, p.fg, 12, 'center');
      label(ctx, 'ITS DIAGONAL', x0 + side + 14, yb - side + 4, p.signal, 11);
      label(ctx, '210 × √2', x0 + side + 14, yb - side + 20, p.signal, 13);
      label(ctx, 'A4', x0 + side + 14, yb - d + 18, p.marker, 15);
      label(ctx, '297 mm', x0 + side + 14, yb - d + 36, p.marker, 12);
      label(ctx, 'A COMPASS AND A STRAIGHT EDGE. NO ARITHMETIC YET.',
            w / 2, h - 12, p.muted, 9, 'center');
    }

    /* ---- 6 · THE ARITHMETIC ------------------------------------------ */
    if (S === 5) {
      /* four lines, and the last one is the answer */
      const lines = [
        ['x ÷ 1  =  1 ÷ (x ÷ 2)', 'the two shapes are equal'],
        ['x  =  2 ÷ x', 'both sides, tidied'],
        ['x²  =  2', 'multiplied by x'],
        ['x  =  √2  =  1.41421356…', 'and there is only one such x'],
      ];
      const lh = Math.min(56, (h - foot - 90) / 4);
      const top = cy - (lh * 4) / 2 + lh * 0.6;
      lines.forEach((L, i) => {
        const last = i === lines.length - 1;
        label(ctx, L[0], cx - 20, top + i * lh, last ? p.signal : p.fg,
              last ? 25 : 22, 'right');
        label(ctx, L[1], cx + 20, top + i * lh, p.muted, 10, 'left');
      });
      label(ctx, 'THE RATIO IS NOT CHOSEN. IT IS THE ONLY ONE THAT WORKS.',
            w / 2, h - 12, p.muted, 9, 'center');
    }

    /* ---- 7 · THE SERIES ---------------------------------------------- */
    if (S === 6) {
      /* A0 DOWN TO A6, EACH ONE INSIDE THE LAST, AT ONE TRUE SCALE. Every
         sheet shares the top-left corner, because that is what halving does:
         cut the long side and the piece you keep sits in the corner of the
         one before it. A4 is the sheet the room is holding, so A4 is the one
         in marker and the only one filled. */
      const kk = Math.min((w - pad * 2 - 260) / R2_A[0].w,
                          (h - pad * 2 - foot) / R2_A[0].h);
      const bw = R2_A[0].w * kk, bh = R2_A[0].h * kk;
      const x0 = cx - (bw + 260) / 2, y0 = cy - bh / 2;
      R2_A.forEach((sh2, i) => {
        const on = sh2.n === 'A4';
        ctx.save();
        if (on) { ctx.fillStyle = p.band; ctx.fillRect(x0, y0, sh2.w * kk, sh2.h * kk); }
        ctx.strokeStyle = on ? p.marker : p.fg;
        ctx.globalAlpha = on ? 1 : 0.42;
        ctx.lineWidth = on ? 2.5 : 1.2;
        ctx.strokeRect(x0, y0, sh2.w * kk, sh2.h * kk);
        ctx.restore();
        label(ctx, sh2.n, x0 + sh2.w * kk - 7, y0 + sh2.h * kk - 8,
              on ? p.marker : p.muted, on ? 14 : 10, 'right');
      });
      const tx = x0 + bw + 22;
      label(ctx, 'A0', tx, y0 + 22, p.fg, 15);
      label(ctx, '841 × 1189 mm', tx, y0 + 42, p.muted, 12);
      label(ctx, '= 1 m²', tx, y0 + 60, p.fg, 13);
      label(ctx, 'A4', tx, y0 + 100, p.marker, 15);
      label(ctx, '210 × 297 mm', tx, y0 + 120, p.muted, 12);
      label(ctx, '= A0 folded four times', tx, y0 + 138, p.marker, 12);
      label(ctx, 'EVERY SHEET IS THE SAME SHAPE, SO EVERY SHEET REDUCES ONTO THE NEXT',
            w / 2, h - 12, p.muted, 9, 'center');
    }
  }

  sync();
  return { render: view.render };
}

window.mountRoot2 = mountRoot2;
