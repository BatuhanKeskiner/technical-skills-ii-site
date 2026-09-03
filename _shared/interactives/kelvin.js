/* ============================================================
   A4.1 · Colour temperature and white balance
   Set the light, then set the camera. When they match you get
   neutral; when they disagree you get the look.
   ============================================================ */

const PRESETS = [
  { name: 'Match', light: 5500, cam: 5500, tint: 0 },
  { name: 'Tungsten room', light: 2800, cam: 5500, tint: 0 },
  { name: 'Shade, warmed', light: 7500, cam: 5500, tint: 0 },
  { name: 'Fluorescent', light: 4200, cam: 4200, tint: -28 },
];

function mountKelvin(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const state = { light: 2800, cam: 5500, tint: 0 };
  const view = canvas(stage, draw);

  const fLight = slider(controls, { label: 'Light source', min: 1800, max: 9000, step: 50, value: state.light, unit: ' K', cls: 'film' });
  const fCam = slider(controls, { label: 'Camera white balance', min: 1800, max: 9000, step: 50, value: state.cam, unit: ' K', cls: 'digital' });
  const fTint = slider(controls, { label: 'Tint · green ↔ magenta', min: -60, max: 60, step: 1, value: state.tint, cls: 'cinema' });

  states(controls, {
    label: 'Presets', cls: 'span1', items: PRESETS.map((x) => x.name),
    onChange: (i) => {
      const q = PRESETS[i];
      fLight.value = q.light; fCam.value = q.cam; fTint.value = q.tint;
      [fLight, fCam, fTint].forEach((s) => s._sync());
      pull(); view.render();
    },
  });
  const group = controls.querySelector('.states');

  legend(stage, [
    { c: p.film, label: 'Light', val: 'K' },
    { c: p.digital, label: 'Camera', val: 'K' },
    { c: p.muted, label: 'Neutral patch', kind: 'dash' },
  ]);

  const out = readout(fig, [
    { id: 'light', key: 'Light', cls: 'c' },
    { id: 'cam', key: 'Camera', cls: 'c' },
    { id: 'shift', key: 'Shift', cls: 'delta' },
    { id: 'verdict', key: 'Result', cls: 'sm' },
  ], 'four');
  out.light.style.setProperty('--c', p.film);
  out.cam.style.setProperty('--c', p.digital);

  fsButton(stage, fig);

  [fLight, fCam, fTint].forEach((i) => i.addEventListener('input', () => { pull(); view.render(); }));

  function pull() {
    state.light = +fLight.value;
    state.cam = +fCam.value;
    state.tint = +fTint.value;
    compute();
  }

  /* mireds are the perceptually even unit for a white-balance error */
  const mired = (k) => 1e6 / k;

  function compute() {
    const d = mired(state.light) - mired(state.cam);
    out.light.innerHTML = state.light + '<span class="u">K</span>';
    out.cam.innerHTML = state.cam + '<span class="u">K</span>';
    out.shift.innerHTML = (d > 0 ? '+' : '') + d.toFixed(0) + '<span class="u">mired</span>';
    out.shift.classList.toggle('up', d < -4);
    out.shift.classList.toggle('down', d > 4);
    const mag = Math.abs(d);
    out.verdict.textContent = mag < 6
      ? (Math.abs(state.tint) < 6 ? 'Neutral' : 'Neutral, tinted')
      : (d > 0 ? 'Warm cast' : 'Cool cast') + (mag > 90 ? ' — strong' : '');
  }

  /* The correction the camera applies is the inverse of the WB it is set to,
     so the rendered colour is scene × light ÷ camera. */
  function renderGain() {
    const L = kelvinRGB(state.light);
    const C = kelvinRGB(state.cam);
    const t = state.tint / 100;
    const g = [
      (L[0] / C[0]) * (1 + Math.max(0, -t) * 0.55),
      (L[1] / C[1]) * (1 + Math.max(0, t) * 0.45),
      (L[2] / C[2]) * (1 + Math.max(0, -t) * 0.55),
    ];
    const norm = (g[0] + g[1] + g[2]) / 3;
    return g.map((v) => v / norm);
  }

  function tone(base, gain) {
    return 'rgb(' + base.map((v, i) => Math.round(Math.max(0, Math.min(255, v * gain[i])))).join(',') + ')';
  }

  const PATCHES = [
    { name: 'White', rgb: [242, 242, 240] },
    { name: 'Grey 18%', rgb: [119, 119, 119] },
    { name: 'Skin', rgb: [214, 168, 138] },
    { name: 'Black', rgb: [42, 44, 43] },
    { name: 'Cyan', rgb: [72, 168, 180] },
    { name: 'Red', rgb: [186, 66, 44] },
  ];

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const gain = renderGain();

    const scaleH = 64;
    const sceneH = h - scaleH;
    drawScene(ctx, w, sceneH, gain);
    line(ctx, 0, sceneH, w, sceneH, p.rule);
    drawScale(ctx, w, sceneH, scaleH);
  }

  function drawScene(ctx, w, h, gain) {
    const pad = 24;
    const fw = Math.min(w - pad * 2, (h - pad * 2) * 1.5);
    const fh = fw / 1.5;
    const x0 = (w - fw) / 2;
    const y0 = (h - fh) / 2;

    /* the room, lit by the source and corrected by the camera */
    ctx.fillStyle = tone([176, 172, 164], gain);
    ctx.fillRect(x0, y0, fw, fh);

    /* a window, always daylight — so a mismatch is visible against it */
    const wx = x0 + fw * 0.06, wy = y0 + fh * 0.12, ww = fw * 0.26, wh = fh * 0.5;
    const dayGain = (() => {
      const L = kelvinRGB(5600), C = kelvinRGB(state.cam);
      const g = [L[0] / C[0], L[1] / C[1], L[2] / C[2]];
      const n = (g[0] + g[1] + g[2]) / 3;
      return g.map((v) => v / n);
    })();
    ctx.fillStyle = tone([236, 240, 245], dayGain);
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = 'rgba(11,12,12,0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.beginPath();
    ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
    ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2);
    ctx.stroke();
    label(ctx, 'DAYLIGHT 5600 K', wx, wy - 7, 'rgba(11,12,12,0.7)', 9);

    /* the patch chart */
    const cols = 3, rows = 2;
    const cw = fw * 0.42 / cols, chh = fh * 0.46 / rows;
    const px0 = x0 + fw * 0.48, py0 = y0 + fh * 0.16;
    PATCHES.forEach((patch, i) => {
      const cx = px0 + (i % cols) * cw;
      const cy = py0 + Math.floor(i / cols) * chh;
      ctx.fillStyle = tone(patch.rgb, gain);
      ctx.fillRect(cx, cy, cw - 4, chh - 4);
      if (patch.name === 'Grey 18%') {
        ctx.save();
        ctx.strokeStyle = p.paper;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx + 1, cy + 1, cw - 6, chh - 6);
        ctx.restore();
      }
      label(ctx, patch.name.toUpperCase(), cx, cy + chh + 6, 'rgba(11,12,12,0.65)', 8);
    });

    /* a lamp, tinted by its own source */
    const lx = x0 + fw * 0.16, ly = y0 + fh * 0.78;
    const lampRGB = kelvinRGB(state.light);
    ctx.fillStyle = tone(lampRGB, gain);
    ctx.beginPath();
    ctx.moveTo(lx - 26, ly);
    ctx.lineTo(lx + 26, ly);
    ctx.lineTo(lx + 16, ly - 30);
    ctx.lineTo(lx - 16, ly - 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(11,12,12,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    label(ctx, state.light + ' K', lx, ly + 15, 'rgba(11,12,12,0.7)', 9, 'center');

    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x0) + 0.5, Math.round(y0) + 0.5, Math.round(fw), Math.round(fh));
    label(ctx, 'RENDERED FRAME', x0, y0 - 8, p.muted, 9);
  }

  function drawScale(ctx, w, top, h) {
    const padL = 44, padR = 44;
    const y = top + 18;
    const bw = w - padL - padR;
    const kMin = 1800, kMax = 9000;
    const x = (k) => padL + ((k - kMin) / (kMax - kMin)) * bw;

    for (let i = 0; i <= bw; i += 2) {
      const k = kMin + (i / bw) * (kMax - kMin);
      const c = kelvinRGB(k);
      ctx.fillStyle = 'rgb(' + c.map(Math.round).join(',') + ')';
      ctx.fillRect(padL + i, y, 2.5, 16);
    }
    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(padL) + 0.5, Math.round(y) + 0.5, Math.round(bw), 16);

    [[state.light, p.film, 'LIGHT'], [state.cam, p.digital, 'CAMERA']].forEach(([k, col, name], i) => {
      const mx = x(k);
      line(ctx, mx, y - 6, mx, y + 22, col);
      ctx.fillStyle = col;
      ctx.fillRect(mx - 3, i === 0 ? y - 9 : y + 19, 6, 4);
      label(ctx, name, mx, i === 0 ? y - 13 : y + 34, col, 9, 'center');
    });

    label(ctx, kMin + ' K', padL, y + 30, p.muted, 9);
    label(ctx, kMax + ' K', padL + bw, y + 30, p.muted, 9, 'right');
  }

  [...group.children][1].click();
  pull();
  return { render: view.render };
}

window.mountKelvin = mountKelvin;
