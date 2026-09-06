/* ============================================================
   LIGHT METER — a Sekonic L-308X, and a component
   ------------------------------------------------------------
   THIS ONE IS NOT AN INSTRUMENT, IT IS A PART. It will stand on
   its own page, and it will also sit inside the pinhole
   calculator, the exposure lessons and anything else that has to
   ask "what does the meter say". So it is written as something
   another file can drop in and drive:

       const m = lightMeter(someElement, { ev100: 15, iso: 100 });
       m.set({ ev100: 12 });        // the light changed
       m.read();                    // -> {iso, shutter, aperture, ev}

   and it tells its host when the hand turns something:

       lightMeter(el, { onChange: (r) => ... })

   THE PICTURE IS BATU'S OWN METER, photographed with the screen
   blank so the numbers can be ours. The screen is at 330, 376,
   327 x 125 in the 1000px artwork, measured off the file rather
   than guessed, and every element inside it was read off a
   magnified grid: the mode icons top left, ISO top right, the
   shutter large on the left and the aperture large on the right
   with its tenth-of-a-stop digit beside it.

   THE ARITHMETIC IS THE WHOLE POINT and it is four lines:

       EV(ISO 100) = log2( N^2 / t )
       at ISO S the same light reads   EV + log2(S/100)
       so for a chosen t:   N = sqrt( t * 2^EV * S/100 )

   A meter is that equation with a photocell on one end. Every
   other thing on the body - the dome, the modes, the memory - is
   about WHICH light gets measured, not about the sum.
   ============================================================ */

/* THE SCREEN, in the artwork's own pixels. Everything drawn into
   it is placed against these, so the whole display scales with
   the picture and nothing drifts. */
const LM_ART = 1000;
/* The body's own edges inside the square artwork, measured off the alpha
   channel: 539 x 925 at 228, 38. Drawing the whole square wasted nearly half
   the width on transparent margin and left the meter small in its own stage. */
const LM_BODY = { x: 228, y: 38, w: 539, h: 925 };
const LM_LCD = { x: 330.7 - 228, y: 376.0 - 38, w: 326.7, h: 125.3 };

/* and inside the screen, in the screen's own 490 x 188 grid,
   read off the magnified photograph */
const LM_P = {
  batt:  { x: 26,  y: 20,  w: 41, h: 17 },
  tbox:  { x: 26,  y: 50,  w: 37, h: 38 },
  sun:   { x: 86,  y: 26,  w: 31, h: 27 },
  flash: { x: 133, y: 21,  w: 44, h: 40 },
  cord:  { x: 193, y: 32,  w: 27, h: 21 },
  isoLb: { x: 292, y: 18 },
  isoNo: { x: 425, y: 15,  h: 48 },          /* right-aligned */
  fLb:   { x: 292, y: 53 },
  shut:  { x: 178, y: 97,  h: 66 },          /* right-aligned */
  ap:    { x: 433, y: 77,  h: 86 },          /* right-aligned */
  tenth: { x: 473, y: 100, h: 60 },          /* right-aligned */
};

/* The series a meter actually steps through. ISO goes down to 3
   because photographic paper lives there, and a paper negative in
   a pinhole camera is a thing this course does. */
const LM_ISO = [3, 6, 12, 25, 50, 100, 200, 400, 800, 1600, 3200, 6400];
const LM_SHUT = [
  1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125,
  1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30, 60,
];
const LM_FSTOP = ['1.0', '1.4', '2.0', '2.8', '4.0', '5.6', '8.0', '11',
                  '16', '22', '32', '45', '64', '90'];

/* how a shutter is written on the face: 1/125 is "125", a whole
   second and over is the number with a quote after it */
function lmShutterText(t) {
  if (t >= 1) return String(Math.round(t)) + '\u201d';
  const n = Math.round(1 / t);
  return String(n);
}

/* THE APERTURE, AS A METER SAYS IT: the nearest whole stop below,
   and then how far past it in tenths. f/5.6 and 3 means five point
   six and three tenths of a stop, which is what the small digit on
   the right of the screen is for and what almost nobody knows. */
function lmAperture(n) {
  /* A METER THAT CANNOT ANSWER SAYS SO. Clamping quietly at f/1.0 made the
     screen state an exposure that does not exist - on ISO 3 paper in a room
     the light really is off the bottom of the scale, and the honest reading is
     the one the L-308X gives: Eu under, Eo over. An instrument that invents a
     number where it has none is worse than one that admits the range. */
  if (n < 1.0) return { stop: 'Eu', tenth: '', exact: n, over: true };
  /* The real L-308X stops at f/90.9, and that limit is worth keeping rather
     than quietly exceeding: it is exactly why a pinhole at f/168 cannot be
     metered directly and has to be converted. */
  if (n > 90.9) return { stop: 'Eo', tenth: '', exact: n, over: true };
  const s = 2 * Math.log2(n);                     /* stops above f/1 */
  let whole = Math.floor(s + 1e-9);
  let tenth = Math.round((s - whole) * 10);
  if (tenth >= 10) { whole += 1; tenth = 0; }
  whole = Math.min(LM_FSTOP.length - 1, Math.max(0, whole));
  return { stop: LM_FSTOP[whole], tenth: tenth, exact: n };
}

/* the sum itself */
function lmSolve(ev100, iso, shutter) {
  const n = Math.sqrt(shutter * Math.pow(2, ev100) * (iso / 100));
  return lmAperture(n);
}

/* ------------------------------------------------------------------
   THE COMPONENT
   ------------------------------------------------------------------ */
function lightMeter(host, opts) {
  const o = opts || {};
  const state = {
    ev100: o.ev100 === undefined ? 15 : o.ev100,   /* the light itself */
    iso: o.iso || 100,
    si: 0,
    mode: o.mode || 'ambient',                      /* ambient | flash */
    lit: o.lit === undefined ? true : o.lit,        /* screen on */
  };
  state.si = LM_SHUT.indexOf(o.shutter || 1 / 125);
  if (state.si < 0) state.si = LM_SHUT.indexOf(1 / 125);
  let ii = LM_ISO.indexOf(state.iso);
  if (ii < 0) ii = LM_ISO.indexOf(100);

  const box = el('div', 'lm');
  const face = el('div', 'lm-face');
  const cv = el('canvas');
  face.append(cv);
  box.append(face);

  const bar = el('div', 'lm-bar');
  function step(label, onDown, onUp) {
    const g = el('div', 'lm-step');
    g.append(el('span', 'lm-k', label));
    const d = el('button', 'st', '−');
    const v = el('span', 'lm-v');
    const u = el('button', 'st', '+');
    [d, u].forEach((b) => { b.type = 'button'; });
    d.addEventListener('click', onDown);
    u.addEventListener('click', onUp);
    g.append(d, v, u);
    bar.append(g);
    return { v: v, d: d, u: u };
  }
  const isoUI = step('ISO', () => { ii = Math.max(0, ii - 1); changed(); },
                            () => { ii = Math.min(LM_ISO.length - 1, ii + 1); changed(); });
  const shUI = step('Shutter', () => { state.si = Math.max(0, state.si - 1); changed(); },
                               () => { state.si = Math.min(LM_SHUT.length - 1, state.si + 1); changed(); });
  const modeB = el('button', 'st lm-mode', 'Mode');
  modeB.type = 'button';
  modeB.addEventListener('click', () => {
    state.mode = state.mode === 'ambient' ? 'flash' : 'ambient';
    changed();
  });
  bar.append(modeB);
  box.append(bar);
  host.append(box);

  /* the two bodies: the same meter with a different mode lit */
  const art = {};
  ['ambient', 'flash'].forEach((k) => {
    const i = new Image();
    i.onload = () => { art[k] = i; render(); };
    i.src = '../_shared/interactives/art/meter-' + (k === 'ambient' ? 'ambient' : 'flash') + '.png';
  });
  if (document.fonts && document.fonts.load) {
    document.fonts.load('40px "Seven Segment"').then(render);
  }

  const ctx = cv.getContext('2d');
  let W = 0, H = 0;
  function resize() {
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }
  new ResizeObserver(() => {
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    if (Math.abs(r.width - W) < 0.5 && Math.abs(r.height - H) < 0.5) return;
    resize();
  }).observe(cv);
  requestAnimationFrame(resize);

  function read() {
    const t = LM_SHUT[state.si];
    const a = lmSolve(state.ev100, LM_ISO[ii], t);
    return {
      ev100: state.ev100, iso: LM_ISO[ii], shutter: t, mode: state.mode,
      aperture: a.exact, stop: a.stop, tenth: a.tenth, over: !!a.over,
      ev: state.ev100 + Math.log2(LM_ISO[ii] / 100),
    };
  }
  function changed() { render(); if (o.onChange) o.onChange(read()); }

  /* ---- the face --------------------------------------------------- */

  function seg(x, y, size, text, align) {
    ctx.font = Math.round(size) + 'px "Seven Segment", monospace';
    ctx.textAlign = align || 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, y);
  }

  function render() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    const img = art[state.mode] || art.ambient;
    if (!img) return;
    /* the body, fitted */
    const k = Math.min(W / LM_BODY.w, H / LM_BODY.h);
    const bw = LM_BODY.w * k, bh = LM_BODY.h * k;
    const bx = (W - bw) / 2, by = (H - bh) / 2;
    ctx.drawImage(img, LM_BODY.x, LM_BODY.y, LM_BODY.w, LM_BODY.h, bx, by, bw, bh);

    if (!state.lit) return;

    /* the screen. Everything inside is placed in the LCD's own
       490 x 188 grid and scaled once, so a number never drifts. */
    const lx = bx + LM_LCD.x * k, ly = by + LM_LCD.y * k;
    const lk = (LM_LCD.w * k) / 490;
    const P = (p) => ({ x: lx + p.x * lk, y: ly + p.y * lk });
    ctx.save();
    ctx.fillStyle = '#0B1512';                 /* LCD segments are near-black */

    const r = read();

    /* ISO, top right */
    ctx.font = Math.round(15 * lk) + 'px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('ISO', P(LM_P.isoLb).x, P(LM_P.isoLb).y);
    ctx.fillText('F', P(LM_P.fLb).x, P(LM_P.fLb).y);

    seg(lx + LM_P.isoNo.x * lk, ly + (LM_P.isoNo.y + LM_P.isoNo.h) * lk,
        LM_P.isoNo.h * lk, String(r.iso));

    /* the shutter, large on the left */
    seg(lx + LM_P.shut.x * lk, ly + (LM_P.shut.y + LM_P.shut.h) * lk,
        LM_P.shut.h * lk, lmShutterText(r.shutter));

    /* the aperture, large on the right, with its tenth beside it */
    seg(lx + LM_P.ap.x * lk, ly + (LM_P.ap.y + LM_P.ap.h) * lk,
        LM_P.ap.h * lk, r.stop);
    seg(lx + LM_P.tenth.x * lk, ly + (LM_P.tenth.y + LM_P.tenth.h) * lk,
        LM_P.tenth.h * lk, String(r.tenth));

    /* the T marker: this meter is being read shutter-first, which is
       what T means on the body, and it is lit because that is the
       mode every exposure lesson in this course uses */
    ctx.lineWidth = Math.max(1, 2 * lk);
    ctx.strokeStyle = '#0B1512';
    const tb = P(LM_P.tbox);
    ctx.strokeRect(tb.x, tb.y, LM_P.tbox.w * lk, LM_P.tbox.h * lk);
    ctx.font = Math.round(26 * lk) + 'px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('T', tb.x + LM_P.tbox.w * lk / 2, tb.y + LM_P.tbox.h * lk / 2);
    ctx.restore();

    /* the values under the thumb, in words */
    isoUI.v.textContent = String(r.iso);
    shUI.v.textContent = lmShutterText(r.shutter);
    modeB.textContent = r.mode === 'ambient' ? 'Ambient' : 'Flash';
    isoUI.d.disabled = ii === 0;
    isoUI.u.disabled = ii === LM_ISO.length - 1;
    shUI.d.disabled = state.si === 0;
    shUI.u.disabled = state.si === LM_SHUT.length - 1;
    [isoUI.d, isoUI.u, shUI.d, shUI.u]
      .forEach((b) => b.classList.toggle('off', b.disabled));
  }

  const api = {
    el: box,
    canvas: cv,
    read: read,
    render: render,
    set: function (patch) {
      if (patch.ev100 !== undefined) state.ev100 = patch.ev100;
      if (patch.mode !== undefined) state.mode = patch.mode;
      if (patch.lit !== undefined) state.lit = patch.lit;
      if (patch.iso !== undefined) {
        const j = LM_ISO.indexOf(patch.iso);
        if (j >= 0) ii = j;
      }
      if (patch.shutter !== undefined) {
        const j = LM_SHUT.indexOf(patch.shutter);
        if (j >= 0) state.si = j;
      }
      render();
      return api;
    },
  };
  return api;
}

/* ------------------------------------------------------------------
   THE STANDALONE PAGE — the same component with a light to point it at
   ------------------------------------------------------------------ */
function mountLightMeter(fig) {
  const stage = el('div', 'stage wide lm-stage');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Light meter'),
              el('span', 'ts-sub', 'sekonic l-308x · iso · shutter · aperture'));
  fig.prepend(head);

  /* THE LIGHT ITSELF, which is the one thing a real meter does not let
     you set. Naming the scenes rather than the numbers is deliberate:
     a student learns the EV of a bright overcast day by recognising the
     day, not by memorising 13. */
  const SCENES = [
    ['Sunny 16, open sun', 15],
    ['Hazy sun', 14],
    ['Bright overcast', 13],
    ['Overcast', 12],
    ['Heavy overcast', 11],
    ['Open shade', 12],
    ['Window light indoors', 9],
    ['Room, lamps on', 7],
    ['Candlelit', 4],
    ['Full moon on snow', -2],
  ];
  let scene = 0;

  const wrap = el('div', 'lm-wrap');
  stage.append(wrap);
  const meter = lightMeter(wrap, {
    ev100: SCENES[0][1], iso: 100, shutter: 1 / 125,
    onChange: () => refresh(),
  });

  const sc = el('div', 'ctl span2');
  sc.append(el('label', null, 'The light <span class="val"></span>'));
  const scRow = el('input', 'range');
  scRow.type = 'range'; scRow.min = '0'; scRow.max = String(SCENES.length - 1);
  scRow.step = '1'; scRow.value = '0';
  sc.append(scRow); controls.append(sc);
  const scVal = sc.querySelector('.val');
  scRow.addEventListener('input', () => {
    scene = +scRow.value;
    meter.set({ ev100: SCENES[scene][1] });
    refresh();
  });

  const out = readout(fig, [
    { key: 'It says', cls: 'hi', wide: true },
    { key: 'Which is', wide: true },
  ]);

  fsButton(stage, fig);

  function refresh() {
    const r = meter.read();
    scVal.textContent = SCENES[scene][0] + ' · EV ' + SCENES[scene][1];
    out['It says'].textContent = r.over
      ? 'out of range — ' + (r.aperture < 1 ? 'not enough light for this film and '
          + 'shutter, open the shutter or use a faster film'
          : 'too much light, shorten the shutter')
      : lmShutterText(r.shutter) + ' at f/' + r.stop
        + (r.tenth ? ' and ' + r.tenth + '/10' : '');
    /* the same exposure said the other way, which is the thing that makes
       a meter reading stop being a number and start being a choice */
    /* SPREAD ACROSS THE SCALE, not the first four that happen to work. Walking
       the list in order offered 1/8000, 1/4000, 1/2000 and 1/1000 - four
       speeds nobody weighs against each other. These are two stops apart, so
       the aperture moves a whole stop each time and the trade is visible. */
    const alt = [];
    [1 / 1000, 1 / 250, 1 / 60, 1 / 15, 1 / 4, 1].forEach((t) => {
      if (t === r.shutter || alt.length >= 4) return;
      const a = lmSolve(r.ev100, r.iso, t);
      if (a.over) return;                       /* only the ones it can answer */
      alt.push(lmShutterText(t) + ' at f/' + a.stop);
    });
    out['Which is'].textContent = alt.length
      ? 'the same light as ' + alt.join(' · ')
      : 'no shutter on this meter can hold this light at this film speed';
    meter.render();
  }
  refresh();
  return meter;
}
