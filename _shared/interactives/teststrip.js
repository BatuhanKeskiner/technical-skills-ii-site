/* ============================================================
   Test strip — the enlarger's timer and aperture, and what the
   paper does with them.

   THE ONE IDEA. Paper does not know about seconds or f-stops.
   It knows one number: how much light landed on it. Time and
   aperture are two ways of setting that number and the paper
   cannot tell them apart — which is why f/8 at 12 s and f/11 at
   24 s give the same tone, and why a test strip proves it
   instead of asserting it.

   Under an ENLARGER this is cleaner than in a camera, and that
   is the reason to teach it here first: in a camera the aperture
   has a second job, it moves the depth of field, so time and
   aperture are not interchangeable. Under an enlarger the
   aperture only meters light. The exposure triangle collapses
   to one dimension.

   THE PAPER KEEPS WHAT IT WAS GIVEN. Each band stores the LIGHT
   it has had, not the seconds. Storing seconds and working the
   tone out from whatever the aperture happens to be now meant
   that closing the lens after the fact re-darkened a strip that
   had already been exposed — the paper going back and changing
   its mind. Batu caught it. A band's dose is added at the moment
   of exposure and nothing afterwards can touch it.

   THE TIMER IS THE CONTROL. Its own buttons set the time and
   start the exposure, because that is the object the hand
   reaches for in a darkroom. The canvas takes focus and answers
   the arrow keys and Enter, so it can be worked without a mouse.
   ============================================================ */

/* The timer, and where things sit on the photograph of it. Measured off the
   picture with a coordinate grid over it, not guessed. */
/* THE TIMER IS ITS OWN INSTRUMENT NOW, in timer.js, because the photogram
   needs the same clock and two copies of a measurement is one measurement that
   will eventually be wrong. Everything that was measured off the photograph -
   the screen, the three live buttons and their radii - lives there as DT. */

function mountTestStrip(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  /* HOW MANY STEPS THE STRIP IS CUT INTO. Six is the ordinary strip and ten
     is what you cut when the interval has to be fine - the count is one of the
     three things a printer actually chooses, beside the aperture and the
     interval. It can only be changed on a clean sheet: a strip already part
     exposed cannot be re-divided, and the paper says so by having the control
     dead. A kept strip carries its own count in the length of its arrays, so
     old strips keep the shape they were made with. */
  const MINB = 4, MAXB = 10;
  const blank = (n) => ({ dose: new Array(n).fill(0), secs: new Array(n).fill(0) });

  const state = Object.assign({
    run: null,          /* an exposure in progress: {want, done, upto} */
    bands: 6,           /* how many steps the card cuts the strip into */
    gave: -1,           /* the card position the last exposure was made at */
    stop: 2,            /* index into TS_STOPS — f/8 */
    /* FOUR SECONDS, NOT TWO. Six bands at two-second intervals stop at sRGB 47
       on this paper at f/8 - a dark grey, and the strip never shows the black
       it exists to find. At four the ladder runs 152 · 81 · 47 · 30 · 22 · 20
       and ends on Zone 0 exactly, so the first strip anybody makes teaches
       what a test strip is for. */
    ti: 3,              /* index into TS_TIMES — 4 s */
    open: 0,            /* how many bands the card has UNCOVERED, from the left */
    phase: 'expose',
    devT: 0, light: 0,
    tray: 0,            /* how far the tray has come up, on its own clock */
    kept: [],
    hot: null,          /* which timer button the pointer is over */
    hotCard: false,     /* and whether it is over the card */
    viewing: null,      /* a kept strip picked up and held to the light */
    hotRack: null,      /* and which one the pointer is over */
  }, blank(6));

  /* A NAME ON THE INSTRUMENT. In full screen the page's own heading is gone
     and there is nothing on screen saying what this is. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Test Strip'),
              el('span', 'ts-sub', 'enlarger timer · aperture · paper'));
  fig.prepend(head);

  const view = canvas(stage, draw);
  /* Declared here and not beside the exposure it belongs to: the switch that
     turns it on is built with the stage, and a const used before its line is
     a const that is not there yet. */
  const snd = enlargerSound();
  let ticked = 0;                       /* the last whole second announced */

  fsButton(stage, fig);
  soundButton(stage, snd);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('role', 'application');
  cv.setAttribute('aria-label',
    'Enlarger timer. Left and right arrows set the time, S slides the card one '
    + 'band to the right, Enter exposes the uncovered part of the strip.');

  /* THE TRAY IS SHARED NOW, in tray.js, with the clock that runs it - the
     photogram puts the same sheet in the same developer, and a bath that
     behaves differently in the two rooms is two baths. */
  const trays = trayArt(() => view.render());

  /* THE ENLARGER, and the paper is on ITS baseboard. The two photographs are
     the same frame - checked, the mean difference away from the light is
     exactly zero - so the lamp is a cross-fade between them and nothing moves
     when it comes on.

     THE LIT PATCH IS NOT A RECTANGLE. The baseboard is seen from above and
     from one side, so the paper's rectangle lands as a quad. Its corners were
     measured off the photograph at the high threshold that finds the sheet and
     not the beam, and they are held as fractions of the artwork so they follow
     any size it is drawn at:

        left 0.2345,0.8635   back 0.4448,0.7993
        right 0.7539,0.8358  front 0.5573,0.9068

     Opposite edges come out 221 against 214 and 299 against 314 - a near
     parallelogram, which is what a rectangle in a mild perspective looks like.
     Every band is filled as its own quad inside it, so the perspective is in
     the geometry rather than in a transform, and it costs nothing: the bands
     were already flat fills. */
  const ENL_Q = {
    left:  [0.2345, 0.8635], back:  [0.4448, 0.7993],
    right: [0.7539, 0.8358], front: [0.5573, 0.9068],
  };
  const enl = {};
  ['on', 'off'].forEach((k) => {
    const i = new Image();
    i.onload = () => { enl[k] = i; view.render(); };
    i.src = '../_shared/interactives/art/enlarger-' + k + '.png';
  });

  /* A POINT IN THE SHEET'S OWN SQUARE, u across the bands and v along them.
     u RUNS ALONG THE LONG EDGE. The patch's edges are 314 and 221 pixels, and
     the bands were being cut across the short one - fewer, fatter bands, and
     they climbed away from the eye instead of crossing the board. Cutting the
     long edge instead gives more of them and lays the strip left to right,
     which is the way a hand draws a card. */
  function onBoard(box, u, v) {
    const q = ENL_Q;
    /* u: left -> front (the long edge)   v: left -> back (the short one) */
    const near = [q.left[0] + (q.front[0] - q.left[0]) * u,
                  q.left[1] + (q.front[1] - q.left[1]) * u];
    const far  = [q.back[0] + (q.right[0] - q.back[0]) * u,
                  q.back[1] + (q.right[1] - q.back[1]) * u];
    return [box.x + (near[0] + (far[0] - near[0]) * v) * box.w,
            box.y + (near[1] + (far[1] - near[1]) * v) * box.h];
  }

  const timers = {};
  ['light', 'dark'].forEach((k) => {
    const i = new Image();
    i.onload = () => { timers[k] = i; view.render(); };
    /* from the PAGE, not from this file: a lecture sits one folder below _shared */
    i.src = '../_shared/interactives/art/timer-' + k + '.png';
  });
  if (document.fonts && document.fonts.load) {
    document.fonts.load('40px "Seven Segment"').then(() => view.render());
  }

  /* ---- controls -------------------------------------------------------
     The aperture is four steps, so it is a pair of buttons and the number
     between them. A slider for four values is a slider pretending. */
  const ap = el('div', 'ctl span1 ts-ap');
  ap.append(el('label', null, 'Aperture'));
  const apRow = el('div', 'ts-step');
  const apDown = el('button', 'st', '−');
  const apVal = el('span', 'ts-big');
  const apUp = el('button', 'st', '+');
  [apDown, apUp].forEach((b) => { b.type = 'button'; });
  apRow.append(apDown, apVal, apUp);
  ap.append(apRow);
  controls.append(ap);

  /* NO BUTTON FOR THE CARD. It is a card lying on the bench with 'slide'
     written on it and the cursor changes over it; a second way to do the same
     thing, parked in the control bar, only made the bench look like it needed
     help. Click the card, or press S. */

  /* KEEP AND DISCARD ARE TWO DIFFERENT DECISIONS and were one button. 'New
     strip' quietly filed a developed strip in the rack and quietly binned an
     undeveloped one - the same press, two outcomes, neither of them asked for.
     A strip you have read is either worth keeping or it is not, and that is
     yours to say. */
  /* FOUR BUTTONS DO NOT FIT IN A QUARTER OF THE BAR. The controls are a
     four-column grid and this row had one column, so Develop was cut to
     'DEVELO', Keep strip broke over two lines and Discard and Reset ran into
     each other. Aperture takes a column, the card takes a column, and the
     actions take the two that are left. */
  const bn = el('div', 'ctl span1 ts-ap');
  bn.append(el('label', null, 'Bands'));
  const bnRow = el('div', 'ts-step');
  const bnDown = el('button', 'st', '\u2212');
  const bnVal = el('span', 'ts-big');
  const bnUp = el('button', 'st', '+');
  [bnDown, bnUp].forEach((b) => { b.type = 'button'; });
  bnRow.append(bnDown, bnVal, bnUp);
  bn.append(bnRow);
  controls.append(bn);

  const acts = el('div', 'states span2 ts-acts');
  const bDevelop = el('button', 'st', 'Develop');
  const bReset = el('button', 'st', 'Reset');
  const bClose = el('button', 'st', 'Close');
  [bDevelop, bReset, bClose].forEach((b) => { b.type = 'button'; acts.append(b); });
  controls.append(acts);

  /* AND THE DECISION BELONGS TO THE PRINT, NOT TO THE BAR. Keep or Discard is
     asked exactly once - when a developed strip is lying there being read -
     so for the whole of the rest of the time they were two dead words taking
     up a quarter of the controls. They are under the sheet now, they arrive
     with it, and they leave with it: the question is asked where you are
     already looking, at the moment it becomes a question.

     Real buttons rather than shapes painted on the canvas, so they can be
     tabbed to and read out; placed from the sheet's own measured box each
     time the scene is drawn. */
  function pickBtn(key, word) {
    const b = el('button', 'pk');
    b.type = 'button';
    b.append(el('kbd', null, key), el('span', null, word));
    return b;
  }
  const pick = el('div', 'ts-pick');
  pick.hidden = true;
  const bKeep = pickBtn('K', 'Keep strip');
  const bDiscard = pickBtn('D', 'Discard');
  pick.append(bKeep, bDiscard);
  stage.append(pick);

  /* ONE ROW, AND IT READS THE STRIP. The aperture is already large under your
     thumb and the seconds are under every band, so a row repeating them is
     furniture. What is not anywhere else is which band to print at. */
  const out = readout(fig, [
    { key: 'Reading', cls: 'hi', wide: true },
  ]);

  

  /* ---- what the hands do ---------------------------------------------- */

  /* THE DOOR IS ON THE FUNCTION, NOT ON THE BUTTON. Switching the two
     buttons off in the control bar left three other ways in - the arrow keys,
     and the timer's own two arrows on the picture - so the aperture could
     still be turned while the lamp was burning, which no hand can do. Both
     settings are locked while an exposure is running, and while the print is
     in the tray: what a developed strip was given is a fact about it, and
     Keep strip files that number with it. */
  function locked() {
    return !!state.run || state.phase !== 'expose' || state.viewing !== null;
  }

  /* AND THE APERTURE IS A FACT ABOUT THE WHOLE SHEET. A test strip varies ONE
     thing - the time - and reads the answer off the difference. Turning the
     lens between bands gives one sheet two f-numbers, which makes the strip
     unreadable and makes the number filed with it in the rack a lie. So the
     aperture locks the moment the first band is given light, exactly the way
     the number of bands does, and it comes back when the next sheet does. */
  function apLocked() {
    return locked() || state.open > 0 || state.secs[0] > 0;
  }

  function setStop(d) {
    if (apLocked()) return;
    const n = Math.min(TS_STOPS.length - 1, Math.max(0, state.stop + d));
    if (n === state.stop) return;
    state.stop = n; refresh();
  }
  function setTime(d) {
    if (locked()) return;
    const n = Math.min(TS_TIMES.length - 1, Math.max(0, state.ti + d));
    if (n === state.ti) return;
    state.ti = n; refresh();
  }
  /* THE EXPOSURE TAKES TIME, AND THE TIMER COUNTS IT DOWN.
     At twice life, so ten seconds of light take five to watch - long enough to
     be an event, short enough that nobody waits. The red button is start AND
     stop, as it is on the timer itself: press it again and the light goes off
     early, and the band keeps only what it had. That is a botched exposure and
     it belongs in here. */
  const SPEED = 2;

  function expose() {
    if (state.phase !== 'expose') return;
    if (state.run) { stopRun(); return; }          /* the second press stops it */
    if (state.open === 0) return;      /* the card is over all of it: no light */
    /* ONE EXPOSURE PER POSITION OF THE CARD. Pressing the red button again
       without moving the card piles more light onto the same bands: thirty-four
       seconds all on band one and the other five never lit, which is a strip
       that says nothing and looks broken. A test strip is one exposure at each
       position, so the button is dead until the card has moved. */
    if (state.open === state.gave) return;
    const want = TS_TIMES[state.ti];
    state.run = { want, done: 0, upto: state.open };
    snd.close();                        /* the contact, and the light is on */
    ticked = 0;

    const still = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || document.hidden) { state.run.done = want; stopRun(); return; }

    const t0 = performance.now();
    (function tick(now) {
      if (!state.run) return;
      state.run.done = Math.min(want, ((now - t0) / 1000) * SPEED);
      /* one tick a second, the way you count in the dark */
      const whole = Math.floor(state.run.done);
      if (whole > ticked) { ticked = whole; snd.tick(); }
      if (state.run.done >= want) { stopRun(); return; }
      view.render();
      requestAnimationFrame(tick);
    })(t0);
    refresh();
  }

  /* The light goes off, and the paper keeps what it was given. */
  function stopRun() {
    const r = state.run;
    if (!r) return;
    state.run = null;
    snd.open();                         /* and off */
    const s = Math.max(0, r.done);
    if (s > 0) {
      state.gave = r.upto;
      const d = tsDose(s, TS_STOPS[state.stop]);
      for (let i = 0; i < r.upto; i++) { state.dose[i] += d; state.secs[i] += s; }
    }
    refresh();
  }

  /* THE CARD IS IN YOUR HAND. Sliding it is a separate act from making the
     exposure, because in the darkroom it is: you draw the card back one band,
     you press the timer, you draw it back again. Doing it for you turned two
     decisions into one button and hid the method the strip is teaching. */
  function slide() {
    if (state.phase !== 'expose' || state.run) return;
    if (state.open >= state.bands) return;
    state.open += 1;
    refresh();
  }

  function setBands(d) {
    if (locked() || state.open > 0 || state.secs[0] > 0) return;
    const n = Math.min(MAXB, Math.max(MINB, state.bands + d));
    if (n === state.bands) return;
    state.bands = n;
    Object.assign(state, blank(state.bands));
    refresh();
  }
  bnDown.addEventListener('click', () => setBands(-1));
  bnUp.addEventListener('click', () => setBands(1));
  apDown.addEventListener('click', () => setStop(-1));
  apUp.addEventListener('click', () => setStop(1));

  function fresh() {
    Object.assign(state, blank(state.bands));
    state.open = 0; state.gave = -1;
    state.phase = 'expose'; state.devT = 0; state.light = 0;
    refresh();
  }
  bDevelop.addEventListener('click', develop);
  /* Only a DEVELOPED strip can be kept. A sheet taken out of the enlarger and
     never put in the tray has no image on it, and filing it in the rack
     showing its tones would be the instrument telling a lie about a print that
     was never made - so the button is dead until the tray has done its work. */
  function keep() {
    if (state.phase !== 'read' || !state.secs[0]) return;
    state.kept.unshift({ f: TS_STOPS[state.stop], iv: TS_TIMES[state.ti],
                         dose: state.dose.slice(), secs: state.secs.slice() });
    if (state.kept.length > 4) state.kept.pop();
    fresh();
  }
  bKeep.addEventListener('click', keep);
  bDiscard.addEventListener('click', fresh);
  bClose.addEventListener('click', () => {
    if (state.viewing === null) return;
    state.viewing = null; refresh();
  });
  bReset.addEventListener('click', () => {
    state.kept = []; state.stop = 2; state.ti = 3; state.bands = 6;
    fresh();
  });

  /* THE TRAY, AS A SEQUENCE. It was three nested callbacks and the tray's own
     fade was tied to the room light, so the tray vanished on the instant the
     light arrived - the one moment in the whole thing that is supposed to be
     slow. One clock now, five named stages, nothing asynchronous with anything
     else:

        in      1.6 s   the tray comes up under the red
        develop 5.4 s   the image arrives, darkest first
        hold    1.6 s   it sits there finished, still red
        LIGHT   ——      one instant. Everything whitens together.
        out     2.0 s   and then the tray goes, slowly

     THE LIGHT IS A SWITCH, NOT A FADE, and that was the whole trouble. A
     switch on a wall does not ramp, and worse, half the scene was reading the
     ramp and half was reading the phase - the strip and the tray cross-faded
     over two and a half seconds while the bench and the timer stayed red and
     then snapped white four seconds later, when the sequence ended. Three
     different times for one event. It is one value now, it goes 0 to 1 in a
     single frame, and the bench, the timer, the strip and the tray all read
     it.

     Then Keep or Discard, and nothing happens to the sheet until one is
     pressed. Thirteen seconds, which is long for an animation and short for a
     print. */
  function develop() {
    if (state.phase !== 'expose' || !state.secs[0]) return;
    state.phase = 'develop'; state.devT = 0; state.light = 0; state.tray = 0;
    /* Some people cannot watch things move, and a tab that is off screen is
       given no frames at all - in either case an animation that never finishes
       leaves the strip stuck half-developed. The reveal is a nicety; the
       developed strip is the state. */
    const still = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || document.hidden) {
      state.devT = 1; state.light = 1; state.tray = 0;
      state.phase = 'read'; refresh(); return;
    }
    const t0 = performance.now();
    (function step(now) {
      const c = devClock(now - t0);
      state.tray = c.tray; state.devT = c.devT; state.light = c.light;
      view.render();
      if (!c.done) { requestAnimationFrame(step); return; }
      state.tray = 0; state.devT = 1; state.light = 1;
      state.phase = 'read';
      refresh();
    })(t0);
    refresh();
  }


  /* ---- the timer answers the pointer and the keyboard ------------------ */

  let box = null;                       /* where the timer was last drawn */
  let cardBox = null;                   /* and where the card is lying */
  let rackBoxes = [];                   /* and where each kept strip sits */
  let heldBox = null;                   /* and the one being held to the light */
  function hit(ev) {
    const r = cv.getBoundingClientRect();
    return dtHit(box, ev.clientX - r.left, ev.clientY - r.top);
  }
  function at(ev, b) {
    if (!b) return false;
    const r = cv.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }
  function onRack(ev) {
    if (state.phase === 'develop' || state.run) return null;
    for (const b of rackBoxes) if (at(ev, b)) return b.i;
    return null;
  }
  function onCard(ev) {
    if (!cardBox || state.phase !== 'expose' || state.run) return false;
    const r = cv.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    return x >= cardBox.x && x <= cardBox.x + cardBox.w
        && y >= cardBox.y && y <= cardBox.y + cardBox.h;
  }
  cv.addEventListener('pointermove', (e) => {
    const held = state.viewing !== null;
    const k = held ? null : hit(e);
    const c = !held && !k && onCard(e);
    const rk = onRack(e);
    cv.style.cursor = (k || rk !== null || (held && at(e, heldBox)))
      ? 'pointer' : (c ? 'ew-resize' : '');
    if (k !== state.hot || c !== state.hotCard || rk !== state.hotRack) {
      state.hot = k; state.hotCard = c; state.hotRack = rk; view.render();
    }
  });
  cv.addEventListener('pointerleave', () => {
    state.hot = null; state.hotCard = false; state.hotRack = null; view.render();
  });
  cv.addEventListener('pointerdown', (e) => {
    /* a strip in the rack, picked up */
    const rk = onRack(e);
    if (rk !== null) {
      e.preventDefault(); cv.focus({ preventScroll: true });
      state.viewing = state.viewing === rk ? null : rk; refresh(); return;
    }
    /* put it back down */
    if (state.viewing !== null) {
      e.preventDefault(); state.viewing = null; refresh(); return;
    }
    const k = hit(e);
    if (!k) { if (onCard(e)) { e.preventDefault(); cv.focus({ preventScroll: true }); slide(); } return; }
    e.preventDefault(); cv.focus({ preventScroll: true });
    if (k === 'down') setTime(-1);
    else if (k === 'up') setTime(1);
    else expose();
  });
  cv.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { setTime(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setTime(1); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { setStop(-1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setStop(1); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === ' ') { expose(); e.preventDefault(); }
    else if (e.key === 's' || e.key === 'S') { slide(); e.preventDefault(); }
    else if (e.key === 'k' || e.key === 'K') { keep(); e.preventDefault(); }
    else if (e.key === 'd' || e.key === 'D') {
      /* only while the pair is actually on screen - a key that works when its
         cap is not showing is a shortcut nobody was told about */
      if (!pick.hidden && !bDiscard.disabled) fresh();
      e.preventDefault();
    }
    else if (e.key === 'Escape' && state.viewing !== null) {
      state.viewing = null; refresh(); e.preventDefault();
    }
  });

  function refresh() {
    apVal.textContent = 'f/' + TS_STOPS[state.stop];
    bnVal.textContent = String(state.bands);
    /* NOTHING IS LIVE THAT CANNOT BE USED. Every button here is switched off
       in the states where pressing it would do nothing or would do something
       nobody asked for, so the control bar is a picture of what is possible
       right now rather than a row of things to try. */
    const busy = state.phase === 'develop' || !!state.run;
    const held = state.viewing !== null;
    const used = state.open > 0 || state.secs[0] > 0;
    const clean = state.open === 0 && !state.secs[0];
    bnDown.disabled = busy || held || !clean || state.bands === MINB;
    bnUp.disabled = busy || held || !clean || state.bands === MAXB;
    apDown.disabled = busy || held || !clean || state.stop === 0;
    apUp.disabled = busy || held || !clean || state.stop === TS_STOPS.length - 1;
    bDevelop.disabled = busy || held || state.phase !== 'expose' || !state.secs[0];
    bKeep.disabled = busy || held || state.phase !== 'read' || !state.secs[0];
    bDiscard.disabled = busy || held || !used;
    bReset.disabled = busy || (!used && !state.kept.length);
    bClose.disabled = !held;
    [apDown, apUp, bnDown, bnUp, bDevelop, bKeep, bDiscard, bReset, bClose]
      .forEach((b) => b.classList.toggle('off', b.disabled));
    /* READING THE STRIP, which is the skill it exists to teach. The band you
       want is the first that goes properly black; if the LEAST exposed band is
       already there the light is too much and nothing on the sheet is telling
       you anything, and if the MOST exposed one still is not, there was not
       enough. Both are ordinary and both are worth naming. */
    const lastB = state.bands - 1;
    let reading = '—';
    if (state.phase === 'read' && state.secs[0]) {
      const zLow = tsZone(tsTone(state.dose[lastB]));
      const zHigh = tsZone(tsTone(state.dose[0]));
      if (state.secs[lastB] && zLow === '0') {
        reading = 'every band is black — close down, or shorten the interval';
      } else if (zHigh !== '0') {
        reading = 'no band reached black — open up, or lengthen the interval';
      } else {
        let first = 0;
        for (let i = lastB; i >= 0; i--) {
          if (state.secs[i] && tsZone(tsTone(state.dose[i])) === '0') { first = i; break; }
        }
        reading = 'first black at ' + tsSecs(state.secs[first]) + ' s — print at that';
      }
    }
    out['Reading'].textContent = reading;
    view.render();
  }

  /* ---- drawing --------------------------------------------------------- */

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    /* THE ROOM IS DARK UNTIL THE SWITCH, and the switch is one value that
       everything on the bench reads - so nothing can whiten before or after
       anything else. */
    const dark = state.light < 0.5;

    /* The safelight, in the red of Batu's own Kaiser: #D70000 at its brightest,
       falling to the near-black the body glows at. It was a washed orange
       before and read as a lit room rather than a darkroom. */
    if (dark) {
      ctx.fillStyle = '#160000'; ctx.fillRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w * 0.5, -h * 0.15, 10, w * 0.5, h * 0.45, w * 0.78);
      g.addColorStop(0, 'rgba(215,0,0,0.62)');
      g.addColorStop(0.45, 'rgba(150,0,0,0.30)');
      g.addColorStop(1, 'rgba(48,0,0,0.10)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = '#E9E6DE'; ctx.fillRect(0, 0, w, h);
    }

    /* SOMETHING IS RUNNING AND YOU HAVE TO WAIT FOR IT. Pressing Develop put
       four buttons out and started a change slow enough to read as nothing
       happening at all. A rule across the top fills while the developer works
       and holds full while the print sits finished in the red - so the wait is
       a stated wait, with an end you can see coming, rather than an instrument
       that has stopped answering. */
    if (state.phase === 'develop') {
      const bh = 3, done = state.devT;
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.fillRect(0, 0, w, bh);
      ctx.fillStyle = state.light > 0
        ? 'rgba(255,210,190,' + (0.9 * (1 - state.light)) + ')'
        : 'rgba(255,110,80,0.92)';
      ctx.fillRect(0, 0, w * done, bh);
      /* and it says so, once, in words */
      /* on the left: the Full screen button owns the other corner */
      label(ctx, done < 1 ? 'DEVELOPING' : 'DEVELOPED',
            12, bh + 14, 'rgba(255,140,115,0.8)', 10, 'left');
    }

    /* the timer on the left */

    /* THE RACK. Strips you have kept live in their own compartment down the
       right-hand side, sunk a shade into the bench so it reads as a separate
       place rather than more bench. It is there whether or not anything is in
       it, so the bench does not jump sideways the first time you keep one. */
    /* narrow: the rack is where strips are put away, and the strip on the
       bench is the thing being looked at - a quarter of the width for an empty
       shelf made the subject the smallest object in the picture */
    /* THE RACK IS AS WIDE AS A STRIP NEEDS. A kept strip was squeezed into
       whatever the rail happened to be and came out a different shape from the
       one on the bench - so a six-band strip and a ten-band strip looked alike,
       and neither looked like what was made. The rail is sized from the strip's
       own proportions now, and the strips inside keep them. */
    /* THE RACK TAKES ROOM ONLY WHEN IT HAS SOMETHING IN IT. Always reserving a
       quarter of the width kept the bench from jumping when the first strip was
       kept - and paid for it with a third of the stage standing empty in front
       of an enlarger that had been squeezed to fit what was left. Empty, it is
       a rail; full, it is a shelf. */
    const keptW = state.kept.length ? Math.min(w * 0.26, 250) : 0;
    const kx = w - keptW - 12;
    const rackX = state.kept.length ? kx - 18 : w - 22;
    ctx.fillStyle = dark ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.055)';
    ctx.fillRect(rackX, 0, w - rackX, h);
    line(ctx, rackX, 0, rackX, h,
         dark ? 'rgba(255,120,100,0.22)' : 'rgba(0,0,0,0.14)');
    rackBoxes = [];
    if (state.kept.length) {
      /* clear of the Full screen button, which lives in the same corner */
      const top = 46;
      /* the bench strip's own shape, so a kept one is the same object smaller */
      const AR = 3.35;                       /* width to height, as it is made */
      const room = (h - top - 16) / state.kept.length - 28;
      const each = Math.min(keptW / AR, room);
      const kw = each * AR;
      state.kept.forEach((k, i) => {
        const y = top + i * (each + 28);
        rackBoxes.push({ i: i, x: kx, y: y, w: kw, h: each });
        strip(ctx, kx, y, kw, each, k.dose, 'read', 1, 1, false, 0);
        if (state.hotRack === i || state.viewing === i) {
          ctx.strokeStyle = state.viewing === i
            ? 'rgba(255,240,230,0.9)' : 'rgba(255,220,205,0.55)';
          ctx.lineWidth = 2;
          ctx.strokeRect(kx - 3.5, y - 3.5, kw + 7, each + 7);
        }
        const eb = kw / k.dose.length;
        k.secs.forEach((t, j) => {
          if (!t) return;
          label(ctx, tsSecs(t), kx + eb * (j + 0.5), y + each + 13,
                dark ? 'rgba(255,175,155,0.9)' : p.muted, 10, 'center');
        });
        label(ctx, 'f/' + k.f, kx, y - 4,
              dark ? 'rgba(255,120,100,0.7)' : p.muted, 9, 'left');
      });
    }

    /* THE TIMER SITS AGAINST THE ENLARGER, and where it sits is measured off
       the enlarger rather than off the stage. The head's own edges, found in
       the artwork: it begins at 0.166 of the height and its leftmost point is
       at 0.319 of the width. So the timer's top lines up with the top of the
       head and its right edge comes in to where the head starts - as close as
       it can stand without touching. On the bench they are next to each other;
       across a stage with a gap between them they were two exhibits. */
    /* THREE SCENES, AND ONLY ONE AT A TIME. You expose at the enlarger, you
       develop in the tray, and then you look at what you have. They are three
       places, so the instrument shows one of them at a time rather than
       dissolving the enlarger into a tray on top of it - which is a thing that
       happens to a photograph, not to a darkroom. */
    const atEnlarger = state.phase === 'expose';
    const inTray = state.phase === 'develop';
    const looking = state.phase === 'read';

    const ENL_HEAD = { top: 0.166, left: 0.319 };
    const tH = Math.min(h * 0.62, 330);
    const tW = tH * DT.w / DT.h;

    /* THE ENLARGER STANDS BETWEEN THEM, and the paper is on its baseboard.
       Until now the strip floated on a bench that was not there, which is why
       the paper and the card never looked like they were anywhere. */
    /* the enlarger takes what is left of the stage once the rack has its
       share; the timer overlaps into it, so it is not asked for its own column */
    const left = Math.max(10, w * 0.10);
    const room = (rackX - 14) - left;
    /* fit inside BOTH, not one and then the other: widening to fill the room
       made it taller than the stage and put the baseboard - which is the whole
       reason it is here - below the bottom edge */
    const eh = Math.min(h - 16, room * 1100 / 707);
    const ew = eh * 707 / 1100;
    const ex = left + (room - ew) / 2, ey = (h - eh) / 2;
    const board = { x: ex, y: ey, w: ew, h: eh };

    /* and now the timer, against it */
    /* THE TIMER STANDS IN THE BOTTOM LEFT CORNER, and stays there. Hanging it
       off the enlarger's head meant it moved whenever the enlarger resized, and
       it ended up floating in the middle of the room. A timer sits on the bench
       beside the enlarger; the bench has a corner, and that is where it is. */
    const tx = 14;
    const ty = h - tH - 34;
    if (atEnlarger) timer(ctx, tx, ty, tW, tH);
    else box = null;                    /* nothing to press while it develops */

    /* THE LAMP IS A CROSS-FADE BETWEEN TWO PHOTOGRAPHS of the same frame, so
       nothing shifts when it comes on. The bench beneath goes with it. */
    const lampOn = state.run ? 1 : 0;
    /* and the whole enlarger stands down as the tray comes up, because the
       paper is carried from one to the other and that is a change of place */
    const enlA = atEnlarger ? 1 : 0;
    if (enlA > 0.01 && enl.off) {
      ctx.save();
      ctx.globalAlpha = enlA;
      ctx.drawImage(enl.off, ex, ey, ew, eh);
      if (lampOn && enl.on) ctx.drawImage(enl.on, ex, ey, ew, eh);
      ctx.restore();
    }

    /* the sheet's own box, for the tray and for the rows of numbers: the lit
       patch's bounding box, which is where the paper is */
    /* WHERE THE SHEET IS. On the enlarger it is the lit patch's own box; off
       it, the sheet has been carried to the tray and is the thing you are
       looking at, so it takes the middle of the stage and as much of it as it
       can have. */
    let sx, sy, sw, sh;
    if (atEnlarger) {
      const qs = [ENL_Q.left, ENL_Q.back, ENL_Q.right, ENL_Q.front]
        .map((q) => [ex + q[0] * ew, ey + q[1] * eh]);
      sx = Math.min.apply(null, qs.map((q) => q[0]));
      sy = Math.min.apply(null, qs.map((q) => q[1]));
      sw = Math.max.apply(null, qs.map((q) => q[0])) - sx;
      sh = Math.max.apply(null, qs.map((q) => q[1])) - sy;
    } else {
      /* AND THE ROW UNDER IT NEEDS SOMEWHERE TO PUT ITS NAME. The sheet was
         centred in the whole stage and left forty-five pixels either side, so
         'seconds' - which is right-aligned off the sheet's left edge - ran off
         the canvas and read 'nds'. The sheet is centred in what is left once
         the word has its place. */
      /* ONE WIDTH FOR BOTH, so the print does not change size when the phase
         does. The bath had its own layout and the reading had another, and the
         two differed by a quarter - so at the instant the tray finished fading
         the print jumped bigger. That jump was in the middle of the one moment
         this animation exists for.
         IN THE TRAY IT STANDS BACK, and it comes forward on the tray's own
         clock: the sheet is pulled in while the bath is up and is back at full
         size exactly when the bath has gone, which is the frame the reading
         starts on. Nothing moves at the change. */
      const gutL = 104;
      sw = Math.min(rackX - gutL * 2, (h - 150) * 3.35);
      if (!looking) sw *= 1 - 0.26 * Math.min(1, Math.max(0, state.tray));
      sh = sw / 3.35;
      sx = (rackX - sw) / 2;
      sy = (h - sh) / 2 - 6;
    }
    const gut = 78;

    /* THE SHEET GOES INTO THE DEVELOPER, and the tray comes up around it -
       around it, in its place, so the paper never moves. It sits in the red
       with the print and turns grey with the print when the light goes on. */
    /* the tray has a clock of its own now: up before the developing starts and
       down after the room light is on, so it never vanishes on an instant */
    const trayA = state.phase === 'develop' ? state.tray : 0;
    if (trayA > 0.01 && trays.under && trays.over) {
      const fit = trayScene(ctx, trays, sx, sy, sw, sh, trayA,
                            state.light > 0.5, () => {
        strip(ctx, sx, sy, sw, sh, state.dose, state.phase, state.devT,
              state.light, true, 0);
      });
      label(ctx, Math.round(state.devT * 60) + ' s', sx + sw / 2,
            fit.y + fit.h - 18,
            state.light > 0.5 ? 'rgba(0,0,0,0.55)' : 'rgba(255,170,150,0.9)',
            15, 'center');
    } else if (atEnlarger) {
      /* ON THE BASEBOARD, IN ITS PERSPECTIVE. Each band is its own quad inside
         the lit patch, so the paper lies on the board instead of floating in
         front of it - and it costs nothing, because a band was always a flat
         fill and a flat fill does not care what shape it is. */
      boardStrip(ctx, board, 1);
    } else if (looking) {
      /* OUT OF THE TRAY AND IN YOUR HANDS. The enlarger has gone, the tray has
         gone, and what is left is the print - flat, square on, and as large as
         the stage will give it, because this is the moment it is being judged.

         ONLY WHEN LOOKING. This was an unconditional else, so in the second and
         a half before the tray comes up - developing has begun, the enlarger is
         gone, the tray is not there yet - it drew the strip as 'read' under a
         light of 1: a finished print in full room light, for a moment, before
         the red tray faded in over it. That was the white flash. */
      strip(ctx, sx, sy, sw, sh, state.dose, 'read', 1, 1, true, 0);
    }

    /* THE CARD, and it is yours to move. It lies on the board with the paper,
       so it takes the board's perspective too. */
    cardBox = null;
    if (state.phase === 'expose' && state.open < state.bands && enlA > 0.5) {
      /* A CARD IS A PIECE OF CARD, AND IT MOVES. Its far end was pinned to
         the far end of the paper, so what you watched was a black rectangle
         getting shorter - a shutter closing, not a hand. It has its own
         length now, a little longer than the sheet, and it slides: the
         leading edge uncovers a band and the trailing end runs off the paper
         and onto the baseboard, which is what happens on the bench. */
      const CARD_L = 1.12;
      const u0 = state.open / state.bands, u1 = u0 + CARD_L;
      const c1 = onBoard(board, u0, -0.06), c2 = onBoard(board, u1, -0.06);
      const c3 = onBoard(board, u1, 1.06), c4 = onBoard(board, u0, 1.06);
      /* the card reaches off the board now, so it is kept out of the rack -
         a strip you have already filed is not something a card can lie on */
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, rackX - 8, h); ctx.clip();
      ctx.beginPath();
      ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]);
      ctx.lineTo(c3[0], c3[1]); ctx.lineTo(c4[0], c4[1]); ctx.closePath();
      ctx.fillStyle = state.hotCard ? 'rgba(30,2,0,0.95)' : 'rgba(14,0,0,0.92)';
      ctx.fill();
      /* ITS OWN EDGE, ALL THE WAY ROUND. Past the far end of the paper the
         card lies on the bench, and a black card on a black bench under a red
         lamp is a card you cannot see - so sliding it looked exactly like
         shrinking it, which is the thing that was wrong in the first place.
         The safelight catches the cut edge; that faint line is what tells you
         a whole object moved. */
      ctx.strokeStyle = state.hotCard
        ? 'rgba(255,150,130,0.55)' : 'rgba(255,110,90,0.30)';
      ctx.lineWidth = 1;
      ctx.stroke();
      /* and the leading edge brighter, because that is the edge doing the work */
      ctx.strokeStyle = state.hotCard
        ? 'rgba(255,170,150,0.9)' : 'rgba(255,120,100,0.45)';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c4[0], c4[1]);
      ctx.stroke();
      const mid = onBoard(board, Math.min(1, u0 + 0.18), 0.5);
      /* FROM ALL FOUR CORNERS, not from an assumed pair. This box was built as
         if c1,c2 were the top edge and c3,c4 the bottom - true of the old flat
         card, and false the moment the bands were turned onto the long axis and
         the quad wound the other way. The height came out ZERO, so the card
         could not be pressed at all: the keyboard slid it and the hand could
         not. A bounding box has no business knowing which corner is which. */
      /* THE BOX IS THE PART LYING ON THE PAPER, not the whole card. The card
         reaches past the far edge now, and a hit box that followed it out
         there would catch presses meant for the rack. */
      const e1 = onBoard(board, Math.min(u1, 1.06), -0.06);
      const e2 = onBoard(board, Math.min(u1, 1.06), 1.06);
      const xs = [c1[0], e1[0], e2[0], c4[0]], ys = [c1[1], e1[1], e2[1], c4[1]];
      const bx0 = Math.min.apply(null, xs), by0 = Math.min.apply(null, ys);
      cardBox = { x: bx0 - 6, y: by0 - 6,
                  w: Math.max.apply(null, xs) - bx0 + 12,
                  h: Math.max.apply(null, ys) - by0 + 12 };
      if (!state.run) label(ctx, 'slide \u2192', mid[0], mid[1],
                            state.hotCard ? 'rgba(255,190,170,0.95)'
                                          : 'rgba(255,120,100,0.55)', 11, 'center');
      ctx.restore();
    } else if (false) {
      const bw = sw / state.bands, cx = sx + bw * state.open;
      const cw = sw - bw * state.open + 14;
      cardBox = { x: cx, y: sy - 14, w: cw, h: sh + 28 };
      ctx.fillStyle = state.hotCard ? 'rgba(30,2,0,0.94)' : 'rgba(14,0,0,0.9)';
      ctx.fillRect(cx, sy - 14, cw, sh + 28);
      line(ctx, cx, sy - 14, cx, sy + sh + 14,
           state.hotCard ? 'rgba(255,170,150,0.9)' : 'rgba(255,120,100,0.45)');
      if (!state.run) label(ctx, 'slide \u2192', cx + Math.min(cw / 2, 54),
                            sy + sh / 2 + 4,
                            state.hotCard ? 'rgba(255,190,170,0.95)'
                                          : 'rgba(255,120,100,0.5)', 11, 'center');
    }

    /* WHAT EACH BAND WAS GIVEN, under each band. This is the whole reading of
       a test strip - you point at a band and say that one, and the number
       under it is the exposure you then print at - so it is set large enough
       to be read from the back of the room and not as a caption. */
    /* THE NUMBERS COME OFF THE BOARD. The bands are in perspective now, so a
       number sitting on each one would be in perspective too - cramped at the
       back, and leaning. They are a straight row under the enlarger instead,
       one per band and in the bands' own order, with a fine leader from each
       to the band it belongs to. The row is clamped inside the stage, because
       it was falling off the bottom of it. */
    let any = false;
    if (atEnlarger) {
      /* on the board the bands are in perspective, so the numbers are a
         straight row underneath with a leader to each */
      /* AND IT KEEPS OFF THE KEY ROW. Both were clamped to fourteen pixels
         off the bottom, so on a wide short stage - which is what a lecture
         slide is - the numbers and the word 'seconds' landed exactly on top
         of the caps that say S slide. */
      const rowY = Math.min(h - 40, ey + eh + 6);
      const rowL = ex + ew * 0.10, rowR = ex + ew * 0.94;
      const rbw = (rowR - rowL) / state.bands;
      for (let i = 0; i < state.bands; i++) {
        if (!state.secs[i]) continue;
        any = true;
        const nx = rowL + rbw * (i + 0.5);
        const band = onBoard(board, (i + 0.5) / state.bands, 1);
        line(ctx, nx, rowY - 15, band[0], band[1] + 3,
             dark ? 'rgba(255,120,100,0.22)' : 'rgba(0,0,0,0.16)');
        label(ctx, tsSecs(state.secs[i]), nx, rowY,
              dark ? 'rgba(255,190,170,0.95)' : p.ink, 15, 'center');
      }
      if (any) label(ctx, 'seconds', rowL - 12, rowY,
                     dark ? 'rgba(255,120,100,0.55)' : 'rgba(0,0,0,0.30)',
                     15, 'right');
    } else if (looking) {
      /* out of the tray it is flat and square on, so each number goes straight
         under its own band - which is where you want it when you are choosing
         which band to print at */
      const bw = sw / state.bands;
      for (let i = 0; i < state.bands; i++) {
        if (!state.secs[i]) continue;
        any = true;
        label(ctx, tsSecs(state.secs[i]), sx + bw * (i + 0.5), sy + sh + 26,
              p.ink, 16, 'center');
      }
      if (any) label(ctx, 'seconds', sx - 14, sy + sh + 26,
                     'rgba(0,0,0,0.30)', 16, 'right');
    }

    /* A STRIP PICKED UP AND HELD TO THE LIGHT. This is where the zones are:
       a band on the bench is a wet print in a red room and reading a zone off
       it would be a guess, but a strip you have kept and lifted is a finished
       print you are looking at properly. The room behind it goes down so that
       what you are holding is the only thing lit. */
    heldBox = null;
    if (state.viewing !== null && state.kept[state.viewing]) {
      const k = state.kept[state.viewing];
      ctx.fillStyle = 'rgba(4,2,2,0.78)';
      ctx.fillRect(0, 0, rackX, h);
      const vw = Math.min(rackX - 60, 560), vh = Math.min(h * 0.42, 165);
      const vx = (rackX - vw) / 2, vy = h * 0.26;
      heldBox = { x: vx - 20, y: vy - 20, w: vw + 40, h: vh + 110 };
      strip(ctx, vx, vy, vw, vh, k.dose, 'read', 1, 1, true, 0);
      const vb = vw / k.dose.length;
      k.secs.forEach((t, j) => {
        if (!t) return;
        label(ctx, tsSecs(t), vx + vb * (j + 0.5), vy + vh + 26,
              'rgba(255,255,255,0.92)', 17, 'center');
        label(ctx, tsZone(tsTone(k.dose[j])), vx + vb * (j + 0.5), vy + vh + 50,
              'rgba(255,170,120,0.95)', 15, 'center');
      });
      label(ctx, 'seconds', vx - 14, vy + vh + 26, 'rgba(255,255,255,0.32)', 17, 'right');
      label(ctx, 'zone', vx - 14, vy + vh + 50, 'rgba(255,170,120,0.34)', 15, 'right');
      label(ctx, 'f/' + k.f + '  \u00b7  ' + tsSecs(k.iv) + ' s intervals',
            vx + vw / 2, vy - 16, 'rgba(255,255,255,0.55)', 11, 'center');
      label(ctx, 'click to put it back', vx + vw / 2, vy + vh + 78,
            'rgba(255,255,255,0.35)', 10, 'center');
    }

    /* AND THE QUESTION, UNDER THE PRINT THAT RAISES IT. Only while there is a
       developed strip to answer about, and never over a strip lifted out of
       the rack, which is a different sheet being looked at. */
    placePick(looking && !!state.secs[0] && state.viewing === null,
              sx + sw / 2, sy + sh + 46);
  }

  /* The canvas is handed CSS pixels to draw in, so a box measured in draw() is
     a box on the page - but in full screen the canvas is centred inside the
     stage rather than filling it, so the offset is read off the canvas rather
     than assumed to be nothing. */
  function placePick(show, cx, top) {
    if (!show) { pick.hidden = true; return; }
    pick.style.left = (view.canvas.offsetLeft + cx) + 'px';
    pick.style.top = (view.canvas.offsetTop + top) + 'px';
    pick.hidden = false;
  }

  function timer(ctx, x, y, w, h) {
    const img = timers[state.light >= 0.5 ? 'light' : 'dark'];
    const startDead = !state.run
      && (state.open === 0 || state.open === state.gave
          || state.phase !== 'expose');
    box = dtDraw(ctx, img, x, y, w, h, {
      secs: state.run ? state.run.want - state.run.done : TS_TIMES[state.ti],
      hot: state.hot,
      dead: { down: locked(), up: locked(), start: startDead },
      glow: state.phase !== 'read',
    });

    /* EVERY KEY THAT DOES SOMETHING, in a cap, under the thing it drives. A
       row reading "S slide" is a sentence with a stray letter in it; the same
       row with the S in a square is a keyboard instruction. */
    keyRow(ctx, x + w * 0.5, y + h + 20,
           [[['\u25C0', '\u25B6'], 'time'], [['\u25B2', '\u25BC'], 'f-stop'],
            [['S'], 'slide'], [['\u23CE'], 'expose']],
           state.light >= 0.5 ? p.ink : 'rgba(255,200,180,0.95)',
           state.light >= 0.5 ? p.muted : 'rgba(255,150,130,0.75)');
  }

  /* THE STRIP ON THE BASEBOARD. The same tones as the flat one, laid into the
     lit patch band by band. Bilinear across the quad, which for a near
     parallelogram is exact enough that nobody will find the error with a
     ruler - and the error a transform would leave is in the same place. */
  function boardStrip(ctx, box, alpha) {
    const n = state.dose.length;
    const lit = state.run ? state.run.upto : 0;
    ctx.save();
    ctx.globalAlpha = alpha;
    /* AND THEY OVERLAP. Two filled paths that share an edge do NOT meet on a
       canvas: each is antialiased against the background at about half
       coverage, and a half and a half leave a gap - so a hairline of whatever
       is behind shows through every join. Behind these is the lit paper, so
       every join came out as a bright white line ruled down the strip. The
       flat strip has had `bw + 0.5` for this all along; the board's bands were
       laid edge to edge and had not. Each band now reaches half a band into
       the next, which cannot fail at any size - the next band is painted after
       it and covers the overlap exactly - and the last one stops at the
       paper's edge. */
    const lap = 0.5 / n;
    for (let i = 0; i < n; i++) {
      const u1 = Math.min(1, (i + 1) / n + lap);
      const a = onBoard(box, i / n, 0), b = onBoard(box, u1, 0);
      const c = onBoard(box, u1, 1), d = onBoard(box, i / n, 1);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath();
      if (i < lit) { ctx.fillStyle = TS_LAMP[state.stop]; ctx.fill(); continue; }
      let v = tsTone(state.dose[i]);
      if (state.phase === 'expose') v = 1;      /* latent: nothing to see yet */
      ctx.fillStyle = tsPaper(v, state.light);
      ctx.fill();
      if (i) {
        ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
      }
    }
    /* the sheet's own edge */
    const e = [onBoard(box, 0, 0), onBoard(box, 1, 0), onBoard(box, 1, 1),
               onBoard(box, 0, 1)];
    ctx.beginPath();
    ctx.moveTo(e[0][0], e[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(e[i][0], e[i][1]);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  }

  /* One strip: six bands, each the grey the light it was given earned.
     `litUpto` is how many bands the enlarger is standing on RIGHT NOW. */
  /* HOW HARD THE LAMP IS STANDING ON IT. Four apertures, four brightnesses -
     not the real ratio, which is 8:1 from f/4 to f/11 and would put f/11 in the
     dark, but four steps far enough apart that you can see you are at a
     different power without being told. The number on the dial and the light on
     the bench should not be able to disagree. */
  const TS_LAMP = ['rgb(255,238,233)', 'rgb(236,206,199)',
                   'rgb(206,166,158)', 'rgb(172,128,120)'];

  function strip(ctx, x, y, w, h, dose, phase, devT, light, big, litUpto) {
    const n = dose.length, bw = w / n;
    for (let i = 0; i < n; i++) {
      /* THE LAMP IS ON THIS BAND. What you are looking at is not the paper,
         it is the light standing on the paper - so the band goes to the white
         the enlarger throws, with the red of the safelight still in it. An
         overlay laid over the top read as a veil hung above the bench; the
         light belongs ON the sheet, and it stops dead at the card. */
      if (i < litUpto) {
        ctx.fillStyle = TS_LAMP[state.stop];
        ctx.fillRect(x + bw * i, y, bw + 0.5, h);
        continue;
      }
      let v = tsTone(dose[i]);
      if (phase === 'develop') {
        /* the darkest arrive first, so the ladder fills from the left */
        /* AND IT HAS TO USE THE TIME IT IS GIVEN. This was 1 - (1-v)*0.86, so
           a band that ends near black was finished at a fifth of the way
           through - and the bands that end near black are the ones that move.
           Everything visible was over in a second and a half of a five-second
           bath, and the rest was a still picture. The shadows still come up
           first, which is what a print does; they just no longer come up and
           then wait. */
        const need = 0.55 + 0.45 * v;
        v = 1 - (1 - v) * Math.min(1, devT / Math.max(0.08, need));
      } else if (phase === 'expose') {
        v = 1;                              /* latent: nothing to see yet */
      }
      ctx.fillStyle = tsPaper(v, light);
      ctx.fillRect(x + bw * i, y, bw + 0.5, h);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    if (big) for (let i = 1; i < n; i++)
      line(ctx, x + bw * i, y, x + bw * i, y + h, 'rgba(255,255,255,0.12)');
  }

  refresh();
}
