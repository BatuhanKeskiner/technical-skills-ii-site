/* ============================================================
   B1 · The size chart
   ------------------------------------------------------------
   HIS SKETCH OF 09-09-2026: a table like the sensor-size charts
   that go round the internet - a row of pictures, a row of
   sizes, a row of cameras - but with the analog formats in it
   too, and read from the smallest to the largest.

     "Hem Analog Hem dijital ... Kucukten buyuge daha iyi olur."

   ONE THING HIS REFERENCE CHART DOES THAT THIS DOES NOT. In
   that chart the six pictures are not at one scale: medium
   format is drawn about three times the width of the 1/2.55"
   phone sensor when it is really eight and a half times. Here
   the twelve run from 9.8 mm to 245 mm - twenty-five to one -
   and drawing them "about right" would be a lie told by an
   instrument whose whole subject is size. So the top of the
   chart is ONE TRUE SCALE, corner-nested, and the row of cells
   underneath carries the name, the millimetres, the surface
   itself and the camera.

   THE SURFACE, NOT A PHOTOGRAPH. Film formats are drawn with
   his own rebate art and an orange film area; digital ones are
   drawn as a sensor. His words: "Analoglarda assetlerdeki
   cerceveleri kullanalim. Fotograf olmasin turuncu bir film
   alani olsun ... Sen diger sensorleri su renk gecisiyle
   kendin ciz."

   THE CAMERA ROW IS HIS. "Kamera fotograflari isi bende. Sen
   modelleri ve enstrumani cizdikten sonra ben ekleyecegim." So
   every cell keeps a slot the size of the photograph, named in
   SIZECHART.md, and the slot draws as an empty keyed box until
   the file appears beside it.
   ============================================================ */

const SZ = [
  { id:'phone', kind:'digital', name:'Phone',        cam:'iPhone 16 Pro',      w:9.8,  h:7.3 , short:'Phone' },
  { id:'one',   kind:'digital', name:'1 inch',       cam:'Sony RX100',         w:13.2, h:8.8 , short:'1 inch' },
  { id:'m43',   kind:'digital', name:'Four Thirds',  cam:'OM System OM-1 II',     w:17.3, h:13.0 , short:'Four Thirds' },
  { id:'apsc',  kind:'digital', name:'APS-C',        cam:'Fujifilm X-T5',      w:23.5, h:15.6 , short:'APS-C' },
  { id:'ff',    kind:'digital', name:'Full frame',   cam:'Sony A7 IV',         w:36,   h:24 , short:'Full frame' },
  { id:'135',   kind:'film',    name:'35 mm film',   cam:'Leica M6',           w:36,   h:24 , short:'35 mm' },
  { id:'mfd',   kind:'digital', name:'Medium format digital', cam:'Hasselblad X2D', w:43.8, h:32.9 , short:'MF digital' },
  { id:'66',    kind:'film',    name:'6 × 6',        cam:'Hasselblad 500C/M',  w:56,   h:56 , short:'6 × 6' },
  { id:'67',    kind:'film',    name:'6 × 7',        cam:'Mamiya 7',           w:69,   h:56 , short:'6 × 7' },
  { id:'69',    kind:'film',    name:'6 × 9',        cam:'Fujifilm GW690',     w:84,   h:56 , short:'6 × 9' },
  { id:'45',    kind:'film',    name:'4 × 5 in',     cam:'Sinar P2',           w:120,  h:95 , short:'4 × 5 in' },
  { id:'810',   kind:'film',    name:'8 × 10 in',    cam:'Arca-Swiss F-Metric',          w:245,  h:195 , short:'8 × 10 in' },
];

const SZ_DIR = '../02-composition-format/assets/';
/* HIS OWN FILM FRAMES, out of Analog Medium Format.psd and the two beside it.
   Each one is a rebate with a hole in it; `win` is where that hole sits, as a
   fraction of the picture, measured off the alpha channel. The orange film
   area is painted into the hole and the rebate is laid over the top, so what
   the cell shows is a piece of his film rather than a coloured rectangle.
   6 × 9 has no frame in the file - it is drawn plain until one arrives. */
const SZ_FRAME = {
  '135': { f: 'b1-frame-35mm.png', win: [0.032, 0.1479, 0.9359, 0.7027] },
  '66':  { f: 'b1-frame-66.png',   win: [0.17, 0.0493, 0.6611, 0.9168] },
  '67':  { f: 'b1-frame-67.png',   win: [0.1044, 0.0493, 0.7722, 0.9168] },
  '45':  { f: 'b1-frame-45.png',   win: [0.0778, 0.1036, 0.8578, 0.7968] },
};
const SZ_CAM_DIR = '../_shared/interactives/art/cams/';
/* his photographs of the bodies, when they are there; the slot is drawn
   either way so the chart does not change size as they arrive (S18) */
const SZ_CAM = {
  'phone': 'phone.jpg',
  'one': 'c1.png',
  'm43': 'm43.jpg',
  'apsc': 'apsc.jpg',
  'ff': 'ff.png',
  '135': '135.jpg',
  'mfd': 'mfd.jpg',
  '66': '66.jpg',
  '67': '67.jpg',
  '69': '69.jpg',
  '45': '45.jpg',
  '810': '810.jpg',
};

function mountSizeChart(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Formats'),
              el('span', 'ts-sub', 'every one, smallest to largest'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { at: 0, coin: true };         /* the one being read */
  const view = canvas(stage, draw);

  const coin = loadImage(SZ_DIR + 'b1-euro-coin.png', () => view.render());
  const FRAMES = {};
  const frame = (id) => {
    const fr = SZ_FRAME[id];
    if (!fr) return null;
    if (!FRAMES[id]) FRAMES[id] = loadImage(SZ_DIR + fr.f, () => view.render());
    return FRAMES[id].ready ? FRAMES[id] : null;
  };
  const PICS = {};
  const pic = (id) => {
    if (!SZ_CAM[id]) return null;
    if (!PICS[id]) PICS[id] = loadImage(SZ_CAM_DIR + SZ_CAM[id], () => view.render());
    return PICS[id].ready ? PICS[id] : null;
  };

  /* ONE CONTROL, AND IT WALKS THE LADDER. The chart is a ladder of twelve and
     a ladder is a stepper (C17): the step marks one format in the drawing and
     fills the reading beneath it. */
  const step = stepper(controls, {
    label: 'Format', cls: 'stp', ladder: SZ.map((z) => z.id), value: SZ[0].id,
    format: (id) => (SZ.find((z) => z.id === id) || SZ[0]).name,
    onChange: (id, i) => { state.at = i; sync(); },
  });
  /* THE COIN COMES AND GOES. It is the only thing on the stage that is not a
     format, and it is there to be believed rather than looked at - so it is
     his to put away. */
  states(controls, {
    label: 'Coin', cls: 'one', items: ['Shown', 'Hidden'],
    onChange: (i) => { state.coin = i === 0; view.render(); },
  });

  /* THE THREE GATES (O1 O2 O3), ANSWERED — two cells.
     The surface: nobody sets it, the drawing shows twelve rectangles but
     states no area as a number, and "eleven hundred square millimetres" is
     the thing this chart exists to make concrete.
     Against the smallest: derived from the two, nowhere in the drawing as a
     quantity, and it is the sentence a student repeats — an 8×10 sheet is six
     hundred times the surface of a phone. The smallest is the fixed end of
     the comparison because it is the one everybody is holding. */
  const out = readout(fig, [
    { id: 'size', key: 'The surface', cls: 'hi' },
    { id: 'vs', key: 'Against the smallest' },
  ]);

  fsButton(stage, fig);

  function sync() {
    const z = SZ[state.at], sm = SZ[0];
    out.size.innerHTML = z.w + ' × ' + z.h + '<span class="u">mm</span> · '
      + Math.round(z.w * z.h).toLocaleString('en') + '<span class="u">mm²</span>';
    const k = (z.w * z.h) / (sm.w * sm.h);
    out.vs.innerHTML = '×' + (k >= 10 ? k.toFixed(0) : k.toFixed(1))
      + ' <span class="u">the area of a phone</span>';
    view.render();
  }

  /* an orange film area with its rebate, or a sensor - drawn, not photographed */
  function surface(ctx, x, y, w, h, kind, on) {
    ctx.save();
    if (kind === 'film') {
      ctx.fillStyle = on ? '#E8763A' : '#7A4526';
      ctx.fillRect(x, y, w, h);
    } else {
      const g = ctx.createLinearGradient(x, y + h, x + w, y);
      g.addColorStop(0, on ? '#2E7BE0' : '#274C7A');
      g.addColorStop(0.45, on ? '#31C08A' : '#2C6B58');
      g.addColorStop(0.75, on ? '#E2C044' : '#7E7038');
      g.addColorStop(1, on ? '#E0574B' : '#7A3B36');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  /* CLICK A CELL AND THAT IS THE FORMAT. The row at the foot is a table and a
     table you can point at; the stepper walks it, the cells jump to it. */
  view.canvas.addEventListener('click', (e) => {
    const r = view.canvas.getBoundingClientRect();
    const y = e.clientY - r.top, x = e.clientX - r.left;
    if (!hit || y < hit.top) return;
    const i = Math.floor((x - hit.x) / hit.cw);
    if (i < 0 || i >= SZ.length) return;
    state.at = i;
    step.set(SZ[i].id);
    sync();
  });
  view.canvas.style.cursor = 'pointer';
  let hit = null;                       /* where the row of cells is, for a click */

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);

    const pad = 24;
    const cellH = 158;                       /* the row of cells at the foot */
    const ladW = Math.min(330, w * 0.28);    /* the column of names, right */
    const top = pad, botY = h - cellH;
    const big = SZ[SZ.length - 1];
    const z = SZ[state.at];

    /* ---- ONE FORMAT AT A TIME, CENTRED --------------------------------
       Twelve rectangles nested in one corner was a staircase, and his note of
       09-09-2026 took it apart: "Sensorler o alanin icinde ortalansin.
       Digerleri gozukmesin." So the area holds the one that is chosen, in the
       middle of it, and the scale is still fixed by the largest - change the
       format and nothing moves except the frame, which is the whole point. */
    const areaX = pad, areaW = w - ladW - pad * 2;
    const areaY = top, areaH = botY - top - 22;
    const coinGap = 26;
    /* room for the coin at the right of the widest frame, at the same scale */
    const s = Math.min((areaW - EURO_MM * 1 - coinGap) / big.w, areaH / big.h);
    const fw = z.w * s, fh = z.h * s;
    const cx = areaX + areaW / 2, cy = areaY + areaH / 2;
    const fx = cx - (fw + coinGap + EURO_MM * s) / 2;   /* frame and coin, together */
    const fy = cy - fh / 2;

    surface(ctx, fx, fy, fw, fh, z.kind, true);
    ctx.strokeStyle = p.fg; ctx.lineWidth = 2;
    ctx.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);

    /* the coin, at the same scale, on the frame's own middle line */
    if (state.coin && coin.ready) {
      const D = EURO_MM * s;
      if (D > 8) ctx.drawImage(coin.img, fx + fw + coinGap, cy - D / 2, D, D);
    }

    label(ctx, 'ONE FIXED SCALE', areaX, botY - 8, p.rule2, 9);

    /* ---- the names, down the right ------------------------------------ */
    const lx = w - ladW;
    const lineH = Math.min(22, (areaH - 10) / SZ.length);
    let ly = areaY + (areaH - lineH * SZ.length) / 2 + 12;
    SZ.forEach((q, i) => {
      const on = i === state.at;
      label(ctx, (q.short || q.name).toUpperCase(), lx, ly, on ? p.fg : p.muted,
            on ? 11 : 9);
      label(ctx, q.w + ' × ' + q.h + ' MM', lx + ladW * 0.52, ly,
            on ? p.muted : p.rule2, 9);
      ly += lineH;
    });

    /* ---- the row of cells --------------------------------------------- */
    const cw = (w - pad * 2) / SZ.length;
    hit = { top: botY, x: pad, cw: cw };
    SZ.forEach((q, i) => {
      const x = pad + i * cw, on = state.at === i;
      ctx.save();
      ctx.fillStyle = on ? p.inset : 'transparent';
      ctx.fillRect(x, botY, cw, cellH);
      ctx.strokeStyle = on ? p.fg : p.rule; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, botY); ctx.lineTo(Math.round(x) + 0.5, h);
      ctx.stroke();
      ctx.restore();

      /* the surface, in the middle of its own card (his note) */
      const shh = 34, fbox = frame(q.id);
      if (fbox) {
        const fr = SZ_FRAME[q.id], im = fbox.img;
        const fh2 = shh, fw2 = fh2 * (im.naturalWidth / im.naturalHeight);
        const sx = x + (cw - fw2) / 2, sy = botY + 8;
        surface(ctx, sx + fr.win[0] * fw2, sy + fr.win[1] * fh2,
                fr.win[2] * fw2, fr.win[3] * fh2, q.kind, on);
        ctx.drawImage(im, sx, sy, fw2, fh2);
      } else {
        const sw2 = shh * (q.w / q.h);
        surface(ctx, x + (cw - sw2) / 2, botY + 8, sw2, shh, q.kind, on);
      }

      label(ctx, (q.short || q.name).toUpperCase(), x + 12, botY + 58,
            on ? p.fg : p.muted, 9);
      label(ctx, q.w + '×' + q.h + ' MM', x + 12, botY + 70, p.rule2, 8);

      /* his photograph of the body, bigger than it was */
      const box = pic(q.id), ph = 56, pw = cw - 24;
      ctx.save();
      ctx.fillStyle = '#EDEBE6';
      ctx.fillRect(x + 12, botY + 78, pw, ph);
      if (box) {
        const im = box.img;
        const k = Math.min(pw / im.naturalWidth, ph / im.naturalHeight);
        ctx.drawImage(im, x + 12 + (pw - im.naturalWidth * k) / 2,
                      botY + 78 + (ph - im.naturalHeight * k) / 2,
                      im.naturalWidth * k, im.naturalHeight * k);
      } else {
        ctx.strokeStyle = p.rule2; ctx.setLineDash([3, 3]);
        ctx.strokeRect(x + 12.5, botY + 78.5, pw - 1, ph - 1);
      }
      ctx.restore();
      label(ctx, q.cam.toUpperCase(), x + 12, botY + 78 + ph + 12, p.rule2, 7);
    });
  }

  sync();
  return { render: view.render };
}

window.mountSizeChart = mountSizeChart;
