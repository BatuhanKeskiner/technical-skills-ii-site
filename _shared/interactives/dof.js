/* ============================================================
   B2 · Depth of field

   HIS KEYNOTE OF 16-09-2026, slide 28:
     "Keep the subject centred in the scale. Don't resize the
      metres scale. Move the camera closer instead, so we can see
      the change of DOF in a fixed place. Also I don't understand
      the relationship with the two other subjects in the frame.
      Can it be a landscape only, so we can see the scale and the
      blurriness amount?"
   And the same day: "bir de manuel focus ekler misin? biz focusu
   değiştirdiğimizde nereler netleniyor görelim" — a manual focus,
   "açılıp kapanabilen bir şey olsun ve açıldığında çıksın sadece.
   Ana denklemde değil, sadece fokus değişince ne olduğunu
   göstermek için."

   SO THE INSTRUMENT IS ONE ROAD, SEEN TWICE.
   The plan is a fixed scale in metres, nought to twenty, with a
   post every two metres and the subject standing still at ten.
   The camera moves along it. The frame above is that same road
   from the camera's place: the posts carry the same numbers, and
   each one is blurred by exactly as much as it is out of focus.
   The band between the near and the far limit is drawn on both.

   Focus follows the subject until manual focus is switched on;
   then a hand appears in the same cell and the plane of focus is
   the student's to move, and the posts answer.

   C1 (three variable controls) is flexed here, by him, for the
   fourth hand — and only while it is switched on.
   ============================================================ */

const DOF_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const DOF_ROAD = 20;            /* the scale is nought to twenty metres, always */
const DOF_SUBJECT = 10;         /* the subject stands here, always */
/* THE TWO FORMATS THIS PAGE COMPARES. His second round, 16-09-2026, slide 29:
   "option to switch between 6*9 and full frame. I want to show the doF is not
   related with format." A format is a piece of film with a width, a height and
   a circle of confusion of its own - the diagonal over 1500, the usual rule -
   and with the same lens at the same distance the depth of field barely moves,
   which is the thing he wants the room to see. */
const DOF_FORMATS = {
  'full frame': { w: 36, h: 24 },
  '6×9': { w: 84, h: 56 },
};
const DOF_COC = Math.hypot(36, 24) / 1500;   /* full frame, mm — the default */

function mountDof(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Depth of Field'),
              el('span', 'ts-sub', 'aperture · distance · focal length'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const VIEWS = ['frame', 'plan', 'both'];
  const state = {
    stop: 2, focal: 50, dist: 4.0, focus: 4.0, manual: false,
    format: 'full frame', keepLens: true,
    mode: Math.max(0, VIEWS.indexOf(fig.dataset.view || 'both')),
  };
  const film = () => DOF_FORMATS[state.format];
  /* HIS WORD, 16-09-2026: "full frame'den 6x9'a geçerken aynı lensi
     kullanıyorsak alan derinliği nasıl değişebilir? Burada kanıtlamak
     istediğimiz şey tam olarak değişmeyeceği."
     He is right, and the page exists to show exactly that. The circle of
     confusion was scaled with the diagonal of the format - the convention for
     comparing PRINTS of the same size - and that made the depth of field move
     when the format changed with the same lens on, which is the opposite of
     the lesson. The same lens at the same aperture at the same distance throws
     the same image; a bigger film only holds more of it. So the circle stays
     what it is on the film: 0.03 mm, one value, every format. */
  const coc = () => 0.03;

  const view = canvas(stage, draw);

  /* each hand as wide as its own longest reading: "Aperture f/22" is a short
     cell and "Camera to the subject 9.0 m" is a long one, and cut to the same
     width the long one loses its number to an ellipsis. */
  const fStop = slider(controls, {
    label: 'Aperture', min: 0, max: DOF_STOPS.length - 1, step: 1, value: state.stop,
    format: (v) => 'f/' + DOF_STOPS[v], cls: 'dof-ap',
  });
  const fFocal = slider(controls, {
    label: 'Focal length', min: 24, max: 200, step: 1, value: state.focal, unit: ' mm',
    cls: 'dof-fl',
  });
  const fDist = slider(controls, {
    label: 'Camera to the subject', min: 1, max: 9, step: 0.1, value: state.dist,
    unit: ' m', decimals: 1, cls: 'dof-dist',
  });

  /* THE FOURTH HAND, FOLDED AWAY. The cell holds the press; the hand is not
     drawn at all until the press is on — and the room it will take is held
     open by an empty block, so no cell beside it moves (S18), and no control
     nobody can use is left on the strip (C7). */
  /* one cell, four presses, a fixed width: the focus press and the three that
     answer his slide 29. The width is pinned so unfolding the manual hand does
     not move the cells beside it (S18) and the strip stays one row (C3). */
  /* this strip is three hands and one group of presses, and the presses are
     wider than a hand: the even columns of the ordinary bar would wrap it to
     two rows (C3), so the strip names itself and takes its own columns. */
  controls.classList.add('dof-strip');
  const focusCell = el('div', 'ctl dof-opts');
  focusCell.append(el('label', null, 'Focus · format'));
  const focusRow = el('div', 'states');
  const bManual = el('button', 'st', 'Manual focus');
  bManual.type = 'button';
  focusRow.append(bManual);
  focusCell.append(focusRow);
  controls.append(focusCell);
  /* the press keeps one width, or the cells beside it move when the word
     changes (C15, S18) */
  pinWidth(bManual, ['Manual focus', 'Focus on the subject']);
  /* THE FORMAT, AND WHETHER THE LENS TRAVELS WITH IT. His second round, slide
     29. Four presses in one group, which is what the strip allows (C1): the
     focus press, the two formats, and the one that decides what happens to the
     lens when the format changes. Keep the lens on, and 6×9 sees a narrower
     slice of the same scene with almost the same depth - which is the lesson.
     Keep the lens off, and the focal length is scaled to hold the framing, so
     the two formats can be compared frame for frame. */
  const bFF = el('button', 'st', 'Full frame');
  const b69 = el('button', 'st', '6×9');
  const bKeep = el('button', 'st', 'Same lens');
  [bFF, b69, bKeep].forEach((b) => { b.type = 'button'; focusRow.append(b); });
  function setFormat(name) {
    if (name === state.format) return;
    const was = film();
    state.format = name;
    if (!state.keepLens) {
      const k = Math.hypot(film().w, film().h) / Math.hypot(was.w, was.h);
      state.focal = Math.max(24, Math.min(200, Math.round(state.focal * k)));
      fFocal.value = String(state.focal);
      if (fFocal._sync) fFocal._sync();
    }
    marks();
    compute(); view.render();
  }
  function marks() {
    bFF.setAttribute('aria-current', String(state.format === 'full frame'));
    b69.setAttribute('aria-current', String(state.format === '6×9'));
    bKeep.setAttribute('aria-current', String(state.keepLens));
  }
  bFF.addEventListener('click', () => setFormat('full frame'));
  b69.addEventListener('click', () => setFormat('6×9'));
  bKeep.addEventListener('click', () => { state.keepLens = !state.keepLens; marks(); });
  marks();
  const fFocus = slider(controls, {
    label: 'Focused at', min: 0.6, max: 20, step: 0.1, value: state.focus,
    unit: ' m', decimals: 1,
  });
  const focusSliderCell = fFocus.closest('.ctl');
  focusSliderCell.classList.add('folded');
  focusCell.append(focusSliderCell);        /* inside the cell, not beside it */

  function setManual(on) {
    state.manual = on;
    bManual.setAttribute('aria-current', String(on));
    bManual.textContent = on ? 'Focus on the subject' : 'Manual focus';
    /* out of sight and dead while it is folded away, and its room kept, so no
       cell beside it moves (S18) and nothing undoable is live (C7, C8) */
    /* THE ROOM IT TAKES IS USED, NOT RESERVED. Hidden, the folded hand still
       held its height and the strip carried a black band under the other three
       cells - his note of 16-09 on this very strip. It stands there instead,
       dead until the press is on: a control that cannot be used is dead, which
       the rules allow; a panel with a hole in it is not. */
    ctlOff(fFocus, !on);
    if (!on) state.focus = state.dist;
    else { fFocus.value = String(state.focus); fFocus._sync(); }
    compute(); view.render();
  }
  bManual.addEventListener('click', () => setManual(!state.manual));

  /* HIS SECOND ROUND, 16-09-2026, slide 29: "Remove the text and make it
     bigger." The legend sat over the top right of the picture, naming three
     things the drawing already names on itself - the subject is the tall mark
     at ten metres, the limits are the two dashed lines, the sharp band is the
     band. The room it took goes to the photograph. */

  /* THE THREE GATES (O1 O2 O3). Total depth: nobody sets it, nothing in the
     drawing states the distance BETWEEN the two limits as a quantity, and it
     is the thing a photographer acts on - whether the whole face is in.
     Sharp from, to: the limits are drawn as the two dashed lines, but their
     distances in metres are not written anywhere on the scale, and "from 3.5
     to 4.6" is what a student carries to a shoot. Near and far are one row,
     not two: they are one answer with two ends. */
  const out = readout(fig, [
    { id: 'depth', key: 'Total depth', cls: 'hi' },
    { id: 'sharp', key: 'Sharp from, to' },
  ]);

  fsButton(stage, fig);

  [fStop, fFocal, fDist, fFocus].forEach((i) => i.addEventListener('input', () => {
    state.stop = +fStop.value;
    state.focal = +fFocal.value;
    state.dist = +fDist.value;
    state.focus = state.manual ? +fFocus.value : state.dist;
    compute();
    view.render();
  }));

  /* ---- optics ---- */
  function limits() {
    const N = DOF_STOPS[state.stop];
    const f = state.focal;                       /* mm */
    const s = (state.manual ? state.focus : state.dist) * 1000;   /* mm */
    const H = (f * f) / (N * coc()) + f;
    const near = (s * (H - f)) / (H + s - 2 * f);
    const far = H - s <= 0 ? Infinity : (s * (H - f)) / (H - s);
    return { N: N, f: f, s: s, H: H, near: near, far: far };
  }

  /* the blur a post that far away lands on the film, as a share of the
     circle of confusion: 1 is the edge of sharp */
  function blurFor(objM) {
    const { N, f, s } = limits();
    const o = Math.max(200, objM * 1000);
    const b = Math.abs((f * f * (o - s)) / (N * o * (s - f)));
    return b / DOF_COC;
  }

  function metres(mm) {
    if (!isFinite(mm)) return '∞';
    return (mm / 1000).toFixed(mm < 10000 ? 1 : 0) + ' m';
  }

  function compute() {
    const { near, far } = limits();
    out.depth.innerHTML = isFinite(far)
      ? ((far - near) / 1000).toFixed(2) + '<span class="u">m</span>'
      : '∞';
    out.sharp.textContent = metres(near) + ' — ' + metres(far);
  }

  /* ---- drawing ---- */
  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const both = state.mode === 2;
    /* THE PICTURE IS THE OUTPUT, so it takes the room. His word, 16-09-2026:
       "Görüntü en önemli çıktı ve çok az yer kaplıyor." The plan view keeps
       what it needs to carry the scale and no more. */
    const frameH = state.mode === 0 ? h : both ? h * 0.76 : 0;
    const planTop = state.mode === 1 ? 0 : frameH;
    const planH = state.mode === 0 ? 0 : h - planTop;

    if (frameH > 0) drawFrame(ctx, w, frameH);
    if (planH > 0) {
      if (both) line(ctx, 0, planTop, w, planTop, p.rule);
      drawPlan(ctx, w, planTop, planH);
    }
  }

  /* THE ROAD, FROM THE CAMERA'S PLACE. A landscape and nothing else in it:
     the ground, a treeline on the horizon, and a post every two metres
     carrying the number it has on the scale below. Each is blurred by exactly
     how far out of focus it is. Drawn at true optics: a post 1.6 m tall, on a
     35 mm frame 24 mm high, at z metres, through an f mm lens. */
  const POST_M = 0.9, CAM_H = 0.9;
  function drawFrame(ctx, w, h) {
    /* "Image bigger" - his second round, slide 29. The photograph takes the
       room the legend used to take, with a hairline of margin. Its shape is the
       film's own: 3:2 on full frame, 3:2 on 6×9 as well, but the film is bigger,
       which is the point of the switch. */
    const FILM_W = film().w, FILM_H = film().h;
    const ar = FILM_W / FILM_H;
    const pad = 6;
    const fw = Math.min(w - pad * 2, (h - pad * 2) * ar);
    const fh = fw / ar;
    const x0 = (w - fw) / 2, y0 = (h - fh) / 2;
    const camX = DOF_SUBJECT - state.dist;
    const f = state.focal;
    const horizon = y0 + fh * 0.34;
    const up = (L, z) => fh * (L * f) / (z * FILM_H);
    const across = (L, z) => fw * (L * f) / (z * FILM_W);
    const ground = (z) => horizon + up(CAM_H, z);
    /* HOW SOFT, IN THE PICTURE'S OWN PIXELS. His word, 16-09-2026: "Bunun fizik
       kurallarına uygun hareket etmesi gerekiyor. Blur miktarının özellikle
       kontrol edilmesi gerekiyor." The blur disc has a real size on the film -
       b = f²·|o−s| / (N·o·(s−f)) millimetres - and what the eye sees is that
       disc mapped onto the frame as it is drawn: so many millimetres of film
       become so many pixels of picture. It was a hand-tuned multiple of the
       circle of confusion before, which is a number with no units behind it.
       This way the same lens on a bigger film also renders correctly: the disc
       is the same size in millimetres and the film carries more of them. */
    const softPx = (z) => Math.min(24, (blurFor(z) * DOF_COC / FILM_H) * fh);

    ctx.save();
    ctx.beginPath(); ctx.rect(x0, y0, fw, fh); ctx.clip();

    /* the sky, and the ground under it */
    const sky = ctx.createLinearGradient(0, y0, 0, horizon);
    sky.addColorStop(0, p.rule); sky.addColorStop(1, p.inset);
    ctx.fillStyle = sky; ctx.fillRect(x0, y0, fw, horizon - y0);
    const grd = ctx.createLinearGradient(0, horizon, 0, y0 + fh);
    grd.addColorStop(0, p.inset); grd.addColorStop(1, p.stage);
    ctx.fillStyle = grd; ctx.fillRect(x0, horizon, fw, y0 + fh - horizon);

    /* the treeline on the horizon, at the blur of something far away */
    const farSoft = softPx(300);
    ctx.save();
    if (farSoft > 0.3) ctx.filter = 'blur(' + farSoft.toFixed(1) + 'px)';
    ctx.fillStyle = p.rule2; ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(x0, horizon);
    for (let i = 0; i <= 48; i += 1) {
      const t = i / 48;
      const k = 0.014 + 0.010 * Math.abs(Math.sin(t * 9.7)) + 0.006 * Math.abs(Math.sin(t * 3.1));
      ctx.lineTo(x0 + fw * t, horizon - fh * k);
    }
    ctx.lineTo(x0 + fw, horizon); ctx.closePath(); ctx.fill();
    ctx.restore();

    /* the road, and a rung across it at every post, so the ground carries the
       same scale as the plan below */
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1; ctx.globalAlpha = 0.75;
    [-1.5, 1.5].forEach((side) => {
      ctx.beginPath();
      let first = true;
      for (let z = 0.8; z <= 80; z *= 1.06) {
        const xx = x0 + fw / 2 + across(side, z), yy = ground(z);
        if (first) { ctx.moveTo(xx, yy); first = false; } else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    });
    ctx.restore();

    /* the posts, far to near, each softened by how far out of focus it is */
    const posts = [];
    for (let m = 2; m <= DOF_ROAD; m += 2) posts.push(m);
    posts.sort((a2, b2) => b2 - a2);
    posts.forEach((m) => {
      const z = m - camX;
      if (z < 0.7) return;
      const isSub = Math.abs(m - DOF_SUBJECT) < 0.01;
      /* "Put the subject center of the scene" - his second round, slide 29. The
         subject stands in the middle of the road; the other posts keep to the
         verges, which is what makes the near ones leave the frame. */
      const side = isSub ? 0 : ((m / 2) % 2 === 0 ? -0.9 : 0.9);
      const px = x0 + fw / 2 + across(side, z);
      const base = ground(z);
      const ph = up(isSub ? POST_M * 1.3 : POST_M, z);
      const pw = Math.max(1.2, across(0.09, z));
      const soft = softPx(z);
      ctx.save();
      if (soft > 0.3) ctx.filter = 'blur(' + soft.toFixed(1) + 'px)';
      /* the rung it stands on */
      ctx.strokeStyle = isSub ? p.marker : p.rule2;
      ctx.globalAlpha = isSub ? 0.9 : 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0 + fw / 2 + across(-1.5, z), base);
      ctx.lineTo(x0 + fw / 2 + across(1.5, z), base);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = isSub ? p.marker : p.fg;
      ctx.fillRect(px - pw / 2, base - ph, pw, ph);
      ctx.fillRect(px - pw * 1.5, base - ph - pw * 0.7, pw * 3, pw * 0.8);
      ctx.restore();
      if (isSub || m % 4 === 0) {
        ctx.save();
        if (soft > 0.3) ctx.filter = 'blur(' + Math.min(6, soft).toFixed(1) + 'px)';
        label(ctx, String(m) + ' M', px, base + 13, isSub ? p.marker : p.muted,
              isSub ? 11 : 9, 'center');
        ctx.restore();
      }
    });
    ctx.restore();

    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x0) + 0.5, Math.round(y0) + 0.5, Math.round(fw), Math.round(fh));
    /* the name inside the frame: above it, it ran under the instrument's head */
    label(ctx, 'WHAT THE CAMERA TAKES · ' + state.focal + ' MM', x0 + 8, y0 + 16, p.muted, 9);
  }

  /* THE SCALE DOES NOT MOVE. Nought to twenty metres, the subject at ten,
     and the camera walks up the road toward it. */
  function drawPlan(ctx, w, top, h) {
    const { near, far } = limits();
    const padL = 54, padR = 54;
    /* the axis sits high enough in its band for the two words under it - the
       camera's distance and the road's name were cut off at the foot when the
       picture took more of the stage */
    const axisY = top + h * 0.46;
    const x = (m) => padL + (Math.max(0, Math.min(m, DOF_ROAD)) / DOF_ROAD) * (w - padL - padR);
    const camX = DOF_SUBJECT - state.dist;

    line(ctx, padL, axisY, w - padR, axisY, p.rule2);
    for (let m = 0; m <= DOF_ROAD; m += 2) {
      const tx = x(m);
      line(ctx, tx, axisY, tx, axisY + 5, p.rule2);
      label(ctx, String(m), tx, axisY + 17, p.muted, 9, 'center');
    }
    label(ctx, 'THE ROAD · METRES', w - padR, axisY + 30, p.muted, 9, 'right');

    /* what is sharp, drawn on the same scale */
    const nx = x(camX + near / 1000);
    const fx = isFinite(far) ? x(camX + far / 1000) : w - padR;
    ctx.save();
    ctx.fillStyle = p.band;
    ctx.fillRect(nx, axisY - h * 0.36, Math.max(1, fx - nx), h * 0.36);
    ctx.restore();
    line(ctx, nx, axisY - h * 0.36, nx, axisY, p.signal, [3, 3]);
    line(ctx, fx, axisY - h * 0.36, fx, axisY, p.signal, [3, 3]);
    if (!isFinite(far)) label(ctx, '∞', w - padR + 8, axisY - 4, p.signal, 11, 'left');

    /* the subject, standing still */
    const sx = x(DOF_SUBJECT);
    line(ctx, sx, axisY - h * 0.48, sx, axisY, p.marker);
    label(ctx, 'THE SUBJECT', sx, axisY - h * 0.48 - 7, p.marker, 9, 'center');

    /* the plane of focus, when the student is holding it */
    if (state.manual) {
      const px = x(camX + state.focus);
      line(ctx, px, axisY - h * 0.3, px, axisY, p.digital || p.fg, [6, 4]);
      label(ctx, 'FOCUSED AT ' + state.focus.toFixed(1) + ' M', px, axisY - h * 0.3 - 7,
            p.digital || p.fg, 9, 'center');
    }

    /* the camera, walking up the road */
    const cx = x(camX);
    ctx.save();
    ctx.strokeStyle = p.fg; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(cx - 20, axisY - 11, 20, 22);
    ctx.moveTo(cx, axisY - 6); ctx.lineTo(cx + 8, axisY); ctx.lineTo(cx, axisY + 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'THE CAMERA · ' + state.dist.toFixed(1) + ' M FROM THE SUBJECT',
          cx - 20, axisY + 30, p.muted, 9, 'left');

    label(ctx, 'PLAN VIEW · f/' + DOF_STOPS[state.stop] + ' · ' + state.focal + ' MM',
          padL - 26, top + 20, p.muted, 9);
  }

  setManual(false);
  compute();
  return { render: view.render };
}

window.mountDof = mountDof;
