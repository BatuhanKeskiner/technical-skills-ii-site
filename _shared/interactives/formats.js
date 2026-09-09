/* ============================================================
   A · Formats
   ------------------------------------------------------------
   Every camera the course names, drawn at ONE FIXED SCALE — the
   same scale for a Super 8 frame and an 8×10 sheet — centred on
   one point, with the image circle a lens must cover as a dashed
   ring. Up to four at once, each in its own colour.

   THIS IS BATU'S OWN MODULE, PORTED. He built it on 26–27 August
   in Cowork as a standalone page (`_notes/parked/format-module/`)
   and it was lost track of; the version written here on 08-09
   was mine, and it was wrong in every way he then named:

     "The larger ve inside it: A ve B olabilir."       → up to four, in colours
     "BIR KERE arttirip azaltmadigimiz bir sey icin    → chips, classified,
      neden arti var... o listeden secebiliyorduk."      not a stepper
     "Lens slider: HICBIR SEY YAPMIYOR."               → gone; Zoom moves the drawing
     "henuz ogretmedigimiz bir sey neden orada dursun" → no crop factor here
     "Analog ve Dijital ve Film... farkli adlari ve    → Digital · Film · Cinema,
      specleri var. Bunlari kullanan degisik modeller"   every one with its cameras

   The camera table below is his, verbatim: 25 bodies with their
   real image areas, the models that take them, pixel counts where
   they are digital, and the ratios each can actually deliver.
   ============================================================ */

/* WHICH WAY UP. Each frame is written the way the camera makes it, not the
   way a list looks tidy. 120 film runs 56 mm across, and how far the camera
   winds it decides the other side: a 6x7 winds 69 mm and comes out landscape,
   a 6x4.5 winds 41.5 mm and comes out PORTRAIT - which is why a 645 body has a
   rotating prism and a 6x7 does not. Instax Mini is the same case: 46 across,
   62 down. His eye caught the 6x4.5 lying on its side, 09-09-2026.
     4x5 and 8x10 are drawn landscape and stay that way: a view camera's back
   turns, so a sheet has no native side up. */
const CAMS = [
  { id:"phone", cls:"Smartphone",  kind:"digital", name:"Smartphone",        sub:"iPhone 16 Pro · Galaxy S24",     w:9.8,  h:7.3,  px:[4032,3024],   photo:"3:4 · 1:1 · 9:16", video:"16:9 · 9:16 vertical", also:"9:16 · 1:1 (crops)" },
  { id:"c1", cls:"Compact",     kind:"digital", name:"Compact 1″",        sub:"Sony RX100",                 w:13.2, h:8.8,  px:[5472,3648],   photo:"2:3 · 3:4 · 1:1 · 9:16", video:"16:9", also:"3:4 · 9:16 · 1:1 (crops)" },
  { id:"m43", cls:"Micro Four Thirds",    kind:"digital", name:"Micro Four Thirds", sub:"OM System OM-1 II · Panasonic GH6", w:17.3, h:13.0, px:[5184,3888],   photo:"3:4 · 2:3 · 1:1 · 9:16", video:"16:9 · 17:9", also:"2:3 · 9:16 · 1:1 (crops)" },
  { id:"apsc", cls:"APS-C",   kind:"digital", name:"APS-C",             sub:"Fujifilm X-T5 · Sony A6700",          w:23.5, h:15.6, px:[6192,4128],   photo:"2:3 · 3:4 · 1:1 · 9:16", video:"16:9", also:"9:16 · 1:1 (crops)" },
  { id:"ff", cls:"Full Frame · 35mm",     kind:"digital", name:"Full Frame",        sub:"Sony A7 IV · Nikon Z8",          w:36,   h:24,   px:[7008,4672],   photo:"2:3 · 3:4 · 1:1 · 9:16", video:"16:9", also:"3:4 · 9:16 · 1:1 (crops)" },
  { id:"mfd", cls:"Medium Format",    kind:"digital", name:"Medium Format Digital",     sub:"Hasselblad X2D · Fujifilm GFX 100 II", w:44, h:33, px:[11656,8742], photo:"3:4 · 2:3 · 1:1 · 4:5 · 5:7 · 24:65", video:"16:9 · 17:9", also:"2:3 · 1:1 · 24:65 (crops)" },
  { id:"mfd2", cls:"Medium Format",   kind:"digital", name:"Medium Format Digital 645", sub:"Phase One IQ4 150MP",            w:53.4, h:40,   px:[14204,10652], photo:"3:4 · 2:3 · 1:1", video:"—", also:"2:3 · 1:1 (crops)" },
  { id:"s8",     cls:"Cinema film · Super 8",  kind:"cinema", name:"Super 8",          sub:"Braun Nizo S80",   w:5.79,  h:4.01,  also:"—" },
  { id:"16",     cls:"Cinema film · 16 mm",    kind:"cinema", name:"16 mm",            sub:"Bolex H16 · Arriflex 16",       w:10.26, h:7.49,  also:"—" },
  { id:"35a",    cls:"Cinema film · 35 mm",    kind:"cinema", name:"35 mm Academy",    sub:"ARRICAM LT · Panaflex (4-perf)",   w:22.0,  h:16.0,  also:"1.85:1 · 2.39:1 (masks)" },
  { id:"s35",    cls:"Cinema film · Super 35", kind:"cinema", name:"Super 35",         sub:"ARRICAM LT · Panaflex (full aperture)", w:24.89, h:18.66, also:"1.85:1 · 2.39:1 (masks)" },
  { id:"65",     cls:"Cinema film · 65 mm",    kind:"cinema", name:"65 mm",            sub:"Panavision System 65 · 5-perf",        w:52.48, h:23.01, also:"—" },
  { id:"imax",   cls:"Cinema film · IMAX 15/70", kind:"cinema", name:"IMAX 15/70",     sub:"IMAX MSM 9802 · MKIV — Nolan: Oppenheimer, Dunkirk", w:70.41, h:52.63, also:"—" },
  { id:"alexa",  cls:"Digital cinema · Super 35", kind:"cinema", name:"ARRI Alexa 35", sub:"4.6K open gate",               w:27.99, h:19.22, px:[4608,3164], photo:"—", video:"3:2 open gate · 16:9 · 2.39:1 anamorphic", also:"—" },
  { id:"half", cls:"35mm half-frame",   kind:"film",    name:"35mm Half-frame",  sub:"Pentax 17 · Olympus Pen",        w:24,   h:18,   also:"—" },
  { id:"135", cls:"35mm",    kind:"film",    name:"35mm",             sub:"Leica M6 · Nikon FM2 · Canon AE-1", w:36, h:24,   also:"24 × 65 panoramic (XPan)" },
  { id:"645", cls:"Medium Format",    kind:"film",    name:"Medium Format 6×4.5",             sub:"Mamiya 645 Pro · Pentax 645N",       w:41.5, h:56,   also:"—" },
  { id:"66", cls:"Medium Format",     kind:"film",    name:"Medium Format 6×6",               sub:"Hasselblad 500C/M · Rolleiflex", w:56,   h:56,   also:"—" },
  { id:"67", cls:"Medium Format",     kind:"film",    name:"Medium Format 6×7",               sub:"Mamiya 7 · Pentax 67",        w:69,   h:56,   also:"—" },
  { id:"69", cls:"Medium Format",     kind:"film",    name:"Medium Format 6×9",               sub:"Fujifilm GW690",                 w:84,   h:56,   also:"6×12 · 6×17 backs" },
  { id:"instax", cls:"Instant", kind:"film",    name:"Instant",           sub:"Instax Mini 12",                 w:46,   h:62,   also:"Instax Wide 99 × 62", lpFixed:12 },
  { id:"sx70", cls:"Instant",   kind:"film",    name:"Instant",           sub:"Polaroid 636 CloseUp · SX-70",           w:79,   h:79,   also:"—", lpFixed:12 },
  { id:"45", cls:"Large Format",     kind:"film",    name:"Large Format 4″×5″",              sub:"Sinar P2 · Intrepid",            w:120,  h:95,   also:"— (movements instead)", lf:true },
  { id:"810", cls:"Large Format",    kind:"film",    name:"Large Format 8″×10″",             sub:"Arca-Swiss F-Metric · Deardorff",      w:245,  h:195,  also:"— (movements instead)", lf:true },
];

/* THE BODY NAMED IS THE BODY IN THE PICTURE. His note of 09-09-2026:
   "uygun kameralarin gorsellerine gore bilgileri de degistir" - so where the
   photograph he found shows a different body from the one written first, the
   writing moved, not the photograph. Braun Nizo S80 for Super 8, a Polaroid
   636 CloseUp, an OM-1 II, a Mamiya 645 Pro, an ARRICAM LT, a Panavision
   System 65, a Hasselblad X2D, and an Arca-Swiss F-Metric for the 8x10 -
   which is a monorail and not the Deardorff that was written there. F-Metric
   turned out to be the model and not a shop's code; he named it.

   ONE PHOTOGRAPH OF EACH BODY. Twenty-three of them are his, found and put
   into `art/cams/` on 09-09-2026 after the Commons ones turned out to be
   "cok kotu"; the Commons originals are kept beside them in
   `_commons-originals/` in case one is wanted back.
   A `by` and a `lic` are printed under the picture when they are there - the
   site credits every photograph where it is shown (W5). His carry neither,
   because they are manufacturer and press pictures of products and there is
   no photographer to name; the one that is still from Commons keeps its
   author and its licence. */
const CAM_PIX = {
  'phone': { f: 'phone.jpg' },
  'c1': { f: 'c1.png' },
  'm43': { f: 'm43.jpg' },
  'apsc': { f: 'apsc.jpg' },
  'ff': { f: 'ff.png' },
  'mfd': { f: 'mfd.jpg' },
  'mfd2': { f: 'mfd2.jpg', by: 'Esquilo', lic: 'CC BY-SA 3.0' },
  's8': { f: 's8.jpg' },
  '16': { f: '16.jpg' },
  '35a': { f: '35a.jpg' },
  's35': { f: 's35.jpg' },
  '65': { f: '65.jpg' },
  'imax': { f: 'imax.jpg' },
  'alexa': { f: 'alexa.png' },
  'half': { f: 'half.jpg' },
  '135': { f: '135.jpg' },
  '645': { f: '645.jpg' },
  '66': { f: '66.jpg' },
  '67': { f: '67.jpg' },
  '69': { f: '69.jpg' },
  'instax': { f: 'instax.jpg' },
  'sx70': { f: 'sx70.jpg' },
  '45': { f: '45.jpg' },
  '810': { f: '810.jpg' },
};
const CAM_DIR = '../_shared/interactives/art/cams/';

const FF_DIAG = Math.hypot(36, 24);
const fmDiag = (f) => Math.hypot(f.w, f.h);
/* Ratios are written short side first (2:3, 4:5) — the film-format convention —
   so they read the same whichever way the camera is held. His function. */
function fmRatio(w, h) {
  const r = Math.max(w, h) / Math.min(w, h);
  const known = [[1, '1:1'], [69 / 56, '6:7'], [1.25, '4:5'], [4 / 3, '3:4'],
                 [56 / 41.5, '3:4'], [Math.SQRT2, '1:\u221A2'], [1.5, '2:3'],
                 [16 / 9, '9:16'], [2.39, '1:2.39']];
  for (const [k, s] of known) if (Math.abs(r - k) < 0.016) return s;
  return '1:' + r.toFixed(2);
}
const fmFilmMP = (c, lp) => c.w * c.h * (2 * lp) * (2 * lp) / 1e6;
const FM_KINDS = [
  { id: 'digital', name: 'Digital' },
  { id: 'film', name: 'Film' },
  { id: 'cinema', name: 'Cinema' },
];
/* four selections, four colours, in the order they were picked */
const FM_SEL = ['#4FA3FF', '#F0C25C', '#A9D97F', '#E39AD6'];

function mountFormats(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide fm-stage');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  /* NOT "Formats" ANY MORE. His note of 09-09-2026: "Bu aslinda sensor /
     film size enstrumani olacak" - the page it sits on is already called
     Sensor / Film Size, and the instrument was called something else. */
  head.append(el('span', 'ts-name', 'Sensor / Film Size'),
              el('span', 'ts-sub', 'how much surface the picture lands on'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  /* the page may open on a comparison of its own */
  const start = (fig.dataset.cams || 'ff').split(',').filter(Boolean);
  /* A COLOUR BELONGS TO ITS CAMERA UNTIL THAT CAMERA IS LET GO. It used to be
     the position in the list, so dropping the first one re-coloured every
     other one and the drawing you were looking at changed colour under you.
     And a fifth press used to push the oldest out silently: now four is a
     wall, and to add a camera you let one go. His note, 09-09-2026:
     "secilen renk, kamera icin ayni kalsin ... Yani toggle on-off." */
  const slot = {};                      /* camera id → 0..3 */
  const takeSlot = (id) => {
    if (slot[id] != null) return true;
    for (let i = 0; i < FM_SEL.length; i++) {
      if (!Object.values(slot).includes(i)) { slot[id] = i; return true; }
    }
    return false;                       /* all four are held */
  };
  const state = { sel: [], zoom: 0 };
  start.slice(0, 4).forEach((id) => { if (takeSlot(id)) state.sel.push(id); });
  const camById = (id) => CAMS.find((c) => c.id === id) || CAMS[4];
  const selColour = (id) => FM_SEL[slot[id] != null ? slot[id] : 0];

  /* ---- the bench: the classified list, on the stage -------------------
     Digital, Film and Cinema, each camera with the bodies that take it.
     Picking adds to the comparison; picking again removes it; a fifth push
     drops the oldest. Four is the ceiling because four colours are the most
     a room can hold apart. */
  const row = el('div', 'fm-row');
  const bench = el('div', 'fm-bench');
  const picBox = el('div', 'fm-pic');
  row.append(bench, picBox);
  stage.append(row);

  const btns = {};
  FM_KINDS.forEach((k) => {
    bench.append(el('div', 'fm-h', k.name));
    CAMS.filter((c) => c.kind === k.id).forEach((c) => {
      const b = el('button', 'fm-i');
      b.type = 'button';
      b.append(el('span', 'fm-dot'));
      b.append(el('span', 'fm-n', c.name),
               el('span', 'fm-s', c.sub.split(' · ')[0]));
      b.addEventListener('mouseenter', () => showShot(c, b));
      b.addEventListener('focus', () => showShot(c, b));
      b.addEventListener('mouseleave', () => { shotBox.style.display = 'none'; });
      b.addEventListener('blur', () => { shotBox.style.display = 'none'; });
      b.addEventListener('click', () => {
        const i = state.sel.indexOf(c.id);
        if (i >= 0) {
          if (state.sel.length > 1) { state.sel.splice(i, 1); delete slot[c.id]; }
        } else if (takeSlot(c.id)) {
          state.sel.push(c.id);
        }
        sync();
      });
      bench.append(b);
      btns[c.id] = b;
    });
  });

  /* THE PHOTOGRAPHS, ON HOVER. They were square cards in the lower right; his
     note of 09-09-2026 moved them: "Bu gorselleri soldaki barin ustunde
     mouse'u gezdirdigimizde bir pencere icinde gorelim." A window that opens
     under the hand and closes when it leaves - the drawing keeps the stage,
     and the bodies are there when you go looking for one. */
  const PIX = {};
  function pic(id) {
    const shot = CAM_PIX[id];
    if (!shot) return null;
    if (!PIX[id]) PIX[id] = loadImage(CAM_DIR + shot.f, () => view.render());
    return PIX[id].ready ? PIX[id] : null;
  }
  const shotBox = el('div', 'fm-shot');
  const shotImg = el('img');
  const shotCap = el('div', 'fm-shot-c');
  shotBox.append(shotImg, shotCap);
  picBox.append(shotBox);
  function showShot(c, row) {
    const sh = CAM_PIX[c.id];
    if (!sh) { shotBox.style.display = 'none'; return; }
    shotImg.src = CAM_DIR + sh.f;
    shotCap.textContent = (c.name + ' · ' + c.sub.split(' · ')[0]
                           + (sh.by ? ' — ' + sh.by + ' · ' + sh.lic : '')).toUpperCase();
    const rr = row.getBoundingClientRect(), pr = picBox.getBoundingClientRect();
    shotBox.style.display = 'block';
    const top = Math.max(8, Math.min(pr.height - shotBox.offsetHeight - 8,
                                     rr.top - pr.top - 40));
    shotBox.style.top = top + 'px';
  }

  const coin = loadImage('../02-composition-format/assets/b1-euro-coin.png',
                        () => view.render());

  const view = canvas(picBox, draw);

  /* ONE CONTROL, AND IT MOVES THE DRAWING. At ×1 the 8×10 sheet fills the
     stage and a phone sensor is a speck, which is the true relation and the
     reason the instrument exists; the zoom is how you then go and look at the
     speck without the scale ever becoming a lie. */
  const fZoom = slider(controls, {
    label: 'Zoom', min: 0, max: 100, step: 1, value: 0, cls: 'one',
    format: (v) => {
      const z = Math.pow(25, v / 100);
      return '×' + (z < 10 ? z.toFixed(1) : z.toFixed(0));
    },
  });
  fZoom.addEventListener('input', () => { state.zoom = +fZoom.value; view.render(); });

  /* THE THREE GATES (O1 O2 O3), ANSWERED — two cells.
     Image area: nobody sets it, the drawing shows two rectangles but states no
     ratio as a number, and "thirteen times the area" is what a student
     repeats. Enlargement: nobody sets it, nothing in the drawing is a print,
     and it is the argument for format — everything on the negative is grown
     with it, grain and pixel and focus error alike.
     Crop factor is NOT here. The course has not taught it (A5), and it has
     its own page later; a number from a later week is a distraction wearing a
     number's clothes (O8). Image circle is the dashed ring, drawn. The ratio
     and the millimetres are on each frame's own label. */
  const out = readout(fig, [
    { id: 'area', key: 'Image area', cls: 'hi' },
    { id: 'enl', key: 'To a 30 cm print' },
  ]);

  fsButton(stage, fig);

  function sync() {
    const full = state.sel.length >= FM_SEL.length;
    Object.keys(btns).forEach((id) => {
      const on = state.sel.indexOf(id) >= 0;
      btns[id].setAttribute('aria-pressed', on ? 'true' : 'false');
      btns[id].style.setProperty('--c', on ? selColour(id) : 'transparent');
      /* with four held, the rest are not pressable and say so (C8) */
      btns[id].disabled = full && !on;
      btns[id].classList.toggle('off', full && !on);
    });
    /* the readouts follow the last one picked, which is the one the hand just
       moved to and therefore the one being talked about */
    const c = camById(state.sel[state.sel.length - 1]);
    const area = c.w * c.h;
    /* THE COMPARISON IS BETWEEN TWO THINGS, AND ONLY THEN. It used to read
       "×0.083 full frame" whatever was selected, which compares a phone to a
       camera nobody has chosen. His note of 09-09-2026: "yalnizca ikili secim
       yapildiginda bir anlam ifade ediyor ... 10x bigger sensor size gibi bir
       veri yeterli. (Buyuk olan kucuk olana gore)". The cell keeps its place
       either way (S18); it is the sentence that changes. */
    let line = Math.round(area).toLocaleString('en') + '<span class="u">mm²</span>';
    if (state.sel.length === 2) {
      const a = camById(state.sel[0]), b = camById(state.sel[1]);
      const big = a.w * a.h >= b.w * b.h ? a : b;
      const sml = big === a ? b : a;
      const k = (big.w * big.h) / (sml.w * sml.h);
      line = Math.round(big.w * big.h).toLocaleString('en')
        + '<span class="u">mm²</span> · ×' + (k >= 10 ? k.toFixed(0) : k.toFixed(1))
        + ' <span class="u">bigger than ' + sml.name + '</span>';
    }
    out.area.innerHTML = line;
    out.enl.innerHTML = '×' + (300 / c.w).toFixed(1);
    view.render();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const pad = 22, foot = 26;
    const sel = state.sel.map(camById);

    /* ONE FIXED SCALE, SET BY THE LARGEST FRAME IN THE COURSE — not by what
       happens to be selected. Change the selection and nothing resizes; that
       is what makes it a comparison rather than two pictures. */
    const BIG = CAMS.find((x) => x.id === '810');
    const zoom = Math.pow(25, state.zoom / 100);
    const s = Math.min((h - pad * 2 - foot) / BIG.h, (w - pad * 2) / BIG.w) * zoom;
    const cx = w / 2, cy = (h - foot) / 2;

    const ys = [];
    const place = (y) => {
      let yy = y;
      for (let g = 0; g < 14; g++) {
        if (!ys.some((v) => Math.abs(v - yy) < 15)) break;
        yy -= 15;
      }
      ys.push(yy); return yy;
    };

    /* largest first, so the small ones land on top of the big ones */
    sel.slice().sort((a, b) => b.w * b.h - a.w * a.h).forEach((c) => {
      const col = selColour(c.id), fw = c.w * s, fh = c.h * s, R = fmDiag(c) / 2 * s;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, w, h - foot); ctx.clip();
      /* the circle a lens for this format must cover */
      ctx.strokeStyle = col; ctx.globalAlpha = 0.34; ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = col; ctx.globalAlpha = 0.16;
      ctx.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
      ctx.restore();
      const ly = place(Math.max(18, cy - fh / 2 - 7));
      const lx = Math.min(cx + fw / 2, w - 12);
      label(ctx, c.name + ' · ' + c.sub.split(' · ')[0] + ' · '
            + c.w + ' × ' + c.h + ' mm · ' + fmRatio(c.w, c.h),
            lx, ly, col, 11, 'right');
    });

    /* the scale bar: without it these are shapes, with it they are sizes.
       It runs from the left of the foot, because the right of the foot is
       under the cameras and a bar and a photographer's name cannot share it. */
    const bar = [50, 20, 10, 5, 2, 1].find((mm) => mm * s <= 160) || 1;
    const coinW = coin.ready ? Math.min(EURO_MM * s, (h - foot) * 0.55) : 0;
    const sbx = coinW > 12 ? 22 + coinW + 16 : 16, sby = h - foot + 4;
    line(ctx, sbx, sby, sbx + bar * s, sby, p.muted);
    line(ctx, sbx, sby - 4, sbx, sby + 4, p.muted);
    line(ctx, sbx + bar * s, sby - 4, sbx + bar * s, sby + 4, p.muted);
    label(ctx, bar + ' MM', sbx + bar * s / 2, sby - 7, p.muted, 9, 'center');
    label(ctx, 'ONE FIXED SCALE — SUPER 8 AND 8×10 DRAWN THE SAME WAY',
          sbx + bar * s + 18, sby, p.muted, 9);

    /* A ONE EURO COIN, AT THE SAME SCALE AS EVERYTHING ELSE. 23.25 mm across,
       which is a thing every student has in a pocket - his note of
       09-09-2026: "Assets'e 1 euro koydum o legend'in ustune coini de koy.
       Referans olarak kullanabilelim." A scale bar says how long a millimetre
       is; a coin says how big that is. It grows with the zoom like everything
       else, and steps aside once it is taller than the room it is standing
       in. */
    if (coin.ready) {
      const D = EURO_MM * s;
      /* no caption under it: the coin says "1 EURO" on its own face, and the
         bar beside it says how many millimetres that is (W13) */
      if (D > 12 && D < (h - foot) * 0.55) {
        const cym = h - foot - 12 - D / 2;
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.drawImage(coin.img, 22, cym - D / 2, D, D);
        ctx.restore();
      }
    }
  }

  sync();
  return { render: view.render };
}

window.mountFormats = mountFormats;
