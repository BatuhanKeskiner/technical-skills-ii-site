/* ============================================================
   A · Why A4 Is That Shape
   ------------------------------------------------------------
   Fold a sheet in half across its long side. On almost every
   shape you get a different shape. On one shape you get the same
   shape again, and that shape is the A series — which is why a
   poster reduces onto a flyer with nothing left over, why a book
   is imposed two-up on a bigger sheet, and why A4 is the size of
   almost every piece of paper anyone hands you.

   His ask, 09-09-2026: "A4'ün neden bu şekilde olduğunu
   anlatacağım. O yüzden A4 ve katlama animasyonu gibi bişey
   güzel olur."

   The instrument does not name the ratio and does not say the
   words square root — that is his to say in the room. It folds,
   and the numbers underneath are the real millimetres of the
   real sizes, so the shape can be checked rather than believed.
   ============================================================ */

/* the ISO 216 sizes, in millimetres, as they are actually cut */
const AS_A = [
  { n: 'A0', w: 841, h: 1189 }, { n: 'A1', w: 594, h: 841 },
  { n: 'A2', w: 420, h: 594 }, { n: 'A3', w: 297, h: 420 },
  { n: 'A4', w: 210, h: 297 }, { n: 'A5', w: 148, h: 210 },
  { n: 'A6', w: 105, h: 148 }, { n: 'A7', w: 74, h: 105 },
  { n: 'A8', w: 52, h: 74 },
];
/* AND A SHEET THAT DOES NOT SURVIVE IT. A 2:3 sheet halved gives 3:4, halved
   again gives 2:3 — it alternates between two shapes for ever, which is why
   nothing is filed in it. Started at the same area as A0. */
function asOther(step) {
  let w = 794, h = 1191;                     /* 2:3, about one square metre */
  for (let i = 0; i < step; i++) { const nw = h / 2; h = w; w = nw; }
  return { n: 'Fold ' + step, w: Math.round(w), h: Math.round(h) };
}

function mountASeries(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'A Series'),
              el('span', 'ts-sub', 'fold · halve · the same shape'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { step: 0, series: 'a', t: 1, anim: null };
  const sheet = (i) => (state.series === 'a' ? AS_A[Math.min(i, AS_A.length - 1)] : asOther(i));
  const maxStep = () => (state.series === 'a' ? AS_A.length - 1 : 8);

  const view = canvas(stage, draw);

  /* ONE THING TO DO, AND IT IS THE LESSON. Fold, and watch the shape. */
  const fold = el('div', 'ctl one');
  fold.append(el('label', null, 'The sheet, and what you do to it'));
  const fRow = el('div', 'states');
  const bFold = el('button', 'st', 'Fold in half');
  const bFlat = el('button', 'st', 'Unfold');
  [bFold, bFlat].forEach((b) => { b.type = 'button'; fRow.append(b); });
  fold.append(fRow); controls.append(fold);

  const bA0 = el('button', 'st', 'A0');
  const b23 = el('button', 'st', 'A 2:3 sheet');
  [bA0, b23].forEach((b) => { b.type = 'button'; fRow.append(b); });
  const pick = (which) => {
    state.series = which; state.step = 0; state.t = 1;
    bA0.setAttribute('aria-current', String(which === 'a'));
    b23.setAttribute('aria-current', String(which === 'o'));
    sync();
  };
  bA0.addEventListener('click', () => pick('a'));
  b23.addEventListener('click', () => pick('o'));
  bA0.setAttribute('aria-current', 'true');
  b23.setAttribute('aria-current', 'false');

  /* THE THREE GATES (O1 O2 O3), ANSWERED — two cells.
     The size: nobody sets it, the drawing shows a rectangle but no drawing
     states millimetres, and the millimetres are how a student checks the claim
     against the paper on the desk in front of them. What the fold did: derived
     from the two shapes, not drawn as a comparison, and it is the whole
     answer — the same shape, or a different one. */
  const out = readout(fig, [
    { id: 'size', key: 'The sheet now', cls: 'hi' },
    { id: 'said', key: 'What the fold did' },
  ]);

  fsButton(stage, fig);

  function animate(to) {
    if (state.anim) cancelAnimationFrame(state.anim);
    const from = state.t, t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 420);
      const e = k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2;
      state.t = from + (to - from) * e;
      view.render();
      state.anim = k < 1 ? requestAnimationFrame(step) : null;
    };
    state.anim = requestAnimationFrame(step);
  }

  bFold.addEventListener('click', () => {
    if (state.step >= maxStep()) return;
    state.t = 0;                    /* 0 = flat and about to fold, 1 = folded */
    state.step += 1;
    sync();
    animate(1);
  });
  bFlat.addEventListener('click', () => {
    if (state.step === 0) return;
    state.step = 0; state.t = 1; sync();
  });

  function sync() {
    const s = sheet(state.step);
    bFold.disabled = state.step >= maxStep();
    bFold.classList.toggle('off', bFold.disabled);
    bFlat.disabled = state.step === 0;
    bFlat.classList.toggle('off', bFlat.disabled);
    out.size.innerHTML = s.n + ' · ' + s.w + ' × ' + s.h + '<span class="u">mm</span>';
    if (state.step === 0) {
      out.said.textContent = state.series === 'a'
        ? 'nothing yet — fold it'
        : 'nothing yet — fold it, and watch the shape';
    } else {
      const before = sheet(state.step - 1), now = sheet(state.step);
      const r0 = Math.max(before.w, before.h) / Math.min(before.w, before.h);
      const r1 = Math.max(now.w, now.h) / Math.min(now.w, now.h);
      out.said.textContent = Math.abs(r0 - r1) < 0.02
        ? 'the same shape, half the area'
        : 'a different shape: ' + r1.toFixed(2) + ', was ' + r0.toFixed(2);
    }
    view.render();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const foot = 34, pad = 30;
    /* THE SCALE FOLLOWS THE SHEET BEFORE THE FOLD, not the one you started
       from. Fixed to A0, an A4 is a sixteenth of the area and a postage stamp
       on the wall — true, and unreadable, and this instrument is about A4.
       Scaled to the previous sheet, every fold shows a sheet exactly half the
       area of the outline around it, which is the same lesson at a size the
       room can see. */
    const ref = sheet(Math.max(0, state.step - 1));
    const k = Math.min((w - pad * 2) / ref.w, (h - pad * 2 - foot) / ref.h);
    const cx = w / 2, cy = (h - foot) / 2;

    /* the sheet before this fold, in outline, so the halving is visible */
    if (state.step > 0) {
      const b = sheet(state.step - 1);
      ctx.strokeStyle = p.rule2; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.strokeRect(cx - b.w * k / 2, cy - b.h * k / 2, b.w * k, b.h * k);
      ctx.setLineDash([]);
      label(ctx, b.n, cx - b.w * k / 2, cy - b.h * k / 2 - 8, p.rule2, 10);
    }

    /* THE FOLD ITSELF. At t = 0 the new sheet is still the old one; at t = 1
       it is half of it, turned. The half that goes away is drawn falling. */
    const now = sheet(state.step);
    const from = sheet(Math.max(0, state.step - 1));
    const t = state.step === 0 ? 1 : state.t;
    const cw = from.w + (now.w - from.w) * t;
    const ch = from.h + (now.h - from.h) * t;
    const x = cx - cw * k / 2, y = cy - ch * k / 2;

    if (state.step > 0 && t < 1) {
      /* the leaf that is being folded over, fading as it lands */
      ctx.save();
      ctx.globalAlpha = 0.35 * (1 - t);
      ctx.fillStyle = p.marker;
      ctx.fillRect(cx - from.w * k / 2, cy - from.h * k / 2,
                   from.w * k, from.h * k / 2);
      ctx.restore();
    }

    ctx.fillStyle = p.inset;
    ctx.fillRect(x, y, cw * k, ch * k);
    ctx.strokeStyle = p.marker; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cw * k, ch * k);

    /* where the next fold would go */
    if (state.step < maxStep() && t >= 1) {
      ctx.save();
      ctx.strokeStyle = p.signal; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(x, y + ch * k / 2); ctx.lineTo(x + cw * k, y + ch * k / 2);
      ctx.stroke(); ctx.restore();
      label(ctx, 'FOLD HERE', x + 8, y + ch * k / 2 - 6, p.signal, 9);
    }

    ctx.fillStyle = 'rgba(8,10,9,0.78)';
    ctx.fillRect(x, y, 150, 26);
    label(ctx, now.n + '  ' + now.w + ' × ' + now.h + ' mm', x + 9, y + 17, p.marker, 11);

    /* the whole family, small, along the foot: the series is the point */
    if (state.series === 'a') {
      let lx = 20;
      AS_A.forEach((s, i) => {
        const sw = s.w / AS_A[0].w * 96, sh = s.h / AS_A[0].h * 96;
        ctx.strokeStyle = i === state.step ? p.marker : p.rule;
        ctx.lineWidth = i === state.step ? 1.6 : 1;
        ctx.strokeRect(lx, h - foot + 2 - sh * 0.28, sw * 0.28, sh * 0.28);
        lx += sw * 0.28 + 7;
      });
    }
    label(ctx, state.series === 'a'
      ? 'EVERY FOLD HALVES THE AREA AND KEEPS THE SHAPE'
      : 'EVERY FOLD HALVES THE AREA AND CHANGES THE SHAPE',
      w - 20, h - 12, p.muted, 9, 'right');
  }

  sync();
  return { render: view.render };
}

window.mountASeries = mountASeries;
