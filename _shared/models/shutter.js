/* ============================================================
   Shutter speed — week 3.

   ONE THING: the shutter is a length of time, and that one length
   does two jobs at once — it decides how much light is collected
   and how far anything moving travels while the film is open.

   His round of 13-09, 23:29: the top is the scene, alive — the
   ball really crossing, back and forth — and the bottom is the
   photograph that shutter takes of it.

   His round of 13-09, 23:55: "Fotoğraf sabit kalacak. Interaktife
   bir deklanşör koy basıldığında fotoğrafı çekip sabitlesin." So
   the photograph is TAKEN, by a press, and then it does not move:
   it keeps the ball where it was and the speed the shutter had at
   that moment. Changing the speed afterwards changes nothing until
   the release is pressed again — which is how a camera behaves.
   ============================================================ */

const SH_LADDER = [1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1];

function modelShutter(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { i: 3, shot: null, flash: 0 };  /* 1/125, nothing taken yet */
  stepper(controls, {
    label: 'Shutter speed', ladder: SH_LADDER, value: SH_LADDER[state.i],
    format: shutterText,
    onChange: (v, i) => { state.i = i; },
  });

  /* the release. One press: the photograph is taken with the ball where it
     is and the speed the shutter has, and it stays. */
  const act = el('div', 'ctl');
  act.append(el('label', null, 'Shutter release'));
  const acts = el('div', 'states');
  const go = el('button', 'st release', 'Take the photograph');
  go.type = 'button';
  acts.append(go);
  act.append(acts);
  controls.append(act);
  go.addEventListener('click', release);

  const view = canvas(stage, draw);

  /* the scene runs on its own clock; the photograph does not move */
  const t0 = performance.now();
  const along = () => {
    const phase = ((performance.now() - t0) / 2400) % 2;
    return phase < 1 ? phase : 2 - phase;
  };
  const dir = () => (((performance.now() - t0) / 2400) % 2) < 1 ? 1 : -1;
  (function tick() {
    if (!fig.isConnected) return;
    view.render();
    requestAnimationFrame(tick);
  })();

  /* HIS KEYNOTE OF 14-09-2026, slide 17: "The time it takes has to match
     with the image being exposed ... it has to have a realism." So the shutter
     is open for the real time - a second at 1 s, an instant at 1/125 - and the
     photograph is built from where the ball actually was while it was open. */
  /* THE SOUND A SHUTTER MAKES, AND A DIFFERENT ONE FOR EVERY SPEED.
     His second round, 16-09-2026, slide 18: "Put a shutter sound, find them
     online, separate different shutter speeds sounds." Nothing is fetched from
     anywhere: the sound is made here, two clicks - the blind opening and the
     blind closing - with the gap between them the exposure itself. At 1/1000
     they are one snap; at half a second you hear the shutter stay open, which
     is the thing the page is about. */
  let audio = null;
  function click(at, level) {
    const n = audio.createBufferSource();
    const len = Math.floor(audio.sampleRate * 0.012);
    const buf = audio.createBuffer(1, len, audio.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    }
    n.buffer = buf;
    const f = audio.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 0.8;
    const g = audio.createGain();
    g.gain.value = level;
    n.connect(f); f.connect(g); g.connect(audio.destination);
    n.start(at);
  }
  function shutterSound(seconds) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audio) audio = new AC();
      if (audio.state === 'suspended') audio.resume();
      const t0 = audio.currentTime + 0.01;
      click(t0, 0.5);                                   /* it opens */
      click(t0 + Math.min(seconds, 2), 0.38);           /* and it shuts */
    } catch (e) { /* a lecture room with no sound is still a lecture */ }
  }

  function release() {
    shutterSound(SH_LADDER[state.i]);
    state.shot = { i: state.i, at: performance.now(), open: true, trail: [] };
    state.flash = performance.now();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 28, gapY = 40, gapX = 56;
    const ph = (h - pad * 2 - gapY - 20) / 2;
    /* THE SPACE LEFT OVER IS PART OF THE DECISION (his rule of 08-09, said
       again on slide 29). The pictures were centred in "the room left of the
       ladder" while the ladder's bars were drawn out to the far edge of the
       stage — so the right-hand half was full, the left-hand third was black,
       and the instrument read as a panel with a hole in it.
       The ladder is as wide as its bars need. The pictures take what is left,
       up to their own shape. The two of them TOGETHER are centred, so what is
       over is margin on both sides. */
    /* THE PICTURES GO LEFT AND THE BARS TAKE THE REST. His word, 16-09-2026:
       "gerçekten orantılı olarak uzat şunların pixellerini, şu kısmı sola daya,
       ki daha uzun pixellere yer açılsın." The two panels stood in the middle
       with the ladder squeezed beside them, so the longest bar had nowhere to
       go and the difference had to be written as ×2. Flush left, the ladder has
       the whole remainder and the lengths can say it themselves. */
    const pw = Math.min(ph * 2.4, (w - pad * 2) * 0.42);
    const px = pad;
    const ladderW = w - pad - (px + pw + gapX);
    const r = ph * 0.14;
    const x0 = px + pw * 0.1, x1 = px + pw * 0.9;
    const floor = (y) => y + ph * 0.72;

    /* ---- the scene, alive: a ball crossing and coming back ---- */
    const y1 = pad + 10;
    const bx = x0 + (x1 - x0) * along();
    ctx.save();
    ctx.beginPath(); ctx.rect(px, y1, pw, ph); ctx.clip();
    ctx.fillStyle = p.inset; ctx.fillRect(px, y1, pw, ph);
    line(ctx, px, floor(y1), px + pw, floor(y1), p.rule2);
    ctx.fillStyle = p.marker;
    ctx.beginPath(); ctx.arc(bx, floor(y1) - r, r, 0, Math.PI * 2); ctx.fill();
    /* the shutter, for the blink of the exposure: the scene goes white while
       the film is open, and the blink is longer for a longer time */
    /* while the shutter is open the ball's positions are kept, and the scene
       is washed white for exactly that long */
    if (state.shot && state.shot.open) {
      const t = SH_LADDER[state.shot.i];
      state.shot.trail.push(bx);
      if (performance.now() - state.shot.at >= t * 1000) state.shot.open = false;
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(px, y1, pw, ph);
    }
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(px) + 0.5, Math.round(y1) + 0.5, Math.round(pw), Math.round(ph));
    ctx.restore();
    label(ctx, 'THE SCENE', px, y1 - 10, p.muted, 9, 'left');

    /* ---- the photograph, once one has been taken ---- */
    const y2 = y1 + ph + gapY;
    ctx.save();
    ctx.beginPath(); ctx.rect(px, y2, pw, ph); ctx.clip();
    ctx.fillStyle = p.inset; ctx.fillRect(px, y2, pw, ph);
    if (state.shot) {
      line(ctx, px, floor(y2), px + pw, floor(y2), p.rule2);
      /* the photograph is every place the ball was while the shutter was
         open, each one faint, so a still ball is solid and a moving one is
         a smear - and the smear is only as long as the time really was */
      const tr = state.shot.trail;
      const n = Math.max(1, tr.length);
      tr.forEach((x) => {
        ctx.save();
        ctx.globalAlpha = Math.min(1, 1.2 / n + 0.03);
        ctx.fillStyle = p.marker;
        ctx.beginPath(); ctx.arc(x, floor(y2) - r, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      if (state.shot.open) {
        label(ctx, 'OPEN', px + pw - 8, y2 + 14, p.signal, 9, 'right');
      }
    } else {
      label(ctx, 'NOTHING TAKEN YET', px + pw / 2, y2 + ph / 2 + 3, p.muted, 9, 'center');
    }
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(px) + 0.5, Math.round(y2) + 0.5, Math.round(pw), Math.round(ph));
    ctx.restore();
    label(ctx, 'THE PHOTOGRAPH' + (state.shot ? ' · ' + shutterText(SH_LADDER[state.shot.i]).toUpperCase() : ''),
          px, y2 - 10, p.muted, 9, 'left');

    /* ---- the light: three rungs, and they follow the hand ----
       His second Keynote round of 16-09-2026, slide 18: "Show only 3, one
       above, selected shutter and one below. Show its halved and doubled. And
       switch when I switch the Shutter Speed from below." Eleven rungs made a
       table nobody read; three make a comparison, and the share is measured
       against the longest of the three so the doubling is visible. */
    /* the bars start 52 px in from the numbers, so that is taken off the room
       they have - otherwise the longest of the three runs off the stage */
    /* the bars end where the composition ends, not where the stage does */
    const bx0 = px + pw + gapX, bw = ladderW - 52;
    const lo = Math.max(0, Math.min(state.i - 1, SH_LADDER.length - 3));
    const shown = SH_LADDER.slice(lo, lo + 3);
    const rows = shown.length;
    const rowH = Math.min(52, (h - pad * 2 - 20) / rows);
    const top = (h - rowH * rows) / 2 + rowH / 2;
    /* HIS CORRECTION, 16-09-2026: "kendi orantılı uzunluklarında olması
       gerekiyor ki farkı anlayabilelim." The three are measured against a scale
       that does not move with them - two stops above the slowest one shown - so
       a fast speed draws three short bars and a slow one three long ones, and
       the doubling between the rungs is the same 1 : 2 : 4 at every position. */
    /* THE SCALE IS CONSTANT ACROSS THE THREE, AND THE MULTIPLE IS SAID.
       His word, 16-09-2026: "süre/pixel oranı sabit olmalı hepsinin" - so that
       the room can see how many times longer one is than another. One scale
       across the WHOLE ladder was tried first and cannot be read: 1/1000 to a
       second is a thousand to one, so at the fast end all three bars are a
       pixel wide. The scale is constant across the three that are shown - the
       doubling is exact, 1 : 2 : 4 - and the multiple is printed beside each
       bar, so the number is there as well as the length. */
    /* 1/1000 IS THE SMALLEST BAR THERE IS, AND EVERY STEP DOUBLES IT.
       His word, 16-09-2026: "1/1000'i gerçekten orantılı olarak en küçük bar
       yap, sonra 2 katı şeklinde artsın." So the bar is the time itself, in one
       unit: the fastest speed on the ladder draws the unit, 1/500 draws two of
       them, 1/250 four. The unit only shrinks when three bars at that size
       would not fit the room - and then all three shrink together, so what the
       room sees is still 1 : 2 : 4 exactly. */
    /* ONE SCALE FOR THE WHOLE LADDER, NOT FOR THE THREE ON SCREEN. His word,
       16-09-2026, at 1/8: "bozmaya başlıyor" - the unit shrank to fit the
       slow end, so the same time drew a different length depending on where
       the hand was. The slowest speed on the ladder, one second, is the full
       width, and every other speed is its true share of it: 1/2 is half,
       1/1000 a sliver. A thousand to one cannot be made bigger than that and
       stay honest; from 1/60 up the bars read comfortably. */
    const ref = SH_LADDER[SH_LADDER.length - 1];
    shown.forEach((v, k) => {
      const i = lo + k;
      const yy = top + k * rowH;
      const share = v / ref;
      const on = i === state.i;
      ctx.save();
      ctx.fillStyle = on ? p.signal : p.rule2;
      ctx.fillRect(bx0 + 52, yy - 5, Math.max(1.5, bw * share), 10);
      ctx.restore();
      label(ctx, shutterText(v), bx0 + 44, yy + 4, on ? p.signal : p.muted, 10, 'right');
      /* no multiple written beside the bar: the lengths are the statement */
    });
    label(ctx, 'THE LIGHT EACH ONE LETS IN', bx0, top - rowH * 0.8, p.muted, 9, 'left');
  }

  return { render: view.render };
}

window.modelShutter = modelShutter;
