/* ============================================================
   A3 · One fixation at a time
   A photograph the way the eye actually delivers it: sharp over
   the couple of degrees you are fixating, vague everywhere else.
   Click and the sharp patch moves there; the trail behind it is
   the route the gaze has taken — a scan path, drawn by the room
   rather than by Yarbus.
   ============================================================ */

const X_STAGE_AR = 1012 / 600;
const X_PLATE = 'assets/a3-film-set.jpg';

function mountFovea(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* the fixation is kept in picture coordinates (0–1), so it stays
     put when the stage is resized or thrown full screen */
  const state = { x: 0.5, y: 0.5, deg: 4, path: [], cursor: null };

  let plate = null, blurred = null, bw = 0, bh = 0;

  /* The stage takes whatever shape the page gives it, and the drawing
     fills it. Full screen is the one exception: it keeps the shape the
     stage had, so the composition on the wall is the composition on the
     laptop rather than a different picture. */
  let stageAr = X_STAGE_AR;
  const onScreen = () => document.fullscreenElement === fig || fig.classList.contains('fs-on');
  function frame(w, h) {
    if (!onScreen()) { stageAr = w / h; return { x: 0, y: 0, w, h }; }
    return frameIn(w, h, stageAr);
  }

  loadImage(X_PLATE, (box) => { plate = box.img; blurred = null; view.render(); });

  const view = canvas(stage, draw);

  const fDeg = slider(controls, {
    label: 'Sharp field', min: 1, max: 20, step: 1, value: state.deg, unit: '°',
  });
  fDeg.addEventListener('input', () => { state.deg = +fDeg.value; view.render(); });

  states(controls, {
    label: 'Scan path', cls: 'span1', items: ['Keep', 'Clear'],
    onChange: (i) => { if (i === 1) { state.path = []; } view.render(); },
  });

  const out = readout(fig, [
    { id: 'fix', key: 'Fixations' },
    { id: 'share', key: 'Sharp share of the frame', cls: 'hi' },
  ], 'two');

  fsButton(stage, fig);

  /* The eye travels to what it is looking at; it does not appear there. A jump
     reads as two separate pictures, a movement reads as one eye moving — which is
     the whole point of the page. */
  let saccade = null;
  function lookAt(tx, ty) {
    const sx = state.x, sy = state.y;
    const dist = Math.hypot(tx - sx, ty - sy);
    if (!dist) return;
    /* a longer jump takes a little longer, the way a real saccade does */
    const dur = Math.min(420, 140 + dist * 340);
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
    if (saccade) cancelAnimationFrame(saccade);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const k = ease(p);
      state.x = sx + (tx - sx) * k;
      state.y = sy + (ty - sy) * k;
      view.render();
      saccade = p < 1 ? requestAnimationFrame(step) : null;
    };
    saccade = requestAnimationFrame(step);
  }

  /* the picture fills the stage; a click anywhere on it moves the eye */
  view.canvas.addEventListener('click', (e) => {
    if (document.body.classList.contains('design')) return;
    const r = view.canvas.getBoundingClientRect();
    const P = plateRect(r.width, r.height);
    const x = ((e.clientX - r.left) - P.x) / P.w;
    const y = ((e.clientY - r.top) - P.y) / P.h;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    state.path.push({ x: state.x, y: state.y });
    if (state.path.length > 24) state.path.shift();
    lookAt(x, y);
  });
  view.canvas.addEventListener('pointermove', (e) => {
    const r = view.canvas.getBoundingClientRect();
    state.cursor = { x: e.clientX - r.left, y: e.clientY - r.top };
    view.render();
  });
  view.canvas.addEventListener('pointerleave', () => { state.cursor = null; view.render(); });
  view.canvas.style.cursor = 'none';

  /* the picture's own rectangle inside the stage */
  function plateRect(w, h) {
    const F = frame(w, h);
    const ar = plate ? plate.naturalWidth / plate.naturalHeight : 1.5;
    const R = frameIn(F.w, F.h, ar);
    return { x: F.x + R.x, y: F.y + R.y, w: R.w, h: R.h, F };
  }

  /* the eye sees about 200° across; the sharp patch is `deg` of it */
  function radius(P) { return Math.max(10, P.w * (state.deg / 200) * 2.4); }

  function sync(P) {
    out.fix.textContent = String(state.path.length + 1);
    const r = radius(P);
    const share = Math.min(100, (Math.PI * r * r) / (P.w * P.h) * 100);
    out.share.innerHTML = share.toFixed(1) + '<span class="u">%</span>';
  }

  function blurTo(w, h) {
    if (blurred && bw === w && bh === h) return blurred;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    try { g.filter = 'blur(' + Math.max(6, Math.round(w / 42)) + 'px)'; } catch (e) { /* older engines */ }
    /* draw beyond the edges, so the blur does not fade the picture's border */
    g.drawImage(plate, -w * 0.06, -h * 0.06, w * 1.12, h * 1.12);
    blurred = c; bw = w; bh = h;
    return c;
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    const P = plateRect(w, h);

    if (!plate) {
      label(ctx, 'LOADING THE PICTURE…', P.F.x + 16, P.F.y + 26, p.muted, 10);
      return;
    }

    /* everything vague */
    ctx.drawImage(blurTo(Math.round(P.w), Math.round(P.h)), P.x, P.y, P.w, P.h);

    /* one patch sharp, with a soft edge — the fovea does not have a border */
    const cx = P.x + state.x * P.w, cy = P.y + state.y * P.h, r = radius(P);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(plate, P.x, P.y, P.w, P.h);
    ctx.restore();

    /* the seam, softened by redrawing the blur as a fading ring */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.globalAlpha = 0.55;
    ctx.drawImage(blurTo(Math.round(P.w), Math.round(P.h)), P.x, P.y, P.w, P.h);
    ctx.restore();

    /* the scan path */
    if (state.path.length) {
      ctx.save();
      ctx.strokeStyle = p.signal;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      state.path.forEach((q, i) => {
        const qx = P.x + q.x * P.w, qy = P.y + q.y * P.h;
        i ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy);
      });
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      state.path.forEach((q, i) => {
        ctx.globalAlpha = 0.25 + 0.65 * (i + 1) / state.path.length;
        ctx.strokeStyle = p.signal;
        ctx.beginPath();
        ctx.arc(P.x + q.x * P.w, P.y + q.y * P.h, 5, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }

    /* the fixation ring */
    ctx.strokeStyle = p.marker;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    label(ctx, state.deg + '°', cx + r + 8, cy + 4, p.marker, 9);

    /* the cursor carries the same indicator, so the room can see
       where the next fixation would land before committing to it */
    if (state.cursor) {
      const inside = state.cursor.x >= P.x && state.cursor.x <= P.x + P.w
        && state.cursor.y >= P.y && state.cursor.y <= P.y + P.h;
      ctx.save();
      ctx.globalAlpha = inside ? 0.75 : 0.25;
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(state.cursor.x, state.cursor.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      line(ctx, state.cursor.x - 7, state.cursor.y, state.cursor.x + 7, state.cursor.y, p.fg);
      line(ctx, state.cursor.x, state.cursor.y - 7, state.cursor.x, state.cursor.y + 7, p.fg);
      ctx.restore();
    }

    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(P.F.x) + 0.5, Math.round(P.F.y) + 0.5, Math.round(P.F.w) - 1, Math.round(P.F.h) - 1);
    label(ctx, 'CLICK TO MOVE THE FIXATION', P.F.x + 14, P.F.y + P.F.h - 14, p.muted, 9);
    sync(P);
  }

  return { render: view.render };
}

window.mountFovea = mountFovea;
