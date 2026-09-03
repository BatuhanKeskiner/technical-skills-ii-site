/* ============================================================
   A1 · What the camera sees
   One scene, one camera, two sliders. Rotation turns the camera
   through the world; focal length decides how much of the world
   the frame holds. The result appears where it appears in life:
   on the screen on the back of the camera.
   The strip along the top is the whole scene with the current
   frame marked on it, so the cut is visible as a cut.
   ============================================================ */

const V_STAGE_AR = 1012 / 600;
const V_FOCALS = [14, 20, 24, 28, 35, 50, 85, 105, 135, 200];
const V_BODY = { x: 0, y: 150, w: 1000, h: 850 };
const V_SCREEN = { x: 120, y: 437, w: 500, h: 356 };

function mountViewfinder(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { rot: 0, fi: 5 };

  /* The stage takes whatever shape the page gives it, and the drawing
     fills it. Full screen is the one exception: it keeps the shape the
     stage had, so the composition on the wall is the composition on the
     laptop rather than a different picture. */
  let stageAr = V_STAGE_AR;
  const onScreen = () => document.fullscreenElement === fig || fig.classList.contains('fs-on');
  function frame(w, h) {
    if (!onScreen()) { stageAr = w / h; return { x: 0, y: 0, w, h }; }
    return frameIn(w, h, stageAr);
  }


  const pano = panorama('assets/a1-scene.jpg', 0.6, () => view.render());
  let camCut = null;
  loadImage('assets/a1-camera-back.jpg', (box) => { camCut = keyWhite(box.img); view.render(); });

  const view = canvas(stage, draw);

  const fRot = slider(controls, {
    label: 'Camera rotation', min: -180, max: 180, step: 1, value: 0, unit: '°',
  });
  const fFocal = slider(controls, {
    label: 'Focal length', min: 0, max: V_FOCALS.length - 1, step: 1, value: state.fi,
    format: (v) => V_FOCALS[v] + ' mm',
  });
  [fRot, fFocal].forEach((i) => i.addEventListener('input', () => {
    state.rot = +fRot.value;
    state.fi = +fFocal.value;
    view.render();
  }));

  const out = readout(fig, [
    { id: 'lens', key: 'Lens', cls: 'hi' },
    { id: 'aov', key: 'Angle of view' },
    { id: 'share', key: 'Share of the scene' },
  ], 'three');

  fsButton(stage, fig);

  const rad = (d) => d * Math.PI / 180;
  const focal = () => V_FOCALS[state.fi];
  const hfov = () => 2 * Math.atan(18 / focal());

  function sync() {
    out.lens.innerHTML = focal() + '<span class="u">mm</span>';
    out.aov.textContent = Math.round(hfov() * 180 / Math.PI) + '°';
    out.share.textContent = (hfov() * 180 / Math.PI / 360 * 100).toFixed(1) + '%';
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const F = frame(w, h);

    ctx.save();
    ctx.beginPath();
    ctx.rect(F.x, F.y, F.w, F.h);
    ctx.clip();
    drawScene(ctx, F);
    drawCamera(ctx, F);
    ctx.restore();

    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(F.x) + 0.5, Math.round(F.y) + 0.5, Math.round(F.w) - 1, Math.round(F.h) - 1);
    sync();
  }

  /* the whole scene, laid out flat, with the frame marked on it */
  function drawScene(ctx, F) {
    const m = Math.round(F.w * 0.04);
    const sw = F.w - m * 2;
    const sh = Math.round(sw * 0.16);
    const x = F.x + m, y = F.y + Math.round(F.h * 0.055);

    label(ctx, 'THE SCENE · 360°', x, y + sh + 14, p.muted, 9, 'left');

    if (!pano.ready) {
      ctx.strokeStyle = p.rule2;
      ctx.strokeRect(x + 0.5, y + 0.5, sw, sh);
      label(ctx, 'LOADING…', x + 8, y + sh / 2, p.muted, 9);
      return;
    }
    /* the panorama, flattened: one full turn across the strip */
    const flat = pano.flat(Math.min(1200, Math.round(sw * 1.4)), Math.round(sh * 1.4), 1);
    ctx.drawImage(flat, x, y, sw, sh);
    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(sw), Math.round(sh));

    /* where the frame falls on it */
    const share = (hfov() * 180 / Math.PI) / 360;
    const cx = x + sw * (((state.rot / 360) + 0.5 + 1) % 1);
    const fw = Math.max(3, sw * share);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(x, y, sw, sh);
    ctx.beginPath();
    ctx.rect(x, y, sw, sh);
    ctx.clip();
    [-sw, 0, sw].forEach((o) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - fw / 2 + o, y, fw, sh);
      ctx.clip();
      ctx.drawImage(flat, x, y, sw, sh);
      ctx.restore();
      ctx.strokeStyle = p.marker;
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(cx - fw / 2 + o) + 0.5, Math.round(y) + 0.5, Math.round(fw), Math.round(sh));
    });
    ctx.restore();
    label(ctx, focal() + ' MM · ' + Math.round(hfov() * 180 / Math.PI) + '° · '
      + (share * 100).toFixed(1) + '% OF THE TURN', x + sw, y + sh + 14, p.marker, 9, 'right');
  }

  function drawCamera(ctx, F) {
    const top = F.y + F.h * 0.34;
    const scale = Math.min((F.y + F.h - top) * 0.98 / V_BODY.h, F.w * 0.52 / V_BODY.w);
    const cw = V_BODY.w * scale, chh = V_BODY.h * scale;
    const cx = F.x + (F.w - cw) / 2, cy = top + ((F.y + F.h) - top - chh) / 2;

    if (camCut) ctx.drawImage(camCut, V_BODY.x, V_BODY.y, V_BODY.w, V_BODY.h, cx, cy, cw, chh);

    const sx = Math.round(cx + (V_SCREEN.x - V_BODY.x) * scale);
    const sy = Math.round(cy + (V_SCREEN.y - V_BODY.y) * scale);
    const sw = Math.round(V_SCREEN.w * scale), sh = Math.round(V_SCREEN.h * scale);
    ctx.fillStyle = '#000';
    ctx.fillRect(sx, sy, sw, sh);

    const fr = frameIn(sw, sh, 1.5);
    if (pano.ready) {
      const bw = Math.min(560, Math.max(120, Math.round(fr.w * 2)));
      const shot = pano.view(bw, Math.max(1, Math.round(bw / 1.5)), rad(state.rot), 0, hfov(), 1);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(shot, sx + fr.x, sy + fr.y, fr.w, fr.h);
    }

    ctx.strokeStyle = p.marker;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(Math.round(sx + fr.x) + 0.5, Math.round(sy + fr.y) + 0.5, Math.round(fr.w) - 1, Math.round(fr.h) - 1);
  }

  sync();
  return { render: view.render };
}

window.mountViewfinder = mountViewfinder;
