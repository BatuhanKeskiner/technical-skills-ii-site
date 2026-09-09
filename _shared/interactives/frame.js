/* ============================================================
   A3 · Height & Width
   ------------------------------------------------------------
   Every two-dimensional thing has two numbers and no others.
   The frame is pinned at its top-left and dragged by the
   bottom-right, so the two numbers are the two directions your
   hand moves in and nothing else can be changed.

   THE PICTURE DOES NOT SCALE. Dragging the corner CUTS - the
   landscape behind stays exactly where it was and the frame
   takes more or less of it. That is the whole difference
   between a frame and a zoom, and it is the thing the page
   before this one is about.

   Drawn rather than photographed, because the point is the
   rectangle and a photograph would give the room something
   else to look at.
   ============================================================ */

const FR_AR = 1012 / 600;              /* the shape the figure asks for */
const FR_MIN = 0.16;                   /* the smallest frame, of the field */

function mountFrame(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  /* A NAME ON THE INSTRUMENT. In full screen the page's own heading is gone
     and there is nothing on screen saying what this is. IG-01 02: the head is
     the name and a three-noun eyebrow. Added to every instrument 08-09-2026 -
     five of eleven had one, and on a wall the other six were anonymous. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Height & Width'),
              el('span', 'ts-sub', 'height · width · ratio'));
  fig.prepend(head);


  /* w and h are fractions of the field, measured from the pinned corner.
     IT OPENS AT 3:2, not at a fraction of a field whose own shape decides the
     answer. It used to start at 0.62 x 0.58 of the field, so on a wide stage
     the first thing anybody saw was 2.66:1 - a shape nothing is - and the
     readout looked like a broken measurement rather than a ratio. */
  const state = { w: 0.62, h: 0.58, hot: false, set: false };

  /* WIDTH AND HEIGHT STAY. They went out with the pixels on 09-09-2026 and
     that was one instruction too far - "width and height sunumda olacakti sen
     sanirim yanlis anlayip kaldirdin tamamen". What he struck was the pixel
     count, which is a fact about this screen and not about the frame; the two
     sides themselves are the instrument's name and half its subject.
     They come back as a share of the field - how much of the world you kept -
     which is a real second reading and not the ratio said twice (W15). Two
     cells, which is the readout's budget: the pair, and the shape they make. */
  const out = readout(fig, [
    { id: 'wh', key: 'Width · height' },
    { id: 'ar', key: 'Ratio', cls: 'hi' },
  ]);

  const view = canvas(stage, draw);
  fsButton(stage, fig);

  /* ---- the field: where the frame is allowed to live ---- */
  function field(w, h) {
    const m = Math.min(w, h) * 0.10;
    const fw = w - m * 2, fh = h - m * 2;
    return { x: m, y: m, w: fw, h: fh };
  }

  /* ---- the drawn world: a wireframe terrain, fixed and deterministic ---- */
  const RIDGE = (() => {
    /* one seeded pass, so the mountain is the same mountain on every machine
       and on every redraw - a landscape that reshuffles while you drag would
       read as the frame changing the world, which is the opposite of the point */
    let s = 20260908;
    const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const N = 46, M = 26, g = [];
    for (let j = 0; j < M; j++) {
      const row = [];
      for (let i = 0; i < N; i++) {
        const u = i / (N - 1), v = j / (M - 1);
        const peak = Math.exp(-((u - 0.36) ** 2) / 0.045 - ((v - 0.42) ** 2) / 0.10);
        const ridge = Math.exp(-((u - 0.72) ** 2) / 0.020 - ((v - 0.66) ** 2) / 0.05);
        row.push(peak * 1.0 + ridge * 0.62 + rnd() * 0.055);
      }
      g.push(row);
    }
    return { g, N, M };
  })();

  function terrain(ctx, F) {
    const { g, N, M } = RIDGE;
    const at = (i, j) => {
      const u = i / (N - 1), v = j / (M - 1);
      /* a flat oblique: x runs across, y runs back and up */
      return [F.x + (u * 0.86 + v * 0.14) * F.w,
              F.y + F.h * (0.30 + v * 0.66) - g[j][i] * F.h * 0.52];
    };
    ctx.save();
    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let j = 0; j < M; j++) {
      for (let i = 0; i < N; i++) {
        const a = at(i, j);
        if (i) ctx.lineTo(a[0], a[1]); else ctx.moveTo(a[0], a[1]);
      }
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const a = at(i, j);
        if (j) ctx.lineTo(a[0], a[1]); else ctx.moveTo(a[0], a[1]);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ---- the arrows that name the two numbers ---- */
  function arrow(ctx, x1, y1, x2, y2, col) {
    const a = Math.atan2(y2 - y1, x2 - x1), hd = 7;
    ctx.save();
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    [[x1, y1, a + Math.PI], [x2, y2, a]].forEach(([hx, hy, ha]) => {
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - Math.cos(ha - 0.42) * hd, hy - Math.sin(ha - 0.42) * hd);
      ctx.lineTo(hx - Math.cos(ha + 0.42) * hd, hy - Math.sin(ha + 0.42) * hd);
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  }

  /* THE FRAME IS FIXED AT THE CENTRE and grows out of it in both directions.
     It used to be pinned at the top left and pulled from the bottom right,
     which put the picture in one corner of the stage and left the other three
     empty. His note of 09-09-2026: "su cerceve ortaya sabitlenmeli" - and the
     house rule underneath it, that a picture sits in the middle of the space
     it has. Growing from the centre also says the true thing about a frame:
     it opens around what you are pointing at, it does not unroll from a
     corner. */
  function box(F) {
    const w = F.w * state.w, h = F.h * state.h;
    return { x: F.x + (F.w - w) / 2, y: F.y + (F.h - h) / 2, w: w, h: h };
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const F = field(w, h);
    /* 3:2 UNTIL A HAND TOUCHES IT, and derived every frame rather than
       computed once. Computed once, it was locked in from whatever size the
       stage happened to be on the first draw - before the canvas had settled -
       and opened at 1.57:1, which is not a shape anything is. */
    if (!state.set && F.w && F.h) {
      /* the largest 3:2 that fits inside 62% of the width and 82% of the
         height - solved for both sides rather than derived from one, which is
         what kept landing on 1.57 when the field was shorter than assumed */
      let bw = F.w * 0.62, bh = bw / 1.5;
      if (bh > F.h * 0.82) { bh = F.h * 0.82; bw = bh * 1.5; }
      state.w = Math.max(FR_MIN, Math.min(1, bw / F.w));
      state.h = Math.max(FR_MIN, Math.min(1, bh / F.h));
    }
    const B = box(F);

    /* THE WORLD IS EVERYWHERE, AND THE FRAME IS THE ONLY BRIGHT PART OF IT.
       The dim used to cover the field only, so the landscape outside the field
       stayed at full strength and competed with the thing inside the frame -
       the cut did not read as a cut. Everything is knocked back; the frame is
       painted again over the top. */
    terrain(ctx, F);
    ctx.save();
    ctx.fillStyle = 'rgba(8,10,9,0.74)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    /* and again inside the frame, at full strength - the frame does not
       change the world, it decides how much of it you are given */
    ctx.save();
    ctx.beginPath();
    ctx.rect(B.x, B.y, B.w, B.h);
    ctx.clip();
    ctx.fillStyle = p.inset;
    ctx.fillRect(B.x, B.y, B.w, B.h);
    terrain(ctx, F);
    ctx.restore();

    /* the field's own edge, so the room can see what is being cut from */
    line(ctx, F.x, F.y, F.x + F.w, F.y, p.rule, [3, 4]);
    line(ctx, F.x, F.y, F.x, F.y + F.h, p.rule, [3, 4]);
    line(ctx, F.x + F.w, F.y, F.x + F.w, F.y + F.h, p.rule, [3, 4]);
    line(ctx, F.x, F.y + F.h, F.x + F.w, F.y + F.h, p.rule, [3, 4]);

    ctx.save();
    ctx.strokeStyle = p.fg;
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(B.x) + 1, Math.round(B.y) + 1,
                   Math.round(B.w) - 2, Math.round(B.h) - 2);
    ctx.restore();

    /* THE PINNED CORNER, marked. A corner that cannot move should say so, or
       the first thing anybody tries is to drag it. */
    ctx.save();
    ctx.strokeStyle = p.muted;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(B.x, B.y + 16); ctx.lineTo(B.x, B.y); ctx.lineTo(B.x + 16, B.y);
    ctx.stroke();
    ctx.restore();

    /* the handle */
    const hx = B.x + B.w, hy = B.y + B.h, r = state.hot ? 9 : 7;
    ctx.save();
    ctx.fillStyle = p.marker;
    ctx.fillRect(hx - r, hy - r, r * 2, r * 2);
    ctx.strokeStyle = p.stage; ctx.lineWidth = 1.5;
    ctx.strokeRect(hx - r, hy - r, r * 2, r * 2);
    ctx.restore();

    /* X down the right, Y across the bottom - his own slide's labelling */
    const gap = 20;
    arrow(ctx, hx + gap, B.y, hx + gap, hy, p.fg);
    label(ctx, 'X', hx + gap + 9, (B.y + hy) / 2 + 4, p.fg, 12);
    arrow(ctx, B.x, hy + gap, hx, hy + gap, p.fg);
    label(ctx, 'Y', (B.x + hx) / 2, hy + gap + 18, p.fg, 12, 'center');

    /* clear of the Y arrow, which runs along the bottom of the frame */
    keyRow(ctx, F.x + F.w * 0.72, F.y + F.h + 22,
           [[['◀', '▶'], 'width'], [['▲', '▼'], 'height']],
           p.fg, p.muted);

    sync(F);
  }

  /* ---- what the two numbers come to ---- */
  function ratio(w, h) {
    const r = w / h;
    /* the names a photographer already has for these shapes, and only when it
       really is one - 1.49 is not 3:2 and saying so would teach the wrong thing */
    const known = [[1, '1:1'], [5 / 4, '5:4'], [4 / 3, '4:3'], [1.5, '3:2'],
                   [16 / 9, '16:9'], [1.85, '1.85:1'], [2.39, '2.39:1'],
                   [0.8, '4:5'], [0.75, '3:4'], [2 / 3, '2:3'], [9 / 16, '9:16']];
    for (const [v, name] of known) if (Math.abs(r - v) < 0.012) return name;
    return r.toFixed(2) + (r >= 1 ? ' : 1' : '');
  }

  function sync(F) {
    const B = box(F);
    const r = ratio(B.w, B.h);
    /* the sentence, in the instrument's own terms: the shape, and then the two
       numbers it came out of - which is the whole lesson of the page */
    /* THE SHAPE, AND NOT THE PIXELS. The two sides are given in ONE unit -
       the height of the field is a hundred - so the pair and the ratio beside
       it agree with each other: 150 x 100 is 3:2 and can be checked by eye.
       Read them as a share of each axis instead and they do not agree (a 3:2
       frame in a wide field came out "49% x 82%"), which reads as a fault in
       the instrument. Nothing here is a pixel count: "Remove pixel
       information", his round of 09-09-2026. Padded to three characters so
       the cell cannot change width as the numbers run (S18). */
    const u = (v) => String(Math.round(v)).padStart(3, ' ');
    out.wh.textContent = u(B.w / F.h * 100) + ' · ' + u(B.h / F.h * 100);
    out.ar.textContent = r;
  }

  /* ---- dragging the corner, and nothing else ---- */
  const clamp = (v) => Math.max(FR_MIN, Math.min(1, v));
  /* THE JUMP. dragArea reports the distance from where the hand GRABBED, not
     from the last move - so adding it to the frame on every pointermove added
     the same distance again and again and the corner ran away from the
     cursor. His round of 09-09-2026: "Drag option works very buggy and
     jumpy." The size at the moment of the grab is kept, and every move sets
     the frame from that, so the corner stays under the hand. */
  let grabW = 0, grabH = 0;
  dragArea(view.canvas, (dx, dy, start) => {
    if (start) { grabW = state.w; grabH = state.h; return; }
    state.set = true;                       /* the hand takes over from 3:2 */
    /* the corner is half the frame away from the centre, so a hand that moves
       one step out opens the frame by two */
    state.w = clamp(grabW + dx * 2 * (1 / 0.80));
    state.h = clamp(grabH + dy * 2 * (1 / 0.80));
    view.render();
  });
  view.canvas.addEventListener('pointermove', (e) => {
    const r = view.canvas.getBoundingClientRect();
    const F = field(r.width, r.height), B = box(F);
    const near = Math.hypot(e.clientX - r.left - (B.x + B.w),
                            e.clientY - r.top - (B.y + B.h)) < 26;
    if (near !== state.hot) {
      state.hot = near;
      view.canvas.style.cursor = near ? 'nwse-resize' : '';
      view.render();
    }
  });
  view.canvas.addEventListener('pointerleave', () => {
    if (state.hot) { state.hot = false; view.render(); }
  });

  /* the arrows, for a hand that wants one pixel rather than a drag */
  const STEP = 0.02;
  stage.tabIndex = 0;
  const mine = () => fig.contains(document.activeElement) || fig.matches(':hover');
  window.addEventListener('keydown', (e) => {
    if (!mine() || e.altKey || e.metaKey || e.ctrlKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    let hit = true;
    state.set = true;
    if (e.key === 'ArrowRight') state.w = clamp(state.w + STEP);
    else if (e.key === 'ArrowLeft') state.w = clamp(state.w - STEP);
    else if (e.key === 'ArrowDown') state.h = clamp(state.h + STEP);
    else if (e.key === 'ArrowUp') state.h = clamp(state.h - STEP);
    else hit = false;
    if (!hit) return;
    e.preventDefault(); e.stopImmediatePropagation();
    view.render();
  }, true);

  return { render: view.render };
}

window.mountFrame = mountFrame;
