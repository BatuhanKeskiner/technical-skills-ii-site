/* ============================================================
   Exposure — week 3, his Keynote of 14-09-2026, slide 14:

   "One simplified animation ... there is play and pause. If you
   don't pause it overexposes the image. A timeline: black -
   underexposed - well exposed - overexposed - white, gradually.
   In the meantime the photons are hitting. Photons hitting the
   sensor and the image appears in colour."

   And slide 15, the same animation pinned to materials: a digital
   sensor, a black-and-white negative, a paper negative, with an
   invert button for the negatives - one window, not two.

   The picture is a small colour scene counted in photons: while
   the shutter is open every cell collects light in proportion to
   how bright that part of the scene is, with the grain that
   counting has, and the picture is that count - dark to start,
   right for a while, then everything piles up to white.

   HIS KEYNOTE OF 16-09-2026, slides 14-15: "Animation is too slow.
   Overexposed are not bright enough and it has to end fully white.
   Make the distribution even." And: "invert should stay active when
   it is switched from 02 to 03."

   So the clock runs in stops, not in raw light: the play-head goes
   from black to white across ten stops at an even pace, the marks on
   the timeline sit at equal distances, well exposed is the middle,
   and at the end every cell is past white.
   ============================================================ */

const EX_GRID = 28;
const EX_MATS = ['Digital sensor', 'B&W negative film', 'Paper negative'];

function modelExposure(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const withMats = fig.getAttribute('data-materials') === 'on';
  const state = { playing: false, e: 0, mat: 0, invert: false, last: 0 };

  /* play and pause: one press that says what it will do next */
  const act = el('div', 'ctl');
  act.append(el('label', null, 'The shutter'));
  const acts = el('div', 'states');
  const play = el('button', 'st', 'Play');
  const reset = el('button', 'st', 'Start again');
  [play, reset].forEach((b) => { b.type = 'button'; acts.append(b); });
  act.append(acts);
  controls.append(act);
  play.addEventListener('click', () => { if (play.disabled) return; state.playing = !state.playing; state.last = performance.now(); say(); });
  reset.addEventListener('click', () => { state.playing = false; state.e = 0; say(); view.render(); });
  function say() {
    play.textContent = state.playing ? 'Pause' : (state.e > 0 ? 'Go on' : 'Play');
    /* at white there is nothing left to play: the press is dead until Start again */
    const done = !state.playing && state.e >= 1;
    play.disabled = done;
    play.classList.toggle('off', done);
    reset.disabled = state.e === 0;
    reset.classList.toggle('off', state.e === 0);
  }

  let invertBtn = null;
  if (withMats) {
    states(controls, {
      label: 'What is in the camera', items: EX_MATS,
      /* from one negative to the other the inversion stays; to the sensor it goes */
      onChange: (i) => { if (i === 0) state.invert = false; state.mat = i; syncInvert(); view.render(); },
    });
    const inv = el('div', 'ctl');
    inv.append(el('label', null, 'The negative'));
    const ig = el('div', 'states');
    invertBtn = el('button', 'st', 'Invert');
    invertBtn.type = 'button';
    ig.append(invertBtn); inv.append(ig); controls.append(inv);
    invertBtn.addEventListener('click', () => {
      if (invertBtn.disabled) return;
      state.invert = !state.invert;
      invertBtn.textContent = state.invert ? 'Back to the negative' : 'Invert';
      view.render();
    });
  }
  function syncInvert() {
    if (!invertBtn) return;
    const neg = state.mat > 0;
    invertBtn.disabled = !neg;
    invertBtn.classList.toggle('off', !neg);
    invertBtn.textContent = state.invert ? 'Back to the negative' : 'Invert';
  }
  syncInvert();
  say();

  const view = canvas(stage, draw);

  /* the clock: the exposure climbs while the shutter is open. Paper is
     slow, so it climbs slower; that is the one difference the time shows. */
  (function tick() {
    if (!fig.isConnected) return;
    if (state.playing) {
      const now = performance.now();
      /* black to white in about six seconds; paper is slower, about nine */
      const rate = state.mat === 2 ? 0.11 : 0.17;      /* of the timeline, per second */
      state.e = Math.min(1, state.e + ((now - state.last) / 1000) * rate);
      state.last = now;
      if (state.e >= 1) { state.playing = false; say(); }
    }
    view.render();
    requestAnimationFrame(tick);
  })();

  const rnd = (i, j, k) => {
    const s = Math.sin(i * 12.9898 + j * 78.233 + k * 37.719) * 43758.5453;
    return s - Math.floor(s);
  };

  /* the scene: a sky, a sun, a hill, a small house - things with a colour */
  const scene = (i, j) => {
    const x = i / (EX_GRID - 1), y = j / (EX_GRID - 1);
    let col = [0.45, 0.62, 0.9];                                  /* sky */
    let v = 0.55 + (1 - y) * 0.25;
    if (Math.hypot(x - 0.72, y - 0.22) < 0.1) { col = [1, 0.85, 0.3]; v = 1; }   /* sun */
    const hill = 0.62 + Math.sin(x * 4.2) * 0.08;
    if (y > hill) { col = [0.35, 0.6, 0.25]; v = 0.42 + (y - hill) * 0.3; }      /* hill */
    if (x > 0.22 && x < 0.4 && y > 0.5 && y < 0.7) { col = [0.85, 0.35, 0.2]; v = 0.5; }  /* house */
    if (x > 0.2 && x < 0.42 && y > 0.42 && y <= 0.5) { col = [0.5, 0.25, 0.15]; v = 0.3; } /* its roof */
    if (x > 0.29 && x < 0.33 && y > 0.6 && y < 0.7) { col = [0.2, 0.15, 0.1]; v = 0.15; }  /* a door */
    return { v: v, col: col };
  };

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 28;
    const barH = 26;
    /* THE SAME INSTRUMENT IS THE SAME SIZE ON BOTH ITS PAGES. His note on
       slide 15: "Keep the size and proportions of the instruments of the next
       instrument." The picture was sized by whatever height was left over, and
       the second page carries three cells on its strip instead of one - so the
       same instrument drew a smaller picture there, and the two pages did not
       match. The width decides it now, and the height is only a safety net, so
       both pages land on the same figure. */
    /* and the page WITHOUT the materials strip reserves the room that strip
       takes, so the leftover height is the same on both and the two pages draw
       the same picture rather than one 40px larger than the other */
    const reserve = withMats ? 0 : 39;
    const side = Math.min((w - pad * 2) * 0.36, h - pad * 2 - barH - 50 - reserve);
    const y = pad + 16;
    const rx = w - pad - side;                 /* the picture, right */
    const lw = rx - pad - 40;                  /* the sensor, left */

    /* ---- the sensor, a grid seen at a slant, with photons arriving ---- */
    const gx = pad + lw / 2, gy = y + side * 0.62, gs = Math.min(lw, side) * 0.46;
    const P = (u, v) => [gx + (u - v) * gs, gy + (u + v) * gs * 0.45];
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    for (let k = 0; k <= 12; k += 1) {
      const a = P(k / 12 - 0.5, -0.5), b = P(k / 12 - 0.5, 0.5);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      const c = P(-0.5, k / 12 - 0.5), d = P(0.5, k / 12 - 0.5);
      ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
    }
    ctx.restore();
    label(ctx, state.mat === 0 ? 'THE SENSOR' : (state.mat === 1 ? 'THE FILM' : 'THE PAPER'),
          pad, y - 8, p.muted, 9, 'left');
    /* the photons: falling onto the grid while the shutter is open, each one
       the colour of the part of the scene it comes from */
    const now = performance.now() / 1000;
    const nPh = state.playing ? 60 : 0;
    for (let k = 0; k < nPh; k += 1) {
      const life = (now * (0.6 + rnd(k, 1, 1) * 0.6) + rnd(k, 2, 2)) % 1;
      const u = rnd(k, 3, 3) - 0.5, v = rnd(k, 4, 4) - 0.5;
      const s = scene(Math.floor((u + 0.5) * (EX_GRID - 1)), Math.floor((v + 0.5) * (EX_GRID - 1)));
      const q = P(u, v);
      const yy = q[1] - (1 - life) * side * 0.5;
      ctx.save();
      ctx.globalAlpha = 0.5 + life * 0.5;
      ctx.fillStyle = state.mat === 0
        ? 'rgb(' + s.col.map((c) => Math.round(c * 255)).join(',') + ')' : p.fg;
      ctx.beginPath(); ctx.arc(q[0], yy, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /* ---- the picture ---- */
    const cell = side / EX_GRID;
    for (let i = 0; i < EX_GRID; i += 1) {
      for (let j = 0; j < EX_GRID; j += 1) {
        const s = scene(i, j);
        /* the light this cell has collected, in stops around right: the middle
           of the timeline is right, each tenth of it is one stop more, and the
           very start is no light at all */
        const stops = (state.e - 0.5) * 10;
        const u = rnd(i, j, 1), v2 = rnd(i, j, 2);
        const g = Math.sqrt(-2 * Math.log(u + 1e-6)) * Math.cos(2 * Math.PI * v2);
        const grain = 1 + g * (state.mat === 0 ? 0.05 : 0.1);
        let val = Math.max(0, s.v * Math.pow(2, stops) * grain * Math.min(1, state.e / 0.04));
        let r, gg, b;
        if (state.mat === 0) {
          /* colour up to right; past it every channel runs to white, and at the
             end of the timeline the whole picture is white */
          const white = Math.max(0, Math.min(1, (val - 0.9) / 1.6));
          r = Math.min(1, s.col[0] * val * 1.25) * (1 - white) + white;
          gg = Math.min(1, s.col[1] * val * 1.25) * (1 - white) + white;
          b = Math.min(1, s.col[2] * val * 1.25) * (1 - white) + white;
          val = Math.min(1, val);
        } else {
          val = Math.min(1, val);
          let t = val;
          /* paper is blue-sensitive: the red house goes dark on it */
          if (state.mat === 2) t = Math.min(1, val * (0.6 + s.col[2] * 0.6));
          const shown = state.invert ? t : 1 - t;
          r = gg = b = shown;
        }
        ctx.fillStyle = 'rgb(' + Math.round(r * 250) + ',' + Math.round(gg * 250) + ',' + Math.round(b * 250) + ')';
        ctx.fillRect(rx + i * cell, y + j * cell, cell + 0.6, cell + 0.6);
      }
    }
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(rx) + 0.5, Math.round(y) + 0.5, Math.round(side), Math.round(side));
    ctx.restore();
    label(ctx, state.mat === 0 ? 'THE PICTURE' : (state.invert ? 'THE NEGATIVE, INVERTED' : 'THE NEGATIVE'),
          rx, y - 8, p.muted, 9, 'left');

    /* ---- the timeline: black, under, right, over, white ---- */
    const ty = h - pad - barH + 4;
    const tx = pad, tw = w - pad * 2;
    const grad = ctx.createLinearGradient(tx, 0, tx + tw, 0);
    grad.addColorStop(0, '#000'); grad.addColorStop(1, '#fff');
    ctx.save();
    ctx.fillStyle = grad; ctx.fillRect(tx, ty, tw, 10);
    ctx.restore();
    const marks = [[0, 'BLACK'], [0.25, 'UNDEREXPOSED'], [0.5, 'WELL EXPOSED'], [0.75, 'OVEREXPOSED'], [1, 'WHITE']];
    marks.forEach((m) => {
      line(ctx, tx + tw * m[0], ty + 10, tx + tw * m[0], ty + 15, p.rule2);
      label(ctx, m[1], tx + tw * m[0], ty + 27, p.muted, 8, m[0] === 0 ? 'left' : (m[0] === 1 ? 'right' : 'center'));
    });
    const k = Math.min(1, state.e);
    ctx.save();
    ctx.fillStyle = p.signal;
    ctx.beginPath(); ctx.moveTo(tx + tw * k, ty - 2); ctx.lineTo(tx + tw * k - 6, ty - 12); ctx.lineTo(tx + tw * k + 6, ty - 12); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (!state.playing && state.e === 0) label(ctx, 'PRESS PLAY — AND PAUSE BEFORE IT GOES TOO FAR', tx, ty - 18, p.signal, 9, 'left');
  }

  return { render: view.render };
}

window.modelExposure = modelExposure;
