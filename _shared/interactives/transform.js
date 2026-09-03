/* ============================================================
   A1 · Transformation — 3D open world → 2D constrained frame
   The stage is the world: the panorama the camera is standing
   in, thrown out of focus so it reads as surroundings rather
   than as a picture. The camera stands in front of it, cut off
   at the bottom edge, and on its screen is the only thing that
   will survive: one rectilinear frame.
     Pan · tilt on the round pad, or by dragging the picture.
     Zoom on the slider — 14 to 200 mm on a 36 mm frame.
   Full screen keeps the stage's proportions, so the
   composition on the wall is the composition on the laptop.
   ============================================================ */

const T_STAGE_AR = 1012 / 600;
const T_F_MIN = 14, T_F_MAX = 200;
const T_TILT = 30;                 /* the panorama's usable pitch, degrees */
/* the camera's own picture: the body inside the product shot, and the
   glass panel on the back of it, both in the file's own pixels */
const T_BODY = { x: 0, y: 150, w: 1000, h: 850 };
const T_SCREEN = { x: 120, y: 437, w: 500, h: 356 };

function mountTransform(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { pan: 0, tilt: 0, f: 50 };

  /* The stage takes whatever shape the page gives it, and the drawing
     fills it. Full screen is the one exception: it keeps the shape the
     stage had, so the composition on the wall is the composition on the
     laptop rather than a different picture. */
  let stageAr = T_STAGE_AR;
  const onScreen = () => document.fullscreenElement === fig || fig.classList.contains('fs-on');
  function frame(w, h) {
    if (!onScreen()) { stageAr = w / h; return { x: 0, y: 0, w, h }; }
    return frameIn(w, h, stageAr);
  }


  const pano = panorama('assets/a1-scene.jpg', 0.6, () => view.render());
  let camCut = null;
  loadImage('assets/a1-camera-back.jpg', (box) => { camCut = keyWhite(box.img); view.render(); });

  const view = canvas(stage, draw);

  const pad = padControl(controls, {
    label: 'Pan · tilt',
    onChange: (x, y) => {
      state.pan = Math.round(x * 180);
      state.tilt = Math.round(-y * T_TILT);
      view.render();
    },
  });

  const fZoom = slider(controls, {
    label: 'Zoom', min: 0, max: 1000, step: 1,
    value: Math.round(1000 * Math.log(50 / T_F_MIN) / Math.log(T_F_MAX / T_F_MIN)),
    format: (v) => fFromSlider(v) + ' mm',
  });
  fZoom.addEventListener('input', () => { state.f = fFromSlider(+fZoom.value); view.render(); });

  const out = readout(fig, [
    { id: 'pan', key: 'Pan' },
    { id: 'tilt', key: 'Tilt' },
    { id: 'focal', key: 'Focal length', cls: 'hi' },
    { id: 'aov', key: 'Angle of view' },
  ], 'four');

  fsButton(stage, fig);

  /* dragging the world is the same gesture as pushing the pad */
  let from = null;
  dragArea(view.canvas, (dx, dy, start) => {
    if (start) { from = { pan: state.pan, tilt: state.tilt }; return; }
    let pan = Math.round(from.pan + dx * 260);
    pan = ((pan + 180) % 360 + 360) % 360 - 180;
    state.pan = pan;
    state.tilt = Math.max(-T_TILT, Math.min(T_TILT, Math.round(from.tilt - dy * 140)));
    view.render();
  });

  function fFromSlider(v) {
    return Math.round(T_F_MIN * Math.pow(T_F_MAX / T_F_MIN, v / 1000));
  }
  const rad = (d) => d * Math.PI / 180;
  const hfov = () => 2 * Math.atan(18 / state.f);

  function sync() {
    out.pan.textContent = state.pan + '°';
    out.tilt.textContent = state.tilt + '°';
    out.focal.innerHTML = state.f + '<span class="u">mm</span>';
    out.aov.textContent = Math.round(hfov() * 180 / Math.PI) + '°';
    pad.out.textContent = state.pan + '° · ' + state.tilt + '°';
    pad.place(state.pan / 180, -state.tilt / T_TILT);
  }

  /* ---- drawing ---- */
  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const F = frame(w, h);

    ctx.save();
    ctx.beginPath();
    ctx.rect(F.x, F.y, F.w, F.h);
    ctx.clip();
    drawWorld(ctx, F);
    drawCamera(ctx, F);
    ctx.restore();

    /* the letterbox is the stage edge, not part of the picture */
    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(F.x) + 0.5, Math.round(F.y) + 0.5, Math.round(F.w) - 1, Math.round(F.h) - 1);
    sync();
  }

  /* the world: a wide, soft view of the surroundings — deliberately
     not a photograph, because it is what the photograph is cut from */
  function drawWorld(ctx, F) {
    if (!pano.ready) {
      label(ctx, 'LOADING THE WORLD…', F.x + 16, F.y + 26, p.muted, 10);
      return;
    }
    const bw = 400, bh = Math.max(1, Math.round(bw * F.h / F.w));
    const buf = pano.view(bw, bh, rad(state.pan), rad(state.tilt), rad(100), 0.7);
    ctx.save();
    try { ctx.filter = 'blur(' + Math.max(2, Math.round(F.w / 130)) + 'px)'; } catch (e) { /* older engines */ }
    ctx.drawImage(buf, F.x - F.w * 0.03, F.y - F.h * 0.03, F.w * 1.06, F.h * 1.06);
    ctx.restore();
    label(ctx, '3D OPEN WORLD', F.x + 14, F.y + 22, p.fg, 10);
  }

  function drawCamera(ctx, F) {
    const scale = Math.min(F.h * 0.62 / T_BODY.h, F.w * 0.46 / T_BODY.w);
    const cw = T_BODY.w * scale, chh = T_BODY.h * scale;
    const cx = F.x + (F.w - cw) / 2, cy = F.y + F.h - chh * 0.9;

    /* the body first: the screen is a hole in it, and the picture on the
       screen is the last thing drawn, so nothing ever covers it */
    if (camCut) ctx.drawImage(camCut, T_BODY.x, T_BODY.y, T_BODY.w, T_BODY.h, cx, cy, cw, chh);

    const sx = Math.round(cx + (T_SCREEN.x - T_BODY.x) * scale);
    const sy = Math.round(cy + (T_SCREEN.y - T_BODY.y) * scale);
    const sw = Math.round(T_SCREEN.w * scale), sh = Math.round(T_SCREEN.h * scale);
    ctx.fillStyle = '#000';
    ctx.fillRect(sx, sy, sw, sh);

    /* the frame the camera makes is 3:2 — on a 4:3 screen it letterboxes,
       exactly as it does on the back of the real camera */
    const fr = frameIn(sw, sh, 1.5);
    if (pano.ready) {
      const bw = Math.min(560, Math.max(120, Math.round(fr.w * 2)));
      const bh = Math.max(1, Math.round(bw / 1.5));
      const shot = pano.view(bw, bh, rad(state.pan), rad(state.tilt), hfov(), 1);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(shot, sx + fr.x, sy + fr.y, fr.w, fr.h);
    }

    /* the frame's own edge */
    ctx.strokeStyle = p.marker;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(Math.round(sx + fr.x) + 0.5, Math.round(sy + fr.y) + 0.5, Math.round(fr.w) - 1, Math.round(fr.h) - 1);
    label(ctx, '2D CONSTRAINED FRAME · ' + state.f + ' MM',
      F.x + F.w - 14, F.y + F.h - 14, p.marker, 10, 'right');
  }

  sync();
  return { render: view.render };
}

window.mountTransform = mountTransform;
