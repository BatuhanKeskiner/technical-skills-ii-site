/* ============================================================
   A · Crop Factor
   ------------------------------------------------------------
   A lens projects a circle. The format cuts a rectangle out of
   it. Nothing is magnified — the smaller rectangle simply cuts
   less, and is shown at the same size afterwards, which is the
   whole of the "crop factor" and the reason it is a drawing
   rather than a number.

   Left: what the lens actually projects, with everything outside
   the image circle darkened, full frame dashed and the chosen
   format solid. Right: the photograph that format makes with
   that lens. Move the lens and both change together.

   BATU'S OWN MODULE, PORTED (Fig. 4 of the 26-08 Cowork page).
   Crop factor lives HERE and nowhere earlier: on 08-09 he found
   it in the Formats instrument, on a page the course reaches
   weeks before it teaches this, and the rule is now A5 — nothing
   on an instrument that the course has not taught yet.
   ============================================================ */

function mountCrop(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide fm-stage');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Crop Factor'),
              el('span', 'ts-sub', 'image circle · format · equivalent'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { id: fig.dataset.cam || 'apsc', f: 35 };
  const cam = () => CAMS.find((c) => c.id === state.id) || CAMS[3];
  const FF = () => CAMS.find((c) => c.id === 'ff');

  /* the same classified bench, one pick: this instrument is about one format
     against full frame, which is what a crop factor is measured from */
  const row = el('div', 'fm-row');
  const bench = el('div', 'fm-bench');
  const picBox = el('div', 'fm-pic');
  row.append(bench, picBox);
  stage.append(row);

  const btns = {};
  FM_KINDS.forEach((k) => {
    bench.append(el('div', 'fm-h', k.name));
    CAMS.filter((c) => c.kind === k.id).forEach((c) => {
      const b = el('button', 'fm-i');
      b.type = 'button';
      b.append(el('span', 'fm-dot'), el('span', 'fm-n', c.name),
               el('span', 'fm-s', c.sub.split(' · ')[0]));
      b.addEventListener('click', () => { state.id = c.id; sync(); });
      bench.append(b);
      btns[c.id] = b;
    });
  });

  const view = canvas(picBox, draw);

  const fLens = slider(controls, {
    label: 'Lens', min: 8, max: 300, step: 1, value: state.f, unit: ' mm', cls: 'one',
  });
  fLens.addEventListener('input', () => { state.f = +fLens.value; sync(); });

  /* A NORMAL LENS IS THE DIAGONAL, whatever the format — one press rather than
     a number to remember, and the button says what it will do next. */
  const nCell = el('div', 'ctl one');
  nCell.append(el('label', null, 'A normal lens'));
  const nRow = el('div', 'states');
  const bNorm = el('button', 'st', 'Set it');
  bNorm.type = 'button';
  nRow.append(bNorm); nCell.append(nRow); controls.append(nCell);
  bNorm.addEventListener('click', () => {
    state.f = Math.round(Math.hypot(cam().w, cam().h));
    fLens.value = String(state.f); fLens._sync(); sync();
  });

  /* THE THREE GATES (O1 O2 O3), ANSWERED — two cells.
     The equivalent lens: nobody sets it, no drawing states a focal length,
     and it is the number a photographer multiplies by when they buy or
     borrow a lens. The angle of view: derived from the format and the lens
     together, not drawn as a quantity, and it is what the equivalence is
     equivalent ABOUT. Crop factor itself is on the drawing, between the two
     rectangles, where it can be seen rather than quoted. */
  const out = readout(fig, [
    { id: 'eq', key: 'The same view on full frame', cls: 'hi' },
    { id: 'aov', key: 'Angle of view' },
  ]);

  fsButton(stage, fig);

  function sync() {
    Object.keys(btns).forEach((id) => {
      btns[id].setAttribute('aria-pressed', id === state.id ? 'true' : 'false');
      btns[id].style.setProperty('--c', id === state.id ? p.signal : 'transparent');
    });
    const c = cam(), cf = Math.hypot(36, 24) / Math.hypot(c.w, c.h);
    bNorm.setAttribute('aria-pressed',
      String(Math.abs(state.f - Math.hypot(c.w, c.h)) < 1.5));
    out.eq.innerHTML = Math.round(state.f * cf) + '<span class="u">mm</span>';
    out.aov.innerHTML = (2 * Math.atan(c.w / (2 * state.f)) * 180 / Math.PI).toFixed(1)
      + '<span class="u">°</span> across';
    view.render();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const F = cam(), ff = FF(), f = state.f;
    const gap = 24, half = (w - gap * 3) / 2;

    /* ---- left: what the lens projects ---- */
    label(ctx, 'WHAT THE LENS PROJECTS · ' + f + ' MM', gap, 20, p.muted, 9);
    const vw = Math.max(ff.w, F.w) * 1.22, vh = Math.max(ff.h, F.h) * 1.22;
    const [ix, iy, iw, ih] = fitBox(gap, 34, half, h - 60, vw, vh);
    renderScene(ctx, ix, iy, iw, ih, f, vw, vh);
    const kx = iw / vw, ky = ih / vh, cx = ix + iw / 2, cy = iy + ih / 2;
    const R = Math.max(Math.hypot(ff.w, ff.h), Math.hypot(F.w, F.h)) / 2 * 1.03;
    ctx.save();
    ctx.beginPath(); ctx.rect(ix, iy, iw, ih);
    ctx.ellipse(cx, cy, R * kx, R * ky, 0, 0, Math.PI * 2);
    ctx.clip('evenodd');
    ctx.fillStyle = 'rgba(10,11,13,.86)'; ctx.fillRect(ix, iy, iw, ih);
    ctx.restore();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, R * kx, R * ky, 0, 0, Math.PI * 2); ctx.stroke();
    const rect = (Fm, col, lw, dash) => {
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []);
      ctx.strokeRect(cx - Fm.w / 2 * kx, cy - Fm.h / 2 * ky, Fm.w * kx, Fm.h * ky);
      ctx.setLineDash([]);
    };
    if (F.id !== 'ff') rect(ff, p.fg, 1.5, [6, 4]);
    rect(F, p.signal, 2.5);
    label(ctx, F.name, cx - F.w / 2 * kx, cy - F.h / 2 * ky - 8, p.signal, 11);
    if (F.id !== 'ff') {
      label(ctx, 'Full frame', cx + ff.w / 2 * kx, cy + ff.h / 2 * ky + 16,
            p.fg, 10, 'right');
    }
    label(ctx, 'IMAGE CIRCLE', ix + 8, iy + ih - 10, p.rule2, 9);

    /* ---- right: the photograph that format makes ---- */
    const qx = gap * 2 + half;
    line(ctx, qx - gap / 2, 28, qx - gap / 2, h - 20, p.rule);
    label(ctx, 'RESULT · ' + F.name.toUpperCase() + ' · ' + f + ' MM', qx, 20, p.muted, 9);
    const [jx, jy, jw, jh] = fitBox(qx, 34, half, h - 60, F.w, F.h);
    renderScene(ctx, jx, jy, jw, jh, f, F.w, F.h);
    ctx.strokeStyle = p.signal; ctx.lineWidth = 2;
    ctx.strokeRect(jx + 1, jy + 1, jw - 2, jh - 2);
    label(ctx, 'NOTHING IS MAGNIFIED — IT SIMPLY CUTS LESS', qx, h - 8, p.rule2, 9);
  }

  sync();
  return { render: view.render };
}

window.mountCrop = mountCrop;
