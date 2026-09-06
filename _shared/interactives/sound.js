/* ============================================================
   THE ENLARGER'S RELAY
   ------------------------------------------------------------
   IN A DARKROOM YOU TIME BY EAR. The timer's contact closes with
   a hard mechanical clack, you count, and it opens with another.
   Nobody watches the display — the display is behind you and the
   room is dark. So the click is not decoration on these
   instruments; it is the half of the information the screen
   cannot give, and it is the reason a printer can hold a card
   with both hands and still know where they are.

   IT IS A REAL RELAY, AND IT IS SIX OF THEM. The recording Batu
   found switches three times, so all six events are cut:
   relay-close-1..3 and relay-open-1..3. One is picked at random
   each time, from its own kind, and never the same one twice
   running — because a relay does not sound identical from one
   switching to the next, and hearing one file over and over is
   what makes a sound effect sound like a sound effect.

   The three are not merely different files, they are different
   sounds: close-2 is over in 120 ms where close-1 and close-3
   ring for 250. And closes are never played for opens, because
   the two differ the way the machine does — the armature is
   pulled onto the pole face, and then only let go.

   The synthesis underneath is kept as a fallback, so a missing
   file costs nothing. It is a stand-in and it sounds like one.

   OFF UNTIL SOMEBODY ASKS. A lecture is a room with people in
   it, and sound that arrives unrequested is an interruption
   rather than a lesson. The choice is remembered per browser so
   it is made once, not once a page.

   Browsers refuse to make a sound until the page has been
   pressed. That costs us nothing: every sound here follows a
   press.
   ============================================================ */

const SND_KEY = 'ts2.sound';
const SND_LVL = 'ts2.soundLevel';

/* FOUR LEVELS, AND THEY ARE NOT EVENLY SPACED IN NUMBER. The ear hears
   loudness by ratio, so halving the number halves the loudness - these are
   roughly -18, -12, -6 and 0 dB, which are four steps you can actually tell
   apart. Four equal numbers would give three that sound the same and one that
   sounds loud. */
const SND_STEPS = [0.13, 0.25, 0.5, 1];

function enlargerSound() {
  let ctx = null;
  let on = false;
  let lvl = 2;                          /* index into SND_STEPS: -6 dB */
  try {
    on = localStorage.getItem(SND_KEY) === '1';
    const v = parseInt(localStorage.getItem(SND_LVL), 10);
    if (v >= 0 && v < SND_STEPS.length) lvl = v;
  } catch (e) { on = false; }

  /* THE RECORDINGS, if they are there. Fetched once, decoded once, and kept -
     a click that has to wait for a network round trip is a click that arrives
     after the thing it was announcing. */
  const clips = { close: [], open: [] };
  const last = { close: -1, open: -1 };
  let looked = false;
  function findClips() {
    if (looked) return;
    looked = true;
    const c = wake();
    if (!c) { looked = false; return; }        /* try again once sound is on */
    ['close', 'open'].forEach((slot) => {
      [1, 2, 3].forEach((n) => {
        ['wav', 'mp3', 'm4a'].forEach((ext) => {
          fetch('../_shared/interactives/art/relay-' + slot + '-' + n + '.' + ext)
            .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
            .then((b) => c.decodeAudioData(b))
            .then((buf) => { clips[slot].push(buf); })
            .catch(() => { /* that one is not there; the others still are */ });
        });
      });
    });
  }

  /* NEVER THE SAME ONE TWICE RUNNING. A relay does not sound identical from
     one switching to the next, and three recordings played at random do - one
     time in three - land on the same file twice in a row, which reads as a
     glitch rather than as a machine. So the last one used is barred, and with
     three that is still a real choice.

     Closes are drawn from closes and opens from opens, never mixed: the two
     genuinely differ - the armature is pulled onto the pole face and then only
     let go - and that difference is information. */
  function play(slot, level) {
    const c = wake();
    const bank = clips[slot];
    if (!c || !bank.length) return false;
    let i = Math.floor(Math.random() * bank.length);
    if (bank.length > 1 && i === last[slot]) i = (i + 1) % bank.length;
    last[slot] = i;
    const src = c.createBufferSource(); src.buffer = bank[i];
    const g = c.createGain(); g.gain.value = level * SND_STEPS[lvl];
    src.connect(g); g.connect(c.destination);
    src.start();
    return true;
  }

  function wake() {
    if (!on) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) { try { ctx = new AC(); } catch (e) { return null; } }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* THE CONTACT. A few milliseconds of noise through a band-pass, which is
     what a small hard collision sounds like: no pitch, all attack. Closing
     rings higher than opening because the armature is being pulled onto the
     pole face rather than let go of. */
  function crack(hz, level, ms) {
    const c = wake();
    if (!c) return;
    const n = Math.max(1, Math.round(c.sampleRate * ms / 1000));
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
      /* a sharp decay, not a fade: the sound is over before you notice it */
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 4);
    }
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = hz; bp.Q.value = 1.1;
    const g = c.createGain();
    g.gain.value = level;
    src.connect(bp); bp.connect(g); g.connect(c.destination);
    src.start();
  }

  /* THE ARMATURE. A low knock under the crack, gone in forty milliseconds.
     Without it the click is a tick on a screen; with it, it is a machine. */
  function thump(hz, level) {
    const c = wake();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(hz, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(hz * 0.55, c.currentTime + 0.04);
    g.gain.setValueAtTime(level, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.05);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.06);
  }

  const api = {
    /* the light comes on */
    close: function () {
      findClips();
      if (play('close', 0.9)) return;
      crack(2600, 0.30, 9); thump(150, 0.22);
    },
    /* and goes off, duller, because letting go is quieter than pulling in */
    open: function () {
      findClips();
      if (play('open', 0.8)) return;
      crack(1700, 0.20, 11); thump(110, 0.16);
    },
    /* A RELAY DOES NOT TICK, and this one is a relay. The per-second click was
       invented, and an invented sound beside a recorded one is the one that
       gets noticed. The timer counts on its own face; the ear gets the two
       events that actually happen. */
    tick: function () {},
    get enabled() { return on; },
    get level() { return lvl; },
    set level(v) {
      lvl = Math.max(0, Math.min(SND_STEPS.length - 1, v | 0));
      try { localStorage.setItem(SND_LVL, String(lvl)); } catch (e) { /* private */ }
    },
    steps: SND_STEPS.length,
    set enabled(v) {
      on = !!v;
      try { localStorage.setItem(SND_KEY, on ? '1' : '0'); } catch (e) { /* private window */ }
      if (on) findClips();
      if (!on && ctx) { try { ctx.close(); } catch (e) { /* already gone */ } ctx = null; }
    },
  };
  return api;
}

/* THE SWITCH, beside Full screen, because both are about the room the
   instrument is being shown in rather than about the instrument. It says what
   it will do next, not what it is: a control the reader can act on. */
function soundButton(stage, snd, onChange) {
  const wrap = el('div', 'sndbar');
  const b = el('button', 'fs snd', '');
  b.type = 'button';

  /* THE LEVEL IS FOUR MARKS, NOT A SLIDER. A slider for four values is a
     slider pretending, and this one is read across a room: four bars, the lit
     ones are where you are, and pressing one goes there. Dead while the sound
     is off, because nothing is live that cannot be used. */
  /* AND A STEP EITHER SIDE. The marks say where you are and can be pressed
     straight to; the two buttons walk it, which is what a hand reaches for
     when the marks are five pixels wide. Same pair as the aperture's, so the
     gesture is already learned. */
  const bars = [];
  const down = el('button', 'sndstep', '\u2212');
  const up = el('button', 'sndstep', '+');
  [down, up].forEach((b) => { b.type = 'button'; });
  down.title = 'Quieter'; up.title = 'Louder';
  down.setAttribute('aria-label', down.title);
  up.setAttribute('aria-label', up.title);
  down.addEventListener('click', () => { snd.level = snd.level - 1; say(); snd.close(); });
  up.addEventListener('click', () => { snd.level = snd.level + 1; say(); snd.close(); });

  const lv = el('div', 'sndlv');
  lv.setAttribute('role', 'group');
  lv.setAttribute('aria-label', 'Sound level');
  for (let i = 0; i < snd.steps; i++) {
    const m = el('button', 'sndm');
    m.type = 'button';
    m.title = 'Level ' + (i + 1) + ' of ' + snd.steps;
    m.setAttribute('aria-label', m.title);
    m.addEventListener('click', () => {
      snd.level = i;
      say();
      snd.close();                     /* at the level you just chose */
    });
    bars.push(m); lv.append(m);
  }

  function say() {
    b.textContent = snd.enabled ? 'Sound on' : 'Sound off';
    b.setAttribute('aria-pressed', String(snd.enabled));
    bars.forEach((m, i) => {
      m.classList.toggle('on', snd.enabled && i <= snd.level);
      m.disabled = !snd.enabled;
      m.classList.toggle('off', !snd.enabled);
    });
    down.disabled = !snd.enabled || snd.level === 0;
    up.disabled = !snd.enabled || snd.level === snd.steps - 1;
    [down, up].forEach((b) => b.classList.toggle('off', b.disabled));
  }
  b.addEventListener('click', () => {
    snd.enabled = !snd.enabled;
    say();
    if (snd.enabled) snd.close();      /* so you hear what you just turned on */
    if (onChange) onChange(snd.enabled);
  });
  say();
  wrap.append(b, down, lv, up);
  stage.append(wrap);
  return b;
}
