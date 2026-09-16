/* ============================================================
   Light, over time — week 3.

   ONE THING: an exposure is an amount of light and a length of
   time, and what you get depends on both — and on what you put
   in the camera.

   Rebuilt 13-09-2026 to his brief. Three materials, because the
   three do not record the same thing:

     Negative film   a negative, with its positive beside it
     Photo paper     a negative, and that is all it makes
     Digital         colour, and a positive straight away

   Three amounts of light and three lengths of time, chosen as
   buttons rather than dragged, and an Expose press that runs the
   exposure: the light travels in from the left, strikes the
   surface, and stays there while the picture builds up.
   ============================================================ */

const PX_GRID = 30;
const PX_LIGHT = [{ n: 'Dim', v: 0.35 }, { n: 'Normal', v: 1 }, { n: 'Bright', v: 2.6 }];
const PX_TIME = [{ n: 'Short', v: 0.4 }, { n: 'Normal', v: 1 }, { n: 'Long', v: 2.8 }];
const PX_MAT = ['Negative film', 'Photo paper', 'Digital'];

function modelPhotons(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { mat: 0, light: 1, time: 1, run: 0, playing: false };

  const matRow = states(controls, {
    label: 'What is in the camera', items: PX_MAT,
    onChange: (i) => { state.mat = i; expose(); },
  });
  const lightRow = states(controls, {
    label: 'How much light', items: PX_LIGHT.map((x) => x.n),
    onChange: (i) => { state.light = i; expose(); },
  });
  const timeRow = states(controls, {
    label: 'How long', items: PX_TIME.map((x) => x.n),
    onChange: (i) => { state.time = i; expose(); },
  });
  lightRow.select(1); timeRow.select(1);

  /* the press. One action, and it says what it will do next */
  const act = el('div', 'ctl');
  act.append(el('label', null, 'Take it'));
  const acts = el('div', 'states');
  const go = el('button', 'st', 'Expose');
  go.type = 'button';
  acts.append(go);
  act.append(acts);
  controls.append(act);
  go.addEventListener('click', () => expose());

  const view = canvas(stage, draw);

  /* the exposure runs: the surface fills over about a second and a half, so
     the room watches it arrive rather than being handed the result */
  let raf = 0, t0 = 0;
  function expose() {
    cancelAnimationFrame(raf);
    t0 = performance.now();
    state.playing = true;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 1500);
      state.run = k;
      view.render();
      if (k < 1) raf = requestAnimationFrame(step);
      else state.playing = false;
    };
    raf = requestAnimationFrame(step);
  }

  const rnd = (i, j, k) => {
    const s = Math.sin(i * 12.9898 + j * 78.233 + k * 37.719) * 43758.5453;
    return s - Math.floor(s);
  };

  /* the scene: a bright shape, a darker one, a gradient behind them */
  const scene = (i, j) => {
    const x = i / (PX_GRID - 1), y = j / (PX_GRID - 1);
    const a = Math.hypot(x - 0.36, y - 0.44) < 0.18;
    const b = Math.hypot(x - 0.68, y - 0.6) < 0.12;
    const v = Math.min(1, 0.12 + (1 - y) * 0.3 + (a ? 0.8 : 0) + (b ? 0.28 : 0));
    /* and its colour, for the one material that records it */
    const col = a ? [0.55, 0.85, 0.25] : (b ? [0.9, 0.35, 0.15] : [0.72, 0.74, 0.72]);
    return { v: v, col: col };
  };

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 28, gap = 30;
    const two = state.mat === 0;                  /* film shows both */
    const cols = two ? 3 : 2;
    const side = Math.min((w - pad * 2 - gap * (cols - 1)) / cols, h - pad * 2 - 26);
    const y = pad + (h - pad * 2 - 26 - side) / 2;
    const x0 = pad + ((w - pad * 2 - gap * (cols - 1)) / cols - side) / 2;
    const xs = [x0, x0 + side + gap, x0 + (side + gap) * 2];

    /* ---- the light, coming in from the left and staying ---- */
    const dose = PX_LIGHT[state.light].v * PX_TIME[state.time].v * state.run;
    ctx.save();
    ctx.beginPath(); ctx.rect(xs[0], y, side, side); ctx.clip();
    ctx.fillStyle = p.inset; ctx.fillRect(xs[0], y, side, side);
    const surfX = xs[0] + side * 0.76;
    const n = Math.round(PX_LIGHT[state.light].v * 26 * (state.playing ? 1 : 0.55));
    for (let k = 0; k < n; k += 1) {
      const ly = y + side * 0.05 + rnd(k, 1, 1) * side * 0.9;
      const len = side * (0.12 + rnd(k, 2, 2) * 0.24);
      const travel = (rnd(k, 3, 3) + state.run * 1.6) % 1;
      const x2 = xs[0] + side * 0.06 + travel * (surfX - xs[0] - side * 0.06);
      const g = ctx.createLinearGradient(x2 - len, ly, x2, ly);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, p.fg);
      ctx.save();
      ctx.globalAlpha = 0.5 + rnd(k, 4, 4) * 0.5;
      ctx.strokeStyle = g;
      ctx.lineWidth = 1 + rnd(k, 9, 9) * 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x2 - len, ly); ctx.lineTo(x2, ly); ctx.stroke();
      ctx.restore();
    }
    /* the surface, edge-on, and what has already landed and stayed on it */
    ctx.save();
    ctx.strokeStyle = p.marker; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.round(surfX) + 0.5, y + side * 0.05);
    ctx.lineTo(Math.round(surfX) + 0.5, y + side * 0.95);
    ctx.stroke();
    ctx.restore();
    for (let k = 0; k < Math.round(dose * 90); k += 1) {
      const gy = y + side * 0.05 + rnd(k, 5, 5) * side * 0.9;
      ctx.save();
      ctx.globalAlpha = 0.45 + rnd(k, 6, 6) * 0.5;
      ctx.fillStyle = p.fg;
      ctx.beginPath();
      ctx.arc(surfX + 2 + rnd(k, 8, 8) * 5, gy, state.mat === 2 ? 1 : 0.8 + rnd(k, 7, 7) * 1.6,
              0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    label(ctx, 'LIGHT, ARRIVING', xs[0], y - 10, p.muted, 9, 'left');
    label(ctx, PX_MAT[state.mat].toUpperCase(), surfX - 6, y + side + 16, p.marker, 9, 'right');

    /* ---- what it recorded ---- */
    const cell = side / PX_GRID;
    const drawPanel = (px, positive) => {
      for (let i = 0; i < PX_GRID; i += 1) {
        for (let j = 0; j < PX_GRID; j += 1) {
          const s = scene(i, j);
          const mean = s.v * dose * 90;
          const u = rnd(i, j, 1), v2 = rnd(i, j, 2);
          const g = Math.sqrt(-2 * Math.log(u + 1e-6)) * Math.cos(2 * Math.PI * v2);
          /* the noise is the counting itself, so it shows at the dim end and
             disappears at the bright one - which is the lesson, not a texture */
          const grain = state.mat === 2
            ? g * Math.sqrt(Math.max(mean, 1)) * 0.55
            : g * Math.sqrt(Math.max(mean, 1)) * 0.9;
          let val = Math.max(0, mean + grain) / 70;
          val = state.mat === 2 ? Math.min(1, val) : 1 - Math.exp(-val * 1.1);
          const shown = positive ? val : 1 - val;
          if (state.mat === 2 && positive) {
            const c = s.col.map((ch) => Math.round(6 + ch * val * 249));
            ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
          } else {
            const tone = Math.round(6 + shown * 243);
            ctx.fillStyle = 'rgb(' + tone + ',' + tone + ',' + tone + ')';
          }
          ctx.fillRect(px + i * cell, y + j * cell, cell + 0.6, cell + 0.6);
        }
      }
      ctx.save();
      ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(px) + 0.5, Math.round(y) + 0.5, Math.round(side), Math.round(side));
      ctx.restore();
    };

    if (state.mat === 0) {
      drawPanel(xs[1], false);
      label(ctx, 'THE NEGATIVE', xs[1], y - 10, p.muted, 9, 'left');
      drawPanel(xs[2], true);
      label(ctx, 'AND ITS POSITIVE', xs[2], y - 10, p.muted, 9, 'left');
    } else if (state.mat === 1) {
      drawPanel(xs[1], false);
      label(ctx, 'THE PAPER NEGATIVE', xs[1], y - 10, p.muted, 9, 'left');
    } else {
      drawPanel(xs[1], true);
      label(ctx, 'THE PICTURE', xs[1], y - 10, p.muted, 9, 'left');
    }

    const say = dose < 0.25 ? 'not enough light yet'
      : (dose > 2.6 ? 'too much — nothing left to record'
                    : (state.playing ? 'collecting' : 'about right'));
    label(ctx, say.toUpperCase(), xs[1], y + side + 18, p.signal, 9, 'left');
  }

  expose();
  return { render: view.render };
}

window.modelPhotons = modelPhotons;
