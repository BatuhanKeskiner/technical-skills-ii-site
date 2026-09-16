/* ============================================================
   Pinhole Calculator — week 3, Camera I. A TOOL.

   THREE INTO ONE, 16-09-2026. His word: "Bir de Pinhole Calculator var.
   Bu üçü birleşip şu anki Pinhole Calculator içine girsin." Pinhole
   Optimum Aperture Calculator (pinholeaperture.js) and Pinhole Exposure
   Calculation (pinholeexposure.js) were separate drawings on week 3's
   two sums pages; their drawings now stand beside the numbers here, one
   per tab, and the two files are in _notes/parked/. A page opens the
   tab it teaches with `pin: { tab: 1 }`.

     Optimum Aperture      the two blurs against the hole, and the band
                           between 1.56 and 2.0 where the best hole is
     Exposure              the two openings at their true area, and
                           each row of the table drawn on a time scale
     Angle of View         the box in section at true proportion

   His word, 14-09-2026, with three screens of PinholeDesigner:
   "onlar illustrasyon olarak kalsın bu bir tool olsun … Bunu
   mevcut ikisi yeterince iyi olmadığı için yapmak istiyorum. Bu
   bağımsız görsel olmadan tek bir araç olsun."

   So: no drawing. Numbers typed in, numbers read off, in three
   pages like the program's tabs —

     Hole & focal length   d = c · √(f · λ), both ways round, the
                           f-number, and the factor against f/22
     Exposure              the meter's times against the times to
                           give at the pinhole's f-number, with a
                           film's reciprocity if one is chosen
     Angle of view         what a format sees at a focal length

   The facts (corrected 17-09-2026). Rayleigh's constant is 2 (1891),
   Young's 1.56 (1971); 1.9 is PinholeDesigner's default, between them, and
   is the program's default; 1.56 is the minimum of the blur curve
   drawn in Pinhole Aperture. Film is judged at 550 nm, paper at
   480 nm (blue-sensitive). Ilford's reciprocity is their own
   fact sheet's power law, t_c = t_m^p, per film; Kodak's Table 1
   (Adams, The Negative p.45) is the general film curve Pinhole
   Exposure already uses, 2 · t^0.39. Paper has no published
   table: the tool says so and points at the test strip.
   ============================================================ */

const PC_LAMBDA = { film: 0.00055, paper: 0.00048 };
const PC_CONST = [
  { c: 1.9, name: 'PinholeDesigner' },
  { c: 1.56, name: 'Young 1971' },
  { c: 2.0, name: 'Lord Rayleigh 1891' },
];
const PC_METER = [8, 16, 22];
/* the meter's times, the program's column: a thousandth to fifteen seconds */
const PC_TIMES = [1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8,
  1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30];
/* RECIPROCITY, BY MAKER. Batu's film folder of 16-09-2026 (filmstocks.js,
   PC_RECIP): 35 Ilford, Kodak and Fujifilm stocks, each with its own
   formula and its own data sheet. A film is honest up to `after` seconds
   and given as metered; past it, its formula. Kodak's general Table 1
   (Adams, The Negative p.45) stays at the head of Kodak's list, for a film
   nobody has a sheet for.
   Each entry: name, long, fn(t), and `rec` - the stock itself, which the
   sheet reads its picture, speed, note and data sheet from. */
const PC_BRANDS = ['None', 'Ilford', 'Kodak', 'Fujifilm'];
const PC_BRAND_BUTTON = ['None', 'Ilford', 'Kodak', 'Fuji'];
const PC_NONE = { name: 'No correction', long: 'none', fn: (t) => t };
const PC_KODAK_T1 = {
  name: 'Table 1', long: 'Kodak Table 1, general film',
  fn: (t) => t * (t <= 0.5 ? 1 : t < 1 ? 1 + (t - 0.5) / 0.5 : 2 * Math.pow(t, 0.39)),
};
function pcStocks(brand) {
  if (brand === 0) return [PC_NONE];
  const name = PC_BRANDS[brand];
  const list = (window.PC_RECIP || []).filter((r) => r.brand === name)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
    .map((r) => ({
      /* Fujifilm's '200' and '400' are a number alone on the dial */
      name: /^\d+$/.test(r.name) ? r.brand + ' ' + r.name : r.name,
      long: r.brand + ' ' + r.name, rec: r,
      fn: (t) => (t <= r.after ? t : r.fn(t, r.p)),
    }));
  return brand === 2 ? [PC_KODAK_T1].concat(list) : list;
}
const PC_TRUST = {
  sheet: 'From the maker\u2019s data sheet',
  untested: 'Untested \u2014 the compilation says so',
  unsourced: 'No data sheet behind it',
  short: 'Sheet stops at 1 s \u2014 past it, a guess',
};

const PC_TABS = ['Optimum Aperture', 'Exposure', 'Angle of View'];  /* 'Exposure Calculation' wrapped the strip at the projector (C3) */
/* the band the aperture drawing shades: the blur curve's own minimum, and
   the resolution-optimised constant */
const PC_C_LOW = 1.56;
const PC_C_HIGH = 2.0;
/* THE SHEET IS ONE WIDTH ON EVERY TAB, so pressing a tab changes what it
   says and not where the drawing starts (S18). */
const PC_SHEET = 0.34;
const PC_PAD = 40;

/* how a time is written: under a second, the nearest third-stop the dial
   has; over it, seconds, then minutes and seconds, then hours */
function pcTime(t) {
  if (t < 1) {
    const lad = LADDER.shutter[3].filter((v) => v < 1);
    let best = lad[0];
    lad.forEach((v) => { if (Math.abs(Math.log(v / t)) < Math.abs(Math.log(best / t))) best = v; });
    return shutterText(best);
  }
  if (t < 10) return (Math.round(t * 10) / 10).toString().replace(/\.0$/, '') + ' s';
  if (t < 60) return Math.round(t) + ' s';
  if (t < 3600) {
    const m = Math.floor(t / 60), s = Math.round(t - m * 60);
    return m + ' min' + (s ? ' ' + s + ' s' : '');
  }
  const hh = Math.floor(t / 3600), mm = Math.round((t - hh * 3600) / 60);
  return hh + ' h' + (mm ? ' ' + mm + ' min' : '');
}
function pcMM(v) {
  return (v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : String(Math.round(v))) + ' mm';
}
function pcDeg(r) { return Math.round((r * 180) / Math.PI) + '°'; }

function mountPinholeCalculator(fig) {
  let p = palette(fig);

  const stage = el('div', 'stage wide');
  fig.prepend(stage);

  /* N3: the name lives on the instrument, because in full screen the page's
     own heading is gone. */
  const head = el('div', 'ts-head');
  head.append(el('span', 'ts-name', 'Pinhole Calculator'),
              el('span', 'ts-sub', 'hole · focal length · exposure · angle'));
  fig.prepend(head);

  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  /* A PAGE THAT PINS A TAB HAS MADE THE CHOICE, so the tab row is not in
     its strip (IG-01 06, rule 01) - and on a lecture page the row was what
     wrapped the strip onto a second line and crushed the drawing. */
  const isPinned = fig.hasAttribute('data-tab');
  const pinned = parseInt(fig.getAttribute('data-tab') || '0', 10);
  const state = {
    tab: pinned >= 0 && pinned < PC_TABS.length ? pinned : 0,
    d: 0.3, f: 50, ci: 0, mat: 'film',       /* hole & focal length */
    n: 167, met: 22, iso: 100, brand: 0, stock: 0,   /* exposure */
    af: 50, fw: 36, fh: 24,                   /* angle of view */
  };
  const PC_METER_ISO = 100;
  const lambda = () => PC_LAMBDA[state.mat];
  const bestHole = (f) => PC_CONST[state.ci].c * Math.sqrt(f * lambda());
  const bestFocal = (d) => Math.pow(d / PC_CONST[state.ci].c, 2) / lambda();

  /* the film sheet's state, declared before the canvas: it draws at once */
  const pics = {};
  let sheetLink = null;
  const pcCard = { textX: 0, linkY: 0 };
  const view = canvas(stage, draw);

  /* one legend per drawing, and only the one for the tab in hand shows */
  const legends = [
    legend(stage, [
      { c: p.digital, label: 'From the hole', kind: 'dash' },
      { c: p.cinema, label: 'From diffraction', kind: 'dash' },
      { c: p.fg, label: 'The two together', kind: 'line' },
      { c: p.signal, label: 'Best range' },
    ]),
    null,
    null,
  ];
  const showLegend = () => legends.forEach((lg, i) => {
    /* style, not the hidden attribute: .overlay sets its own display */
    if (lg) lg.parentNode.style.display = i === state.tab ? '' : 'none';
  });

  /* THE STRIP IS THE PAGE'S, AND IT DOES NOT MOVE (C9, S18): every tab
     has the tab row and three cells of one pinned width and one pinned
     height (figure.demo.pc in the stylesheet), so pressing a tab changes
     what the cells say and nothing about where they are. */
  fig.classList.add('pc');
  let tabRow;
  function buildStrip() {
    controls.innerHTML = '';
    if (!isPinned) {
      tabRow = states(controls, {
        label: 'Calculation', items: PC_TABS, cls: 'tabs',
        onChange: (i) => { state.tab = i; buildStrip(); showLegend(); view.render(); },
      });
      tabRow.select(state.tab);
    }

    if (state.tab === 0) {
      numberField(controls, {
        label: 'Hole', value: state.d, min: 0.02, max: 5, step: 0.01, unit: 'mm',
        onChange: (v) => { state.d = v; view.render(); },
      });
      numberField(controls, {
        label: 'Focal length', value: state.f, min: 5, max: 2000, step: 1, unit: 'mm',
        onChange: (v) => { state.f = v; view.render(); },
      });
      const fC = stepper(controls, {
        label: 'Constant', ladder: PC_CONST.map((c) => c.c), value: PC_CONST[state.ci].c,
        format: (c) => String(c), arrows: true,
        onChange: (c, i) => { state.ci = i; view.render(); },
      });
      /* the material sits in the constant's own cell: it is which wavelength
         the hole is judged at, not a fourth variable (C1) */
      const matRow = el('div', 'states');
      const bFilm = el('button', 'st', 'Film');
      const bPaper = el('button', 'st', 'Paper');
      [bFilm, bPaper].forEach((b) => { b.type = 'button'; matRow.append(b); });
      fC.node.append(matRow);
      const setMat = (m) => {
        state.mat = m;
        bFilm.setAttribute('aria-current', String(m === 'film'));
        bPaper.setAttribute('aria-current', String(m === 'paper'));
        view.render();
      };
      bFilm.addEventListener('click', () => setMat('film'));
      bPaper.addEventListener('click', () => setMat('paper'));
      setMat(state.mat);
    } else if (state.tab === 1) {
      const fN = numberField(controls, {
        label: 'f-number of the pinhole camera', value: state.n, min: 8, max: 2000, step: 1, unit: 'f/',
        onChange: (v) => { state.n = v; view.render(); },
      });
      /* the aperture the meter was set to, in the f-number's cell: part of
         the reading, not a variable of its own (C1) */
      const apRow = el('div', 'states');
      const apButtons = PC_METER.map((a) => {
        const b = el('button', 'st', fStop(a));
        b.type = 'button';
        b.addEventListener('click', () => setMet(a));
        apRow.append(b);
        return b;
      });
      fN.node.append(apRow);
      const setMet = (a) => {
        state.met = a;
        apButtons.forEach((b, i) => b.setAttribute('aria-current', String(PC_METER[i] === a)));
        view.render();
      };
      setMet(state.met);
      numberField(controls, {
        label: 'Material speed · meter at ISO 100', value: state.iso, min: 1, max: 6400, step: 1, unit: 'ISO',
        onChange: (v) => { state.iso = v; view.render(); },
      });
      /* THE MAKER IS A ROW IN THE FILM'S OWN CELL, like Film and Paper in
         the constant's: it narrows the list the arrows walk, it is not a
         variable of its own (C1). Choosing a film sets its speed, which
         stays editable for a film pushed or pulled. */
      const stocks = pcStocks(state.brand);
      const fS = stepper(controls, {
        label: 'Reciprocity failure', ladder: stocks.map((f) => f.name),
        value: stocks[state.stock].name, arrows: true, cls: 'films',
        onChange: (v, i) => { state.stock = i; takeSpeed(); buildStrip(); view.render(); },
      });
      const brandRow = el('div', 'states');
      PC_BRAND_BUTTON.forEach((t, i) => {
        const b = el('button', 'st', t);
        b.type = 'button';
        b.setAttribute('aria-current', String(i === state.brand));
        b.addEventListener('click', () => {
          if (i === state.brand) return;
          state.brand = i; state.stock = 0;
          takeSpeed(); buildStrip(); view.render();
        });
        brandRow.append(b);
      });
      fS.node.append(brandRow);
    } else {
      numberField(controls, {
        label: 'Focal length', value: state.af, min: 5, max: 2000, step: 1, unit: 'mm',
        onChange: (v) => { state.af = v; view.render(); },
      });
      numberField(controls, {
        label: 'Film width', value: state.fw, min: 5, max: 1000, step: 1, unit: 'mm',
        onChange: (v) => { state.fw = v; view.render(); },
      });
      numberField(controls, {
        label: 'Film height', value: state.fh, min: 5, max: 1000, step: 1, unit: 'mm',
        onChange: (v) => { state.fh = v; view.render(); },
      });
    }
  }
  function takeSpeed() {
    const f = filmNow();
    if (f.rec) state.iso = f.rec.iso;
  }
  function filmNow() { return pcStocks(state.brand)[state.stock] || PC_NONE; }

  buildStrip();
  showLegend();

  fsButton(stage, fig);
  groundButton(stage, fig, {
    key: 'ts2-pinholecalc-ground',
    onChange: () => { p = palette(fig); view.render(); },
  });

  /* ---- the sheet on the left, the drawing on the right ---- */

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);
    /* the sheet: the answers sit on a lighter ground, like a page on the bench */
    ctx.fillStyle = p.inset;
    ctx.fillRect(20, 20, Math.round(w * PC_SHEET) - 30, h - 40);
    const rx = Math.round(w * PC_SHEET) + 10;          /* where the drawing starts */
    if (sheetLink && state.tab !== 1) sheetLink.style.display = 'none';
    if (state.tab === 0) sheetHole(ctx, w, h, rx);
    else if (state.tab === 1) sheetExposure(ctx, w, h, rx);
    else sheetAngle(ctx, w, h, rx);
  }

  /* a row: the question, small, and the answer, large */
  /* on a lecture page the stage is a third of a screen tall, so the answer
     shrinks with the room it has rather than running into the next row */
  function row(ctx, x, y, key, val, hi, size = 28) {
    label(ctx, key.toUpperCase(), x, y, p.muted, 10, 'left');
    label(ctx, val, x, y + size + 6, hi ? p.signal : p.fg, size, 'left');
  }

  /* four answers down the sheet, spaced to the room there is */
  function rows(ctx, h, list, bottom) {
    const top = PC_PAD + 24;
    const step = Math.min(110, (bottom - top - 56) / (list.length - 1 || 1));
    const size = Math.max(16, Math.min(28, step - 26));
    list.forEach((r, i) => row(ctx, PC_PAD, top + step * i, r[0], r[1], r[2], size));
  }

  /* the formula, across the foot of both halves */
  function foot(ctx, w, h, formula, note, right) {
    const fy = h - PC_PAD - 16;
    line(ctx, PC_PAD, fy - 22, w - PC_PAD, fy - 22, p.rule2);
    label(ctx, formula, PC_PAD, fy + 2, p.fg, 14, 'left');
    label(ctx, note.toUpperCase(), PC_PAD, fy + 20, p.muted, 9, 'left');
    if (right) label(ctx, right, w - PC_PAD, fy + 2, p.muted, 9, 'right');
    return fy - 22;
  }

  function factorText(x) {
    return '×' + (x < 10 ? x.toFixed(1) : Math.round(x))
      + '  (' + (Math.log(x) / Math.LN2).toFixed(1) + ' stops)';
  }

  /* ---- 1 · Optimum Aperture ---- */

  function sheetHole(ctx, w, h, rx) {
    const N = state.f / state.d;
    const fy = foot(ctx, w, h, 'd = c · √(f · λ)',
      'c = ' + PC_CONST[state.ci].c + ' · ' + PC_CONST[state.ci].name + '   ·   λ = ' + (lambda() * 1e6) + ' nm, '
      + (state.mat === 'film' ? 'film' : 'paper, blue-sensitive') + '   ·   d hole, f focal length',
      'THE HOLE SETS THE f-NUMBER · THE FOCAL LENGTH SETS THE ANGLE OF VIEW');
    rows(ctx, h, [
      ['Best hole for ' + pcMM(state.f) + ' focal length', pcMM(bestHole(state.f)), true],
      ['Best focal length for a ' + pcMM(state.d) + ' hole', pcMM(bestFocal(state.d)), true],
      ['f-number · ' + pcMM(state.f) + ' ÷ ' + pcMM(state.d), fStop(N)],
      ['Exposure factor against f/22', factorText(Math.pow(N / 22, 2))],
    ], fy);
    drawCurves(ctx, rx, w, fy);
  }

  /* The two blurs against the diameter of the hole, at the focal length in
     hand. A pinhole does not focus: a point arrives as a disc as wide as the
     hole, and diffraction spreads it as the hole narrows. Their sum has a
     bottom, and the bottom is the formula on the sheet. */
  function drawCurves(ctx, left, w, bottom) {
    const f = state.f, lam = lambda();
    const spread = (d) => (2.44 * lam * f) / d;
    const blur = (d) => Math.hypot(d, spread(d));
    const best = (c) => c * Math.sqrt(lam * f);
    /* the scale is centred on the best hole, so the bottom of the curve is
       always in the picture whatever the focal length */
    const mid = best(1.8);
    const dLo = Math.max(0.02, mid * 0.25), dHi = mid * 2.6;
    /* the top clears the legend in the corner; the foot clears the axis */
    const x0 = left + 44, x1 = w - PC_PAD;
    const y0 = 20 + (bottom < 420 ? 64 : 100), y1 = bottom - 46;
    const yMax = Math.max(blur(dLo), blur(dHi)) * 1.05;
    const X = (d) => x0 + ((d - dLo) / (dHi - dLo)) * (x1 - x0);
    const Y = (v) => y1 - (Math.min(v, yMax) / yMax) * (y1 - y0);
    const clampX = (d) => X(Math.min(dHi, Math.max(dLo, d)));

    /* the band between the two constants, and its numbers over it */
    const bLo = clampX(best(PC_C_LOW)), bHi = clampX(best(PC_C_HIGH));
    ctx.save();
    ctx.fillStyle = p.band;
    ctx.fillRect(bLo, y0, Math.max(1, bHi - bLo), y1 - y0);
    ctx.restore();
    label(ctx, best(PC_C_LOW).toFixed(2) + '–' + best(PC_C_HIGH).toFixed(2) + ' MM',
          (bLo + bHi) / 2, y0 - 8, p.signal, 9, 'center');

    const curve = (fn, col, dash) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = dash ? 1 : 1.8;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      for (let i = 0; i <= 160; i += 1) {
        const d = dLo + ((dHi - dLo) * i) / 160;
        const y = Y(fn(d));
        if (i === 0) ctx.moveTo(X(d), y); else ctx.lineTo(X(d), y);
      }
      ctx.stroke();
      ctx.restore();
    };
    curve((d) => d, p.digital, [4, 4]);
    curve(spread, p.cinema, [4, 4]);
    curve(blur, p.fg);

    /* the hole typed in, and the blur it gives on the film */
    const inRange = state.d >= dLo && state.d <= dHi;
    const hx = clampX(state.d);
    line(ctx, hx, y0, hx, y1, p.signal, inRange ? null : [3, 3]);
    const by = Y(blur(state.d));
    ctx.save();
    ctx.fillStyle = p.signal;
    ctx.beginPath(); ctx.arc(hx, by, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    const right = hx > (x0 + x1) / 2;
    label(ctx, (inRange ? '' : (state.d < dLo ? '◂ ' : '▸ ')) + pcMM(state.d) + ' HOLE · '
          + blur(state.d).toFixed(2) + ' MM ON THE FILM',
          hx + (right ? -8 : 8), y0 + 14, p.signal, 9, right ? 'right' : 'left');

    /* the axes: ticks at a round step that gives five to eight of them */
    line(ctx, x0, y1, x1, y1, p.rule2);
    const span = dHi - dLo;
    const stepD = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2].find((s) => span / s <= 8) || 5;
    for (let d = Math.ceil(dLo / stepD) * stepD; d <= dHi + 1e-9; d += stepD) {
      const tx = X(d);
      line(ctx, tx, y1, tx, y1 + 4, p.rule2);
      label(ctx, stepD < 0.1 ? d.toFixed(2) : d.toFixed(1), tx, y1 + 16, p.muted, 9, 'center');
    }
    label(ctx, 'HOLE · MM', x1, y1 + 31, p.muted, 9, 'right');
    label(ctx, 'BLUR ON THE FILM · AT ' + pcMM(f).toUpperCase(), x0, y0 - 24, p.muted, 9, 'left');
  }

  /* ---- 2 · Exposure Calculation ---- */

  function sheetExposure(ctx, w, h, rx) {
    const apX = Math.pow(state.n / state.met, 2);
    const isoX = PC_METER_ISO / state.iso;
    const factor = apX * isoX;
    const film = filmNow();
    const withFilm = film !== PC_NONE;
    row(ctx, PC_PAD, PC_PAD + 24, 'Exposure factor against ' + fStop(state.met) + ' at ISO 100', factorText(factor), true);
    label(ctx, ('×' + (apX < 10 ? apX.toFixed(1) : Math.round(apX)) + ' for the f-number  ·  ×'
      + (isoX < 10 ? (Math.round(isoX * 10) / 10) : Math.round(isoX)) + ' for ISO ' + state.iso).toUpperCase(),
      PC_PAD, PC_PAD + 84, p.muted, 9, 'left');
    const x1 = w * PC_SHEET - 30;
    let y = PC_PAD + 104;
    if (film.rec) {
      y = drawStock(ctx, film.rec, PC_PAD, x1, y, h);
    } else {
      label(ctx, (withFilm ? 'Reciprocity · ' + film.long : 'Reciprocity · none').toUpperCase(),
            PC_PAD, y, p.muted, 9, 'left');
      /* only at a paper's speed: at ISO 100 "none" is a choice, not paper */
      if (!withFilm && state.iso <= 12) {
        label(ctx, 'PAPER HAS NO TABLE: THE ANSWER IS A TEST STRIP', PC_PAD, y + 14, p.muted, 9, 'left');
      }
      y += 26;
    }
    placeSheetLink(film.rec, x1);
    /* on a lecture page the film card takes the room the openings had; they
       come back in full screen, rather than being drawn over the card */
    if (h - PC_PAD - y >= 110) drawOpenings(ctx, PC_PAD, x1, y, h - PC_PAD);
    drawTable(ctx, rx, w, h, factor, film, withFilm);
  }

  /* THE FILM ON THE SHEET: its box, its name and speed, where it stops
     being honest, how far its numbers can be trusted, the compilation's
     note, and - under the canvas, because a canvas cannot hold a link -
     the maker's data sheet. */
  function picOf(rec) {
    if (!pics[rec.img]) {
      pics[rec.img] = loadImage('../_shared/interactives/art/films/' + rec.img, () => view.render());
    }
    return pics[rec.img];
  }
  function wrap(ctx, text, maxW, size) {
    ctx.save();
    ctx.font = '500 ' + size + 'px "JetBrains Mono", ui-monospace, monospace';
    const out = [];
    let cur = '';
    text.split(' ').forEach((wd) => {
      const t = cur ? cur + ' ' + wd : wd;
      if (cur && ctx.measureText(t).width > maxW) { out.push(cur); cur = wd; } else cur = t;
    });
    if (cur) out.push(cur);
    ctx.restore();
    return out;
  }
  function placeSheetLink(rec, x1) {
    const url = rec && rec.src ? rec.src.split(',')[0].trim() : '';
    if (!sheetLink) {
      sheetLink = el('a', 'pc-sheet');
      sheetLink.target = '_blank';
      sheetLink.rel = 'noopener';
      stage.append(sheetLink);
    }
    sheetLink.style.display = url && state.tab === 1 ? '' : 'none';
    if (!url) return;
    sheetLink.href = url;
    sheetLink.textContent = 'Data sheet \u2197';
    sheetLink.style.left = (PC_PAD + pcCard.textX) + 'px';
    sheetLink.style.top = pcCard.linkY + 'px';
  }
  function drawStock(ctx, rec, x0, x1, y0, h) {
    const tight = h < 460;
    const side = tight ? 56 : 84;
    const pic = picOf(rec);
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x0, y0, side, side);
    if (pic.ready) ctx.drawImage(pic.img, x0, y0, side, side);
    ctx.restore();
    const tx = x0 + side + 12;
    label(ctx, rec.brand.toUpperCase(), tx, y0 + 9, p.muted, 9, 'left');
    label(ctx, rec.name, tx, y0 + 27, p.fg, 15, 'left');
    label(ctx, ('ISO ' + rec.iso + '  \u00b7  honest to ' + (rec.after < 1 ? rec.after + ' s' : pcTime(rec.after))).toUpperCase(),
          tx, y0 + 42, p.muted, 9, 'left');
    label(ctx, PC_TRUST[rec.trust].toUpperCase(), tx, y0 + 56,
          rec.trust === 'sheet' ? p.muted : p.signal, 9, 'left');
    pcCard.textX = side + 12;
    pcCard.linkY = y0 + 62;
    let y = y0 + Math.max(side, 80) + 14;
    if (rec.note && !tight) {
      wrap(ctx, rec.note.toUpperCase(), x1 - x0, 9).slice(0, 4).forEach((ln, i) => {
        label(ctx, ln, x0, y + i * 13, p.muted, 9, 'left');
      });
      y += Math.min(4, wrap(ctx, rec.note.toUpperCase(), x1 - x0, 9).length) * 13 + 6;
    }
    return y;
  }

  /* The two openings at their true relative area: the meter's aperture and
     the pinhole's. The disc is the focal length over the f-number, so f/168
     against f/16 is a tenth of the width and a hundredth of the light. */
  function drawOpenings(ctx, x0, x1, y0, y1) {
    const midY = (y0 + y1) / 2 - 10;
    const big = Math.max(12, Math.min(56, (x1 - x0) * 0.2, (y1 - y0) * 0.3));
    const small = Math.max(1.2, (big * state.met) / state.n);
    const lx = x0 + big + 4, rxx = x1 - big - 4;
    ctx.save();
    ctx.fillStyle = p.wash;
    ctx.strokeStyle = p.muted;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(lx, midY, big, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = p.signal;
    ctx.beginPath(); ctx.arc(rxx, midY, small, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = p.signal;
    ctx.beginPath(); ctx.arc(rxx, midY, Math.max(small, 3), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    label(ctx, fStop(state.met), lx, midY + big + 18, p.fg, 12, 'center');
    label(ctx, 'THE METER', lx, midY + big + 32, p.muted, 9, 'center');
    label(ctx, fStop(state.n), rxx, midY + big + 18, p.signal, 12, 'center');
    label(ctx, 'YOUR CAMERA', rxx, midY + big + 32, p.muted, 9, 'center');
    line(ctx, lx + big + 10, midY, rxx - Math.max(small, 3) - 10, midY, p.rule2, [4, 4]);
    label(ctx, '×' + Math.round(Math.pow(state.n / state.met, 2)) + ' THE LIGHT',
          (lx + rxx) / 2, midY - 10, p.fg, 10, 'center');
  }

  /* Sixteen metered times down the page, the answers beside them, and each
     row drawn on one time scale: where the arithmetic lands, and how far
     reciprocity pushes the time past it. */
  function drawTable(ctx, left, w, h, factor, film, withFilm) {
    const cols = withFilm
      ? ['Metered at ' + fStop(state.met), 'At ' + fStop(state.n), 'Give']
      : ['Metered at ' + fStop(state.met), 'Give'];
    const tw = w - left - PC_PAD;
    const cx = withFilm ? [0, 0.17, 0.34] : [0, 0.2];
    const sx0 = left + tw * (withFilm ? 0.52 : 0.4), sx1 = left + tw;
    const n = PC_TIMES.length;
    const ty = PC_PAD + 10;
    const rowH = Math.min(34, (h - PC_PAD * 2 - 30) / n);
    const fs = Math.max(9, Math.min(14, rowH - 3));
    cols.forEach((c, i) => label(ctx, c.toUpperCase(), left + cx[i] * tw, ty, p.muted, 9, 'left'));
    line(ctx, left, ty + 8, left + tw, ty + 8, p.rule2);

    /* the scale: a thousandth of a second to ten hours */
    const lo = Math.log(1 / 1000), hi = Math.log(36000);
    const X = (t) => sx0 + ((Math.log(Math.min(36000, Math.max(1 / 1000, t))) - lo) / (hi - lo)) * (sx1 - sx0);
    const yTop = ty + 8, yBot = ty + 8 + rowH * n + 4;
    [[1 / 1000, '1/1000'], [1 / 30, '1/30'], [1, '1 s'], [60, '1 min'], [3600, '1 h'], [36000, '10 h']].forEach((tk, i, all) => {
      const x = X(tk[0]);
      line(ctx, x, yTop, x, yBot, p.rule, [1, 3]);
      label(ctx, tk[1], x, ty, p.muted, 9, i === 0 ? 'left' : i === all.length - 1 ? 'right' : 'center');
    });

    for (let k = 0; k < n; k += 1) {
      const t = PC_TIMES[k];
      const y = ty + 8 + rowH * (k + 0.8);
      const at = t * factor;
      const give = film.fn(at);
      const vals = withFilm ? [pcTime(t), pcTime(at), pcTime(give)] : [pcTime(t), pcTime(at)];
      vals.forEach((v, i) => label(ctx, v, left + cx[i] * tw, y, i === vals.length - 1 ? p.fg : p.muted, fs, 'left'));
      const by = y - 5;
      /* the metered time, a tick; the arithmetic, a line from it; what
         reciprocity adds, the band after it; what to give, the dot */
      line(ctx, X(t), by - 4, X(t), by + 4, p.muted);
      line(ctx, X(t), by, X(at), by, p.rule2, [2, 3]);
      if (X(give) - X(at) > 1) {
        ctx.save();
        ctx.fillStyle = p.band;
        ctx.fillRect(X(at), by - 4, X(give) - X(at), 8);
        ctx.restore();
      }
      ctx.save();
      ctx.fillStyle = p.signal;
      ctx.beginPath(); ctx.arc(X(give), by, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (give > 36000) label(ctx, '▸', sx1 + 4, y, p.signal, 10, 'left');
    }
    label(ctx, (withFilm
      ? 'TICK: METERED  ·  LINE: THE f-NUMBER  ·  BAND: RECIPROCITY  ·  DOT: GIVE'
      : 'TICK: METERED  ·  LINE: THE f-NUMBER  ·  DOT: GIVE'), sx1, yBot + 16, p.muted, 9, 'right');
  }

  /* ---- 3 · Angle of View ---- */

  function sheetAngle(ctx, w, h, rx) {
    const fm = { w: state.fw, h: state.fh };
    const a = (s) => 2 * Math.atan((s / 2) / state.af);
    const diag = Math.hypot(fm.w, fm.h);
    const fy = foot(ctx, w, h, 'angle = 2 · atan(width ÷ 2 ÷ focal length)',
      'A shorter box sees more of the room · a larger film sees more of the room');
    const eq = state.af * (43.27 / diag);
    rows(ctx, h, [
      ['Across · ' + fm.w + ' mm at ' + pcMM(state.af), pcDeg(a(fm.w)), true],
      ['Down · ' + fm.h + ' mm', pcDeg(a(fm.h))],
      ['Corner to corner · ' + Math.round(diag) + ' mm', pcDeg(a(diag))],
      ['The same angle on a 35 mm camera', pcMM(eq) + ' lens'],
    ], fy);
    drawCamera(ctx, rx, w, 20, fy - 10, a(fm.w));
  }

  /* The box in section at true proportion: the depth against the width of
     the film, both by one scale, so a deep box on a small film LOOKS like a
     long lens. The whole thing is centred, cone and box together (S6). */
  function drawCamera(ctx, left, w, top, bottom, ang) {
    const padT = 30, padB = 40;
    const room = w - PC_PAD - left;
    const coneW = Math.max(70, room * 0.3);
    const s = Math.min((room - coneW) / state.af, (bottom - top - padT - padB) / state.fw);
    const hx = left + coneW + Math.max(0, (room - coneW - state.af * s) / 2);
    const px = hx + state.af * s;
    const midY = top + padT + (bottom - top - padT - padB) / 2;
    const half = (state.fw * s) / 2;

    ctx.save();
    ctx.fillStyle = p.inset;
    ctx.fillRect(hx, midY - half, px - hx, half * 2);
    ctx.strokeStyle = p.rule2;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(hx) + 0.5, Math.round(midY - half) + 0.5,
                   Math.round(px - hx), Math.round(half * 2));
    ctx.restore();

    /* the cone inside the box, and the same cone in front of the hole, cut
       short where it would leave the panel */
    line(ctx, hx, midY, px, midY - half, p.fg);
    line(ctx, hx, midY, px, midY + half, p.fg);
    const k = Math.min(coneW / (state.af * s), (midY - top - 12) / half);
    const cw = k * state.af * s;
    line(ctx, hx, midY, hx - cw, midY - half * k, p.muted, [4, 4]);
    line(ctx, hx, midY, hx - cw, midY + half * k, p.muted, [4, 4]);
    label(ctx, 'WHAT IT SEES · ' + pcDeg(ang), hx - cw, midY - half * k - 8, p.signal, 9);

    /* the film, and the hole */
    ctx.save();
    ctx.strokeStyle = p.marker;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(Math.round(px) + 0.5, midY - half);
    ctx.lineTo(Math.round(px) + 0.5, midY + half);
    ctx.stroke();
    ctx.fillStyle = p.signal;
    ctx.beginPath(); ctx.arc(hx, midY, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    label(ctx, 'FILM · ' + state.fw + ' MM', px, midY - half - 8, p.marker, 9, 'right');

    /* the depth is the focal length, so it is drawn on the box */
    const dimY = midY + half + 16;
    line(ctx, hx, dimY, px, dimY, p.muted);
    line(ctx, hx, dimY - 4, hx, dimY + 4, p.muted);
    line(ctx, px, dimY - 4, px, dimY + 4, p.muted);
    label(ctx, 'FOCAL LENGTH · ' + state.af + ' MM', (hx + px) / 2, dimY + 13, p.muted, 9, 'center');
  }

  return { render: view.render };
}

window.mountPinholeCalculator = mountPinholeCalculator;
