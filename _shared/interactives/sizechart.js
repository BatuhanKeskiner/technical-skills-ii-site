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
  { id:'phone', kind:'digital', name:'Phone',        cam:'iPhone 16 Pro',      w:9.8,  h:7.3 },
  { id:'one',   kind:'digital', name:'1 inch',       cam:'Sony RX100',         w:13.2, h:8.8 },
  { id:'m43',   kind:'digital', name:'Four Thirds',  cam:'OM System OM-1',     w:17.3, h:13.0 },
  { id:'apsc',  kind:'digital', name:'APS-C',        cam:'Fujifilm X-T5',      w:23.5, h:15.6 },
  { id:'ff',    kind:'digital', name:'Full frame',   cam:'Sony A7 IV',         w:36,   h:24 },
  { id:'135',   kind:'film',    name:'35 mm film',   cam:'Leica M6',           w:36,   h:24 },
  { id:'mfd',   kind:'digital', name:'Medium format digital', cam:'Fujifilm GFX 50', w:43.8, h:32.9 },
  { id:'66',    kind:'film',    name:'6 × 6',        cam:'Hasselblad 500C/M',  w:56,   h:56 },
  { id:'67',    kind:'film',    name:'6 × 7',        cam:'Mamiya 7',           w:69,   h:56 },
  { id:'69',    kind:'film',    name:'6 × 9',        cam:'Fujifilm GW690',     w:84,   h:56 },
  { id:'45',    kind:'film',    name:'4 × 5 in',     cam:'Sinar P2',           w:120,  h:95 },
  { id:'810',   kind:'film',    name:'8 × 10 in',    cam:'Deardorff',          w:245,  h:195 },
];

const SZ_DIR = '../02-composition-format/assets/';
const SZ_CAM_DIR = '../_shared/interactives/art/cams/';
/* his photographs of the bodies, when they are there; the slot is drawn
   either way so the chart does not change size as they arrive (S18) */
const SZ_CAM = {
  phone:'phone.png', one:'c1.png', m43:'m43.png', apsc:'apsc.png', ff:'ff.png',
  '135':'135.png', mfd:'mfd.png', '66':'66.png', '67':'67.png', '69':'69.png',
  '45':'45.png', '810':'810.png',
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

  const state = { at: SZ.length - 1 };          /* the one being read */
  const view = canvas(stage, draw);

  const coin = loadImage(SZ_DIR + 'b1-euro-coin.png', () => view.render());
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
    label: 'Read', cls: 'stp', ladder: SZ.map((z) => z.id), value: SZ[SZ.length - 1].id,
    format: (id) => (SZ.find((z) => z.id === id) || SZ[0]).name,
    onChange: (id, i) => { state.at = i; sync(); },
  });

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
      ctx.fillStyle = on ? '#E8763A' : '#8A4venue';
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

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage; ctx.fillRect(0, 0, w, h);

    const pad = 24;
    const cellH = 118;                       /* the row of cells at the foot */
    const top = pad, botY = h - cellH;
    const big = SZ[SZ.length - 1];

    /* ---- ONE TRUE SCALE, corner-nested ------------------------------------
       Every format shares its lower-left corner, so each one's own corner and
       its top edge stay visible and the growth reads as one staircase. */
    const boxW = w - pad * 2, boxH = botY - top - 26;
    const s = Math.min(boxW / big.w, boxH / big.h);
    const ox = pad, oy = top + boxH;

    SZ.slice().reverse().forEach((z) => {
      const on = SZ[state.at].id === z.id;
      const fw = z.w * s, fh = z.h * s;
      surface(ctx, ox, oy - fh, fw, fh, z.kind, on);
      ctx.strokeStyle = on ? p.fg : p.rule2;
      ctx.lineWidth = on ? 2 : 1;
      ctx.strokeRect(ox + 0.5, oy - fh + 0.5, fw - 1, fh - 1);
      label(ctx, z.name.toUpperCase(), ox + fw + 6, oy - fh + 10,
            on ? p.fg : p.muted, on ? 11 : 9);
    });

    /* the coin, at the same scale, standing on the same floor */
    if (coin.ready) {
      const D = EURO_MM * s;
      if (D > 10) ctx.drawImage(coin.img, ox + boxW - D - 4, oy - D, D, D);
    }

    label(ctx, 'ALL TWELVE AT ONE SCALE — A PHONE SENSOR AND AN 8×10 SHEET '
          + 'DRAWN THE SAME WAY', pad, botY - 8, p.muted, 9);

    /* ---- the row of cells -------------------------------------------------
       Name, millimetres, the surface itself, and the slot his photograph of
       the camera goes into. Twelve equal cells: the cell is the same size for
       a phone and for an 8×10, because the cell is not the format. */
    const cw = (w - pad * 2) / SZ.length;
    SZ.forEach((z, i) => {
      const x = pad + i * cw, on = state.at === i;
      ctx.save();
      ctx.fillStyle = on ? p.inset : 'transparent';
      ctx.fillRect(x, botY, cw, cellH);
      ctx.strokeStyle = p.rule; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, botY); ctx.lineTo(Math.round(x) + 0.5, h);
      ctx.stroke();
      ctx.restore();

      /* the surface, drawn to sit inside the cell: the truth about its size is
         the drawing above and the millimetres below, so this one is a swatch */
      const sw = cw - 26, sh = sw * (z.h / z.w);
      const shh = Math.min(sh, 30);
      surface(ctx, x + 13, botY + 10, shh * (z.w / z.h), shh, z.kind, on);

      label(ctx, z.name.toUpperCase(), x + 13, botY + 56, on ? p.fg : p.muted, 9);
      label(ctx, z.w + '×' + z.h + ' MM', x + 13, botY + 68, p.rule2, 8);

      /* his photograph of the body, or the slot it goes in */
      const box = pic(z.id), ph = 34, pw = cw - 26;
      if (box) {
        const k = Math.min(pw / box.img.naturalWidth, ph / box.img.naturalHeight);
        ctx.save();
        ctx.fillStyle = '#EDEBE6';
        ctx.fillRect(x + 13, botY + 76, pw, ph);
        ctx.drawImage(box.img, x + 13 + (pw - box.img.naturalWidth * k) / 2,
                      botY + 76 + (ph - box.img.naturalHeight * k) / 2,
                      box.img.naturalWidth * k, box.img.naturalHeight * k);
        ctx.restore();
      } else {
        ctx.save();
        ctx.strokeStyle = p.rule2; ctx.setLineDash([3, 3]);
        ctx.strokeRect(x + 13.5, botY + 76.5, pw - 1, ph - 1);
        ctx.restore();
      }
      label(ctx, z.cam.toUpperCase(), x + 13, botY + 76 + ph + 11, p.rule2, 7);
    });
  }

  sync();
  return { render: view.render };
}

window.mountSizeChart = mountSizeChart;
