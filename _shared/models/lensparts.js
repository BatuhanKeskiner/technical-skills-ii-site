/* ============================================================
   A 50 mm lens, cut in half — week 3.

   ONE THING: the aperture is a ring of blades inside the lens,
   and the f-number is the focal length divided by the width of
   the hole they leave.

   HIS KEYNOTE OF 14-09-2026, slide 19: "Create a proper 50 mm
   lens and aperture cross section. Forget about the beams. Make
   the aperture movable with blades." So: the barrel, six glass
   elements in the double-Gauss arrangement every 50 mm f/1.4 of
   the last seventy years uses, the iris between the two halves,
   the film one focal length behind — and a stepper that closes
   the blades stop by stop. No rays.

   AND OF 16-09-2026, slide 19: "Glass can't collide, make the
   illustration of the elements realistic enough. Center this
   here." So every surface is a real curve with its own sag, each
   element is laid behind the one before it with an air gap that
   is measured at every height, not only on the axis — and the
   drawing, lens and film together, is centred in the stage.
   ============================================================ */

const LP_F = 50;
const LP_LADDER = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];

/* A double-Gauss in six elements, front to back, in millimetres.
   h   half-height of the element
   t   thickness on the axis
   f   sag of the front surface at its rim: + means the rim lies behind
       the vertex (the surface bulges toward the subject)
   b   sag of the back surface at its rim, the same sign rule
   gap the air in front of the element, measured where it is thinnest */
const LP_GLASS = [
  { h: 22, t: 7, f: 4.6, b: 1.4, gap: 0 },        /* front: a positive meniscus */
  { h: 20.5, t: 6, f: 3.8, b: 1.8, gap: 0.8 },    /* second: positive meniscus */
  { h: 19.5, t: 2.4, f: 1.4, b: 5.2, gap: 0.4 },  /* negative meniscus, hollow toward the iris */
  { h: 19.5, t: 2.4, f: -5.2, b: -1.4, gap: 0 },  /* its mirror, hollow toward the iris (gap set by the iris) */
  { h: 20.5, t: 6, f: -1.8, b: -3.8, gap: 0.4 },  /* positive meniscus */
  { h: 21.5, t: 7, f: 0.9, b: -4.2, gap: 0.8 },   /* rear: positive */
];
const LP_IRIS_GAP = 9;         /* air between the two halves, where the blades are */

function modelLensParts(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { i: 0 };
  stepper(controls, {
    label: 'Aperture', ladder: LP_LADDER, value: LP_LADDER[state.i],
    format: (v) => fStop(v),
    onChange: (v, i) => { state.i = i; view.render(); },
  });
  const view = canvas(stage, draw);

  /* the surface as a curve: x at height y, from its vertex x0 and its rim sag */
  const surf = (x0, sag, h, y) => x0 + sag * (y / h) * (y / h);

  /* lay the elements out once, in millimetres from the front vertex */
  const laid = (() => {
    const out = [];
    let prevBack = null;      /* { x0, sag, h } of the surface before */
    LP_GLASS.forEach((g, k) => {
      let x0;
      if (!prevBack) x0 = 0;
      else {
        /* the thinnest air between the previous back surface and this front
           surface, over every height both elements share */
        const hh = Math.min(g.h, prevBack.h);
        let need = -Infinity;
        for (let s = 0; s <= 40; s += 1) {
          const y = hh * s / 40;
          const back = surf(prevBack.x0, prevBack.sag, prevBack.h, y);
          need = Math.max(need, back - (g.f * (y / g.h) * (y / g.h)));
        }
        const gap = k === 3 ? LP_IRIS_GAP : g.gap;
        x0 = need + gap;
      }
      const e = { x0: x0, x1: x0 + g.t, g: g };
      out.push(e);
      prevBack = { x0: e.x1, sag: g.b, h: g.h };
    });
    return out;
  })();
  /* the iris sits in the middle of the air between elements 3 and 4 */
  const irisX = (() => {
    const a = laid[2], b = laid[3];
    const backRim = surf(a.x1, a.g.b, a.g.h, a.g.h * 0.2);
    const frontRim = surf(b.x0, b.g.f, b.g.h, b.g.h * 0.2);
    return (backRim + frontRim) / 2;
  })();
  const lensFront = Math.min(...laid.map((e) => e.x0 + Math.min(0, e.g.f)));
  const lensBack = Math.max(...laid.map((e) => e.x1 + Math.max(0, e.g.b)));

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const N = LP_LADDER[state.i];
    const open = LP_F / N;                                  /* mm */
    const pad = 40;

    /* the whole drawing in millimetres: the barrel from a little in front of
       the first glass to the mount, the film one focal length behind the iris */
    const barrelFront = lensFront - 3, barrelBack = lensBack + 4;
    const filmX = irisX + LP_F;
    /* the drawing now ends at the back of the camera body, not at the film, so
       the body is inside the picture rather than hanging off its right edge */
    const spanMM = (filmX + 38) - (barrelFront - 2);
    /* HIS SECOND ROUND, 16-09-2026, slide 20: "Expand this so things won't get
       squeezed." The height was the binding limit and the section sat small in
       the middle of a wide stage; it now takes the room the stage has. */
    /* and it leaves the foot free for the two measures under the barrel -
       16-09-2026: the opening's name sat on the focal-length line */
    const unit = Math.min((w - pad * 2 - 20) / spanMM, (h - 150) / 52);
    const mm = (v) => v * unit;
    /* CENTRED: the lens and the film together sit in the middle of the stage */
    const drawW = mm(spanMM);
    const ox = (w - drawW) / 2 - mm(barrelFront - 2);
    const X = (v) => ox + mm(v);
    const midY = (h - 80) / 2 + 12;
    const R = 24;                                           /* barrel inner radius, mm: the glass sits inside it */

    /* the barrel: a section through a tube, top and bottom walls, mount behind */
    ctx.save();
    ctx.fillStyle = p.inset;
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1;
    [[-R - 3, 3], [R, 3]].forEach(([y0, th]) => {
      ctx.fillRect(X(barrelFront), midY + mm(y0), mm(barrelBack - barrelFront), mm(th));
      ctx.strokeRect(Math.round(X(barrelFront)) + 0.5, Math.round(midY + mm(y0)) + 0.5,
                     Math.round(mm(barrelBack - barrelFront)), Math.round(mm(th)));
    });
    /* the mount flange */
    ctx.fillRect(X(barrelBack), midY - mm(R + 6), mm(3), mm(9));
    ctx.fillRect(X(barrelBack), midY + mm(R - 3), mm(3), mm(9));
    ctx.restore();

    /* the glass */
    laid.forEach((e) => {
      const g = e.g, hh = mm(g.h);
      ctx.save();
      ctx.beginPath();
      const steps = 24;
      for (let s = 0; s <= steps; s += 1) {
        const y = -g.h + (2 * g.h * s) / steps;
        const x = X(surf(e.x0, g.f, g.h, y));
        if (s === 0) ctx.moveTo(x, midY + mm(y)); else ctx.lineTo(x, midY + mm(y));
      }
      for (let s = steps; s >= 0; s -= 1) {
        const y = -g.h + (2 * g.h * s) / steps;
        ctx.lineTo(X(surf(e.x1, g.b, g.h, y)), midY + mm(y));
      }
      ctx.closePath();
      ctx.fillStyle = p.digital; ctx.globalAlpha = 0.24; ctx.fill();
      ctx.globalAlpha = 0.95; ctx.strokeStyle = p.digital; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
    });

    /* the iris between the two halves: two blades in section, closing to the
       opening the stop leaves; wide open they are back against the barrel */
    const ix = X(irisX);
    const oh = mm(open) / 2;
    const bh = mm(R);
    ctx.save();
    ctx.fillStyle = p.fg;
    ctx.beginPath();
    ctx.moveTo(ix - mm(1.2), midY - bh); ctx.lineTo(ix + mm(1.2), midY - bh);
    ctx.lineTo(ix + mm(0.5), midY - oh); ctx.lineTo(ix - mm(0.5), midY - oh); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ix - mm(1.2), midY + bh); ctx.lineTo(ix + mm(1.2), midY + bh);
    ctx.lineTo(ix + mm(0.5), midY + oh); ctx.lineTo(ix - mm(0.5), midY + oh); ctx.closePath(); ctx.fill();
    ctx.restore();
    line(ctx, ix, midY - oh, ix, midY + oh, p.signal);
    line(ctx, ix - 5, midY - oh, ix + 5, midY - oh, p.signal);
    line(ctx, ix - 5, midY + oh, ix + 5, midY + oh, p.signal);

    /* the film, one focal length behind the iris */
    const fx = X(filmX);
    ctx.save();
    ctx.strokeStyle = p.marker; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.round(fx) + 0.5, midY - mm(12));
    ctx.lineTo(Math.round(fx) + 0.5, midY + mm(12));
    ctx.stroke();
    ctx.restore();
    line(ctx, X(barrelFront) - 20, midY, fx + 20, midY, p.rule2, [2, 5]);

    /* (the three cones of light drawn here on 16-09 are out again, at his word:
       "20. slide'da ışık hüzmelerine ihtiyacımız yok") */

    /* THE CAMERA BEHIND THE LENS. His second round, slide 20: "Draw the outline
       of a camera too" - the lens is a section, and without the body it is not
       obvious that the film plane belongs to a camera the student owns. */
    ctx.save();
    ctx.strokeStyle = p.rule2; ctx.lineWidth = 1.5;
    const bodyF = fx - mm(6), bodyB = fx + mm(34);
    /* the body stays inside the stage: it is a camera drawn behind the film,
       not a second subject competing with the lens */
    /* the hump counts too: measured without it, the body was inside the stage
       and its prism still climbed over the sum in the top corner */
    const bodyH = Math.min(mm(R + 10), midY - 46 - mm(9));
    ctx.beginPath();
    ctx.moveTo(Math.round(bodyF) + 0.5, Math.round(midY - bodyH) + 0.5);
    ctx.lineTo(Math.round(bodyB) + 0.5, Math.round(midY - bodyH) + 0.5);
    ctx.lineTo(Math.round(bodyB) + 0.5, Math.round(midY + bodyH) + 0.5);
    ctx.lineTo(Math.round(bodyF) + 0.5, Math.round(midY + bodyH) + 0.5);
    ctx.stroke();
    /* the prism hump on top, so it reads as a camera and not as a second box */
    ctx.beginPath();
    ctx.moveTo(bodyF + mm(4), midY - bodyH);
    ctx.lineTo(bodyF + mm(10), midY - bodyH - mm(9));
    ctx.lineTo(bodyF + mm(22), midY - bodyH - mm(9));
    ctx.lineTo(bodyF + mm(28), midY - bodyH);
    ctx.stroke();
    ctx.restore();
    /* inside the body, where nothing else is written - the corner it used to
       sit in already carries the f-number */
    label(ctx, 'THE CAMERA', bodyB - 8, midY + bodyH - 10, p.muted, 9, 'right');

    /* the names */
    const topY = midY - mm(R + 3) - 10;
    label(ctx, 'GLASS', X(laid[0].x0) + mm(3), topY, p.digital, 9, 'left');
    label(ctx, 'THE BLADES', ix, topY, p.fg, 9, 'center');
    label(ctx, 'FILM', fx + 8, midY + 4, p.marker, 9, 'left');
    label(ctx, 'THE BARREL', X(barrelBack) - 4, midY + mm(R + 3) + 16, p.muted, 9, 'right');   /* at its far end, clear of the opening's measure */

    /* the two lengths, and the number they make */
    const openTxt = open < 10 ? open.toFixed(1) : String(Math.round(open));
    /* the measure and its word stay inside the stage: at a fixed offset from
       the middle they ran off the foot and "FOCAL LENGTH · 50 MM" was cut in
       half by the edge of the panel */
    const dimY = Math.min(midY + mm(R + 3) + 44, h - 30);
    line(ctx, ix, dimY, fx, dimY, p.muted);
    line(ctx, ix, dimY - 5, ix, dimY + 5, p.muted);
    line(ctx, fx, dimY - 5, fx, dimY + 5, p.muted);
    /* "Make this bigger so we can read" and "this bigger too" - his second
       round, slide 20: the number the page is about, and the length it is
       made of, are the two things to read from the back of the room. */
    label(ctx, 'FOCAL LENGTH · ' + LP_F + ' MM', (ix + fx) / 2, dimY + 18, p.fg, 13, 'center');
    label(ctx, 'OPENING · ' + openTxt + ' MM', ix, midY + mm(R + 3) + 16, p.signal, 12, 'center');
    /* the sum stands on its own: "the number on the barrel" over it said
       nothing the sum does not - his word, 16-09-2026, "manasız ve kaldırılması
       gerekiyor" */
    /* in the free corner under the camera: at the top it shared a line with
       the prism of the body however far the body was moved down */
    label(ctx, fStop(N) + '  =  ' + LP_F + ' MM  ÷  ' + openTxt + ' MM', w - pad, h - 22, p.fg, 19, 'right');
  }

  return { render: view.render };
}

window.modelLensParts = modelLensParts;
