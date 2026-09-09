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
/* THE MEASURING BUTTON, on the right-hand edge under the thumb - the same
   coordinates the meter guide points at, in the same body-local frame. Where
   it is matters: you can hold the meter out at the subject, facing away from
   you, and still press it without turning the meter round. */
/* THE TWO THAT WORK, in the body's own frame - the same coordinates the meter
   guide points at. MODE is on the left edge and MEASURE on the right, which is
   where they are on the meter in his hand, so each label goes on whichever
   side has room for it. */
/* MODE HAS NO LABEL HERE, because Sekonic already printed one. It is on the
   body in white, just above the button, and drawing a second one beside the
   ring put the same word on the meter twice. MEASURE keeps its label: the
   button on the right edge is unmarked on the real meter, so that word is the
   only thing saying what it does. */
const LM_BTNS = [
  { id: 'mode',    x: 125, y: 235, r: 42, label: '',        side: 'right' },
  { id: 'measure', x: 512, y: 330, r: 40, label: 'MEASURE', side: 'right' },
];

/* and inside the screen, in the screen's own 490 x 188 grid,
   read off the magnified photograph */
const LM_P = {
  /* the battery at 26,20 and the boxed T at 26,50 - printed, not drawn */
  /* the sun and the bolt sit at 86,26 and 133,21 - measured, and then not
     needed, because the mode cursor round them is part of the photograph */
  cord:  { x: 193, y: 32,  w: 27, h: 21 },
  isoNo: { x: 425, y: 15,  h: 48 },          /* right-aligned */
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
   THE LIGHT, DRAWN
   ------------------------------------------------------------------
   A meter says 13 and a student has to already know what 13 looks
   like. So the scene is drawn beside the meter: the same object, in
   each of the lights, lit as that light lights it.

   IT IS NOT A SET OF PICTURES, IT IS ONE PICTURE WITH NUMBERS IN IT.
   Six lights are described - open sun, overcast, a window, a lamp, a
   candle, the moon - and every value between them is interpolated,
   so dragging the slider is a dimmer and not a slideshow. Even the
   shape of the source moves: its corner radius runs from a disc (a
   sun, a bulb, the moon) to a rectangle (a window, a softbox), so
   the sun becomes a window without either of them popping.

   What changes across the six is what actually changes in a room:
   how much light there is, what colour it is, how big the source is
   - and therefore how hard the shadow is - and where it comes from.
   ------------------------------------------------------------------ */

const LM_LOOK = [
  { ev: 16, sky: [126, 170, 214], hor: [198, 216, 234], gnd: [178, 170, 154],
    sx: 0.76, sy: 0.19, sw: 0.075, sh: 0.075, round: 1,
    col: [255, 250, 228], glow: 1.0, shLen: 0.50, shBlur: 0.015, shA: 0.55,
    amb: 1.00 },
  /* SUNNY SIXTEEN IS STILL A SUN. With only 16 and 13 on the ladder, EV 15 -
     which is the most famous light in photography - came out a third of the
     way to overcast: a wide soft lozenge in the sky and a shadow already
     going. The sun holds its shape down to 14, and 14 is the haze coming in. */
  { ev: 15, sky: [128, 172, 216], hor: [200, 218, 236], gnd: [178, 170, 154],
    sx: 0.76, sy: 0.19, sw: 0.075, sh: 0.075, round: 1,
    col: [255, 249, 226], glow: 0.95, shLen: 0.48, shBlur: 0.02, shA: 0.53,
    amb: 0.96 },
  { ev: 14, sky: [150, 178, 204], hor: [206, 216, 226], gnd: [168, 162, 150],
    sx: 0.72, sy: 0.18, sw: 0.13, sh: 0.10, round: 1,
    col: [246, 244, 232], glow: 0.62, shLen: 0.34, shBlur: 0.14, shA: 0.34,
    amb: 0.88 },
  { ev: 13, sky: [172, 178, 186], hor: [208, 210, 212], gnd: [152, 150, 144],
    sx: 0.62, sy: 0.17, sw: 0.34, sh: 0.12, round: 0.9,
    col: [230, 232, 234], glow: 0.30, shLen: 0.16, shBlur: 0.34, shA: 0.15,
    amb: 0.74 },
  { ev: 9, sky: [72, 78, 88], hor: [98, 104, 112], gnd: [76, 74, 72],
    sx: 0.15, sy: 0.30, sw: 0.15, sh: 0.34, round: 0.05,
    col: [238, 240, 242], glow: 0.45, shLen: 0.78, shBlur: 0.20, shA: 0.32,
    amb: 0.44 },
  { ev: 7, sky: [40, 35, 32], hor: [54, 45, 38], gnd: [48, 41, 34],
    sx: 0.78, sy: 0.24, sw: 0.09, sh: 0.09, round: 1,
    col: [255, 214, 150], glow: 0.75, shLen: 0.60, shBlur: 0.10, shA: 0.44,
    amb: 0.27 },
  { ev: 4, sky: [20, 15, 13], hor: [31, 21, 15], gnd: [27, 20, 15],
    sx: 0.72, sy: 0.36, sw: 0.030, sh: 0.055, round: 0.75,
    col: [255, 186, 96], glow: 1.0, shLen: 0.86, shBlur: 0.05, shA: 0.50,
    amb: 0.13 },
  { ev: -2, sky: [10, 12, 20], hor: [16, 20, 30], gnd: [25, 29, 39],
    sx: 0.80, sy: 0.15, sw: 0.045, sh: 0.045, round: 1,
    col: [214, 226, 246], glow: 0.55, shLen: 0.48, shBlur: 0.04, shA: 0.34,
    amb: 0.07 },
];

/* THE STUDIO, which is a room somebody built and so does not sit on the EV
   ladder at all. A softbox at the left, close and large, which is why studio
   light is soft and why the flash meter is held at the subject. */
const LM_STUDIO = {
  sky: [26, 26, 28], hor: [34, 34, 36], gnd: [30, 30, 32],
  /* THE HEAD IS THE LIGHT NOW, and there is nothing else in the picture. The
     octabox came off it, so the source is the reflector itself: a small hard
     light rather than a large soft one, which is why the shadow below is
     tighter and darker than it was under the box. */
  art: 'head',
  col: [252, 250, 246], glow: 0.85,
  shLen: 0.66, shBlur: 0.15, shA: 0.50, amb: 0.55,
};

/* HIS FLASH HEAD, and the place its own screen puts the number. Batu set the
   power as a type layer at 123..233 by 83..150 in a 356 x 469 photograph, in
   JetBrains Mono ExtraBold at 80 - so the number is drawn there, at that size,
   rather than anywhere that looked about right. The site loads IBM Plex Mono
   and not JetBrains; at this size the two are indistinguishable, and the
   weight is what carries it.

   HALF AGAIN AS BIG, and it had to be: with the octabox gone the head is the
   only thing in the frame making light, and at 0.40 of the height it read as a
   prop rather than as the source.

   face: where the light actually leaves it. Not guessed - the head's widest
   opaque row is y 162, running x 13 to 342 of the 356, so the reflector's
   centre is 177.5, 162 and its radius is 164.5. That is the point the glow
   comes from, the point the sphere is shaded from, and the point the shadow
   is thrown away from. */
const LM_HEAD = {
  numX: 0.5000, numY: 0.2484, numH: 0.1706,
  x: 0.015, h: 0.60, bottom: 0.955, aspect: 356 / 469,
  faceX: 177.5 / 356, faceY: 162 / 469, faceR: 164.5 / 356,
};

function lmMix(a, b, t) { return a + (b - a) * t; }
function lmRGB(a, b, t) {
  return 'rgb(' + Math.round(lmMix(a[0], b[0], t)) + ','
    + Math.round(lmMix(a[1], b[1], t)) + ',' + Math.round(lmMix(a[2], b[2], t)) + ')';
}
function lmArr(a, b, t) {
  return [lmMix(a[0], b[0], t), lmMix(a[1], b[1], t), lmMix(a[2], b[2], t)];
}

/* the look at any EV, by walking the ladder and interpolating */
function lmLook(ev) {
  const L = LM_LOOK;
  if (ev >= L[0].ev) return L[0];
  if (ev <= L[L.length - 1].ev) return L[L.length - 1];
  let i = 0;
  while (i < L.length - 2 && L[i + 1].ev > ev) i++;
  const a = L[i], b = L[i + 1];
  const t = (a.ev - ev) / (a.ev - b.ev);
  const o = {};
  ['sx', 'sy', 'sw', 'sh', 'round', 'glow', 'shLen', 'shBlur', 'shA', 'amb']
    .forEach((k) => { o[k] = lmMix(a[k], b[k], t); });
  ['sky', 'hor', 'gnd', 'col'].forEach((k) => { o[k] = lmArr(a[k], b[k], t); });
  return o;
}

function lmRound(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function lmDrawScene(ctx, w, h, look, label, art, fire) {
  const L = look;
  const rgb = (a) => 'rgb(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ')';

  /* the room: a wall behind and a floor in front */
  const horizon = h * 0.62;
  const g = ctx.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, rgb(L.sky)); g.addColorStop(1, rgb(L.hor));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, horizon);
  ctx.fillStyle = rgb(L.gnd); ctx.fillRect(0, horizon, w, h - horizon);

  /* THE HEAD, WHERE THE LIGHT IS A HEAD. Worked out first, because in the
     studio it IS the source: the glow, the shading on the ball and the
     direction of the shadow all come off its reflector. */
  const hh = h * LM_HEAD.h, hw = hh * LM_HEAD.aspect;
  const hx = w * LM_HEAD.x, hy = h * LM_HEAD.bottom - hh;

  /* THE SOURCE, whose corner radius carries it from a sun to a window */
  /* THE SOURCE IS MEASURED IN ONE DIMENSION, so a disc is a disc. Taking the
     width from w and the height from h made the sun an ellipse in a 4:3
     panel - and the sun is the one thing in the sky everybody knows the shape
     of. Both come off the width now; the window is tall because its numbers
     are tall, not because the panel is. */
  const head = L.art === 'head';
  const sx = head ? 0 : L.sx * w, sy = head ? 0 : L.sy * h;
  const sw = head ? 0 : L.sw * w, sh = head ? 0 : L.sh * w;
  /* where the light actually comes from - for the head, its reflector */
  let fx = sx + sw / 2, fy = sy + sh / 2, srcSize = Math.max(sw, sh);
  if (head) {
    fx = hx + LM_HEAD.faceX * hw;
    fy = hy + LM_HEAD.faceY * hh;
    srcSize = LM_HEAD.faceR * 2 * hw;
  }
  if (L.glow > 0.02) {
    const rad = srcSize * (1.2 + L.glow * 2.6);
    const gg = ctx.createRadialGradient(fx, fy, 0, fx, fy, rad);
    gg.addColorStop(0, 'rgba(' + Math.round(L.col[0]) + ',' + Math.round(L.col[1])
      + ',' + Math.round(L.col[2]) + ',' + (0.42 * L.glow).toFixed(3) + ')');
    gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg;
    ctx.fillRect(fx - rad, fy - rad, rad * 2, rad * 2);
  }
  /* NOTHING STANDS HERE IN THE STUDIO. The head is drawn further down, after
     the ball, so it can overlap the floor the way a light stand does. */
  if (!head) {
    ctx.fillStyle = rgb(L.col);
    lmRound(ctx, sx, sy, sw, sh, Math.min(sw, sh) / 2 * L.round);
    ctx.fill();
  }

  /* THE SUBJECT: one sphere on the floor, which is the object every lighting
     lesson has ever been taught on, and its shadow, which is the part that
     says how big the source was. */
  const cx = w * 0.50, cy = horizon + h * 0.02, rr = h * 0.155;
  const away = cx - fx;
  const dir = away === 0 ? 1 : away / Math.abs(away);
  ctx.save();
  ctx.globalAlpha = L.shA;
  ctx.fillStyle = 'rgb(0,0,0)';
  if (ctx.filter !== undefined) ctx.filter = 'blur(' + (L.shBlur * h * 0.5).toFixed(1) + 'px)';
  ctx.beginPath();
  ctx.ellipse(cx + dir * rr * L.shLen * 1.6, cy + rr * 0.06,
              rr * (0.75 + L.shLen * 1.5), rr * 0.30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const lx = (fx - cx) / rr, ly = (fy - cy) / rr;
  const n = Math.max(0.001, Math.hypot(lx, ly));
  const sg = ctx.createRadialGradient(cx + (lx / n) * rr * 0.55, cy - rr * 0.35 + (ly / n) * rr * 0.2,
                                      rr * 0.06, cx, cy - rr * 0.35, rr * 1.25);
  const lit = 0.28 + L.amb * 0.72;
  sg.addColorStop(0, 'rgb(' + Math.round(215 * lit) + ',' + Math.round(213 * lit)
    + ',' + Math.round(208 * lit) + ')');
  sg.addColorStop(1, 'rgb(' + Math.round(38 * lit + 8) + ',' + Math.round(38 * lit + 8)
    + ',' + Math.round(40 * lit + 8) + ')');
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.arc(cx, cy - rr * 0.35, rr, 0, Math.PI * 2); ctx.fill();

  /* AND THE HEAD IS IN THE PICTURE, WITH ITS POWER ON ITS OWN SCREEN. The
     dial in the control bar and the number on the head are the same number,
     which is the point: you set a head by looking at it. */
  if (head && art && art.head) {
    ctx.drawImage(art.head, hx, hy, hw, hh);
    if (L.headText) {
      ctx.save();
      ctx.font = '800 ' + Math.round(hh * LM_HEAD.numH) + 'px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.fillText(L.headText, hx + hw * LM_HEAD.numX, hy + hh * LM_HEAD.numY);
      ctx.restore();
    }
  }

  /* AND THE METER IS IN THE PICTURE, AT THE SUBJECT. An incident reading is
     taken where the subject is, with the dome pointed back at the camera - not
     from the camera, and not at the light. The meter standing on the ball says
     that in one glance and saves a paragraph. */
  if (art && art.meter) {
    /* AND IT IS THE DOME THAT HAS TO BE IN THE RIGHT PLACE, not the meter.
       Standing the whole meter on top of the ball put its sensor a body-length
       above the thing being measured, which is not where anybody holds one.
       The dome goes AT the subject - here, the middle of the ball - so the
       meter hangs in front of it, which is exactly how it is held. Its centre
       inside the body is 262, 82 of the 539 x 925, the same figure the meter
       guide points at when it names the Lumisphere. */
    const mh = h * 0.30, mw = mh * LM_BODY.w / LM_BODY.h;
    const bx2 = cx, by2 = cy - rr * 0.35;                    /* the ball's middle */
    const mx = bx2 - (262 / LM_BODY.w) * mw;
    const my = by2 - (82 / LM_BODY.h) * mh;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = mh * 0.10;
    ctx.shadowOffsetX = mh * 0.03;
    ctx.shadowOffsetY = mh * 0.03;
    ctx.drawImage(art.meter, LM_BODY.x, LM_BODY.y, LM_BODY.w, LM_BODY.h,
                  mx, my, mw, mh);
    ctx.restore();
  }

  /* THE POP. A flash meter is pressed and the head fires: the room is white
     for a moment and then it is not. */
  if (fire > 0.001) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, fire) * 0.8;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  if (label) {
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.fillText(label.toUpperCase(), 10, h - 10);
  }
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
    /* THE FLASH'S OWN LEVEL, and it is not an EV of the room. A flash meter
       measures one pulse, and the pulse is over long before any shutter this
       meter can name has closed - so the shutter cannot change what the paper
       or the sensor is given by it. What sets the exposure is the flash's
       output and the distance, which together are one number. It is held here
       as a power of two so the same one equation still runs the meter:
           N = sqrt( 2^evf * S/100 )
       evf 6 at ISO 100 is f/8, which is where a studio head at a couple of
       metres usually lands. */
    evf: o.evf === undefined ? 6 : o.evf,
    /* A FLASH METER DOES NOT READ CONTINUOUSLY. There is nothing to read until
       a flash goes off, so it waits, measures on the press, and then HOLDS
       what it measured. Turn the power up afterwards and the screen does not
       move: it is showing what it measured, not what is - which is the habit
       the instrument is there to teach. */
    held: null,
    firing: 0,
    lit: o.lit === undefined ? true : o.lit,        /* screen on */
    hotBtn: null,
    hotBody: false,
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

  /* THE STEPPERS BELONG TO THE STRIP, NOT TO THE PICTURE.
     They were drawn under the meter, inside the stage, which is the picture
     being asked to do the control strip's job - IG-01 02 names this
     instrument as the example of the fault, and 12 says where they go
     instead. `strip` is the figure's own control row, handed in by the host.
     Nothing else about them changes. */
  const bar = opts.strip || el('div', 'lm-bar');
  function step(label, onDown, onUp) {
    const g = el('div', opts.strip ? 'ctl lm-step' : 'lm-step');
    g.append(el('label', 'lm-k', label));
    const d = el('button', 'st', '−');
    const v = el('span', 'lm-v');
    const u = el('button', 'st', '+');
    [d, u].forEach((b) => { b.type = 'button'; });
    d.addEventListener('click', onDown);
    u.addEventListener('click', onUp);
    const row = el('div', 'lm-stepper');
    row.append(d, v, u);
    g.append(row);
    bar.append(g);
    return { v: v, d: d, u: u };
  }
  /* CHANGE ANYTHING THE READING DEPENDED ON AND THE READING IS GONE. A held
     number describes one flash at one film speed; move either and what is on
     the screen is about a photograph nobody is taking any more. The real meter
     keeps the last number, which is a nicety for a printer who knows what it
     was - here it would be a lie a student cannot see through. */
  const isoUI = step('ISO', () => { ii = Math.max(0, ii - 1); state.held = null; changed(); },
                            () => { ii = Math.min(LM_ISO.length - 1, ii + 1); state.held = null; changed(); });
  const shUI = step('Shutter', () => { state.si = Math.max(0, state.si - 1); changed(); },
                               () => { state.si = Math.min(LM_SHUT.length - 1, state.si + 1); changed(); });
  if (!opts.strip) box.append(bar);
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
    const iso = LM_ISO[ii];
    /* AND IN FLASH THE SHUTTER IS NOT IN THE SUM. Turn it here and watch the
       aperture stand still: that is the whole difference between the two
       modes, and it is worth being able to do rather than be told. */
    const a = state.mode === 'flash'
      ? (state.held || { stop: '\u2013\u2013', tenth: '', exact: 0, waiting: true })
      : lmSolve(state.ev100, iso, t);
    return {
      ev100: state.ev100, evf: state.evf, iso: iso, shutter: t,
      mode: state.mode,
      aperture: a.exact, stop: a.stop, tenth: a.tenth, over: !!a.over,
      waiting: !!a.waiting, firing: state.firing,
      ev: state.ev100 + Math.log2(iso / 100),
    };
  }
  function changed() { render(); if (o.onChange) o.onChange(read()); }

  /* THE PRESS. In flash it fires the head and takes the reading; in ambient
     there is nothing to fire, so it simply takes one - which is what the
     button does on the real meter, and why it is live in both. */
  function measure() {
    if (state.mode === 'flash') {
      state.held = lmAperture(Math.sqrt(Math.pow(2, state.evf) * (LM_ISO[ii] / 100)));
      state.firing = 1;
      const t0 = performance.now();
      (function fade(now) {
        state.firing = Math.max(0, 1 - (now - t0) / 420);
        changed();
        if (state.firing > 0) requestAnimationFrame(fade);
      })(t0);
    }
    changed();
  }

  /* AND THEY ARE ON THE PICTURE, not in the bar. MODE and MEASURE are real
     things on this meter's own edges; rings round them say so, the way the
     rings on the enlarger's timer do. A text button in a control bar, for a
     thing that already exists in the photograph, is furniture. */
  let bodyBox = null;
  function btnAt(e) {
    if (!bodyBox) return null;
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left - bodyBox.x) / bodyBox.k;
    const y = (e.clientY - r.top - bodyBox.y) / bodyBox.k;
    for (const b of LM_BTNS) {
      if ((x - b.x) ** 2 + (y - b.y) ** 2 < (b.r + 14) ** 2) return b.id;
    }
    return null;
  }
  function setMode(m) {
    state.mode = m;
    state.held = null;       /* a reading belongs to the light it was taken in */
    changed();
  }
  /* THE BODY IS A WAY IN. Press one of the two buttons and the meter does
     what that button does; press the meter anywhere else and it opens what
     every part of it is for. The guide used to be a second instrument in the
     list, which meant a student had to already know it existed - and it is
     about this object, on this screen. `onBody` is the host's; without one
     the body is just a picture, which is what the lecture pages want. */
  function onBody2(e) {
    if (!bodyBox || !opts.onBody) return false;
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left - bodyBox.x) / bodyBox.k;
    const y = (e.clientY - r.top - bodyBox.y) / bodyBox.k;
    return x >= 0 && x <= LM_BODY.w && y >= 0 && y <= LM_BODY.h;
  }
  cv.addEventListener('pointerdown', (e) => {
    const b = btnAt(e);
    if (!b) {
      if (onBody2(e)) { e.preventDefault(); opts.onBody(); }
      return;
    }
    e.preventDefault();
    if (b === 'mode') setMode(state.mode === 'ambient' ? 'flash' : 'ambient');
    else measure();
  });
  cv.addEventListener('pointermove', (e) => {
    const b = btnAt(e);
    const overBody = !b && onBody2(e);
    if (b !== state.hotBtn || overBody !== state.hotBody) {
      state.hotBtn = b; state.hotBody = overBody;
      cv.style.cursor = b ? 'pointer' : (overBody ? 'help' : '');
      render();
    }
  });
  cv.addEventListener('pointerleave', () => {
    if (state.hotBtn || state.hotBody) {
      state.hotBtn = null; state.hotBody = false; render();
    }
  });

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
    /* ROOM ON THE RIGHT, AND ONLY THERE. MEASURE sits at 512 of the body's
       539 and its name reads to the right of it, so the canvas carries a wide
       margin on that side and almost none on the other. Padding both sides
       equally would have cost the body a fifth of its size to hold a word. */
    /* MEASURE was still losing its last letter: from the button at 512 to the
       canvas edge there were 147 units and the word wants about 160. */
    const padL = 8, padR = 132;
    /* a band at the foot for the line that says the body can be pressed, so
       the line is inside the canvas rather than under its edge */
    const foot = opts.onBody ? 24 : 0;
    const k = Math.min(W / (LM_BODY.w + padL + padR), (H - foot) / LM_BODY.h);
    const bw = LM_BODY.w * k, bh = LM_BODY.h * k;
    const bx = (W - (LM_BODY.w + padL + padR) * k) / 2 + padL * k;
    const by = (H - foot - bh) / 2;
    ctx.drawImage(img, LM_BODY.x, LM_BODY.y, LM_BODY.w, LM_BODY.h, bx, by, bw, bh);
    bodyBox = { x: bx, y: by, k: k };

    /* the rings round the buttons that do something, and what each is for */
    ctx.save();
    LM_BTNS.forEach((b) => {
      const cx = bx + b.x * k, cy = by + b.y * k, rr = (b.r + 13) * k;
      const on = state.hotBtn === b.id;
      ctx.strokeStyle = 'rgba(0,0,0,0.55)';
      ctx.lineWidth = (on ? 2.6 : 1.6) + 2.2;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = on ? 'rgba(255,255,250,0.95)' : 'rgba(240,244,255,0.5)';
      ctx.lineWidth = on ? 2.6 : 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
      if (!b.label) return;
      ctx.font = '600 ' + Math.max(8, Math.round(17 * k)) + 'px "IBM Plex Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(240,244,255,0.62)';
      if (b.side === 'left') {
        ctx.textAlign = 'right'; ctx.fillText(b.label, cx - rr - 7 * k, cy);
      } else {
        ctx.textAlign = 'left'; ctx.fillText(b.label, cx + rr + 7 * k, cy);
      }
    });
    ctx.restore();

    /* AND IT SAYS SO, on the picture, under the body. A thing you can press
       that does not look pressable is a thing nobody presses. */
    if (opts.onBody) {
      ctx.save();
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.letterSpacing = '0.10em';
      ctx.fillStyle = state.hotBody ? 'rgba(240,244,255,0.92)' : 'rgba(240,244,255,0.42)';
      /* centred on the canvas, not on the body: the body sits left of centre
         to leave MEASURE its word, and a line centred on the body ran off */
      ctx.fillText('PRESS THE BODY — WHAT EVERY PART IS FOR', W / 2, H - foot / 2);
      ctx.restore();
    }

    if (!state.lit) return;

    /* the screen. Everything inside is placed in the LCD's own
       490 x 188 grid and scaled once, so a number never drifts. */
    const lx = bx + LM_LCD.x * k, ly = by + LM_LCD.y * k;
    const lk = (LM_LCD.w * k) / 490;
    const P = (p) => ({ x: lx + p.x * lk, y: ly + p.y * lk });
    ctx.save();
    ctx.fillStyle = '#0B1512';                 /* LCD segments are near-black */

    const r = read();

    /* NOR ARE THE WORDS. ISO and F are printed on his screen, the same as the
       battery, the boxed T and the mode icons. Only the four things that
       CHANGE are drawn here: the film speed, the shutter, the aperture and its
       tenth. Everything else was ink on top of ink. */
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

    /* THE MODE IS NOT DRAWN. It is already in the picture. Batu photographed
       the meter twice - once in ambient and once in flash - and the only thing
       that differs between the two files is a rectangle of 77 x 45 pixels
       round the sun in one and round the bolt in the other, which is exactly
       how the L-308X shows which mode it is in. The body swaps with the mode
       above, so a sun drawn here was a second sun on top of his. */

    ctx.restore();

    /* the values under the thumb, in words */
    isoUI.v.textContent = String(r.iso);
    shUI.v.textContent = lmShutterText(r.shutter);
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
    measure: measure,
    setMode: setMode,
    set: function (patch) {
      if (patch.ev100 !== undefined) state.ev100 = patch.ev100;
      if (patch.evf !== undefined && patch.evf !== state.evf) {
        state.evf = patch.evf;
        state.held = null;             /* the light moved: measure it again */
      }
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
  head.append(el('span', 'ts-name', 'Lightmeter'),
              el('span', 'ts-sub', 'sekonic l-308x · iso · shutter · aperture'));
  fig.prepend(head);

  /* THE LIGHT ITSELF, which is the one thing a real meter does not let you
     set. It was ten named scenes on a ten-position slider, so the light moved
     in whole stops and jumped from one caption to the next - and a stop is an
     enormous step. It is continuous now, a tenth of a stop at a time, and the
     names are a ladder it is read against rather than the values it can take:
     a student learns the EV of a bright overcast day by recognising the day,
     not by memorising 13, but the light between two days is a real light. */
  const LM_SCENES = [
    [16, 'sand or snow in open sun'],
    [15, 'open sun — sunny 16'],
    [14, 'hazy sun'],
    [13, 'bright overcast'],
    [12, 'overcast'],
    [11, 'heavy overcast, or open shade'],
    [10, 'the hour after sunrise'],
    [9,  'window light indoors'],
    [8,  'a bright room'],
    [7,  'a room with the lamps on'],
    [5,  'a dim room'],
    [4,  'candlelit'],
    [2,  'a lit street at night'],
    [0,  'a dark street'],
    [-2, 'full moon on snow'],
  ];
  function sceneName(ev) {
    let best = LM_SCENES[0], bd = 1e9;
    LM_SCENES.forEach((sc) => {
      const d = Math.abs(sc[0] - ev);
      if (d < bd) { bd = d; best = sc; }
    });
    return best[1];
  }

  const wrap = el('div', 'lm-wrap');
  stage.append(wrap);

  /* THE LIGHT, DRAWN, BESIDE THE METER THAT IS MEASURING IT. A meter says 13
     and a student has to already know what 13 looks like; here the two are on
     the same screen and move together. */
  const scBox = el('div', 'lm-pic');
  const scCv = el('canvas');
  scBox.append(scCv);
  wrap.append(scBox);
  const sg = scCv.getContext('2d');
  let sw2 = 0, sh2 = 0;
  /* the scene's own furniture: his Profoto head, and a meter small enough to
     stand on the ball. The octabox files are still in the folder - he made
     them and he may want them back - but nothing loads them. */
  const sArt = {};
  [['head', 'flash-head.png'], ['meter', 'meter-ambient.png']].forEach(([k, f2]) => {
    const i = new Image();
    i.onload = () => { sArt[k] = i; paintScene(); };
    i.src = '../_shared/interactives/art/' + f2;
  });
  function sceneResize() {
    const r = scCv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    sw2 = r.width; sh2 = r.height;
    scCv.width = Math.round(sw2 * dpr); scCv.height = Math.round(sh2 * dpr);
    sg.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintScene();
  }
  function paintScene() {
    if (!sw2) return;
    const r = meter.read();
    if (r.mode === 'flash') {
      const st = {};
      Object.keys(LM_STUDIO).forEach((k) => { st[k] = LM_STUDIO[k]; });
      /* THE POWER IS THE LIGHT. With the box off the head there is no face to
         brighten, so the setting shows in the three places that matter: the
         number on the head's own screen, how far the glow reaches, and how
         much of the ball comes up out of the dark. */
      const p2 = Math.min(1, Math.max(0,
        (evfToPow(r.evf) - LM_POW.min) / (LM_POW.max - LM_POW.min)));
      st.headText = evfToPow(r.evf).toFixed(1);
      st.amb = 0.24 + p2 * 0.55;
      st.glow = 0.35 + p2 * 0.75;
      lmDrawScene(sg, sw2, sh2, st, 'studio flash', sArt, r.firing);
    } else {
      lmDrawScene(sg, sw2, sh2, lmLook(r.ev100), sceneName(r.ev100), sArt, 0);
    }
  }
  new ResizeObserver(() => {
    const r = scCv.getBoundingClientRect();
    if (!r.width) return;
    if (Math.abs(r.width - sw2) < 0.5 && Math.abs(r.height - sh2) < 0.5) return;
    sceneResize();
  }).observe(scCv);
  requestAnimationFrame(sceneResize);

  const meter = lightMeter(wrap, {
    ev100: 13, iso: 100, shutter: 1 / 125, evf: 6,   /* the head at 7.0 */
    strip: controls,          /* ISO and Shutter go in the control row */
    onChange: () => refresh(),
    onBody: () => view('guide'),
  });

  /* ------------------------------------------------------------------
     THE SECOND VIEW: the same meter, taken apart
     ------------------------------------------------------------------
     It was its own instrument in the list, which meant a student met the
     meter and the explanation of the meter as two separate things and had to
     know the second one was there. It is one thing now, in his words: "the
     meter part by parti lightmeterin icine yerlestir. Uygun bir yere
     tikladigimizda bu ikince enstruman icinde acilsin. ve farkli bir
     enstruman olarak listelenmesin." Press the body, and the meter opens.
     ------------------------------------------------------------------ */
  const guide = mountMeterGuide(fig, { embedded: true, host: fig });
  fig.insertBefore(guide.stage, controls);

  /* the way back sits in the strip, where every other control on this
     instrument sits, and it is the only control the guide has any use for */
  const backCell = el('div', 'ctl lm-back');
  backCell.append(el('label', null, 'The meter'));
  const backRow = el('div', 'states');
  const bBack = el('button', 'st', '← Back to the reading');
  bBack.type = 'button';
  backRow.append(bBack);
  backCell.append(backRow);
  controls.append(backCell);
  bBack.addEventListener('click', () => view('meter'));

  function view(which) {
    fig.dataset.view = which;
    if (which === 'guide') guide.render();
    else { meter.render(); paintScene(); sceneResize(); }
  }
  view('meter');

  /* ONE SLIDER, AND IT MEANS WHAT THE MODE MEANS. In ambient it is the light
     in the room; in flash it is the flash's own output, because a flash meter
     has no ambient to measure and the studio is a room somebody built. */
  /* AND IT IS THE KIT'S SLIDER (T1). It was an input built by hand here,
     which is how the kit ends up with three different sliders that look
     almost the same; slider() takes a format, and the format is the only
     thing that was ever special about this one. */
  /* the one thing that was ever special about this slider: what its value is
     called. In ambient it is a day; in flash it is a dial on a head. */
  function scText() {
    const r = meter.read();
    return r.mode === 'flash'
      ? 'the head at ' + evfToPow(r.evf).toFixed(1)
        + (evfToPow(r.evf) >= LM_POW.max - 0.05 ? ' — full power' : '')
        + ' · f/' + lmAperture(Math.sqrt(Math.pow(2, r.evf))).stop + ' at ISO 100'
      : sceneName(r.ev100) + ' · EV ' + (Math.round(r.ev100 * 10) / 10).toFixed(1);
  }

  const scRow = slider(controls, {
    label: 'The light', min: -3, max: 16, step: 0.1, value: 13, cls: 'span2',
    format: () => scText(),
  });
  const sc = scRow.closest('.ctl');
  const scVal = sc.querySelector('.val');

  /* THE HEAD IS MARKED THE WAY A HEAD IS MARKED. A studio head has a power
     dial that reads 10.0 at full and counts DOWN in stops: 9.0 is one stop
     less, 9.5 is half a stop less, and nobody who has stood in a studio thinks
     of it any other way. One whole number is one stop, which is also what one
     unit of the meter's own evf is - so the two are the same scale offset by
     one, and 10.0 lands on f/22 at ISO 100 where a big head at a couple of
     metres actually lands. */
  const LM_POW = { min: 4, max: 10 };
  const powToEvf = (p2) => p2 - 1;
  const evfToPow = (e2) => e2 + 1;

  function dial() {
    const flash = meter.read().mode === 'flash';
    scRow.min = flash ? String(LM_POW.min) : '-3';
    scRow.max = flash ? String(LM_POW.max) : '16';
    scRow.value = String(flash ? evfToPow(meter.read().evf) : meter.read().ev100);
  }
  scRow.addEventListener('input', () => {
    const v = +scRow.value;
    if (meter.read().mode === 'flash') meter.set({ evf: powToEvf(v) });
    else meter.set({ ev100: v });
    refresh();
  });

  /* THE THREE GATES (O1 O2 O3), ANSWERED — and IG-01 07 worked this exact
     readout and gave the verdict, so it is not reopened here.
     It says — 125 at f/8.0 — FAILED G2: the meter's own LCD says it, on the
     stage, at tier R. A readout repeating the screen it is looking at is a
     caption on the picture, and the picture wins. Gone; the LCD is the
     readout.
     Which is stays as the one row: nobody sets the equivalents, nothing in
     the picture states them, and choosing between them is the thing the
     instrument exists to teach — a meter reading is a choice, not a number.
     Cut to two, per 07: five ellipsised, three still ran to two lines. */
  const out = readout(fig, [
    { key: 'Which is', cls: 'hi', wide: true },
  ]);

  fsButton(stage, fig);

  let wasMode = null;
  function refresh() {
    const r = meter.read();
    if (r.mode !== wasMode) { wasMode = r.mode; dial(); }
    const flash = r.mode === 'flash';
    scVal.textContent = scText();
    /* THE TWO THINGS THE LCD CANNOT SAY come here, because the row that used
       to carry them has gone. A screen that is out of range shows nothing
       useful, and a flash meter that has not been fired shows the last
       reading; in both cases the sentence is the only thing on screen that
       tells the room what is happening. */
    if (r.over) {
      out['Which is'].textContent =
        'out of range — ' + (r.aperture < 1
          ? 'not enough light for this film and shutter, open the shutter or '
            + 'use a faster film'
          : 'too much light, shorten the shutter');
      meter.render(); paintScene();
      return;
    }
    if (flash) {
      if (r.waiting) {
        out['Which is'].textContent =
          'nothing yet — a flash meter has nothing to read until a flash goes '
          + 'off. Press MEASURE on the side of the meter.';
        meter.render(); paintScene();
        return;
      }
      /* THE LESSON IS A THING YOU DO, NOT A SENTENCE. Turn the shutter in this
         mode and the aperture does not move: the pulse is over in a
         thousandth of a second, long before any shutter here has closed, so
         nothing the shutter does can change what the flash gave. */
      out['Which is'].textContent =
        'turn the shutter and the aperture does not move — the flash is over '
        + 'in a thousandth of a second. The shutter is for the daylight '
        + 'behind it.';
      meter.render(); paintScene();
      return;
    }
    /* the same exposure said the other way, which is the thing that makes
       a meter reading stop being a number and start being a choice */
    /* SPREAD ACROSS THE SCALE, not the first four that happen to work. Walking
       the list in order offered 1/8000, 1/4000, 1/2000 and 1/1000 - four
       speeds nobody weighs against each other. These are two stops apart, so
       the aperture moves a whole stop each time and the trade is visible. */
    const alt = [];
    [1 / 1000, 1 / 250, 1 / 60, 1 / 15, 1 / 4, 1].forEach((t) => {
      if (t === r.shutter || alt.length >= 2) return;
      const a = lmSolve(r.ev100, r.iso, t);
      if (a.over) return;                       /* only the ones it can answer */
      alt.push(lmShutterText(t) + ' at f/' + a.stop);
    });
    out['Which is'].textContent = alt.length
      ? 'the same light as ' + alt.join(' · ')
      : 'no shutter on this meter can hold this light at this film speed';
    meter.render(); paintScene();
  }
  dial();
  refresh();
  return meter;
}
