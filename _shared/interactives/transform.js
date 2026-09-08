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

const T_STAGE_AR = 1012 / 600;   /* the shape the figure asks the page for */
const T_F_MIN = 14, T_F_MAX = 200;
const T_TILT = 30;                 /* the panorama's usable pitch, degrees */
/* THE CAMERA IS A PNG WITH A HOLE IN IT.
   The old file was a JPEG on white and had to be knocked out in the browser
   by throwing away every pale pixel - which takes the highlights off the top
   plate with it and leaves a pale fringe round the whole body. Batu's Sony A1
   rear is cut properly: the body carries real alpha, and the LCD is not black
   paint but a rectangle of nothing. So the picture is drawn FIRST and the
   camera laid over it, and the screen's own edge frames it.

   Both boxes are the file's own pixels, measured off the alpha channel rather
   than guessed: the body is everything opaque, and the screen is the one
   interior hole - 663 x 500, which is the 4:3 of the real thing. */
const T_BODY = { x: 42, y: 52, w: 1507, h: 1052 };
const T_SCREEN = { x: 290, y: 509, w: 663, h: 500 };

/* ============================================================
   THE SECOND SPACE — a model of the room instead of a picture
   of it
   ------------------------------------------------------------
   Batu built this in another file and it is ported here rather
   than rewritten, so the geometry is his: a ground grid in
   metres, ten blocks standing on it, and a camera at 1.4 m.

   Why have both. The panorama shows you WHAT the frame catches
   and hides where the camera is standing. The model shows you
   the camera standing in the room with its field of view drawn
   as a cone, and hides what the picture looks like. Neither
   says it on its own, so both are here and the Space control
   swaps them. Tilt goes further in the model - 60° against the
   panorama's 30 - because a model has a floor and a sky and a
   photograph of a room runs out at its own edges.
   ============================================================ */
const M_CAMPOS = [0, 1.4, 0];                 /* metres: x right, y up, z away */
const M_BOXES = [
  { p: [-4.5, 0, 7],    s: [3, 2.2, 2.5],       c: '#d9822b' },   /* house */
  { p: [4, 0, 9.5],     s: [0.7, 5, 0.7],       c: '#8b7bd8' },   /* tower */
  { p: [1.4, 0, 3.2],   s: [0.8, 0.8, 0.8],     c: '#4caf6d' },   /* near cube */
  { p: [-1.2, 0, 4.2],  s: [0.45, 1.75, 0.3],   c: '#5b5650' },   /* person */
  { p: [0, 0, 12],      s: [9, 1, 0.4],         c: '#9a948a' },   /* far wall */
  { p: [-6.5, 0, 12.5], s: [1.6, 1.6, 1.6],     c: '#4caf6d' },
  { p: [3, 0, 6],       s: [1, 1, 1],           c: '#d9822b' },
  { p: [3, 1, 6],       s: [0.6, 0.6, 0.6],     c: '#e5a05a' },
  { p: [-3, 0, 2.2],    s: [0.5, 0.5, 0.5],     c: '#8b7bd8' },
  { p: [6, 0, 4],       s: [1.2, 0.5, 1.2],     c: '#9a948a' },
];
function mNorm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
const M_LIGHT = mNorm([-0.4, 0.8, -0.45]);
function mBoxFaces(b) {
  const [x, y, z] = b.p, [w, h, d] = b.s;
  const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y0 = y, y1 = y + h;
  const P = [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  return [{ q: [P[0],P[3],P[2],P[1]], n: [0,0,-1] }, { q: [P[5],P[6],P[7],P[4]], n: [0,0,1] },
          { q: [P[4],P[7],P[3],P[0]], n: [-1,0,0] }, { q: [P[1],P[2],P[6],P[5]], n: [1,0,0] },
          { q: [P[3],P[7],P[6],P[2]], n: [0,1,0] }].map((fc) => ({ q: fc.q, n: fc.n, c: b.c }));
}
const M_FACES = M_BOXES.flatMap(mBoxFaces);
const M_GRID = (() => {
  const g = [];
  for (let i = -10; i <= 10; i++) g.push([[i, 0, -4], [i, 0, 16]]);
  for (let k = -4; k <= 16; k++) g.push([[-10, 0, k], [10, 0, k]]);
  return g;
})();
const M_GROUND = [[-10, 0, -4], [10, 0, -4], [10, 0, 16], [-10, 0, 16]];
const M_NEAR = 0.05;

/* a pinhole camera: where it stands, where it looks, its focal length in mm
   on a 36 x 24 frame, and the rectangle it draws into */
function mCam(pos, yaw, pitch, fmm, rect) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return { pos, cy, sy, cp, sp, fpx: (rect[2] / 2) * fmm / 18, rect };
}
function mToCam(c, p) {
  const dx = p[0] - c.pos[0], dy = p[1] - c.pos[1], dz = p[2] - c.pos[2];
  const x1 = dx * c.cy - dz * c.sy, z1 = dx * c.sy + dz * c.cy;
  return [x1, dy * c.cp - z1 * c.sp, dy * c.sp + z1 * c.cp];
}
function mToScreen(c, v) {
  const [x, y, w, h] = c.rect;
  return [x + w / 2 + c.fpx * v[0] / v[2], y + h / 2 - c.fpx * v[1] / v[2]];
}
/* NOTHING BEHIND THE LENS IS DRAWN. A point at or behind the pinhole projects
   to infinity and then to the wrong side of the frame, so every polygon and
   every grid line is cut at the near plane first. */
function mClipPoly(pts) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] > M_NEAR, ib = b[2] > M_NEAR;
    if (ia) out.push(a);
    if (ia !== ib) {
      const t = (M_NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, M_NEAR]);
    }
  }
  return out;
}
function mClipSeg(a, b) {
  const ia = a[2] > M_NEAR, ib = b[2] > M_NEAR;
  if (!ia && !ib) return null;
  if (ia && ib) return [a, b];
  const t = (M_NEAR - a[2]) / (b[2] - a[2]);
  const m = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, M_NEAR];
  return ia ? [a, m] : [m, b];
}
function mShade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return 'rgb(' + Math.round((n >> 16) * k) + ',' + Math.round(((n >> 8) & 255) * k)
       + ',' + Math.round((n & 255) * k) + ')';
}
/* the room, seen from wherever `c` is standing */
function mScene(ctx, c, o) {
  const [rx, ry, rw, rh] = c.rect;
  ctx.save();
  ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
  ctx.fillStyle = o.sky; ctx.fillRect(rx, ry, rw, rh);
  const g = mClipPoly(M_GROUND.map((q) => mToCam(c, q)));
  if (g.length > 2) {
    ctx.fillStyle = o.ground;
    ctx.beginPath();
    g.forEach((v, i) => { const s = mToScreen(c, v); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
    ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = o.grid; ctx.lineWidth = 1;
  ctx.beginPath();
  M_GRID.forEach((seg) => {
    const cs = mClipSeg(mToCam(c, seg[0]), mToCam(c, seg[1]));
    if (!cs) return;
    const a = mToScreen(c, cs[0]), b = mToScreen(c, cs[1]);
    ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
  });
  ctx.stroke();
  /* painter's order, and back faces dropped: no depth buffer here, so the far
     faces go down first and a face turned away from the camera is not drawn */
  (o.extra ? M_FACES.concat(o.extra) : M_FACES).map((fc) => {
    const cp = fc.q.map((q) => mToCam(c, q));
    const cen = fc.q.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4, a[2] + q[2] / 4], [0, 0, 0]);
    const vd = [c.pos[0] - cen[0], c.pos[1] - cen[1], c.pos[2] - cen[2]];
    return { fc, cp,
      depth: cp.reduce((a, v) => a + v[2], 0) / cp.length,
      facing: fc.n[0] * vd[0] + fc.n[1] * vd[1] + fc.n[2] * vd[2] > 0 };
  }).filter((x) => x.facing).sort((a, b) => b.depth - a.depth).forEach((x) => {
    const poly = mClipPoly(x.cp);
    if (poly.length < 3) return;
    const l = Math.max(0, x.fc.n[0] * M_LIGHT[0] + x.fc.n[1] * M_LIGHT[1] + x.fc.n[2] * M_LIGHT[2]);
    ctx.fillStyle = mShade(x.fc.c, 0.55 + 0.45 * l);
    ctx.beginPath();
    poly.forEach((v, i) => { const s = mToScreen(c, v); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
    ctx.closePath(); ctx.fill();
    if (o.edges) { ctx.strokeStyle = o.edges; ctx.lineWidth = 1; ctx.stroke(); }
  });
  ctx.restore();
}
/* the little camera standing in the overview: a body, a lens, and the
   rotation that turns them - R maps a point in the camera's own frame to
   the world, which is also what the field-of-view cone is built from */
function mCameraModel(yaw, pitch, P) {
  const c = mCam(P, yaw, pitch, 50, [0, 0, 100, 66]);
  const R = (v) => {
    const y1 = v[1] * c.cp + v[2] * c.sp, z1 = -v[1] * c.sp + v[2] * c.cp;
    return [P[0] + v[0] * c.cy + z1 * c.sy, P[1] + y1, P[2] - v[0] * c.sy + z1 * c.cy];
  };
  const box = (cx, cy2, cz, w, h, d, col) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy2 - h / 2, y1 = cy2 + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    const V = [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]].map(R);
    const N = (n) => { const w2 = R(n); return mNorm([w2[0] - P[0], w2[1] - P[1], w2[2] - P[2]]); };
    return [{ q: [V[0],V[3],V[2],V[1]], n: N([0,0,-1]) }, { q: [V[5],V[6],V[7],V[4]], n: N([0,0,1]) },
            { q: [V[4],V[7],V[3],V[0]], n: N([-1,0,0]) }, { q: [V[1],V[2],V[6],V[5]], n: N([1,0,0]) },
            { q: [V[3],V[7],V[6],V[2]], n: N([0,1,0]) }, { q: [V[0],V[1],V[5],V[4]], n: N([0,-1,0]) }]
      .map((fc) => ({ q: fc.q, n: fc.n, c: col }));
  };
  return { faces: box(0, 0, -0.1, 0.7, 0.5, 0.36, '#e8e4dc')
                  .concat(box(0, 0.04, 0.42, 0.34, 0.34, 0.66, '#c9c4bb')), R };
}

function mountTransform(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  /* A NAME ON THE INSTRUMENT. In full screen the page's own heading is gone
     and there is nothing on screen saying what this is. IG-01 02: the head is
     the name and a three-noun eyebrow. Added to every instrument 08-09-2026 -
     five of eleven had one, and on a wall the other six were anonymous. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Transformation'),
              el('span', 'ts-sub', 'pan · tilt · focal length'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* TWO SPACES, ONE PER PAGE. The page says which by `space:` on its demo
     block, and where it has said so there is no switch to press - a control
     with one option is furniture. The tilt limit belongs to the space: a
     photograph has a top and a bottom and stops at 30°, a room goes to 60°.
     x and z are where the camera stands, in metres, and only the model has
     them: you cannot walk into a photograph. */
  const pinned = fig.dataset.space || '';
  const state = { pan: 0, tilt: 0, f: 50, space: pinned || 'photo', x: 0, z: 0 };
  const tiltLim = () => (state.space === 'photo' ? T_TILT : 60);
  const here = () => [M_CAMPOS[0] + state.x, M_CAMPOS[1], M_CAMPOS[2] + state.z];
  const X_LIM = 6, Z_BACK = -3, Z_FWD = 8;

  /* THE DRAWING FILLS THE STAGE, AND FULL SCREEN IS NOT AN EXCEPTION.
     It used to letterbox: full screen kept the shape the stage had on the
     page, so the room was thrown up on the wall with a black band above and
     below it and the picture was no bigger than it had been. A room is not a
     composition that has to be preserved - it is a space to look into - so it
     takes whatever screen it is given. */
  function frame(w, h) { return { x: 0, y: 0, w, h }; }


  const pano = panorama('../02-composition-format/assets/a1-scene.jpg', 0.6, () => view.render());
  let camCut = null;
  loadImage('../02-composition-format/assets/a1-camera-back.png', (box) => { camCut = box.img; view.render(); });

  const view = canvas(stage, draw);

  /* WHICH SPACE, and it comes before the pan pad because it decides what
     panning is doing. Photograph: you are inside the picture, turning. Model:
     you are outside the room, watching the camera turn. */
  if (!pinned) {
    states(controls, {
      /* NOT the default 'wide'. states() gives itself the whole row, and on
         the instrument's own page - where Space is not pinned and so is
         drawn - that pushed the two pads and the slider onto a second row.
         Four cells, one row: Space, pan, position, zoom. IG-01 6. */
      label: 'Space', cls: 'statecell', items: ['Photograph', '3D model'],
      onChange: (i) => {
        state.space = i ? 'model' : 'photo';
        const lim = tiltLim();
        state.tilt = Math.max(-lim, Math.min(lim, state.tilt));
        walkPad.ctl.hidden = state.space !== 'model';
        view.render();
      },
    });
  }

  const pad = padControl(controls, {
    label: 'Pan · tilt',
    onChange: (x, y) => {
      state.pan = Math.round(x * 180);
      state.tilt = Math.round(-y * tiltLim());
      view.render();
    },
  });

  /* WHERE IT STANDS, on a plan of the room. The first pad is where the camera
     LOOKS; this one is where it IS, and the two are the only things a
     photographer controls before the lens. Its knob is the camera's own place
     on the floor, so walking with the keys moves it and you can see yourself
     move. There is no such pad in the photograph: a panorama is one point in
     the world and staying there is the whole nature of it. */
  const walkPad = padControl(controls, {
    label: 'Position',
    onChange: (x, y) => {
      state.x = Math.max(-X_LIM, Math.min(X_LIM, x * X_LIM));
      state.z = Math.max(Z_BACK, Math.min(Z_FWD, -y * ((Z_FWD - Z_BACK) / 2) + (Z_FWD + Z_BACK) / 2));
      view.render();
    },
  });
  walkPad.ctl.hidden = state.space !== 'model';

  const fZoom = slider(controls, {
    /* NOT `wide`, which is what slider() defaults to. A wide control takes the
       whole row to itself, so the two pads were pushed onto rows of their own
       and the strip ran to three - a quarter of the instrument. IG-01 6: at
       1184 the strip is one row. */
    label: 'Zoom', cls: 'zoomcell', min: 0, max: 1000, step: 1,
    value: Math.round(1000 * Math.log(50 / T_F_MIN) / Math.log(T_F_MAX / T_F_MIN)),
    format: (v) => fFromSlider(v) + ' mm',
  });
  fZoom.addEventListener('input', () => { state.f = fFromSlider(+fZoom.value); view.render(); });

  /* NO READOUT ROW. It carried Pan, Tilt, Focal length and Angle of view, and
     the first three were already written on the controls that set them - the
     pad says "-48° · 5°" over the pad, the slider says "32 mm" over the
     slider. A number in two places is not twice as clear; it is a second
     thing to read. The angle of view goes with them: the cone in the picture
     IS the angle of view, drawn, and the whole point of the page is that you
     read it there rather than off a figure. */

  fsButton(stage, fig);

  /* dragging the world is the same gesture as pushing the pad */
  let from = null;
  dragArea(view.canvas, (dx, dy, start) => {
    if (start) { from = { pan: state.pan, tilt: state.tilt }; return; }
    let pan = Math.round(from.pan + dx * 260);
    pan = ((pan + 180) % 360 + 360) % 360 - 180;
    state.pan = pan;
    const lim = tiltLim();
    state.tilt = Math.max(-lim, Math.min(lim, Math.round(from.tilt - dy * 140)));
    view.render();
  });

  function fFromSlider(v) {
    return Math.round(T_F_MIN * Math.pow(T_F_MAX / T_F_MIN, v / 1000));
  }
  const rad = (d) => d * Math.PI / 180;
  const hfov = () => 2 * Math.atan(18 / state.f);

  function sync() {
    pad.out.textContent = state.pan + '° · ' + state.tilt + '°';
    pad.place(state.pan / 180, -state.tilt / tiltLim());
    walkPad.out.textContent = state.x.toFixed(1) + ' · ' + state.z.toFixed(1) + ' m';
    walkPad.place(state.x / X_LIM,
      -((state.z - (Z_FWD + Z_BACK) / 2) / ((Z_FWD - Z_BACK) / 2)));
  }

  /* ---- WALKING ---------------------------------------------------------
     W A S D moves the camera, the arrows turn it, and the two are kept apart
     on purpose: one changes where you are standing, the other only what you
     are pointing at, and confusing them is the commonest thing a first-year
     does with a zoom.

     THE MOVE IS RELATIVE TO WHERE IT LOOKS. W is forward along the lens, not
     up the grid, which is what walking is - and because the Position pad
     shows the camera's place on the floor, you watch yourself walk.

     THE DECK ALSO WANTS THE ARROWS. Left and right turn the page, so this
     listens in the CAPTURE phase and stops the event before the deck's own
     handler ever sees it - but only while the instrument is under the pointer
     or holding focus. Anywhere else on the page the arrows still turn pages. */
  stage.tabIndex = 0;
  const mine = () => state.space === 'model'
    && (fig.contains(document.activeElement) || fig.matches(':hover'));
  const STEP = 0.4, TURN = 5;
  window.addEventListener('keydown', (e) => {
    if (!mine() || e.altKey || e.metaKey || e.ctrlKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    let hit = true;
    const a = rad(state.pan), fx = Math.sin(a), fz = Math.cos(a);
    const move = (f2, r) => {
      state.x = Math.max(-X_LIM, Math.min(X_LIM, state.x + fx * f2 + fz * r));
      state.z = Math.max(Z_BACK, Math.min(Z_FWD, state.z + fz * f2 - fx * r));
    };
    if (k === 'w') move(STEP, 0);
    else if (k === 's') move(-STEP, 0);
    else if (k === 'a') move(0, -STEP);
    else if (k === 'd') move(0, STEP);
    /* Q AND E ZOOM, and they step MULTIPLIED, not added. Four millimetres is
       most of the picture at 14 mm and nothing at all at 200, so a fixed step
       would crawl at the wide end and jump at the long one. A twelfth either
       way is the same visible change wherever you are on the scale. */
    else if (k === 'q' || k === 'e') {
      state.f = Math.max(T_F_MIN, Math.min(T_F_MAX,
        Math.round(state.f * (k === 'e' ? 1.12 : 1 / 1.12))));
      fZoom.value = Math.round(1000 * Math.log(state.f / T_F_MIN)
                                    / Math.log(T_F_MAX / T_F_MIN));
      /* AND THE SLIDER HAS TO SAY SO. Moving the handle without firing its
         event left the word "50 mm" over a lens that was now 21: the control
         and the picture disagreed, and the control is the one people read. */
      fZoom.dispatchEvent(new Event('input', { bubbles: true }));
    }
    else if (k === 'ArrowLeft') state.pan = ((state.pan - TURN + 180 + 360) % 360) - 180;
    else if (k === 'ArrowRight') state.pan = ((state.pan + TURN + 180 + 360) % 360) - 180;
    else if (k === 'ArrowUp') state.tilt = Math.min(tiltLim(), state.tilt + TURN);
    else if (k === 'ArrowDown') state.tilt = Math.max(-tiltLim(), state.tilt - TURN);
    else hit = false;
    if (!hit) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    view.render();
  }, true);

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

  /* the world: either a wide, soft view of the surroundings - deliberately
     not a photograph, because it is what the photograph is cut from - or the
     model of the room with the camera standing in it */
  function drawWorld(ctx, F) {
    if (state.space === 'model') { drawModel(ctx, F); return; }
    if (!pano.ready) {
      label(ctx, 'LOADING THE WORLD…', F.x + 16, F.y + 26, p.muted, 10);
      return;
    }
    const bw = 720, bh = Math.max(1, Math.round(bw * F.h / F.w));
    /* and a bigger buffer to blur, or the softness is the buffer's own
       coarseness rather than a lens's */
    const buf = pano.view(bw, bh, rad(state.pan), rad(state.tilt), rad(100), 0.78);
    ctx.save();
    /* SOFT, NOT GONE. The blur is there so the surroundings read as
       surroundings and the sharp rectangle on the screen is the only
       photograph in the picture - but at a seventh of the stage width it was
       a smear, and you could not tell what the camera was being pointed AT.
       Half that: still clearly not the picture, still clearly the church. */
    try { ctx.filter = 'blur(' + Math.max(1.5, Math.round(F.w / 300)) + 'px)'; } catch (e) { /* older engines */ }
    ctx.drawImage(buf, F.x - F.w * 0.03, F.y - F.h * 0.03, F.w * 1.06, F.h * 1.06);
    ctx.restore();
    label(ctx, '3D OPEN WORLD', F.x + 14, F.y + 22, p.fg, 10);
  }

  /* THE ROOM FROM OUTSIDE IT. A fixed vantage up and to the left, so the
     camera in the middle of the floor is seen in the round and the cone in
     front of it is read as a cone. The eye of the overview does not move -
     only the little camera turns - or panning would move both and mean
     nothing. */
  function drawModel(ctx, F) {
    const view3 = mCam([-5, 6.2, -8.5], rad(31), rad(-27), 22, [F.x, F.y, F.w, F.h]);
    const P = here();
    const model = mCameraModel(rad(state.pan), rad(state.tilt), P);
    mScene(ctx, view3, {
      sky: p.stage, ground: '#23272c', grid: '#3a4048',
      edges: 'rgba(0,0,0,.25)', extra: model.faces,
    });
    const seg = (a, b, col, lw) => {
      const cs = mClipSeg(mToCam(view3, a), mToCam(view3, b));
      if (!cs) return;
      const q = mToScreen(view3, cs[0]), r = mToScreen(view3, cs[1]);
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(r[0], r[1]); ctx.stroke();
    };
    /* the stand: without it the camera floats and the floor stops meaning a floor */
    seg([P[0], 0, P[2]], [P[0], P[1] - 0.25, P[2]], '#9a948a', 2);

    /* WHAT THE FRAME IS, IN THE ROOM. The rectangle 3.2 m in front of the
       camera that the sensor sees - 18 mm and 12 mm of film over the focal
       length is the half-angle, so the cone narrows as the zoom goes in.
       This is the whole page in one shape. */
    const D = 3.2, tx = (18 / state.f) * D, ty = (12 / state.f) * D;
    const corners = [[-tx, -ty, D], [tx, -ty, D], [tx, ty, D], [-tx, ty, D]].map(model.R);
    corners.forEach((k) => seg(P, k, 'rgba(228,255,26,.55)', 1.5));
    const fr = mClipPoly(corners.map((q) => mToCam(view3, q)));
    if (fr.length > 2) {
      ctx.beginPath();
      fr.forEach((v, i) => { const q = mToScreen(view3, v); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
      ctx.fillStyle = 'rgba(228,255,26,.12)'; ctx.fill();
      ctx.strokeStyle = p.marker; ctx.lineWidth = 2; ctx.stroke();
    }
    label(ctx, '3D OPEN WORLD', F.x + 14, F.y + 22, p.fg, 10);

    /* EVERY KEY THAT DOES SOMETHING, in a cap, under the room it drives -
       the same row the test strip and the photogram carry, so a student who
       has used one instrument already knows to look here. Walking and looking
       are two groups because they are two different things, and telling them
       apart is most of what this page is for. */
    /* clear of the camera, which stands in the right half */
    keyRow(ctx, F.x + F.w * 0.21, F.y + F.h - 16,
           [[['W', 'A', 'S', 'D'], 'walk'],
            [['\u25C0', '\u25B6', '\u25B2', '\u25BC'], 'look'],
            [['Q', 'E'], 'zoom']],
           p.fg, p.muted);
  }

  function drawCamera(ctx, F) {
    /* BIGGER, AND OVER TO THE RIGHT. Centred, the camera stood on top of the
       thing it is looking at - in the model it covered the floor the little
       camera walks on, and every step went behind it. Moved right, the room
       is clear and the two are side by side: what is happening, and what it
       makes of it. */
    /* A THIRD OF THE WIDTH, AT EVERY SIZE. Driven by the width rather than
       the height, the camera is the same fraction of the picture on the page
       and on a projector - it was taking half the wall in full screen, where
       the room is the thing people are supposed to be looking at. */
    const scale = Math.min(F.h * 0.62 / T_BODY.h, F.w * 0.34 / T_BODY.w);
    const cw = T_BODY.w * scale, chh = T_BODY.h * scale;
    /* WHERE THE CAMERA STANDS DEPENDS ON WHAT IS BEHIND IT. In the model the
       room is the subject and it needs the left half of the stage clear, so
       the camera goes right. In the photograph there is no room to make space
       for - the world is everywhere behind it - so it stands in the middle,
       where a thing you are looking through belongs. */
    const cx = state.space === 'model'
      ? F.x + F.w - cw - F.w * 0.015
      : F.x + (F.w - cw) / 2;
    const cy = F.y + F.h - chh * 0.88;

    const sx = Math.round(cx + (T_SCREEN.x - T_BODY.x) * scale);
    const sy = Math.round(cy + (T_SCREEN.y - T_BODY.y) * scale);
    const sw = Math.round(T_SCREEN.w * scale), sh = Math.round(T_SCREEN.h * scale);

    /* THE PICTURE GOES DOWN FIRST, then the camera over it. The LCD is a hole
       in the file, so the body itself is the mask: nothing has to be clipped
       by hand and the screen's own corners cut the picture. */
    ctx.fillStyle = '#000';
    ctx.fillRect(sx, sy, sw, sh);

    /* THE PICTURE FILLS THE SCREEN. It used to be letterboxed to 3:2 inside
       the 4:3 hole, which was accurate and looked broken: the bezel painted
       into the photograph is wider on the left than on the right, so the
       picture sat visibly off-centre in the dark and read as a mistake rather
       than as a sensor shape. Edge to edge, the hole's own edge is the frame
       and there is nothing left to look crooked. What shape a frame is comes
       up properly in Part B, where it is the subject. */
    const fr = { x: 0, y: 0, w: sw, h: sh };
    if (state.space === 'model') {
      /* the same room, from the camera itself - this is the picture the cone
         in the overview is standing round */
      const shot = mCam(here(), rad(state.pan), rad(state.tilt), state.f,
                        [sx + fr.x, sy + fr.y, fr.w, fr.h]);
      mScene(ctx, shot, { sky: '#141619', ground: '#23272c', grid: '#3a4048',
                          edges: 'rgba(0,0,0,.25)' });
    } else if (pano.ready) {
      const bw = Math.min(560, Math.max(120, Math.round(fr.w * 2)));
      const bh = Math.max(1, Math.round(bw / 1.5));
      const shot = pano.view(bw, bh, rad(state.pan), rad(state.tilt), hfov(), 1);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(shot, sx + fr.x, sy + fr.y, fr.w, fr.h);
    }

    if (camCut) ctx.drawImage(camCut, T_BODY.x, T_BODY.y, T_BODY.w, T_BODY.h, cx, cy, cw, chh);

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
