/* ============================================================
   A4.1 · Colour Temperature
   ------------------------------------------------------------
   A REAL PHOTOGRAPH, DEVELOPED SEVENTEEN TIMES. His own test
   still-life - a ColorChecker, a grey diffuser, a red bottle, a
   blue one, a green card and a yellow one, all on a neutral grey
   sofa: every kind of surface white balance is judged on, and a
   chart to check it against. Sony ARW, 43 MB, shot for exactly
   this. Taken through Core Image's RAW pipeline at every balance
   from 2000 K to 10000 K in five hundreds, and written out as
   seventeen JPEGs. Moving the slider does not tint a picture; it
   shows the picture the camera would have made had the white
   balance been set there.

   His ask, 09-09-2026: "Colour Temperature için önce görsel bir
   örnek istiyorum. Elimde RAW dosyası var sen onu ayrı
   temperaturelarda step step export alıp sonuçları o map içinde
   dağıtabilir misin?"

   The light in the photograph is the light that was in the room —
   about 6100 K, which is what the camera itself measured — and it
   does not move, because a photograph's light cannot be changed
   afterwards. What moves is the camera. Set it below the light
   and the picture goes blue; above it and the picture goes warm.
   That is the whole of white balance and now it is a photograph
   rather than an argument.

     _shared/tools/raw-wb.swift  builds the ladder from any RAW
   ============================================================ */

/* the ladder on disk, and the temperature the room actually was */
const WB_K = [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000,
              6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000];
const WB_LIGHT = 6100;   /* what the camera measured in the room */
const WB_SRC = '../_shared/interactives/art/wb/';

/* what a camera calls these settings, and what is actually that colour */
const PRESETS = [
  { name: 'Tungsten', cam: 3200 },
  { name: 'Fluorescent', cam: 4000 },
  { name: 'Daylight', cam: 5500 },
  { name: 'Cloudy', cam: 6000 },
  { name: 'Shade', cam: 7500 },
];

function mountKelvin(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  /* A NAME ON THE INSTRUMENT. In full screen the page's own heading is gone
     and there is nothing on screen saying what this is. IG-01 02: the head is
     the name and a three-noun eyebrow. Added to every instrument 08-09-2026 -
     five of eleven had one, and on a wall the other six were anonymous. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Colour Temperature'),
              el('span', 'ts-sub', 'one raw · seventeen developments'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const state = { cam: +(fig.dataset.cam || 3200) };
  const view = canvas(stage, draw);

  /* the seventeen frames, held once and drawn from */
  const frames = {};
  WB_K.forEach((k) => {
    const i = new Image();
    i.onload = () => view.render();
    i.src = WB_SRC + 'wb-' + String(k).padStart(5, '0') + '.jpg';
    frames[k] = i;
  });

  const fCam = slider(controls, {
    label: 'Camera white balance', min: 2000, max: 10000, step: 50,
    value: state.cam, unit: ' K', cls: 'digital',
  });

  const group = states(controls, {
    label: 'What the camera calls it', cls: 'span2',
    items: PRESETS.map((x) => x.name),
    onChange: (i) => {
      state.cam = PRESETS[i].cam;
      fCam.value = state.cam; fCam._sync();
      compute(); view.render();
    },
  });

  /* THE THREE GATES (O1 O2 O3), ANSWERED — four cells went to one.
     Light and Camera are both SET, by the two sliders in the strip, and both
     were drawn a second time here in their own colour. G1 removes both.
     Result said the picture was warm or cool while the picture was warm or
     cool. IG-02 05 settles it in one line: "No readout says warm — the
     picture is warm (G2)."
     Shift stays, and is the only one that passes all three: nobody sets it,
     nothing in the plate states the gap as a quantity, and the gap in mireds
     is what a photographer corrects by. */
  const out = readout(fig, [
    { id: 'shift', key: 'Shift', cls: 'delta hi' },
  ], 'one');

  fsButton(stage, fig);

  fCam.addEventListener('input', () => { state.cam = +fCam.value; compute(); view.render(); });

  function pull() {
    compute();
    /* THE MARK IS ON THE PRESET YOU ARE STANDING ON, not the one you pressed
       last. It used to stay lit on Tungsten room however far the sliders had
       since been dragged from it - a control asserting a state the instrument
       was no longer in, and a press that would have done something dressed as
       one that would not. It follows the sliders now: the preset whose three
       values are on them is marked and, being already applied, is not
       pressable; off all of them, nothing is marked and all four are live. */
    group.select(PRESETS.findIndex((q) => q.cam === state.cam));
  }

  /* mireds are the perceptually even unit for a white-balance error */
  const mired = (k) => 1e6 / k;

  function compute() {
    const d = mired(WB_LIGHT) - mired(state.cam);
    group.select(PRESETS.findIndex((q) => q.cam === state.cam));
    out.shift.innerHTML = (d > 0 ? '+' : '') + d.toFixed(0) + '<span class="u">mired</span>';
    out.shift.classList.toggle('up', d < -4);
    out.shift.classList.toggle('down', d > 4);
  }

  /* ---- the picture ----------------------------------------------------
     THE FRAME NEAREST THE SETTING, and the next one blended over it, so the
     slider moves continuously through pictures that are each real. Nothing
     here tints anything: every frame came out of the RAW developer at the
     temperature it is named after. */
  function nearest(k) {
    let lo = WB_K[0], hi = WB_K[WB_K.length - 1];
    for (const v of WB_K) { if (v <= k) lo = v; }
    for (let n = WB_K.length - 1; n >= 0; n--) { if (WB_K[n] >= k) hi = WB_K[n]; }
    const t = hi === lo ? 0 : (k - lo) / (hi - lo);
    return { lo, hi, t };
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const scaleH = 72;
    const sceneH = h - scaleH;
    const { lo, hi, t } = nearest(state.cam);
    const a = frames[lo], b = frames[hi];
    if (a && a.complete && a.naturalWidth) {
      const R = frameIn(w - 40, sceneH - 30, a.naturalWidth / a.naturalHeight);
      const x = 20 + R.x, y = 15 + R.y;
      ctx.drawImage(a, x, y, R.w, R.h);
      if (b && b !== a && b.complete && b.naturalWidth && t > 0) {
        ctx.save(); ctx.globalAlpha = t;
        ctx.drawImage(b, x, y, R.w, R.h);
        ctx.restore();
      }
      ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5,
                     Math.round(R.w) - 1, Math.round(R.h) - 1);
      /* WHAT THE PICTURE IS, said on the picture, because the site credits
         every photograph where it is shown */
      label(ctx, 'DEVELOPED FROM ONE RAW AT ' + state.cam + ' K · THE ROOM WAS '
            + WB_LIGHT + ' K', x + 8, y + R.h - 9, 'rgba(255,255,255,0.66)', 9);
    } else {
      label(ctx, 'DEVELOPING THE FRAMES…', 24, 30, p.muted, 10);
    }
    line(ctx, 0, sceneH, w, sceneH, p.rule);
    drawScale(ctx, w, sceneH, scaleH);
  }

  function drawScale(ctx, w, top, h) {
    const padL = 44, padR = 44;
    const y = top + 18;
    const bw = w - padL - padR;
    const kMin = 2000, kMax = 10000;
    const x = (k) => padL + ((k - kMin) / (kMax - kMin)) * bw;

    for (let i = 0; i <= bw; i += 2) {
      const k = kMin + (i / bw) * (kMax - kMin);
      const c = kelvinRGB(k);
      ctx.fillStyle = 'rgb(' + c.map(Math.round).join(',') + ')';
      ctx.fillRect(padL + i, y, 2.5, 16);
    }
    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(padL) + 0.5, Math.round(y) + 0.5, Math.round(bw), 16);

    [[WB_LIGHT, p.film, 'THE ROOM'], [state.cam, p.digital, 'CAMERA']].forEach(([k, col, name], i) => {
      const mx = x(k);
      line(ctx, mx, y - 6, mx, y + 22, col);
      ctx.fillStyle = col;
      ctx.fillRect(mx - 3, i === 0 ? y - 9 : y + 19, 6, 4);
      label(ctx, name, mx, i === 0 ? y - 13 : y + 34, col, 9, 'center');
    });

    label(ctx, kMin + ' K', padL, y + 30, p.muted, 9);
    label(ctx, kMax + ' K', padL + bw, y + 30, p.muted, 9, 'right');
  }

  pull();
  return { render: view.render };
}

window.mountKelvin = mountKelvin;
