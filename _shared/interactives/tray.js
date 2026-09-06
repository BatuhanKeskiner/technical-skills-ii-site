/* ============================================================
   THE DEVELOPING TRAY, AND THE CLOCK THAT RUNS IT
   ------------------------------------------------------------
   A sheet goes into the developer, the image comes up, somebody
   reaches for the light switch, and the tray is carried away.
   That is one sequence and it happens to every print, so it is
   written once here and both instruments run it.

   THE CLOCK HAS FIVE STAGES AND ONE HAND. It was three nested
   callbacks in the test strip, with the tray's own fade tied to
   the room light, so the tray vanished on the instant the light
   arrived - the one moment in the whole thing that is meant to
   be slow.

   AND THE TIMINGS ARE MEASURED, NOT CHOSEN. With an earlier
   reveal the bath had two and three quarter seconds in the
   middle of it in which nothing on the screen changed at all -
   a third of the whole animation, spent watching a still
   picture. The bath is shorter now and the hold is a beat.
   ============================================================ */

const DEV = { in: 1500, dev: 4400, hold: 1000, light: 0, out: 1900 };
const DEV_END = DEV.in + DEV.dev + DEV.hold + DEV.light + DEV.out;

/* WHERE THE BATH IS INSIDE THE ARTWORK, as fractions of it: the wet
   rectangle, not the tray's outside edge, because it is the bath that has to
   hold the sheet. */
const TRAY_BATH = { x: 82 / 980, y: 74 / 740, w: 772 / 980, h: 570 / 740 };

/* ONE HAND ON THE CLOCK. Give it the milliseconds since Develop was pressed
   and it says where everything is: how far up the tray is, how far the image
   has come, and whether the light is on. Nothing here is asynchronous with
   anything else, because there is only one number. */
function devClock(t) {
  const ease = (u) => u * u * (3 - 2 * u);
  const seg = (from, len) => Math.min(1, Math.max(0, (t - from) / len));
  const b = DEV.in, c = b + DEV.dev, d = c + DEV.hold, e = d + DEV.light;
  return {
    tray: ease(seg(0, DEV.in)) * (1 - ease(seg(e, DEV.out))),
    devT: seg(b, DEV.dev),
    light: t >= d ? 1 : 0,          /* a switch, not a ramp */
    done: t >= DEV_END,
  };
}

function trayArt(onload) {
  const art = {};
  ['under', 'over'].forEach((k) => {
    const i = new Image();
    i.onload = () => { art[k] = i; if (onload) onload(k); };
    i.src = '../_shared/interactives/art/tray-' + k + '.svg';
  });
  return art;
}

/* THE SAME TRAY UNDER THE SAFELIGHT. Multiplied red and masked back to its own
   alpha, and kept, because doing it per frame is a canvas per frame. */
const TRAY_REDS = {};
function trayRed(key, img, w, h) {
  const id = key + ':' + Math.round(w) + 'x' + Math.round(h);
  if (TRAY_REDS[id]) return TRAY_REDS[id];
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0, c.width, c.height);
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = 'rgb(150,17,11)';
  g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = 'destination-in';
  g.drawImage(img, 0, 0, c.width, c.height);
  g.globalCompositeOperation = 'source-over';
  TRAY_REDS[id] = c;
  return c;
}

/* THE BATH HOLDS THE SHEET, whatever else it has to overlap. It was clamped
   once so it would not reach the timer, which made the bath narrower than the
   paper and stood the sheet on the tray's own wall. A tray in front of an
   enlarger covers a bit of the enlarger. */
function trayFit(sx, sy, sw, sh) {
  const w = sw / (TRAY_BATH.w * 0.88);
  const h = w * 740 / 980;
  return {
    x: sx + sw / 2 - (TRAY_BATH.x + TRAY_BATH.w / 2) * w,
    y: sy + sh / 2 - (TRAY_BATH.y + TRAY_BATH.h / 2) * h,
    w: w, h: h,
  };
}

/* ONE TRAY, NOT TWO STACKED. The red tray was drawn and the white one laid
   over it at the same alpha - which looks right at full strength and is wrong
   at every other value. Two layers at alpha t leave bg(1-t)^2 + red*t(1-t) +
   white*t, so the red term PEAKS at half strength: the tray went white when
   the light came on and then blushed red again as it faded away. The light is
   a switch, so the tray is one picture or the other, never both. */
function trayDraw(ctx, art, fit, alpha, lit, layer) {
  const img = art[layer];
  if (!img) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(lit ? img : trayRed(layer, img, fit.w, fit.h),
                fit.x, fit.y, fit.w, fit.h);
  ctx.restore();
}

/* THE WHOLE BATH IN ONE CALL, sheet and all. `sheet` is a function that draws
   the print into the rectangle it is given, and where it is called from is the
   point:

   THE PRINT COMES OUT OF THE BATH WHEN THE LIGHT GOES ON. Under the safelight
   it is judged THROUGH the developer, so the tray's near side goes over it.
   Once the light is on it does not: the print went on changing for two seconds
   after the switch, because what was dissolving off it was the liquid, and a
   print that develops in full room light is the one thing that cannot happen. */
function trayScene(ctx, art, sx, sy, sw, sh, alpha, lit, sheet) {
  if (!(alpha > 0.01) || !art.under || !art.over) { sheet(); return; }
  const fit = trayFit(sx, sy, sw, sh);
  trayDraw(ctx, art, fit, alpha, lit, 'under');
  if (!lit) sheet();
  trayDraw(ctx, art, fit, alpha, lit, 'over');
  if (lit) sheet();
  return fit;
}
