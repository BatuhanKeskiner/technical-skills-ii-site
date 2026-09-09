/* ============================================================
   PHOTOGRAM — a map of time
   ------------------------------------------------------------
   A PHOTOGRAM IS NOT A PICTURE OF OBJECTS. It is a picture of
   how long each part of the paper was allowed to see the lamp.
   Covered throughout: white. Never covered: black. Uncovered
   halfway through: the grey of half the time. Hold that and
   duration, aperture and mid-tone stop being three lessons.

   TWO ROADS TO ONE GREY, and the instrument exists for the
   comparison. A key lifted at six seconds of twelve leaves a
   mid-grey because of DURATION. A sheet of tracing paper that
   never moved leaves a mid-grey because of TRANSMISSION. Put
   them side by side and a student can see that the paper cannot
   tell the difference — it only ever counted light.

   THE PHYSICS IS NOT WRITTEN HERE. It is in photochem.js,
   shared with the test strip, because the enlarger's timer and
   its aperture are two ways of setting one number and the paper
   turns that number into a tone. Same machine, different
   question.

   WHAT EACH PIXEL GETS. For a point p under a set of objects,
   each present for the first on_k seconds and passing T_k of
   the light,

       seconds(p) = ∫ over the exposure of  ∏ T_k
                    for every k still lying on p at that instant

   which, because every object goes down at zero and is lifted
   at on_k, is a sum over the sorted lift times. Four objects,
   five terms, done once per exposure into a map the developing
   animation then reads.
   ============================================================ */

/* The sheet's own grid. Coarse enough to compute in one go, fine
   enough that an edge is an edge. */
/* THE SHEET'S OWN PROPORTION, measured off Batu's photograph rather than
   chosen: the paper in it is 1422 x 1177 pixels, so 1.208 wide to tall. A
   buffer of a different shape would stretch the print. */
/* AND THE GRID IS THE PRINT'S RESOLUTION. Every dose, every object's mask and
   every tone is one number per cell of this grid, and the finished print is
   that picture scaled to whatever size the paper is drawn at - so this number
   is how sharp a photogram can be. It was 460 across, which is smaller than
   the sheet is drawn even in a window and a third of what a projector asks
   for, and the feather came out of the bath softer than it went in.
   The cost is one pass over the grid per frame during the reveal, and only
   then: measured below at 60 frames a second with room to spare. */
const PG_W = 960, PG_H = 795;

/* WHERE THE PAPER LIES IN THE PHOTOGRAPH, as fractions of the picture. Read
   off the exposed frame by finding the neutral white of the lit sheet - the
   pool of lamplight around it is warm, the paper is not - so the objects and
   the exposure land on the actual paper rather than near it. */
const PG_SHEET = { x0: 0.3162, x1: 0.6838, y0: 0.2424, y1: 0.7987 };

/* THE OBJECTS. Two that stop the light dead and two that let some
   through, because one of each would only teach half of it. x and
   y are the centre as a fraction of the sheet, so they survive a
   resize. T is what fraction of the lamp gets past. */
/* SIZED AT THEIR OWN PROPORTIONS. w and h are fractions of the SHEET, and the
   sheet is 1.208 wide to tall, so a picture keeps its shape only when
   w/h = (its own aspect) x 0.828. The feather was at 0.44 by 0.30, which drew
   a nearly square photograph at an aspect of 1.77: it was stretched to nearly
   twice its width and nobody had checked.

   The sizes are the real ones. On a sheet whose short edge is about 20 cm: a
   key of eight centimetres, a lemon slice of six, a leaf of twelve. */
const PG_KIT = [
  { id: 'key',     name: 'Key',      T: 0,    w: 0.113, h: 0.40, x: 0.30, y: 0.32, put: true,
    img: 'obj-key.png' },
  /* A LEAF IS TRANSLUCENT, and at 0.02 to 0.22 this one was not: it blocked so
     nearly everything that the whole blade came out white and its structure -
     the reason anybody puts a leaf on paper - never reached the print. A real
     leaf passes a good deal of light between its veins and very little through
     them, which is the whole picture: the thicker it gets, the lighter it
     prints. */
  { id: 'leaf',    name: 'Leaf',     T: 0.10, T2: 0.40, w: 0.30, h: 0.50, x: 0.68, y: 0.44,
    put: false, img: 'obj-leaf.png', read: 'inv' },
  { id: 'lemon',   name: 'Lemon',    T: 0.20, T2: 0.78, w: 0.25, h: 0.305, x: 0.62, y: 0.68,
    put: true, img: 'obj-lemon.png', read: 'lum' },
  { id: 'tracing', name: 'Tracing',  T: 0.50, w: 0.24, h: 0.22, x: 0.45, y: 0.50, put: false },
];


/* Each object drawn into a box, in a grey whose VALUE IS ITS
   TRANSMISSION — black passes nothing, mid-grey passes half. The
   same paths draw the visible object later; only the fill changes. */
function pgShape(ctx, id, x, y, w, h, fill, rimFill) {
  ctx.save();
  ctx.translate(x, y);
  if (id === 'key') {
    const r = h * 0.5;
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(r, h / 2, r, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r, h / 2, r * 0.42, 0, Math.PI * 2);
    ctx.globalCompositeOperation = 'destination-out'; ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = fill;
    ctx.fillRect(r * 1.6, h * 0.40, w - r * 1.6, h * 0.20);
    ctx.fillRect(w - h * 0.55, h * 0.40, h * 0.14, h * 0.44);
    ctx.fillRect(w - h * 0.24, h * 0.40, h * 0.14, h * 0.32);
  } else if (id === 'leaf') {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.quadraticCurveTo(w * 1.05, h * 0.40, w / 2, h * 0.86);
    ctx.quadraticCurveTo(-w * 0.05, h * 0.40, w / 2, 0);
    ctx.fill();
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(1.5, w * 0.045); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(w / 2, h * 0.84); ctx.lineTo(w / 2, h); ctx.stroke();
  } else if (id === 'glass') {
    /* straight down, a glass is two circles: the wall, which is
       thick and dark, and the base, which is thin and pale */
    const r = Math.min(w, h) / 2;
    ctx.fillStyle = rimFill || fill;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, r * 0.80, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = fill;
    ctx.translate(w / 2, h / 2); ctx.rotate(-0.13); ctx.translate(-w / 2, -h / 2);
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

function mountPhotogram(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Photogram'),
              el('span', 'ts-sub', 'expose · move · expose again'));
  fig.prepend(head);

  /* THE GROUND HAS TO BE BLACK. A photogram whose bare paper is a dark grey is
     not a photogram - the silhouettes have nothing to stand against. Maximum
     black on this paper is 24 seconds at f/8, so that is where the exposure
     starts, and the range goes far enough that f/11 can reach it too. Twelve
     seconds, which was the old default, leaves the ground at Zone II. */
  /* ONE TIMER, ONE SET OF NUMBERS. This had a dial of its own - 6, 12, 16, 20,
     24, 30, 36, 48, 60 - which is not what the timer beside it offers, and two
     enlarger timers in one darkroom that disagree about what seconds are is
     one of them lying. It reads TS_TIMES now, the same 1 to 10 the test strip
     sets its interval in.

     THE DEFAULT IS STILL ONE BURST SHORT OF BLACK. Eight seconds at f/8 is a
     dose of 0.67 and lands bare paper around Zone III; a second burst takes it
     to 1.33, which is nearly black; anything covered for only one of the two
     sits between. Three tones from two presses, and the aperture is there for
     anyone who wants black in one. */
  const PG_EXP = TS_TIMES;

  const state = {
    stop: 2,                 /* index into TS_STOPS — f/8 */
    ei: 7,                   /* index into PG_EXP — 8 s, about Zone III */
    obj: PG_KIT.map((o) => ({ ...o })),
    sel: 0,
    phase: 'place',          /* place ⇄ expose, then develop → read */
    shots: 0,                /* how many bursts of light the sheet has had */
    secs: 0,                 /* and how many seconds altogether */
    run: null,
    devT: 0,
    light: 0,
    dose: null,              /* Float32Array once exposed */
    tone: null,              /* Uint8ClampedArray, the finished print */
    drag: null,
    hot: null,
    hotSlot: null,
    overRack: false,
  };
  /* `on` is how long an object lies on the paper. null means all of it,
     which is what an object does unless somebody lifts it. */

  /* A PHOTOGRAPHED OBJECT BRINGS ITS OWN TRANSMISSION. A drawn shape has one
     number for the whole of it; a feather has a solid shaft, barbs that pass
     most of the light and an edge that passes nearly all of it — and that
     variation IS the mid-tone lesson, in one object, without anybody being
     told. Its alpha channel is the map. */
  const pics = {};
  PG_KIT.forEach((o) => {
    if (!o.img) return;
    const i = new Image();
    i.onload = () => {
      /* THE CUT-OUT HAS TO BE MADE, because the file does not have one. It
         looks like a feather on transparency and it is a feather on white:
         every pixel is opaque and the corner is 254. So the shape is lifted
         off the ground - anything more than a couple of levels darker than the
         paper is the feather, with a soft band for the barb tips.

         AND ONLY THE SHAPE. The photograph's own tones cannot be used as the
         feather's density: the shaft reads 203 because the light caught it and
         the barbs read 172 because they are in shadow, so believing the
         luminance would make the barbs block MORE light than the shaft, which
         is backwards. The shape is the feather's; the transmission is one
         number, and it is honest about being one number.

         The right artefact is a flatbed scan of a real feather - a scanner is
         a contact printer, so the scan IS the photogram. Asked for. */
      const cut = document.createElement('canvas');
      cut.width = i.naturalWidth; cut.height = i.naturalHeight;
      const gc = cut.getContext('2d', { willReadFrequently: true });
      gc.drawImage(i, 0, 0);
      if (o.cut) {
        /* ONLY THE FEATHER NEEDS THIS. Its file is a feather on white, not a
           feather on transparency, so the shape has to be lifted off the
           ground. Batu's own cut-outs arrive with their alpha already in them
           and running this over one would eat the object's own dark parts. */
        const px = gc.getImageData(0, 0, cut.width, cut.height);
        const dd = px.data;
        for (let q = 0; q < dd.length; q += 4) {
          const l = 0.2126 * dd[q] + 0.7152 * dd[q + 1] + 0.0722 * dd[q + 2];
          /* the ground is 254 and the file carries a little compression noise
             around it, so anything within seven levels is ground. Two was not
             enough: it left a faint dithered rectangle of nearly-nothing that
             blocked nearly-nothing, and printed as a visible box. */
          const a = Math.max(0, Math.min(1, (254 - l - 16) / 26));
          dd[q + 3] = Math.round(a * 255);
        }
        gc.putImageData(px, 0, 0);
      }
      pics[o.id] = cut;

      /* THE SAME OBJECT UNDER THE SAFELIGHT. They were painted out to a flat
         near-black, which is what you draw when you have no photograph; with
         one, the honest thing is the object itself under a red lamp. The
         picture is multiplied by the safelight's own red and its alpha put
         back, exactly as the tray is - so a lemon on the bench is a lemon, and
         a dark one. */
      /* AND IT IS DARKER THAN THE PAPER IT LIES ON. Multiplied by the tray's
         own red, a lemon came out at (144,15,4) on paper that reads (149,8,3),
         and Batu could not see it at all. Nothing on a bench is exactly as
         bright as a sheet of white paper: the paper is the brightest thing in
         a darkroom, which is why you can find it in the dark. A deeper red for
         the objects, and they sit ON the sheet instead of vanishing into it. */
      const red = document.createElement('canvas');
      red.width = cut.width; red.height = cut.height;
      const g2 = red.getContext('2d');
      g2.drawImage(cut, 0, 0);
      g2.globalCompositeOperation = 'multiply';
      g2.fillStyle = 'rgb(96,11,7)';
      g2.fillRect(0, 0, red.width, red.height);
      g2.globalCompositeOperation = 'destination-in';
      g2.drawImage(cut, 0, 0);
      pics[o.id + ':red'] = red;

      /* THE SHADOW IT CASTS. An object lying on paper has one, and without it
         the object reads as printed on the sheet rather than resting on it. */
      const sh = document.createElement('canvas');
      sh.width = cut.width; sh.height = cut.height;
      const g4 = sh.getContext('2d');
      g4.drawImage(cut, 0, 0);
      g4.globalCompositeOperation = 'source-in';
      g4.fillStyle = 'rgb(0,0,0)';
      g4.fillRect(0, 0, sh.width, sh.height);
      pics[o.id + ':shade'] = sh;

      /* AND WHAT IT LETS THROUGH, PIXEL BY PIXEL, when the photograph can say.
         A flat number per object is right for a key, which is metal, and wrong
         for a slice of lemon, whose whole interest is that the flesh passes
         light and the pith and rind do not.

         Which way round depends on how the thing was photographed, and it is
         not a matter of taste:
           'lum' - photographed THROUGH, backlit. Brightness IS transmission.
                   The lemon slice is lit from behind; its bright flesh is
                   bright because the light came through it.
           'inv' - photographed in reflected light. Brightness is DENSITY: the
                   thicker a leaf's veins, the more light they scatter back and
                   the less they pass. So the picture is read upside down, and
                   the veins print light on a dark blade - which is what a leaf
                   photogram looks like.
         The feather is left on one number, because its file is neither: the
         shaft reads bright because the light caught it and the barbs read dark
         because they were in shadow, so believing either reading of it would
         be inventing physics. The right artefact there is a flatbed scan - a
         scanner IS a contact printer, so the scan IS the photogram. Asked for. */
      if (o.read) {
        const tm = document.createElement('canvas');
        tm.width = cut.width; tm.height = cut.height;
        const g3 = tm.getContext('2d', { willReadFrequently: true });
        g3.drawImage(cut, 0, 0);
        const tp = g3.getImageData(0, 0, tm.width, tm.height);
        const td = tp.data;
        const lo = o.T, hi = (o.T2 == null ? o.T : o.T2);
        for (let q = 0; q < td.length; q += 4) {
          const l = (0.2126 * td[q] + 0.7152 * td[q + 1] + 0.0722 * td[q + 2]) / 255;
          const f = o.read === 'inv' ? 1 - l : l;
          const v = Math.round((lo + (hi - lo) * f) * 255);
          td[q] = v; td[q + 1] = v; td[q + 2] = v;
        }
        g3.putImageData(tp, 0, 0);
        pics[o.id + ':T'] = tm;
      }
      buildMasks(); view.render();
    };
    i.src = '../_shared/interactives/art/' + o.img;
  });

  /* THE BENCH IS A PHOTOGRAPH OF THE BENCH. Two frames of the same shot, one
     under the safelight and one with the lamp burning, so turning the light
     on is a change of picture rather than a change of drawing - exactly the
     way the enlarger works on the test strip. */
  const art = {};
  ['off', 'on'].forEach((k) => {
    const i = new Image();
    i.onload = () => { art[k] = i; view.render(); };
    i.src = '../_shared/interactives/art/photogram-' + k + '.jpg';
  });

  /* AND THE CLOCK STANDS ON THE BENCH. The exposure was a number in the
     control bar and nothing in the room, which is the wrong way round: in a
     darkroom the timer is the thing you look at. It is the same instrument as
     the test strip's, out of timer.js, so the two cannot drift apart. */
  const tArt = dtArt(() => view.render());
  let tbox = null;

  /* AND THE SAME BATH. The sheet goes into the same developer as the test
     strip's - one tray, one clock, in tray.js - because a print that behaves
     differently in the two rooms is two different chemistries. */
  const trays = trayArt(() => view.render());

  const snd = enlargerSound();
  let ticked = 0;                       /* the last whole second announced */

  const view = canvas(stage, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('role', 'application');
  cv.setAttribute('aria-label',
    'A sheet of photographic paper with objects on it. Drag an object to move '
    + 'it, click it to select it, and set how long it stays on the paper.');
  fsButton(stage, fig);
  soundButton(stage, snd);

  /* ---- controls -------------------------------------------------------- */

  const ap = el('div', 'ctl ts-ap');
  ap.append(el('label', null, 'Aperture'));
  const apRow = el('div', 'ts-step');
  const apDown = el('button', 'st', '−');
  const apVal = el('span', 'ts-big');
  const apUp = el('button', 'st', '+');
  apRow.append(apDown, apVal, apUp); ap.append(apRow); controls.append(ap);

  const ex = el('div', 'ctl ts-ap');
  ex.append(el('label', null, 'Exposure'));
  const exRow = el('div', 'ts-step');
  const exDown = el('button', 'st', '−');
  const exVal = el('span', 'ts-big');
  const exUp = el('button', 'st', '+');
  exRow.append(exDown, exVal, exUp); ex.append(exRow); controls.append(ex);

  /* ONE SLIDER, FOR WHICHEVER OBJECT IS SELECTED. Four sliders for four
     objects filled the bar with numbers and put the choice a long way from
     the thing being chosen. The object is picked on the paper, where your
     eyes already are, and the bar sets the one thing about it that matters. */
  const acts = el('div', 'states span3 ts-acts');
  const bExpose = el('button', 'st', 'Expose');
  const bDevelop = el('button', 'st', 'Develop');
  const bLift = el('button', 'st', 'Lift off');
  const bReset = el('button', 'st', 'New sheet');
  [bExpose, bDevelop, bLift, bReset].forEach((b) => { b.type = 'button'; acts.append(b); });
  controls.append(acts);

  /* THE THREE GATES (O1 O2 O3), ANSWERED — one cell, and it earns it.
     Nobody sets it: it is worked out from where the objects are and how
     opaque each one is. Nothing in the picture states it: the paper shows a
     tone, not a name for the tone, and the whole difficulty of a photogram is
     that you cannot see what is under an object until the object is lifted.
     And it is acted on — it is the reason to move a thing before exposing.
     The aperture and the seconds are on the controls and are not read twice. */
  const out = readout(fig, [
    { key: 'Under it', cls: 'hi', wide: true },
  ]);

  [apDown, apUp, exDown, exUp].forEach((b) => { b.type = 'button'; });

  /* ---- what the hands do ----------------------------------------------- */

  const locked = () => state.phase !== 'place';

  function setStop(d) {
    if (locked()) return;
    const n = Math.min(TS_STOPS.length - 1, Math.max(0, state.stop + d));
    if (n === state.stop) return;
    state.stop = n; refresh();
  }
  function setExp(d) {
    if (locked()) return;
    const n = Math.min(PG_EXP.length - 1, Math.max(0, state.ei + d));
    if (n === state.ei) return;
    state.ei = n; refresh();
  }
  apDown.addEventListener('click', () => setStop(-1));
  apUp.addEventListener('click', () => setStop(1));
  exDown.addEventListener('click', () => setExp(-1));
  exUp.addEventListener('click', () => setExp(1));

  /* ---- the masks, and the map of time ---------------------------------- */

  /* One canvas per object at the sheet's own grid, drawn in the grey that IS
     its transmission. Rebuilt when something moves; read once per exposure. */
  const masks = [];
  function buildMasks() {
    state.obj.forEach((o, i) => {
      let m = masks[i];
      if (!m) { m = document.createElement('canvas'); m.width = PG_W; m.height = PG_H; masks[i] = m; }
      const g = m.getContext('2d');
      g.clearRect(0, 0, PG_W, PG_H);
      if (!o.put) return;
      const w = o.w * PG_W, h = o.h * PG_H;
      const x = o.x * PG_W - w / 2, y = o.y * PG_H - h / 2;
      const t = Math.round(o.T * 255);
      if (o.img) {
        /* WHERE THE PICTURE CAN SAY, THE PICTURE SAYS. An object with a
           transmission map is drawn straight in: its greys ARE how much light
           gets through at each point, and its alpha is still its shape. That
           is the lemon's segments and the leaf's veins, and it costs nothing
           here because the map was baked once when the file loaded. */
        const tm = pics[o.id + ':T'];
        if (tm) { g.drawImage(tm, x, y, w, h); return; }
        /* otherwise the photograph's own alpha, painted in the grey of its
           transmission: colour says how much gets through where the object is
           solid, alpha says how solid it is */
        const im = pics[o.id];
        if (!im) return;
        g.drawImage(im, x, y, w, h);
        g.globalCompositeOperation = 'source-in';
        g.fillStyle = 'rgb(' + t + ',' + t + ',' + t + ')';
        g.fillRect(0, 0, PG_W, PG_H);
        g.globalCompositeOperation = 'source-over';
        return;
      }
      const rim = o.id === 'glass' ? 'rgb(38,38,38)' : null;
      pgShape(g, o.id, x, y, w, h, 'rgb(' + t + ',' + t + ',' + t + ')', rim);
    });
  }

  /* EXPOSE, MOVE, EXPOSE AGAIN. This is how a photogram is actually made, and
     it is the reason the old model went: an object with a "time on the paper"
     was a slider standing in for a hand. Now the light is given in bursts, the
     dose ACCUMULATES on the sheet, and between two bursts you pick things up
     and put them down. Two exposures with a key moved between them leave three
     tones - twice-lit, once-lit, never-lit - and nobody has to be told why.

     THE TRANSMISSION IS PER PIXEL, not per object. A drawn shape has one
     number for all of it; a photographed feather has a solid shaft, barbs that
     pass most of the light and an edge that passes nearly all. So the mask's
     ALPHA says how much of the object is there and its GREY says what gets
     through where it is: t = 1 - alpha * (1 - T). For a hard-edged drawing the
     alpha is 0 or 1 and this is the old sum again. */
  function expose() {
    if (state.run || state.phase === 'develop' || state.phase === 'read') return;
    buildMasks();
    const secs = PG_EXP[state.ei];
    const add = tsDose(secs, TS_STOPS[state.stop]);
    const px = state.obj.map((o, i2) => (o.put && masks[i2])
      ? masks[i2].getContext('2d').getImageData(0, 0, PG_W, PG_H).data : null);

    if (!state.dose) state.dose = new Float32Array(PG_W * PG_H);
    const dose = state.dose;
    for (let q = 0; q < PG_W * PG_H; q++) {
      const a = q * 4;
      let T = 1;
      for (let k = 0; k < px.length; k++) {
        const m = px[k];
        if (!m) continue;
        const al = m[a + 3] / 255;
        if (al > 0.004) T *= 1 - al * (1 - m[a] / 255);
      }
      dose[q] += add * T;
    }
    state.shots += 1;
    state.secs += secs;
    state.phase = 'expose';
    runExposure();
  }

  /* The lamp burns for the exposure, at twice life like the test strip's, and
     the objects lift off it one at a time as their moment comes. */
  function runExposure() {
    const total = PG_EXP[state.ei];
    state.run = { total: total, done: 0 };
    snd.close();                        /* the contact, and the lamp is on */
    ticked = 0;
    const still = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || document.hidden) {
      state.run = null; state.phase = 'place'; snd.open(); refresh(); return;
    }
    const t0 = performance.now();
    (function tick(now) {
      if (!state.run) return;
      state.run.done = Math.min(total, ((now - t0) / 1000) * 2);
      const whole = Math.floor(state.run.done);
      if (whole > ticked) { ticked = whole; snd.tick(); }
      if (state.run.done >= total) {
        state.run = null; state.phase = 'place'; snd.open(); refresh(); return;
      }
      view.render();
      requestAnimationFrame(tick);
    })(t0);
    refresh();
  }

  function develop() {
    if (!state.shots || state.phase === 'develop' || state.phase === 'read'
        || state.run) return;
    /* the tone the sheet ended up with, worked out once from everything it was
       given, and then the reveal only stages it */
    state.tone = new Uint8ClampedArray(PG_W * PG_H);
    for (let q = 0; q < PG_W * PG_H; q++) {
      state.tone[q] = Math.round(tsTone(state.dose[q]) * 255);
    }
    state.phase = 'develop'; state.devT = 0; state.light = 0; state.tray = 0;
    const still = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || document.hidden) {
      state.devT = 1; state.light = 1; state.tray = 0;
      state.phase = 'read'; refresh(); return;
    }
    /* ONE CLOCK, FIVE STAGES, and it is the test strip's. The tray comes up,
       the image comes, the light is thrown, the tray is carried away. */
    const t0 = performance.now();
    (function step(now) {
      const q = devClock(now - t0);
      state.tray = q.tray; state.devT = q.devT; state.light = q.light;
      view.render();
      if (!q.done) { requestAnimationFrame(step); return; }
      state.tray = 0; state.devT = 1; state.light = 1;
      state.phase = 'read'; refresh();
    })(t0);
    refresh();
  }

  bExpose.addEventListener('click', () => { if (state.phase === 'place') expose(); });
  bDevelop.addEventListener('click', develop);
  bLift.addEventListener('click', () => {
    /* everything back to the bench, so the print can be seen whole */
    state.obj.forEach((o) => { o.put = false; });
    refresh();
  });
  bReset.addEventListener('click', () => {
    state.obj = PG_KIT.map((o) => ({ ...o }));
    state.phase = 'place'; state.run = null; state.devT = 0; state.light = 0;
    state.shots = 0; state.secs = 0;
    state.dose = null; state.tone = null; state.sel = 0;
    refresh();
  });

  /* ---- pointer ---------------------------------------------------------- */

  /* ONE PLACE THAT KNOWS HOW AN OBJECT LOOKS, so the thing on the bench and
     the thing on the paper cannot drift apart. A drawn object is a path in a
     near-black whose weight is its transmission; a photographed one is the
     photograph, darkened the same amount, because on the paper you are looking
     at a silhouette either way. */
  /* TWO APPEARANCES, AND THE ROOM DECIDES WHICH. Under the safelight the
     object is itself under a red lamp; with the enlarger burning it is itself
     under a white one. They were a flat near-black either way, which is what
     you draw when you have no photograph of the thing. */
  function drawObject(ctx, o, x, y, w, h, sel, dark) {
    /* A DRAWN OBJECT HAS TWO STATES TOO. Tracing paper is white and it lets
       light through - that is the whole of what it is - and it was a dark
       shape in every light, which is what a photographed object looks like and
       not what a sheet of tracing paper looks like. Under the safelight it is
       a dull red sheet on brighter paper; with the lamp on it is milky white
       and you can see the sheet through it. The more it transmits, the more
       you see through it, which is one number doing both jobs. */
    const solid = dark
      ? 'rgba(10,2,2,' + (0.94 - o.T * 0.55) + ')'
      : 'rgba(250,249,244,' + (0.30 + (1 - o.T) * 0.50) + ')';
    if (o.img) {
      const im = pics[o.id + (dark ? ':red' : '')];
      if (im) {
        ctx.save();
        const sh = pics[o.id + ':shade'];
        if (sh) {
          const d = Math.max(2, w * 0.02);
          ctx.globalAlpha = 0.30;
          ctx.drawImage(sh, x + d, y + d, w, h);
        }
        /* what passes light is drawn as passing light */
        ctx.globalAlpha = 1 - o.T * 0.30;
        ctx.drawImage(im, x, y, w, h);
        ctx.restore();
      }
    } else {
      pgShape(ctx, o.id, x, y, w, h, solid, null);
      /* AND AN EDGE, for the one that is a rectangle. A milky rectangle with
         no edge is a smudge on the paper; with one it is a sheet lying on it. */
      if (o.id === 'tracing') {
        ctx.strokeStyle = dark ? 'rgba(255,150,130,0.35)' : 'rgba(90,90,86,0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      }
    }
    if (sel) {
      ctx.strokeStyle = dark ? 'rgba(255,235,220,0.85)' : 'rgba(20,20,20,0.7)';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(x - 5.5, y - 5.5, w + 11, h + 11);
    }
  }

  let sheet = null;                     /* where the paper was last drawn */
  let rack = null;                      /* and the bench beside it */
  let slots = [];                       /* where each waiting object sits */
  function at(ev) {
    const r = cv.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }
  function onRack(pt) {
    return rack && pt.x <= rack.x + rack.w;
  }
  /* WHAT IS UNDER THE POINTER, on the paper or on the bench. The bench is
     checked first because a slot can overlap nothing else, and the paper is
     searched backwards so the object on top is the one you grab. */
  function objAt(ev) {
    const pt = at(ev);
    for (let n = 0; n < slots.length; n++) {
      const q = slots[n];
      if (pt.x >= q.x - 8 && pt.x <= q.x + q.w + 8
          && pt.y >= q.y - 8 && pt.y <= q.y + q.h + 8) return q.i;
    }
    if (!sheet || onRack(pt)) return null;
    const x = (pt.x - sheet.x) / sheet.w, y = (pt.y - sheet.y) / sheet.h;
    for (let k = state.obj.length - 1; k >= 0; k--) {
      const o = state.obj[k];
      if (!o.put) continue;
      if (Math.abs(x - o.x) < o.w / 2 && Math.abs(y - o.y) < o.h / 2) return k;
    }
    return null;
  }
  cv.addEventListener('pointermove', (e) => {
    const pt = at(e);
    if (state.drag !== null) {
      const o = state.obj[state.drag];
      state.overRack = onRack(pt);
      if (!state.overRack) {
        /* it is over the paper, so it is ON the paper, wherever the hand is */
        o.put = true;
        o.x = Math.min(1 - o.w / 2, Math.max(o.w / 2, (pt.x - sheet.x) / sheet.w));
        o.y = Math.min(1 - o.h / 2, Math.max(o.h / 2, (pt.y - sheet.y) / sheet.h));
      }
      view.render(); return;
    }
    const i2 = locked() ? null : objAt(e);
    cv.style.cursor = i2 === null ? '' : 'grab';
    const overSlot = i2 !== null && slots.some((q) => q.i === i2);
    if (i2 !== state.hot || (overSlot ? i2 : null) !== state.hotSlot) {
      state.hot = overSlot ? null : i2;
      state.hotSlot = overSlot ? i2 : null;
      view.render();
    }
    const r1 = cv.getBoundingClientRect();
    const b = dtHit(tbox, e.clientX - r1.left, e.clientY - r1.top);
    if (b !== state.hotBtn) {
      state.hotBtn = b;
      if (b) cv.style.cursor = 'pointer';
      view.render();
    }
  });
  cv.addEventListener('pointerdown', (e) => {
    /* THE TIMER FIRST, because it is live in states where the paper is not */
    const r0 = cv.getBoundingClientRect();
    const btn = dtHit(tbox, e.clientX - r0.left, e.clientY - r0.top);
    if (btn) {
      e.preventDefault(); cv.focus({ preventScroll: true });
      if (btn === 'start') {
        if (state.run) { state.run = null; state.phase = 'place'; snd.open(); refresh(); }
        else if (state.phase === 'place') expose();
      } else if (!state.run && state.phase === 'place') {
        setExp(btn === 'up' ? 1 : -1);
      }
      return;
    }
    if (locked()) return;
    const i2 = objAt(e);
    if (i2 === null) return;
    e.preventDefault(); cv.focus({ preventScroll: true });
    state.sel = i2; state.drag = i2; state.overRack = false;
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = 'grabbing';
    refresh();
  });
  cv.addEventListener('pointerup', (e) => {
    if (state.drag === null) return;
    /* LET GO OVER THE BENCH AND IT GOES BACK THERE. Anywhere else and it
       stays where the hand left it. */
    if (onRack(at(e))) state.obj[state.drag].put = false;
    state.drag = null; state.overRack = false;
    cv.style.cursor = ''; refresh();
  });
  cv.addEventListener('pointerleave', () => {
    state.hot = null; state.hotBtn = null; view.render();
  });

  /* THE KEYS. It answered none at all, so placing an object was a drag and
     nothing else - and a drag is the one gesture that cannot be done precisely
     with a projector at the back of a room. The arrows nudge the selected
     object a hundredth of the sheet at a time, which is how you actually move
     something a little. Every one of them is printed under the sheet. */
  cv.addEventListener('keydown', (e) => {
    const o = state.obj[state.sel];
    const placing = state.phase === 'place' && !state.run;
    const nudge = (dx, dy) => {
      if (!placing || !o || !o.put) return;
      o.x = Math.min(1.1, Math.max(-0.1, o.x + dx));
      o.y = Math.min(1.1, Math.max(-0.1, o.y + dy));
      buildMasks(); refresh();
    };
    const step = e.shiftKey ? 0.05 : 0.01;
    if (e.key === 'ArrowLeft') { nudge(-step, 0); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { nudge(step, 0); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { nudge(0, -step); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { nudge(0, step); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === ' ') {
      if (placing) expose();
      e.preventDefault();
    } else if (e.key === 'd' || e.key === 'D') {
      if (!bDevelop.disabled) develop();
      e.preventDefault();
    } else if (e.key === 'l' || e.key === 'L') {
      if (!bLift.disabled) { state.obj.forEach((x) => { x.put = false; }); refresh(); }
      e.preventDefault();
    } else if (/^[1-9]$/.test(e.key)) {
      const n = +e.key - 1;
      if (n < state.obj.length) { state.sel = n; refresh(); }
      e.preventDefault();
    }
  });

  /* ---- refresh ---------------------------------------------------------- */

  function refresh() {
    const total = PG_EXP[state.ei];
    apVal.textContent = 'f/' + TS_STOPS[state.stop];
    exVal.textContent = total + ' s';
    const placing = state.phase === 'place';
    apDown.disabled = !placing || state.stop === 0;
    apUp.disabled = !placing || state.stop === TS_STOPS.length - 1;
    exDown.disabled = !placing || state.ei === 0;
    exUp.disabled = !placing || state.ei === PG_EXP.length - 1;
    bExpose.disabled = !placing;
    bDevelop.disabled = !state.shots || !!state.run
                        || state.phase === 'develop' || state.phase === 'read';
    bLift.disabled = !state.obj.some((x) => x.put) || state.phase === 'develop';
    bReset.disabled = state.phase === 'develop' || !!state.run;
    [apDown, apUp, exDown, exUp, bExpose, bDevelop, bLift, bReset]
      .forEach((b) => b.classList.toggle('off', b.disabled));

    /* WHAT THE SHEET HAS HAD SO FAR, and where the bare paper stands. Bare
       paper is the darkest anything can go, so it is the one number that says
       whether the exposure is anywhere near right yet. */
    if (!state.shots) {
      out['Under it'].textContent =
        'nothing yet — one burst of ' + total + ' s at f/'
        + TS_STOPS[state.stop] + ' would put bare paper on Zone '
        + tsZone(tsTone(tsDose(total, TS_STOPS[state.stop])));
    } else {
      const z = tsZone(tsTone(tsDose(state.secs, TS_STOPS[state.stop])));
      out['Under it'].textContent =
        state.shots + (state.shots === 1 ? ' exposure' : ' exposures') + ' · '
        + tsSecs(state.secs) + ' s altogether · bare paper on Zone ' + z;
    }
    view.render();
  }

  /* ---- drawing ---------------------------------------------------------- */

  const img = document.createElement('canvas');
  img.width = PG_W; img.height = PG_H;
  const ig = img.getContext('2d');
  const idata = ig.createImageData(PG_W, PG_H);

  /* The print, at whatever stage of developing it has reached. The darkest
     arrive first and the faintest last, which is the reveal doing a second
     job: the exposure is over and the reading is still coming in. */
  /* AND IT IS NOT REPAINTED EVERY FRAME. A pass over the grid costs 9 ms at
     this size - measured, on this machine - and a sixteen millisecond frame
     cannot spend nine on one picture and still draw the room round it. It does
     not need to: the bath takes four and a half seconds, so a hundred distinct
     states of the image is more than an eye can separate. The tone is repainted
     when it has moved by a hundredth and the frames between reuse the canvas,
     which turns nine milliseconds a frame into two. */
  let painted = { devT: -1, light: -1, stamp: 0 };
  function paint(devT, light) {
    const q0 = Math.round(devT * 100) / 100;
    if (painted.devT === q0 && painted.light === light
        && painted.stamp === state.shots) return img;
    painted = { devT: q0, light: light, stamp: state.shots };
    devT = q0;
    const d = idata.data, t = state.tone;
    for (let q = 0; q < PG_W * PG_H; q++) {
      let v = t[q] / 255;
      if (devT < 1) {
        /* THE SAME SPREAD AS THE TEST STRIP'S. This was 1 - (1-v)*0.86, so
           everything that ends near black was finished a fifth of the way
           through the bath - and those are the areas that move. Measured, the
           image stopped changing at three seconds of a six-second bath. The
           shadows still come up first; they no longer come up and then wait. */
        const need = 0.55 + 0.45 * v;
        v = 1 - (1 - v) * Math.min(1, devT / Math.max(0.08, need));
      }
      const g = 6 + v * 237;
      const a = q * 4;
      d[a]     = Math.round((20 + v * 86) + (g - (20 + v * 86)) * light);
      d[a + 1] = Math.round((v * 10) + (g - v * 10) * light);
      d[a + 2] = Math.round((v * 8) + (g - v * 8) * light);
      d[a + 3] = 255;
    }
    ig.putImageData(idata, 0, 0);
    return img;
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    /* ONE SWITCH FOR THE WHOLE ROOM. It was a nine-hundred-millisecond ramp,
       so the bench, the sheet and the ground each arrived at white in their
       own time. The light is a switch: everything changes on the same frame. */
    const dark = state.light < 0.5;

    /* THE SHEET IS SIZED FIRST AND THE ROOM IS PUT ROUND IT. Fitting the
       photograph to the stage and then taking the paper out of it made the
       paper a third of the width - a beautiful bench and a postage stamp to
       work on. The paper is given the room it needs, the photograph is scaled
       so its own paper lands exactly there, and whatever falls off the sides
       falls off: it is a darkroom, and you are standing at the board. */
    /* THE TIMER STANDS AT THE RIGHT. His photograph puts the board in the
       middle and leaves a strip of bench down either side; the clock is on the
       right of them, which is the side Batu wants it on and the side his hand
       is on. The objects that are not on the paper wait on the left instead -
       beside his boxes of paper, which is a bench with things on it already. */
    let tmH = Math.min(h * 0.56, 300), tmW = tmH * DT.w / DT.h;
    const sideRoom = w * 0.185;
    if (tmW > sideRoom - 10) { tmW = sideRoom - 10; tmH = tmW * DT.h / DT.w; }
    const tmX = w - tmW - 8, tmY = h - tmH - 10;

    const rw0 = Math.min(120, Math.max(78, w * 0.15));
    const pad = Math.max(14, w * 0.025);
    const left0 = rw0 + pad;
    const avail = (tmX - 12) - left0;
    let tw = avail, th = tw * PG_H / PG_W;
    const room = h - 104;                /* the caption and the key row */
    if (th > room) { th = room; tw = th * PG_W / PG_H; }
    const tx = left0 + (avail - tw) / 2, ty = Math.max(12, (h - th) / 2 - 18);

    let box = null;
    if (art.off) {
      /* THE WHOLE FRAME, UNCROPPED. Scaling it up so the paper filled the
         working area threw away the left of his photograph - the boxes of
         paper, the edge of the board, the room the sheet is in. It is one
         picture and it is shown as one: fitted inside the stage, nothing cut. */
      const k = Math.min(w / art.off.width, h / art.off.height);
      const bw = art.off.width * k, bh = art.off.height * k;
      const bx = (w - bw) / 2, by = (h - bh) / 2;
      box = { x: bx, y: by, w: bw, h: bh };
      if (dark) ctx.drawImage(art.off, bx, by, bw, bh);
      /* AND THE LAMP IS THE SECOND FRAME. While it burns, his exposed
         photograph is drawn over the safelit one: the pool of light on the
         board, and the paper blazing - which is what the paper looks like
         with the light standing on it, and it is not a rectangle we drew. */
      if (dark && state.run && art.on) ctx.drawImage(art.on, bx, by, bw, bh);
    }
    if (!dark) { ctx.fillStyle = '#E9E6DE'; ctx.fillRect(0, 0, w, h); }

    if (state.phase === 'develop') {
      ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(0, 0, w, 3);
      ctx.fillStyle = state.light > 0
        ? 'rgba(255,210,190,' + (0.9 * (1 - state.light)) + ')'
        : 'rgba(255,110,80,0.92)';
      ctx.fillRect(0, 0, w * state.devT, 3);
      label(ctx, state.devT < 1 ? 'DEVELOPING' : 'DEVELOPED', 12, 17,
            'rgba(255,140,115,0.8)', 10, 'left');
    }

    /* THE BENCH BESIDE THE PAPER. Things you are not using have to be
       somewhere, and in a darkroom that somewhere is the bench at your elbow.
       Drag an object off the sheet and it goes back there; drag it out and it
       comes back. The strip is always drawn, empty or not, so the paper never
       jumps sideways when the last object leaves it. */
    const rw = Math.min(120, Math.max(78, w * 0.15));
    rack = { x: 0, y: 0, w: rw, h: h };
    /* AND THE BENCH IS A HINT, NOT A PANEL. On the right it lay over the dark
       side of the photograph and cost nothing. On the left it lies over the
       boxes of paper - which is the part of his picture worth keeping - so it
       is barely there: the objects have their own pale cards to be seen
       against, and the strip only has to say where they go. */
    ctx.fillStyle = dark ? 'rgba(0,0,0,0.13)' : 'rgba(0,0,0,0.055)';
    ctx.fillRect(rack.x, 0, rw, h);
    line(ctx, rack.x + rw, 0, rack.x + rw, h,
         dark ? 'rgba(255,120,100,0.22)' : 'rgba(0,0,0,0.14)');

    /* THE TIMER, on the bench at the left. Its three live buttons are the
       three that mean anything here: the exposure up, the exposure down, and
       the red one, which starts the lamp and stops it. */
    {
      const placing = state.phase === 'place' && !state.run;
      tbox = dtDraw(ctx, tArt[dark ? 'dark' : 'light'], tmX, tmY, tmW, tmH, {
        secs: state.run ? state.run.total - state.run.done : PG_EXP[state.ei],
        hot: state.hotBtn,
        dead: { down: !placing || state.ei === 0,
                up: !placing || state.ei === PG_EXP.length - 1,
                start: !state.run && !placing },
        glow: dark,
      });
    }

    /* WHERE THE SHEET IS. On the bench it is the paper in the photograph, to
       the pixel; off it - the light on, the print in your hands - it takes the
       middle of the stage and as much of it as it can have, because that is
       the moment it is being judged. */
    /* AND IT TRAVELS BETWEEN THE TWO ON THE TRAY'S OWN CLOCK. Cutting from
       one to the other at the phase change made the print jump size in the
       middle of the one moment this animation exists for. It is in the
       photograph while the bath is up, and it is in the middle of the light
       when the bath has gone - and it moves from the first to the second
       exactly as the bath leaves, so nothing snaps. */
    let sx, sy, sw, sh;
    const trayU = Math.min(1, Math.max(0, state.tray || 0));
    if (box) {
      const px0 = box.x + PG_SHEET.x0 * box.w;
      const py0 = box.y + PG_SHEET.y0 * box.h;
      const pw0 = (PG_SHEET.x1 - PG_SHEET.x0) * box.w;
      const ph0 = (PG_SHEET.y1 - PG_SHEET.y0) * box.h;
      const u = dark ? 0 : 1 - trayU;         /* 0 in the picture, 1 in the light */
      const mix = (a, b) => a + (b - a) * u;
      sx = mix(px0, tx); sy = mix(py0, ty);
      sw = mix(pw0, tw); sh = mix(ph0, th);
    } else {
      sx = tx; sy = ty; sw = tw; sh = th;
    }
    sheet = { x: sx, y: sy, w: sw, h: sh };

    /* THE BLANK SHEET IS ALREADY IN THE PICTURE, so nothing is painted over
       it until there is something to show: his paper under the safelight, and
       his paper under the lamp, are photographs of the two states we used to
       draw as flat fills. Only the developing and developed print is ours -
       and while the bath is up it is drawn inside it, under the developer's
       own surface until the light is thrown. */
    const drawSheet = () => {
      if (state.tone) {
        ctx.drawImage(paint(state.devT, state.light), sx, sy, sw, sh);
      } else if (!box || !dark) {
        ctx.fillStyle = tsPaper(1, 0);
        ctx.fillRect(sx, sy, sw, sh);
      }
    };
    const trayA = state.phase === 'develop' ? trayU : 0;
    if (trayA > 0.01) {
      trayScene(ctx, trays, sx, sy, sw, sh, trayA, !dark, drawSheet);
    } else {
      drawSheet();
    }

    /* the objects lying on it. They are lifted as their moment passes, which
       is the whole of the mid-tone lesson happening in front of you. */
    state.obj.forEach((o, i) => {
      if (!o.put) return;
      if (state.phase === 'develop' || state.phase === 'read') return;
      const ow = o.w * sw, oh = o.h * sh;
      const ox = sx + o.x * sw - ow / 2, oy = sy + o.y * sh - oh / 2;
      /* WHILE THE LAMP BURNS, WHAT IS UNDER IT IS LIT. The red copy is for
         the safelight; the enlarger's lamp is white, and the objects standing
         in the beam are in that white light whether or not the room lamp is
         on. They were staying red through the whole exposure - the paper
         blazing and the leaf still in the safelight, which cannot happen. */
      drawObject(ctx, o, ox, oy, ow, oh, i === state.sel || i === state.hot,
                 dark && !state.run);
    });

    /* what is on the bench, stacked down the strip */
    const off = state.obj.map((o, i) => ({ o: o, i: i })).filter((q) => !q.o.put);
    const slotH = Math.min(84, (h - 30) / Math.max(3, off.length));
    slots = off.map((q, n) => {
      const bx = rack.x + 12, by = 16 + n * slotH;
      const bw = rack.w - 24, bh = slotH - 14;
      const ow = Math.min(bw, bh * (q.o.w * PG_W) / (q.o.h * PG_H));
      const oh = ow * (q.o.h * PG_H) / (q.o.w * PG_W);
      /* A PLATE TO SEE IT AGAINST. The objects are near-black, because on the
         paper they are things stopping light - and on a dark bench, over a
         photograph of a dark bench, that made them invisible. They wait on a
         pale card, the way anything waits on a darkroom bench. */
      ctx.fillStyle = dark ? 'rgba(255,150,125,0.20)' : 'rgba(0,0,0,0.05)';
      ctx.fillRect(bx, by, bw, bh);
      /* THE BENCH IS NOT IN THE BEAM, though. What is waiting at the side
         stays in the safelight until somebody turns the room light on. */
      drawObject(ctx, q.o, bx + (bw - ow) / 2, by + (bh - oh) / 2, ow, oh,
                 q.i === state.hotSlot, dark);
      label(ctx, q.o.name, rack.x + rack.w / 2, by + bh + 11,
            dark ? 'rgba(255,150,130,0.75)' : p.muted, 9, 'center');
      return { i: q.i, x: bx, y: by, w: bw, h: bh };
    });
    if (!off.length) {
      label(ctx, 'drag one here', rack.x + rack.w / 2, 26,
            dark ? 'rgba(255,120,100,0.45)' : p.muted, 9, 'center');
    }

    /* NO NUMBER OVER THE PAPER. The seconds were floated above the sheet
       because nothing else was counting them; the timer stands on the bench
       now and counts them on its own face, which is where a printer reads
       them. Two clocks in one room is one clock too many. */
    if (state.phase === 'place' && !state.run) {
      label(ctx, state.shots
              ? 'move something and expose again — the light adds up'
              : 'drag things on and off the bench, then expose',
            sx + sw / 2, sy + sh + 20, 'rgba(255,120,100,0.6)', 10, 'center');
    }

    /* EVERY KEY THAT DOES SOMETHING, in a cap, under the thing it drives. A
       shortcut nobody is told about is not a shortcut - and a row of keys
       printed over a print in the tray, where not one of them does anything,
       is the same fault the other way round. It shows while you are working. */
    if (state.phase === 'place' && !state.run)
    keyRow(ctx, sx + sw / 2, Math.min(h - 12, sy + sh + 44),
           [[['\u25C0', '\u25B6', '\u25B2', '\u25BC'], 'move'],
            [['1', '2'], 'pick'], [['L'], 'lift off'],
            [['\u23CE'], 'expose'], [['D'], 'develop']],
           dark ? 'rgba(255,200,180,0.95)' : p.ink,
           dark ? 'rgba(255,150,130,0.75)' : p.muted);
  }

  buildMasks();
  refresh();
}
