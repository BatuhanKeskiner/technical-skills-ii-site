/* ============================================================
   A · Resolution
   ------------------------------------------------------------
   A hundred microns of the surface, drawn: on a sensor that is
   the Bayer grid at its real pixel pitch, on film it is grain at
   the resolving power you set. Beside it, what the two of them
   actually hold — the pixels a sensor has, or the detail a
   negative holds against the pixels a scan makes of it.

   BATU'S OWN MODULE, PORTED (Fig. 3 of the 26-08 Cowork page,
   `_notes/parked/format-module/`). The version written here on
   08-09 was mine and it had no detail in it at all — a stick
   figure beside an empty rectangle, on a page whose entire
   subject is detail. The old brief said so in one line and I
   had read it: "100 µm of the surface; pixels against detail".

   The arithmetic is his and it is honest:
     a sensor's pitch      = image width in µm / pixels across
     its Nyquist limit     = pixels across / (2 × width in mm)
     film held             = area × (2·lp)² — two pixels a line pair
     a scan makes          = (mm/25.4 × dpi)² over the area
   Instant film is fixed at 12 lp/mm because integral film is;
   there is no slider for a thing that does not move.
   ============================================================ */

function mountResolution(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide fm-stage');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Resolution'),
              el('span', 'ts-sub', 'pixels · grain · what a scan makes'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { id: fig.dataset.cam || 'ff', lp: 60, dpi: 3200 };
  const cam = () => CAMS.find((c) => c.id === state.id) || CAMS[4];

  /* the same classified bench as Formats, one selection: this instrument
     answers about one surface at a time */
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

  /* TWO SLIDERS AND BOTH MOVE THE PICTURE. Resolving power redraws the grain;
     the scan redraws the bar it is measured against. On a digital body the
     scan does not apply, and on integral film the resolving power is not a
     thing you set. They used to be HIDDEN in those states, which moved every
     cell to their right the moment a camera was picked; under S18 they keep
     their place and go off instead. */
  const fLp = slider(controls, {
    label: 'Film resolving power', min: 20, max: 150, step: 5, value: 60,
    unit: ' lp/mm', cls: 'one',
  });
  const fDpi = slider(controls, {
    label: 'Scan resolution', min: 600, max: 8000, step: 100, value: 3200,
    unit: ' dpi', cls: 'one',
  });
  fLp.addEventListener('input', () => { state.lp = +fLp.value; view.render(); });
  fDpi.addEventListener('input', () => { state.dpi = +fDpi.value; view.render(); });

  /* THE THREE GATES (O1 O2 O3), ANSWERED — two cells.
     What it holds: nobody sets it; the left panel draws the surface but no
     drawing states a megapixel; and it is the number the argument is about.
     The finest detail it can record: derived from the pitch or the emulsion,
     nowhere in the drawing as a quantity, and it is what decides whether a
     bigger file is a better picture. */
  const out = readout(fig, [
    { id: 'holds', key: 'What it holds', cls: 'hi' },
    { id: 'fine', key: 'Finest detail' },
  ]);

  fsButton(stage, fig);

  function sync() {
    Object.keys(btns).forEach((id) => {
      btns[id].setAttribute('aria-pressed', id === state.id ? 'true' : 'false');
      btns[id].style.setProperty('--c', id === state.id ? p.signal : 'transparent');
    });
    const c = cam(), digital = !!c.px;
    /* the resolving power applies everywhere: on film it is the grain, on a
       sensor it is the film being compared with. Only integral film has none,
       because integral film does not have one to set. */
    ctlOff(fLp, !!c.lpFixed);
    ctlOff(fDpi, digital);
    view.render();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const c = cam(), digital = !!c.px;
    const lp = c.lpFixed || state.lp, dpi = state.dpi;

    /* ---- left: a hundred microns of the surface ---- */
    const gap = 26, half = (w - gap * 3) / 2;
    const sq = Math.min(half, h - 118);
    const gx = gap + (half - sq) / 2, gy = 44, k = sq / 100;

    /* not uppercased: µ has no capital that means micro */
    label(ctx, '100 µm × 100 µm of the ' + (digital ? 'SENSOR' : 'FILM'),
          gap, 22, p.muted, 9);

    ctx.save();
    ctx.beginPath(); ctx.rect(gx, gy, sq, sq); ctx.clip();
    ctx.fillStyle = '#0C0D10'; ctx.fillRect(gx, gy, sq, sq);
    let pitch = 0, lpmm = 0, grain = 0;
    if (digital) {
      /* the Bayer mosaic at its real pitch: two greens to a red and a blue */
      pitch = c.w * 1000 / c.px[0];
      const cell = pitch * k, n = Math.ceil(100 / pitch) + 1;
      const bayer = [['#7A3A2E', '#3F6B3A'], ['#3F6B3A', '#2E4A7A']];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          ctx.fillStyle = bayer[j % 2][i % 2];
          ctx.fillRect(gx + i * cell + 1, gy + j * cell + 1,
                       Math.max(1, cell - 2), Math.max(1, cell - 2));
        }
      }
      lpmm = c.px[0] / (2 * c.w);
    } else {
      /* grain, seeded off the resolving power so the same setting always
         draws the same film rather than a new random one every frame */
      grain = 1000 / (2 * lp);
      let a = Math.round(lp) * 7919 + 17;
      const rnd = () => {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
      const count = Math.round(10000 / (grain * grain) * 0.9);
      for (let i = 0; i < count; i++) {
        const x = rnd() * 100, y = rnd() * 100;
        const r = grain * (0.45 + rnd() * 0.35), al = 0.35 + rnd() * 0.5;
        ctx.fillStyle = 'rgba(215,205,190,' + al.toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(gx + x * k, gy + y * k, r * k, 0, Math.PI * 2); ctx.fill();
      }
      lpmm = lp;
    }
    ctx.restore();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(gx + 0.5, gy + 0.5, sq - 1, sq - 1);
    line(ctx, gx, gy + sq + 14, gx + 10 * k, gy + sq + 14, p.muted);
    label(ctx, '10 µm', gx + 10 * k + 8, gy + sq + 18, p.muted, 9);
    label(ctx, digital
      ? 'PIXEL PITCH ' + pitch.toFixed(2) + ' µm · ' + (1000 / pitch).toFixed(0) + ' PX PER MM'
      : 'GRAIN / DETAIL ≈ ' + grain.toFixed(1) + ' µm AT ' + lp + ' LP/MM'
        + (c.lpFixed ? ' (INTEGRAL FILM — FIXED)' : ''),
      gx, gy + sq + 38, p.muted, 9);

    /* ---- right: pixels against detail ---- */
    const qx = gap * 2 + half;
    line(ctx, qx - gap / 2, 30, qx - gap / 2, h - 24, p.rule);
    label(ctx, 'PIXELS AGAINST DETAIL', qx, 22, p.muted, 9);
    const bx = qx, bw = half, maxMP = 160, barH = 30;
    const bar = (y, mp, col, lab, sub) => {
      const bwi = Math.min(bw, bw * mp / maxMP);
      ctx.fillStyle = p.wash; ctx.fillRect(bx, y, bw, barH);
      ctx.fillStyle = col; ctx.fillRect(bx, y, bwi, barH);
      label(ctx, lab.toUpperCase(), bx, y - 7, p.muted, 9);
      const right = bx + bwi + 10 > bx + bw - 120;
      label(ctx, sub, right ? bx + bw - 4 : bx + bwi + 10, y + barH / 2 + 4,
            p.fg, 12, right ? 'right' : 'left');
    };

    if (digital) {
      const mp = c.px[0] * c.px[1] / 1e6;
      bar(gy + 34, mp, p.signal, 'The sensor has · ' + c.px[0] + ' × ' + c.px[1],
          mp.toFixed(1) + ' MP');
      /* AND WHAT FILM WOULD HOLD ON THE SAME AREA — the comparison the lecture
         makes in words, drawn, and the reason the resolving-power slider
         belongs on a digital body too. */
      bar(gy + 114, fmFilmMP(c, state.lp), p.rule2,
          'Film on the same area · at ' + state.lp + ' lp/mm',
          '≈ ' + fmFilmMP(c, state.lp).toFixed(0) + ' MP of detail');
      label(ctx, 'NYQUIST LIMIT ' + lpmm.toFixed(0) + ' LP/MM', bx, gy + 186, p.signal, 9);
      label(ctx, 'THE FINEST PATTERN ' + (1000 / pitch).toFixed(0)
            + ' PIXELS PER MILLIMETRE CAN RECORD.', bx, gy + 204, p.muted, 9);
      out.holds.innerHTML = mp.toFixed(0) + '<span class="u">MP</span>';
      out.fine.innerHTML = lpmm.toFixed(0) + '<span class="u">lp/mm</span> · pitch '
        + pitch.toFixed(1) + ' µm';
    } else {
      const held = fmFilmMP(c, lp);
      const scan = (c.w / 25.4 * dpi) * (c.h / 25.4 * dpi) / 1e6;
      bar(gy + 34, held, p.signal, 'The film holds · at ' + lp + ' lp/mm',
          '≈ ' + held.toFixed(0) + ' MP of detail');
      bar(gy + 114, scan, p.rule2, 'The scan makes · ' + dpi + ' dpi',
          scan.toFixed(0) + ' MP of pixels');
      /* THE SENTENCE THE INSTRUMENT EXISTS FOR: a file with more pixels than
         the negative has detail is a file recording grain. */
      const verdict = scan > held * 1.15
        ? 'MORE PIXELS THAN DETAIL — THE EXTRA PIXELS RECORD GRAIN, NOT THE PICTURE.'
        : scan < held * 0.85
          ? 'THE SCAN IS THE LIMIT — THE NEGATIVE HOLDS MORE THAN THIS FILE.'
          : 'SCAN AND FILM ARE MATCHED.';
      label(ctx, verdict, bx, gy + 186, p.signal, 9);
      out.holds.innerHTML = '≈ ' + held.toFixed(0) + '<span class="u">MP</span>';
      out.fine.innerHTML = lp + '<span class="u">lp/mm</span> · grain '
        + grain.toFixed(1) + ' µm';
    }
    label(ctx, 'BARS TO ' + maxMP + ' MP', bx, h - 14, p.rule2, 9);
  }

  sync();
  return { render: view.render };
}

window.mountResolution = mountResolution;
