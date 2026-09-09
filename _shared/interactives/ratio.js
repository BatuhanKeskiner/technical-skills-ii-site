/* ============================================================
   A · Aspect Ratio
   ------------------------------------------------------------
   The shape of the frame, with no size attached, and — the part
   that makes it teachable — WHERE EACH SHAPE LIVES: the cameras
   that take it, the screens that show it, the places it is
   delivered to. Eleven shapes, and the studio drawn inside the
   chosen one so a ratio is a picture rather than a rectangle.

   BATU'S OWN MODULE, PORTED (Fig. 1 of the 26-08 Cowork page).
   The version written here on 08-09 was mine: nine empty
   wireframes with a number in the middle and nothing to look at.

   Ratios are written short side first — 2:3, 4:5 — the way film
   formats are named, so they read the same whichever way the
   camera is held, and Held is a control rather than a second
   list.
   ============================================================ */

const RATIOS = [
  { id:"1",    label:"1:1",    r:1,          aka:"",
    cameras:"Hasselblad 500C/M · Rolleiflex 2.8F · Polaroid SX-70", screens:"—", social:"Instagram square post · album art · Spotify covers", g:"photo" },
  { id:"45",   label:"4:5",    r:1.25,       aka:"",
    cameras:"Sinar P2 · Intrepid 4×5 · Deardorff 8×10", screens:"5:4 monitors (Eizo 1280×1024)", social:"Instagram portrait post — the tallest allowed · 8×10″ prints", g:"photo" },
  { id:"34",   label:"3:4",    r:4/3,        aka:"",
    cameras:"iPhone 16 Pro · OM System OM-1 · Panasonic GH6 · Fujifilm GFX 100 II · Hasselblad X2D · Pentax 645N", screens:"iPad · old SDTV and 1024×768 monitors", social:"Instagram 3:4 portrait · Instax prints", g:"photo" },
  { id:"67",   label:"6:7",    r:69/56,      aka:"",
    cameras:"Mamiya RZ67 · Pentax 67 · Fujifilm GF670", screens:"—", social:"almost the shape of 8×10″ paper", g:"photo" },
  { id:"23",   label:"2:3",    r:1.5,        aka:"",
    cameras:"Leica M6 · Nikon FM2 · Canon AE-1 · Sony A7 IV · Canon R5 · Nikon Z8 · Fujifilm X-T5", screens:"—", social:"editorial and stock · 10×15 cm / 4×6″ prints", g:"photo" },
  { id:"617",  label:"6×17",   r:17/6,       aka:"",
    cameras:"Fujifilm G617 · Linhof Technorama 617", screens:"—", social:"panoramas", g:"photo" },
  { id:"1610", label:"10:16",  r:1.6,        aka:"",
    cameras:"—", screens:"MacBook Pro / Air · Dell XPS · most laptop displays", social:"—", g:"screen" },
  { id:"916",  label:"9:16",   r:16/9,       aka:"",
    cameras:"Sony A7 IV · Canon R5 · iPhone 16 Pro · GoPro Hero 12 · DJI Pocket 3", screens:"iPhone / Android screens · HDTV · 4K UHD · most monitors", social:"YouTube · Reels · TikTok · Stories (vertical)", g:"screen" },
  { id:"185",  label:"1:1.85", r:1.85,       aka:"",
    cameras:"ARRI Alexa 35 · RED V-Raptor · Sony Venice", screens:"cinema — US widescreen", social:"feature films · streaming originals (often 2:1)", g:"cinema" },
  { id:"239",  label:"1:2.39", r:2.39,       aka:"",
    cameras:"ARRI Alexa 35 · Panavision Millennium DXL", screens:"cinema — CinemaScope", social:"feature films · the “cinematic” crop on YouTube", g:"cinema" },
  { id:"a",    label:"A4",     r:Math.SQRT2, aka:"1:1.414",
    cameras:"—", screens:"—", social:"A4 · A3 · A2 posters, flyers, books — every A size is the same shape", g:"paper" },
];

function mountRatio(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide fm-stage');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  /* His words, 09-09-2026: "shape, orientation, where it lives" asiri
     manasiz ... "Frame, Format, Orientation" daha iyi. */
  head.append(el('span', 'ts-name', 'Aspect Ratio'),
              el('span', 'ts-sub', 'frame · format · orientation'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { id: fig.dataset.ratio || '23', portrait: false, scene: 0 };
  const cur = () => RATIOS.find((r) => r.id === state.id) || RATIOS[4];

  /* ELEVEN SHAPES ARE A LIST, NOT A ROW OF CHIPS. Grouped by where they come
     from - a photographic shape, a sheet of paper, a screen, a cinema - which
     is the classification that makes them legible (C19); eleven chips in the
     strip wrapped it onto two rows and took the stage under its share. */
  const row = el('div', 'fm-row');
  const bench = el('div', 'fm-bench rt-bench');
  const picBox = el('div', 'fm-pic');
  row.append(bench, picBox);
  stage.append(row);

  /* Photographic, then the screens, then the cinema, and the sheet of paper
     last - his note of 09-09-2026: "bir de A4'u en alta koy." It is the one
     shape in the list that no camera and no screen has; it belongs at the end
     of the list, not in the middle of the cameras. */
  const RG = [['photo', 'Photographic'], ['screen', 'Screens'],
              ['cinema', 'Cinema'], ['paper', 'Paper']];
  const btns = {};
  RG.forEach(([g, name]) => {
    bench.append(el('div', 'fm-h', name));
    RATIOS.filter((r) => r.g === g).forEach((r) => {
      const b = el('button', 'fm-i');
      b.type = 'button';
      /* NO SECOND COLUMN. It carried "5:4" beside 4:5 and "2.7:1" beside
         24:65 - the same number written backwards, which a reader can do in
         their head. His note, 09-09-2026: "zaten terse cevirebiliyoruz.
         Ekstra hicbir bilgi vermiyor." A4 keeps its 1:1.414, because that is
         not the name reversed, it is the proportion the name hides. */
      b.append(el('span', 'fm-dot'), el('span', 'fm-n', r.label),
               el('span', 'fm-s', r.aka || ''));
      b.addEventListener('click', () => { state.id = r.id; sync(); });
      bench.append(b);
      btns[r.id] = b;
    });
  });

  const view = canvas(picBox, draw);

  /* TWO REAL PHOTOGRAPHS, on his notes of 09-09-2026: "Aspect Ratio'ya da bir
     fotograf koyalim gercek" and then "ikinci sahne olarak da onu ekle".
     A crop is only a loss if there is something in the part it takes, so both
     are scenes with something happening at every edge: a film set with its
     crew, and a courtyard passage where the walls and the plants are the
     picture as much as the lit door at the end. One shape at a time on the
     one picture; two pictures because a shape does a different thing to a
     wide room than to a deep one. */
  const SCENES = [
    { name: 'Film set', src: '../02-composition-format/assets/a3-film-set.jpg' },
    { name: 'Courtyard', src: '../02-composition-format/assets/b1-courtyard.jpg' },
  ];
  const PLATES = SCENES.map((sc) => {
    const im = new Image();
    im.onload = () => view.render();
    im.src = sc.src;
    return im;
  });
  const plateNow = () => PLATES[state.scene];

  states(controls, {
    label: 'Held', cls: 'one', items: ['Landscape', 'Portrait'],
    onChange: (i) => { state.portrait = i === 1; view.render(); },
  });
  states(controls, {
    label: 'Scene', cls: 'one', items: SCENES.map((sc) => sc.name),
    onChange: (i) => { state.scene = i; view.render(); },
  });

  /* WHERE THIS SHAPE LIVES — THE READOUT, NOT A BAR ON THE STAGE.
     It was drawn on the stage foot, in a black band the full width of the
     picture, and most of that band was empty. His note of 09-09-2026: "Bu
     bari kaldir. Bu bilgileri asagiya tasi." So the stage is the picture and
     nothing else, and the three answers are three readout cells - which is
     what they are: nobody sets them, they follow from the shape, and they are
     the reason the shape exists. A shape that lives on no screen says so. */
  const out = readout(fig, [
    { id: 'cameras', key: 'Cameras', cls: 'list', wide: true },
    { id: 'screens', key: 'Screens', cls: 'list' },
    { id: 'social', key: 'Delivered', cls: 'list' },
  ]);

  fsButton(stage, fig);

  function sync() {
    Object.keys(btns).forEach((id) => {
      btns[id].setAttribute('aria-pressed', id === state.id ? 'true' : 'false');
      btns[id].style.setProperty('--c', id === state.id ? p.marker : 'transparent');
    });
    const r = cur();
    out.cameras.textContent = r.cameras;
    out.screens.textContent = r.screens;
    out.social.textContent = r.social;
    view.render();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);
    const r = cur(), pad = 26, foot = 0;
    const q = state.portrait ? 1 / r.r : r.r;          /* width over height */

    /* THE PICTURE STAYS AND ONLY THE FRAME MOVES. It used to re-render the
       scene into each shape, so changing the ratio changed the photograph as
       well and you could not see what the shape was doing. His note,
       09-09-2026: "Görüntü sabit kalsın arkadaki sadece çerçevesi değişsin."
       So the room is drawn ONCE, at one size, and every ratio is the largest
       rectangle of that shape that fits inside it — the shapes are crops of
       one picture, which is what a ratio is. */
    const plate = plateNow();
    const ready = plate.complete && plate.naturalWidth;
    const ar = ready ? plate.naturalWidth / plate.naturalHeight : 1.5;
    const [bx, by, bw, bh] = fitBox(pad, pad, w - pad * 2, h - pad * 2 - foot, ar * 100, 100);
    if (ready) ctx.drawImage(plate, bx, by, bw, bh);
    else { ctx.fillStyle = p.inset; ctx.fillRect(bx, by, bw, bh); }

    const fitR = (q) => {
      let cw = bw, chh = bw / q;
      if (chh > bh) { chh = bh; cw = bh * q; }
      return { w: cw, h: chh };
    };
    const cx = bx + bw / 2, cy = by + bh / 2;

    /* everything the chosen shape does not take, dimmed — the loss is the
       lesson, and a hairline on its own does not show a loss */
    const d = fitR(q);
    const x0 = cx - d.w / 2, y0 = cy - d.h / 2;
    hatch(ctx, bx, by, bw, bh, [x0, y0, d.w, d.h]);

    /* THE OTHER TEN SHAPES ARE NOT DRAWN. They were, as hairlines on the same
       picture, on the argument that a family is the content (C19) - and over a
       photograph with something happening in every part of it, ten rectangles
       sharing one centre read as a grid laid on the picture, not as a family.
       His note of 09-09-2026: "Tum AR'larin cizgili overlayleri gozukmesin."
       The family is the bench; the picture carries one shape at a time. */

    ctx.strokeStyle = p.marker; ctx.lineWidth = 2;
    ctx.strokeRect(x0, y0, d.w, d.h);
    /* the plate the name sits on is the width of the name: "1:1" and "1:2.39"
       are not the same word, and a box sized for the longer one leaves a black
       tail beside the shorter (S13) */
    ctx.save();
    ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
    const nameW = Math.ceil(ctx.measureText(r.label).width);
    ctx.restore();
    ctx.fillStyle = 'rgba(8,10,9,0.72)';
    ctx.fillRect(x0, y0, nameW + 18, 26);
    label(ctx, r.label, x0 + 9, y0 + 17, p.marker, 11);
    ctx.strokeStyle = p.rule; ctx.lineWidth = 1;
    ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);

  }

  sync();
  return { render: view.render };
}

window.mountRatio = mountRatio;
